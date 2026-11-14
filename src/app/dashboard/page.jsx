'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3, User, Mail, Info, ArrowRight, ClipboardCheck, Fingerprint, Heart, Eye,
  Sprout, Flame, MessageSquare, Hand, Search, Sparkles, Briefcase, Target,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { HeroBackground } from '@/components/layout/HeroBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardSignIn } from '@/components/dashboard/DashboardSignIn';
import { loadAssessment } from '@/lib/storage';
import { STYLE_INFO, STYLE_KEYS, PROFILE_TEXT, pick, extractStyleResult } from '@/lib/styleAssessment';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { fetchAssessmentResult } from '@/lib/api';

// Loads the candidate's style result: the backend first
// (GET /assessment-result/{user_id}), then the copy saved locally when the
// assessment was submitted on this device.
async function loadStyleResult(token, userId) {
  if (token && userId != null) {
    try {
      const remote = extractStyleResult(await fetchAssessmentResult(token, userId));
      console.log('[Dashboard] Style extracted from backend response:', remote);
      if (remote) return remote;
      console.warn('[Dashboard] No style found in the backend response — check the raw JSON above; falling back to the local copy.');
    } catch (err) {
      console.warn('[Dashboard] Could not load the result from the backend — using the local copy.', err);
    }
  } else {
    console.log('[Dashboard] No JWT/user_id — skipping GET /assessment-result.', { hasToken: !!token, userId });
  }
  const local = extractStyleResult(loadAssessment());
  console.log('[Dashboard] Style extracted from local copy:', local);
  return local;
}

function SectionCard({ icon: Icon, title, children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={className}
    >
      <Card padding="md" className="h-full">
        <div className="flex items-center gap-2 mb-4">
          <Icon size={18} className="text-brand shrink-0" />
          <h2 className="font-semibold text-warm-light">{title}</h2>
        </div>
        {children}
      </Card>
    </motion.div>
  );
}

function Chips({ items, lang }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item[0]}
          className="px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-warm text-xs sm:text-sm font-medium"
        >
          {pick(item, lang)}
        </span>
      ))}
    </div>
  );
}

