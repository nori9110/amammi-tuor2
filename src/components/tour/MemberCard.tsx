import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Member } from '@/types';

interface MemberCardProps {
  family: 'okabe' | 'ono' | 'imai' | 'ito';
  members: Member[];
}

const familyNames = {
  okabe: '岡部',
  ono: '小野',
  imai: '今井',
  ito: '伊藤',
};

export function MemberCard({ family, members }: MemberCardProps) {
  const familyName = familyNames[family];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{familyName}家族</h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {members.map((member) => (
            <li key={member.id} className="text-pastel-900 dark:text-pastel-50">
              {member.name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
