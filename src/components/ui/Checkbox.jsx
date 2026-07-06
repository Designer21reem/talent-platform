'use client';

import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = forwardRef(({ label, checked, onChange, className, id, ...props }, ref) => {
  return (
    <label
      htmlFor={id}
      className={cn('flex items-start gap-2.5 cursor-pointer select-none', className)}
    >
      <span className="relative flex items-center justify-center shrink-0 mt-0.5">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
          {...props}
        />
        <span
          className={cn(
            'w-4.5 h-4.5 rounded-md border transition-colors duration-150',
            checked ? 'bg-brand border-brand' : 'bg-surface-2 border-surface-2'
          )}
        />
        <Check
          size={12}
          strokeWidth={3}
          className={cn(
            'absolute text-dark transition-opacity duration-150',
            checked ? 'opacity-100' : 'opacity-0'
          )}
        />
      </span>
      <span className="text-sm text-warm leading-snug">{label}</span>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
export { Checkbox };
