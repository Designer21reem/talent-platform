'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Award } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

function newEntry() {
  return { id: crypto.randomUUID(), name: '', issuer: '', year: '' };
}

export function CertificationsStep({ data, onChange }) {
  console.log('[CertificationsStep] Rendered with', data.length, 'entries');

  function addEntry() {
    const entry = newEntry();
    console.log('[CertificationsStep] Adding entry:', entry.id);
    onChange([...data, entry]);
  }

  function removeEntry(id) {
    console.log('[CertificationsStep] Removing entry:', id);
    onChange(data.filter((e) => e.id !== id));
  }

  function updateEntry(id, field, value) {
    console.log(`[CertificationsStep] Updating ${id}, field "${field}":`, value);
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-warm-light">Certifications</h2>
      <p className="text-sm text-silver">Add any relevant certifications or licences you hold.</p>

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
                  <Award size={16} className="text-amber-500" />
                  Certification {i + 1}
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-1.5 rounded-lg text-silver hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Certificate Name"
                    placeholder="e.g. AWS Solutions Architect"
                    value={entry.name}
                    onChange={(e) => updateEntry(entry.id, 'name', e.target.value)}
                  />
                </div>
                <Input
                  label="Year"
                  placeholder="2023"
                  maxLength={4}
                  value={entry.year}
                  onChange={(e) => updateEntry(entry.id, 'year', e.target.value)}
                />
                <div className="sm:col-span-3">
                  <Input
                    label="Issuing Organisation"
                    placeholder="e.g. Amazon Web Services"
                    value={entry.issuer}
                    onChange={(e) => updateEntry(entry.id, 'issuer', e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {data.length === 0 && (
        <div className="text-center py-8 text-silver text-sm border-2 border-dashed border-surface-2 rounded-xl">
          No certifications added yet.
        </div>
      )}

      <Button variant="outline" size="sm" onClick={addEntry} leftIcon={<Plus size={15} />}>
        Add Certification
      </Button>
    </div>
  );
}
