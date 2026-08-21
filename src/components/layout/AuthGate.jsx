'use client';

import { useEffect, useRef, useState } from 'react';
import { Phone } from 'lucide-react';
import { useAuth, GOOGLE_CLIENT_ID, ALLOW_SKIP_SIGNIN } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import { HeroBackground } from '@/components/layout/HeroBackground';
import { PhoneSignIn } from '@/components/layout/PhoneSignIn';
import { Button } from '@/components/ui/Button';

// hl=en keeps Google's own button/popup text in English regardless of site
// language — avoids the Arabic label overflowing the button's fixed width.
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client?hl=en';
let scriptLoadPromise = null;

export function loadGoogleScript() {
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
  const [signInError, setSignInError] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    if (user || !ready) return;
    let cancelled = false;

    console.log('[AuthGate] Loading Google Identity Services script…');
    loadGoogleScript().then(() => {
      if (cancelled || !window.google?.accounts?.id || !buttonRef.current) return;
      console.log('[AuthGate] Google script ready, rendering sign-in button. client_id =', GOOGLE_CLIENT_ID);
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          console.log('[AuthGate] Google button callback fired — got an ID token.');
          setSigningIn(true);
          setSignInError(false);
          const ok = await signIn(response.credential);
          setSigningIn(false);
          if (!ok) {
            console.error('[AuthGate] signIn() failed — see the [Auth] logs above for the backend response.');
            setSignInError(true);
          }
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
        logo_alignment: 'left',
        width: 300,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [user, ready, signIn]);

  if (!ready) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-dark px-4 overflow-hidden">
        <HeroBackground variant="authgate" />
        <div className="relative z-10 max-w-sm w-full text-center">
          <img src="/Logo (1).png" alt="THE VALUE" className="h-14 w-auto object-contain mx-auto mb-4" />
          <p className="text-brand font-bold text-lg tracking-widest mb-1">THE VALUE</p>
          <h1 className="text-2xl font-bold text-warm-light mb-2">{t('Welcome — sign in to get started')}</h1>
          <p className="text-silver text-sm mb-8 leading-relaxed">
            {t('Sign in with Google to use THE VALUE — upload your CV, take assessments, and track your ranking.')}
          </p>
          <div className="flex justify-center" ref={buttonRef} />

          {signingIn && (
            <p className="mt-4 text-xs text-silver">{t('Signing in…')}</p>
          )}

          {signInError && (
            <p className="mt-4 text-xs text-red-400">
              {t('Sign-in failed — the backend rejected the request. Check the browser console for details.')}
            </p>
          )}

          <div className="mt-5 flex items-center gap-3">
            <span className="flex-1 h-px bg-surface-2" />
            <span className="text-xs text-silver">{t('or')}</span>
            <span className="flex-1 h-px bg-surface-2" />
          </div>

          {!showPhone ? (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Phone size={16} />}
                onClick={() => setShowPhone(true)}
                className="rounded-full w-full max-w-75"
              >
                {t('Sign in with phone number')}
              </Button>
            </div>
          ) : (
            <PhoneSignIn />
          )}

          {(process.env.NODE_ENV !== 'production' || ALLOW_SKIP_SIGNIN) && (
            <button
              onClick={devBypass}
              className="mt-6 text-xs text-silver hover:text-warm underline underline-offset-2 transition-colors"
            >
              {t('Skip sign-in')}
            </button>
          )}
        </div>
      </div>
    );
  }

  return children;
}
