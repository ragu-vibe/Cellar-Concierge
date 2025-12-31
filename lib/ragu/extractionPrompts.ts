import {
  MotiveKey,
  MotiveWeights,
  StrategyAnchor,
  ThemeFocus,
  UserCellarProfile
} from "@/lib/types/cellarProfile";

export type ExtractionResult = {
  inferred: {
    strategyAnchor?: StrategyAnchor;
    motives?: Partial<MotiveWeights>;
    constraints?: {
      maxPriceGBP?: number;
      avoidRegions?: string[];
      storagePreference?: "bonded" | "delivery" | "either";
    };
    themes?: ThemeFocus;
    goals?: string[];
  };
  confidence: {
    strategy: number;
    motives: number;
    constraints: number;
    themes: number;
  };
  conflicts?: string[];
  notes?: string;
};

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

export function buildExtractionPrompt(input: { freeText: string; profile: Partial<UserCellarProfile> }) {
  return [
    "You are extracting structured cellar planning preferences from a free-text response.",
    "Return a strict JSON object matching this schema:",
    "{",
    "  \"strategyAnchor\": one of [investment_growth, legacy_cellar, hosting_ready, prestige_collecting, exploration],",
    "  \"motives\": { motive_key: 0-1 weight },",
    "  \"constraints\": { maxPriceGBP, avoidRegions: string[], storagePreference },",
    "  \"themes\": { mustHave: string[], niceToHave: string[] },",
    "  \"goals\": string[],",
    "  \"confidence\": { strategy, motives, constraints, themes },",
    "  \"conflicts\": string[],",
    "  \"notes\": string",
    "}",
    "Motive keys:",
    motiveKeys.join(", "),
    "If unsure, leave fields null and lower confidence (<0.65).",
    "---",
    `Existing context: ${JSON.stringify(input.profile)}`,
    "---",
    `Free-text response: ${input.freeText}`
  ].join("\n");
}

export function validateExtraction(result: ExtractionResult) {
  const issues: string[] = [];
  if (!result.inferred.strategyAnchor) {
    issues.push("Missing strategy anchor.");
  }
  if (!result.inferred.motives || Object.keys(result.inferred.motives).length === 0) {
    issues.push("Missing motive weights.");
  }
  if (!result.inferred.constraints?.maxPriceGBP) {
    issues.push("Missing max price constraint.");
  }
  return { valid: issues.length === 0, issues };
}

export function determineFollowUpQuestions(result: ExtractionResult) {
  const questions: string[] = [];
  if (result.confidence.strategy < 0.65) {
    questions.push("If you had 10,000 GBP to build your cellar today, what is your top priority?");
  }
  if (result.confidence.motives < 0.65) {
    questions.push("Which matters more to you right now: investment potential, prestige, or immediate drinking?");
  }
  if (result.confidence.constraints < 0.65) {
    questions.push("Do you have a maximum bottle price you want us to stay under?");
  }
  if (result.confidence.themes < 0.65) {
    questions.push("Are there any regions, producers, or styles you want to prioritize or avoid?");
  }
  if (result.conflicts && result.conflicts.length > 0) {
    questions.push("We noticed a few contradictions in your notes. Which priorities should we honor first?");
  }
  return questions;
}

export function generateWelcomeMessage(profile: UserCellarProfile) {
  const topMotives = Object.entries(profile.motiveWeights)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([key]) => key.replace(/_/g, " "))
    .join(" and ");

  return `Welcome, ${profile.name}. I will start by balancing ${topMotives} within your GBP ${profile.budgetPolicy.monthlyBudgetGBP}/month plan. Would you like me to draft your first three-bottle basket or start with a specific occasion?`;
}
