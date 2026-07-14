'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, Languages, LogOut, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';

// A small, static settings trigger fixed at the bottom-right of the
// viewport — deliberately plain (no pulse/bounce) so it doesn't read as a
// chat-bot widget. Opens a small popover anchored right next to it (no
// full-screen backdrop) holding language + sign-out.
export function SettingsButton() {
  const [open, setOpen] = useState(false);
  const { lang, toggle, t } = useLanguage();
  const { user, signOut } = useAuth();
  const rootRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div ref={rootRef} className="fixed bottom-5 end-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute bottom-full end-0 mb-3 w-64 rounded-2xl border border-surface-2 bg-surface shadow-xl shadow-black/40 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-warm-light">{t('Settings')}</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-silver hover:text-white hover:bg-surface-2 transition-colors"
                aria-label={t('Close')}
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={toggle}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-surface-2 hover:border-brand/40 transition-colors"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-warm">
                  <Languages size={15} className="text-brand" />
                  {t('Language')}
                </span>
                <span className="text-xs font-semibold text-brand">
                  {lang === 'en' ? 'العربية' : 'English'}
                </span>
              </button>

              {user && (
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-surface-2 hover:border-red-500/40 hover:text-red-400 text-warm text-sm font-medium transition-colors"
                >
                  <LogOut size={15} />
                  {t('Sign out')}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t('Settings')}
        className="w-11 h-11 rounded-full bg-surface border border-brand/30 text-silver hover:text-brand hover:border-brand/60 shadow-md shadow-black/30 flex items-center justify-center transition-colors"
      >
        {open ? <X size={18} /> : <Settings size={18} />}
      </button>
    </div>
  );
}
