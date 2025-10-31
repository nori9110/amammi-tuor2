'use client';

import * as React from 'react';
import { Expense } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Pencil, Trash2 } from 'lucide-react';
import { updateExpense, deleteExpense as deleteExpenseStorage } from '@/lib/storage-expenses';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onUpdate: () => void;
}

const familyNames = {
  okabe: '岡部',
  ono: '小野',
  imai: '今井',
  ito: '伊藤',
  local: '現地',
};

const methodNames = {
  fixedPerPerson: '固定単価×人数',
  perFamily: '家族均等',
  perRoom: '部屋按分',
  caretta: 'カレッタ特別',
};

export function ExpenseList({ expenses, onEdit, onUpdate }: ExpenseListProps) {
  const handleToggleChecked = (expenseId: string, checked: boolean) => {
    updateExpense(expenseId, { checked });
    onUpdate();
  };

  const handleDelete = (expenseId: string) => {
    if (confirm('この費用項目を削除しますか？')) {
      deleteExpenseStorage(expenseId);
      onUpdate();
    }
  };

  return (
    <div className="space-y-3">
      {expenses.length === 0 ? (
        <p className="text-pastel-800 dark:text-pastel-700 text-center py-8">
          費用項目がありません
        </p>
      ) : (
        expenses.map((expense) => (
          <Card
            key={expense.id}
            className={!expense.checked ? 'opacity-60' : ''}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={expense.checked}
                      onChange={(e) => handleToggleChecked(expense.id, e.target.checked)}
                    />
                    <span className="font-semibold">{expense.title}</span>
                    <span className="text-sm text-pastel-800 dark:text-pastel-700">({expense.date})</span>
                  </div>
                  <div className="text-sm text-pastel-800 dark:text-pastel-700 space-y-1">
                    <p>
                      立替者: {familyNames[expense.payer]} | 方式: {methodNames[expense.method]} |
                      金額: {expense.amount.toLocaleString()}円
                    </p>
                    <p>参加者: {expense.participants.length}名</p>
                    {expense.note && <p>備考: {expense.note}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(expense)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(expense.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

