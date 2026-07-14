'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { Combobox } from '@/components/ui/Combobox';
import { SelectWithOther } from '@/components/ui/SelectWithOther';
import { DatePicker } from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UNIVERSITIES, DEGREES, FIELDS_OF_STUDY, OTHER_VALUE } from '@/lib/formOptions';
import { useLanguage } from '@/lib/i18n';

function newEntry() {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    degreeOther: false,
    field: '',
    fieldOther: false,
    startYear: '',
    endYear: '',
  };
}

export function EducationStep({ data, onChange }) {
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
      <h2 className="text-xl font-semibold text-warm-light">{t('Education')}</h2>
      <p className="text-sm text-silver">{t('Add your academic background, starting with the most recent.')}</p>

      <AnimatePresence initial={false}>
        {data.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            <Card padding="md" className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-medium text-silver">
                  <GraduationCap size={16} className="text-brand" />
                  {t('Education')} {i + 1}
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-1.5 rounded-lg text-silver hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Combobox
                  label={t('Institution')}
                  placeholder={t('Type to search institutions…')}
                  value={entry.institution}
                  onChange={(v) => updateEntry(entry.id, 'institution', v)}
                  options={UNIVERSITIES}
                />
                <SelectWithOther
                  t={t}
                  label={t('Degree')}
                  placeholder={t('Select degree…')}
                  otherPlaceholder={t('Type your degree')}
                  list={DEGREES}
                  otherFlag={entry.degreeOther}
                  value={entry.degree}
                  onSelect={(v) => selectField(entry.id, 'degree', 'degreeOther', v)}
                  onCustomChange={(v) => updateEntry(entry.id, 'degree', v)}
                />
                <SelectWithOther
                  t={t}
                  label={t('Field of Study')}
                  placeholder={t('Select field of study…')}
                  otherPlaceholder={t('Type your field of study')}
                  list={FIELDS_OF_STUDY}
                  otherFlag={entry.fieldOther}
                  value={entry.field}
                  onSelect={(v) => selectField(entry.id, 'field', 'fieldOther', v)}
                  onCustomChange={(v) => updateEntry(entry.id, 'field', v)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <DatePicker
                    label={t('Start Date')}
                    placeholder={t('Select…')}
                    value={entry.startYear}
                    onChange={(v) => updateEntry(entry.id, 'startYear', v)}
                  />
                  <DatePicker
                    label={t('End Date')}
                    placeholder={t('Select…')}
                    value={entry.endYear}
                    onChange={(v) => updateEntry(entry.id, 'endYear', v)}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {data.length === 0 && (
        <div className="text-center py-8 text-silver text-sm border-2 border-dashed border-surface-2 rounded-xl">
          {t('No education added yet. Click below to add one.')}
        </div>
      )}

      <Button variant="outline" size="sm" onClick={addEntry} leftIcon={<Plus size={15} />}>
        {t('Add Education')}
      </Button>
    </div>
  );
}
