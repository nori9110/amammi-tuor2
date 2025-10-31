'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { initialScheduleData } from '@/lib/data';

export function ProgressSection() {
  const [progress, setProgress] = React.useState({ completed: 0, total: 0 });

  React.useEffect(() => {
    // 全項目数を計算
    const total = initialScheduleData.schedule.reduce(
      (acc, date) => acc + date.items.length,
      0
    );
    
    // LocalStorageから完了数を取得（将来的にはAPIから取得）
    const completed = 0; // 暫定値
    
    setProgress({ completed, total });
  }, []);

  const handleReset = () => {
    if (confirm('全ての進捗をリセットしますか？')) {
      // リセット処理（将来的にはAPI呼び出し）
      setProgress({ completed: 0, total: progress.total });
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

