'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { SelectWithOther } from '@/components/ui/SelectWithOther';
import { DatePicker } from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { COMPANIES, JOB_TITLES, OTHER_VALUE } from '@/lib/formOptions';
import { useLanguage } from '@/lib/i18n';

function newEntry() {
  return {
    id: crypto.randomUUID(),
    company: '',
    companyOther: false,
    position: '',
    positionOther: false,
    startDate: '',
    endDate: '',
    current: false,
    repoUrl: '',
    description: '',
  };
}

export function WorkExperienceStep({ data, onChange }) {
  const { t } = useLanguage();

  function addEntry() {
    onChange([...data, newEntry()]);
  }

  function removeEntry(id) {
    onChange(data.filter((e) => e.id !== id));
  }

  function updateEntry(id, field, value) {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function selectField(id, field, otherFlagField, selected) {
    if (selected === OTHER_VALUE) {
      onChange(data.map((e) => (e.id === id ? { ...e, [field]: '', [otherFlagField]: true } : e)));
    } else {
      onChange(data.map((e) => (e.id === id ? { ...e, [field]: selected, [otherFlagField]: false } : e)));
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-warm-light">{t('Work Experience')}</h2>
      <p className="text-sm text-silver">{t('List your professional experience, most recent first.')}</p>

      <AnimatePresence initial={false}>
        {data.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            <Card padding="md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-medium text-silver">
                  <Briefcase size={16} className="text-brand" />
                  {t('Position')} {i + 1}
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-1.5 rounded-lg text-silver hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectWithOther
                  label={t('Company')}
                  placeholder={t('Select company…')}
                  otherPlaceholder={t('Type the company name')}
                  list={COMPANIES}
                  otherFlag={entry.companyOther}
                  value={entry.company}
                  onSelect={(v) => selectField(entry.id, 'company', 'companyOther', v)}
                  onCustomChange={(v) => updateEntry(entry.id, 'company', v)}
                />
                <SelectWithOther
                  label={t('Position / Title')}
                  placeholder={t('Select position…')}
                  otherPlaceholder={t('Type your position / title')}
                  list={JOB_TITLES}
                  otherFlag={entry.positionOther}
                  value={entry.position}
                  onSelect={(v) => selectField(entry.id, 'position', 'positionOther', v)}
                  onCustomChange={(v) => updateEntry(entry.id, 'position', v)}
                />
                <DatePicker
                  label={t('Start Date')}
                  placeholder={t('Select…')}
                  value={entry.startDate}
                  onChange={(v) => updateEntry(entry.id, 'startDate', v)}
                />
                {!entry.current && (
                  <DatePicker
                    label={t('End Date')}
                    placeholder={t('Select…')}
                    value={entry.endDate}
                    onChange={(v) => updateEntry(entry.id, 'endDate', v)}
                  />
                )}
              </div>

              <label className="flex items-center gap-2 mt-3 cursor-pointer text-sm text-silver">
                <input
                  type="checkbox"
                  checked={entry.current}
                  onChange={(e) => updateEntry(entry.id, 'current', e.target.checked)}
                  className="w-4 h-4 rounded accent-brand"
                />
                {t('I currently work here')}
              </label>

              <div className="mt-4 grid grid-cols-1 gap-4">
                <Input
                  label={t('Repository / Project Link (optional)')}
                  placeholder="https://github.com/…"
                  value={entry.repoUrl}
                  onChange={(e) => updateEntry(entry.id, 'repoUrl', e.target.value)}
                />
                <Textarea
                  label={t('Key Achievements & Responsibilities')}
                  placeholder={t('Describe your responsibilities and achievements…')}
                  value={entry.description}
                  onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                  showCount
                  maxLength={600}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {data.length === 0 && (
        <div className="text-center py-8 text-silver text-sm border-2 border-dashed border-surface-2 rounded-xl">
          {t('No experience added yet.')}
        </div>
      )}

      <Button variant="outline" size="sm" onClick={addEntry} leftIcon={<Plus size={15} />}>
        {t('Add Experience')}
      </Button>
    </div>
  );
}
