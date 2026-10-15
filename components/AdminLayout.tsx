import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.user || data.user.role !== 'ADMIN') {
          router.push('/auth/login');
          return;
        }
      } catch (e) {
        router.push('/auth/login');
        return;
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Checking admin...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <nav className="space-x-3 text-sm">
            <Link href="/admin">Overview</Link>
            <Link href="/admin/games">Games</Link>
            <Link href="/admin/deposits">Deposits</Link>
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/reports">Reports</Link>
            <Link href="/admin/settings">Settings</Link>
          </nav>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