function Bullets({ items, lang, columns = 1 }) {
  return (
    <ul className={columns === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5' : 'space-y-2.5'}>
      {items.map((item) => (
        <li key={item[0]} className="flex items-start gap-2.5 text-sm text-warm leading-snug">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
          {pick(item, lang)}
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ t }) {
  return (
    <Card padding="lg" className="max-w-xl mx-auto text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand/15 flex items-center justify-center mx-auto mb-5">
        <ClipboardCheck size={28} className="text-brand" />
      </div>
      <h2 className="text-xl font-bold text-warm-light mb-2">{t('No assessment result yet')}</h2>
      <p className="text-sm text-silver leading-relaxed mb-6">
        {t('Take the Discover Your Personality assessment to see your full personal style profile here.')}
      </p>
      <Link href="/assessment">
        <Button rightIcon={<ArrowRight size={16} className="rtl:-scale-x-100" />}>{t('Take Assessment')}</Button>
      </Link>
    </Card>
  );
}

export default function DashboardPage() {
  const { t, lang } = useLanguage();
  const { token, userId, user } = useAuth();
  // `undefined` while loading, `null` when there's no result yet.
  const [result, setResult] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    loadStyleResult(token, userId).then((found) => {
      if (!cancelled) setResult(found);
    });
    return () => {
      cancelled = true;
    };
  }, [token, userId]);

  const local = result ? loadAssessment() : null;
  const candidateName = user?.name || local?.candidate_name || '';
  const candidateEmail = user?.email || local?.candidate_email || '';
  const profile = result ? STYLE_INFO[result.predominant] : null;
  const backup = result?.backup ? STYLE_INFO[result.backup] : null;
  const countsTotal = result?.counts ? STYLE_KEYS.reduce((sum, k) => sum + result.counts[k], 0) : 0;

  return (
    <div className="overflow-x-hidden">
      <section className="relative bg-dark pt-10 pb-8 sm:pt-12 sm:pb-10 overflow-hidden">
        <HeroBackground variant="waves" />
        <Container maxWidth="xl">
          <div className="relative z-10">
            <DashboardSignIn />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center">
                  <BarChart3 size={22} className="text-brand" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-warm-light">{t('Personality Dashboard')}</h1>
                  <p className="text-silver text-sm">{t('Your personal style assessment results')}</p>
                </div>
              </div>
              {result && (
                <Link href="/assessment">
                  <Button variant="secondary" size="sm" rightIcon={<ArrowRight size={14} className="rtl:-scale-x-100" />}>
                    {t('Retake Assessment')}
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </Container>
      </section>

      <div className="py-8 sm:py-10">
        <Container maxWidth="xl">
          {result === undefined && (
            <div className="flex items-center justify-center min-h-[40vh]">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-silver text-sm">{t('Loading your dashboard…')}</p>
              </div>
            </div>
          )}

          {result === null && <EmptyState t={t} />}

          {profile && (
            <div className="space-y-6">
              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-xl border border-brand/30 bg-brand/10 p-4"
              >
                <Info size={18} className="text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-warm-light">{pick(PROFILE_TEXT.disclaimerTitle, lang)}</p>
                  {PROFILE_TEXT.disclaimerLines.map((line) => (
                    <p key={line[0]} className="text-xs sm:text-sm text-warm mt-1">{pick(line, lang)}</p>
                  ))}
                </div>
              </motion.div>

              {/* Candidate + social style */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card padding="md" className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                    <User size={24} className="text-brand" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-warm-light text-lg truncate">{candidateName || t('Candidate')}</p>
                    {candidateEmail && (
                      <p className="flex items-center gap-1.5 text-sm text-silver mt-0.5">
                        <Mail size={13} className="shrink-0" />
                        <span dir="ltr" className="truncate">{candidateEmail}</span>
                      </p>
                    )}
                  </div>
                </Card>

                <Card padding="md" className="lg:col-span-2 bg-linear-to-br from-brand/15 to-brand/5 border-brand/30">
                  <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-1">
                    {pick(PROFILE_TEXT.socialStyle, lang)}
                  </p>
                  <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                    className="text-3xl sm:text-4xl font-extrabold text-warm-light"
                  >
                    {pick(profile.name, lang)}
                  </motion.h2>
                  <p className="text-brand-dark font-semibold mt-1">
                    {pick(profile.title, lang)} · {pick(profile.nickname, lang)}
                  </p>
                  {backup && (
                    <p className="text-sm text-silver mt-2">
                      {pick(PROFILE_TEXT.backupStyle, lang)}: {pick(backup.name, lang)} — {pick(backup.title, lang)}
                    </p>
                  )}

                  {countsTotal > 0 && (
                    <div className="space-y-2 mt-5">
                      {[...STYLE_KEYS].sort((a, b) => result.counts[b] - result.counts[a]).map((key) => (
                        <div key={key} className="flex items-center gap-3">
                          <span className="w-20 shrink-0 text-xs font-medium text-warm">{pick(STYLE_INFO[key].name, lang)}</span>
                          <div className="flex-1 h-2 rounded-full bg-surface-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(result.counts[key] / countsTotal) * 100}%` }}
                              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                              className="h-full bg-brand rounded-full"
                            />
                          </div>
                          <span className="w-6 shrink-0 text-xs text-silver text-end">{result.counts[key]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Key traits + ideal roles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionCard icon={Sparkles} title={pick(PROFILE_TEXT.keyTraits, lang)} delay={0.05}>
                  <p className="text-warm leading-relaxed">{pick(profile.keyTraits, lang)}</p>
                </SectionCard>
                <SectionCard icon={Target} title={pick(PROFILE_TEXT.idealRoles, lang)} delay={0.1}>
                  <p className="text-warm leading-relaxed">{pick(profile.idealRoles, lang)}</p>
                </SectionCard>
              </div>

              <SectionCard icon={Fingerprint} title={pick(PROFILE_TEXT.description, lang)} delay={0.1}>
                <Chips items={profile.description} lang={lang} />
              </SectionCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionCard icon={Heart} title={pick(PROFILE_TEXT.highWants, lang)} delay={0.15}>
                  <Bullets items={profile.highWants} lang={lang} />
                </SectionCard>
                <SectionCard icon={Eye} title={pick(PROFILE_TEXT.perceivedAs, lang)} delay={0.15}>
                  <Bullets items={profile.perceivedAs} lang={lang} />
                </SectionCard>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SectionCard icon={Sprout} title={pick(PROFILE_TEXT.growthAction, lang)} delay={0.2}>
                  <p className="text-2xl font-bold text-emerald-600">{pick(profile.growthAction, lang)}</p>
                </SectionCard>
                <SectionCard icon={Flame} title={pick(PROFILE_TEXT.stressReaction, lang)} delay={0.2}>
                  <p className="text-2xl font-bold text-amber-600">{pick(profile.stressReaction, lang)}</p>
                </SectionCard>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionCard icon={MessageSquare} title={pick(PROFILE_TEXT.verbal, lang)} delay={0.25}>
                  <Bullets items={profile.verbal} lang={lang} />
                </SectionCard>
                <SectionCard icon={Hand} title={pick(PROFILE_TEXT.nonVerbal, lang)} delay={0.25}>
                  <Bullets items={profile.nonVerbal} lang={lang} />
                </SectionCard>
              </div>

              <SectionCard icon={Search} title={pick(PROFILE_TEXT.recognizedBy, lang)} delay={0.3}>
                <Bullets items={profile.recognizedBy} lang={lang} columns={2} />
              </SectionCard>

              <SectionCard icon={Briefcase} title={pick(PROFILE_TEXT.bestFitJobs, lang)} delay={0.35}>
                <Bullets items={profile.bestFitJobs} lang={lang} columns={2} />
              </SectionCard>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
