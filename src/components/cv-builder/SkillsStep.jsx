'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/lib/i18n';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const LEVEL_BADGE = {
  Beginner: 'slate',
  Intermediate: 'brand',
  Advanced: 'brand',
  Expert: 'green',
};

export function SkillsStep({ data, onChange }) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Intermediate');

  const levelOptions = LEVELS.map((v) => ({ value: v, label: t(v) }));

  function addSkill() {
    if (!name.trim()) return;
    const skill = { id: crypto.randomUUID(), name: name.trim(), level };
    onChange([...data, skill]);
    setName('');
  }

  function removeSkill(id) {
    onChange(data.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-warm-light">{t('Skills')}</h2>
      <p className="text-sm text-silver">{t('Add your technical and soft skills.')}</p>

      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Input
            label={t('Skill Name')}
            placeholder={t('e.g. React, Python, Leadership…')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
          />
        </div>
        <div className="w-40">
          <Select
            label={t('Level')}
            options={levelOptions}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          />
        </div>
        <Button onClick={addSkill} leftIcon={<Plus size={15} />} className="shrink-0">
          {t('Add')}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[48px]">
        <AnimatePresence>
          {data.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex items-center gap-1.5 bg-surface-2 border border-brand/20 rounded-full px-3 py-1.5 text-sm"
            >
              <span className="font-medium text-warm">{skill.name}</span>
              <Badge variant={LEVEL_BADGE[skill.level]}>{t(skill.level)}</Badge>
              <button
                onClick={() => removeSkill(skill.id)}
                className="ms-1 text-silver hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {data.length === 0 && (
          <p className="text-silver text-sm self-center">{t('No skills added yet.')}</p>
        )}
      </div>
    </div>
  );
}
