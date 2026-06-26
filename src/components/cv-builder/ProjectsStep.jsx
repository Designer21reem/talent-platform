'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, FolderGit2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

function newEntry() {
  return { id: crypto.randomUUID(), name: '', description: '', technologies: '', url: '' };
}

export function ProjectsStep({ data, onChange }) {
  console.log('[ProjectsStep] Rendered with', data.length, 'projects');

  function addEntry() {
    const entry = newEntry();
    console.log('[ProjectsStep] Adding project:', entry.id);
    onChange([...data, entry]);
  }

  function removeEntry(id) {
    console.log('[ProjectsStep] Removing project:', id);
    onChange(data.filter((e) => e.id !== id));
  }

  function updateEntry(id, field, value) {
    console.log(`[ProjectsStep] Updating project ${id}, field "${field}":`, value);
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-warm-light">Projects</h2>
      <p className="text-sm text-silver">Showcase personal or professional projects that demonstrate your skills.</p>

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
                  Project {i + 1}
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
                  label="Project Name"
                  placeholder="e.g. E-commerce Dashboard"
                  value={entry.name}
                  onChange={(e) => updateEntry(entry.id, 'name', e.target.value)}
                />
                <Input
                  label="Technologies Used"
                  placeholder="e.g. React, Node.js, PostgreSQL"
                  value={entry.technologies}
                  onChange={(e) => updateEntry(entry.id, 'technologies', e.target.value)}
                />
                <Input
                  label="Project URL (optional)"
                  placeholder="https://github.com/..."
                  value={entry.url ?? ''}
                  onChange={(e) => updateEntry(entry.id, 'url', e.target.value)}
                  className="sm:col-span-2"
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="Description"
                    placeholder="What does the project do? What was your role?"
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
          No projects added yet.
        </div>
      )}

      <Button variant="outline" size="sm" onClick={addEntry} leftIcon={<Plus size={15} />}>
        Add Project
      </Button>
    </div>
  );
}
