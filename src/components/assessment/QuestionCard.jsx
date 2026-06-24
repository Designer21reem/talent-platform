'use client';

import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';

export function QuestionCard({ question, answer, questionIndex, total, onChange }) {
  console.log(`[QuestionCard] Rendering Q${questionIndex + 1}:`, question.id, '| Current answer:', answer || '(none)');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8"
    >
      {/* Question header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <span className="inline-block mb-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
            {question.category}
          </span>
          <h3 className="text-lg font-semibold text-slate-900 leading-snug">{question.question}</h3>
        </div>
        <span className="shrink-0 text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
          {questionIndex + 1}/{total}
        </span>
      </div>

      {/* Multiple choice */}
      {question.type === 'multiple-choice' && question.options && (
        <div className="space-y-2.5">
          {question.options.map((option) => {
            const selected = answer === option.id;
            return (
              <button
                key={option.id}
                onClick={() => {
                  console.log(`[QuestionCard] Q${questionIndex + 1} answer selected:`, option.id, '-', option.label);
                  onChange(option.id);
                }}
                className={cn(
                  'w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm transition-all duration-150',
                  'flex items-center gap-3',
                  selected
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50'
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                    selected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                  )}
                >
                  {selected && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>
                <span className="font-medium text-xs text-slate-400 mr-1">{option.id.toUpperCase()}.</span>
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Textarea */}
      {question.type === 'textarea' && (
        <Textarea
          placeholder="Write your answer here… (minimum 20 words recommended)"
          value={answer}
          onChange={(e) => {
            console.log(`[QuestionCard] Q${questionIndex + 1} textarea updated, length:`, e.target.value.length);
            onChange(e.target.value);
          }}
          rows={5}
          showCount
          maxLength={1000}
        />
      )}
    </motion.div>
  );
}
