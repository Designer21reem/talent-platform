'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef(({ label, error, hint, showCount, maxLength, className, id, value, ...props }, ref) => {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="tv-label">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        value={value}
        maxLength={maxLength}
        className={cn(
          'tv-field w-full rounded-lg border px-4 py-3 text-sm transition-all duration-150 resize-y min-h-[100px]',
          error && 'tv-field-error',
          className
        )}
        {...props}
      />
      <div className="flex justify-between items-center">
        <span>{error && <p className="text-xs text-red-500">{error}</p>}</span>
        <span>{hint && !error && <p className="text-xs text-subtle">{hint}</p>}</span>
        {showCount && maxLength && (
          <span className="text-xs text-subtle ml-auto">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';
export { Textarea };
