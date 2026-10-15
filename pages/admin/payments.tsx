import AdminLayout from '../../components/AdminLayout';

export default function AdminPaymentsPage() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Payments</h2>
        <p className="text-slate-500 mt-2">Deposit approvals, payout control, and gateway configuration</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-bold text-lg mb-4">Gateway Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Default Gateway</label>
              <input value="Stripe" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Sandbox Mode</label>
              <input value="Enabled" className="w-full border rounded p-2" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-bold text-lg mb-4">Approval Queue</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span>user_101</span>
              <span>$250</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>user_112</span>
              <span>$100</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>user_143</span>
              <span>$500</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
