import { Expense, Payer, ExpenseMethod } from '@/types';
import { members } from '@/lib/data';

// 各家族の支払額・負担額を計算
export interface FamilySummary {
  family: 'okabe' | 'ono' | 'imai' | 'ito';
  paid: number; // 支払額（立替額）
  owed: number; // 負担額
  difference: number; // 差額（受け取る/支払う）
}

export function calculateFamilySummaries(expenses: Expense[]): FamilySummary[] {
  const summaries: Record<string, FamilySummary> = {
    okabe: { family: 'okabe', paid: 0, owed: 0, difference: 0 },
    ono: { family: 'ono', paid: 0, owed: 0, difference: 0 },
    imai: { family: 'imai', paid: 0, owed: 0, difference: 0 },
    ito: { family: 'ito', paid: 0, owed: 0, difference: 0 },
  };

  // 集計対象の費用のみ処理
  const checkedExpenses = expenses.filter((e) => e.checked);

  for (const expense of checkedExpenses) {
    // 支払額を集計
    if (expense.payer !== 'local') {
      summaries[expense.payer].paid += expense.amount;
    }

    // 負担額を計算
    const participantFamilies = getFamiliesFromParticipants(expense.participants);
    const familyOwed = calculateFamilyOwed(expense, participantFamilies);

    for (const [family, amount] of Object.entries(familyOwed)) {
      summaries[family as keyof typeof summaries].owed += amount;
    }
  }

  // 差額を計算
  for (const family of Object.keys(summaries)) {
    const summary = summaries[family as keyof typeof summaries];
    summary.difference = summary.paid - summary.owed;
  }

  return Object.values(summaries);
}

// 参加者IDから家族を特定
function getFamiliesFromParticipants(participants: string[]): Record<string, number> {
  const families: Record<string, number> = { okabe: 0, ono: 0, imai: 0, ito: 0 };

  for (const participantId of participants) {
    const member = members.find((m) => m.id === participantId);
    if (member) {
      families[member.family]++;
    }
  }

  return families;
}

// 各家族の負担額を計算
function calculateFamilyOwed(
  expense: Expense,
  participantFamilies: Record<string, number>
): Record<string, number> {
  const result: Record<string, number> = { okabe: 0, ono: 0, imai: 0, ito: 0 };

  switch (expense.method) {
    case 'fixedPerPerson': {
      // 固定単価×人数
      const unitPrice = expense.unitPrice || expense.amount;
      for (const [family, count] of Object.entries(participantFamilies)) {
        result[family as keyof typeof result] = unitPrice * count;
      }
      break;
    }
    case 'perFamily': {
      // 家族均等
      const participantFamilyCount = Object.values(participantFamilies).filter((c) => c > 0).length;
      const perFamily = participantFamilyCount > 0 ? expense.amount / participantFamilyCount : 0;
      for (const [family, count] of Object.entries(participantFamilies)) {
        if (count > 0) {
          result[family as keyof typeof result] = perFamily;
        }
      }
      break;
    }
    case 'perRoom': {
      // 部屋按分
      const rooms = expense.rooms || 1;
      const perRoom = expense.amount / rooms;
      // 各家族の部屋数を計算（1家族=1部屋と仮定）
      for (const [family, count] of Object.entries(participantFamilies)) {
        if (count > 0) {
          result[family as keyof typeof result] = perRoom;
        }
      }
      break;
    }
    case 'caretta': {
      // カレッタ特別: 4,800円×人数
      const participantCount = expense.participants.length;
      const baseAmount = 4800 * participantCount;
      const remainder = expense.amount - baseAmount;

      // 参加者数で均等に分配
      const perPerson = baseAmount / participantCount;
      const remainderPerPerson = remainder / participantCount;

      for (const [family, count] of Object.entries(participantFamilies)) {
        result[family as keyof typeof result] = perPerson * count + remainderPerPerson * count;
      }
      break;
    }
  }

  return result;
}

