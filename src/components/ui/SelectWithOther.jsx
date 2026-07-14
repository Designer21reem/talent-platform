'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { OTHER_VALUE } from '@/lib/formOptions';
import { useLanguage } from '@/lib/i18n';

// A <Select> bound to a fixed list, plus a free-text fallback when the user
// picks "Other" — shared by Education, Work Experience, Skills, Languages.
export function SelectWithOther({
  label,
  placeholder,
  otherPlaceholder,
  list,
  otherFlag,
  value,
  onSelect,
  onCustomChange,
  required,
}) {
  const { t } = useLanguage();
  const options = [
    ...list.map((v) => ({ value: v, label: t(v) })),
    { value: OTHER_VALUE, label: t('Other (type your own)') },
  ];

  return (
    <div className="space-y-2">
      <Select
        label={label}
        placeholder={placeholder}
        options={options}
        value={otherFlag ? OTHER_VALUE : value}
        onChange={(e) => onSelect(e.target.value)}
        required={required}
      />
      {otherFlag && (
        <Input
          placeholder={otherPlaceholder}
          value={value}
          onChange={(e) => onCustomChange(e.target.value)}
        />
      )}
    </div>
  );
}
