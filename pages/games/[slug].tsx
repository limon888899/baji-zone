import { useRouter } from 'next/router';
import games from '../../data/games';
import GamePlayerDice from '../../components/GamePlayerDice';

export default function GamePage({ lang = 'en' as 'en' | 'bn' }) {
  const router = useRouter();
  const { slug } = router.query;
  const game = games.find((g) => g.slug === slug);

  if (!game) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-24">
        <h2 className="text-2xl font-bold">Game</h2>
        <p className="mt-4">Game not found.</p>
      </main>
    );
  }

  const title = lang === 'bn' ? game.titleBn : game.titleEn;
  const desc = lang === 'bn' ? game.descriptionBn : game.descriptionEn;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-600 mt-2">{desc}</p>

        <div className="mt-6">
          {game.type === 'dice' && <GamePlayerDice lang={lang} />}

          {game.type === 'slots' && (
            <div className="p-6 border rounded">
              <p>Slots game coming soon. Admin can upload slot symbols and control reels via the admin panel.</p>
            </div>
          )}

          {game.type === 'card' && (
            <div className="p-6 border rounded">
              <p>Card Flip coming soon — admin-configurable odds and payouts.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
