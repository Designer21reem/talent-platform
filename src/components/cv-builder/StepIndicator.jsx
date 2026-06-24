'use client';

import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StepIndicator({ steps, currentStep }) {
  return (
    <div className="w-full overflow-x-auto">
      <ol className="flex items-center min-w-max mx-auto px-4">
        {steps.map((step, index) => {
          const done = step.id < currentStep;
          const active = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200',
                    done
                      ? 'bg-blue-600 text-white'
                      : active
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-slate-100 text-slate-400'
                  )}
                >
                  {done ? <CheckCircle2 size={16} /> : step.id}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium whitespace-nowrap',
                    active ? 'text-blue-600' : done ? 'text-slate-600' : 'text-slate-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'h-0.5 w-12 sm:w-16 mx-2 mt-[-14px] rounded-full transition-colors duration-300',
                    done ? 'bg-blue-600' : 'bg-slate-200'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
