'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { initialScheduleData } from '@/lib/data';
import { loadScheduleData, calculateProgress, resetAllScheduleItems, loadScheduleDataSync } from '@/lib/storage';

export function ProgressSection() {
  const [progress, setProgress] = React.useState({ completed: 0, total: 0 });

  React.useEffect(() => {
    // LocalStorageからデータを読み込んで進捗を計算（マージ済みデータを使用）
    const loadData = async () => {
      const saved = await loadScheduleData(); // 既にマージ処理を含んでいる
      const data = saved || initialScheduleData;
      const prog = calculateProgress(data);
      setProgress(prog);
    };
    loadData();
  }, []);

  // 他のタブでデータが更新された場合の対応
  React.useEffect(() => {
    const handleStorageChange = () => {
      const saved = loadScheduleDataSync();
      if (saved) {
        const prog = calculateProgress(saved);
        setProgress(prog);
      }
    };

    const handleScheduleUpdate = () => {
      const saved = loadScheduleDataSync();
      if (saved) {
        const prog = calculateProgress(saved);
        setProgress(prog);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('schedule-updated', handleScheduleUpdate);

    // ページが表示された時に最新データを取得（マージ済み）
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        try {
          const latest = await loadScheduleData(); // 既にマージ処理を含んでいる
          if (latest) {
            const prog = calculateProgress(latest);
            setProgress(prog);
          }
        } catch (error) {
          console.warn('Failed to sync on visibility change:', error);
        }
      }
    };

    // ウィンドウフォーカス時に最新データを取得（マージ済み）
    const handleFocus = async () => {
      try {
        const latest = await loadScheduleData(); // 既にマージ処理を含んでいる
        if (latest) {
          const prog = calculateProgress(latest);
          setProgress(prog);
        }
      } catch (error) {
        console.warn('Failed to sync on focus:', error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    // ポーリングで最新データを取得（5秒ごと、マージ済み）
    const pollInterval = setInterval(async () => {
      try {
        const latest = await loadScheduleData(); // 既にマージ処理を含んでいる
        if (latest) {
          const prog = calculateProgress(latest);
          setProgress(prog);
        }
      } catch (error) {
        console.warn('Failed to poll latest data:', error);
      }
    }, 5000); // 5秒ごと

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('schedule-updated', handleScheduleUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(pollInterval);
    };
  }, []);

  const handleReset = async () => {
    if (confirm('全ての進捗をリセットしますか？')) {
      await resetAllScheduleItems();
      const saved = await loadScheduleData();
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

