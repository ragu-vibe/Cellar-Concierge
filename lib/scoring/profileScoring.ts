/**
 * Scoring Transform
 *
 * Maps onboarding answers into initial weights, targets, and derived values.
 * This is the deterministic logic that converts user selections into actionable profile data.
 */

import {
  PrimaryStrategy,
  OpenRateType,
  BottlePreference,
  MotiveWeights,
  DerivedTargets,
  UserCellarProfile,
  DEFAULT_MOTIVE_WEIGHTS,
  ProfileConfidence,
  MUST_HAVE_FIELDS,
} from '@/lib/types/cellarProfile';

// ============================================================================
// STRATEGY -> MOTIVE PRIORS
// ============================================================================

const STRATEGY_MOTIVE_PRIORS: Record<PrimaryStrategy, Partial<MotiveWeights>> = {
  drink_now_runway: {
    entertaining: 0.25,
    planning: 0.20,
    value: 0.20,
    discovery: 0.15,
    prestige: 0.10,
    scarcity: 0.05,
    provenance: 0.03,
    vintage_story: 0.02,
    investment_curiosity: 0.00,
  },
  cellar_for_future: {
    planning: 0.25,
    provenance: 0.20,
    vintage_story: 0.15,
    prestige: 0.15,
    scarcity: 0.10,
    value: 0.08,
    investment_curiosity: 0.05,
    discovery: 0.02,
    entertaining: 0.00,
  },
  trophy_benchmarks: {
    prestige: 0.30,
    scarcity: 0.25,
    provenance: 0.15,
    vintage_story: 0.15,
    investment_curiosity: 0.08,
    planning: 0.05,
    value: 0.02,
    entertaining: 0.00,
    discovery: 0.00,
  },
  smart_value_discovery: {
    value: 0.30,
    discovery: 0.25,
    planning: 0.15,
    entertaining: 0.10,
    vintage_story: 0.08,
    provenance: 0.05,
    prestige: 0.05,
    scarcity: 0.02,
    investment_curiosity: 0.00,
  },
  balanced_barbell: {
    planning: 0.18,
    value: 0.15,
    prestige: 0.15,
    entertaining: 0.12,
    discovery: 0.10,
    scarcity: 0.10,
    provenance: 0.08,
    vintage_story: 0.08,
    investment_curiosity: 0.04,
  },
};

// ============================================================================
// STRATEGY -> DERIVED TARGETS DEFAULTS
// ============================================================================

const STRATEGY_TARGET_DEFAULTS: Record<PrimaryStrategy, Partial<DerivedTargets>> = {
  drink_now_runway: {
    drinkNowShareTarget: 0.70,
    diversityTarget: 0.7,
    scarcityTolerance: 0.2,
    trophyFrequency: 0.05,
    riskTolerance: 0.6,
    drinkabilityRunwayMonthsTarget: 12,
  },
  cellar_for_future: {
    drinkNowShareTarget: 0.15,
    diversityTarget: 0.4,
    scarcityTolerance: 0.7,
    trophyFrequency: 0.15,
    riskTolerance: 0.3,
    drinkabilityRunwayMonthsTarget: 3,
  },
  trophy_benchmarks: {
    drinkNowShareTarget: 0.10,
    diversityTarget: 0.3,
    scarcityTolerance: 0.9,
    trophyFrequency: 0.40,
    riskTolerance: 0.1,
    drinkabilityRunwayMonthsTarget: 0,
  },
  smart_value_discovery: {
    drinkNowShareTarget: 0.40,
    diversityTarget: 0.8,
    scarcityTolerance: 0.3,
    trophyFrequency: 0.02,
    riskTolerance: 0.8,
    drinkabilityRunwayMonthsTarget: 6,
  },
  balanced_barbell: {
    drinkNowShareTarget: 0.35,
    diversityTarget: 0.5,
    scarcityTolerance: 0.5,
    trophyFrequency: 0.10,
    riskTolerance: 0.5,
    drinkabilityRunwayMonthsTarget: 6,
  },
};

// ============================================================================
// CADENCE -> BOTTLES PER YEAR
// ============================================================================

