'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ hover = false, padding = 'md', className, children, onClick, style, id }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={onClick}
      style={style}
      id={id}
      className={cn(
        'bg-white rounded-2xl border border-slate-100 shadow-sm',
        paddingStyles[padding],
        hover && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('text-lg font-semibold text-slate-900', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('text-slate-600', className)} {...props}>
      {children}
    </div>
  );
}
