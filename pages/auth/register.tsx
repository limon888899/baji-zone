import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (password.length < 8 || password.length > 128) {
      setError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
      return;
    }
    if (password !== confirmPassword) {
      setError('দুটি পাসওয়ার্ড মিলছে না।');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'অ্যাকাউন্ট খোলা যায়নি। আবার চেষ্টা করুন।');
        return;
      }
      window.location.href = '/games';
    } catch {
      setError('সার্ভারের সঙ্গে যোগাযোগ করা যাচ্ছে না। আবার চেষ্টা করুন।');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[70vh] px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">নতুন আইডি খুলুন</h1>
        <p className="mt-2 text-sm text-slate-600">ইমেইল ও পাসওয়ার্ড দিয়ে আপনার অ্যাকাউন্ট তৈরি করুন।</p>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">ইমেইল</label>
            <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-600" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)</label>
            <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-600" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">পাসওয়ার্ড আবার লিখুন</label>
            <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-600" />
          </div>
          <button type="submit" disabled={busy} className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{busy ? 'অ্যাকাউন্ট তৈরি হচ্ছে…' : 'আইডি খুলুন'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">আগে থেকেই অ্যাকাউন্ট আছে? <Link href="/auth/login" className="font-semibold text-indigo-700 underline">লগইন করুন</Link></p>
      </div>
    </main>
  );
}
