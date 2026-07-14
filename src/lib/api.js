// Backend connection settings — override via .env.local for a different
// environment. NEXT_PUBLIC_* vars are inlined at build time, so the app
// must be restarted after changing them.
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://ec2-18-184-150-223.eu-central-1.compute.amazonaws.com:8000';
