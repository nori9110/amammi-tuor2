'use client';

import * as React from 'react';
import { ScheduleDate } from '@/components/schedule/ScheduleDate';
import { initialScheduleData } from '@/lib/data';
import { loadScheduleData, saveScheduleData, resetAllScheduleItems, calculateProgress } from '@/lib/storage';
import { ScheduleData } from '@/types';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = React.useState<ScheduleData>(initialScheduleData);
  const [progress, setProgress] = React.useState({ completed: 0, total: 0 });

  React.useEffect(() => {
    // LocalStorageからデータを読み込む
    const saved = loadScheduleData();
    if (saved) {
      // 保存データが古い（項目数が少ない等）場合は初期データに更新
      const savedTotalItems = saved.schedule.reduce((sum, d) => sum + d.items.length, 0);
      const initialTotalItems = initialScheduleData.schedule.reduce((sum, d) => sum + d.items.length, 0);

      // lastUpdated が存在しない or 項目数が少ない場合は上書き保存
      if (!('lastUpdated' in saved) || savedTotalItems < initialTotalItems) {
        saveScheduleData(initialScheduleData);
        setScheduleData(initialScheduleData);
      } else {
        setScheduleData(saved);
      }
    } else {
      // 初期データを保存
      saveScheduleData(initialScheduleData);
    }
  }, []);

  React.useEffect(() => {
    // 進捗率を計算
    const prog = calculateProgress(scheduleData);
    setProgress(prog);
  }, [scheduleData]);

  const handleItemChange = () => {
    // チェック状態が変更されたら再読み込み
    const saved = loadScheduleData();
    if (saved) {
      setScheduleData({ ...saved });
    }
  };

  const handleReset = () => {
    if (confirm('全ての進捗をリセットしますか？')) {
      resetAllScheduleItems();
      const saved = loadScheduleData();
      if (saved) {
        setScheduleData({ ...saved });
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
