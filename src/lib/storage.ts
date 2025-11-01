import { ScheduleData } from '@/types';

const SCHEDULE_STORAGE_KEY = 'amami-schedule';

// スケジュールデータの保存・読み込み
export function saveScheduleData(data: ScheduleData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(data));
    // データ更新を通知（同タブ内での再読込トリガー用）
    try {
      window.dispatchEvent(new CustomEvent('schedule-updated'));
    } catch {}
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

// 位置情報（緯度・経度）を更新
export function updateScheduleItemLatLng(itemId: string, lat: number, lng: number): void {
  const data = loadScheduleData();
  if (!data) return;

  for (const date of data.schedule) {
    const item = date.items.find((i) => i.id === itemId);
    if (item && item.location) {
      item.location.lat = lat;
      item.location.lng = lng;
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

