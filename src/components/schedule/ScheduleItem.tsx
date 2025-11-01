'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { WebsiteLink } from './WebsiteLink';
import { ScheduleItem as ScheduleItemType } from '@/types';
import { updateScheduleItemChecked } from '@/lib/storage';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

interface ScheduleItemProps {
  item: ScheduleItemType;
  onCheckedChange?: () => void;
}

export function ScheduleItem({ item, onCheckedChange }: ScheduleItemProps) {
  const handleCheckedChange = async (checked: boolean) => {
    try {
      await updateScheduleItemChecked(item.id, checked);
      if (onCheckedChange) {
        onCheckedChange();
      }
    } catch (error) {
      console.error('Failed to update check status:', error);
      // エラーが発生してもコールバックを呼ぶ（ローカルでは更新済み）
      if (onCheckedChange) {
        onCheckedChange();
      }
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        item.checked
          ? 'bg-pastel-100/60 dark:bg-pastel-800/40 opacity-70'
          : 'bg-gradient-to-br from-pastel-50/80 to-white dark:from-pastel-800/70 dark:to-pastel-900/90 shadow-sm shadow-pastel-200/10 dark:shadow-pastel-900/30'
      } border-pastel-300/60 dark:border-pastel-500/60 hover:border-pastel-300/80 dark:hover:border-pastel-600/80`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Checkbox
            checked={item.checked}
            onChange={(e) => handleCheckedChange(e.target.checked)}
            id={`checkbox-${item.id}`}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-pastel-800 dark:text-pastel-100">
              {item.time}
            </span>
            <span
              className={`text-base ${
                item.checked
                  ? 'line-through text-pastel-800 dark:text-pastel-700'
                  : 'text-pastel-800 dark:text-pastel-200'
              }`}
              dangerouslySetInnerHTML={{ __html: item.activity }}
            />
          </div>

          {item.note && (
            <p className="text-sm text-pastel-800 dark:text-pastel-50 mb-2">
              {item.note}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {item.location && (
              <Link
                href={`/map?location=${item.id}`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
              >
                <MapPin className="h-4 w-4" />
                {item.location.name}
              </Link>
            )}
            {item.website && (
              <>
                <span className="text-pastel-700 dark:text-pastel-800">|</span>
                <WebsiteLink url={item.website} name={item.location.name} />
              </>
            )}
            {!item.website && item.location && (
              <>
                <span className="text-pastel-700 dark:text-pastel-800">|</span>
                <WebsiteLink name={item.location.name} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

