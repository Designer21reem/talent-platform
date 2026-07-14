'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileEdit, ClipboardCheck, Star, Users, Zap } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { HeroBackground } from '@/components/layout/HeroBackground';
import { useLanguage } from '@/lib/i18n';

const STATS = [
  { label: 'Candidates placed', value: '12,400+', icon: Users },
  { label: 'Skill categories tracked', value: '6', icon: Star },
  { label: 'Assessment completion rate', value: '94%', icon: Zap },
];

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
    title: 'SKILL CHECK',
    description: 'Test practical skills with short assessments that can help validate your readiness.',
  },
];

const SUBTITLE_PREFIX = 'One place to show what you can do. Start with ';
const SUBTITLE_WORDS = ['our CV Builder', 'a Skill Assessment', 'a CV Upload'];

function StatsBar({ visible }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative mx-auto mt-14 sm:mt-16 max-w-3xl rounded-2xl border border-brand/30 bg-surface/60 backdrop-blur-sm px-4 py-6 sm:px-10 sm:py-8 shadow-lg shadow-black/20"
    >
      <div className="grid grid-cols-3 divide-x divide-brand/15 rtl:divide-x-reverse">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
            className="text-center px-2"
          >
            <p className="text-2xl sm:text-4xl font-extrabold text-brand tracking-tight">{stat.value}</p>
            <p className="mt-1 text-[11px] sm:text-sm text-silver whitespace-nowrap">{t(stat.label)}</p>
          </motion.div>
        ))}
      </div>
      <span className="absolute -bottom-1 start-6 w-1.5 h-1.5 rounded-full bg-brand/60" />
      <span className="absolute -bottom-3 start-16 w-1 h-1 rounded-full bg-brand/40" />
      <span className="absolute -bottom-1 end-10 w-1 h-1 rounded-full bg-brand/40" />
    </motion.div>
  );
}

// Types the fixed prefix once, then keeps cycling just the trailing word
// (typing it in, holding, deleting it, moving to the next) — the sentence
// itself never re-types.
function PrefixRotatingTypewriter({ prefix, words, active, className }) {
  const { t } = useLanguage();
  const fullPrefix = t(prefix);
  const [prefixTyped, setPrefixTyped] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [word, setWord] = useState('');
  const [deleting, setDeleting] = useState(false);

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
        'group relative rounded-2xl border p-6 sm:p-7 text-left backdrop-blur-sm transition-colors',
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
              featured ? 'border-brand text-brand shadow-[0_0_18px_rgba(201,155,37,0.45)]' : 'border-brand/50 text-brand',
            ].join(' ')}
          >
            <Icon size={24} />
          </div>
        </div>
        <h3 className={['text-lg font-bold tracking-wide mb-2', featured ? 'text-brand' : 'text-white'].join(' ')}>
          {title}
        </h3>
        <p className="text-sm text-silver leading-relaxed">{t(description)}</p>
      </Link>
    </motion.div>
  );
}

export default function LandingPage() {
  const [stage, setStage] = useState(0);

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

  return (
    <div className="overflow-x-hidden">
      <section className="relative bg-dark text-white pt-10 pb-24 sm:pt-14 sm:pb-32 overflow-hidden">
        <HeroBackground variant="waves" />

        <Container maxWidth="lg">
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={stage >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="relative mb-4 flex items-center justify-center gap-3 sm:gap-6"
            >
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:block h-px w-14 md:w-24 bg-linear-to-r from-transparent to-brand origin-right"
              />

              <div className="relative">
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.08, 0.9] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 -z-10 bg-brand/40 blur-3xl rounded-full"
                />
                <h1 className="tv-hero-font text-5xl sm:text-6xl lg:text-7xl font-black tracking-wide text-white drop-shadow-[0_0_30px_rgba(201,155,37,0.45)]">
                  GOT TALENT
                </h1>
              </div>

              <motion.span
                animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="hidden sm:block h-px w-14 md:w-24 bg-linear-to-l from-transparent to-brand origin-left"
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

            <StatsBar visible={stage >= 3} />
          </div>
        </Container>
      </section>
    </div>
  );
}
