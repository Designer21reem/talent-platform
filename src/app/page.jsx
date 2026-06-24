'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Upload,
  FileEdit,
  ClipboardCheck,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { Card, CardBody } from '@/components/ui/Card';

const FEATURES = [
  {
    icon: Upload,
    title: 'Upload Your CV',
    description:
      'Quickly upload your existing CV in PDF or DOCX format. We parse and store it securely so you can move on fast.',
    color: 'bg-blue-500',
    href: '/upload-cv',
  },
  {
    icon: FileEdit,
    title: 'Build a CV',
    description:
      'Create a polished, structured CV from scratch using our guided form. Add experience, skills, projects, and more.',
    color: 'bg-violet-500',
    href: '/build-cv',
  },
  {
    icon: ClipboardCheck,
    title: 'Skill Assessment',
    description:
      'Take an optional assessment that evaluates your communication, problem solving, leadership, and technical skills.',
    color: 'bg-emerald-500',
    href: '/assessment',
  },
  {
    icon: BarChart3,
    title: 'Skills Dashboard',
    description:
      'View a personalised breakdown of your skill scores, strengths, and areas for improvement in one clear view.',
    color: 'bg-amber-500',
    href: '/dashboard',
  },
];

const STATS = [
  { label: 'Candidates placed', value: '12,400+', icon: Users },
  { label: 'Skill categories tracked', value: '6', icon: Star },
  { label: 'Assessment completion rate', value: '94%', icon: Zap },
];

const CHECKLIST = [
  'No account needed to get started',
  'Fully browser-based — no data leaves your device',
  'Professional CV preview ready to download',
  'Instant skill score breakdown after assessment',
];

export default function LandingPage() {
  console.log('[LandingPage] Rendered');

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-24 sm:py-32 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/40 rounded-full blur-3xl pointer-events-none" />

        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative z-10"
          >
            <span className="inline-block mb-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium">
              Your career, elevated
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Showcase your talent.
              <br />
              <span className="text-blue-200">Land your next role.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-blue-100 leading-relaxed mb-10">
              Upload or build a professional CV, complete a skill assessment, and get a personal
              skills dashboard — all in one place, no sign-up required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload-cv">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-blue-900/30 w-full sm:w-auto"
                  leftIcon={<Upload size={18} />}
                >
                  Upload CV
                </Button>
              </Link>
              <Link href="/build-cv">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 w-full sm:w-auto"
                  leftIcon={<FileEdit size={18} />}
                >
                  Build CV
                </Button>
              </Link>
              <Link href="/assessment">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 w-full sm:w-auto"
                  leftIcon={<ClipboardCheck size={18} />}
                >
                  Start Assessment
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-slate-100">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {STATS.map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 py-8 px-6"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Features ── */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            >
              Everything you need to stand out
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-lg max-w-xl mx-auto"
            >
              Four powerful tools to help you present your best professional self.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <Link key={f.title} href={f.href} className="block">
                <FeatureCard {...f} delay={i * 0.1} />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Why TalentHub ── */}
      <section className="py-20 bg-white border-y border-slate-100">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Why candidates choose TalentHub
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                We built TalentHub to give every candidate — regardless of experience — a
                professional, structured way to present their skills and background to recruiters.
              </p>
              <ul className="space-y-3">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Upload CV', emoji: '📄', href: '/upload-cv' },
                { label: 'Build CV', emoji: '✏️', href: '/build-cv' },
                { label: 'Assessment', emoji: '📋', href: '/assessment' },
                { label: 'Dashboard', emoji: '📊', href: '/dashboard' },
              ].map(({ label, emoji, href }) => (
                <Link key={label} href={href}>
                  <Card
                    hover
                    padding="lg"
                    className="flex flex-col items-center text-center gap-3 h-full"
                  >
                    <span className="text-4xl">{emoji}</span>
                    <CardBody>
                      <p className="font-semibold text-slate-800 text-sm">{label}</p>
                    </CardBody>
                    <ArrowRight size={14} className="text-blue-500" />
                  </Card>
                </Link>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-950 text-white">
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-slate-400 mb-8 text-lg">
              Takes less than 5 minutes. No sign-up required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/build-cv">
                <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={18} />}>
                  Build My CV
                </Button>
              </Link>
              <Link href="/assessment">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 w-full sm:w-auto"
                >
                  Take Assessment
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
