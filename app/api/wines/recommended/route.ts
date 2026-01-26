import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { deriveScarcityLevel, deriveAvailabilityPercent } from '@/lib/utils/wineHelpers';

/**
 * GET /api/wines/recommended
 * Returns wines scored based on profile parameters
 *
 * Query params:
 * - budget: monthly budget in GBP (default: 250)
 * - regions: comma-separated list of preferred regions (default: bordeaux,burgundy)
 * - splitNow: percentage for drink-now wines 0-1 (default: 0.3)
 * - splitLong: percentage for long-term cellaring 0-1 (default: 0.35)
 * - count: number of wines to return (default: 3)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const budget = parseFloat(searchParams.get('budget') || '250');
    const regions = (searchParams.get('regions') || 'bordeaux,burgundy').split(',').map(r => r.trim().toLowerCase());
    const splitNow = parseFloat(searchParams.get('splitNow') || '0.3');
    const splitLong = parseFloat(searchParams.get('splitLong') || '0.35');
    const count = parseInt(searchParams.get('count') || '3');

    const currentYear = new Date().getFullYear();
    const avgBottlePrice = budget / 4;

    // Fetch wines with stock available, priced reasonably for the budget
    const wines = await prisma.wine.findMany({
      where: {
        bottlesAvailable: { gt: 0 },
        ibPricePerUnit: {
          gte: avgBottlePrice * 0.3,
          lte: avgBottlePrice * 3,
        },
        // Only wines (not spirits)
        hierarchyLevel2: 'Wine',
      },
      select: {
        id: true,
        name: true,
        producer: true,
        region: true,
        country: true,
        vintage: true,
        colour: true,
        ibPricePerUnit: true,
        bottlesAvailable: true,
        drinkingFromDate: true,
        drinkingToDate: true,
        maturity: true,
      },
      take: 500, // Get a pool to score from
    });

    // Score each wine based on profile match
    const scored = wines.map((wine) => {
      let score = 0;
      const price = wine.ibPricePerUnit || 0;
      const bottlesAvailable = wine.bottlesAvailable || 0;
      const drinkFrom = wine.drinkingFromDate || currentYear;
      const drinkTo = wine.drinkingToDate || currentYear + 10;

      // Drink window matching
      const yearsUntilReady = drinkFrom - currentYear;
      if (splitNow > 0.4 && yearsUntilReady <= 2) score += 20;
      if (splitNow <= 0.4 && splitLong <= 0.4 && yearsUntilReady >= 2 && yearsUntilReady <= 10) score += 15;
      if (splitLong > 0.3 && yearsUntilReady > 10) score += 15;

      // Ready to drink bonus
      if (wine.maturity?.includes('Ready')) score += 10;

      // Region match
      const wineRegion = (wine.region || '').toLowerCase();
      if (regions.some((r) => wineRegion.includes(r))) {
        score += 25;
      }

      // Price fit (prefer wines in the sweet spot of their budget)
      const priceDiff = Math.abs(price - avgBottlePrice);
      score += Math.max(0, 20 - priceDiff / 5);

      // Availability bonus (more available = easier to get)
      const availabilityPercent = deriveAvailabilityPercent(bottlesAvailable);
      if (availabilityPercent > 50) score += 10;

      // Scarcity bonus for investment-minded
      const scarcity = deriveScarcityLevel(bottlesAvailable);
      if (splitLong > 0.3 && (scarcity === 'Ultra' || scarcity === 'High')) {
        score += 12;
      }

      return {
        wine,
        score,
        scarcity,
        availabilityPercent,
      };
    });

    // Sort by score and return top N
    const topWines = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map((s) => ({
        id: s.wine.id,
        name: s.wine.name,
        producer: s.wine.producer,
        region: s.wine.region,
        country: s.wine.country,
        vintage: s.wine.vintage,
        colour: s.wine.colour,
        price_gbp: s.wine.ibPricePerUnit,
        drink_window_start: s.wine.drinkingFromDate,
        drink_window_end: s.wine.drinkingToDate,
        maturity: s.wine.maturity,
        scarcity_level: s.scarcity,
        availability: s.availabilityPercent,
        // We don't have critic scores in the DB
        critic_signal: null,
      }));

    return NextResponse.json({ wines: topWines });
  } catch (error) {
    console.error('Error fetching recommended wines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommended wines' },
      { status: 500 }
    );
  }
}
