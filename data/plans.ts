export type PlanStatus = 'Drafted' | 'Sent to AM' | 'Approved' | 'Ready';

// Minimal plan item - just the plan-specific data
// Wine details (name, price, region, etc.) are fetched from the database
export type PlanItemCore = {
  id: string;
  skuId: string; // Material code - links to Wine table
  quantity: number;
  rationale: string;
  tags: string[];
};

// Full plan item with wine details (returned from API)
export type PlanItem = PlanItemCore & {
  name: string;
  producer: string;
  region: string;
  vintage: number;
  price: number;
  colour?: string;
  drinkWindow?: string | null;
  maturity?: string | null;
  bottlesAvailable?: number;
  imageUrl?: string;
  productUrl?: string;
};

export const monthlyPlan = {
  id: 'plan-dec',
  month: 'December',
  status: 'Drafted' as PlanStatus,
  budget: 250,
  amNote: "I've focused on wines with strong cellaring potential this month. The Lynch-Bages is a classic Pauillac that will reward patience—drinking window extends to 2069. The Bitouzet-Prieur Meursault 1er Cru offers outstanding value for a premier cru, and the Chryseia from Douro is drinking beautifully now with room to develop.",
  items: [
    {
      id: 'plan-item-1',
      skuId: '2018-06-00750-00-8004817', // Château Lynch-Bages 2018
      quantity: 1,
      rationale: 'Fifth growth performing at super-second level. The 2018 is structured for the long haul with a drinking window of 2030-2069. Classic Pauillac character with excellent investment potential.',
      tags: ['prestige', 'investment', 'cellar-build'],
    },
    {
      id: 'plan-item-2',
      skuId: '2022-06-00750-00-8009841', // Meursault, Charmes, 1er Cru, Domaine Bitouzet-Prieur 2022
      quantity: 1,
      rationale: "Premier Cru Meursault from a respected domaine at an excellent price point. The Charmes vineyard delivers rich, mineral whites. Drinking window 2026-2040.",
      tags: ['prestige', 'value', 'cellar-build'],
    },
    {
      id: 'plan-item-3',
      skuId: '2020-06-00750-00-8116936', // Chryseia, Prats & Symington 2020
      quantity: 1,
      rationale: 'Joint venture between Prats (ex-Cos d\'Estournel) and Symington (Port houses). Ready to drink now but will develop through 2038. Outstanding Douro red at a fair price.',
      tags: ['discovery', 'value', 'drink-now'],
    }
  ] as PlanItemCore[]
};

// Alternative plan items for swapping - all from real BBR inventory
export const alternativePlanItems: PlanItemCore[] = [
  {
    id: 'alt-item-1',
    skuId: '2018-06-00750-00-1012361', // Château Léoville Barton 2018
    quantity: 1,
    rationale: 'Second growth Saint-Julien at an excellent price point. Drinking window 2025-2048. Classic claret with investment potential.',
    tags: ['prestige', 'investment', 'cellar-build'],
  },
  {
    id: 'alt-item-2',
    skuId: '2021-06-00750-00-8025797', // Volnay, Benjamin Leroux 2021
    quantity: 1,
    rationale: 'Elegant red Burgundy from a rising star négociant. Ready now through 2034. Excellent village-level quality.',
    tags: ['prestige', 'value', 'drink-now'],
  },
  {
    id: 'alt-item-3',
    skuId: '2019-06-00750-00-8213156', // Châteauneuf-du-Pape Rouge, Domaine Charvin 2019
    quantity: 1,
    rationale: 'Traditional Châteauneuf from a respected family domaine. At peak maturity now through 2027. Perfect for entertaining.',
    tags: ['value', 'entertaining', 'drink-now'],
  },
  {
    id: 'alt-item-4',
    skuId: '2023-06-00750-00-1158917', // Côte-Rôtie, Ampodium, Domaine René Rostaing 2023
    quantity: 1,
    rationale: 'Northern Rhône Syrah from one of the appellation\'s finest producers. Drinking window 2028-2041. Excellent cellar candidate.',
    tags: ['prestige', 'cellar-build', 'value'],
  },
  {
    id: 'alt-item-5',
    skuId: '2021-12-00750-00-8137571', // Rippon, Mature Vine Pinot Noir 2021
    quantity: 1,
    rationale: 'Biodynamic Pinot Noir from one of New Zealand\'s most celebrated producers. Ready now through 2033. Outstanding discovery.',
    tags: ['discovery', 'value', 'drink-now'],
  }
];
