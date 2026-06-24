'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef(({ label, error, hint, showCount, maxLength, className, id, value, ...props }, ref) => {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-slate-700">
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
          'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900',
          'placeholder:text-slate-400 transition-all duration-150 resize-y min-h-[100px]',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-slate-50 disabled:cursor-not-allowed',
          error && 'border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      />
      <div className="flex justify-between items-center">
        <span>{error && <p className="text-xs text-red-500">{error}</p>}</span>
        <span>{hint && !error && <p className="text-xs text-slate-400">{hint}</p>}</span>
        {showCount && maxLength && (
          <span className="text-xs text-slate-400 ml-auto">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';
export { Textarea };
