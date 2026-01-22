import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { portfolio as mockPortfolio } from '@/data/portfolio';

// Feature flag to switch between real and mock data
const USE_REAL_DATA = process.env.NEXT_PUBLIC_USE_LIVE_API === 'true';

function formatDrinkWindow(from: number | null, to: number | null): string {
  if (from && to) return `${from}-${to}`;
  if (from) return `${from}+`;
  if (to) return `Until ${to}`;
  return 'Ready now';
}

function deriveTags(wine: { colour?: string | null; region?: string | null; currentMarketValue?: number | null }): string[] {
  const tags: string[] = [];

  // Derive tags from available data
  if (wine.currentMarketValue && wine.currentMarketValue > 500) {
    tags.push('prestige');
  }
  if (wine.currentMarketValue && wine.currentMarketValue > 1000) {
    tags.push('investment');
  }
  if (wine.region?.toLowerCase().includes('bordeaux') ||
      wine.region?.toLowerCase().includes('burgundy') ||
      wine.region?.toLowerCase().includes('champagne')) {
    tags.push('cellar-build');
  }
  if (wine.currentMarketValue && wine.currentMarketValue < 200) {
    tags.push('value');
  }

  return tags.length > 0 ? tags : ['cellar-build'];
}

export async function GET(request: NextRequest) {
  const memberId = request.nextUrl.searchParams.get('memberId');

  // If no memberId or not using real data, return mock
  if (!USE_REAL_DATA || !memberId) {
    return NextResponse.json({ memberId, portfolio: mockPortfolio });
  }

  try {
    const holdings = await prisma.portfolioHolding.findMany({
      where: { customerId: memberId },
      include: { wine: true },
      orderBy: { currentMarketValue: 'desc' },
    });

    if (holdings.length === 0) {
      // Fall back to mock if no real holdings found
      return NextResponse.json({ memberId, portfolio: mockPortfolio });
    }

    // Transform to expected format
    const portfolio = holdings.map((holding) => ({
      id: holding.id,
      skuId: holding.wineId,
      name: holding.wine?.name || 'Unknown Wine',
      region: holding.wine?.region || holding.region || 'Unknown',
      vintage: holding.wine?.vintage || null,
      bottles: holding.quantity,
      drinkWindow: formatDrinkWindow(
        holding.wine?.drinkingFromDate || null,
        holding.wine?.drinkingToDate || null
      ),
      maturity: holding.wine?.maturity || null, // BBR maturity status
      indicativeValue: holding.currentMarketValue || 0,
      purchasePrice: holding.purchasePrice || 0,
      tags: deriveTags({
        colour: holding.wine?.colour,
        region: holding.wine?.region,
        currentMarketValue: holding.currentMarketValue,
      }),
    }));

    return NextResponse.json({ memberId, portfolio });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    // Fall back to mock on error
    return NextResponse.json({ memberId, portfolio: mockPortfolio });
  }
}
