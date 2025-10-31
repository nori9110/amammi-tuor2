import { Expense } from '@/types';
import { FamilySummary } from './expense-calculator';
import { Settlement } from './settlement-calculator';

const familyNames = {
  okabe: '岡部',
  ono: '小野',
  imai: '今井',
  ito: '伊藤',
};

// 費用項目一覧をCSV形式に変換
export function exportExpensesToCSV(expenses: Expense[]): string {
  const headers = ['日付', '項目名', '立替者', '計算方式', '金額', '参加者', '集計対象', '備考'];
  const rows = expenses.map((expense) => {
    const payerName = expense.payer === 'local' ? '現地' : familyNames[expense.payer];
    const methodName = {
      fixedPerPerson: '固定単価×人数',
      perFamily: '家族均等',
      perRoom: '部屋按分',
      caretta: 'カレッタ特別',
    }[expense.method];
    const participants = expense.participants.join(', ');
    const checked = expense.checked ? '✓' : '';

    return [
      expense.date,
      expense.title,
      payerName,
      methodName,
      expense.amount.toLocaleString(),
      participants,
      checked,
      expense.note || '',
    ];
  });

  return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
}

// 清算結果をCSV形式に変換
export function exportSettlementToCSV(
  summaries: FamilySummary[],
  settlements: Settlement[]
): string {
  const headers = ['家族', '支払額', '負担額', '差額'];
  const summaryRows = summaries.map((s) => [
    familyNames[s.family],
    s.paid.toLocaleString(),
    s.owed.toLocaleString(),
    s.difference.toLocaleString(),
  ]);

  const settlementHeaders = ['', '清算結果', '', ''];
  const settlementRows = settlements.map((s) => [
    `${familyNames[s.from]} → ${familyNames[s.to]}`,
    `${s.amount.toLocaleString()}円`,
    '',
    '',
  ]);

  const allRows = [
    headers,
    ...summaryRows,
    [],
    settlementHeaders,
    ...settlementRows,
  ];

  return allRows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
}

// CSVファイルをダウンロード
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

