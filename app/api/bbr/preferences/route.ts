import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CollectorProfile, MotivationWeights, RiskProfile, TimeHorizon, BudgetStrategy, RegionalFocus } from '@/data/members';

// Feature flag to switch between real and mock data
const USE_REAL_DATA = process.env.NEXT_PUBLIC_USE_LIVE_API === 'true';

// Default profile for fallback
const defaultProfile: CollectorProfile = {
  motivations: {
    investment: 35,
    portfolio_building: 25,
    future_drinking: 20,
    status_gifting: 12,
    exploration: 8,
    legacy: 0
  },
  riskProfile: 'balanced',
  timeHorizon: 'medium',
  budgetStrategy: 'balanced',
  regionalFocus: 'breadth'
};

// Transform T360 preferences into CollectorProfile
function transformT360ToProfile(prefs: any): CollectorProfile {
  // === MOTIVATIONS ===
  // Infer from initialStatement and spending patterns
  const motivations: MotivationWeights = {
    investment: 0,
    portfolio_building: 0,
    future_drinking: 0,
    status_gifting: 0,
    exploration: 0,
    legacy: 0
  };

  // Parse initialStatement
  const statement = (prefs.initialStatement || '').toLowerCase();
  if (statement.includes('cellar') || statement.includes('collect')) {
    motivations.portfolio_building = 40;
    motivations.investment = 25;
    motivations.future_drinking = 20;
  } else if (statement.includes('drink')) {
    motivations.future_drinking = 45;
    motivations.portfolio_building = 20;
    motivations.status_gifting = 20;
  } else {
    // Balanced default
    motivations.portfolio_building = 30;
    motivations.future_drinking = 30;
    motivations.investment = 20;
  }

  // High spenders likely have investment focus
  if (prefs.collectorSpend250plus) {
    motivations.investment += 15;
    motivations.legacy = 10;
  }

  // Exploration based on ROW and diverse region selection
  const hasROW = prefs.rowAustralia || prefs.rowNewZealand || prefs.rowSouthAmerica || prefs.rowNorthAmerica || prefs.rowSouthAfrica;
  if (hasROW) {
    motivations.exploration = 15;
  }

  // Normalize to ~100 total
  const total = Object.values(motivations).reduce((a: number, b: number) => a + b, 0);
  if (total > 0) {
    for (const key of Object.keys(motivations) as (keyof MotivationWeights)[]) {
      motivations[key] = Math.round((motivations[key] / total) * 100);
    }
  }

  // === RISK PROFILE ===
  let riskProfile: RiskProfile = 'balanced';
  if (prefs.collectorSpend250plus) {
    riskProfile = 'aggressive';
  } else if (prefs.collectorSpend20to50 && !prefs.collectorSpend100to250) {
    riskProfile = 'conservative';
  }

  // === TIME HORIZON ===
  let timeHorizon: TimeHorizon = 'medium';
  const hasCollecting = prefs.collectorSpend50to100 || prefs.collectorSpend100to250 || prefs.collectorSpend250plus;
  const hasDrinking = prefs.drinkNowSpendUpTo20 || prefs.drinkNowSpend20to50 || prefs.drinkNowSpend50to100;

  if (hasCollecting && !hasDrinking) {
    timeHorizon = 'long';
  } else if (hasDrinking && !hasCollecting) {
    timeHorizon = 'short';
  }

  // === BUDGET STRATEGY ===
  let budgetStrategy: BudgetStrategy = 'balanced';
  if (prefs.collectorSpend250plus) {
    budgetStrategy = 'trophy';
  } else if (prefs.collectorSpend20to50 && !prefs.collectorSpend100to250 && !prefs.collectorSpend250plus) {
    budgetStrategy = 'volume';
  }

  // === REGIONAL FOCUS ===
  // Count distinct regions selected
  const regionCount = [
    prefs.frenchRedBordeaux || prefs.frenchWhiteBordeaux,
    prefs.frenchRedBurgundy || prefs.frenchWhiteBurgundyChablis,
    prefs.frenchChampagne,
    prefs.frenchRhoneValley,
    prefs.frenchLoireValley,
    prefs.frenchBeaujolais,
    prefs.frenchAlsace,
    prefs.frenchSouthernFrance,
    prefs.italianPiedmont,
    prefs.italianTuscany,
    prefs.italianBrunelloMontalcino,
    prefs.europeanSpain,
    prefs.europeanPortugal,
    prefs.europeanGermanyAustria,
    prefs.rowAustralia,
    prefs.rowNewZealand,
    prefs.rowNorthAmerica,
    prefs.rowSouthAmerica,
    prefs.rowSouthAfrica
  ].filter(Boolean).length;

  const regionalFocus: RegionalFocus = regionCount <= 4 ? 'depth' : 'breadth';

  return {
    motivations,
    riskProfile,
    timeHorizon,
    budgetStrategy,
    regionalFocus
  };
}

