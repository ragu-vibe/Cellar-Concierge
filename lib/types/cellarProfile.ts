/**
 * Cellar Concierge - User Profile Schema
 *
 * This schema captures the complete collector profile derived from:
 * 1. Structured onboarding questions (high-signal)
 * 2. Free-text extraction via Ragu AI
 * 3. Ongoing revealed preference signals
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type PrimaryStrategy =
  | 'drink_now_runway'      // A) Bottles for next 6-18 months
  | 'cellar_for_future'     // B) Age-worthy bottles for 5-15+ years
  | 'trophy_benchmarks'     // C) Iconic producers/vintages
  | 'smart_value_discovery' // D) High QPR + under-the-radar
  | 'balanced_barbell';     // E) Mix of drink-now + long-term

export type OpenRateType =
  | 'two_per_month'         // ~24 bottles/year
  | 'one_per_month'         // ~12 bottles/year
  | 'eight_per_year'        // ~8 bottles/year
  | 'event_driven'          // Holidays, dinners, celebrations
  | 'not_sure';             // Guide me

export type BottlePreference =
  | 'more_bottles'          // Breadth + flexibility
  | 'fewer_better'          // Higher average quality
  | 'mix';                  // Balance

export type SubstitutionTolerance =
  | 'close_only'            // Only close substitutes
  | 'flexible'              // I'm flexible
  | 'ask_am';               // Ask my Account Manager

export type StorageNeed =
  | 'have_storage'          // I have storage
  | 'want_options'          // I'd like storage options
  | 'not_sure';             // Not sure

export type CollectionStyle =
  | 'verticals'             // Same producer across vintages
  | 'horizontals'           // Same vintage across producers
  | 'producer_deep_dives'   // Deep dive into specific producers
  | 'broad_exploration'     // Wide exploration
  | 'no_preference';        // No preference

// ============================================================================
// MOTIVE WEIGHTS (0-1 normalized, sum to 1)
// ============================================================================

export type MotiveWeights = {
  scarcity: number;           // Access / allocations / hard to find
  provenance: number;         // Storage confidence / chain of custody
  prestige: number;           // Producer prestige / iconic names
  vintage_story: number;      // Great year / library release / narrative
  value: number;              // Relative value vs peers
  planning: number;           // Cellar planning / filling maturity gaps
  entertaining: number;       // Hosting / gifting utility
  discovery: number;          // Learning regions / new producers
  investment_curiosity: number; // Optional resale liquidity (NOT advice)
};

// ============================================================================
// BUDGET POLICY
// ============================================================================

export type BudgetPolicy = {
  monthlyBudgetGBP: number;           // Monthly spend target
  initialInvestmentGBP?: number;      // One-time cellar build budget (e.g., $10k)
  splitNow: number;                   // 0-1: % for drink in 0-18 months
  splitMid: number;                   // 0-1: % for cellar 2-10 years
  splitLong: number;                  // 0-1: % for cellar 10+ years / long hold
  avgBottlePreference: BottlePreference;
  maxBottlesPerMonth: number | 'surprise_me';
};

// ============================================================================
// CONSTRAINTS & GUARDRAILS
// ============================================================================

export type AvoidTag =
  | 'heavy_oak'
  | 'high_alcohol'
  | 'very_sweet'
  | 'very_tannic'
  | 'natural_funky'
  | 'oxidative'
  | 'smoky_peat'
  | string; // Allow custom tags

export type Constraints = {
  avoidTags: AvoidTag[];
  wineVsSpiritsMix: number;           // 0 = all wine, 1 = all spirits
  redWhiteMix: number;                // 0 = all red, 1 = all white
  substitutionTolerance: SubstitutionTolerance;
  storageNeed: StorageNeed;
};

// ============================================================================
// THEMES & FOCUS AREAS
// ============================================================================

export type ThemeRegion =
  | 'bordeaux'
  | 'burgundy'
  | 'rhone'
  | 'champagne'
  | 'tuscany'
  | 'piedmont'
  | 'rioja'
  | 'napa'
  | 'germany'
  | 'austria'
  | 'portugal'
  | 'new_zealand'
  | string; // Allow custom regions

export type Themes = {
  regions: ThemeRegion[];
  collectionStyle: CollectionStyle;
  focusProducers?: string[];          // Specific producers to focus on
  focusVintages?: number[];           // Specific vintages of interest
};

// ============================================================================
// FREE TEXT EXTRACTION (Ragu AI)
// ============================================================================

export type ExtractedField = {
  value: unknown;
  confidence: number;                 // 0-1
  source: 'structured' | 'extracted' | 'inferred';
};

export type FreeTextExtraction = {
  raw: string;                        // Original user input
  extracted: {
    budgetSplitOverride?: ExtractedField;
    cadenceDetails?: ExtractedField;
    mustHaves: ExtractedField;        // Specific wines/producers they want
    mustAvoids: ExtractedField;       // Things to avoid
    themes: ExtractedField;           // Regions/producers mentioned
    specialOccasions?: ExtractedField; // Upcoming events
    notesForAM: ExtractedField;       // Anything needing human review
  };
  overallConfidence: number;          // 0-1
  needsFollowUp: boolean;
  followUpQuestions: string[];
};

// ============================================================================
// DERIVED TARGETS (computed from inputs)
// ============================================================================

export type DerivedTargets = {
  drinkNowShareTarget: number;        // 0-1: % of monthly plan for drink-now
  diversityTarget: number;            // 0-1: how diverse vs concentrated
  scarcityTolerance: number;          // 0-1: willingness to wait for allocations
  avgBottlePriceTarget: number;       // GBP: target per-bottle spend
  drinkabilityRunwayMonthsTarget: number; // Months of drink-now bottles to maintain
  trophyFrequency: number;            // 0-1: how often to include trophy bottles
  substitutionPolicy: SubstitutionTolerance;
  riskTolerance: number;              // 0-1: willingness to try unknown producers
};

// ============================================================================
// PROFILE CONFIDENCE & COMPLETENESS
// ============================================================================

export type ProfileConfidence = {
  overall: number;                    // 0-1
  bySection: {
    strategy: number;
    budget: number;
    cadence: number;
    motives: number;
    constraints: number;
    themes: number;
    freeText: number;
  };
  missingCriticalFields: string[];
  conflictingFields: string[];
};

// ============================================================================
// REVEALED PREFERENCE SIGNALS
// ============================================================================

export type RevealedPreferenceSignal = {
  timestamp: string;
  type:
    | 'purchase'              // Accepted a recommendation
    | 'decline'               // Declined a recommendation
    | 'swap'                  // Swapped for alternative
    | 'upgrade'               // Accepted upgrade suggestion
    | 'downgrade'             // Chose cheaper option
    | 'month_skip'            // Skipped a month
    | 'reorder'               // Reordered same wine
    | 'rate_positive'         // Positive feedback on wine
    | 'rate_negative'         // Negative feedback on wine
    | 'sell_intent';          // Listed for resale
  itemId?: string;
  details: Record<string, unknown>;
  impactWeights: Partial<MotiveWeights>; // How this signal affects motive weights
};

export type RevealedPreferences = {
  signals: RevealedPreferenceSignal[];
  lastUpdated: string;

  // Computed from signals (EWMA)
  adjustedMotives: MotiveWeights;
  regionConcentration: Record<string, number>; // Region -> purchase frequency
  producerConcentration: Record<string, number>;
  pricePointPreference: number;       // Actual avg bottle price
  scarcityAcceptance: number;         // % of scarce items accepted
  substitutionAcceptance: number;     // % of substitutions accepted
};

// ============================================================================
// MAIN PROFILE TYPE
// ============================================================================

export type UserCellarProfile = {
  // Identity
  memberId: string;
  name: string;
  email?: string;

  // Core Profile (from onboarding)
  strategy: PrimaryStrategy;
  budgetPolicy: BudgetPolicy;
  cadence: {
    openRateType: OpenRateType;
    openRateBottlesPerYear: number | null;
  };
  motives: MotiveWeights;
  constraints: Constraints;
  themes: Themes;

  // Free Text & Extraction
  freeText: FreeTextExtraction | null;

  // Computed Values
  derivedTargets: DerivedTargets;
  confidence: ProfileConfidence;

  // Learning Over Time
  revealedPreferences: RevealedPreferences;

  // Metadata
  meta: {
    createdAt: string;
    updatedAt: string;
    onboardingVersion: string;
    lastPlanGeneratedAt?: string;
    amReviewedAt?: string;
    amNotes?: string;
  };
};

// ============================================================================
// MUST-HAVE vs NICE-TO-HAVE FIELDS
// ============================================================================

export const MUST_HAVE_FIELDS = [
  'strategy',                         // Primary strategy selection
  'budgetPolicy.splitNow',            // Budget split (at least rough)
  'budgetPolicy.splitMid',
  'budgetPolicy.splitLong',
  'budgetPolicy.maxBottlesPerMonth',  // Or "surprise me"
  'cadence.openRateType',             // Or "not sure"
  'constraints.substitutionTolerance',
  // At least 3 motive weights (or defaults applied)
  // avoidTags can be empty
] as const;

export const NICE_TO_HAVE_FIELDS = [
  'budgetPolicy.initialInvestmentGBP',
  'budgetPolicy.avgBottlePreference',
  'themes.regions',
  'themes.collectionStyle',
  'themes.focusProducers',
  'constraints.wineVsSpiritsMix',
  'constraints.redWhiteMix',
  'constraints.storageNeed',
  'freeText',
] as const;

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULT_MOTIVE_WEIGHTS: MotiveWeights = {
  scarcity: 0.1,
  provenance: 0.1,
  prestige: 0.15,
  vintage_story: 0.1,
  value: 0.15,
  planning: 0.15,
  entertaining: 0.1,
  discovery: 0.1,
  investment_curiosity: 0.05,
};

export const DEFAULT_DERIVED_TARGETS: DerivedTargets = {
  drinkNowShareTarget: 0.3,
  diversityTarget: 0.5,
  scarcityTolerance: 0.5,
  avgBottlePriceTarget: 50,
  drinkabilityRunwayMonthsTarget: 6,
  trophyFrequency: 0.1,
  substitutionPolicy: 'flexible',
  riskTolerance: 0.5,
};

export function createEmptyProfile(memberId: string, name: string): UserCellarProfile {
  return {
    memberId,
    name,
    strategy: 'balanced_barbell',
    budgetPolicy: {
      monthlyBudgetGBP: 250,
      splitNow: 0.33,
      splitMid: 0.34,
      splitLong: 0.33,
      avgBottlePreference: 'mix',
      maxBottlesPerMonth: 4,
    },
    cadence: {
      openRateType: 'not_sure',
      openRateBottlesPerYear: null,
    },
    motives: { ...DEFAULT_MOTIVE_WEIGHTS },
    constraints: {
      avoidTags: [],
      wineVsSpiritsMix: 0,
      redWhiteMix: 0.5,
      substitutionTolerance: 'flexible',
      storageNeed: 'not_sure',
    },
    themes: {
      regions: [],
      collectionStyle: 'no_preference',
    },
    freeText: null,
    derivedTargets: { ...DEFAULT_DERIVED_TARGETS },
    confidence: {
      overall: 0,
      bySection: {
        strategy: 0,
        budget: 0,
        cadence: 0,
        motives: 0,
        constraints: 0,
        themes: 0,
        freeText: 0,
      },
      missingCriticalFields: [...MUST_HAVE_FIELDS],
      conflictingFields: [],
    },
    revealedPreferences: {
      signals: [],
      lastUpdated: new Date().toISOString(),
      adjustedMotives: { ...DEFAULT_MOTIVE_WEIGHTS },
      regionConcentration: {},
      producerConcentration: {},
      pricePointPreference: 50,
      scarcityAcceptance: 0.5,
      substitutionAcceptance: 0.5,
    },
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onboardingVersion: '2.0',
    },
  };
}