export function cadenceToBottlesPerYear(openRateType: OpenRateType): number | null {
  switch (openRateType) {
    case 'two_per_month': return 24;
    case 'one_per_month': return 12;
    case 'eight_per_year': return 8;
    case 'event_driven': return 10; // Estimate
    case 'not_sure': return null;
  }
}

// ============================================================================
// BOTTLE PREFERENCE -> PRICE MULTIPLIER
// ============================================================================

function bottlePreferenceToPriceMultiplier(pref: BottlePreference): number {
  switch (pref) {
    case 'more_bottles': return 0.7;   // Lower avg price
    case 'fewer_better': return 1.5;   // Higher avg price
    case 'mix': return 1.0;            // Baseline
  }
}

// ============================================================================
// MAXDIFF SCORING (Simplified)
// ============================================================================

type MaxDiffRound = {
  shown: (keyof MotiveWeights)[];
  mostImportant: keyof MotiveWeights;
  leastImportant: keyof MotiveWeights;
};

export function scoreMaxDiffRounds(rounds: MaxDiffRound[]): Partial<MotiveWeights> {
  const scores: Record<keyof MotiveWeights, number> = {
    scarcity: 0,
    provenance: 0,
    prestige: 0,
    vintage_story: 0,
    value: 0,
    planning: 0,
    entertaining: 0,
    discovery: 0,
    investment_curiosity: 0,
  };

  // Each "most important" gets +2, each "least important" gets -1
  // Items shown but not selected get +0.5 (neutral positive)
  for (const round of rounds) {
    for (const item of round.shown) {
      if (item === round.mostImportant) {
        scores[item] += 2;
      } else if (item === round.leastImportant) {
        scores[item] -= 1;
      } else {
        scores[item] += 0.5;
      }
    }
  }

  // Normalize to 0-1 and ensure sum = 1
  const minScore = Math.min(...Object.values(scores));
  const shifted = Object.fromEntries(
    Object.entries(scores).map(([k, v]) => [k, v - minScore + 0.1])
  ) as Record<keyof MotiveWeights, number>;

  const total = Object.values(shifted).reduce((a, b) => a + b, 0);

  return Object.fromEntries(
    Object.entries(shifted).map(([k, v]) => [k, v / total])
  ) as MotiveWeights;
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

export type OnboardingAnswers = {
  // Screen 1: Strategy
  primaryStrategy: PrimaryStrategy;

  // Screen 2: Budget Split
  initialInvestmentGBP?: number;
  splitNow: number;   // 0-1
  splitMid: number;   // 0-1
  splitLong: number;  // 0-1

  // Screen 3: Cadence
  openRateType: OpenRateType;
  avgBottlePreference: BottlePreference;

  // Screen 4: MaxDiff
  maxDiffRounds?: MaxDiffRound[];

  // Screen 5: Constraints
  avoidTags: string[];
  wineVsSpiritsMix: number;
  redWhiteMix: number;
  maxBottlesPerMonth: number | 'surprise_me';
  substitutionTolerance: 'close_only' | 'flexible' | 'ask_am';
  storageNeed: 'have_storage' | 'want_options' | 'not_sure';

  // Screen 6: Themes
  regions: string[];
  collectionStyle: 'verticals' | 'horizontals' | 'producer_deep_dives' | 'broad_exploration' | 'no_preference';

  // Screen 7: Free text
  freeText?: string;

  // Monthly budget (carried over from old system or new input)
  monthlyBudgetGBP: number;
};

export function computeProfileFromAnswers(
  memberId: string,
  name: string,
  answers: OnboardingAnswers
): UserCellarProfile {
  // 1. Start with strategy-based motive priors
  const strategyMotives = STRATEGY_MOTIVE_PRIORS[answers.primaryStrategy];
  let motives: MotiveWeights = {
    ...DEFAULT_MOTIVE_WEIGHTS,
    ...strategyMotives,
  };

  // 2. If MaxDiff was completed, blend with those results (70% MaxDiff, 30% strategy prior)
  if (answers.maxDiffRounds && answers.maxDiffRounds.length >= 3) {
    const maxDiffMotives = scoreMaxDiffRounds(answers.maxDiffRounds);
    motives = Object.fromEntries(
      Object.keys(motives).map((k) => {
        const key = k as keyof MotiveWeights;
        const prior = motives[key];
        const maxDiff = maxDiffMotives[key] ?? prior;
        return [key, prior * 0.3 + maxDiff * 0.7];
      })
    ) as MotiveWeights;

    // Re-normalize
    const total = Object.values(motives).reduce((a, b) => a + b, 0);
    motives = Object.fromEntries(
      Object.entries(motives).map(([k, v]) => [k, v / total])
    ) as MotiveWeights;
  }

  // 3. Compute derived targets from strategy + budget split + cadence
  const strategyTargets = STRATEGY_TARGET_DEFAULTS[answers.primaryStrategy];
  const bottlesPerYear = cadenceToBottlesPerYear(answers.openRateType);
  const priceMultiplier = bottlePreferenceToPriceMultiplier(answers.avgBottlePreference);

  // Base avg bottle price from monthly budget and bottle count
  const maxBottles = answers.maxBottlesPerMonth === 'surprise_me' ? 4 : answers.maxBottlesPerMonth;
  const baseAvgPrice = answers.monthlyBudgetGBP / maxBottles;
  const avgBottlePriceTarget = baseAvgPrice * priceMultiplier;

  // Drinkability runway from cadence and split
  const monthlyDrinkNowBudget = answers.monthlyBudgetGBP * answers.splitNow;
  const drinkNowBottlesPerMonth = monthlyDrinkNowBudget / avgBottlePriceTarget;
  const consumptionPerMonth = bottlesPerYear ? bottlesPerYear / 12 : 2;
  const drinkabilityRunwayMonthsTarget = consumptionPerMonth > 0
    ? Math.round((drinkNowBottlesPerMonth * 12) / consumptionPerMonth)
    : 6;

  const derivedTargets: DerivedTargets = {
    drinkNowShareTarget: answers.splitNow,
    diversityTarget: strategyTargets.diversityTarget ?? 0.5,
    scarcityTolerance: strategyTargets.scarcityTolerance ?? 0.5,
    avgBottlePriceTarget: Math.round(avgBottlePriceTarget),
    drinkabilityRunwayMonthsTarget,
    trophyFrequency: strategyTargets.trophyFrequency ?? 0.1,
    substitutionPolicy: answers.substitutionTolerance,
    riskTolerance: strategyTargets.riskTolerance ?? 0.5,
  };

  // 4. Compute confidence scores
  const confidence = computeConfidence(answers);

  // 5. Build the profile
  const profile: UserCellarProfile = {
    memberId,
    name,
    strategy: answers.primaryStrategy,
    budgetPolicy: {
      monthlyBudgetGBP: answers.monthlyBudgetGBP,
      initialInvestmentGBP: answers.initialInvestmentGBP,
      splitNow: answers.splitNow,
      splitMid: answers.splitMid,
      splitLong: answers.splitLong,
      avgBottlePreference: answers.avgBottlePreference,
      maxBottlesPerMonth: answers.maxBottlesPerMonth,
    },
    cadence: {
      openRateType: answers.openRateType,
      openRateBottlesPerYear: bottlesPerYear,
    },
    motives,
    constraints: {
      avoidTags: answers.avoidTags,
      wineVsSpiritsMix: answers.wineVsSpiritsMix,
      redWhiteMix: answers.redWhiteMix,
      substitutionTolerance: answers.substitutionTolerance,
      storageNeed: answers.storageNeed,
    },
    themes: {
      regions: answers.regions,
      collectionStyle: answers.collectionStyle,
    },
    freeText: answers.freeText ? {
      raw: answers.freeText,
      extracted: {
        mustHaves: { value: [], confidence: 0, source: 'extracted' },
        mustAvoids: { value: [], confidence: 0, source: 'extracted' },
        themes: { value: [], confidence: 0, source: 'extracted' },
        notesForAM: { value: '', confidence: 0, source: 'extracted' },
      },
      overallConfidence: 0,
      needsFollowUp: false,
      followUpQuestions: [],
    } : null,
    derivedTargets,
    confidence,
    revealedPreferences: {
      signals: [],
      lastUpdated: new Date().toISOString(),
      adjustedMotives: { ...motives },
      regionConcentration: {},
      producerConcentration: {},
      pricePointPreference: avgBottlePriceTarget,
      scarcityAcceptance: 0.5,
      substitutionAcceptance: 0.5,
    },
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onboardingVersion: '2.0',
    },
  };

  return profile;
}

