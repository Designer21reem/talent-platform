'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UNIVERSITIES, DEGREES, FIELDS_OF_STUDY, OTHER_VALUE, toOptions } from '@/lib/formOptions';

const UNIVERSITY_OPTIONS = toOptions(UNIVERSITIES);
const DEGREE_OPTIONS = toOptions(DEGREES);
const FIELD_OPTIONS = toOptions(FIELDS_OF_STUDY);

function newEntry() {
  return {
    id: crypto.randomUUID(),
    institution: '',
    institutionOther: false,
    degree: '',
    degreeOther: false,
    field: '',
    fieldOther: false,
    startYear: '',
    endYear: '',
  };
}

function DropdownWithOther({ label, options, otherFlag, value, onSelect, onCustomChange, placeholder }) {
  return (
    <div className="space-y-2">
      <Select
        label={label}
        placeholder={placeholder}
        options={options}
        value={otherFlag ? OTHER_VALUE : value}
        onChange={(e) => onSelect(e.target.value)}
      />
      {otherFlag && (
        <Input
          placeholder={`Type your ${label.toLowerCase()}`}
          value={value}
          onChange={(e) => onCustomChange(e.target.value)}
        />
      )}
    </div>
  );
}

export function EducationStep({ data, onChange }) {
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
      <h2 className="text-xl font-semibold text-warm-light">Education</h2>
      <p className="text-sm text-silver">Add your academic background, starting with the most recent.</p>

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
                  Education {i + 1}
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-1.5 rounded-lg text-silver hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DropdownWithOther
                  label="Institution"
                  placeholder="Select institution…"
                  options={UNIVERSITY_OPTIONS}
                  otherFlag={entry.institutionOther}
                  value={entry.institution}
                  onSelect={(v) => selectField(entry.id, 'institution', 'institutionOther', v)}
                  onCustomChange={(v) => updateEntry(entry.id, 'institution', v)}
                />
                <DropdownWithOther
                  label="Degree"
                  placeholder="Select degree…"
                  options={DEGREE_OPTIONS}
                  otherFlag={entry.degreeOther}
                  value={entry.degree}
                  onSelect={(v) => selectField(entry.id, 'degree', 'degreeOther', v)}
                  onCustomChange={(v) => updateEntry(entry.id, 'degree', v)}
                />
                <DropdownWithOther
                  label="Field of Study"
                  placeholder="Select field of study…"
                  options={FIELD_OPTIONS}
                  otherFlag={entry.fieldOther}
                  value={entry.field}
                  onSelect={(v) => selectField(entry.id, 'field', 'fieldOther', v)}
                  onCustomChange={(v) => updateEntry(entry.id, 'field', v)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Start Date"
                    type="date"
                    value={entry.startYear}
                    onChange={(e) => updateEntry(entry.id, 'startYear', e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={entry.endYear}
                    onChange={(e) => updateEntry(entry.id, 'endYear', e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {data.length === 0 && (
        <div className="text-center py-8 text-silver text-sm border-2 border-dashed border-surface-2 rounded-xl">
          No education added yet. Click below to add one.
        </div>
      )}

      <Button variant="outline" size="sm" onClick={addEntry} leftIcon={<Plus size={15} />}>
        Add Education
      </Button>
    </div>
  );
}
