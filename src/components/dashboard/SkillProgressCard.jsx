'use client';

import { motion } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';

const EMOJI_MAP = {
  Communication: '💬',
  'Problem Solving': '🧩',
  'Technical Knowledge': '⚙️',
  Leadership: '🚀',
  'English Language': '🌐',
  Teamwork: '🤝',
};

export function SkillProgressCard({ skill, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-surface rounded-2xl border border-surface-2 shadow-sm p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{EMOJI_MAP[skill.category] ?? '📊'}</span>
        <h3 className="font-semibold text-white">{skill.category}</h3>
      </div>
      <ProgressBar value={skill.score} showValue size="md" animated />
    </motion.div>
  );
}
