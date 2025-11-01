'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { initialScheduleData } from '@/lib/data';
import { loadScheduleDataSync, calculateProgress, resetAllScheduleItems } from '@/lib/storage';

export function ProgressSection() {
  const [progress, setProgress] = React.useState({ completed: 0, total: 0 });

  React.useEffect(() => {
    // LocalStorageからデータを読み込んで進捗を計算（各ブラウザで個別に保存されたデータ）
    const loadData = () => {
      try {
        const saved = loadScheduleDataSync();
        const data = saved || initialScheduleData;
        const prog = calculateProgress(data);
        // 進捗データが正しく計算されていることを確認
        if (prog.total > 0 || prog.completed === 0) {
          setProgress(prog);
        } else {
          // フォールバック: 初期データで進捗を計算
          const fallbackProg = calculateProgress(initialScheduleData);
          setProgress(fallbackProg);
        }
      } catch (error) {
        console.error('Failed to load schedule data:', error);
        // エラー時は初期データで進捗を計算
        const prog = calculateProgress(initialScheduleData);
        setProgress(prog);
      }
    };
    loadData();
  }, []);

  // 他のタブでデータが更新された場合の対応
  React.useEffect(() => {
    const handleStorageChange = () => {
      const saved = loadScheduleDataSync();
      if (saved) {
        const prog = calculateProgress(saved);
        if (prog.total > 0 || prog.completed === 0) {
          setProgress(prog);
        }
      } else {
        // LocalStorageにデータがない場合は初期データを使用
        const prog = calculateProgress(initialScheduleData);
        setProgress(prog);
      }
    };

    const handleScheduleUpdate = () => {
      const saved = loadScheduleDataSync();
      if (saved) {
        const prog = calculateProgress(saved);
        if (prog.total > 0 || prog.completed === 0) {
          setProgress(prog);
        }
      } else {
        // LocalStorageにデータがない場合は初期データを使用
        const prog = calculateProgress(initialScheduleData);
        setProgress(prog);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('schedule-updated', handleScheduleUpdate);

    // ページが表示された時に最新データを取得（LocalStorageから）
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        try {
          const latest = loadScheduleDataSync();
          const data = latest || initialScheduleData;
          const prog = calculateProgress(data);
          if (prog.total > 0 || prog.completed === 0) {
            setProgress(prog);
          }
        } catch (error) {
          console.warn('Failed to sync on visibility change:', error);
          // エラー時は初期データを使用
          const prog = calculateProgress(initialScheduleData);
          setProgress(prog);
        }
      }
    };

    // ウィンドウフォーカス時に最新データを取得（LocalStorageから）
    const handleFocus = () => {
      try {
        const latest = loadScheduleDataSync();
        const data = latest || initialScheduleData;
        const prog = calculateProgress(data);
        if (prog.total > 0 || prog.completed === 0) {
          setProgress(prog);
        }
      } catch (error) {
        console.warn('Failed to sync on focus:', error);
        // エラー時は初期データを使用
        const prog = calculateProgress(initialScheduleData);
        setProgress(prog);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    // ポーリングで最新データを取得（5秒ごと、LocalStorageから）
    const pollInterval = setInterval(() => {
      try {
        const latest = loadScheduleDataSync();
        const data = latest || initialScheduleData;
        const prog = calculateProgress(data);
        if (prog.total > 0 || prog.completed === 0) {
          setProgress(prog);
        }
      } catch (error) {
        console.warn('Failed to poll latest data:', error);
        // エラー時は初期データを使用
        const prog = calculateProgress(initialScheduleData);
        setProgress(prog);
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
      try {
        await resetAllScheduleItems();
        const saved = loadScheduleDataSync();
        const data = saved || initialScheduleData;
        const prog = calculateProgress(data);
        if (prog.total > 0 || prog.completed === 0) {
          setProgress(prog);
        }
      } catch (error) {
        console.error('Failed to reset schedule items:', error);
        // エラー時も初期データで進捗を更新
        const prog = calculateProgress(initialScheduleData);
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

