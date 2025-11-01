import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { ScheduleData } from '@/types';
import { initialScheduleData } from '@/lib/data';

const SCHEDULE_KEY = 'schedule:main';

// POST: 全チェック状態をリセット
export async function POST() {
  try {
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

    // 全アイテムのcheckedをfalseに
    for (const date of data.schedule) {
      for (const item of date.items) {
        item.checked = false;
      }
    }

    // データを更新
    data.lastUpdated = new Date().toISOString();
    data.version = (data.version || 0) + 1;

    await kv.set(SCHEDULE_KEY, data);

    return NextResponse.json({
      success: true,
      data: {
        resetAt: data.lastUpdated,
      },
    });
  } catch (error) {
    console.error('Failed to reset schedule:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset schedule',
      },
      { status: 500 }
    );
  }
}

