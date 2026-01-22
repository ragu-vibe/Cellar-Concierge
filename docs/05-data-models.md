# Data Models

This document describes the core data models used throughout Cellar Concierge.

---

## User Cellar Profile

**Location**: [lib/types/cellarProfile.ts](../lib/types/cellarProfile.ts)

The most comprehensive model in the system, capturing everything about a collector's preferences.

### Main Structure

```typescript
type UserCellarProfile = {
  // Identity
  memberId: string;
  name: string;
  email?: string;

  // Core Profile (from onboarding)
  strategy: PrimaryStrategy;
  budgetPolicy: BudgetPolicy;
  cadence: Cadence;
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
  meta: ProfileMetadata;
};
```

---

### Primary Strategy

Defines the collector's main approach to building their cellar.

```typescript
type PrimaryStrategy =
  | 'drink_now_runway'      // Bottles for next 6-18 months
  | 'cellar_for_future'     // Age-worthy bottles for 5-15+ years
  | 'trophy_benchmarks'     // Iconic producers/vintages
  | 'smart_value_discovery' // High QPR + under-the-radar
  | 'balanced_barbell';     // Mix of drink-now + long-term
```

---

### Budget Policy

Controls spending patterns and allocation preferences.

```typescript
type BudgetPolicy = {
  monthlyBudgetGBP: number;           // Monthly spend target
  initialInvestmentGBP?: number;      // One-time cellar build budget
  splitNow: number;                   // 0-1: % for drink in 0-18 months
  splitMid: number;                   // 0-1: % for cellar 2-10 years
  splitLong: number;                  // 0-1: % for cellar 10+ years
  avgBottlePreference: BottlePreference;
  maxBottlesPerMonth: number | 'surprise_me';
};

type BottlePreference =
  | 'more_bottles'   // Breadth + flexibility
  | 'fewer_better'   // Higher average quality
  | 'mix';           // Balance
```

---

### Cadence

How often the collector opens/consumes wine.

```typescript
type Cadence = {
  openRateType: OpenRateType;
  openRateBottlesPerYear: number | null;
};

type OpenRateType =
  | 'two_per_month'    // ~24 bottles/year
  | 'one_per_month'    // ~12 bottles/year
  | 'eight_per_year'   // ~8 bottles/year
  | 'event_driven'     // Holidays, dinners, celebrations
  | 'not_sure';        // Guide me
```

---

### Motive Weights

Nine motivations that drive purchase decisions. Normalized to sum to 1.0.

```typescript
type MotiveWeights = {
  scarcity: number;            // Access / allocations / hard to find
  provenance: number;          // Storage confidence / chain of custody
  prestige: number;            // Producer prestige / iconic names
  vintage_story: number;       // Great year / library release
  value: number;               // Relative value vs peers
  planning: number;            // Cellar planning / filling gaps
  entertaining: number;        // Hosting / gifting utility
  discovery: number;           // Learning regions / new producers
  investment_curiosity: number; // Optional resale liquidity
};
```

**Default Values**:
```typescript
const DEFAULT_MOTIVE_WEIGHTS = {
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
```

---

### Constraints

Hard limits and preferences that filter recommendations.

```typescript
type Constraints = {
  avoidTags: AvoidTag[];              // Styles to avoid
  wineVsSpiritsMix: number;           // 0 = all wine, 1 = all spirits
  redWhiteMix: number;                // 0 = all red, 1 = all white
  substitutionTolerance: SubstitutionTolerance;
  storageNeed: StorageNeed;
};

type AvoidTag =
  | 'heavy_oak'
  | 'high_alcohol'
  | 'very_sweet'
  | 'very_tannic'
  | 'natural_funky'
  | 'oxidative'
  | 'smoky_peat'
  | string; // Custom tags allowed

type SubstitutionTolerance =
  | 'close_only'  // Only close substitutes
  | 'flexible'    // I'm flexible
  | 'ask_am';     // Ask my Account Manager

type StorageNeed =
  | 'have_storage'   // I have storage
  | 'want_options'   // I'd like storage options
  | 'not_sure';      // Not sure
```

---

### Themes

Regional and collection style preferences.

