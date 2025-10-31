'use client';

import { RoleCard } from './RoleCard';
import { roles } from '@/lib/data';

export function RolesSection() {
  return (
    <section id="roles" className="space-y-6">
      <h2 className="text-3xl font-bold">係り分担</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>
    </section>
  );
}

