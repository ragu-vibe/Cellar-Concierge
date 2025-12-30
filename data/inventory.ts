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
  scarcity_level: 'Low' | 'Medium' | 'High' | 'Ultra';
  critic_signal: number;
  drink_window_start: number;
  drink_window_end: number;
  tags: string[];
  image: string;
};

const producers = [
  'Domaine Armand',
  'Château Belrose',
  'Clos de l’Aube',
  'Tenuta Velluto',
  'Bodega Maravilla',
  'Ridgewell Estate',
  'Maison Clairmont',
  'Weingut Silber',
  'Horizon Cellars',
  'Quarry Lane'
];

const regions = [
  'Bordeaux',
  'Burgundy',
  'Rhône',
  'Barolo',
  'Rioja',
  'Napa Valley',
  'Champagne',
  'Tuscany',
  'Mosel',
  'Mendoza'
];

const grapes = [
  ['Cabernet Sauvignon', 'Merlot'],
  ['Pinot Noir'],
  ['Syrah', 'Grenache'],
  ['Nebbiolo'],
  ['Tempranillo'],
  ['Cabernet Sauvignon'],
  ['Chardonnay', 'Pinot Noir'],
  ['Sangiovese'],
  ['Riesling'],
  ['Malbec']
];

const tagSets = [
  ['prestige', 'cellar-build'],
  ['value', 'drink-now'],
  ['entertaining', 'access'],
  ['discovery', 'value'],
  ['prestige', 'critic-signal'],
  ['cellar-build', 'legacy'],
  ['entertaining', 'prestige'],
  ['value', 'drink-window'],
  ['access', 'discovery'],
  ['prestige', 'collecting']
];

export const inventory: InventoryItem[] = Array.from({ length: 96 }).map((_, index) => {
  const band = index % producers.length;
  const basePrice = 38 + band * 22 + (index % 5) * 9;
  const vintage = 2008 + (index % 14);
  const availability = 12 + (index % 18);
  const scarcity: InventoryItem['scarcity_level'] =
    availability < 18 ? 'Ultra' : availability < 24 ? 'High' : availability < 30 ? 'Medium' : 'Low';

  return {
    id: `sku-${index + 1}`,
    name: `${producers[band]} ${regions[band]} Reserve ${vintage}`,
    producer: producers[band],
    region: regions[band],
    country: band === 4 || band === 9 ? 'Spain' : band === 8 ? 'Germany' : 'France',
    grapes: grapes[band],
    vintage,
    price_gbp: basePrice,
    availability,
    scarcity_level: scarcity,
    critic_signal: 88 + (index % 12),
    drink_window_start: vintage + 2,
    drink_window_end: vintage + 12,
    tags: tagSets[band],
    image: `https://placehold.co/400x500?text=Cellar+${index + 1}`
  };
});
