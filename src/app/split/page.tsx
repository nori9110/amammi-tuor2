'use client';

import * as React from 'react';
import { Expense } from '@/types';
import { FamilyCard } from '@/components/split/FamilyCard';
import { ExpenseForm } from '@/components/split/ExpenseForm';
import { ExpenseList } from '@/components/split/ExpenseList';
import { SettlementResult } from '@/components/split/SettlementResult';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  loadExpenseData,
  saveExpenseData,
  addExpense,
  updateExpense,
  deleteExpense,
} from '@/lib/storage-expenses';
import { calculateFamilySummaries } from '@/lib/expense-calculator';
import { calculateSettlement } from '@/lib/settlement-calculator';
import { exportExpensesToCSV, exportSettlementToCSV, downloadCSV } from '@/lib/csv-export';
import { Plus, Download } from 'lucide-react';

export default function SplitPage() {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = React.useState<Expense | undefined>();
  const [showForm, setShowForm] = React.useState(false);
  const [summaries, setSummaries] = React.useState(
    calculateFamilySummaries([])
  );
  const [settlements, setSettlements] = React.useState(calculateSettlement(summaries));

  React.useEffect(() => {
    // LocalStorageからデータを読み込む
    const saved = loadExpenseData();
    if (saved) {
      setExpenses(saved.expenses);
    } else {
      // 初期データを保存
      saveExpenseData({ expenses: [], lastUpdated: new Date().toISOString(), version: 1 });
    }
  }, []);

  React.useEffect(() => {
    // 計算結果を更新
    const newSummaries = calculateFamilySummaries(expenses);
    setSummaries(newSummaries);
    setSettlements(calculateSettlement(newSummaries));
  }, [expenses]);

  const handleSaveExpense = (expense: Expense) => {
    if (editingExpense) {
      updateExpense(expense.id, expense);
    } else {
      addExpense(expense);
    }
    refreshExpenses();
    setShowForm(false);
    setEditingExpense(undefined);
  };

  const refreshExpenses = () => {
    const saved = loadExpenseData();
    if (saved) {
      setExpenses(saved.expenses);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingExpense(undefined);
  };

  const handleExportCSV = () => {
    const expensesCSV = exportExpensesToCSV(expenses);
    const settlementCSV = exportSettlementToCSV(summaries, settlements);
    const date = new Date().toISOString().split('T')[0];
    const filename = `割り勘_${date}.csv`;
    const combinedCSV = expensesCSV + '\n\n' + settlementCSV;
    downloadCSV(combinedCSV, filename);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">割り勘・立替</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSVエクスポート
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            費用項目を追加
          </Button>
        </div>
      </div>

      {/* 費用項目フォーム */}
      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSave={handleSaveExpense}
          onCancel={handleCancelForm}
        />
      )}

      {/* 家族別サマリー */}
      <div>
        <h2 className="text-2xl font-bold mb-4">家族別サマリー</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summaries.map((summary) => (
            <FamilyCard
              key={summary.family}
              family={summary.family}
              paid={summary.paid}
              owed={summary.owed}
            />
          ))}
        </div>
      </div>

      {/* 清算結果 */}
      <SettlementResult summaries={summaries} settlements={settlements} />

      {/* 費用項目一覧 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">費用項目一覧</h2>
        <ExpenseList
          expenses={expenses}
          onEdit={handleEditExpense}
          onUpdate={refreshExpenses}
        />
      </div>
    </div>
  );
}
