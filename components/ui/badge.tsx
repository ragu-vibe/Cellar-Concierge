import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
        variant === 'default' && 'border-transparent bg-primary text-white',
        variant === 'outline' && 'border-border text-muted',
        variant === 'secondary' && 'border-transparent bg-accent/10 text-primary',
        className
      )}
      {...props}
    />
  );
}

export { Badge };
