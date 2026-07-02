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
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
        className="flex items-center gap-2.5 rounded-full bg-brand/15 border border-brand px-4 py-2"
        style={{ boxShadow: '0 0 6px rgba(201,155,37,0.35)' }}
      >
        <motion.div
          animate={{ boxShadow: ['0 0 0px rgba(201,155,37,0)', '0 0 10px rgba(201,155,37,0.7)', '0 0 0px rgba(201,155,37,0)'] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay }}
          className="w-7 h-7 rounded-full bg-brand/20 flex items-center justify-center shrink-0"
        >
          <Icon size={14} className="text-brand" />
        </motion.div>
        <div className="text-left leading-tight">
          <p className="text-sm font-bold text-white">{value}</p>
          <p className="text-[10px] text-silver whitespace-nowrap">{t(label)}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [stage, setStage] = useState(0);
  const { t } = useLanguage();

  function handleTypewriterDone() {
    setStage(1);
    setTimeout(() => setStage(2), 500);
    setTimeout(() => setStage(3), 1100);
  }

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative bg-linear-to-br from-dark via-surface to-surface-2 text-white py-24 sm:py-32 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-dark/30 rounded-full blur-3xl pointer-events-none" />

        {stage >= 3 && (
          <div className="absolute top-6 inset-x-0 flex flex-wrap items-center justify-center gap-3 z-20 px-4">
            {STATS.map((stat, i) => (
              <StatBubble key={stat.label} {...stat} delay={i * 0.15} />
            ))}
          </div>
        )}

        <Container maxWidth="lg">
          <div className="text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, scale: 0.3, y: 0 }}
              animate={{ opacity: [0, 1, 1], scale: [0.3, 1.35, 1], y: [0, 0, -6] }}
              transition={{ duration: 1.5, times: [0, 0.55, 1], ease: 'easeOut' }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-wide mb-6"
            >
              <span className="text-brand">THE VALUE</span>
              <br />
              <span className="text-white text-3xl sm:text-4xl lg:text-5xl tracking-[0.2em]">{t('GOT TALENT')}</span>
            </motion.h1>

            <TypewriterText
              text={t(TAGLINE)}
              startDelay={1500}
              onDone={handleTypewriterDone}
              className="max-w-2xl mx-auto text-lg sm:text-xl text-warm leading-relaxed mb-10 min-h-[3.5em] sm:min-h-[2.5em]"
            />

            {stage >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
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

            {stage >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-16"
              >
                <TestimonialCarousel />
              </motion.div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
