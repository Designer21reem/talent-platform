'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

function newEntry() {
  return { id: crypto.randomUUID(), institution: '', degree: '', field: '', startYear: '', endYear: '' };
}

export function EducationStep({ data, onChange }) {
  console.log('[EducationStep] Rendered with', data.length, 'entries');

  function addEntry() {
    const entry = newEntry();
    console.log('[EducationStep] Adding entry:', entry.id);
    onChange([...data, entry]);
  }

  function removeEntry(id) {
    console.log('[EducationStep] Removing entry:', id);
    onChange(data.filter((e) => e.id !== id));
  }

  function updateEntry(id, field, value) {
    console.log(`[EducationStep] Updating entry ${id}, field "${field}":`, value);
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-slate-900">Education</h2>
      <p className="text-sm text-slate-500">Add your academic background, starting with the most recent.</p>

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
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <GraduationCap size={16} className="text-blue-500" />
                  Education {i + 1}
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Institution"
                  placeholder="University / School name"
                  value={entry.institution}
                  onChange={(e) => updateEntry(entry.id, 'institution', e.target.value)}
                />
                <Input
                  label="Degree"
                  placeholder="e.g. Bachelor of Science"
                  value={entry.degree}
                  onChange={(e) => updateEntry(entry.id, 'degree', e.target.value)}
                />
                <Input
                  label="Field of Study"
                  placeholder="e.g. Computer Science"
                  value={entry.field}
                  onChange={(e) => updateEntry(entry.id, 'field', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Start Year"
                    placeholder="2019"
                    maxLength={4}
                    value={entry.startYear}
                    onChange={(e) => updateEntry(entry.id, 'startYear', e.target.value)}
                  />
                  <Input
                    label="End Year"
                    placeholder="2023"
                    maxLength={4}
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
        <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
          No education added yet. Click below to add one.
        </div>
      )}

      <Button variant="outline" size="sm" onClick={addEntry} leftIcon={<Plus size={15} />}>
        Add Education
      </Button>
    </div>
  );
}
