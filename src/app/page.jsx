'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileEdit,
  ClipboardCheck,
  Star,
  Users,
  Zap,
  Quote,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n';
import { getHomeTopCandidates } from '@/lib/leaderboardApi';

const TAGLINE =
  'Upload or build a professional CV, complete a skill assessment, and get a personal skills dashboard — all in one place, no sign-up required.';

const STATS = [
  { label: 'Candidates placed', value: '12,400+', icon: Users },
  { label: 'Skill categories tracked', value: '6', icon: Star },
  { label: 'Assessment completion rate', value: '94%', icon: Zap },
];

const TESTIMONIALS = [
  { name: 'Layla Hassan', role: 'Frontend Developer', quote: 'Built my CV in minutes and landed 3 interviews the same week.', score: '98% match' },
  { name: 'Omar Al-Sabti', role: 'Data Analyst', quote: 'Uploaded my old CV and the skill report was spot on.', score: '95% match' },
  { name: 'Farah Nasser', role: 'Product Designer', quote: 'The guided builder made my experience look so much more professional.', score: '97% match' },
  { name: 'Yousif Kareem', role: 'Backend Engineer', quote: 'The assessment results helped me negotiate a better offer.', score: '96% match' },
  { name: 'Dana Saleh', role: 'Marketing Specialist', quote: 'Clean CV, fast process, got noticed right away.', score: '94% match' },
  { name: 'Ali Mahmoud', role: 'DevOps Engineer', quote: 'From upload to offer letter in two weeks flat.', score: '99% match' },
  { name: 'Rana Fadel', role: 'UX Researcher', quote: 'Loved how simple the whole flow was, start to finish.', score: '95% match' },
];

const ROTATE_INTERVAL_MS = 90_000;

