'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export function FeatureCard({ icon: Icon, title, description, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card hover padding="lg" className="h-full">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
          <Icon size={22} className="text-white" />
        </div>
        <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
        <p className="text-silver text-sm leading-relaxed">{description}</p>
      </Card>
    </motion.div>
  );
}
