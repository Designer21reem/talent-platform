const KEYS = {
  CV: 'talent_cv_data',
  ASSESSMENT: 'talent_assessment_data',
};

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

// ─── CV Storage ───────────────────────────────────────────────────────────────

export function saveCV(data) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(KEYS.CV, JSON.stringify(data));
  } catch {
  }
}

export function loadCV() {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(KEYS.CV);
 if (!raw) { return null; }
    const data = JSON.parse(raw);
    return data;
  } catch {
    return null;
  }
}

export function clearCV() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.CV);
}

// ─── Assessment Storage ───────────────────────────────────────────────────────

export function saveAssessment(data) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(KEYS.ASSESSMENT, JSON.stringify(data));
  } catch {
  }
}

export function loadAssessment() {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(KEYS.ASSESSMENT);
 if (!raw) { return null; }
    const data = JSON.parse(raw);
    return data;
  } catch {
    return null;
  }
}

export function clearAssessment() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.ASSESSMENT);
}

// ─── Phone Number Utility ─────────────────────────────────────────────────────

export function getPhoneFromCV() {
  const cv = loadCV();
  const phone = cv?.personalInfo?.phone ?? null;
  return phone;
}
