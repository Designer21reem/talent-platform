'use client';

import { motion } from 'framer-motion';
import { MapPin, Target, Briefcase } from 'lucide-react';
import { Container } from '@/components/layout/Container';

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
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative bg-linear-to-br from-dark via-surface to-surface-2 text-white py-24 sm:py-32 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-dark/20 rounded-full blur-3xl pointer-events-none" />
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
              About <span className="text-brand">THE VALUE</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-warm leading-relaxed">
              A private for-profit organization that delivers business solutions for individuals,
              corporations, and government — enhancing the quality of business results.
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
              <span className="text-sm font-semibold text-brand uppercase tracking-widest">Who We Are</span>
              <h2 className="text-3xl font-bold text-white mt-2 mb-6">
                THE VALUE
              </h2>
              <p className="text-warm leading-relaxed">
                The Value is a private for-profit organization that delivers business solutions for
                individuals, corporations, and government.
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
                  <h3 className="font-semibold text-white">Mission</h3>
                </div>
                <p className="text-warm leading-relaxed">
                  To deliver standardized and customized business solutions to enhance the quality
                  of business results.
                </p>
              </div>

              <div className="bg-surface rounded-2xl border border-surface-2 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase size={20} className="text-brand" />
                  <h3 className="font-semibold text-white">Vision</h3>
                </div>
                <p className="text-warm leading-relaxed">
                  To add value to our clients through our business solutions.
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
            <span className="text-sm font-semibold text-brand uppercase tracking-widest">About the Founder</span>
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
              <h2 className="text-3xl font-bold text-white mb-1">Aws Fawzi Mohamed</h2>
              <p className="text-brand font-semibold mb-4">Founder of The Value</p>

              <p className="text-warm leading-relaxed mb-6">
                The Founder of The Value and an experienced HR and business leader based in Baghdad
                with over 20 years of experience. He holds an MBA and international HR certifications
                including SPHRi and PHRi. His background includes senior HR leadership roles across
                banking, telecom, automotive, and corporate organizations, with strong experience in
                HR strategy, organizational development, talent acquisition, learning and development,
                performance management, policies, grading structures, and HR process automation.
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
                  <MapPin size={11} /> Baghdad, Iraq
                </span>
              </div>

              {/* Expertise */}
              <div>
                <p className="text-xs font-semibold text-silver uppercase tracking-widest mb-3">Areas of Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-lg bg-surface-2 text-warm text-xs border border-surface-2"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-linear-to-br from-dark to-surface-2 text-white">
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to showcase your talent?</h2>
            <p className="text-silver mb-8">
              Join candidates who have already built their profile with THE VALUE.
            </p>
            <a
              href="/upload-cv"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-light text-dark font-semibold transition-colors"
            >
              Get Started
            </a>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
