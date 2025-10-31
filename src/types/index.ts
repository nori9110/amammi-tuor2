// 日程関連の型定義
export interface Location {
  name: string;
  lat: number;
  lng: number;
  address: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  note?: string;
  checked: boolean;
  location: Location;
  website?: string;
  type: 'sightseeing' | 'restaurant' | 'hotel' | 'activity';
}

export interface ScheduleDate {
  date: string;
  dateLabel: string;
  items: ScheduleItem[];
}

export interface ScheduleData {
  schedule: ScheduleDate[];
  lastUpdated: string;
  version: number;
}

// 割り勘関連の型定義
export type Payer = 'okabe' | 'ono' | 'imai' | 'ito' | 'local';
export type ExpenseMethod =
  | 'fixedPerPerson'
  | 'perFamily'
  | 'perRoom'
  | 'caretta';

export interface Expense {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseData {
  expenses: Expense[];
  lastUpdated: string;
  version: number;
}

// ツアー内容関連の型定義
export interface Member {
  id: string;
  name: string;
  family: 'okabe' | 'ono' | 'imai' | 'ito';
}

export interface Role {
  id: string;
  name: string;
  member: string;
  description: string;
}

