'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { initialScheduleData } from '@/lib/data';
import { loadScheduleData, calculateProgress, resetAllScheduleItems } from '@/lib/storage';

export function ProgressSection() {
  const [progress, setProgress] = React.useState({ completed: 0, total: 0 });

  React.useEffect(() => {
    // LocalStorageからデータを読み込んで進捗を計算
    const saved = loadScheduleData();
    const data = saved || initialScheduleData;
    const prog = calculateProgress(data);
    setProgress(prog);
  }, []);

  // 他のタブでデータが更新された場合の対応
  React.useEffect(() => {
    const handleStorageChange = () => {
      const saved = loadScheduleData();
      if (saved) {
        const prog = calculateProgress(saved);
        setProgress(prog);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleReset = () => {
    if (confirm('全ての進捗をリセットしますか？')) {
      resetAllScheduleItems();
      const saved = loadScheduleData();
      if (saved) {
        const prog = calculateProgress(saved);
        setProgress(prog);
      }
    }
  };

  return (
    <Card id="progress" className="w-full">
      <CardHeader>
        <CardTitle>旅行工程の進捗状況</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress.completed} max={progress.total} />
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={handleReset}>
            全体リセット
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

