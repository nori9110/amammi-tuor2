import { ScheduleData } from '@/types';
import {
  fetchScheduleData,
  updateScheduleData,
  updateScheduleItemChecked as updateScheduleItemCheckedApi,
  resetAllScheduleItems as resetAllScheduleItemsApi,
  isOnline,
  ApiError,
} from './api-sync';

const SCHEDULE_STORAGE_KEY = 'amami-schedule';
const PENDING_SYNC_KEY = 'amami-schedule-pending-sync';

// LocalStorageの保存（フォールバック用）
function saveScheduleDataToLocalStorage(data: ScheduleData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(data));
    // データ更新を通知（同タブ内での再読込トリガー用）
    try {
      window.dispatchEvent(new CustomEvent('schedule-updated'));
    } catch {}
  } catch (error) {
    console.error('Failed to save schedule data to localStorage:', error);
  }
}

function loadScheduleDataFromLocalStorage(): ScheduleData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ScheduleData;
  } catch (error) {
    console.error('Failed to load schedule data from localStorage:', error);
    return null;
  }
}

// スケジュールデータの保存（API + LocalStorage）
export async function saveScheduleData(data: ScheduleData): Promise<void> {
  // まずLocalStorageに保存（楽観的更新）
  saveScheduleDataToLocalStorage(data);

  // オンラインの場合はAPIに同期
  if (isOnline()) {
    try {
      const syncedData = await updateScheduleData(data);
      if (syncedData) {
        // サーバーから返されたデータで更新（バージョン情報など）
        saveScheduleDataToLocalStorage(syncedData);
      }
    } catch (error) {
      if (error instanceof ApiError && error.code === 'VERSION_CONFLICT') {
        // バージョン競合の場合は、最新データを取得して再試行
        console.warn('Version conflict detected, fetching latest data...');
        const latestData = await loadScheduleData();
        if (latestData) {
          saveScheduleDataToLocalStorage(latestData);
        }
        throw error;
      }
      // その他のエラーはログに記録（オフライン時のフォールバックを維持）
      console.warn('Failed to sync to API, data saved to localStorage only:', error);
    }
  }
}

// スケジュールデータの読み込み（API優先、フォールバックはLocalStorage）
export async function loadScheduleData(): Promise<ScheduleData | null> {
  // オンラインの場合はAPIから取得を試行
  if (isOnline()) {
    try {
      const apiData = await fetchScheduleData();
      if (apiData) {
        // APIから取得できた場合はLocalStorageにも保存
        saveScheduleDataToLocalStorage(apiData);
        return apiData;
      }
    } catch (error) {
      console.warn('Failed to fetch from API, falling back to localStorage:', error);
    }
  }

  // オフラインまたはAPI失敗時はLocalStorageから取得
  return loadScheduleDataFromLocalStorage();
}

// 同期なしでLocalStorageから読み込み（既存のAPI互換性のため）
export function loadScheduleDataSync(): ScheduleData | null {
  return loadScheduleDataFromLocalStorage();
}

export async function updateScheduleItemChecked(
  itemId: string,
  checked: boolean
): Promise<void> {
  // まずLocalStorageを更新（楽観的更新）
  const data = loadScheduleDataFromLocalStorage();
  if (!data) return;

  // 該当アイテムを検索して更新
  for (const date of data.schedule) {
    const item = date.items.find((i) => i.id === itemId);
    if (item) {
      item.checked = checked;
      data.lastUpdated = new Date().toISOString();
      saveScheduleDataToLocalStorage(data);

      // オンラインの場合はAPIに同期
      if (isOnline()) {
        try {
          await updateScheduleItemCheckedApi(itemId, checked);
          // 成功したら最新データを取得（他の端末からの更新も含む）
          const latestData = await fetchScheduleData();
          if (latestData) {
            saveScheduleDataToLocalStorage(latestData);
          }
        } catch (error) {
          console.warn('Failed to sync check status to API:', error);
        }
      }
      return;
    }
  }
}

// 位置情報（緯度・経度）を更新
export async function updateScheduleItemLatLng(
  itemId: string,
  lat: number,
  lng: number
): Promise<void> {
  const data = loadScheduleDataFromLocalStorage();
  if (!data) return;

  for (const date of data.schedule) {
    const item = date.items.find((i) => i.id === itemId);
    if (item && item.location) {
      item.location.lat = lat;
      item.location.lng = lng;
      data.lastUpdated = new Date().toISOString();
      await saveScheduleData(data);
      return;
    }
  }
}

export async function resetAllScheduleItems(): Promise<void> {
  const data = loadScheduleDataFromLocalStorage();
  if (!data) return;

  // 全アイテムのcheckedをfalseに
  for (const date of data.schedule) {
    for (const item of date.items) {
      item.checked = false;
    }
  }
  data.lastUpdated = new Date().toISOString();
  
  // まずLocalStorageに保存
  saveScheduleDataToLocalStorage(data);

  // オンラインの場合はAPIに同期
  if (isOnline()) {
    try {
      await resetAllScheduleItemsApi();
      // 成功したら最新データを取得
      const latestData = await fetchScheduleData();
      if (latestData) {
        saveScheduleDataToLocalStorage(latestData);
      }
    } catch (error) {
      console.warn('Failed to sync reset to API:', error);
    }
  }
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