// ============================================================================
// CONFIDENCE COMPUTATION
// ============================================================================

function computeConfidence(answers: OnboardingAnswers): ProfileConfidence {
  const sectionScores = {
    strategy: answers.primaryStrategy ? 1.0 : 0,
    budget: (answers.splitNow + answers.splitMid + answers.splitLong) === 1 ? 1.0 : 0.5,
    cadence: answers.openRateType !== 'not_sure' ? 1.0 : 0.3,
    motives: answers.maxDiffRounds && answers.maxDiffRounds.length >= 3 ? 1.0 : 0.5,
    constraints: answers.substitutionTolerance ? 1.0 : 0.3,
    themes: answers.regions.length > 0 ? 0.8 : 0.4,
    freeText: answers.freeText && answers.freeText.length > 20 ? 0.8 : 0.3,
  };

  const weights = {
    strategy: 0.2,
    budget: 0.2,
    cadence: 0.15,
    motives: 0.2,
    constraints: 0.1,
    themes: 0.1,
    freeText: 0.05,
  };

  const overall = Object.entries(sectionScores).reduce(
    (acc, [key, score]) => acc + score * weights[key as keyof typeof weights],
    0
  );

  const missingCriticalFields: string[] = [];
  if (!answers.primaryStrategy) missingCriticalFields.push('strategy');
  if (answers.splitNow + answers.splitMid + answers.splitLong !== 1) {
    missingCriticalFields.push('budgetPolicy.split');
  }
  if (!answers.substitutionTolerance) missingCriticalFields.push('constraints.substitutionTolerance');

  return {
    overall,
    bySection: sectionScores,
    missingCriticalFields,
    conflictingFields: [],
  };
}

