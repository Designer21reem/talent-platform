'use client';

import { motion } from 'framer-motion';
import { MapPin, Target, Briefcase } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { HeroBackground } from '@/components/layout/HeroBackground';
import { useLanguage } from '@/lib/i18n';

const EXPERTISE = [
  'HR Strategy',
  'Organizational Development',
  'Talent Acquisition',
  'Learning & Development',
  'Performance Management',
  'Policies & Grading',
  'HR Process Automation',
  'Business Leadership',
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative bg-dark text-warm-light py-24 sm:py-32 overflow-hidden">
        <HeroBackground variant="waves" />
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative z-10"
          >
            <div className="mb-6">
              <img src="/Logo (1).png" alt="THE VALUE" className="h-28 w-auto object-contain mx-auto" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              {t('About')} <span className="text-brand">THE VALUE</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-warm leading-relaxed">
              {t('A private for-profit organization that delivers business solutions for individuals, corporations, and government — enhancing the quality of business results.')}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Organization ── */}
      <section className="py-20 bg-dark">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold text-brand uppercase tracking-widest">{t('Who We Are')}</span>
              <h2 className="text-3xl font-bold text-warm-light mt-2 mb-6">
                THE VALUE
              </h2>
              <p className="text-warm leading-relaxed">
                {t('The Value is a private for-profit organization that delivers business solutions for individuals, corporations, and government.')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-surface rounded-2xl border border-surface-2 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Target size={20} className="text-brand" />
                  <h3 className="font-semibold text-warm-light">{t('Mission')}</h3>
                </div>
                <p className="text-warm leading-relaxed">
                  {t('To deliver standardized and customized business solutions to enhance the quality of business results.')}
                </p>
              </div>

              <div className="bg-surface rounded-2xl border border-surface-2 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase size={20} className="text-brand" />
                  <h3 className="font-semibold text-warm-light">{t('Vision')}</h3>
                </div>
                <p className="text-warm leading-relaxed">
                  {t('To add value to our clients through our business solutions.')}
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Founder ── */}
      <section className="py-20 bg-surface border-y border-surface-2">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-brand uppercase tracking-widest">{t('About the Founder')}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-brand/30 to-brand-dark/20 blur-xl scale-105" />
                <img
                  src="/founder-aws-fawzi.jpg"
                  alt="Aws Fawzi Mohamed"
                  className="relative rounded-2xl w-full max-w-sm object-cover border border-brand/20 shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-warm-light mb-1">Aws Fawzi Mohamed</h2>
              <p className="text-brand font-semibold mb-4">{t('Founder of The Value')}</p>

              <p className="text-warm leading-relaxed mb-6">
                {t('The Founder of The Value and an experienced HR and business leader based in Baghdad with over 20 years of experience. He holds an MBA and international HR certifications including SPHRi and PHRi. His background includes senior HR leadership roles across banking, telecom, automotive, and corporate organizations, with strong experience in HR strategy, organizational development, talent acquisition, learning and development, performance management, policies, grading structures, and HR process automation.')}
              </p>

              {/* Certifications */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['MBA', 'SPHRi', 'PHRi'].map((cert) => (
                  <span
                    key={cert}
                    className="px-3 py-1 rounded-full bg-brand/20 border border-brand/30 text-brand text-xs font-semibold"
                  >
                    {cert}
                  </span>
                ))}
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-2 text-silver text-xs">
                  <MapPin size={11} /> {t('Baghdad, Iraq')}
                </span>
              </div>

              {/* Expertise */}
              <div>
                <p className="text-xs font-semibold text-silver uppercase tracking-widest mb-3">{t('Areas of Expertise')}</p>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-lg bg-surface-2 text-warm text-xs border border-surface-2"
                    >
                      {t(item)}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-linear-to-br from-dark to-surface-2 text-warm-light">
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">{t('Ready to showcase your talent?')}</h2>
            <p className="text-silver mb-8">
              {t('Join candidates who have already built their profile with THE VALUE.')}
            </p>
            <a
              href="/upload-cv"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-light text-ink font-semibold transition-colors"
            >
              {t('Get Started')}
            </a>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
