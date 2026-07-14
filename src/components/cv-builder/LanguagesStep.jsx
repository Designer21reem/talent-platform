'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LANGUAGES, OTHER_VALUE } from '@/lib/formOptions';
import { useLanguage } from '@/lib/i18n';

const PROFICIENCIES = ['Basic', 'Conversational', 'Fluent', 'Native'];

const PROFICIENCY_BADGE = {
  Basic: 'slate',
  Conversational: 'brand',
  Fluent: 'brand',
  Native: 'green',
};

export function LanguagesStep({ data, onChange }) {
  const { t } = useLanguage();
  const [pick, setPick] = useState('');
  const [custom, setCustom] = useState('');
  const [proficiency, setProficiency] = useState('Fluent');

  const proficiencyOptions = PROFICIENCIES.map((v) => ({ value: v, label: t(v) }));
  const languageOptions = [
    ...LANGUAGES.filter((l) => !data.some((d) => d.name === l)).map((v) => ({ value: v, label: t(v) })),
    { value: OTHER_VALUE, label: t('Other (type your own)') },
  ];

  function addLanguage() {
    const name = pick === OTHER_VALUE ? custom.trim() : pick;
    if (!name) return;
    const lang = { id: crypto.randomUUID(), name, proficiency };
    onChange([...data, lang]);
    setPick('');
    setCustom('');
  }

  function removeLanguage(id) {
    onChange(data.filter((l) => l.id !== id));
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-warm-light">{t('Languages')}</h2>
      <p className="text-sm text-silver">{t('List languages you speak and your proficiency level.')}</p>

      <div className="flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-40">
          <Select
            label={t('Language')}
            placeholder={t('Select a language…')}
            options={languageOptions}
            value={pick}
            onChange={(e) => setPick(e.target.value)}
          />
        </div>
        {pick === OTHER_VALUE && (
          <div className="flex-1 min-w-40">
            <Input
              label={t('Custom Language')}
              placeholder={t('e.g. Italian')}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLanguage()}
            />
          </div>
        )}
        <div className="w-44">
          <Select
            label={t('Proficiency')}
            options={proficiencyOptions}
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
          />
        </div>
        <Button onClick={addLanguage} leftIcon={<Plus size={15} />} className="shrink-0">
          {t('Add')}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-12">
        <AnimatePresence>
          {data.map((lang) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex items-center gap-1.5 bg-surface-2 border border-brand/20 rounded-full px-3 py-1.5 text-sm"
            >
              <span className="font-medium text-warm">{lang.name}</span>
              <Badge variant={PROFICIENCY_BADGE[lang.proficiency]}>{t(lang.proficiency)}</Badge>
              <button
                onClick={() => removeLanguage(lang.id)}
                className="ms-1 text-silver hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {data.length === 0 && <p className="text-silver text-sm self-center">{t('No languages added yet.')}</p>}
      </div>
    </div>
  );
}
