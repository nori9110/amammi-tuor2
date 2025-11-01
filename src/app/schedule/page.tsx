'use client';

import * as React from 'react';
import { ScheduleDate } from '@/components/schedule/ScheduleDate';
import { initialScheduleData } from '@/lib/data';
import { saveScheduleDataToLocalStorage } from '@/lib/storage';
import { ScheduleData } from '@/types';

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = React.useState<ScheduleData>(initialScheduleData);

  React.useEffect(() => {
    // 初期データを使用（全てのチェックはfalse）
    // チェックボックスは削除されているため、チェック状態は使用されません
    const data: ScheduleData = {
      ...initialScheduleData,
      schedule: initialScheduleData.schedule.map(date => ({
        ...date,
        items: date.items.map(item => ({
          ...item,
          checked: false, // 全てのチェックをfalseにリセット
        })),
      })),
    };
    setScheduleData(data);
    saveScheduleDataToLocalStorage(data);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pastel-800 dark:text-pastel-100">ツアー日程</h1>
      </div>

      {/* 日程表示 */}
      <div className="space-y-8">
        {scheduleData.schedule.map((date) => (
          <ScheduleDate
            key={date.date}
            scheduleDate={date}
          />
        ))}
      </div>
    </div>
  );
}
