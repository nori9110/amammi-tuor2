'use client';

import * as React from 'react';
import { ScheduleDate } from '@/components/schedule/ScheduleDate';
import { initialScheduleData } from '@/lib/data';
import { loadScheduleData, saveScheduleData, resetAllScheduleItems, calculateProgress, loadScheduleDataSync, mergeScheduleData, saveScheduleDataToLocalStorage } from '@/lib/storage';
import { fetchScheduleData } from '@/lib/api-sync';
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
    // 進捗率を計算（scheduleDataが変更されるたびに再計算）
    // シンプルにチェックされた数をカウント
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
    // 自動チェックも実行して反映
    const handleScheduleUpdate = () => {
      const saved = loadScheduleDataSync();
      if (saved) {
        setScheduleData({ ...saved });
      }
    };

    // Storageイベント（他のタブからの変更）
    // 自動チェックも実行して反映
    const handleStorageChange = () => {
      const saved = loadScheduleDataSync();
      if (saved) {
        setScheduleData({ ...saved });
      }
    };

    // ページが表示された時に最新データを取得（loadScheduleDataが既にマージ処理を含んでいる）
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

    // ウィンドウフォーカス時に最新データを取得（loadScheduleDataが既にマージ処理を含んでいる）
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

    // ポーリングで最新データを取得し、自動チェックを実行（1分ごと）
    // 日時が経過していれば自動的にチェックがONになる
    const pollInterval = setInterval(async () => {
      try {
        const latest = await loadScheduleData();
        if (latest) {
          // 自動チェックにより、lastUpdatedが変更されている可能性があるため、常に更新
          if (latest.lastUpdated !== lastUpdatedRef.current) {
            lastUpdatedRef.current = latest.lastUpdated;
          }
          setScheduleData(latest);
        }
      } catch (error) {
        console.warn('Failed to poll latest data:', error);
      }
    }, 60000); // 1分ごと（自動チェックのため）

    return () => {
      window.removeEventListener('schedule-updated', handleScheduleUpdate);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(pollInterval);
    };
  }, []); // マウント時のみ設定

  const handleItemChange = () => {
    // 自動チェック機能のため、手動操作は不要
    // ポーリングとイベントリスナーで自動的に更新される
    // 念のため、自動チェックを実行して反映
    const saved = loadScheduleDataSync();
    if (saved) {
      setScheduleData({ ...saved });
      // 進捗は scheduleData が更新されるので、useEffect で自動的に再計算される
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
