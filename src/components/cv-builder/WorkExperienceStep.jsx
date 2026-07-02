'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { JOB_TITLES, OTHER_VALUE, toOptions } from '@/lib/formOptions';

const JOB_TITLE_OPTIONS = toOptions(JOB_TITLES);

function newEntry() {
  return {
    id: crypto.randomUUID(),
    company: '',
    position: '',
    positionOther: false,
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  };
}

export function WorkExperienceStep({ data, onChange }) {

  function addEntry() {
    const entry = newEntry();
    onChange([...data, entry]);
  }

  function removeEntry(id) {
    onChange(data.filter((e) => e.id !== id));
  }

  function updateEntry(id, field, value) {
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function selectPosition(id, selected) {
    if (selected === OTHER_VALUE) {
      onChange(data.map((e) => (e.id === id ? { ...e, position: '', positionOther: true } : e)));
    } else {
      onChange(data.map((e) => (e.id === id ? { ...e, position: selected, positionOther: false } : e)));
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-warm-light">Work Experience</h2>
      <p className="text-sm text-silver">List your professional experience, most recent first.</p>

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
                  Position {i + 1}
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-1.5 rounded-lg text-silver hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Company"
                  placeholder="Company name"
                  value={entry.company}
                  onChange={(e) => updateEntry(entry.id, 'company', e.target.value)}
                />
                <div className="space-y-2">
                  <Select
                    label="Position / Title"
                    placeholder="Select position…"
                    options={JOB_TITLE_OPTIONS}
                    value={entry.positionOther ? OTHER_VALUE : entry.position}
                    onChange={(e) => selectPosition(entry.id, e.target.value)}
                  />
                  {entry.positionOther && (
                    <Input
                      placeholder="Type your position / title"
                      value={entry.position}
                      onChange={(e) => updateEntry(entry.id, 'position', e.target.value)}
                    />
                  )}
                </div>
                <Input
                  label="Start Date"
                  placeholder="MM/YYYY"
                  value={entry.startDate}
                  onChange={(e) => updateEntry(entry.id, 'startDate', e.target.value)}
                />
                {!entry.current && (
                  <Input
                    label="End Date"
                    placeholder="MM/YYYY"
                    value={entry.endDate}
                    onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)}
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
                I currently work here
              </label>

              <div className="mt-4">
                <Textarea
                  label="Description"
                  placeholder="Describe your responsibilities and achievements…"
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
          No experience added yet.
        </div>
      )}

      <Button variant="outline" size="sm" onClick={addEntry} leftIcon={<Plus size={15} />}>
        Add Experience
      </Button>
    </div>
  );
}
