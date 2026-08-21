'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { BACKEND_URL } from '@/lib/api';

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '670447319421-l63joridhuamj4jg15uqupj7emthrnv2.apps.googleusercontent.com';

// Toggle via the NEXT_PUBLIC_ALLOW_SKIP_SIGNIN env var (set on Vercel).
// Lets people in without Google sign-in while the OAuth consent screen
// isn't verified yet. Turn it off once Google sign-in is fully working.
export const ALLOW_SKIP_SIGNIN = process.env.NEXT_PUBLIC_ALLOW_SKIP_SIGNIN === 'true';

const USER_STORAGE_KEY = 'talent_google_user';
const TOKEN_STORAGE_KEY = 'talent_jwt';
const USER_ID_STORAGE_KEY = 'talent_user_id';
const AuthContext = createContext(null);

// Decodes a JWT's payload without verifying the signature — good enough to
// inspect `aud`/`exp` client-side while diagnosing why a backend rejected
// the token (signature verification only happens server-side, on purpose).
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const rawUser = typeof window !== 'undefined' ? localStorage.getItem(USER_STORAGE_KEY) : null;
    const rawToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
    const rawUserId = typeof window !== 'undefined' ? localStorage.getItem(USER_ID_STORAGE_KEY) : null;
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch {
      }
    }
    if (rawToken) setToken(rawToken);
    if (rawUserId) setUserId(rawUserId);
    setReady(true);
  }, []);

  // Sends the Google ID token to our backend for verification, then stores
  // the backend's own JWT (used as the Bearer token for every other API
  // call, e.g. the S3 upload flow) plus the user profile it returns.
  // Logs every step so a failed hookup is easy to diagnose from devtools.
  const signIn = useCallback(async (credential) => {
    console.log('[Auth] Step 1/5 — Google sign-in: ID token received from Google.');

    // Inspect the token client-side (no signature check — that's the
    // backend's job) so a rejection can be diagnosed without leaving the
    // console: does the audience match what we think our client_id is,
    // and is the token actually still within its validity window.
    const payload = decodeJwtPayload(credential);
    let audMatches = null;
    if (payload) {
      audMatches = payload.aud === GOOGLE_CLIENT_ID;
      const expiresAt = payload.exp ? new Date(payload.exp * 1000) : null;
      const isExpired = expiresAt ? expiresAt.getTime() < Date.now() : null;
      console.log('[Auth] Step 2/5 — Decoded ID token payload:', {
        aud: payload.aud,
        iss: payload.iss,
        email: payload.email,
        exp: expiresAt?.toISOString() ?? null,
        expired: isExpired,
      });
      console.log(
        audMatches
          ? '[Auth] Step 3/5 — ✅ token audience (aud) matches our GOOGLE_CLIENT_ID.'
          : `[Auth] Step 3/5 — ❌ token audience (aud) MISMATCH.\n    token.aud        = ${payload.aud}\n    our GOOGLE_CLIENT_ID = ${GOOGLE_CLIENT_ID}`
      );
      if (isExpired) {
        console.warn('[Auth] Step 3/5 — ⚠️ the ID token is already expired — sign in again and retry immediately.');
      }
    } else {
      console.warn('[Auth] Step 2/5 — Could not decode the ID token payload (unexpected token format).');
    }

    console.log('[Auth] Step 4/5 — contacting backend…', `${BACKEND_URL}/auth/google`);

    let res;
    try {
      res = await fetch(`${BACKEND_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential }),
      });
    } catch (err) {
      console.error('[Auth] Network error reaching the backend (is it running / reachable?):', err);
      return false;
    }

    console.log('[Auth] Step 5/5 — /auth/google responded with status:', res.status);

    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      console.error('[Auth] Response was not valid JSON:', err);
    }
    console.log('[Auth] /auth/google response body:', data);

    if (!res.ok) {
      console.error('[Auth] Backend rejected the Google sign-in:', data);
      if (audMatches === true) {
        console.error(
          '[Auth] VERDICT: the token audience MATCHED our client_id, yet the backend still rejected it.\n' +
          '  → The bug is on the BACKEND side (env var not actually applied on that server, wrong client secret, ' +
          'broken/outdated verification code, or the backend is secretly pointed at a different Google Cloud project). ' +
          'This is not fixable from this frontend repo — check the backend logs for the real exception.'
        );
      } else if (audMatches === false) {
        console.error(
          '[Auth] VERDICT: the token audience did NOT match our client_id.\n' +
          '  → Frontend and backend are configured with two different Google OAuth Client IDs. Align NEXT_PUBLIC_GOOGLE_CLIENT_ID ' +
          '(frontend) with whatever the backend actually validates against.'
        );
      }
      return false;
    }

    await applyAuthSession(data);
    return true;
  }, []);

  // Shared by every auth method (Google, phone/OTP, …) once a backend
  // response with { access_token, user } is in hand — stores the session
  // and resolves the numeric user_id used by user-scoped endpoints.
  const applyAuthSession = useCallback(async (data) => {
    const nextUser = {
      name: data?.user?.full_name ?? null,
      email: data?.user?.email ?? null,
      phone: data?.user?.phone ?? null,
      picture: data?.user?.picture ?? null,
    };

    const accessTokenPayload = decodeJwtPayload(data.access_token);
    const nextUserId =
      data?.user?.id ??
      data?.user?.user_id ??
      accessTokenPayload?.user_id ??
      accessTokenPayload?.sub ??
      accessTokenPayload?.id ??
      null;
    console.log('[Auth] Resolved user_id for user-scoped API calls:', nextUserId, '(decoded access_token payload:', accessTokenPayload, ')');

    setUser(nextUser);
    setToken(data.access_token);
    setUserId(nextUserId);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
    if (nextUserId != null) {
      localStorage.setItem(USER_ID_STORAGE_KEY, String(nextUserId));
    } else {
      localStorage.removeItem(USER_ID_STORAGE_KEY);
    }
    console.log('[Auth] Signed in successfully as', nextUser.email ?? nextUser.phone, '— JWT stored for API calls.');

    // Sanity-check the JWT immediately against /auth/me — if this fails,
    // the token itself is bad even though sign-in "succeeded". Also doubles
    // as a fallback source for user_id if none of the earlier lookups found one.
    try {
      const meRes = await fetch(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const meData = await meRes.json().catch(() => null);
      console.log('[Auth] /auth/me verification — status:', meRes.status, 'body:', meData);

      if (nextUserId == null && meRes.ok) {
        const meUserId = meData?.id ?? meData?.user_id ?? meData?.user?.id ?? null;
        if (meUserId != null) {
          console.log('[Auth] Resolved user_id from /auth/me instead:', meUserId);
          setUserId(meUserId);
          localStorage.setItem(USER_ID_STORAGE_KEY, String(meUserId));
        }
      }
    } catch (err) {
      console.error('[Auth] /auth/me verification call failed:', err);
    }
  }, []);

  // ── Phone sign-in ────────────────────────────────────────────────────────
  // Frontend half of phone-number sign-in. The backend endpoints below
  // (/auth/phone/request-otp, /auth/phone/verify) don't exist yet — this
  // calls them anyway so the UI is ready the moment the backend adds them,
  // and logs a clear diagnosis if they 404/fail in the meantime.
  const requestPhoneOtp = useCallback(async (phone) => {
    console.log('[Auth] Requesting a phone OTP for', phone);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/phone/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json().catch(() => null);
      console.log('[Auth] /auth/phone/request-otp responded with status:', res.status, 'body:', data);
      if (!res.ok) {
        if (res.status === 404) {
          console.error(
            '[Auth] VERDICT: /auth/phone/request-otp does not exist on the backend yet. ' +
            'This is not fixable from the frontend repo — the phone sign-in endpoints need to be added backend-side.'
          );
        }
        return { ok: false, message: data?.detail || 'Could not send a verification code.' };
      }
      return { ok: true };
    } catch (err) {
      console.error('[Auth] Network error requesting phone OTP:', err);
      return { ok: false, message: 'Could not reach the backend.' };
    }
  }, []);

  const verifyPhoneOtp = useCallback(async (phone, code) => {
    console.log('[Auth] Verifying phone OTP for', phone);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/phone/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json().catch(() => null);
      console.log('[Auth] /auth/phone/verify responded with status:', res.status, 'body:', data);
      if (!res.ok) {
        if (res.status === 404) {
          console.error(
            '[Auth] VERDICT: /auth/phone/verify does not exist on the backend yet. ' +
            'This is not fixable from the frontend repo — the phone sign-in endpoints need to be added backend-side.'
          );
        }
        return { ok: false, message: data?.detail || 'Invalid or expired code.' };
      }
      await applyAuthSession(data);
      return { ok: true };
    } catch (err) {
      console.error('[Auth] Network error verifying phone OTP:', err);
      return { ok: false, message: 'Could not reach the backend.' };
    }
  }, [applyAuthSession]);

  const signOut = useCallback(() => {
    console.log('[Auth] Signing out.');
    setUser(null);
    setToken(null);
    setUserId(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_ID_STORAGE_KEY);
  }, []);

  // Escape hatch for origins where the Google button won't work yet (e.g.
  // localhost, or a Vercel domain not yet registered in Google Cloud Console
  // for GOOGLE_CLIENT_ID). Only active when ALLOW_SKIP_SIGNIN is on. No
  // backend call happens here, so there is no JWT — API calls that require
  // auth (like the S3 upload) will fail until a real sign-in occurs.
  const devBypass = useCallback(() => {
    if (process.env.NODE_ENV !== 'production' || ALLOW_SKIP_SIGNIN) {
      console.warn('[Auth] Dev bypass used — signed in locally only, no backend JWT was issued.');
      const nextUser = { name: 'Local Preview', email: 'dev@localhost', picture: null };
      setUser(nextUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, userId, ready, signIn, signOut, devBypass, requestPhoneOtp, verifyPhoneOtp }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
