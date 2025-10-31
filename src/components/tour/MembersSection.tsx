'use client';

import { MemberCard } from './MemberCard';
import { members } from '@/lib/data';

export function MembersSection() {
  // 家族別にグループ化
  const familyGroups = {
    okabe: members.filter((m) => m.family === 'okabe'),
    ono: members.filter((m) => m.family === 'ono'),
    imai: members.filter((m) => m.family === 'imai'),
    ito: members.filter((m) => m.family === 'ito'),
  };

  return (
    <section id="members" className="space-y-6">
      <h2 className="text-3xl font-bold">参加メンバー</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MemberCard family="okabe" members={familyGroups.okabe} />
        <MemberCard family="ono" members={familyGroups.ono} />
        <MemberCard family="imai" members={familyGroups.imai} />
        <MemberCard family="ito" members={familyGroups.ito} />
      </div>
    </section>
  );
}

