export default function StatCard({ title, value, accent }: { title: string; value: string | number; accent: 'blue' | 'green' | 'purple' | 'amber'; }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    amber: 'bg-amber-100 text-amber-700'
  };

  return (
    <div className="rounded-xl bg-white shadow p-5">
      <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${colors[accent]}`}>{title}</div>
      <div className="mt-4 text-3xl font-bold">{value}</div>
    </div>
  );
}
