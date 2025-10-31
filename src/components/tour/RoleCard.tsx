import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Role } from '@/types';

interface RoleCardProps {
  role: Role;
}

export function RoleCard({ role }: RoleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{role.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-pastel-900 dark:text-pastel-50 mb-2">
          担当者: {role.member}
        </p>
        <p className="text-sm text-pastel-800 dark:text-pastel-700">
          {role.description}
        </p>
      </CardContent>
    </Card>
  );
}

