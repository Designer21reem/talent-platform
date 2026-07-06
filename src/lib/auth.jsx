'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// TODO(backend): the id_token is only decoded client-side here to gate the
// UI and show basic profile info. A real deployment must send this token
// to the backend and verify it there before trusting the identity.
export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '670447319421-l63joridhuamj4jg15uqupj7emthrnv2.apps.googleusercontent.com';

// Toggle via the NEXT_PUBLIC_ALLOW_SKIP_SIGNIN env var (set on Vercel).
// Lets people in without Google sign-in while the OAuth consent screen
// isn't verified yet. Turn it off once Google sign-in is fully working.
export const ALLOW_SKIP_SIGNIN = process.env.NEXT_PUBLIC_ALLOW_SKIP_SIGNIN === 'true';

const STORAGE_KEY = 'talent_google_user';
const AuthContext = createContext(null);

function decodeCredential(token) {
  try {
    const payload = token.split('.')[1];
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
      }
    }
    setReady(true);
  }, []);

  const signIn = useCallback((credential) => {
    const payload = decodeCredential(credential);
    if (!payload) return;
    const nextUser = { name: payload.name, email: payload.email, picture: payload.picture };
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Escape hatch for origins where the Google button won't work yet (e.g.
  // localhost, or a Vercel domain not yet registered in Google Cloud Console
  // for GOOGLE_CLIENT_ID). Only active when ALLOW_SKIP_SIGNIN is on.
  const devBypass = useCallback(() => {
    if (process.env.NODE_ENV !== 'production' || ALLOW_SKIP_SIGNIN) {
      const nextUser = { name: 'Local Preview', email: 'dev@localhost', picture: null };
      setUser(nextUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signOut, devBypass }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
