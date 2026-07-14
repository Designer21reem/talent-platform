'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, FolderGit2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TECHNOLOGIES, OTHER_VALUE } from '@/lib/formOptions';
import { useLanguage } from '@/lib/i18n';

function newEntry() {
  return { id: crypto.randomUUID(), name: '', description: '', technologies: [], url: '' };
}

function TechPicker({ selected, onAdd }) {
  const { t } = useLanguage();
  const [pick, setPick] = useState('');
  const [custom, setCustom] = useState('');

  const options = [
    ...TECHNOLOGIES.filter((tech) => !selected.includes(tech)).map((v) => ({ value: v, label: t(v) })),
    { value: OTHER_VALUE, label: t('Other (type your own)') },
  ];

  function commit() {
    const value = pick === OTHER_VALUE ? custom.trim() : pick;
    if (!value || selected.includes(value)) return;
    onAdd(value);
    setPick('');
    setCustom('');
  }

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Select
          label={t('Technologies Used')}
          placeholder={t('Select a technology…')}
          options={options}
          value={pick}
          onChange={(e) => setPick(e.target.value)}
        />
      </div>
      {pick === OTHER_VALUE && (
        <div className="flex-1">
          <Input
            placeholder={t('Type technology name')}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && commit()}
          />
        </div>
      )}
      <Button type="button" size="sm" onClick={commit} leftIcon={<Plus size={14} />} className="shrink-0">
        {t('Add')}
      </Button>
    </div>
  );
}

export function ProjectsStep({ data, onChange }) {
  const { t } = useLanguage();

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

  function addTech(id, tech) {
    onChange(data.map((e) => (e.id === id ? { ...e, technologies: [...e.technologies, tech] } : e)));
  }

  function removeTech(id, tech) {
    onChange(data.map((e) => (e.id === id ? { ...e, technologies: e.technologies.filter((tItem) => tItem !== tech) } : e)));
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-warm-light">{t('Projects')}</h2>
      <p className="text-sm text-silver">{t('Showcase personal or professional projects that demonstrate your skills.')}</p>

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
                  <FolderGit2 size={16} className="text-emerald-500" />
                  {t('Project')} {i + 1}
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
                  label={t('Project Name')}
                  placeholder={t('e.g. E-commerce Dashboard')}
                  value={entry.name}
                  onChange={(e) => updateEntry(entry.id, 'name', e.target.value)}
                />
                <Input
                  label={t('Project URL (optional)')}
                  placeholder="https://github.com/..."
                  value={entry.url ?? ''}
                  onChange={(e) => updateEntry(entry.id, 'url', e.target.value)}
                />
                <div className="sm:col-span-2 space-y-2">
                  <TechPicker selected={entry.technologies} onAdd={(tech) => addTech(entry.id, tech)} />
                  <div className="flex flex-wrap gap-2 min-h-9">
                    {entry.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="flex items-center gap-1.5 bg-surface-2 border border-brand/20 rounded-full px-3 py-1 text-xs"
                      >
                        <span className="font-medium text-warm">{tech}</span>
                        <button
                          onClick={() => removeTech(entry.id, tech)}
                          className="text-silver hover:text-red-500 transition-colors"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Textarea
                    label={t('Description')}
                    placeholder={t('What does the project do? What was your role?')}
                    value={entry.description}
                    onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                    showCount
                    maxLength={400}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {data.length === 0 && (
        <div className="text-center py-8 text-silver text-sm border-2 border-dashed border-surface-2 rounded-xl">
          {t('No projects added yet.')}
        </div>
      )}

      <Button variant="outline" size="sm" onClick={addEntry} leftIcon={<Plus size={15} />}>
        {t('Add Project')}
      </Button>
    </div>
  );
}
