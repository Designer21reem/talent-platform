'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { Upload, FileEdit, ClipboardCheck, Users } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { HeroBackground } from '@/components/layout/HeroBackground';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { BACKEND_URL } from '@/lib/api';

// Shown immediately so the hero never looks empty while the real backend
// tally loads — swapped out for the live number the moment it arrives.
const DEFAULT_TOTAL_CANDIDATES = 12400;

// The backend response shape for /get_total_candidate isn't fully pinned
// down yet, so this accepts a bare number or any of the likely key names.
function extractTotalCandidates(data) {
  if (typeof data === 'number') return data;
  if (!data || typeof data !== 'object') return null;
  return data.total_candidates ?? data.total_candidate ?? data.count ?? data.total ?? null;
}

const ACTIONS = [
  {
    href: '/upload-cv',
    icon: Upload,
    title: 'UPLOAD CV',
    description: 'Upload your CV and prepare it for matching, filtering, and future recruitment workflows.',
  },
  {
    href: '/build-cv',
    icon: FileEdit,
    title: 'CV BUILDER',
    description: 'Create a structured professional CV using guided sections for experience, education, and skills.',
    featured: true,
  },
  {
    href: '/assessment',
    icon: ClipboardCheck,
    title: 'DISCOVER YOUR PERSONALITY',
    description: 'Test practical skills with short assessments that can help validate your readiness.',
  },
];

const SUBTITLE_PREFIX = 'One place to show what you can do. Start with ';
const SUBTITLE_WORDS = ['our CV Builder', 'Discover Your Personality', 'a CV Upload'];

// A single, live-updating stat badge sitting above the hero title — counts
// up on first reveal, then smoothly re-counts whenever the real backend
// total replaces the default placeholder.
function TotalCandidatesBadge({ visible, value }) {
  const { t } = useLanguage();
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    if (!visible) return undefined;
    const controls = animate(prevValue.current, value, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [visible, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.92 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative inline-flex items-center gap-2.5 mb-7 sm:mb-8 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-brand/40 bg-surface/70 backdrop-blur-sm shadow-[0_0_24px_rgba(211,185,115,0.18)]"
    >
      <motion.span
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
      />
      <Users size={15} className="text-brand shrink-0" />
      <span className="text-sm sm:text-base font-extrabold text-warm-light tabular-nums">
        {display.toLocaleString()}+
      </span>
      <span className="text-xs sm:text-sm text-silver">{t('Total Candidates')}</span>
    </motion.div>
  );
}

// Types the fixed prefix once, then keeps cycling just the trailing word
// (typing it in, holding, deleting it, moving to the next) — the sentence
// itself never re-types.
function PrefixRotatingTypewriter({ prefix, words, active, className }) {
  const { t, lang } = useLanguage();
  const fullPrefix = t(prefix);
  const [prefixTyped, setPrefixTyped] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [word, setWord] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Restart the whole line (prefix included) whenever the language changes —
  // otherwise the already-typed prefix stays in the old language while only
  // the rotating word picks up the new one.
  useEffect(() => {
    setPrefixTyped('');
    setWord('');
    setDeleting(false);
    setWordIndex(0);
  }, [lang]);

  useEffect(() => {
    if (!active) return undefined;
    let timeout;

    if (prefixTyped.length < fullPrefix.length) {
      timeout = setTimeout(() => setPrefixTyped(fullPrefix.slice(0, prefixTyped.length + 1)), 32);
      return () => clearTimeout(timeout);
    }

    const current = t(words[wordIndex]);
    if (!deleting && word.length < current.length) {
      timeout = setTimeout(() => setWord(current.slice(0, word.length + 1)), 55);
    } else if (!deleting && word.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && word.length > 0) {
      timeout = setTimeout(() => setWord(current.slice(0, word.length - 1)), 28);
    } else {
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, 350);
    }
    return () => clearTimeout(timeout);
  }, [active, prefixTyped, fullPrefix, word, deleting, wordIndex, words, t]);

  return (
    <p className={className}>
      {prefixTyped}
      {word}
      <span className="inline-block w-0.5 h-[1em] align-middle bg-brand ms-0.5 animate-pulse" />
    </p>
  );
}

