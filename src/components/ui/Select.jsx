'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = forwardRef(({ label, error, options, placeholder, className, id, ...props }, ref) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="tv-label">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'tv-field w-full appearance-none rounded-lg border px-4 py-2.5 pr-10 text-sm',
            'transition-all duration-150',
            error && 'tv-field-error',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled style={{ background: 'var(--tv-field-bg)', color: 'var(--tv-field-placeholder)' }}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: 'var(--tv-field-bg)', color: 'var(--tv-field-text)' }}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-silver"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export { Select };
