import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';
import { notices } from '@/lib/data';

export function NoticeSection() {
  return (
    <section id="notices-section" className="space-y-4">
      <Card className="border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            注意事項
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            {notices.map((notice, index) => (
              <li key={index} className="text-pastel-900 dark:text-pastel-50">
                {notice}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

