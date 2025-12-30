import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="range"
    className={cn('h-2 w-full cursor-pointer appearance-none rounded-full bg-accent/20', className)}
    {...props}
  />
));
Slider.displayName = 'Slider';

export { Slider };
