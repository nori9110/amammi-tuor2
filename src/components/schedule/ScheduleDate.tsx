'use client';

import { ScheduleItem } from './ScheduleItem';
import { ScheduleDate as ScheduleDateType } from '@/types';

interface ScheduleDateProps {
  scheduleDate: ScheduleDateType;
  onItemChange?: () => void;
}

export function ScheduleDate({ scheduleDate, onItemChange }: ScheduleDateProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-pastel-800 dark:text-pastel-100 sticky top-16 bg-gradient-to-r from-pastel-50/95 to-pastel-100/95 backdrop-blur-sm dark:from-pastel-900/95 dark:to-pastel-800/95 py-2 z-10 border-b border-pastel-300/50 dark:border-pastel-500/50">
        {scheduleDate.dateLabel}
      </h2>
      <div className="space-y-3">
        {scheduleDate.items.map((item) => (
          <ScheduleItem
            key={item.id}
            item={item}
            onCheckedChange={onItemChange}
          />
        ))}
        {scheduleDate.items.length === 0 && (
          <p className="text-pastel-800 dark:text-pastel-700 text-sm">予定なし</p>
        )}
      </div>
    </div>
  );
}

