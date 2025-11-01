import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { ScheduleData } from '@/types';
import { initialScheduleData } from '@/lib/data';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

const SCHEDULE_KEY = 'schedule:main';

// PUT: チェック状態を更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, checked } = body;

    // バリデーション
    if (typeof itemId !== 'string' || typeof checked !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
        },
        { status: 400 }
      );
    }

    // 現在のデータを取得
    let data = await kv.get<ScheduleData>(SCHEDULE_KEY);
    
    if (!data) {
      // データが存在しない場合は初期データを使用
      data = {
        ...initialScheduleData,
        lastUpdated: new Date().toISOString(),
        version: 1,
      };
    }

    // 該当アイテムを検索して更新
    let found = false;
    for (const date of data.schedule) {
      const item = date.items.find((i) => i.id === itemId);
      if (item) {
        item.checked = checked;
        found = true;
        break;
      }
    }

    if (!found) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found',
        },
        { status: 404 }
      );
    }

    // データを更新
    data.lastUpdated = new Date().toISOString();
    data.version = (data.version || 0) + 1;

    await kv.set(SCHEDULE_KEY, data);

    return NextResponse.json({
      success: true,
      data: {
        itemId,
        checked,
        updatedAt: data.lastUpdated,
      },
    });
  } catch (error) {
    console.error('Failed to update check status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update check status',
      },
      { status: 500 }
    );
  }
}

