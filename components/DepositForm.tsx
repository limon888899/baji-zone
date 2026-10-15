import { useState } from 'react';

export default function DepositForm({ userId }: { userId?: string }) {
  const [amount, setAmount] = useState<number>(10);
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/stripe/create-checkout-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount, userId }) });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (err) {
      console.error(err);
      alert('Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-3">Deposit</h3>
      <div>
        <label className="block text-sm mb-1">Amount (USD)</label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value || 0))} className="w-40 border rounded p-2" />
      </div>
      <div className="mt-4">
        <button onClick={startCheckout} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? 'Starting...' : 'Deposit with Card (Stripe)'} </button>
      </div>
    </div>
  );
}
