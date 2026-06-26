'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const colorStyles = {
  brand: 'bg-brand',
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

function getColor(value) {
  if (value < 40) return 'red';
  if (value < 65) return 'amber';
  if (value < 80) return 'brand';
  return 'green';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  color,
  size = 'md',
  className,
  animated = true,
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const resolvedColor = color ?? getColor(percentage);

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-warm">{label}</span>}
          {showValue && (
            <span className="text-sm font-semibold text-white">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-surface-2 rounded-full overflow-hidden', sizeStyles[size])}>
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className={cn('h-full rounded-full', colorStyles[resolvedColor])}
          />
        ) : (
          <div
            style={{ width: `${percentage}%` }}
            className={cn('h-full rounded-full', colorStyles[resolvedColor])}
          />
        )}
      </div>
    </div>
  );
}
