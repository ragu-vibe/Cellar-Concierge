import { InventoryItem, MemberProfile, PlanItem, MonthlyPlan } from "@/lib/types";
import { inventory } from "@/data/inventory";

const motiveTagMap: Record<string, keyof MemberProfile["motives"]> = {
  prestige: "prestige",
  value: "value",
  entertaining: "entertaining",
  scarce: "scarcity",
  cellar: "drinkingWindow",
  discovery: "discovery"
};

export function computeScore(item: InventoryItem, profile: MemberProfile, objectives: string[]) {
  const motiveScore = item.tags.reduce((acc, tag) => {
    const key = motiveTagMap[tag];
    if (!key) return acc;
    return acc + profile.motives[key];
  }, 0);

  const scarcityBoost = item.scarcity_level / 10;
  const criticBoost = item.critic_signal / 100;
  const objectiveBoost = objectives.includes("Prestige") && item.tags.includes("prestige") ? 0.5 : 0;
  const windowScore =
    profile.constraints.drinkWindowFocus === "now"
      ? item.drink_window_start <= new Date().getFullYear() ? 0.5 : -0.2
      : profile.constraints.drinkWindowFocus === "cellar"
        ? item.drink_window_end > new Date().getFullYear() + 6 ? 0.5 : 0
        : 0.2;

  return motiveScore + scarcityBoost + criticBoost + objectiveBoost + windowScore;
}

export function pickBasketWithinBudget(
  items: InventoryItem[],
  profile: MemberProfile,
  budget: number,
  objectives: string[]
): PlanItem[] {
  const filtered = items.filter(
    (item) =>
      item.price_gbp <= profile.constraints.maxPriceGBP &&
      !profile.constraints.avoidRegions.includes(item.region) &&
      item.vintage >= profile.constraints.minVintage &&
      item.vintage <= profile.constraints.maxVintage
  );

  const ranked = filtered
    .map((item) => ({ item, score: computeScore(item, profile, objectives) }))
    .sort((a, b) => b.score - a.score);

  const basket: PlanItem[] = [];
  let total = 0;

  for (const { item } of ranked) {
    if (basket.length >= 6) break;
    if (total + item.price_gbp > budget) continue;
    total += item.price_gbp;
    basket.push({
      item,
      quantity: 1,
      rationale: generateRationale(item, profile),
      substitutes: recommendSubstitutes(item, profile)
    });
  }

  return basket;
}

export function generateRationale(item: InventoryItem, profile: MemberProfile) {
  const lines = [
    `Scarcity score ${item.scarcity_level}/10 with ${item.availability} bottles left in allocation.`,
    `Drink window ${item.drink_window_start}-${item.drink_window_end} supports your ${profile.constraints.drinkWindowFocus} focus.`,
    `Critic signal ${item.critic_signal} adds a confidence layer for cellaring.`
  ];
  return lines.join(" ");
}

export function recommendSubstitutes(item: InventoryItem, profile: MemberProfile) {
  const substitutes = inventory
    .filter(
      (candidate) =>
        candidate.id !== item.id &&
        candidate.region === item.region &&
        candidate.price_gbp <= profile.constraints.maxPriceGBP
    )
    .slice(0, 2);
  return substitutes;
}

export function generateAMSummary(plan: MonthlyPlan, profile: MemberProfile) {
  return `Draft plan for ${profile.name} balances ${plan.objectives.join(", ")} within £${plan.budgetGBP}. Top picks emphasize scarcity (${profile.motives.scarcity}) and prestige (${profile.motives.prestige}). Recommend discussing drink-now pacing and confirming any region exclusions.`;
}

export function generatePlan(profile: MemberProfile, objectives: string[], budget: number) {
  const items = pickBasketWithinBudget(inventory, profile, budget, objectives);
  return {
    id: "plan-simulated",
    memberId: profile.id,
    month: "Current",
    status: "Drafted" as const,
    budgetGBP: budget,
    objectives,
    items,
    amNote: generateAMSummary(
      {
        id: "plan-simulated",
        memberId: profile.id,
        month: "Current",
        status: "Drafted",
        budgetGBP: budget,
        objectives,
        items,
        amNote: ""
      },
      profile
    )
  };
}
