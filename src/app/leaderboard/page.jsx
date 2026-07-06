'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Select } from '@/components/ui/Select';
import { useLanguage } from '@/lib/i18n';
import { SECTORS, getSectorLeaderboard } from '@/lib/leaderboardApi';

const LEADERBOARD_REFRESH_MS = 60_000;
const TOP_N = 25;

const RANK_STYLES = {
  1: 'bg-brand/20 border-brand text-brand',
  2: 'bg-silver/15 border-silver/40 text-silver',
  3: 'bg-brand-dark/20 border-brand-dark/50 text-brand-light',
};

function RankBadge({ rank }) {
  if (rank <= 3) {
    return (
      <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 ${RANK_STYLES[rank]}`}>
        {rank === 1 ? <Trophy size={16} /> : <Medal size={16} />}
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full border border-surface-2 bg-surface-2 flex items-center justify-center shrink-0 text-sm font-semibold text-silver">
      {rank}
    </div>
  );
}

function LeaderboardRow({ candidate, index }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.6), duration: 0.4 }}
      className="flex items-center gap-3 sm:gap-4 rounded-xl border border-surface-2 bg-surface/70 px-3 sm:px-4 py-3"
    >
      <RankBadge rank={candidate.rank} />
      <div className="w-9 h-9 rounded-full bg-brand/15 text-brand text-xs font-semibold flex items-center justify-center shrink-0">
        {candidate.initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate">{candidate.name}</p>
        <p className="text-[11px] text-silver truncate">{t(candidate.sector)}</p>
      </div>
      <p className="text-base sm:text-lg font-bold text-brand shrink-0">{candidate.score}%</p>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [sector, setSector] = useState(SECTORS[0]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      const data = await getSectorLeaderboard(sector, TOP_N);
      if (!cancelled) {
        setCandidates(data);
        setLoading(false);
      }
    }

    load();
    const id = setInterval(load, LEADERBOARD_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [sector]);

  return (
    <div className="py-12 sm:py-20">
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand mb-5">
            <Trophy size={26} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-warm-light mb-3">{t('Leaderboard')}</h1>
          <p className="text-silver text-lg max-w-lg mx-auto">
            {t('Top 25 candidates ranked by assessment score, per sector.')}
          </p>
        </motion.div>

        <div className="max-w-xs mx-auto mb-8">
          <Select
            label={t('Sector')}
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            options={SECTORS.map((s) => ({ value: s, label: t(s) }))}
          />
        </div>

        <div className="space-y-2">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!loading && candidates.map((candidate, i) => (
            <LeaderboardRow key={candidate.id} candidate={candidate} index={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}
