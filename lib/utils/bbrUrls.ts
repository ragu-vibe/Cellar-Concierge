/**
 * BBR URL generation utilities
 * Generates product page and image URLs from material codes and wine names
 *
 * STATUS:
 * - productUrl: WORKS - generates valid BBR product page URLs
 * - imageUrl: NOT WORKING - the media CDN uses a different slug format that we haven't
 *   figured out yet. The generated URLs return a BBR logo placeholder instead of 404-ing.
 *   Need to determine correct image URL pattern or get access to BBR's image API.
 *
 * Example working product URL:
 *   https://www.bbr.com/products-20188004817-2018-chateau-lynch-bages-pauillac-bordeaux
 *
 * Example of an actual image URL (different format):
 *   https://media.bbr.com/i/bbr/20188004817_Chateau-Lynch-Bages_Ch-Lynch-Bages-Pauillac_2018_01
 */

/**
 * Slugify a wine name for BBR URLs
 * - lowercase
 * - replace & with "and"
 * - remove accents, periods, apostrophes
 * - replace commas and spaces with hyphens
 * - collapse multiple hyphens
 */
export function slugifyWineName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[.']/g, '') // remove periods and apostrophes
    .replace(/[,\s]+/g, '-') // replace commas and spaces with hyphens
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/^-|-$/g, ''); // trim hyphens from start/end
}

/**
 * Extract vintage and wine ID from material code
 * Material code format: YYYY-XX-XXXXX-XX-XXXXXXX
 * Example: 2018-06-00750-00-8004817
 */
export function parseMaterialCode(sku: string): { vintage: string; wineId: string } {
  const vintage = sku.substring(0, 4);
  const wineId = sku.substring(sku.lastIndexOf('-') + 1);
  return { vintage, wineId };
}

/**
 * Generate BBR product page URL
 * Format: https://www.bbr.com/products-{vintage}{wineId}-{vintage}-{slug}
 */
export function generateProductUrl(sku: string, name: string): string {
  const { vintage, wineId } = parseMaterialCode(sku);
  const slug = slugifyWineName(name);
  return `https://www.bbr.com/products-${vintage}${wineId}-${vintage}-${slug}`;
}

/**
 * Generate BBR image URL
 * Format: https://media.bbr.com/i/bbr/{vintage}{wineId}-{vintage}-{slug}?fmt=auto&w={width}
 */
export function generateImageUrl(sku: string, name: string, width: number = 400): string {
  const { vintage, wineId } = parseMaterialCode(sku);
  const slug = slugifyWineName(name);
  return `https://media.bbr.com/i/bbr/${vintage}${wineId}-${vintage}-${slug}?fmt=auto&w=${width}`;
}
