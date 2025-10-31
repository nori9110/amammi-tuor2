'use client';

import * as React from 'react';
import { Expense, ExpenseMethod, Payer } from '@/types';
import { members } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { useForm } from 'react-hook-form';

interface ExpenseFormProps {
  expense?: Expense;
  onSave: (expense: Expense) => void;
  onCancel: () => void;
}

type ExpenseFormData = {
  date: string;
  title: string;
  payer: Payer;
  method: ExpenseMethod;
  amount: number;
  unitPrice?: number;
  rooms?: number;
  participants: string[];
  checked: boolean;
  note?: string;
};

export function ExpenseForm({ expense, onSave, onCancel }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    defaultValues: expense
      ? {
          date: expense.date,
          title: expense.title,
          payer: expense.payer,
          method: expense.method,
          amount: expense.amount,
          unitPrice: expense.unitPrice,
          rooms: expense.rooms,
          participants: expense.participants,
          checked: expense.checked,
          note: expense.note,
        }
      : {
          date: new Date().toISOString().split('T')[0],
          title: '',
          payer: 'okabe',
          method: 'fixedPerPerson',
          amount: 0,
          participants: [],
          checked: true,
        },
  });

  const method = watch('method');
  const participants = watch('participants');

  const onSubmit = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: expense?.id || `expense-${Date.now()}`,
      date: data.date,
      title: data.title,
      payer: data.payer,
      method: data.method,
      amount: data.amount,
      unitPrice: data.method === 'fixedPerPerson' ? data.unitPrice : undefined,
      rooms: data.method === 'perRoom' ? data.rooms : undefined,
      participants: data.participants,
      checked: data.checked,
      note: data.note,
      createdAt: expense?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newExpense);
  };

  const toggleParticipant = (memberId: string) => {
    const current = watch('participants');
    const newParticipants = current.includes(memberId)
      ? current.filter((id) => id !== memberId)
      : [...current, memberId];
    setValue('participants', newParticipants);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{expense ? '費用項目を編集' : '費用項目を追加'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">日付</label>
            <input
              type="date"
              {...register('date', { required: true })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              項目名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('title', { required: true })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.title && <p className="text-red-500 text-sm">項目名は必須です</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">立替者</label>
            <select {...register('payer')} className="w-full px-3 py-2 border rounded-lg">
              <option value="okabe">岡部</option>
              <option value="ono">小野</option>
              <option value="imai">今井</option>
              <option value="ito">伊藤</option>
              <option value="local">現地</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">計算方式</label>
            <select {...register('method')} className="w-full px-3 py-2 border rounded-lg">
              <option value="fixedPerPerson">固定単価×人数</option>
              <option value="perFamily">家族均等</option>
              <option value="perRoom">部屋按分</option>
              <option value="caretta">カレッタ特別</option>
            </select>
          </div>

          {method === 'fixedPerPerson' && (
            <div>
              <label className="block text-sm font-medium mb-1">単価</label>
              <input
                type="number"
                {...register('unitPrice', { valueAsNumber: true })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          )}

          {method === 'perRoom' && (
            <div>
              <label className="block text-sm font-medium mb-1">部屋数</label>
              <input
                type="number"
                {...register('rooms', { valueAsNumber: true })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              {method === 'fixedPerPerson' ? '総額' : '金額'} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('amount', { required: true, valueAsNumber: true, min: 0 })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.amount && <p className="text-red-500 text-sm">金額を入力してください</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">参加者</label>
            <div className="grid grid-cols-2 gap-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={participants.includes(member.id)}
                    onChange={() => toggleParticipant(member.id)}
                    className="h-4 w-4 rounded border-pastel-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <label className="text-sm font-medium text-pastel-900 dark:text-pastel-50 cursor-pointer">
                    {member.name}
                  </label>
                </div>
              ))}
            </div>
            {participants.length === 0 && (
              <p className="text-red-500 text-sm mt-1">参加者を1名以上選択してください</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('checked')}
              className="h-4 w-4 rounded border-pastel-300 text-primary focus:ring-2 focus:ring-primary"
            />
            <label className="text-sm font-medium text-pastel-900 dark:text-pastel-50 cursor-pointer">
              集計対象
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">備考</label>
            <textarea
              {...register('note')}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit" variant="primary">
              {expense ? '更新' : '追加'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

