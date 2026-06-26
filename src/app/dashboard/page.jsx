'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3, User, Phone, TrendingUp, TrendingDown, Star,
  ClipboardCheck, ArrowRight, Info,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SkillProgressCard } from '@/components/dashboard/SkillProgressCard';
import { loadAssessment } from '@/lib/storage';
import { buildDashboard, MOCK_DASHBOARD } from '@/lib/mockDashboard';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    console.log('[DashboardPage] Loading assessment data from storage…');
    const assessment = loadAssessment();

    if (assessment) {
      console.log('[DashboardPage] Assessment found — building real dashboard');
      const data = buildDashboard(
        assessment.answers,
        assessment.candidateName,
        assessment.candidatePhone
      );
      setDashboard(data);
      setUsingMock(false);
    } else {
      console.log('[DashboardPage] No assessment found — using mock dashboard data');
      setDashboard(MOCK_DASHBOARD);
      setUsingMock(true);
    }
  }, []);

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-silver text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const topSkills = [...dashboard.skills].sort((a, b) => b.score - a.score).slice(0, 3);

  console.log('[DashboardPage] Rendering dashboard for:', dashboard.candidateName, '| Overall score:', dashboard.overallScore);

  return (
    <div className="py-12 sm:py-16">
      <Container maxWidth="xl">
        {/* Mock data banner */}
        {usingMock && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4"
          >
            <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">Showing sample dashboard</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Complete the assessment to see your personalised skill results.
              </p>
            </div>
            <Link href="/assessment">
              <Button size="sm" variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-50 shrink-0">
                Take Assessment
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center">
              <BarChart3 size={22} className="text-brand" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Skills Dashboard</h1>
              <p className="text-silver text-sm">Your personal skill assessment results</p>
            </div>
          </div>
          <Link href="/assessment">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight size={14} />}>
              Retake Assessment
            </Button>
          </Link>
        </motion.div>

        {/* Candidate info + Overall score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Candidate card */}
          <Card padding="md" className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
              <User size={24} className="text-brand" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-lg truncate">{dashboard.candidateName || 'Candidate'}</p>
              <p className="flex items-center gap-1.5 text-sm text-silver mt-0.5">
                <Phone size={13} />
                {dashboard.phoneNumber}
              </p>
            </div>
          </Card>

          {/* Overall score */}
          <Card padding="md" className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Overall Score</h2>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                className="text-3xl font-extrabold text-brand"
              >
                {dashboard.overallScore}%
              </motion.span>
            </div>
            <ProgressBar value={dashboard.overallScore} showValue={false} size="lg" animated />
            <div className="flex justify-between text-xs text-silver mt-1.5">
              <span>Developing</span>
              <span>Proficient</span>
              <span>Expert</span>
            </div>
          </Card>
        </div>

        {/* Skills grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Skill Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard.skills.map((skill, i) => (
              <SkillProgressCard key={skill.category} skill={skill} delay={i * 0.07} />
            ))}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <Card padding="md">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-emerald-500" />
              <h2 className="font-semibold text-white">Your Strengths</h2>
            </div>
            {dashboard.strengths.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {dashboard.strengths.map((s) => (
                  <Badge key={s} variant="green" className="flex items-center gap-1.5 py-1 px-3">
                    <Star size={11} />
                    {s}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-silver text-sm">Complete the assessment to see your strengths.</p>
            )}
          </Card>

          {/* Areas for improvement */}
          <Card padding="md">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={18} className="text-amber-500" />
              <h2 className="font-semibold text-white">Areas for Improvement</h2>
            </div>
            {dashboard.areasForImprovement.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {dashboard.areasForImprovement.map((s) => (
                  <Badge key={s} variant="amber">{s}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-silver text-sm italic">All skill areas are strong — great work!</p>
            )}
          </Card>
        </div>

        {/* Top skills */}
        <Card padding="md" className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <ClipboardCheck size={18} className="text-brand" />
            <h2 className="font-semibold text-white">Top Performing Skills</h2>
          </div>
          <div className="space-y-4">
            {topSkills.map((skill, i) => (
              <div key={skill.category} className="flex items-center gap-4">
                <span className="text-sm font-semibold text-silver w-4">#{i + 1}</span>
                <div className="flex-1">
                  <ProgressBar label={skill.category} value={skill.score} size="sm" animated />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Overall summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card padding="lg" className="bg-linear-to-br from-brand/10 to-brand/5 border-brand/20">
            <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 size={18} className="text-brand" />
              Overall Assessment Summary
            </h2>
            <p className="text-warm leading-relaxed text-sm sm:text-base">
              {dashboard.overallSummary}
            </p>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}
