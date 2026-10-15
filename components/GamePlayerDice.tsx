import { useState } from 'react';

export default function GamePlayerDice({ lang }: { lang: 'en' | 'bn' }) {
  const [bet, setBet] = useState<number>(10);
  const [balance, setBalance] = useState<number>(1500);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const t = (en: string, bn: string) => (lang === 'bn' ? bn : en);

  async function playServer() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/game/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: bet, gameId: 'g-dice-001' })
      });
      const data = await res.json();
      if (data?.success) {
        const payout = Number(data.payout || 0);
        setBalance((b) => b - bet + payout);
        setMessage(payout > 0 ? t(`You won ${payout}`, `আপনি জিতেছেন ${payout}`) : t('You lost', 'আপনি হেরেছেন'));
      } else {
        setMessage(t('Play failed', 'কাজ হয়নি'));
      }
    } catch (err) {
      console.error(err);
      setMessage(t('Error contacting server', 'সার্ভারের সাথে ত্রুটি'));
    } finally {
      setLoading(false);
    }
  }

  function playLocal() {
    const roll = Math.floor(Math.random() * 6) + 1;
    const win = roll >= 5;
    const multiplier = win ? 2.4 : 0;
    const payout = win ? Math.round(bet * multiplier) : 0;
    setBalance((b) => b - bet + payout);
    setMessage(win ? t(`Rolled ${roll} — You won ${payout}`, `রোল ${roll} — আপনি জিতলেন ${payout}`) : t(`Rolled ${roll} — You lost`, `রোল ${roll} — আপনি হেরেছেন`));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">{t('Balance', 'ব্যালান্স')}</div>
            <div className="text-2xl font-bold">${balance}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500">{t('Bet amount', 'বেট পরিমাণ')}</div>
            <input
              type="number"
              min={1}
              value={bet}
              onChange={(e) => setBet(Number(e.target.value || 0))}
              className="w-28 border rounded p-2"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={playLocal} className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>
          {t('Quick Roll (local)', 'কুইক রোল (লোকাল)')}
        </button>

        <button onClick={playServer} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>
          {loading ? t('Playing...', 'খেলা চলছে...') : t('Play (server)', 'খেলা (সার্ভার)')}
        </button>
      </div>

      {message && <div className="mt-2 p-3 bg-gray-100 rounded">{message}</div>}
    </div>
  );
}
