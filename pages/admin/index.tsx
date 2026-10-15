import AdminLayout from '../../components/AdminLayout';
import { useEffect, useState } from 'react';
import StatCard from '../../components/StatCard';

export default function AdminHome() {
  const [stats, setStats] = useState({ users: 0, deposits: 0, revenue: 0, games: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/overview')
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-slate-500 mt-2">System overview and controls</p>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Users" value={stats.users} accent="blue" />
          <StatCard title="Deposits" value={stats.deposits} accent="green" />
          <StatCard title="Revenue" value={`$${stats.revenue}`} accent="purple" />
          <StatCard title="Games" value={stats.games} accent="amber" />
        </div>
      )}
    </AdminLayout>
  );
}
