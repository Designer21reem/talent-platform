'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

// TODO(client): replace with the real Cloudflare Turnstile site key from
// dash.cloudflare.com -> Turnstile once issued. This is Cloudflare's
// official "always passes" test key — safe to ship while developing, but
// must be swapped before going live.
const TURNSTILE_SITE_KEY = '1x00000000000000000000AA';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

let scriptLoadPromise = null;

function loadTurnstileScript() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
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

// Cloudflare Turnstile widget — verifies the user isn't a bot before an
// upload/submit action is allowed to proceed. Call sites should keep the
// verified token in state and disable their submit button until it's set.
export function Turnstile({ onVerify, onExpire, className }) {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => onVerify?.(token),
        'expired-callback': () => onExpire?.(),
        'error-callback': () => onExpire?.(),
      });
      setReady(true);
    });

    return () => {
      cancelled = true;
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn('relative', className)}>
      {/* Shown while the Cloudflare script + widget are still loading, so
          the gap doesn't read as the site being broken. */}
      {!ready && (
        <div className="flex items-center gap-2 text-xs text-silver py-2">
          <span className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin shrink-0" />
          {t('Preparing verification…')}
        </div>
      )}
      <div ref={containerRef} className={ready ? '' : 'hidden'} />
    </div>
  );
}
