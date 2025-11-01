"use client";

import * as React from 'react';
import { loadScheduleData } from '@/lib/storage';

export default function ExportPage() {
  const [rawJson, setRawJson] = React.useState<string>('');
  const [initialDataSnippet, setInitialDataSnippet] = React.useState<string>('');

  React.useEffect(() => {
    const data = loadScheduleData();
    if (data) {
      const json = JSON.stringify(data, null, 2);
      setRawJson(json);

      const snippet = `export const initialScheduleData: ScheduleData = ${JSON.stringify(
        {
          schedule: data.schedule,
          lastUpdated: new Date().toISOString(),
          version: data.version ?? 1,
        },
        null,
        2
      )};`;
      setInitialDataSnippet(snippet);
    } else {
      setRawJson('// localStorage にスケジュールがありません。ページを一度操作して保存してください。');
      setInitialDataSnippet('// 同上');
    }
  }, []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('コピーしました');
    } catch {
      alert('コピーに失敗しました');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Export Saved Schedule</h1>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">保存データ（そのままJSON）</h2>
          <button className="px-3 py-1 rounded bg-pastel-600 text-white" onClick={() => copy(rawJson)}>コピー</button>
        </div>
        <textarea className="w-full h-64 p-3 border rounded font-mono text-sm" readOnly value={rawJson} />
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">data.ts の initialScheduleData 用スニペット</h2>
          <button className="px-3 py-1 rounded bg-pastel-600 text-white" onClick={() => copy(initialDataSnippet)}>コピー</button>
        </div>
        <textarea className="w-full h-64 p-3 border rounded font-mono text-sm" readOnly value={initialDataSnippet} />
        <p className="text-sm text-pastel-700">貼り付け先: <code>src/lib/data.ts</code> の <code>initialScheduleData</code></p>
      </section>
    </div>
  );
}





