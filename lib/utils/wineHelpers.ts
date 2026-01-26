/**
 * Wine utility functions
 * Helpers for deriving wine attributes from database fields
 */

export type ScarcityLevel = 'Low' | 'Medium' | 'High' | 'Ultra';

/**
 * Derive scarcity level from bottles available
 * Based on BBR inventory patterns:
 * - Ultra: <= 12 bottles (1 case or less)
 * - High: <= 48 bottles (4 cases or less)
 * - Medium: <= 120 bottles (10 cases or less)
 * - Low: > 120 bottles
 */
export function deriveScarcityLevel(bottlesAvailable: number | null | undefined): ScarcityLevel {
  if (bottlesAvailable === null || bottlesAvailable === undefined) {
    return 'Medium'; // Default when unknown
  }

  if (bottlesAvailable <= 12) return 'Ultra';
  if (bottlesAvailable <= 48) return 'High';
  if (bottlesAvailable <= 120) return 'Medium';
  return 'Low';
}

/**
 * Convert bottles available to an availability percentage (0-100)
 * For UI display purposes
 */
export function deriveAvailabilityPercent(bottlesAvailable: number | null | undefined): number {
  if (bottlesAvailable === null || bottlesAvailable === undefined) {
    return 50; // Default when unknown
  }

  // Scale: 0 bottles = 0%, 200+ bottles = 100%
  return Math.min(100, Math.round((bottlesAvailable / 200) * 100));
}

/**
 * Format drink window from database date fields
 */
export function formatDrinkWindow(
  drinkingFromDate: number | null | undefined,
  drinkingToDate: number | null | undefined
): { start: number; end: number } | null {
  if (!drinkingFromDate || !drinkingToDate) {
    return null;
  }
  return { start: drinkingFromDate, end: drinkingToDate };
}
