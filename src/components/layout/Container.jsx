import { cn } from '@/lib/utils';

const maxWidthStyles = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-full',
};

export function Container({ maxWidth = 'xl', className, children, ...props }) {
  return (
    <div
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', maxWidthStyles[maxWidth], className)}
      {...props}
    >
      {children}
    </div>
  );
}