```typescript
type Themes = {
  regions: ThemeRegion[];
  collectionStyle: CollectionStyle;
  focusProducers?: string[];
  focusVintages?: number[];
};

type ThemeRegion =
  | 'bordeaux' | 'burgundy' | 'rhone' | 'champagne'
  | 'tuscany' | 'piedmont' | 'rioja' | 'napa'
  | 'germany' | 'austria' | 'portugal' | 'new_zealand'
  | string; // Custom regions allowed

type CollectionStyle =
  | 'verticals'            // Same producer across vintages
  | 'horizontals'          // Same vintage across producers
  | 'producer_deep_dives'  // Deep dive into specific producers
  | 'broad_exploration'    // Wide exploration
  | 'no_preference';       // No preference
```

---

### Free Text Extraction

Captures unstructured input and AI-extracted preferences.

```typescript
type FreeTextExtraction = {
  raw: string;                    // Original user input
  extracted: {
    budgetSplitOverride?: ExtractedField;
    cadenceDetails?: ExtractedField;
    mustHaves: ExtractedField;    // Specific wines they want
    mustAvoids: ExtractedField;   // Things to avoid
    themes: ExtractedField;       // Regions/producers mentioned
    specialOccasions?: ExtractedField;
    notesForAM: ExtractedField;   // Needs human review
  };
  overallConfidence: number;      // 0-1
  needsFollowUp: boolean;
  followUpQuestions: string[];
};

type ExtractedField = {
  value: unknown;
  confidence: number;             // 0-1
  source: 'structured' | 'extracted' | 'inferred';
};
```

---

### Derived Targets

Computed values used by the recommendation engine.

```typescript
type DerivedTargets = {
  drinkNowShareTarget: number;        // 0-1: % for drink-now
  diversityTarget: number;            // 0-1: diverse vs concentrated
  scarcityTolerance: number;          // 0-1: wait for allocations
  avgBottlePriceTarget: number;       // GBP: target per-bottle
  drinkabilityRunwayMonthsTarget: number; // Months of stock
  trophyFrequency: number;            // 0-1: how often trophy bottles
  substitutionPolicy: SubstitutionTolerance;
  riskTolerance: number;              // 0-1: try unknown producers
};
```

---

### Revealed Preferences

Signals captured from user behavior over time.

```typescript
type RevealedPreferences = {
  signals: RevealedPreferenceSignal[];
  lastUpdated: string;

  // Computed from signals (EWMA)
  adjustedMotives: MotiveWeights;
  regionConcentration: Record<string, number>;
  producerConcentration: Record<string, number>;
  pricePointPreference: number;
  scarcityAcceptance: number;
  substitutionAcceptance: number;
};

type RevealedPreferenceSignal = {
  timestamp: string;
  type:
    | 'purchase'      // Accepted recommendation
    | 'decline'       // Declined recommendation
    | 'swap'          // Swapped for alternative
    | 'upgrade'       // Accepted upgrade
    | 'downgrade'     // Chose cheaper
    | 'month_skip'    // Skipped a month
    | 'reorder'       // Reordered same wine
    | 'rate_positive' // Positive feedback
    | 'rate_negative' // Negative feedback
    | 'sell_intent';  // Listed for resale
  itemId?: string;
  details: Record<string, unknown>;
  impactWeights: Partial<MotiveWeights>;
};
```

---

## Wine Inventory

**Location**: [data/inventory.ts](../data/inventory.ts)

Wine catalog with pricing, availability, and metadata.

```typescript
type InventoryItem = {
  id: string;
  name: string;
  producer: string;
  region: string;
  country: string;
  grapes: string[];
  vintage: number;              // NaN for NV
  price_gbp: number;
  availability: number;
  scarcity_level: 'Low' | 'Medium' | 'High' | 'Ultra';
  critic_signal: number;        // 0-100 score
  drink_window_start: number;   // Year
  drink_window_end: number;     // Year
  tags: string[];
  image: string;
};
```

### Tags

Wines are tagged for filtering and matching:

| Tag | Description |
|-----|-------------|
| `prestige` | Iconic producers/labels |
| `investment` | Investment-grade wines |
| `value` | Good quality-price ratio |
| `discovery` | Emerging regions/producers |
| `scarcity` | Limited availability |
| `entertaining` | Good for hosting |
| `cellar-build` | Age-worthy |
| `drink-now` | Ready to drink |
| `gifting` | Suitable as gifts |
| `critic-signal` | High critic scores |
| `legacy` | Benchmark/reference wines |

### Scarcity Levels

Derived from availability (ATP):

| Level | Bottles Available |
|-------|-------------------|
| Ultra | < 6 |
| High | 6-11 |
| Medium | 12-49 |
| Low | 50+ |

---

## Portfolio Item

**Location**: [data/portfolio.ts](../data/portfolio.ts)

Client's wine holdings.

