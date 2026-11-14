'use client';

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
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

// ── Session store ───────────────────────────────────────────────────────────
// The signed-in session lives in localStorage and is read through
// useSyncExternalStore: the server/hydration snapshot is "signed out, not
// ready", then React re-renders with the stored session — no hydration
// mismatch, and a sign-in/out in another tab propagates via `storage`.
const AUTH_EVENT = 'tv-auth-change';
const EMPTY_SESSION = Object.freeze({ user: null, token: null, userId: null });

let cachedKey = null;
let cachedSession = EMPTY_SESSION;

function readSession() {
  let rawUser;
  let rawToken;
  let rawUserId;
  try {
    rawUser = localStorage.getItem(USER_STORAGE_KEY);
    rawToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    rawUserId = localStorage.getItem(USER_ID_STORAGE_KEY);
  } catch {
    return EMPTY_SESSION;
  }

  // getSnapshot must return the same object while nothing changed.
  const key = JSON.stringify([rawUser, rawToken, rawUserId]);
  if (key === cachedKey) return cachedSession;

  let user = null;
  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }
  cachedKey = key;
  cachedSession = { user, token: rawToken || null, userId: rawUserId || null };
  return cachedSession;
}

function writeSession({ user, token, userId }) {
  const set = (k, v) => (v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v));
  set(USER_STORAGE_KEY, user ? JSON.stringify(user) : null);
  set(TOKEN_STORAGE_KEY, token);
  set(USER_ID_STORAGE_KEY, userId == null ? null : String(userId));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function subscribeSession(callback) {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

const getServerSession = () => EMPTY_SESSION;
const subscribeNothing = () => () => {};

// ── Auth actions ────────────────────────────────────────────────────────────

// Sends the Google ID token to our backend for verification, then stores
// the backend's own JWT (used as the Bearer token for every other API
// call, e.g. the S3 upload flow) plus the user profile it returns.
// Logs every step so a failed hookup is easy to diagnose from devtools.
async function signIn(credential) {
  // [debug-log] console.log('[Auth] Step 1/5 — Google sign-in: ID token received from Google.');

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
    // [debug-log] console.log('[Auth] Step 2/5 — Decoded ID token payload:', {
      // [debug-log] aud: payload.aud,
      // [debug-log] iss: payload.iss,
      // [debug-log] email: payload.email,
      // [debug-log] exp: expiresAt?.toISOString() ?? null,
      // [debug-log] expired: isExpired,
    // [debug-log] });
    // [debug-log] console.log(
      // [debug-log] audMatches
        // [debug-log] ? '[Auth] Step 3/5 — ✅ token audience (aud) matches our GOOGLE_CLIENT_ID.'
        // [debug-log] : `[Auth] Step 3/5 — ❌ token audience (aud) MISMATCH.\n    token.aud        = ${payload.aud}\n    our GOOGLE_CLIENT_ID = ${GOOGLE_CLIENT_ID}`
    // [debug-log] );
    if (isExpired) {
      // [debug-log] console.warn('[Auth] Step 3/5 — ⚠️ the ID token is already expired — sign in again and retry immediately.');
    }
  } else {
    // [debug-log] console.warn('[Auth] Step 2/5 — Could not decode the ID token payload (unexpected token format).');
  }

  // [debug-log] console.log('[Auth] Step 4/5 — contacting backend…', `${BACKEND_URL}/auth/google`);

  let res;
  try {
    res = await fetch(`${BACKEND_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credential }),
    });
  } catch (err) {
    // [debug-log] console.error('[Auth] Network error reaching the backend (is it running / reachable?):', err);
    return false;
  }

  // [debug-log] console.log('[Auth] Step 5/5 — /auth/google responded with status:', res.status);

  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    // [debug-log] console.error('[Auth] Response was not valid JSON:', err);
  }
  // [debug-log] console.log('[Auth] /auth/google response body:', data);

  if (!res.ok) {
    // [debug-log] console.error('[Auth] Backend rejected the Google sign-in:', data);
    if (audMatches === true) {
      // [debug-log] console.error(
        // [debug-log] '[Auth] VERDICT: the token audience MATCHED our client_id, yet the backend still rejected it.\n' +
        // [debug-log] '  → The bug is on the BACKEND side (env var not actually applied on that server, wrong client secret, ' +
        // [debug-log] 'broken/outdated verification code, or the backend is secretly pointed at a different Google Cloud project). ' +
        // [debug-log] 'This is not fixable from this frontend repo — check the backend logs for the real exception.'
      // [debug-log] );
    } else if (audMatches === false) {
      // [debug-log] console.error(
        // [debug-log] '[Auth] VERDICT: the token audience did NOT match our client_id.\n' +
        // [debug-log] '  → Frontend and backend are configured with two different Google OAuth Client IDs. Align NEXT_PUBLIC_GOOGLE_CLIENT_ID ' +
        // [debug-log] '(frontend) with whatever the backend actually validates against.'
      // [debug-log] );
    }
    return false;
  }

  await applyAuthSession(data);
  return true;
}

// Shared by every auth method (Google, phone/OTP, …) once a backend
// response with { access_token, user } is in hand — stores the session
// and resolves the numeric user_id used by user-scoped endpoints.
async function applyAuthSession(data) {
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
  // [debug-log] console.log('[Auth] Resolved user_id for user-scoped API calls:', nextUserId, '(decoded access_token payload:', accessTokenPayload, ')');

  writeSession({ user: nextUser, token: data.access_token, userId: nextUserId });
  // [debug-log] console.log('[Auth] Signed in successfully as', nextUser.email ?? nextUser.phone, '— JWT stored for API calls.');

  // Sanity-check the JWT immediately against /auth/me — if this fails,
  // the token itself is bad even though sign-in "succeeded". Also doubles
  // as a fallback source for user_id if none of the earlier lookups found one.
  try {
    const meRes = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const meData = await meRes.json().catch(() => null);
    // [debug-log] console.log('[Auth] /auth/me verification — status:', meRes.status, 'body:', meData);

    if (nextUserId == null && meRes.ok) {
      const meUserId = meData?.id ?? meData?.user_id ?? meData?.user?.id ?? null;
      if (meUserId != null) {
        // [debug-log] console.log('[Auth] Resolved user_id from /auth/me instead:', meUserId);
        writeSession({ ...readSession(), userId: meUserId });
      }
    }
  } catch (err) {
    // [debug-log] console.error('[Auth] /auth/me verification call failed:', err);
  }
}

// ── Phone sign-in ────────────────────────────────────────────────────────
// Frontend half of phone-number sign-in. The backend endpoints below
// (/auth/phone/request-otp, /auth/phone/verify) don't exist yet — this
// calls them anyway so the UI is ready the moment the backend adds them,
// and logs a clear diagnosis if they 404/fail in the meantime.
async function requestPhoneOtp(phone) {
  // [debug-log] console.log('[Auth] Requesting a phone OTP for', phone);
  try {
    const res = await fetch(`${BACKEND_URL}/auth/phone/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json().catch(() => null);
    // [debug-log] console.log('[Auth] /auth/phone/request-otp responded with status:', res.status, 'body:', data);
    if (!res.ok) {
      if (res.status === 404) {
        // [debug-log] console.error(
          // [debug-log] '[Auth] VERDICT: /auth/phone/request-otp does not exist on the backend yet. ' +
          // [debug-log] 'This is not fixable from the frontend repo — the phone sign-in endpoints need to be added backend-side.'
        // [debug-log] );
      }
      return { ok: false, message: data?.detail || 'Could not send a verification code.' };
    }
    return { ok: true };
  } catch (err) {
    // [debug-log] console.error('[Auth] Network error requesting phone OTP:', err);
    return { ok: false, message: 'Could not reach the backend.' };
  }
}

async function verifyPhoneOtp(phone, code) {
  // [debug-log] console.log('[Auth] Verifying phone OTP for', phone);
  try {
    const res = await fetch(`${BACKEND_URL}/auth/phone/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json().catch(() => null);
    // [debug-log] console.log('[Auth] /auth/phone/verify responded with status:', res.status, 'body:', data);
    if (!res.ok) {
      if (res.status === 404) {
        // [debug-log] console.error(
          // [debug-log] '[Auth] VERDICT: /auth/phone/verify does not exist on the backend yet. ' +
          // [debug-log] 'This is not fixable from the frontend repo — the phone sign-in endpoints need to be added backend-side.'
        // [debug-log] );
      }
      return { ok: false, message: data?.detail || 'Invalid or expired code.' };
    }
    await applyAuthSession(data);
    return { ok: true };
  } catch (err) {
    // [debug-log] console.error('[Auth] Network error verifying phone OTP:', err);
    return { ok: false, message: 'Could not reach the backend.' };
  }
}

function signOut() {
  // [debug-log] console.log('[Auth] Signing out.');
  writeSession(EMPTY_SESSION);
}

// Escape hatch for origins where the Google button won't work yet (e.g.
// localhost, or a Vercel domain not yet registered in Google Cloud Console
// for GOOGLE_CLIENT_ID). Only active when ALLOW_SKIP_SIGNIN is on. No
// backend call happens here, so there is no JWT — API calls that require
// auth (like the S3 upload) will fail until a real sign-in occurs.
function devBypass() {
  if (process.env.NODE_ENV !== 'production' || ALLOW_SKIP_SIGNIN) {
    // [debug-log] console.warn('[Auth] Dev bypass used — signed in locally only, no backend JWT was issued.');
    const nextUser = { name: 'Local Preview', email: 'dev@localhost', picture: null };
    writeSession({ ...readSession(), user: nextUser });
  }
}

export function AuthProvider({ children }) {
  const session = useSyncExternalStore(subscribeSession, readSession, getServerSession);
  // false during SSR/hydration, true once running in the browser.
  const ready = useSyncExternalStore(subscribeNothing, () => true, () => false);

  const value = useMemo(
    () => ({ ...session, ready, signIn, signOut, devBypass, requestPhoneOtp, verifyPhoneOtp }),
    [session, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
