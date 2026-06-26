'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(({ label, error, hint, leftElement, className, id, ...props }, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="tv-label">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftElement && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-silver">
            {leftElement}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'tv-field w-full rounded-lg border px-4 py-2.5 text-sm transition-all duration-150',
            error && 'tv-field-error',
            leftElement && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      {hint && !error && <p className="text-xs text-subtle mt-0.5">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export { Input };
