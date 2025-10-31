import { ScheduleData } from '@/types';

const SCHEDULE_STORAGE_KEY = 'amami-schedule';

// スケジュールデータの保存・読み込み
export function saveScheduleData(data: ScheduleData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save schedule data:', error);
  }
}

export function loadScheduleData(): ScheduleData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ScheduleData;
  } catch (error) {
    console.error('Failed to load schedule data:', error);
    return null;
  }
}

export function updateScheduleItemChecked(itemId: string, checked: boolean): void {
  const data = loadScheduleData();
  if (!data) return;

  // 該当アイテムを検索して更新
  for (const date of data.schedule) {
    const item = date.items.find((i) => i.id === itemId);
    if (item) {
      item.checked = checked;
      data.lastUpdated = new Date().toISOString();
      saveScheduleData(data);
      return;
    }
  }
}

export function resetAllScheduleItems(): void {
  const data = loadScheduleData();
  if (!data) return;

  // 全アイテムのcheckedをfalseに
  for (const date of data.schedule) {
    for (const item of date.items) {
      item.checked = false;
    }
  }
  data.lastUpdated = new Date().toISOString();
  saveScheduleData(data);
}

// 進捗率の計算
export function calculateProgress(data: ScheduleData): { completed: number; total: number } {
  let total = 0;
  let completed = 0;

  for (const date of data.schedule) {
    for (const item of date.items) {
      total++;
      if (item.checked) {
        completed++;
      }
    }
  }

  return { completed, total };
}

