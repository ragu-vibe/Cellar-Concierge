/**
 * Ragu AI Extraction Prompts & Confirmation Loop
 *
 * These prompts are used to extract structured data from free-text user input
 * and to generate follow-up questions when confidence is low.
 */

import { OnboardingAnswers } from '@/lib/scoring/profileScoring';

// ============================================================================
// EXTRACTION PROMPT
// ============================================================================

export function buildExtractionPrompt(
  freeText: string,
  structuredAnswers: Partial<OnboardingAnswers>
): string {
  return `You are an expert wine cellar planning assistant for Berry Bros. & Rudd. Your task is to extract structured preferences from a user's free-text description of their ideal cellar plan.

IMPORTANT RULES:
- Do NOT provide investment advice. If the user mentions investment, acknowledge their interest in wines with resale potential but do not promise returns.
- Focus on collection planning, drinking timelines, and personal enjoyment.
- Be conservative with confidence scores. Only mark confidence > 0.8 if the user explicitly stated something.

USER'S FREE TEXT:
"""
${freeText}
"""

USER'S STRUCTURED ANSWERS (already captured):
${JSON.stringify(structuredAnswers, null, 2)}

Extract the following and return ONLY valid JSON matching this schema:

{
  "budget_split_override": {
    "mentioned": boolean,
    "split_now": number | null,      // 0-1, % for drink-now if mentioned
    "split_mid": number | null,      // 0-1, % for 2-10 year cellaring if mentioned
    "split_long": number | null,     // 0-1, % for 10+ year hold if mentioned
    "confidence": number             // 0-1
  },
  "cadence_details": {
    "bottles_per_year": number | null,
    "specific_events": string[],     // e.g., ["anniversary dinner", "Christmas"]
    "confidence": number
  },
  "must_haves": {
    "producers": string[],           // Specific producers mentioned
    "wines": string[],               // Specific wines mentioned
    "regions": string[],             // Regions they specifically want
    "styles": string[],              // e.g., "bold reds", "crisp whites"
    "confidence": number
  },
  "must_avoids": {
    "items": string[],               // Things to avoid
    "confidence": number
  },
  "themes": {
    "collection_focus": string | null,  // e.g., "Burgundy specialist", "Bordeaux verticals"
    "occasion_focus": string | null,    // e.g., "dinner party wines", "special occasions"
    "confidence": number
  },
  "special_occasions": {
    "upcoming": string[],            // Mentioned events/occasions
    "confidence": number
  },
  "notes_for_am": {
    "text": string,                  // Anything that needs human review/interpretation
    "flags": string[]                // e.g., ["mentions_investment", "unclear_timeline", "budget_conflict"]
  },
  "conflicts_with_structured": {
    "fields": string[],              // Which structured answers conflict with free text
    "details": string                // Explanation of conflict
  },
  "overall_confidence": number,      // 0-1, your confidence in the extraction
  "needs_follow_up": boolean,
  "suggested_follow_up_questions": string[]
}

Return ONLY the JSON object, no other text.`;
}

// ============================================================================
// CONFIRMATION LOOP RULES
// ============================================================================

export type ExtractionResult = {
  budget_split_override: {
    mentioned: boolean;
    split_now: number | null;
    split_mid: number | null;
    split_long: number | null;
    confidence: number;
  };
  cadence_details: {
    bottles_per_year: number | null;
    specific_events: string[];
    confidence: number;
  };
  must_haves: {
    producers: string[];
    wines: string[];
    regions: string[];
    styles: string[];
    confidence: number;
  };
  must_avoids: {
    items: string[];
    confidence: number;
  };
  themes: {
    collection_focus: string | null;
    occasion_focus: string | null;
    confidence: number;
  };
  special_occasions: {
    upcoming: string[];
    confidence: number;
  };
  notes_for_am: {
    text: string;
    flags: string[];
  };
  conflicts_with_structured: {
    fields: string[];
    details: string;
  };
  overall_confidence: number;
  needs_follow_up: boolean;
  suggested_follow_up_questions: string[];
};

const CONFIDENCE_THRESHOLD = 0.65;
const MAX_FOLLOW_UP_QUESTIONS = 2;

export function determineFollowUpQuestions(
  extraction: ExtractionResult,
  structuredAnswers: Partial<OnboardingAnswers>
): string[] {
  const questions: string[] = [];

  // 1. Budget split conflict
  if (
    extraction.budget_split_override.mentioned &&
    extraction.budget_split_override.confidence < CONFIDENCE_THRESHOLD
  ) {
    questions.push(FOLLOW_UP_COPY.budget_split_conflict);
  }

  // 2. Cadence unclear
  if (
    extraction.cadence_details.bottles_per_year === null &&
    structuredAnswers.openRateType === 'not_sure'
  ) {
    questions.push(FOLLOW_UP_COPY.unclear_cadence);
  }

  // 3. Bottle count preference unclear
  if (
    extraction.cadence_details.confidence < CONFIDENCE_THRESHOLD &&
    !structuredAnswers.avgBottlePreference
  ) {
    questions.push(FOLLOW_UP_COPY.bottle_count_preference);
  }

  // 4. Investment curiosity mentioned but ambiguous
  if (extraction.notes_for_am.flags.includes('mentions_investment')) {
    questions.push(FOLLOW_UP_COPY.investment_clarification);
  }

  // 5. Conflicts with structured answers
  if (extraction.conflicts_with_structured.fields.length > 0) {
    questions.push(
      `You mentioned "${extraction.conflicts_with_structured.details}" — should we adjust your earlier answers, or did you mean something else?`
    );
  }

  // Limit to max follow-up questions
  return questions.slice(0, MAX_FOLLOW_UP_QUESTIONS);
}

