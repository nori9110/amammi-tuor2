import { ScheduleData } from '@/types';

// APIエンドポイントのベースURL
const API_BASE = '/api';

// APIエラークラス
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 進捗データを取得
export async function fetchScheduleData(): Promise<ScheduleData | null> {
  try {
    const response = await fetch(`${API_BASE}/schedule`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // キャッシュを無効化（常に最新データを取得）
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch schedule data: ${response.statusText}`,
        response.status
      );
    }

    const result = await response.json();
    if (!result.success) {
      throw new ApiError(result.error || 'Failed to fetch schedule data');
    }

    return result.data;
  } catch (error) {
    console.error('Failed to fetch schedule data from API:', error);
    // エラーが発生しても null を返す（LocalStorageフォールバック用）
    return null;
  }
}

// 進捗データを更新
export async function updateScheduleData(data: ScheduleData): Promise<ScheduleData | null> {
  try {
    const response = await fetch(`${API_BASE}/schedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 409) {
        // バージョン競合
        throw new ApiError(
          errorData.error || 'Version conflict',
          response.status,
          'VERSION_CONFLICT'
        );
      }
      throw new ApiError(
        errorData.error || `Failed to update schedule data: ${response.statusText}`,
        response.status
      );
    }

    const result = await response.json();
    if (!result.success) {
      throw new ApiError(result.error || 'Failed to update schedule data');
    }

    return result.data;
  } catch (error) {
    console.error('Failed to update schedule data via API:', error);
    throw error; // エラーを再スロー（呼び出し元で処理）
  }
}

// チェック状態を更新
export async function updateScheduleItemChecked(
  itemId: string,
  checked: boolean
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/schedule/check`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId, checked }),
    });

    if (!response.ok) {
      throw new ApiError(
        `Failed to update check status: ${response.statusText}`,
        response.status
      );
    }

    const result = await response.json();
    if (!result.success) {
      throw new ApiError(result.error || 'Failed to update check status');
    }

    return true;
  } catch (error) {
    console.error('Failed to update check status via API:', error);
    throw error; // エラーを再スロー（呼び出し元で処理）
  }
}

// 全チェック状態をリセット
export async function resetAllScheduleItems(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/schedule/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `Failed to reset schedule: ${response.statusText}`,
        response.status
      );
    }

    const result = await response.json();
    if (!result.success) {
      throw new ApiError(result.error || 'Failed to reset schedule');
    }

    return true;
  } catch (error) {
    console.error('Failed to reset schedule via API:', error);
    throw error; // エラーを再スロー（呼び出し元で処理）
  }
}

// ネットワーク接続状態を確認
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