// Home page cards refresh on this interval per the "top 5" sector cards spec.
const CANDIDATES_REFRESH_MS = 60_000;

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function TypewriterText({ text, className, startDelay = 0, speed = 18, onDone }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, startDelay, speed]);

  useEffect(() => {
    if (count === text.length && text.length > 0) {
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const done = count >= text.length;

  return (
    <p className={className}>
      {text.slice(0, count)}
      {!done && <span className="inline-block w-0.5 h-[1em] align-middle bg-brand ml-0.5 animate-pulse" />}
    </p>
  );
}

function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const slots = [-2, -1, 0, 1, 2].map((offset) => {
    const i = ((index + offset) % TESTIMONIALS.length + TESTIMONIALS.length) % TESTIMONIALS.length;
    return { offset, item: TESTIMONIALS[i] };
  });

  return (
    <div className="flex items-center justify-center gap-4">
      <AnimatePresence mode="popLayout">
        {slots.map(({ offset, item }) => (
          <motion.div
            key={`${index}-${offset}`}
            initial={{ opacity: 0, x: offset > 0 ? 24 : offset < 0 ? -24 : 0, scale: 0.9 }}
            animate={{
              opacity: offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.7 : 0.4,
              x: 0,
              scale: offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.9 : 0.78,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={[
              'w-64 shrink-0 rounded-2xl border p-5 bg-surface',
              offset === 0 ? 'border-brand/40 shadow-lg shadow-black/30 z-20' : 'border-surface-2 z-10',
              Math.abs(offset) === 2 ? 'hidden lg:block' : '',
              Math.abs(offset) === 1 ? 'hidden sm:block' : '',
            ].join(' ')}
          >
            <Quote size={16} className="text-brand mb-2" />
            <p className="text-sm text-warm leading-relaxed mb-4 line-clamp-3">{t(item.quote)}</p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand/15 text-brand text-xs font-semibold flex items-center justify-center shrink-0">
                {initials(item.name)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                <p className="text-[11px] text-silver truncate">{t(item.role)}</p>
              </div>
              <span className="ml-auto text-[10px] font-semibold text-brand shrink-0">{item.score.replace('match', t('match'))}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function StatBubble({ label, value, icon: Icon, delay }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center gap-3 px-6 py-3 sm:px-8"
    >
      <div className="w-9 h-9 rounded-lg bg-brand/15 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-brand" />
      </div>
      <div className="text-left leading-tight">
        <p className="text-base font-bold text-white">{value}</p>
        <p className="text-xs text-silver whitespace-nowrap">{t(label)}</p>
      </div>
    </motion.div>
  );
}

function TopCandidateCard({ candidate, featured, align = 'left', delay }) {
  const { t } = useLanguage();
  const isRight = align === 'right';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, scale: featured ? 1.06 : 1 }}
      transition={{ delay, duration: 0.5, layout: { duration: 0.6, ease: 'easeInOut' } }}
      className={[
        'rounded-2xl border bg-surface/70 min-w-0',
        isRight ? 'text-right' : 'text-left',
        featured
          ? 'border-brand/60 p-5 sm:p-6 shadow-lg shadow-black/30 z-10'
          : 'border-brand/20 p-4 sm:p-5',
      ].join(' ')}
    >
      <p className="text-[10px] sm:text-[11px] uppercase tracking-wide text-brand font-semibold mb-3 truncate">
        {t(candidate.sector)}
      </p>
      <div className={['flex items-center gap-2.5 sm:gap-3', isRight ? 'flex-row-reverse' : ''].join(' ')}>
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand/15 text-brand text-xs sm:text-sm font-semibold flex items-center justify-center shrink-0">
          {candidate.initials}
        </div>
        <div className="min-w-0">
          <p className={['font-semibold text-white truncate', featured ? 'text-base' : 'text-sm'].join(' ')}>
            {candidate.name}
          </p>
          <p className="text-[11px] text-silver">{t('Top match')}</p>
        </div>
      </div>
      <p className={['mt-4 font-bold text-brand', featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'].join(' ')}>
        {candidate.score}%
      </p>
    </motion.div>
  );
}

// How often the featured (center) slot rotates to a different candidate —
// a purely visual shuffle, independent of the 60s backend refetch below.
const CARD_SHUFFLE_MS = 30_000;
const FEATURED_SLOT = 2;

// Below `lg` there isn't room for all 5 cards in a row, so instead of a
// scrollable strip we show a static 3-card deck — center card prominent,
// the previous/next ones peeking at reduced size on either side. No
// scrollbar, no swipe required; the 30s shuffle is what cycles them.
function TopCandidateCarousel({ candidates, index }) {
  const slots = [-1, 0, 1].map((offset) => {
    const i = ((index + offset) % candidates.length + candidates.length) % candidates.length;
    return { offset, candidate: candidates[i] };
  });

  return (
    <div className="lg:hidden overflow-hidden -mx-4 px-4">
      <div className="flex items-center justify-center gap-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {slots.map(({ offset, candidate }) => (
            <motion.div
              key={`${index}-${offset}-${candidate.sector}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: offset === 0 ? 1 : 0.55, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={offset === 0 ? 'w-[58%] shrink-0 z-10' : 'w-[46%] shrink-0'}
            >
              <TopCandidateCard
                candidate={candidate}
                featured={offset === 0}
                align={offset === -1 ? 'right' : 'left'}
                delay={0}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Top-5 sector cards for the home page — refetches every 60s so scores stay
// current as more candidates complete assessments.
function TopCandidateCards() {
  const [candidates, setCandidates] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await getHomeTopCandidates();
      if (!cancelled) setCandidates(data);
    }

    load();
    const id = setInterval(load, CANDIDATES_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (candidates.length === 0) return;
    const id = setInterval(() => {
      setOffset((o) => (o + 1) % candidates.length);
    }, CARD_SHUFFLE_MS);
    return () => clearInterval(id);
  }, [candidates.length]);

  if (candidates.length === 0) return null;

  const ordered = candidates.map((_, i) => candidates[(i + offset) % candidates.length]);

  return (
    <>
      <TopCandidateCarousel candidates={candidates} index={offset} />
      <div className="hidden lg:grid lg:grid-cols-5 gap-4">
        {ordered.map((candidate, i) => (
          <TopCandidateCard
            key={candidate.sector}
            candidate={candidate}
            featured={i === FEATURED_SLOT}
            delay={i * 0.08}
          />
        ))}
      </div>
    </>
  );
}

export default function LandingPage() {
  const [stage, setStage] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1200);
    const t2 = setTimeout(() => setStage(2), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative bg-linear-to-br from-dark via-surface to-surface-2 text-white pt-10 pb-24 sm:pt-14 sm:pb-32 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-dark/30 rounded-full blur-3xl pointer-events-none" />

        <Container maxWidth="lg">
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: 0 }}
              animate={{ opacity: [0, 1, 1], scale: [0.3, 1.35, 1], y: [0, 0, -6] }}
              transition={{ duration: 1.5, times: [0, 0.55, 1], ease: 'easeOut' }}
              className="mb-10 sm:mb-14"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-wide text-brand">
                GOT TALENT
              </h1>
            </motion.div>

            {/*
              Tagline disabled per feedback — left here in case it needs
              to come back.
              <TypewriterText
                text={t(TAGLINE)}
                startDelay={800}
                className="max-w-2xl mx-auto text-lg sm:text-xl text-warm leading-relaxed mb-10 min-h-[3.5em] sm:min-h-[2.5em]"
              />
            */}

            {/*
              Testimonials disabled — not part of the approved home page
              reference layout. Left here in case it needs to come back.
              <div className="rounded-3xl border border-surface-2 bg-surface/60 backdrop-blur-sm px-6 py-10 sm:px-10 mb-12">
                <TestimonialCarousel />
              </div>
            */}

            {stage >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <TopCandidateCards />
              </motion.div>
            )}

            {stage >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-16 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/upload-cv">
                  <Button
                    size="lg"
                    className="bg-brand hover:bg-brand-light text-dark font-semibold border-0 shadow-lg shadow-amber-900/30 w-full sm:w-auto"
                    leftIcon={<Upload size={18} />}
                  >
                    {t('Upload CV')}
                  </Button>
                </Link>
                <Link href="/build-cv">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-brand/40 text-brand hover:bg-brand/10 w-full sm:w-auto"
                    leftIcon={<FileEdit size={18} />}
                  >
                    {t('CV Builder')}
                  </Button>
                </Link>
                <Link href="/assessment">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-stone-500/40 text-warm hover:bg-stone-700/50 w-full sm:w-auto"
                    leftIcon={<ClipboardCheck size={18} />}
                  >
                    {t('Start Assessment')}
                  </Button>
                </Link>
              </motion.div>
            )}

            <div className="inline-flex flex-col sm:flex-row items-center divide-y sm:divide-y-0 sm:divide-x divide-surface-2 border-t border-b border-surface-2">
              {STATS.map((stat, i) => (
                <StatBubble key={stat.label} {...stat} delay={i * 0.15} />
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
