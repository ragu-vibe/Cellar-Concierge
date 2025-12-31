export type MotiveKey =
  | "scarcity"
  | "provenance"
  | "prestige"
  | "vintage_story"
  | "value"
  | "planning"
  | "entertaining"
  | "discovery"
  | "investment_curiosity";

export type MotiveWeights = Record<MotiveKey, number>;

export type StrategyAnchor =
  | "investment_growth"
  | "legacy_cellar"
  | "hosting_ready"
  | "prestige_collecting"
  | "exploration";

export type BudgetSplit = {
  drinkNow: number;
  midTerm: number;
  longTerm: number;
};

export type Cadence = "monthly" | "quarterly" | "seasonal";

export type BudgetPolicy = {
  monthlyBudgetGBP: number;
  annualBudgetGBP: number;
  split: BudgetSplit;
  cadence: Cadence;
  bottlesPerYear: number;
  avgBottlePrice: number;
};

export type Constraints = {
  minVintage: number;
  maxVintage: number;
  maxPriceGBP: number;
  avoidRegions: string[];
  storagePreference: "bonded" | "delivery" | "either";
};

export type ThemeFocus = {
  mustHave: string[];
  niceToHave: string[];
};

export type DerivedTargets = {
  drinkNowShare: number;
  cellarShare: number;
  trophyFrequency: number;
  discoveryShare: number;
  prestigeShare: number;
};

export type ConfidenceScores = {
  strategy: number;
  budget: number;
  motives: number;
  constraints: number;
  themes: number;
  freeText: number;
};

export type RevealedPreferenceSignal = {
  id: string;
  timestamp: string;
  motive: MotiveKey;
  signalType: "purchase" | "swap" | "skip" | "rating" | "sell";
  strength: number;
  note?: string;
};

export type UserCellarProfile = {
  id: string;
  name: string;
  createdAt: string;
  strategyAnchor: {
    choice: StrategyAnchor;
    rationale?: string;
  };
  motiveWeights: MotiveWeights;
  budgetPolicy: BudgetPolicy;
  constraints: Constraints;
  themes: ThemeFocus;
  derivedTargets: DerivedTargets;
  confidence: ConfidenceScores;
  freeTextNotes: string;
  signals: RevealedPreferenceSignal[];
};

export type MaxDiffRound = {
  id: string;
  options: MotiveKey[];
  most?: MotiveKey;
  least?: MotiveKey;
};

export type OnboardingAnswers = {
  strategyAnchor: StrategyAnchor;
  budgetSplit: BudgetSplit;
  cadence: Cadence;
  bottlesPerDelivery: number;
  maxDiffRounds: MaxDiffRound[];
  constraints: Constraints;
  themes: ThemeFocus;
  freeText: string;
  monthlyBudgetGBP: number;
};