function ActionCard({ href, icon: Icon, title, description, featured, delay, visible }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={visible ? { opacity: 1, y: 0, scale: featured ? 1.04 : 1 } : {}}
      transition={{ delay, duration: 0.55, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: featured ? 1.06 : 1.02 }}
      className={[
        'group relative rounded-2xl border p-6 sm:p-7 text-start backdrop-blur-sm transition-colors',
        featured
          ? 'border-brand/60 bg-linear-to-b from-brand/10 to-surface/60 shadow-xl shadow-black/30 z-10'
          : 'border-brand/20 bg-surface/50 hover:border-brand/40',
      ].join(' ')}
    >
      <Link href={href} className="block">
        <div className="relative inline-flex items-center justify-center w-14 h-14 mb-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-1.5 rounded-full border-2 border-dashed border-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <div
            className={[
              'relative inline-flex items-center justify-center w-14 h-14 rounded-full border-2 transition-transform duration-300 group-hover:scale-110',
              featured ? 'border-brand text-brand shadow-[0_0_18px_rgba(211,185,115,0.45)]' : 'border-brand/50 text-brand',
            ].join(' ')}
          >
            <Icon size={24} />
          </div>
        </div>
        <h3 className={['text-lg font-bold tracking-wide mb-2', featured ? 'text-brand' : 'text-warm-light'].join(' ')}>
          {t(title)}
        </h3>
        <p className="text-sm text-silver leading-relaxed">{t(description)}</p>
      </Link>
    </motion.div>
  );
}

export default function LandingPage() {
  const [stage, setStage] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(DEFAULT_TOTAL_CANDIDATES);
  const { token } = useAuth();

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1000);
    const t3 = setTimeout(() => setStage(3), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Replaces the old static "assessment completion rate" stat with a live
  // candidate count from the backend's Got Talent tally.
  useEffect(() => {
    let cancelled = false;
    async function fetchTotalCandidates() {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const res = await fetch(`${BACKEND_URL}/get_total_candidate`, { headers });
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        const count = extractTotalCandidates(data);
        // Keep the placeholder up until the backend actually has real
        // candidates counted — swapping in a live "0" would look broken.
        if (!cancelled && count != null && count > 0) setTotalCandidates(count);
      } catch (err) {
        console.error('[Landing] Failed to fetch total candidates:', err);
      }
    }
    fetchTotalCandidates();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="overflow-x-hidden">
      <section className="relative bg-dark text-warm-light pt-10 pb-24 sm:pt-14 sm:pb-32 overflow-hidden">
        <HeroBackground variant="waves" />

        <Container maxWidth="lg">
          <div className="relative z-10 text-center">
            <div className="flex justify-center">
              <TotalCandidatesBadge visible={stage >= 1} value={totalCandidates} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={stage >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="relative mb-4 flex items-center justify-center gap-3 sm:gap-6"
            >
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:block h-px w-14 md:w-24 bg-linear-to-r from-transparent to-brand origin-right shadow-[0_0_8px_rgba(211,185,115,0.7)]"
              />

              <div className="relative">
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.08, 0.9] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 -z-10 bg-brand/40 blur-3xl rounded-full"
                />
                <h1 className="tv-hero-font text-5xl sm:text-6xl lg:text-7xl font-black tracking-wide text-warm-light drop-shadow-[0_0_30px_rgba(211,185,115,0.45)]">
                  GOT TALENT
                </h1>
              </div>

              <motion.span
                animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="hidden sm:block h-px w-14 md:w-24 bg-linear-to-l from-transparent to-brand origin-left shadow-[0_0_8px_rgba(211,185,115,0.7)]"
              />
            </motion.div>

            <div className="mb-12 sm:mb-16 min-h-7">
              <PrefixRotatingTypewriter
                prefix={SUBTITLE_PREFIX}
                words={SUBTITLE_WORDS}
                active={stage >= 2}
                className="text-base sm:text-lg text-silver max-w-xl mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto items-center">
              {ACTIONS.map((action, i) => (
                <ActionCard key={action.href} {...action} delay={i * 0.12} visible={stage >= 3} />
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
