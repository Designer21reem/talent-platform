'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Award } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CERTIFICATION_CATEGORIES, suggestCertExpiryYears } from '@/lib/formOptions';
import { useLanguage } from '@/lib/i18n';

function newEntry() {
  return { id: crypto.randomUUID(), name: '', issuer: '', category: '', year: '', expiryYear: '' };
}

function expiryStatus(expiryYear) {
  if (!expiryYear) return null;
  const currentYear = new Date().getFullYear();
  const diff = Number(expiryYear) - currentYear;
  if (diff < 0) return { label: 'Expired', variant: 'red' };
  if (diff === 0) return { label: 'Expiring this year', variant: 'amber' };
  return { label: 'Valid', variant: 'green' };
}

export function CertificationsStep({ data, onChange }) {
  const { t } = useLanguage();
  const categoryOptions = CERTIFICATION_CATEGORIES.map((c) => ({ value: c, label: t(c) }));

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

  function updateName(id, name) {
    const suggestedYears = suggestCertExpiryYears(name);
    onChange(
      data.map((e) => {
        if (e.id !== id) return e;
        const next = { ...e, name };
        // Only auto-fill expiry if the field is still empty — never
        // overwrite a value the candidate already set themselves.
        if (!e.expiryYear && suggestedYears) {
          const baseYear = Number(e.year) || new Date().getFullYear();
          next.expiryYear = String(baseYear + suggestedYears);
        }
        return next;
      })
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-warm-light">{t('Certifications')}</h2>
      <p className="text-sm text-silver">{t('Add any relevant certifications or licences you hold.')}</p>

      <AnimatePresence initial={false}>
        {data.map((entry, i) => {
          const status = expiryStatus(entry.expiryYear);
          return (
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
                    <Award size={16} className="text-brand" />
                    {t('Certification')} {i + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    {status && <Badge variant={status.variant}>{t(status.label)}</Badge>}
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="p-1.5 rounded-lg text-silver hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label={t('Certificate Name')}
                      placeholder={t('e.g. AWS Solutions Architect')}
                      value={entry.name}
                      onChange={(e) => updateName(entry.id, e.target.value)}
                    />
                  </div>
                  <Select
                    label={t('Category')}
                    placeholder={t('Select category…')}
                    options={categoryOptions}
                    value={entry.category}
                    onChange={(e) => updateEntry(entry.id, 'category', e.target.value)}
                  />
                  <Input
                    label={t('Year Obtained')}
                    placeholder="2023"
                    maxLength={4}
                    value={entry.year}
                    onChange={(e) => updateEntry(entry.id, 'year', e.target.value)}
                  />
                  <Input
                    label={t('Expiry Year (optional)')}
                    placeholder={t('No expiry')}
                    maxLength={4}
                    value={entry.expiryYear}
                    onChange={(e) => updateEntry(entry.id, 'expiryYear', e.target.value)}
                  />
                  <div className="sm:col-span-3">
                    <Input
                      label={t('Issuing Organisation')}
                      placeholder={t('e.g. Amazon Web Services')}
                      value={entry.issuer}
                      onChange={(e) => updateEntry(entry.id, 'issuer', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {data.length === 0 && (
        <div className="text-center py-8 text-silver text-sm border-2 border-dashed border-surface-2 rounded-xl">
          {t('No certifications added yet.')}
        </div>
      )}

      <Button variant="outline" size="sm" onClick={addEntry} leftIcon={<Plus size={15} />}>
        {t('Add Certification')}
      </Button>
    </div>
  );
}
