'use client';

import * as React from 'react';
import { ScheduleDate } from '@/components/schedule/ScheduleDate';
import { initialScheduleData } from '@/lib/data';
import { loadScheduleDataSync, saveScheduleDataToLocalStorage } from '@/lib/storage';
import { ScheduleData } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Info } from 'lucide-react';

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = React.useState<ScheduleData>(initialScheduleData);

  React.useEffect(() => {
    // LocalStorageからデータを読み込む（各ブラウザで個別に保存されたチェック状態）
    const loadData = () => {
      const saved = loadScheduleDataSync();
    if (saved) {
        // 保存データが古い（項目数が少ない等）場合は初期データとマージ
      const savedTotalItems = saved.schedule.reduce((sum, d) => sum + d.items.length, 0);
      const initialTotalItems = initialScheduleData.schedule.reduce((sum, d) => sum + d.items.length, 0);

      if (!('lastUpdated' in saved) || savedTotalItems < initialTotalItems) {
          // 初期データを使用（チェック状態は初期化）
        setScheduleData(initialScheduleData);
          saveScheduleDataToLocalStorage(initialScheduleData);
      } else {
        setScheduleData(saved);
      }
    } else {
      // 初期データを保存
        setScheduleData(initialScheduleData);
        saveScheduleDataToLocalStorage(initialScheduleData);
    }
    };
    loadData();
  }, []);

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

    window.addEventListener('schedule-updated', handleScheduleUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('schedule-updated', handleScheduleUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleItemChange = () => {
    // チェック状態が変更されたらLocalStorageから読み込んで反映
    const saved = loadScheduleDataSync();
    if (saved) {
      setScheduleData({ ...saved });
    }
  };

  const handleReset = () => {
    if (confirm('全てのチェックをリセットしますか？')) {
      const data = loadScheduleDataSync();
      if (data) {
        // 全アイテムのcheckedをfalseに
        for (const date of data.schedule) {
          for (const item of date.items) {
            item.checked = false;
          }
        }
        data.lastUpdated = new Date().toISOString();
        saveScheduleDataToLocalStorage(data);
        setScheduleData({ ...data });
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

      {/* チェックボックスの利用方法 */}
      <Card className="border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                チェックボックスの利用方法
              </p>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p>
                  WEBページのツアー日程のチェックボックスは個人での利用となるので、利用者間で共有はできていませんので、自身のメモとして利用してください。
                </p>
                <p>
                  チェック状態を戻す場合は、ツアー日程の「全体リセット」をクリックすれば全て解除されます。
                </p>
                <p>
                  個別でチェックを外すことも可能です。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
