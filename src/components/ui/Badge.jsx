import { cn } from '@/lib/utils';

const variantStyles = {
  brand:  'bg-brand/15 text-brand border border-brand/20',
  green:  'bg-emerald-400/15 text-emerald-400',
  amber:  'bg-amber-400/15 text-amber-400',
  red:    'bg-red-400/15 text-red-400',
  slate:  'bg-surface-2 text-silver',
  blue:   'bg-brand/15 text-brand border border-brand/20',
  purple: 'bg-brand/15 text-brand border border-brand/20',
};

export function Badge({ variant = 'brand', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
