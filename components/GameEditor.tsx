import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function GameEditor() {
  const router = useRouter();
  const [game, setGame] = useState<any>({ slug: '', titleEn: '', titleBn: '', type: 'dice', config: {} });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      fetch(`/api/admin/games?id=${id}`).then((r) => r.json()).then((g) => setGame(g));
    }
  }, [router.query]);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/games', {
        method: game.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game)
      });
      const data = await res.json();
      if (data) router.push('/admin/games');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Slug</label>
          <input value={game.slug} onChange={(e) => setGame({ ...game, slug: e.target.value })} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Type</label>
          <select value={game.type} onChange={(e) => setGame({ ...game, type: e.target.value })} className="w-full border p-2 rounded">
            <option value="dice">Dice</option>
            <option value="slots">Slots</option>
            <option value="card">Card</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Title (EN)</label>
          <input value={game.titleEn} onChange={(e) => setGame({ ...game, titleEn: e.target.value })} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Title (BN)</label>
          <input value={game.titleBn} onChange={(e) => setGame({ ...game, titleBn: e.target.value })} className="w-full border p-2 rounded" />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm">Config JSON</label>
        <textarea value={JSON.stringify(game.config || {}, null, 2)} onChange={(e) => { try { setGame({ ...game, config: JSON.parse(e.target.value) }); } catch {}}} className="w-full border p-2 rounded h-40" />
      </div>

      <div className="mt-4">
        <button onClick={save} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}
