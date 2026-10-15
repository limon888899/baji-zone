import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminGamesPage() {
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/games').then((r) => r.json()).then(setGames).catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Games</h2>
        <Link href="/admin/games/new"><a className="px-3 py-2 bg-green-600 text-white rounded">New Game</a></Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((g) => (
          <div key={g.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold">{g.titleEn} — <span className="text-sm text-gray-500">{g.slug}</span></div>
                <div className="text-sm text-gray-600">Type: {g.type}</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/games/${g.id}`}><a className="px-3 py-1 border rounded">Edit</a></Link>
                <button onClick={async ()=>{ if(!confirm('Delete?')) return; await fetch(`/api/admin/games?id=${g.id}`,{method:'DELETE'}); setGames(games.filter(x=>x.id!==g.id));}} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