// ============================================================================
// PROFILE UPDATE FROM REVEALED PREFERENCES (EWMA)
// ============================================================================

const EWMA_ALPHA = 0.3; // Weight for new observations

export function updateMotivesFromSignal(
  currentMotives: MotiveWeights,
  signalImpact: Partial<MotiveWeights>
): MotiveWeights {
  const updated = { ...currentMotives };

  for (const [key, delta] of Object.entries(signalImpact)) {
    const k = key as keyof MotiveWeights;
    if (delta !== undefined) {
      // EWMA: new_value = alpha * observation + (1 - alpha) * old_value
      // Here, observation is current + delta
      const observation = Math.max(0, Math.min(1, currentMotives[k] + delta));
      updated[k] = EWMA_ALPHA * observation + (1 - EWMA_ALPHA) * currentMotives[k];
    }
  }

  // Re-normalize to sum to 1
  const total = Object.values(updated).reduce((a, b) => a + b, 0);
  return Object.fromEntries(
    Object.entries(updated).map(([k, v]) => [k, v / total])
  ) as MotiveWeights;
}

/**
 * Signal Impact Mappings
 *
 * These define how different user behaviors adjust motive weights.
 */
export const SIGNAL_IMPACT_MAP: Record<string, Partial<MotiveWeights>> = {
  // Accepted a scarce/allocated wine
  'purchase_scarce': { scarcity: 0.1, prestige: 0.05 },

  // Declined a scarce wine for availability reasons
  'decline_scarce': { scarcity: -0.1, value: 0.05 },

  // Accepted a discovery/unknown producer
  'purchase_discovery': { discovery: 0.1, value: 0.05 },

  // Declined discovery for known producer
  'decline_discovery': { discovery: -0.05, prestige: 0.05 },

  // Accepted upgrade suggestion
  'upgrade_accepted': { prestige: 0.08, value: -0.03 },

  // Chose cheaper alternative
  'downgrade_accepted': { value: 0.1, prestige: -0.05 },

  // Purchased for gifting/entertaining explicitly
  'purchase_for_gift': { entertaining: 0.1 },

  // Purchased investment-grade wine
  'purchase_investment': { investment_curiosity: 0.1, planning: 0.05 },

  // Listed wine for resale
  'sell_intent': { investment_curiosity: 0.15 },

  // Skipped a month
  'month_skip': { planning: -0.05 },

  // Positive rating on aged wine
  'rate_aged_positive': { planning: 0.05, vintage_story: 0.05 },
};
