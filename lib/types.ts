export type Role = "member" | "am" | "admin";

export type MotiveWeights = {
  scarcity: number;
  prestige: number;
  value: number;
  drinkingWindow: number;
  provenance: number;
  criticSignal: number;
  discovery: number;
  entertaining: number;
};

export type MemberProfile = {
  id: string;
  name: string;
  location: string;
  budgetGBP: number;
  motives: MotiveWeights;
  constraints: {
    minVintage: number;
    maxVintage: number;
    avoidRegions: string[];
    maxPriceGBP: number;
    drinkWindowFocus: "now" | "cellar" | "balanced";
  };
  goals: string[];
  accountManager: { id: string; name: string };
};

export type InventoryItem = {
  id: string;
  name: string;
  producer: string;
  region: string;
  country: string;
  grapes: string[];
  vintage: number;
  price_gbp: number;
  availability: number;
  scarcity_level: number;
  critic_signal: number;
  drink_window_start: number;
  drink_window_end: number;
  tags: string[];
  image: string;
};

export type PlanItem = {
  item: InventoryItem;
  quantity: number;
  rationale: string;
  substitutes: InventoryItem[];
};

export type PlanStatus = "Drafted" | "Sent to AM" | "Approved" | "Ready";

export type MonthlyPlan = {
  id: string;
  memberId: string;
  month: string;
  status: PlanStatus;
  budgetGBP: number;
  objectives: string[];
  items: PlanItem[];
  amNote: string;
};

export type PortfolioItem = {
  id: string;
  name: string;
  region: string;
  vintage: number;
  bottles: number;
  drink_window_start: number;
  drink_window_end: number;
  purchase_price_gbp: number;
  indicative_value_gbp: number;
};

export type MessageThread = {
  id: string;
  memberId: string;
  amId: string;
  subject: string;
  messages: {
    id: string;
    sender: "member" | "am";
    timestamp: string;
    content: string;
  }[];
};

export type SellIntent = {
  id: string;
  memberId: string;
  bottleId: string;
  bottleName: string;
  reason: string;
  timeframe: string;
  targetPriceGBP: number;
  status: "Submitted" | "Reviewing" | "Scheduled";
};

export type AMApproval = {
  id: string;
  memberId: string;
  memberName: string;
  planId: string;
  submittedAt: string;
  status: "Needs Review" | "In Review" | "Approved";
};
