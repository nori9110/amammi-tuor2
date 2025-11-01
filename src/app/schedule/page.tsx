'use client';

import * as React from 'react';
import { ScheduleDate } from '@/components/schedule/ScheduleDate';
import { initialScheduleData } from '@/lib/data';
import { loadScheduleDataSync, saveScheduleDataToLocalStorage, autoCheckScheduleItems } from '@/lib/storage';
import { ScheduleData } from '@/types';
import { Button } from '@/components/ui/Button';

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = React.useState<ScheduleData>(initialScheduleData);

  React.useEffect(() => {
    // LocalStorageから個人用のチェック状態を読み込む
    // 自動チェックも実行（日時が経過していれば自動的にON）
    const loadData = () => {
      const saved = loadScheduleDataSync();
      if (saved) {
        // 保存データが古い（項目数が少ない等）場合は初期データとマージ
        const savedTotalItems = saved.schedule.reduce((sum, d) => sum + d.items.length, 0);
        const initialTotalItems = initialScheduleData.schedule.reduce((sum, d) => sum + d.items.length, 0);

        if (!('lastUpdated' in saved) || savedTotalItems < initialTotalItems) {
          // 初期データを使用して自動チェックを実行
          const autoChecked = autoCheckScheduleItems(initialScheduleData);
          setScheduleData(autoChecked);
          saveScheduleDataToLocalStorage(autoChecked);
        } else {
          // 自動チェック済みのデータを使用
          setScheduleData(saved);
        }
      } else {
        // 初期データを保存して自動チェックを実行
        const autoChecked = autoCheckScheduleItems(initialScheduleData);
        setScheduleData(autoChecked);
        saveScheduleDataToLocalStorage(autoChecked);
      }
    };
    loadData();
  }, []);

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

    window.addEventListener('schedule-updated', handleScheduleUpdate);
    window.addEventListener('storage', handleStorageChange);

    // ポーリングで自動チェックを実行（1分ごと）
    // 日時が経過していれば自動的にチェックがONになる
    const pollInterval = setInterval(() => {
      const saved = loadScheduleDataSync();
      if (saved) {
        setScheduleData(saved);
      }
    }, 60000); // 1分ごと

    return () => {
      window.removeEventListener('schedule-updated', handleScheduleUpdate);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, []); // マウント時のみ設定

  const handleItemChange = () => {
    // チェック状態が変更されたらLocalStorageから読み込んで反映
    const saved = loadScheduleDataSync();
    if (saved) {
      setScheduleData({ ...saved });
    }
  };

  const handleReset = () => {
    if (confirm('全てのチェックをリセットしますか？\n（時間が経過した項目は自動的に再チェックされます）')) {
      const data = loadScheduleDataSync();
      if (data) {
        // 全アイテムのcheckedをfalseに
        for (const date of data.schedule) {
          for (const item of date.items) {
            item.checked = false;
          }
        }
        data.lastUpdated = new Date().toISOString();
        // リセット後、自動チェックを実行
        const autoChecked = autoCheckScheduleItems(data);
        saveScheduleDataToLocalStorage(autoChecked);
        setScheduleData(autoChecked);
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
