'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const PROFICIENCY_OPTIONS = [
  { value: 'Basic', label: 'Basic' },
  { value: 'Conversational', label: 'Conversational' },
  { value: 'Fluent', label: 'Fluent' },
  { value: 'Native', label: 'Native' },
];

const PROFICIENCY_BADGE = {
  Basic: 'slate',
  Conversational: 'blue',
  Fluent: 'purple',
  Native: 'green',
};

export function LanguagesStep({ data, onChange }) {
  const [name, setName] = useState('');
  const [proficiency, setProficiency] = useState('Fluent');

  console.log('[LanguagesStep] Rendered with', data.length, 'languages');

  function addLanguage() {
    if (!name.trim()) return;
    const lang = { id: crypto.randomUUID(), name: name.trim(), proficiency };
    console.log('[LanguagesStep] Adding language:', lang);
    onChange([...data, lang]);
    setName('');
  }

  function removeLanguage(id) {
    console.log('[LanguagesStep] Removing language:', id);
    onChange(data.filter((l) => l.id !== id));
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-slate-900">Languages</h2>
      <p className="text-sm text-slate-500">List languages you speak and your proficiency level.</p>

      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Input
            label="Language"
            placeholder="e.g. English, Arabic, French…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLanguage()}
          />
        </div>
        <div className="w-44">
          <Select
            label="Proficiency"
            options={PROFICIENCY_OPTIONS}
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
          />
        </div>
        <Button onClick={addLanguage} leftIcon={<Plus size={15} />} className="shrink-0">
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[48px]">
        <AnimatePresence>
          {data.map((lang) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-sm"
            >
              <span className="font-medium text-slate-700">{lang.name}</span>
              <Badge variant={PROFICIENCY_BADGE[lang.proficiency]}>{lang.proficiency}</Badge>
              <button
                onClick={() => removeLanguage(lang.id)}
                className="ml-1 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {data.length === 0 && <p className="text-slate-400 text-sm self-center">No languages added yet.</p>}
      </div>
    </div>
  );
}
