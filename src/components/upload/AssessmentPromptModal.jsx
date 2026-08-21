'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n';

// Shown right after a CV upload/save completes instead of navigating to
// the assessment automatically — gives the candidate a deliberate,
// motivating choice rather than yanking them to a new page.
export function AssessmentPromptModal({ open, onStart, onDismiss }) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl border border-brand/30 bg-surface shadow-2xl shadow-black/50 p-6 sm:p-7 text-center"
          >
            <button
              onClick={onDismiss}
              aria-label={t('Close')}
              className="absolute top-3 end-3 p-1.5 rounded-full text-silver hover:text-warm-light hover:bg-surface-2 transition-colors"
            >
              <X size={16} />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, delay: 0.1 }}
              className="w-16 h-16 rounded-2xl bg-brand/20 flex items-center justify-center mx-auto mb-5"
            >
              <Sparkles size={28} className="text-brand" />
            </motion.div>

            <h2 className="text-xl font-bold text-warm-light mb-2">
              {t('Stand out from the crowd')}
            </h2>
            <p className="text-sm text-silver leading-relaxed mb-6">
              {t('Completing the skill assessment gives employers a clearer picture of your abilities and significantly increases your chances of receiving job offers.')}
            </p>

            <Button
              fullWidth
              size="lg"
              onClick={onStart}
              rightIcon={<ArrowRight size={16} className="rtl:-scale-x-100" />}
            >
              {t('Start Assessment')}
            </Button>
            <button
              onClick={onDismiss}
              className="mt-3 text-xs text-silver hover:text-warm underline underline-offset-2 transition-colors"
            >
              {t('Maybe later')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
