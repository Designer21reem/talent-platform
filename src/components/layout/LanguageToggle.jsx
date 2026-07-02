'use client';

import { Languages } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function LanguageToggle({ className = '' }) {
  const { lang, toggle } = useLanguage();

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand/30 text-xs font-semibold text-warm hover:bg-brand/10 hover:text-brand transition-colors ${className}`}
      aria-label="Toggle language"
    >
      <Languages size={13} />
      {lang === 'en' ? 'العربية' : 'English'}
    </button>
  );
}
