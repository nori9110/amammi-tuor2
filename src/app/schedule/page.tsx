'use client';

import * as React from 'react';
import { ScheduleDate } from '@/components/schedule/ScheduleDate';
import { initialScheduleData } from '@/lib/data';
import { loadScheduleData, saveScheduleData, resetAllScheduleItems, calculateProgress, loadScheduleDataSync } from '@/lib/storage';
import { ScheduleData } from '@/types';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = React.useState<ScheduleData>(initialScheduleData);
  const [progress, setProgress] = React.useState({ completed: 0, total: 0 });

  React.useEffect(() => {
    // APIからデータを読み込む（フォールバックはLocalStorage）
    const loadData = async () => {
      const saved = await loadScheduleData();
      if (saved) {
        // 保存データが古い（項目数が少ない等）場合は初期データに更新
        const savedTotalItems = saved.schedule.reduce((sum, d) => sum + d.items.length, 0);
        const initialTotalItems = initialScheduleData.schedule.reduce((sum, d) => sum + d.items.length, 0);

        // lastUpdated が存在しない or 項目数が少ない場合は上書き保存
        if (!('lastUpdated' in saved) || savedTotalItems < initialTotalItems) {
          await saveScheduleData(initialScheduleData);
          setScheduleData(initialScheduleData);
        } else {
          setScheduleData(saved);
        }
      } else {
        // 初期データを保存
        await saveScheduleData(initialScheduleData);
      }
    };
    loadData();
  }, []);

  React.useEffect(() => {
    // 進捗率を計算
    const prog = calculateProgress(scheduleData);
    setProgress(prog);
  }, [scheduleData]);

  // ポーリングとイベントリスナーを設定
  const lastUpdatedRef = React.useRef<string>(scheduleData.lastUpdated);
  
  React.useEffect(() => {
    // lastUpdatedを最新の値に更新
    lastUpdatedRef.current = scheduleData.lastUpdated;
  }, [scheduleData.lastUpdated]);

  React.useEffect(() => {
    // LocalStorage変更イベント（同タブ内）
    const handleScheduleUpdate = () => {
      const saved = loadScheduleDataSync();
      if (saved) {
        setScheduleData({ ...saved });
      }
    };

    // Storageイベント（他のタブからの変更）
    const handleStorageChange = () => {
      const saved = loadScheduleDataSync();
      if (saved) {
        setScheduleData({ ...saved });
      }
    };

    // ページが表示された時に最新データを取得
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        try {
          const latest = await loadScheduleData();
          if (latest) {
            setScheduleData(latest);
          }
        } catch (error) {
          console.warn('Failed to sync on visibility change:', error);
        }
      }
    };

    // ウィンドウフォーカス時に最新データを取得
    const handleFocus = async () => {
      try {
        const latest = await loadScheduleData();
        if (latest) {
          setScheduleData(latest);
        }
      } catch (error) {
        console.warn('Failed to sync on focus:', error);
      }
    };

    window.addEventListener('schedule-updated', handleScheduleUpdate);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // ポーリングで最新データを取得（5秒ごと）
    const pollInterval = setInterval(async () => {
      try {
        const latest = await loadScheduleData();
        if (latest) {
          // データが変更されているかチェック（lastUpdatedを比較）
          if (latest.lastUpdated !== lastUpdatedRef.current) {
            lastUpdatedRef.current = latest.lastUpdated;
            setScheduleData(latest);
          }
        }
      } catch (error) {
        console.warn('Failed to poll latest data:', error);
      }
    }, 5000); // 5秒ごと

    return () => {
      window.removeEventListener('schedule-updated', handleScheduleUpdate);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(pollInterval);
    };
  }, []); // マウント時のみ設定

  const handleItemChange = async () => {
    // チェック状態が変更されたら再読み込み（同期版を使用して即座に反映）
    const saved = loadScheduleDataSync();
    if (saved) {
      setScheduleData({ ...saved });
    }
    // バックグラウンドでAPIから最新データを取得（他の端末からの更新も含む）
    try {
      const latest = await loadScheduleData();
      if (latest) {
        setScheduleData(latest);
      }
    } catch (error) {
      console.warn('Failed to sync latest data:', error);
    }
  };

  const handleReset = async () => {
    if (confirm('全ての進捗をリセットしますか？')) {
      await resetAllScheduleItems();
      const saved = await loadScheduleData();
      if (saved) {
        setScheduleData(saved);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pastel-800 dark:text-pastel-100">ツアー日程</h1>
        <Button variant="outline" size="sm" onClick={handleReset}>
          全体リセット
        </Button>
      </div>

      {/* 進捗表示 */}
      <div className="bg-gradient-to-br from-pastel-50/90 to-white p-6 rounded-lg shadow-md shadow-pastel-200/20 border border-pastel-300/60 dark:from-pastel-800/90 dark:to-pastel-900/90 dark:shadow-pastel-900/50 dark:border-pastel-500/60">
        <h2 className="text-xl font-semibold mb-4 text-pastel-800 dark:text-pastel-100">進捗状況</h2>
        <Progress value={progress.completed} max={progress.total} />
      </div>

      {/* 日程表示 */}
      <div className="space-y-8">
        {scheduleData.schedule.map((date) => (
          <ScheduleDate
            key={date.date}
            scheduleDate={date}
            onItemChange={handleItemChange}
          />
        ))}
      </div>
    </div>
  );
}
