import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <nav className="space-x-3 text-sm">
            <Link href="/admin/games">Games</Link>
            <Link href="/admin/deposits">Deposits</Link>
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/config">Config</Link>
          </nav>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
