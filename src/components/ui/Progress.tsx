import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, showLabel = true, ...props }, ref) => {
    // maxが0の場合は0%を表示（0で割ることを防ぐ）
    const percentage = max === 0 ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && (
          <div className="mb-2 flex justify-between text-sm text-pastel-900 dark:text-pastel-50">
            <span>進捗</span>
            <span>{value} / {max}</span>
          </div>
        )}
        <div className="h-2 w-full overflow-hidden rounded-full bg-pastel-200/60 dark:bg-pastel-700/60">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="mt-2 text-right text-sm font-medium text-pastel-900 dark:text-pastel-50">
            {percentage.toFixed(0)}%
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };

