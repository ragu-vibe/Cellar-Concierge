'use client';

import { WineBottlePlaceholder } from './WineBottlePlaceholder';

interface WineImageProps {
  imageUrl?: string;
  wineName: string;
  colour?: string;
  className?: string;
}

/**
 * Wine image component - currently uses SVG placeholder
 *
 * TODO: BBR image integration
 * The product URL pattern works: https://www.bbr.com/products-{vintage}{wineId}-{vintage}-{slug}
 * But the image CDN (media.bbr.com) uses a different slug format that returns a logo fallback
 * instead of 404-ing when the URL doesn't match. Need to determine the correct image URL pattern
 * or get access to BBR's image API.
 *
 * See lib/utils/bbrUrls.ts for URL generation utilities (productUrl still works).
 */
export function WineImage({ imageUrl, wineName, colour, className }: WineImageProps) {
  // Determine bottle colour from wine colour field
  const getBottleColour = (): 'red' | 'white' | 'rose' | 'default' => {
    if (colour) {
      const c = colour.toLowerCase();
      if (c === 'red') return 'red';
      if (c === 'white') return 'white';
      if (c === 'rosé' || c === 'rose') return 'rose';
    }
    return 'default';
  };

  // For now, always use the SVG placeholder with colour from database
  return (
    <WineBottlePlaceholder
      colour={getBottleColour()}
      className={className}
    />
  );
}
