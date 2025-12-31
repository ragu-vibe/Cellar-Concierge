// New CBC-derived motivation categories
export type MotivationWeights = {
  investment: number;        // Asset appreciation priority (0-100)
  portfolio_building: number; // Collection depth/breadth strategy (0-100)
  future_drinking: number;   // Consumption timeline priority (0-100)
  status_gifting: number;    // Social signaling & entertaining (0-100)
  exploration: number;       // Discovery vs. blue-chip (0-100)
  legacy: number;            // Estate/heir planning (0-100)
};

export type RiskProfile = 'conservative' | 'balanced' | 'aggressive';
export type TimeHorizon = 'short' | 'medium' | 'long';
export type BudgetStrategy = 'trophy' | 'balanced' | 'volume';
export type RegionalFocus = 'depth' | 'breadth';

export type CollectorProfile = {
  motivations: MotivationWeights;
  riskProfile: RiskProfile;
  timeHorizon: TimeHorizon;
  budgetStrategy: BudgetStrategy;
  regionalFocus: RegionalFocus;
};

export const memberProfile = {
  id: 'member-alex',
  name: 'Alex Morgan',
  tier: 'Collector',
  location: 'London',
  // New CBC-derived collector profile
  collectorProfile: {
    motivations: {
      investment: 35,
      portfolio_building: 25,
      future_drinking: 20,
      status_gifting: 12,
      exploration: 8,
      legacy: 0
    },
    riskProfile: 'balanced' as RiskProfile,
    timeHorizon: 'medium' as TimeHorizon,
    budgetStrategy: 'balanced' as BudgetStrategy,
    regionalFocus: 'breadth' as RegionalFocus
  } as CollectorProfile,
  constraints: {
    budget: 250,
    regions: ['Bordeaux', 'Burgundy', 'Rhône', 'Tuscany'],
    avoid: ['Oxidative styles'],
    drinkWindowStart: 2024,
    drinkWindowEnd: 2036
  },
  goals: ['Build a cellar-ready collection', 'Host elegant dinners', 'Secure iconic vintages']
};

export const accountManager = {
  id: 'am-sophie',
  name: 'Sophie Laurent',
  region: 'London',
  specialties: ['Bordeaux', 'Burgundy', 'Rhône', 'Cellaring strategy']
};
