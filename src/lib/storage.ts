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
export function saveScheduleDataToLocalStorage(data: ScheduleData): void {
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

// スケジュールデータの読み込み（API優先、フォールバックはLocalStorage、マージ処理を実行）
export async function loadScheduleData(): Promise<ScheduleData | null> {
  const localData = loadScheduleDataFromLocalStorage();
  
  // オンラインの場合はAPIから取得を試行
  if (isOnline()) {
    try {
      const apiData = await fetchScheduleData();
      if (apiData) {
        // LocalStorageとAPIデータをマージ
        if (localData) {
          const mergedData = mergeScheduleData(localData, apiData);
          saveScheduleDataToLocalStorage(mergedData);
          return mergedData;
        } else {
          // LocalStorageにデータがない場合は、APIデータをそのまま保存
          saveScheduleDataToLocalStorage(apiData);
          return apiData;
        }
      }
    } catch (error) {
      console.warn('Failed to fetch from API, falling back to localStorage:', error);
    }
  }

  // オフラインまたはAPI失敗時はLocalStorageから取得
  return localData;
}

// 同期なしでLocalStorageから読み込み（既存のAPI互換性のため）
export function loadScheduleDataSync(): ScheduleData | null {
  return loadScheduleDataFromLocalStorage();
}

// データマージ関数: 全てのチェック状態を保持する（LocalStorage優先、APIの新規チェックも保持）
export function mergeScheduleData(
  localData: ScheduleData,
  apiData: ScheduleData
): ScheduleData {
  // LocalStorageデータをベースにコピー（ユーザーの最新操作を優先）
  const merged: ScheduleData = {
    ...localData,
    schedule: localData.schedule.map(date => {
      // APIの対応する日付を探す
      const apiDate = apiData.schedule.find(d => d.date === date.date);
      
      return {
        ...date,
        items: date.items.map(localItem => {
          // APIの対応するアイテムを探す
          const apiItem = apiDate?.items.find(i => i.id === localItem.id);
          
          if (apiItem) {
            // 両方のデータがある場合
            // チェック状態の判定:
            // 1. LocalStorageの値を優先（ユーザーの最新操作を反映）
            // 2. ただし、APIでONの場合はONを保持（他の端末からの更新を反映）
            // これにより、全てのチェック状態が確実に保持される
            // 例: LocalStorageでアイテム1がON、APIでアイテム2がONの場合、
            // 両方ともONのまま保持される
            const checkedValue = localItem.checked || apiItem.checked;
            
            // その他の情報（位置情報など）はAPIデータを優先
            return {
              ...localItem,
              checked: checkedValue,
              // APIデータから位置情報などを取得
              location: apiItem.location || localItem.location,
              website: apiItem.website || localItem.website,
              note: apiItem.note || localItem.note,
            };
          }
          
          // APIにアイテムがない場合は、LocalStorageデータをそのまま使用
          return localItem;
        }),
      };
    }),
  };
  
  // APIデータにのみ存在するアイテムも追加（LocalStorageデータにない場合）
  apiData.schedule.forEach(apiDate => {
    const mergedDate = merged.schedule.find(d => d.date === apiDate.date);
    if (mergedDate) {
      apiDate.items.forEach(apiItem => {
        const exists = mergedDate.items.some(item => item.id === apiItem.id);
        if (!exists) {
          // LocalStorageデータに存在しないアイテムを追加
          // これにより、他の端末でチェックされたアイテムも保持される
          mergedDate.items.push(apiItem);
        }
      });
    } else {
      // LocalStorageデータに存在しない日付を追加
      merged.schedule.push(apiDate);
    }
  });
  
  // lastUpdatedはより新しい方を採用
  const localTime = new Date(localData.lastUpdated).getTime();
  const apiTime = new Date(apiData.lastUpdated).getTime();
  merged.lastUpdated = localTime > apiTime ? localData.lastUpdated : apiData.lastUpdated;
  
  return merged;
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
      // チェック状態を更新
      item.checked = checked;
      data.lastUpdated = new Date().toISOString();
      saveScheduleDataToLocalStorage(data);
      
      // データ更新を通知（同タブ内での再読込トリガー用）
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('schedule-updated'));
        }
      } catch {}

      // オンラインの場合はAPIに同期（バックグラウンドで実行）
      if (isOnline()) {
        // API同期を非同期で実行（ユーザー操作をブロックしない）
        (async () => {
          try {
            await updateScheduleItemCheckedApi(itemId, checked);
            // APIに送信後、少し待ってから最新データを取得してマージ
            await new Promise(resolve => setTimeout(resolve, 300)); // 300ms待機
            
            // 現在のLocalStorageデータを再取得
            const currentLocalData = loadScheduleDataFromLocalStorage();
            if (!currentLocalData) return;
            
            // APIから最新データを取得
            const apiData = await fetchScheduleData();
            if (apiData) {
              // LocalStorageとAPIデータをマージ（全てのチェック状態を保持）
              const mergedData = mergeScheduleData(currentLocalData, apiData);
              saveScheduleDataToLocalStorage(mergedData);
              // データ更新を通知
              try {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('schedule-updated'));
                }
              } catch {}
            }
          } catch (error) {
            console.warn('Failed to sync check status to API:', error);
          }
        })();
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

