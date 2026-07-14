'use client';

import Link from 'next/link';
import { Checkbox } from '@/components/ui/Checkbox';
import { useLanguage } from '@/lib/i18n';

export function ConsentCheckboxes({ value, onChange }) {
  const { t } = useLanguage();

  function toggle(key) {
    onChange({ ...value, [key]: !value[key] });
  }

  return (
    <div className="space-y-3">
      <Checkbox
        id="consent-terms"
        label={
          <span>
            {t('I accept the')}{' '}
            <Link
              href="/terms"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-brand underline underline-offset-2 hover:text-brand-light transition-colors"
            >
              {t('terms & conditions')}
            </Link>
            .
          </span>
        }
        checked={value.acceptTerms}
        onChange={() => toggle('acceptTerms')}
      />
      <Checkbox
        id="consent-recruiter"
        label={t("Show my CV to my organization's recruiter team.")}
        checked={value.showToRecruiter}
        onChange={() => toggle('showToRecruiter')}
      />
    </div>
  );
}

export const EMPTY_CONSENT = {
  acceptTerms: false,
  showToRecruiter: false,
};
