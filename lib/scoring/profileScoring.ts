import {
  Cadence,
  DerivedTargets,
  MaxDiffRound,
  MotiveKey,
  MotiveWeights,
  OnboardingAnswers,
  StrategyAnchor,
  UserCellarProfile
} from "@/lib/types/cellarProfile";

const motiveKeys: MotiveKey[] = [
  "scarcity",
  "provenance",
  "prestige",
  "vintage_story",
  "value",
  "planning",
  "entertaining",
  "discovery",
  "investment_curiosity"
];

const baseWeights: MotiveWeights = motiveKeys.reduce((acc, key) => {
  acc[key] = 1 / motiveKeys.length;
  return acc;
}, {} as MotiveWeights);

const strategyPriors: Record<StrategyAnchor, Partial<MotiveWeights>> = {
  investment_growth: {
    investment_curiosity: 0.22,
    scarcity: 0.16,
    prestige: 0.14,
    value: 0.12,
    provenance: 0.1
  },
  legacy_cellar: {
    provenance: 0.2,
    planning: 0.18,
    prestige: 0.14,
    vintage_story: 0.12,
    investment_curiosity: 0.1
  },
  hosting_ready: {
    entertaining: 0.22,
    value: 0.16,
    discovery: 0.12,
    planning: 0.1,
    prestige: 0.08
  },
  prestige_collecting: {
    prestige: 0.24,
    scarcity: 0.16,
    provenance: 0.12,
    vintage_story: 0.1,
    investment_curiosity: 0.08
  },
  exploration: {
    discovery: 0.24,
    value: 0.14,
    entertaining: 0.12,
    planning: 0.1,
    provenance: 0.08
  }
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const normalizeWeights = (input: Partial<MotiveWeights>): MotiveWeights => {
  const merged = { ...baseWeights, ...input } as MotiveWeights;
  const total = motiveKeys.reduce((sum, key) => sum + Math.max(0, merged[key] ?? 0), 0);
  if (total === 0) return { ...baseWeights };
  return motiveKeys.reduce((acc, key) => {
    acc[key] = Math.max(0, merged[key]) / total;
    return acc;
  }, {} as MotiveWeights);
};

const normalizeBudgetSplit = (split: { drinkNow: number; midTerm: number; longTerm: number }) => {
  const total = split.drinkNow + split.midTerm + split.longTerm;
  if (total === 0) {
    return { drinkNow: 40, midTerm: 40, longTerm: 20 };
  }
  return {
    drinkNow: Math.round((split.drinkNow / total) * 100),
    midTerm: Math.round((split.midTerm / total) * 100),
    longTerm: Math.round((split.longTerm / total) * 100)
  };
};

const cadenceToDeliveries = (cadence: Cadence) => {
  switch (cadence) {
    case "monthly":
      return 12;
    case "quarterly":
      return 4;
    case "seasonal":
      return 6;
    default:
      return 12;
  }
};

const computeDerivedTargets = (weights: MotiveWeights, split: { drinkNow: number; midTerm: number; longTerm: number }): DerivedTargets => {
  const drinkNowShare = clamp(split.drinkNow / 100, 0.1, 0.9);
  const cellarShare = clamp((split.midTerm + split.longTerm) / 100, 0.1, 0.9);
  const trophyFrequency = clamp((weights.prestige + weights.scarcity) / 2, 0.05, 0.5);
  const discoveryShare = clamp(weights.discovery, 0.05, 0.45);
  const prestigeShare = clamp(weights.prestige, 0.05, 0.45);
  return { drinkNowShare, cellarShare, trophyFrequency, discoveryShare, prestigeShare };
};

export const scoreMaxDiffRounds = (rounds: MaxDiffRound[]): MotiveWeights => {
  const scores = motiveKeys.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as MotiveWeights);

  rounds.forEach((round) => {
    if (round.most) scores[round.most] += 1;
    if (round.least) scores[round.least] -= 1;
  });

  const minScore = Math.min(...motiveKeys.map((key) => scores[key]));
  const shifted = motiveKeys.reduce((acc, key) => {
    acc[key] = scores[key] - minScore + 1;
    return acc;
  }, {} as MotiveWeights);

  return normalizeWeights(shifted);
};

export const updateMotivesFromSignal = (
  profile: UserCellarProfile,
  signal: { motive: MotiveKey; strength: number; signalType: UserCellarProfile["signals"][number]["signalType"]; note?: string },
  alpha = 0.2
): UserCellarProfile => {
  const updated = { ...profile.motiveWeights };
  const current = updated[signal.motive];
  updated[signal.motive] = clamp(current + alpha * (signal.strength - current), 0, 1);
  const normalized = normalizeWeights(updated);

  return {
    ...profile,
    motiveWeights: normalized,
    signals: [
      {
        id: `signal-${Date.now()}`,
        timestamp: new Date().toISOString(),
        motive: signal.motive,
        signalType: signal.signalType,
        strength: clamp(signal.strength, 0, 1),
        note: signal.note
      },
      ...profile.signals
    ]
  };
};

export const computeProfileFromAnswers = (
  answers: OnboardingAnswers,
  seed?: { id?: string; name?: string }
): UserCellarProfile => {
  const priors = normalizeWeights(strategyPriors[answers.strategyAnchor]);
  const maxDiff = scoreMaxDiffRounds(answers.maxDiffRounds);
  const combined = normalizeWeights(
    motiveKeys.reduce((acc, key) => {
      acc[key] = priors[key] * 0.55 + maxDiff[key] * 0.45;
      return acc;
    }, {} as MotiveWeights)
  );

  const split = normalizeBudgetSplit(answers.budgetSplit);
  const deliveries = cadenceToDeliveries(answers.cadence);
  const bottlesPerYear = Math.max(1, deliveries * Math.max(answers.bottlesPerDelivery, 1));
  const annualBudgetGBP = answers.monthlyBudgetGBP * 12;
  const avgBottlePrice = annualBudgetGBP / bottlesPerYear;

  const derivedTargets = computeDerivedTargets(combined, split);

  const freeTextConfidence = answers.freeText.trim().length > 20 ? 0.75 : 0.45;

  return {
    id: seed?.id ?? "prospect-1",
    name: seed?.name ?? "Prospect",
    createdAt: new Date().toISOString(),
    strategyAnchor: {
      choice: answers.strategyAnchor
    },
    motiveWeights: combined,
    budgetPolicy: {
      monthlyBudgetGBP: answers.monthlyBudgetGBP,
      annualBudgetGBP,
      split,
      cadence: answers.cadence,
      bottlesPerYear,
      avgBottlePrice
    },
    constraints: answers.constraints,
    themes: answers.themes,
    derivedTargets,
    confidence: {
      strategy: 0.85,
      budget: 0.8,
      motives: 0.78,
      constraints: 0.7,
      themes: answers.themes.mustHave.length + answers.themes.niceToHave.length > 0 ? 0.7 : 0.5,
      freeText: freeTextConfidence
    },
    freeTextNotes: answers.freeText.trim(),
    signals: []
  };
};
