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
    console.log('[Storage] CV data saved successfully:', data);
  } catch (err) {
    console.error('[Storage] Failed to save CV data:', err);
  }
}

export function loadCV() {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(KEYS.CV);
    if (!raw) { console.log('[Storage] No CV data found in localStorage'); return null; }
    const data = JSON.parse(raw);
    console.log('[Storage] CV data loaded successfully:', data);
    return data;
  } catch (err) {
    console.error('[Storage] Failed to load CV data:', err);
    return null;
  }
}

export function clearCV() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.CV);
  console.log('[Storage] CV data cleared');
}

// ─── Assessment Storage ───────────────────────────────────────────────────────

export function saveAssessment(data) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(KEYS.ASSESSMENT, JSON.stringify(data));
    console.log('[Storage] Assessment data saved successfully:', data);
  } catch (err) {
    console.error('[Storage] Failed to save assessment data:', err);
  }
}

export function loadAssessment() {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(KEYS.ASSESSMENT);
    if (!raw) { console.log('[Storage] No assessment data found in localStorage'); return null; }
    const data = JSON.parse(raw);
    console.log('[Storage] Assessment data loaded successfully:', data);
    return data;
  } catch (err) {
    console.error('[Storage] Failed to load assessment data:', err);
    return null;
  }
}

export function clearAssessment() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.ASSESSMENT);
  console.log('[Storage] Assessment data cleared');
}

// ─── Phone Number Utility ─────────────────────────────────────────────────────

export function getPhoneFromCV() {
  const cv = loadCV();
  const phone = cv?.personalInfo?.phone ?? null;
  console.log('[Storage] Phone number retrieved:', phone);
  return phone;
}
