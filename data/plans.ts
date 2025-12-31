export type PlanStatus = 'Drafted' | 'Sent to AM' | 'Approved' | 'Ready';

export type PlanItem = {
  id: string;
  skuId: string;
  name: string;
  producer: string;
  region: string;
  vintage: number;
  price: number;
  quantity: number;
  rationale: string;
  tags: string[];
};

export const monthlyPlan = {
  id: 'plan-dec',
  month: 'December',
  status: 'Drafted' as PlanStatus,
  budget: 250,
  amNote: "I've focused on wines with strong cellaring potential this month. The Léoville-Barton is a standout—classic Saint-Julien that will reward patience. The Roulot Meursault offers excellent value for the quality, and the Douro is a discovery pick that punches well above its weight.",
  items: [
    {
      id: 'plan-item-1',
      skuId: 'bbr-001',
      name: 'Château Léoville-Barton 2018',
      producer: 'Château Léoville-Barton',
      region: 'Saint-Julien, Bordeaux',
      vintage: 2018,
      price: 85,
      quantity: 1,
      rationale: 'Second growth Bordeaux with excellent aging potential. The 2018 vintage is tightly structured but will develop beautifully over 20+ years. Strong investment credentials.',
      tags: ['prestige', 'investment', 'cellar-build']
    },
    {
      id: 'plan-item-2',
      skuId: 'bbr-014',
      name: 'Domaine Roulot Meursault 1er Cru Les Perrières 2021',
      producer: 'Domaine Roulot',
      region: 'Côte de Beaune, Burgundy',
      vintage: 2021,
      price: 95,
      quantity: 1,
      rationale: "One of Burgundy's finest white wine producers. Limited allocation—this won't be available long. Exceptional vintage for whites.",
      tags: ['prestige', 'scarcity', 'critic-signal']
    },
    {
      id: 'plan-item-3',
      skuId: 'bbr-038',
      name: 'Luis Seabra Xisto Ilimitado Tinto 2020',
      producer: 'Luis Seabra',
      region: 'Douro, Portugal',
      vintage: 2020,
      price: 38,
      quantity: 1,
      rationale: 'Excellent discovery from the Douro. Natural winemaking, field blend of old vines. Drinks beautifully now but will hold for a decade. Remarkable value.',
      tags: ['discovery', 'value', 'drink-now']
    }
  ] as PlanItem[]
};

// Alternative plan items for swapping
export const alternativePlanItems: PlanItem[] = [
  {
    id: 'alt-item-1',
    skuId: 'bbr-003',
    name: 'Château Lynch-Bages 2018',
    producer: 'Château Lynch-Bages',
    region: 'Pauillac, Bordeaux',
    vintage: 2018,
    price: 95,
    quantity: 1,
    rationale: 'Super-second quality at a fair price. More approachable young than Léoville-Barton, equally age-worthy.',
    tags: ['prestige', 'investment', 'entertaining']
  },
  {
    id: 'alt-item-2',
    skuId: 'bbr-011',
    name: 'Domaine Faiveley Gevrey-Chambertin 1er Cru Les Cazetiers 2021',
    producer: 'Domaine Faiveley',
    region: 'Côte de Nuits, Burgundy',
    vintage: 2021,
    price: 85,
    quantity: 1,
    rationale: 'Red Burgundy from an excellent producer. More approachable pricing than white Burgundy, with similar prestige.',
    tags: ['prestige', 'value', 'cellar-build']
  },
  {
    id: 'alt-item-3',
    skuId: 'bbr-021',
    name: 'Domaine du Vieux Télégraphe Châteauneuf-du-Pape La Crau 2020',
    producer: 'Domaine du Vieux Télégraphe',
    region: 'Southern Rhône',
    vintage: 2020,
    price: 55,
    quantity: 1,
    rationale: 'Classic Châteauneuf from a benchmark estate. Excellent for entertaining or near-term drinking.',
    tags: ['value', 'entertaining', 'drink-now']
  },
  {
    id: 'alt-item-4',
    skuId: 'bbr-035',
    name: 'López de Heredia Viña Tondonia Reserva 2010',
    producer: 'López de Heredia',
    region: 'Rioja',
    vintage: 2010,
    price: 45,
    quantity: 1,
    rationale: 'Already mature and drinking beautifully. Traditional Rioja with remarkable complexity. Perfect for the holidays.',
    tags: ['value', 'drink-now', 'entertaining']
  },
  {
    id: 'alt-item-5',
    skuId: 'bbr-048',
    name: 'Felton Road Block 5 Pinot Noir 2021',
    producer: 'Felton Road',
    region: 'Central Otago, New Zealand',
    vintage: 2021,
    price: 65,
    quantity: 1,
    rationale: 'World-class Pinot Noir from the southern hemisphere. Silky and elegant, ready to drink now.',
    tags: ['discovery', 'value', 'drink-now']
  }
];
