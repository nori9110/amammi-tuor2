import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FamilySummary } from '@/lib/expense-calculator';
import { Settlement } from '@/lib/settlement-calculator';

interface SettlementResultProps {
  summaries: FamilySummary[];
  settlements: Settlement[];
}

const familyNames = {
  okabe: '岡部',
  ono: '小野',
  imai: '今井',
  ito: '伊藤',
};

export function SettlementResult({ summaries, settlements }: SettlementResultProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>清算結果</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">各家族の支払額・負担額</h3>
            <div className="space-y-2">
              {summaries.map((summary) => (
                <div key={summary.family} className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">{familyNames[summary.family]}家族</span>
                  <div className="flex gap-4 text-sm">
                    <span>支払: {summary.paid.toLocaleString()}円</span>
                    <span>負担: {summary.owed.toLocaleString()}円</span>
                    <span
                      className={
                        summary.difference >= 0
                          ? 'text-green-600 dark:text-green-400 font-semibold'
                          : 'text-red-600 dark:text-red-400 font-semibold'
                      }
                    >
                      {summary.difference >= 0 ? '+' : ''}
                      {summary.difference.toLocaleString()}円
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {settlements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">清算</h3>
              <div className="space-y-2">
                {settlements.map((settlement, index) => (
                  <div key={index} className="py-2 border-b">
                    <span className="font-medium">
                      {familyNames[settlement.from]} → {familyNames[settlement.to]}
                    </span>
                    <span className="ml-4 font-semibold text-primary">
                      {settlement.amount.toLocaleString()}円
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

