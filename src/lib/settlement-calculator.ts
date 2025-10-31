import { FamilySummary } from './expense-calculator';

export interface Settlement {
  from: 'okabe' | 'ono' | 'imai' | 'ito';
  to: 'okabe' | 'ono' | 'imai' | 'ito';
  amount: number;
}

// 最小転送回数で清算を計算
export function calculateSettlement(summaries: FamilySummary[]): Settlement[] {
  const settlements: Settlement[] = [];

  // 差額をコピーして作業用配列を作成
  const balances = summaries.map((s) => ({
    family: s.family,
    balance: s.difference,
  }));

  // バブルソートで差額をソート（降順）
  balances.sort((a, b) => b.balance - a.balance);

  let leftIndex = 0;
  let rightIndex = balances.length - 1;

  // 最大の受け取り額を持つ家族と最大の支払額を持つ家族をマッチング
  while (leftIndex < rightIndex) {
    const receiver = balances[leftIndex];
    const payer = balances[rightIndex];

    if (receiver.balance <= 0 || payer.balance >= 0) {
      break;
    }

    // 清算額を計算
    const amount = Math.min(receiver.balance, Math.abs(payer.balance));

    if (amount > 0) {
      settlements.push({
        from: payer.family,
        to: receiver.family,
        amount: Math.round(amount), // 1円単位で丸め
      });

      receiver.balance -= amount;
      payer.balance += amount;
    }

    // バランスが0になったら次のインデックスへ
    if (Math.abs(receiver.balance) < 0.01) {
      leftIndex++;
    }
    if (Math.abs(payer.balance) < 0.01) {
      rightIndex--;
    }
  }

  return settlements;
}

