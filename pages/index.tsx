import Link from 'next/link';
import FeatureCard from '../components/FeatureCard';

const features = [
  { icon: '🎲', title: 'Lucky Dice', description: 'Fast game rounds, configurable odds, instant payout engine and session tracking.' },
  { icon: '🎰', title: 'Slots Engine', description: 'Admin-controlled reels, symbols, and game weighting for all slot variants.' },
  { icon: '🃏', title: 'Card Flip', description: 'Quick-play card games with risk controls, predictions, and custom reward models.' },
  { icon: '💳', title: 'Payments', description: 'Stripe-ready deposit, approval flow, and transaction records with admin adjustments.' },
  { icon: '🧩', title: 'Content Control', description: 'Localized BN / EN content and admin-managed game configuration for faster updates.' },
  { icon: '📊', title: 'Reporting', description: 'User activity, deposit summaries, and revenue statistics through the admin dashboard.' }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight">Baji Zone</div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link href="/games">Games</Link>
            <Link href="/admin">Admin</Link>
            <Link href="/auth/login">Login</Link>
          </nav>
        </div>
      </header>
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 mb-4">Bilingual • Admin Controlled • Secure</div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">Play smarter. Manage everything.</h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">Baji Zone is a gaming portal scaffold with game management, bilingual content, deposits, payout logic, and an admin-first control dashboard.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/games" className="bg-indigo-600 text-white rounded-xl px-5 py-3 font-semibold shadow hover:bg-indigo-700 transition">Play Now</Link>
              <Link href="/admin" className="bg-white text-slate-800 border border-slate-200 rounded-xl px-5 py-3 font-semibold shadow-sm hover:border-slate-300 transition">Admin Panel</Link>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
            <div className="rounded-2xl bg-slate-900 p-5 text-white">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Live Summary</div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-800 p-4"><div className="text-xs text-slate-400">Users</div><div className="text-2xl font-bold mt-2">1.2K</div></div>
                <div className="rounded-xl bg-slate-800 p-4"><div className="text-xs text-slate-400">Revenue</div><div className="text-2xl font-bold mt-2">$24.8K</div></div>
                <div className="rounded-xl bg-slate-800 p-4"><div className="text-xs text-slate-400">Games</div><div className="text-2xl font-bold mt-2">18</div></div>
                <div className="rounded-xl bg-slate-800 p-4"><div className="text-xs text-slate-400">Pending</div><div className="text-2xl font-bold mt-2">412</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((feature) => <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />)}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-700 px-8 py-10 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div><div className="text-sm uppercase tracking-[0.2em] text-indigo-100">Game portal</div><h2 className="text-3xl font-black mt-2">Launch a complete gaming platform experience</h2></div>
            <Link href="/admin" className="bg-white text-indigo-700 px-5 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition">Open Admin</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
