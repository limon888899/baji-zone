import AdminLayout from '../../components/AdminLayout';
import { useEffect, useState } from 'react';

export default function AdminConfigPage() {
  const [config, setConfig] = useState<any>({ site: {}, gameDefaults: {}, payment: {} });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/config').then((r) => r.json()).then((data) => setConfig(data.data || data));
  }, []);

  async function save() {
    setSaving(true);
    await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: config })
    });
    setSaving(false);
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">System Config</h2>
        <p className="text-slate-500">Control global app, game defaults, and payment settings.</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <input value={config.site?.name || 'Baji Zone'} onChange={(e) => setConfig({ ...config, site: { ...config.site, name: e.target.value }})} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Supported Languages</label>
          <input value={(config.site?.supportedLang || ['en', 'bn']).join(', ')} onChange={(e) => setConfig({ ...config, site: { ...config.site, supportedLang: e.target.value.split(',').map((v) => v.trim()) }})} className="w-full border rounded p-2" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Bet</label>
            <input type="number" value={config.gameDefaults?.minBet || 10} onChange={(e) => setConfig({ ...config, gameDefaults: { ...config.gameDefaults, minBet: Number(e.target.value) }})} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Bet</label>
            <input type="number" value={config.gameDefaults?.maxBet || 10000} onChange={(e) => setConfig({ ...config, gameDefaults: { ...config.gameDefaults, maxBet: Number(e.target.value) }})} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payout Multiplier</label>
            <input type="number" step="0.1" value={config.gameDefaults?.payoutMultiplier || 2.4} onChange={(e) => setConfig({ ...config, gameDefaults: { ...config.gameDefaults, payoutMultiplier: Number(e.target.value) }})} className="w-full border rounded p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Default Payment Gateway</label>
          <input value={config.payment?.defaultGateway || 'stripe'} onChange={(e) => setConfig({ ...config, payment: { ...config.payment, defaultGateway: e.target.value }})} className="w-full border rounded p-2" />
        </div>

        <button onClick={save} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save config'}</button>
      </div>
    </AdminLayout>
  );
}
