import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { members } from '@/lib/data';

interface FamilyCardProps {
  family: 'okabe' | 'ono' | 'imai' | 'ito';
  paid: number;
  owed: number;
}

const familyNames = {
  okabe: '岡部',
  ono: '小野',
  imai: '今井',
  ito: '伊藤',
};

export function FamilyCard({ family, paid, owed }: FamilyCardProps) {
  const familyName = familyNames[family];
  const familyMembers = members.filter((m) => m.family === family);
  const difference = paid - owed;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{familyName}家族</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {familyMembers.map((member) => (
            <p key={member.id} className="text-sm text-pastel-900 dark:text-pastel-50">
              {member.name}
            </p>
          ))}
          <div className="mt-4 pt-4 border-t border-pastel-300 dark:border-pastel-500">
            <div className="flex justify-between text-sm mb-1">
              <span>支払額:</span>
              <span className="font-medium">{paid.toLocaleString()}円</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>負担額:</span>
              <span className="font-medium">{owed.toLocaleString()}円</span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-pastel-300 dark:border-pastel-500">
              <span>差額:</span>
              <span
                className={difference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
              >
                {difference >= 0 ? '+' : ''}
                {difference.toLocaleString()}円
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