// Extract preferred regions from T360 preferences
function extractRegions(prefs: any): string[] {
  const regions: string[] = [];

  // French regions
  if (prefs.frenchRedBordeaux || prefs.frenchWhiteBordeaux) regions.push('Bordeaux');
  if (prefs.frenchRedBurgundy || prefs.frenchWhiteBurgundyChablis) regions.push('Burgundy');
  if (prefs.frenchChampagne) regions.push('Champagne');
  if (prefs.frenchRhoneValley) regions.push('Rhône');
  if (prefs.frenchLoireValley) regions.push('Loire');
  if (prefs.frenchBeaujolais) regions.push('Beaujolais');
  if (prefs.frenchAlsace) regions.push('Alsace');
  if (prefs.frenchSouthernFrance) regions.push('Southern France');

  // Italian regions
  if (prefs.italianPiedmont) regions.push('Piedmont');
  if (prefs.italianTuscany) regions.push('Tuscany');
  if (prefs.italianBrunelloMontalcino) regions.push('Brunello');

  // European
  if (prefs.europeanSpain) regions.push('Spain');
  if (prefs.europeanPortugal) regions.push('Portugal');
  if (prefs.europeanGermanyAustria) regions.push('Germany');

  // Rest of World
  if (prefs.rowAustralia) regions.push('Australia');
  if (prefs.rowNewZealand) regions.push('New Zealand');
  if (prefs.rowNorthAmerica) regions.push('California');
  if (prefs.rowSouthAmerica) regions.push('Argentina');
  if (prefs.rowSouthAfrica) regions.push('South Africa');

  return regions;
}

// Extract budget range from T360 preferences
function extractBudget(prefs: any): number {
  // Return middle of highest selected range
  if (prefs.collectorSpend250plus) return 350;
  if (prefs.collectorSpend100to250) return 175;
  if (prefs.collectorSpend50to100) return 75;
  if (prefs.collectorSpend20to50) return 35;
  return 100; // Default
}

export async function GET(request: NextRequest) {
  const memberId = request.nextUrl.searchParams.get('memberId');

  if (!USE_REAL_DATA || !memberId) {
    return NextResponse.json({
      memberId,
      collectorProfile: defaultProfile,
      regions: ['Bordeaux', 'Burgundy', 'Rhône', 'Tuscany'],
      budget: 250
    });
  }

  try {
    const prefs = await prisma.customerPreference.findUnique({
      where: { customerId: memberId }
    });

    if (!prefs) {
      return NextResponse.json({
        memberId,
        collectorProfile: defaultProfile,
        regions: ['Bordeaux', 'Burgundy', 'Rhône', 'Tuscany'],
        budget: 250
      });
    }

    const collectorProfile = transformT360ToProfile(prefs);
    const regions = extractRegions(prefs);
    const budget = extractBudget(prefs);

    return NextResponse.json({
      memberId,
      collectorProfile,
      regions: regions.length > 0 ? regions : ['Bordeaux', 'Burgundy'],
      budget
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({
      memberId,
      collectorProfile: defaultProfile,
      regions: ['Bordeaux', 'Burgundy', 'Rhône', 'Tuscany'],
      budget: 250
    });
  }
}
