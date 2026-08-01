'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useAuth, GOOGLE_CLIENT_ID } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import { loadGoogleScript } from '@/components/layout/AuthGate';

// Renders directly on the Dashboard so a candidate who entered via the
// "Skip sign-in" dev bypass (has `user` but no real backend `token`) can
// upgrade to a real Google session without leaving the page — otherwise
// the only sign-in prompt is the one-time full-screen gate on first visit.
export function DashboardSignIn() {
  const { token, signIn } = useAuth();
  const { t } = useLanguage();
  const buttonRef = useRef(null);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token) return undefined;
    let cancelled = false;

    loadGoogleScript().then(() => {
      if (cancelled || !window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          setSigningIn(true);
          setError(false);
          const ok = await signIn(response.credential);
          setSigningIn(false);
          if (!ok) setError(true);
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_black',
        size: 'medium',
        shape: 'pill',
        text: 'signin_with',
        logo_alignment: 'left',
      });
    });

    return () => {
      cancelled = true;
    };
  }, [token, signIn]);

  if (token) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand/10 border border-brand/30 rounded-xl p-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
          <LogIn size={18} className="text-brand" />
        </div>
        <div>
          <p className="text-sm font-semibold text-warm-light">{t('Sign in to see your real results')}</p>
          <p className="text-xs text-silver mt-0.5">
            {t("You're viewing sample data. Sign in with Google to load your saved assessment.")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div ref={buttonRef} />
        {signingIn && <p className="text-xs text-silver">{t('Signing in…')}</p>}
        {error && <p className="text-xs text-red-400">{t('Sign-in failed. Check the console for details.')}</p>}
      </div>
    </motion.div>
  );
}