// ============================================================================
// FOLLOW-UP QUESTION COPY
// ============================================================================

export const FOLLOW_UP_COPY = {
  budget_split_conflict: `You mentioned a specific budget split in your notes. Just to confirm: would you like us to use your written split (e.g., "$2k now, $8k for cellaring") instead of the sliders you set earlier?`,

  unclear_cadence: `How often do you typically open a bottle from your cellar? This helps us balance drink-now selections with longer-term holdings.

• About 2 bottles per month
• About 1 bottle per month
• More like 6-8 bottles per year
• Mostly for special occasions`,

  bottle_count_preference: `When building your monthly plan, would you prefer:

• More bottles at accessible price points (variety + flexibility)
• Fewer bottles at higher quality (depth + prestige)
• A mix of both`,

  investment_clarification: `You mentioned interest in wines with resale potential. Just to be clear: we focus on collection planning rather than investment advice, but we can prioritize wines with strong secondary market liquidity if that's helpful. Should we factor this into your plan?

Note: Indicative only. Not investment advice.`,

  timeline_unclear: `Could you clarify your drinking timeline? Are you looking to:

• Open most wines within the next 1-2 years
• Hold wines for 5-10 years before opening
• Build a long-term cellar (10+ years)
• A mix across all horizons`,

  region_confirmation: `You mentioned interest in [REGION]. Would you like us to:

• Focus primarily on this region
• Include it as part of a broader exploration
• Prioritize it for now, then diversify later`,
};

// ============================================================================
// POST-EXTRACTION VALIDATION
// ============================================================================

export function validateExtraction(
  extraction: ExtractionResult,
  structuredAnswers: Partial<OnboardingAnswers>
): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for low overall confidence
  if (extraction.overall_confidence < 0.5) {
    issues.push('Low overall extraction confidence');
    recommendations.push('Consider asking user to provide more detail');
  }

  // Check for conflicting budget splits
  if (extraction.budget_split_override.mentioned) {
    const extractedTotal =
      (extraction.budget_split_override.split_now ?? 0) +
      (extraction.budget_split_override.split_mid ?? 0) +
      (extraction.budget_split_override.split_long ?? 0);

    if (extractedTotal > 0 && Math.abs(extractedTotal - 1) > 0.1) {
      issues.push('Extracted budget split does not sum to 100%');
      recommendations.push('Ask user to clarify intended split');
    }
  }

  // Check for investment advice flags
  if (extraction.notes_for_am.flags.includes('mentions_investment')) {
    recommendations.push('Add investment disclaimer to response');
  }

  // Check for empty must-haves when user wrote substantial text
  if (
    structuredAnswers.freeText &&
    structuredAnswers.freeText.length > 100 &&
    extraction.must_haves.producers.length === 0 &&
    extraction.must_haves.wines.length === 0 &&
    extraction.must_haves.regions.length === 0
  ) {
    issues.push('No specific preferences extracted from detailed free text');
    recommendations.push('Review free text manually or ask clarifying question');
  }

  return {
    isValid: issues.length === 0,
    issues,
    recommendations,
  };
}

// ============================================================================
// GENERATE PERSONALIZED WELCOME MESSAGE
// ============================================================================

export function generateWelcomeMessage(
  profile: {
    name: string;
    strategy: string;
    topMotives: string[];
    splitNow: number;
    regions: string[];
  },
  amName: string
): string {
  const strategyDescriptions: Record<string, string> = {
    drink_now_runway: "building a runway of wines to enjoy over the coming months",
    cellar_for_future: "laying down age-worthy wines for the years ahead",
    trophy_benchmarks: "acquiring iconic bottles and benchmark vintages",
    smart_value_discovery: "finding exceptional value and discovering new producers",
    balanced_barbell: "balancing drink-now enjoyment with long-term cellaring",
  };

  const motiveDescriptions: Record<string, string> = {
    scarcity: "access to allocated wines",
    provenance: "impeccable storage and provenance",
    prestige: "prestigious producers",
    vintage_story: "compelling vintage stories",
    value: "outstanding value",
    planning: "strategic cellar planning",
    entertaining: "wines for hosting and gifting",
    discovery: "discovering new regions and producers",
    investment_curiosity: "wines with secondary market appeal",
  };

  const strategyText = strategyDescriptions[profile.strategy] || "building your ideal collection";
  const topMotiveTexts = profile.topMotives
    .slice(0, 2)
    .map(m => motiveDescriptions[m] || m)
    .join(" and ");

  const regionText = profile.regions.length > 0
    ? ` with a focus on ${profile.regions.slice(0, 2).join(" and ")}`
    : "";

  const drinkNowPercent = Math.round(profile.splitNow * 100);

  return `Welcome, ${profile.name}. Based on what you've shared, you're focused on ${strategyText}${regionText}.

Your priorities lean toward ${topMotiveTexts}, with about ${drinkNowPercent}% of your plan allocated to wines you can enjoy soon.

${amName} will review your profile and curate your first monthly selection. In the meantime, here are a few wines we think you'll love based on your preferences.

Is there anything you'd like to adjust?`;
}
