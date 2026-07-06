'use client';

import { useEffect, useRef } from 'react';
import { useAuth, GOOGLE_CLIENT_ID } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
let scriptLoadPromise = null;

function loadGoogleScript() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve) => {
      const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }
  return scriptLoadPromise;
}

// Blocks the whole site behind Google Sign-In per spec item 5. Renders its
// children only once a signed-in user is present (persisted in localStorage
// so a refresh doesn't force sign-in again).
export function AuthGate({ children }) {
  const { user, ready, signIn, devBypass } = useAuth();
  const { t } = useLanguage();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (user || !ready) return;
    let cancelled = false;

    loadGoogleScript().then(() => {
      if (cancelled || !window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => signIn(response.credential),
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
      });
    });

    return () => {
      cancelled = true;
    };
  }, [user, ready, signIn]);

  if (!ready) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-dark px-4">
        <div className="max-w-sm w-full text-center">
          <img src="/Logo (1).png" alt="THE VALUE" className="h-12 w-auto object-contain mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">{t('Sign in to continue')}</h1>
          <p className="text-silver text-sm mb-8 leading-relaxed">
            {t('Sign in with Google to use THE VALUE — upload your CV, take assessments, and track your ranking.')}
          </p>
          <div className="flex justify-center" ref={buttonRef} />

          {process.env.NODE_ENV !== 'production' && (
            <button
              onClick={devBypass}
              className="mt-6 text-xs text-silver hover:text-warm underline underline-offset-2 transition-colors"
            >
              {t('Skip sign-in (dev preview only)')}
            </button>
          )}
        </div>
      </div>
    );
  }

  return children;
}
