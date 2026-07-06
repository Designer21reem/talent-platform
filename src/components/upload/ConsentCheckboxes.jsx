'use client';

import { Checkbox } from '@/components/ui/Checkbox';
import { useLanguage } from '@/lib/i18n';

// The 3 consent checkboxes required before an upload/CV-builder submission
// goes through (spec 3.c, reused by CV Builder per spec 4.c).
export function ConsentCheckboxes({ value, onChange }) {
  const { t } = useLanguage();

  function toggle(key) {
    onChange({ ...value, [key]: !value[key] });
  }

  return (
    <div className="space-y-3">
      <Checkbox
        id="consent-terms"
        label={t('I accept the terms and conditions.')}
        checked={value.acceptTerms}
        onChange={() => toggle('acceptTerms')}
      />
      <Checkbox
        id="consent-recruiter"
        label={t("Show my CV to my organization's recruiter team.")}
        checked={value.showToRecruiter}
        onChange={() => toggle('showToRecruiter')}
      />
      <Checkbox
        id="consent-leaderboard"
        label={t('Show me on the Leaderboard page.')}
        checked={value.showOnLeaderboard}
        onChange={() => toggle('showOnLeaderboard')}
      />
    </div>
  );
}

export const EMPTY_CONSENT = {
  acceptTerms: false,
  showToRecruiter: false,
  showOnLeaderboard: false,
};
