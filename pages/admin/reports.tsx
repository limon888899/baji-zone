import AdminLayout from '../../components/AdminLayout';

export default function AdminReportsPage() {
  const rows = [
    { label: 'Deposit volume', value: '$18,420', trend: '+12.3%' },
    { label: 'Active users', value: '1,284', trend: '+5.8%' },
    { label: 'Games played', value: '8,240', trend: '+9.4%' },
    { label: 'Refund requests', value: '27', trend: '-3.2%' }
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <p className="text-slate-500 mt-2">Player activity, performance overview, and business stats</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {rows.map((row) => (
          <div key={row.label} className="bg-white rounded-xl shadow p-5">
            <div className="text-sm text-slate-500">{row.label}</div>
            <div className="mt-4 text-3xl font-bold">{row.value}</div>
            <div className="mt-2 text-sm font-medium text-emerald-600">{row.trend}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
