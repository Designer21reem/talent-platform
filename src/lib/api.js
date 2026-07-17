// Backend connection settings — override via .env.local for a different
// environment. NEXT_PUBLIC_* vars are inlined at build time, so the app
// must be restarted after changing them.
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.hr-heaven.com';
