import { inventory, type InventoryItem } from '@/data/inventory';
import { memberProfile, MotivationWeights, CollectorProfile } from '@/data/members';
import { portfolio } from '@/data/portfolio';

export type PlanInput = {
  budget: number;
  objectives: string[];
  constraints: typeof memberProfile.constraints;
  collectorProfile: CollectorProfile;
};

// Weight multipliers for scoring based on new motivation categories
const motivationWeightMap: Record<keyof MotivationWeights, number> = {
  investment: 1.4,
  portfolio_building: 1.2,
  future_drinking: 1.0,
  status_gifting: 1.1,
  exploration: 0.9,
  legacy: 1.3
};

export function computeScore(item: InventoryItem, input: PlanInput) {
  // Calculate base score from motivation weights (normalized to 0-100)
  const motiveScore = Object.entries(input.collectorProfile.motivations).reduce((acc, [key, value]) => {
    const weight = motivationWeightMap[key as keyof MotivationWeights];
    return acc + (value / 100) * weight * 10; // Normalize to reasonable range
  }, 0);

  // Scarcity boost - important for investment-focused collectors
  const scarcityBoost = item.scarcity_level === 'Ultra' ? 18 : item.scarcity_level === 'High' ? 12 : 4;

  // Critic signal - important for data-driven and investment collectors
  const criticBoost = item.critic_signal > 92 ? 10 : item.critic_signal > 90 ? 6 : 2;

  // Drink window fit based on time horizon
  const timeHorizonYears = input.collectorProfile.timeHorizon === 'short' ? 3 :
                           input.collectorProfile.timeHorizon === 'medium' ? 7 : 12;
  const drinkWindowFit = item.drink_window_start <= (2024 + timeHorizonYears) ? 12 : 0;

  // Region fit
  const regionFit = input.constraints.regions.includes(item.region) ? 8 : 2;

  // Price penalty (adjusted by budget strategy)
  const priceMultiplier = input.collectorProfile.budgetStrategy === 'trophy' ? 0.08 :
                          input.collectorProfile.budgetStrategy === 'volume' ? 0.15 : 0.12;

  return motiveScore + scarcityBoost + criticBoost + drinkWindowFit + regionFit - item.price_gbp * priceMultiplier;
}

export function pickBasketWithinBudget(input: PlanInput) {
  const scored = inventory
    .map((item) => ({ item, score: computeScore(item, input) }))
    .sort((a, b) => b.score - a.score);

  const basket: InventoryItem[] = [];
  let remaining = input.budget;

  // Adjust target basket size by budget strategy
  const targetSize = input.collectorProfile.budgetStrategy === 'trophy' ? 2 :
                     input.collectorProfile.budgetStrategy === 'volume' ? 6 : 4;

  for (const entry of scored) {
    if (basket.length >= targetSize) break;
    if (entry.item.price_gbp <= remaining && entry.item.availability > 8) {
      basket.push(entry.item);
      remaining -= entry.item.price_gbp;
    }
  }

  return { basket, remaining };
}

export function generateRationale(item: InventoryItem, input: PlanInput) {
  // Get top 2 motivations
  const topMotivations = Object.entries(input.collectorProfile.motivations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => {
      const labels: Record<string, string> = {
        investment: 'investment potential',
        portfolio_building: 'portfolio depth',
        future_drinking: 'drinking quality',
        status_gifting: 'prestige appeal',
        exploration: 'discovery value',
        legacy: 'legacy building'
      };
      return labels[key] || key;
    });

  return `Selected for ${topMotivations.join(' and ')} with a ${item.drink_window_start}-${item.drink_window_end} drinking window. ${item.producer} from ${item.region} with ${item.scarcity_level.toLowerCase()} availability and critic signal ${item.critic_signal}.`;
}

export function recommendSubstitutes(item: InventoryItem) {
  return inventory
    .filter(
      (other) =>
        other.id !== item.id && other.region === item.region && Math.abs(other.price_gbp - item.price_gbp) <= 25
    )
    .slice(0, 2);
}

export function generateAMSummary(planItems: InventoryItem[], input: PlanInput) {
  const topRegions = Array.from(new Set(planItems.map((item) => item.region))).slice(0, 3);
  const avgPrice = planItems.length > 0
    ? Math.round(planItems.reduce((acc, item) => acc + item.price_gbp, 0) / planItems.length)
    : 0;

  const topMotivations = Object.entries(input.collectorProfile.motivations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key, val]) => `${key.replace('_', ' ')} (${val}%)`);

  return `Draft emphasizes ${topRegions.join(', ')} with an average bottle spend of £${avgPrice}. Highlights: ${planItems
    .slice(0, 3)
    .map((item) => item.name)
    .join(', ')}. Profile leans on ${topMotivations.join(' and ')}; time horizon: ${input.collectorProfile.timeHorizon}.`;
}

export function generatePlan(input: PlanInput) {
  const { basket, remaining } = pickBasketWithinBudget(input);
  return {
    items: basket,
    remainingBudget: remaining,
    rationales: basket.map((item) => ({ id: item.id, text: generateRationale(item, input) }))
  };
}

export function summarizeForAM(input: PlanInput) {
  const plan = generatePlan(input);
  return generateAMSummary(plan.items, input);
}

export function recommendSubstitutePlan(input: PlanInput) {
  const plan = generatePlan(input);
  return plan.items.flatMap((item) => recommendSubstitutes(item));
}

export const defaultPlanInput: PlanInput = {
  budget: 250,
  objectives: ['Cellar build', 'Prestige', 'Entertaining'],
  constraints: memberProfile.constraints,
  collectorProfile: memberProfile.collectorProfile
};

export const mockPortfolioSummary = {
  healthScore: 82,
  milestones: ['Rhône Explorer', 'Vintage Planner'],
  streak: 3,
  valueBand: '£3.4k - £4.1k',
  disclaimers: 'Indicative only. Not investment advice.'
};

export const mockPortfolioHistory = [
  { month: 'Apr', value: 3200 },
  { month: 'May', value: 3450 },
  { month: 'Jun', value: 3380 },
  { month: 'Jul', value: 3600 },
  { month: 'Aug', value: 3820 },
  { month: 'Sep', value: 3950 }
];

export { portfolio };
