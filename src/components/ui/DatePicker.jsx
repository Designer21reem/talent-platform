'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseValue(value) {
  if (!value) return null;
  const [y, m] = value.split('-').map(Number);
  if (!y || !m) return null;
  return { year: y, month: m - 1 };
}

// A compact month/year calendar popover — CV start/end dates only ever need
// month-level precision, and a custom dark-themed picker keeps the look
// consistent instead of falling back to the browser's native date UI.
export function DatePicker({ label, value, onChange, placeholder, required, minYear = 1970 }) {
  const [open, setOpen] = useState(false);
  const parsed = parseValue(value);
  const maxYear = new Date().getFullYear() + 1;
  const [viewYear, setViewYear] = useState(parsed?.year ?? maxYear - 1);
  const rootRef = useRef(null);

  useEffect(() => {
    if (parsed) setViewYear(parsed.year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function selectMonth(monthIndex) {
    const mm = String(monthIndex + 1).padStart(2, '0');
    onChange(`${viewYear}-${mm}`);
    setOpen(false);
  }

  const display = parsed ? `${MONTHS[parsed.month]} ${parsed.year}` : '';

  return (
    <div className="flex flex-col gap-1.5 relative" ref={rootRef}>
      {label && (
        <label className="tv-label">
          {label}
          {required && <span className="text-red-500 ms-1">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="tv-field w-full flex items-center justify-between gap-2 rounded-lg border px-4 py-2.5 text-sm text-left"
      >
        <span className={display ? '' : 'text-[color:var(--tv-field-placeholder)]'}>
          {display || placeholder}
        </span>
        <Calendar size={15} className="text-silver shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 top-full mt-2 w-full min-w-56 rounded-xl border border-surface-2 bg-surface shadow-xl p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setViewYear((y) => Math.max(minYear, y - 1))}
                className="p-1 rounded-lg hover:bg-surface-2 text-silver hover:text-brand transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="text-sm font-semibold text-warm-light">{viewYear}</span>
              <button
                type="button"
                onClick={() => setViewYear((y) => Math.min(maxYear, y + 1))}
                className="p-1 rounded-lg hover:bg-surface-2 text-silver hover:text-brand transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((m, i) => {
                const isSelected = parsed?.year === viewYear && parsed?.month === i;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => selectMonth(i)}
                    className={cn(
                      'text-xs rounded-lg py-2 transition-colors',
                      isSelected ? 'bg-brand text-ink font-semibold' : 'text-warm hover:bg-surface-2'
                    )}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
