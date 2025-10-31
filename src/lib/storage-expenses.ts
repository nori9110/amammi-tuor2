import { ExpenseData, Expense } from '@/types';

const EXPENSES_STORAGE_KEY = 'amami-expenses';

// 費用データの保存・読み込み
export function saveExpenseData(data: ExpenseData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save expense data:', error);
  }
}

export function loadExpenseData(): ExpenseData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ExpenseData;
  } catch (error) {
    console.error('Failed to load expense data:', error);
    return null;
  }
}

export function addExpense(expense: Expense): void {
  const data = loadExpenseData();
  if (!data) {
    const newData: ExpenseData = {
      expenses: [expense],
      lastUpdated: new Date().toISOString(),
      version: 1,
    };
    saveExpenseData(newData);
    return;
  }

  data.expenses.push(expense);
  data.lastUpdated = new Date().toISOString();
  saveExpenseData(data);
}

export function updateExpense(expenseId: string, updates: Partial<Expense>): void {
  const data = loadExpenseData();
  if (!data) return;

  const expense = data.expenses.find((e) => e.id === expenseId);
  if (expense) {
    Object.assign(expense, updates);
    expense.updatedAt = new Date().toISOString();
    data.lastUpdated = new Date().toISOString();
    saveExpenseData(data);
  }
}

export function deleteExpense(expenseId: string): void {
  const data = loadExpenseData();
  if (!data) return;

  data.expenses = data.expenses.filter((e) => e.id !== expenseId);
  data.lastUpdated = new Date().toISOString();
  saveExpenseData(data);
}

