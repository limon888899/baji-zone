import Link from 'next/link';

type Props = {
  lang: 'en' | 'bn';
  setLang: (l: 'en' | 'bn') => void;
};

export default function Header({ lang, setLang }: Props) {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 p-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Baji Zone home">
          <img src="/logo.png" alt="" className="h-12 w-12 object-contain" />
          <span className="text-xl font-semibold">Baji Zone</span>
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-end gap-3 text-sm">
          <Link href="/">হোম</Link>
          <Link href="/games">গেমস</Link>
          <Link href="/auth/login" className="rounded-lg border border-slate-300 px-3 py-2">লগইন</Link>
          <Link href="/auth/register" className="rounded-lg bg-indigo-600 px-3 py-2 font-semibold text-white">আইডি খুলুন</Link>
        </nav>
      </div>
    </header>
  );
}