```typescript
type PortfolioItem = {
  id: string;
  skuId: string;
  name: string;
  region: string;
  vintage: number;
  bottles: number;
  drinkWindow: {
    start: string;    // ISO date
    end: string;      // ISO date
  };
  indicativeValue: number;
  purchasePrice: number;
  tags: string[];
};
```

### Derived Fields

| Field | Calculation |
|-------|-------------|
| `gain` | `indicativeValue - purchasePrice` |
| `gainPercent` | `(gain / purchasePrice) * 100` |
| `drinkStatus` | Based on current date vs drink window |

### Drink Status

| Status | Condition |
|--------|-----------|
| `Ready` | Now within drink window |
| `Approaching` | Within 6 months of window start |
| `Cellaring` | More than 6 months from window |
| `Past Peak` | After drink window end |

---

## Monthly Plan

**Location**: [data/plans.ts](../data/plans.ts)

Monthly wine selection for a client.

```typescript
type MonthlyPlan = {
  id: string;
  month: string;              // e.g., "2025-02"
  memberId: string;
  budget: number;
  status: PlanStatus;
  items: PlanItem[];
  amNote?: string;
  submittedAt?: string;
  approvedAt?: string;
};

type PlanStatus =
  | 'draft'           // Client still editing
  | 'pending_review'  // Submitted, awaiting AM
  | 'approved'        // AM approved
  | 'needs_changes'   // AM requested changes
  | 'completed';      // Order fulfilled

type PlanItem = {
  wineId: string;
  name: string;
  quantity: number;
  price: number;
  reason?: string;    // Why this was recommended
  tags: string[];
};
```

---

## Member Profile

**Location**: [data/members.ts](../data/members.ts)

Basic member information (simplified demo version).

```typescript
type MemberProfile = {
  id: string;
  name: string;
  tier: 'Standard' | 'Premium' | 'VIP';
  location: string;
  collectorProfile: {
    motivations: Record<string, number>;
    riskProfile: 'conservative' | 'balanced' | 'aggressive';
    timeHorizon: 'short' | 'medium' | 'long';
    budgetStrategy: 'trophy' | 'balanced' | 'volume';
    regionalFocus: 'depth' | 'breadth';
  };
  constraints: string[];
  goals: string[];
};
```

---

## Account Manager

```typescript
type AccountManager = {
  id: string;
  name: string;
  title: string;
  photo: string;
  email: string;
  phone?: string;
  specialties: string[];
};
```

---

## Message Thread

**Location**: [data/messages.ts](../data/messages.ts)

```typescript
type MessageThread = {
  id: string;
  participants: string[];     // [memberId, amId]
  messages: Message[];
  lastMessageAt: string;
};

type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
};
```

---

## Sell Intent

**Location**: [data/sellIntents.ts](../data/sellIntents.ts)

```typescript
type SellIntent = {
  id: string;
  memberId: string;
  bottleId: string;
  wine: {
    name: string;
    vintage: number;
    region: string;
  };
  bottles: number;
  status: SellIntentStatus;
  details: {
    timeframe: string;
    targetPrice?: number;
    reason?: string;
  };
  createdAt: string;
  updatedAt: string;
};

type SellIntentStatus =
  | 'submitted'       // Awaiting AM review
  | 'accepted'        // AM accepted
  | 'declined'        // AM declined
  | 'in_progress'     // Actively being sold
  | 'completed'       // Sale completed
  | 'cancelled';      // Client cancelled
```

---

## Chat Message

```typescript
type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Array<{
    document_name: string;
    chunk_text: string;
    score: number;
  }>;
};
```

---

## Validation

All models can be validated using Zod schemas. Key validation rules:

| Field | Rule |
|-------|------|
| `memberId` | Required, non-empty string |
| `budgetPolicy.splitNow/Mid/Long` | Sum must equal 1.0 |
| `motives.*` | Each 0-1, sum must equal 1.0 |
| `constraints.wineVsSpiritsMix` | 0-1 |
| `constraints.redWhiteMix` | 0-1 |
| `vintage` | 4-digit year or NaN for NV |
| `price_gbp` | Positive number |
| `availability` | Non-negative integer |

---

## Default Values

See [lib/types/cellarProfile.ts](../lib/types/cellarProfile.ts) for complete default values:

- `DEFAULT_MOTIVE_WEIGHTS` - Balanced starting weights
- `DEFAULT_DERIVED_TARGETS` - Conservative defaults
- `createEmptyProfile()` - Factory function for new profiles
