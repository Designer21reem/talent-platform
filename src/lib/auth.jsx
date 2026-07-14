'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { BACKEND_URL } from '@/lib/api';

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '1004162755765-pma78u77c26ol0e3r7r2a72unu45jp65.apps.googleusercontent.com';

// Toggle via the NEXT_PUBLIC_ALLOW_SKIP_SIGNIN env var (set on Vercel).
// Lets people in without Google sign-in while the OAuth consent screen
// isn't verified yet. Turn it off once Google sign-in is fully working.
export const ALLOW_SKIP_SIGNIN = process.env.NEXT_PUBLIC_ALLOW_SKIP_SIGNIN === 'true';

const USER_STORAGE_KEY = 'talent_google_user';
const TOKEN_STORAGE_KEY = 'talent_jwt';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const rawUser = typeof window !== 'undefined' ? localStorage.getItem(USER_STORAGE_KEY) : null;
    const rawToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch {
      }
    }
    if (rawToken) setToken(rawToken);
    setReady(true);
  }, []);

  // Sends the Google ID token to our backend for verification, then stores
  // the backend's own JWT (used as the Bearer token for every other API
  // call, e.g. the S3 upload flow) plus the user profile it returns.
  // Logs every step so a failed hookup is easy to diagnose from devtools.
  const signIn = useCallback(async (credential) => {
    console.log('[Auth] Google sign-in: credential received, contacting backend…', `${BACKEND_URL}/auth/google`);

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

    console.log('[Auth] /auth/google responded with status:', res.status);

    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      console.error('[Auth] Response was not valid JSON:', err);
    }
    console.log('[Auth] /auth/google response body:', data);

    if (!res.ok) {
      console.error('[Auth] Backend rejected the Google sign-in:', data);
      return false;
    }

    const nextUser = {
      name: data?.user?.full_name ?? null,
      email: data?.user?.email ?? null,
      picture: data?.user?.picture ?? null,
    };
    setUser(nextUser);
    setToken(data.access_token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
    console.log('[Auth] Signed in successfully as', nextUser.email, '— JWT stored for API calls.');

    // Sanity-check the JWT immediately against /auth/me — if this fails,
    // the token itself is bad even though sign-in "succeeded".
    try {
      const meRes = await fetch(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const meData = await meRes.json().catch(() => null);
      console.log('[Auth] /auth/me verification — status:', meRes.status, 'body:', meData);
    } catch (err) {
      console.error('[Auth] /auth/me verification call failed:', err);
    }

    return true;
  }, []);

  const signOut = useCallback(() => {
    console.log('[Auth] Signing out.');
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
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
    <AuthContext.Provider value={{ user, token, ready, signIn, signOut, devBypass }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
