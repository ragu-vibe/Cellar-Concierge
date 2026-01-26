import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { monthlyPlan, alternativePlanItems } from '@/data/plans';
import { generateImageUrl, generateProductUrl } from '@/lib/utils/bbrUrls';

export async function GET() {
  try {
    // Get all SKU IDs from the plan and alternatives
    const planSkuIds = monthlyPlan.items.map(item => item.skuId);
    const altSkuIds = alternativePlanItems.map(item => item.skuId);
    const allSkuIds = [...planSkuIds, ...altSkuIds];

    // Fetch wine details from database
    const wines = await prisma.wine.findMany({
      where: {
        id: { in: allSkuIds }
      },
      select: {
        id: true,
        name: true,
        producer: true,
        region: true,
        vintage: true,
        colour: true,
        ibPricePerUnit: true,
        bottlesAvailable: true,
        drinkingFromDate: true,
        drinkingToDate: true,
        maturity: true,
      }
    });

    // Create a map for quick lookup
    const wineMap = new Map(wines.map(w => [w.id, w]));

    // Enrich plan items with database data
    const enrichedItems = monthlyPlan.items.map(item => {
      const wine = wineMap.get(item.skuId);
      if (wine) {
        const wineName = wine.name || '';
        return {
          id: item.id,
          skuId: item.skuId,
          name: wineName,
          producer: wine.producer || '',
          region: wine.region || '',
          vintage: wine.vintage || 0,
          colour: wine.colour,
          price: wine.ibPricePerUnit || 0,
          quantity: item.quantity,
          rationale: item.rationale,
          tags: item.tags,
          drinkWindow: wine.drinkingFromDate && wine.drinkingToDate
            ? `${wine.drinkingFromDate}-${wine.drinkingToDate}`
            : null,
          maturity: wine.maturity,
          bottlesAvailable: wine.bottlesAvailable,
          imageUrl: generateImageUrl(item.skuId, wineName),
          productUrl: generateProductUrl(item.skuId, wineName),
        };
      }
      // Fall back to static data if wine not found in DB
      return item;
    });

    // Enrich alternative items
    const enrichedAlternatives = alternativePlanItems.map(item => {
      const wine = wineMap.get(item.skuId);
      if (wine) {
        const wineName = wine.name || '';
        return {
          id: item.id,
          skuId: item.skuId,
          name: wineName,
          producer: wine.producer || '',
          region: wine.region || '',
          vintage: wine.vintage || 0,
          colour: wine.colour,
          price: wine.ibPricePerUnit || 0,
          quantity: item.quantity,
          rationale: item.rationale,
          tags: item.tags,
          drinkWindow: wine.drinkingFromDate && wine.drinkingToDate
            ? `${wine.drinkingFromDate}-${wine.drinkingToDate}`
            : null,
          maturity: wine.maturity,
          bottlesAvailable: wine.bottlesAvailable,
          imageUrl: generateImageUrl(item.skuId, wineName),
          productUrl: generateProductUrl(item.skuId, wineName),
        };
      }
      return item;
    });

    return NextResponse.json({
      plan: {
        ...monthlyPlan,
        items: enrichedItems,
      },
      alternatives: enrichedAlternatives,
    });
  } catch (error) {
    console.error('Error fetching plan:', error);
    // Fall back to static data on error
    return NextResponse.json({
      plan: monthlyPlan,
      alternatives: alternativePlanItems,
    });
  }
}
