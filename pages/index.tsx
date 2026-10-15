import Link from 'next/link';

export default function Landing() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
        <div className="text-2xl font-bold">Baji Zone</div>
        <nav className="space-x-4 text-sm">
          <Link href="/games">Games</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/auth/login">Login</Link>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="rounded-2xl bg-white shadow-lg p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold mb-4">Play. Win. Control.</h1>
            <p className="text-slate-600 mb-6">
              Baji Zone is a bilingual gaming portal with full admin control, payment handling, and flexible game configuration.
            </p>

            <div className="flex gap-4">
              <Link href="/games">
                <a className="bg-indigo-600 text-white px-6 py-3 rounded-lg">Play Now</a>
              </Link>
              <Link href="/admin">
                <a className="border border-slate-200 px-6 py-3 rounded-lg">Admin Panel</a>
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Featured Games</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Lucky Dice — fast rounds, configurable odds</li>
              <li>• Classic Slots — reels and symbols (admin config)</li>
              <li>• Card Flip — quick guess game</li>
            </ul>
            <p className="text-xs text-slate-400 mt-4">Admin can configure every part: rules, payouts, deposits, and content (BN/EN).</p>
          </div>
        </div>
      </section>

      <footer className="border-t mt-12">
        <div className="max-w-6xl mx-auto py-6 text-sm text-slate-500">© Baji Zone — Development scaffold</div>
      </footer>
    </main>
  );
}
