'use client';

import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StepIndicator({ steps, currentStep }) {
  return (
    <div className="w-full">
      <ol className="flex items-start w-full">
        {steps.map((step, index) => {
          const done = step.id < currentStep;
          const active = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className={cn('flex items-center', !isLast && 'flex-1')}>
              <div className="flex flex-col items-center gap-1.5 w-14 sm:w-20 shrink-0">
                <div
                  className={cn(
                    'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0',
                    done
                      ? 'bg-brand text-dark'
                      : active
                      ? 'bg-brand text-dark ring-4 ring-brand/20'
                      : 'bg-(--tv-step-inactive-bg) text-(--tv-step-inactive-text)'
                  )}
                >
                  {done ? <CheckCircle2 size={16} /> : step.id}
                </div>
                <span
                  className={cn(
                    'text-[10px] sm:text-xs font-medium text-center leading-tight',
                    active ? 'text-brand' : done ? 'text-silver' : 'text-silver'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-1 sm:mx-2 mt-[-18px] sm:mt-[-14px] rounded-full transition-colors duration-300',
                    done ? 'bg-brand' : 'bg-(--tv-step-connector)'
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
