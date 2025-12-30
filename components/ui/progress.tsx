import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

function Progress({ value, className, ...props }: ProgressProps) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-accent/10', className)} {...props}>
      <div className="h-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  );
}

export { Progress };
