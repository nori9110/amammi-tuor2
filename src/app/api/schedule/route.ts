import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { ScheduleData } from '@/types';
import { initialScheduleData } from '@/lib/data';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

const SCHEDULE_KEY = 'schedule:main';

// GET: 進捗データを取得
export async function GET() {
  try {
    // 環境変数のチェック
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.warn('KV環境変数が設定されていません。LocalStorageフォールバックを使用してください。');
      // 環境変数が設定されていない場合でも、初期データを返す
      const initialData: ScheduleData = {
        ...initialScheduleData,
        lastUpdated: new Date().toISOString(),
        version: 1,
      };
      return NextResponse.json({
        success: true,
        data: initialData,
        warning: 'KV環境変数が設定されていません',
      });
    }

    const data = await kv.get<ScheduleData>(SCHEDULE_KEY);
    
    if (!data) {
      // データが存在しない場合は初期データを返す
      const initialData: ScheduleData = {
        ...initialScheduleData,
        lastUpdated: new Date().toISOString(),
        version: 1,
      };
      return NextResponse.json({
        success: true,
        data: initialData,
      });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Failed to fetch schedule data:', error);
    // エラー時も初期データを返す（フォールバック）
    const initialData: ScheduleData = {
      ...initialScheduleData,
      lastUpdated: new Date().toISOString(),
      version: 1,
    };
    return NextResponse.json({
      success: true,
      data: initialData,
      error: 'Failed to fetch from KV, returning initial data',
    });
  }
}

// PUT: 進捗データを更新
export async function PUT(request: NextRequest) {
  try {
    // 環境変数のチェック
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: 'KV環境変数が設定されていません。Vercelダッシュボードで環境変数を設定してください。',
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { schedule, lastUpdated, version } = body as ScheduleData;

    // バリデーション
    if (!schedule || !Array.isArray(schedule)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid schedule data',
        },
        { status: 400 }
      );
    }

    // 楽観的ロック（バージョンチェック）
    const currentData = await kv.get<ScheduleData>(SCHEDULE_KEY);
    if (currentData && currentData.version && version && currentData.version > version) {
      return NextResponse.json(
        {
          success: false,
          error: 'Version conflict. Please refresh and try again.',
          currentVersion: currentData.version,
        },
        { status: 409 }
      );
    }

    const updatedData: ScheduleData = {
      schedule,
      lastUpdated: new Date().toISOString(),
      version: (currentData?.version || 0) + 1,
    };

    await kv.set(SCHEDULE_KEY, updatedData);

    return NextResponse.json({
      success: true,
      data: updatedData,
    });
  } catch (error) {
    console.error('Failed to update schedule data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update schedule data',
      },
      { status: 500 }
    );
  }
}

