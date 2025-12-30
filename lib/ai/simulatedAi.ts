import { inventory, type InventoryItem } from '@/data/inventory';
import { memberProfile } from '@/data/members';
import { portfolio } from '@/data/portfolio';

export type MotiveWeights = typeof memberProfile.motives;

export type PlanInput = {
  budget: number;
  objectives: string[];
  constraints: typeof memberProfile.constraints;
  motives: MotiveWeights;
};

const weightMap: Record<keyof MotiveWeights, number> = {
  scarcity: 1.4,
  prestige: 1.2,
  value: 1.1,
  drinkWindow: 1.0,
  entertaining: 0.9,
  discovery: 0.8,
  provenance: 1.1,
  criticSignal: 0.7
};

export function computeScore(item: InventoryItem, input: PlanInput) {
  const motiveScore = Object.entries(input.motives).reduce((acc, [key, value]) => {
    const weight = weightMap[key as keyof MotiveWeights];
    return acc + value * weight;
  }, 0);

  const scarcityBoost = item.scarcity_level === 'Ultra' ? 18 : item.scarcity_level === 'High' ? 12 : 4;
  const criticBoost = item.critic_signal > 92 ? 10 : item.critic_signal > 90 ? 6 : 2;
  const drinkWindowFit =
    item.drink_window_start >= input.constraints.drinkWindowStart &&
    item.drink_window_end <= input.constraints.drinkWindowEnd
      ? 12
      : 0;
  const regionFit = input.constraints.regions.includes(item.region) ? 8 : 2;

  return motiveScore + scarcityBoost + criticBoost + drinkWindowFit + regionFit - item.price_gbp * 0.12;
}

export function pickBasketWithinBudget(input: PlanInput) {
  const scored = inventory
    .map((item) => ({ item, score: computeScore(item, input) }))
    .sort((a, b) => b.score - a.score);

  const basket: InventoryItem[] = [];
  let remaining = input.budget;
  for (const entry of scored) {
    if (basket.length >= 6) break;
    if (entry.item.price_gbp <= remaining && entry.item.availability > 8) {
      basket.push(entry.item);
      remaining -= entry.item.price_gbp;
    }
  }

  return { basket, remaining };
}

export function generateRationale(item: InventoryItem, input: PlanInput) {
  const focus = Object.entries(input.motives)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => key);

  return `Selected for ${focus.join(', ')} with a ${item.drink_window_start}-${item.drink_window_end} window and ${item.scarcity_level.toLowerCase()} availability. ${item.producer} brings a ${item.region} narrative with critic signal ${item.critic_signal}.`;
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
  const avgPrice = Math.round(planItems.reduce((acc, item) => acc + item.price_gbp, 0) / planItems.length);

  return `Draft emphasizes ${topRegions.join(', ')} with an average bottle spend of £${avgPrice}. Highlights: ${planItems
    .slice(0, 3)
    .map((item) => item.name)
    .join(', ')}. Motive weighting leans on scarcity (${input.motives.scarcity}) and prestige (${input.motives.prestige}); confirm drink windows align to ${input.constraints.drinkWindowStart}-${input.constraints.drinkWindowEnd}.`;
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
  motives: memberProfile.motives
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
