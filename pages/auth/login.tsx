import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'লগইন করা যায়নি। ইমেইল ও পাসওয়ার্ড যাচাই করুন।');
        return;
      }
      window.location.href = data.user?.role === 'ADMIN' ? '/admin' : '/games';
    } catch {
      setError('সার্ভারের সঙ্গে যোগাযোগ করা যাচ্ছে না। আবার চেষ্টা করুন।');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[70vh] px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">লগইন করুন</h1>
        <p className="mt-2 text-sm text-slate-600">আপনার Baji Zone অ্যাকাউন্টে প্রবেশ করুন।</p>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">ইমেইল</label>
            <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-600" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">পাসওয়ার্ড</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={128} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-600" />
          </div>
          <button type="submit" disabled={busy} className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{busy ? 'লগইন হচ্ছে…' : 'লগইন'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">নতুন অ্যাকাউন্ট দরকার? <Link href="/auth/register" className="font-semibold text-indigo-700 underline">আইডি খুলুন</Link></p>
      </div>
    </main>
  );
}
