import Link from 'next/link';
import GameCard from '../../components/GameCard';
import games from '../../data/games';

export default function GamesHub({ lang = 'en' as 'en' | 'bn' }) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Games</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((g) => (
          <GameCard key={g.id} game={g} lang={lang} />
        ))}
      </div>
    </main>
  );
}
