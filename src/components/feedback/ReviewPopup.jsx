'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import { BACKEND_URL } from '@/lib/api';

const DISMISSED_KEY = 'tv_review_dismissed';
const AUTO_SHOW_DELAY_MS = 25000;

// Site-wide feedback popup (spec item 6): a 1–5 star rating plus a yes/no
// recommend question. Shows once per browser after a short delay, then
// remembers not to show again (whether the user submitted or just closed
// it). Storage is backend-owned — /website_review doesn't exist yet, so
// this posts anyway and logs a clear diagnosis if it 404s, same pattern
// as the rest of this app's not-yet-built backend calls.
export function ReviewPopup() {
  const { t } = useLanguage();
  const { user, token, userId } = useAuth();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [recommend, setRecommend] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return undefined;
    if (typeof window === 'undefined') return undefined;
    if (localStorage.getItem(DISMISSED_KEY)) return undefined;

    const timer = setTimeout(() => setOpen(true), AUTO_SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [user]);

  function dismissForever() {
    localStorage.setItem(DISMISSED_KEY, '1');
    setOpen(false);
  }

  async function handleSubmit() {
    if (!rating || !recommend || submitting) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      rating,
      would_recommend: recommend === 'yes',
      user_id: userId ?? null,
      email: user?.email ?? null,
    };

    console.log('[Review] Submitting website review:', payload);
    try {
      const res = await fetch(`${BACKEND_URL}/website_review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      console.log('[Review] /website_review responded with status:', res.status, 'body:', data);

      if (!res.ok) {
        if (res.status === 404) {
          console.error(
            '[Review] VERDICT: /website_review does not exist on the backend yet. ' +
            'This is not fixable from the frontend repo — a review-storage endpoint needs to be added backend-side.'
          );
        }
        setError(t("Couldn't submit your review right now, but thanks for the feedback."));
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('[Review] Network error submitting review:', err);
      setError(t("Couldn't submit your review right now, but thanks for the feedback."));
    } finally {
      setSubmitting(false);
      localStorage.setItem(DISMISSED_KEY, '1');
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-4 sm:pb-4"
          onClick={dismissForever}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl border border-brand/30 bg-surface shadow-2xl shadow-black/30 p-6 sm:p-7"
          >
            <button
              onClick={dismissForever}
              aria-label={t('Close')}
              className="absolute top-3 end-3 p-1.5 rounded-full text-silver hover:text-warm-light hover:bg-surface-2 transition-colors"
            >
              <X size={16} />
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-400/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={26} className="text-emerald-500" />
                </div>
                <h2 className="text-lg font-bold text-warm-light mb-1">{t('Thanks for the feedback!')}</h2>
                <p className="text-sm text-silver">{t('It helps us keep improving THE VALUE.')}</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-warm-light mb-1">{t('How are we doing?')}</h2>
                <p className="text-sm text-silver mb-5">{t('Rate your experience with THE VALUE.')}</p>

                <div className="flex items-center justify-center gap-1.5 mb-6">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${n} ${t('stars')}`}
                      className="p-0.5"
                    >
                      <Star
                        size={30}
                        className={
                          n <= (hoverRating || rating)
                            ? 'fill-brand text-brand transition-colors'
                            : 'text-surface-2 transition-colors'
                        }
                      />
                    </button>
                  ))}
                </div>

                <p className="text-sm font-medium text-warm-light mb-3 text-center">
                  {t('Would you recommend this website to others?')}
                </p>
                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setRecommend('yes')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${
                      recommend === 'yes'
                        ? 'border-brand bg-brand/10 text-warm-light'
                        : 'border-surface-2 text-warm hover:border-brand/40'
                    }`}
                  >
                    <ThumbsUp size={15} />
                    {t('Yes')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommend('no')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${
                      recommend === 'no'
                        ? 'border-brand bg-brand/10 text-warm-light'
                        : 'border-surface-2 text-warm hover:border-brand/40'
                    }`}
                  >
                    <ThumbsDown size={15} />
                    {t('No')}
                  </button>
                </div>

                {error && <p className="text-xs text-red-500 mb-3 text-center">{error}</p>}

                <Button
                  fullWidth
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={!rating || !recommend}
                >
                  {t('Submit Review')}
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
