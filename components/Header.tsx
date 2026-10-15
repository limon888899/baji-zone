import Link from 'next/link';

type Props = {
  lang: 'en' | 'bn';
  setLang: (l: 'en' | 'bn') => void;
};

export default function Header({ lang, setLang }: Props) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
        <div className="text-xl font-semibold">Baji Zone</div>
        <nav className="space-x-4 text-sm">
          <Link href="/">Home</Link>
          <Link href="/games">Games</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
