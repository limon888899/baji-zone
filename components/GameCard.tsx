import Link from 'next/link';
import { GameDef } from '../data/games';

export default function GameCard({ game, lang }: { game: GameDef; lang: 'en' | 'bn' }) {
  const title = lang === 'bn' ? game.titleBn : game.titleEn;
  const desc = lang === 'bn' ? game.descriptionBn : game.descriptionEn;
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="h-40 w-full bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
        {game.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={game.thumbnail} alt={title} className="object-cover w-full h-full" />
        ) : (
          <div className="text-gray-400">{title}</div>
        )}
      </div>

      <div className="mt-4 flex-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">{desc}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={`/games/${game.slug}`}>
          <a className="px-4 py-2 bg-indigo-600 text-white rounded text-sm">Play</a>
        </Link>
        <Link href={`/admin/games/${game.id}`}>
          <a className="px-4 py-2 border rounded text-sm">Admin</a>
        </Link>
      </div>
    </div>
  );
}
