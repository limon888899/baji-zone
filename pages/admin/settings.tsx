import AdminLayout from '../../components/AdminLayout';

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-slate-500 mt-2">Branding, localization, global game settings, and security options</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Brand Name</label>
          <input value="Baji Zone" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Default Language</label>
          <input value="English / Bangla" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Security Profile</label>
          <textarea className="w-full border rounded p-2 h-28">- 2FA enabled for admin - IP restrictions - audit logs active - session timeout enabled</textarea>
        </div>
      </div>
    </AdminLayout>
  );
}
