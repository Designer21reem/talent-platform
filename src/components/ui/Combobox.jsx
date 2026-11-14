'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

const MAX_MATCHES = 50;

// A free-text input that shows a filtered, type-ahead list of matches below
// it as the user types — the value is never locked to the list, so a
// candidate can always keep whatever they typed even if nothing matches.
//
// `options` are bilingual { en, ar } entries. Picking one stores its English
// name (the canonical value); the field displays it in the current language,
// and typing searches both the Arabic and English names.
export function Combobox({ label, value, onChange, options, placeholder, required }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const inputId = label?.toLowerCase().replace(/\s+/g, '-');

  const labelOf = (opt) => (lang === 'ar' ? opt.ar : opt.en);
  const selected = options.find((opt) => opt.en === value);
  const display = selected ? labelOf(selected) : value || '';

  const matches = useMemo(() => {
    const q = display.trim().toLowerCase();
    if (!q) return options.slice(0, MAX_MATCHES);
    return options
      .filter((opt) => opt.en.toLowerCase().includes(q) || opt.ar.includes(q))
      .slice(0, MAX_MATCHES);
  }, [display, options]);

  useEffect(() => {
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 relative" ref={rootRef}>
      {label && (
        <label htmlFor={inputId} className="tv-label">
          {label}
          {required && <span className="text-red-500 ms-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'tv-field w-full rounded-lg border px-4 py-2.5 text-sm transition-all duration-150'
        )}
        placeholder={placeholder}
        value={display}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
      />
      <AnimatePresence>
        {open && matches.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute z-30 top-full mt-1.5 w-full max-h-56 overflow-y-auto rounded-lg border border-surface-2 bg-surface shadow-xl py-1"
          >
            {matches.map((opt) => (
              <li key={opt.en}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(opt.en);
                    setOpen(false);
                  }}
                  className="w-full text-start px-4 py-2 text-sm text-warm hover:bg-brand/10 hover:text-brand transition-colors"
                >
                  {labelOf(opt)}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
