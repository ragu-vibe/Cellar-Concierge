'use client';

import { cn } from '@/lib/utils';

interface WineBottlePlaceholderProps {
  className?: string;
  colour?: 'red' | 'white' | 'rose' | 'default';
}

export function WineBottlePlaceholder({
  className,
  colour = 'default'
}: WineBottlePlaceholderProps) {
  // Wine colour affects the bottle/liquid colour
  const bottleColours = {
    red: '#722F37',      // Dark burgundy
    white: '#C4A35A',    // Golden
    rose: '#E8B4B8',     // Pink
    default: '#4A4A4A',  // Neutral dark grey
  };

  const fillColour = bottleColours[colour];

  return (
    <svg
      viewBox="0 0 40 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-full', className)}
      aria-label="Wine bottle"
    >
      {/* Bottle neck */}
      <rect x="16" y="0" width="8" height="20" rx="1" fill={fillColour} />

      {/* Neck taper */}
      <path
        d="M16 20 L12 35 L12 40 L28 40 L28 35 L24 20 Z"
        fill={fillColour}
      />

      {/* Bottle body */}
      <rect x="8" y="40" width="24" height="70" rx="3" fill={fillColour} />

      {/* Bottom curve */}
      <ellipse cx="20" cy="110" rx="12" ry="4" fill={fillColour} />

      {/* Highlight/reflection */}
      <rect x="12" y="45" width="3" height="55" rx="1.5" fill="white" fillOpacity="0.15" />

      {/* Label area */}
      <rect x="11" y="60" width="18" height="25" rx="1" fill="white" fillOpacity="0.9" />
      <rect x="13" y="65" width="14" height="2" rx="1" fill={fillColour} fillOpacity="0.3" />
      <rect x="13" y="70" width="10" height="2" rx="1" fill={fillColour} fillOpacity="0.3" />
      <rect x="13" y="75" width="12" height="2" rx="1" fill={fillColour} fillOpacity="0.3" />
    </svg>
  );
}
