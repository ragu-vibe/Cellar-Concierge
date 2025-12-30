import { InventoryItem } from "@/lib/types";

const producers = [
  "Château Montclair",
  "Domaine des Rives",
  "Tenuta Bellafonte",
  "Bodega Valdoro",
  "Maison Lenoir",
  "Weingut Falken",
  "Quinta da Aurora",
  "Clos Saint-Jacques",
  "Rutherford Crest",
  "Domaine Bellecombe"
];

const regions = [
  "Bordeaux",
  "Burgundy",
  "Rhône",
  "Tuscany",
  "Piedmont",
  "Rioja",
  "Champagne",
  "Mosel",
  "Douro",
  "Barossa"
];

const grapes = [
  ["Cabernet Sauvignon", "Merlot"],
  ["Pinot Noir"],
  ["Syrah", "Grenache"],
  ["Sangiovese"],
  ["Nebbiolo"],
  ["Tempranillo"],
  ["Chardonnay", "Pinot Noir"],
  ["Riesling"],
  ["Touriga Nacional"],
  ["Shiraz"]
];

const tags = [
  ["prestige", "cellar"],
  ["value", "discovery"],
  ["entertaining", "drink-now"],
  ["prestige", "scarce"],
  ["value", "cellar"],
  ["entertaining", "value"],
  ["prestige", "celebration"],
  ["discovery", "cellar"],
  ["value", "legacy"],
  ["entertaining", "prestige"]
];

const imagePool = [
  "https://placehold.co/400x500?text=Cellar+Concierge",
  "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&w=800&q=80"
];

function generateInventory(): InventoryItem[] {
  const items: InventoryItem[] = [];
  for (let i = 0; i < 100; i += 1) {
    const regionIndex = i % regions.length;
    const producer = producers[regionIndex];
    const region = regions[regionIndex];
    const baseVintage = 2008 + (i % 14);
    const vintage = baseVintage + (i % 3 === 0 ? 1 : 0);
    const price_gbp = 42 + (i % 9) * 9 + (regionIndex % 3) * 15;
    const scarcity_level = 3 + (i % 7);
    const critic_signal = 68 + (i % 25);
    const drink_window_start = vintage + 2;
    const drink_window_end = vintage + 15 + (i % 6);
    items.push({
      id: `sku-${i + 1}`,
      name: `${producer} ${region} Selection ${vintage}`,
      producer,
      region,
      country: region === "Barossa" ? "Australia" : region === "Douro" ? "Portugal" : region === "Rioja" ? "Spain" : region === "Tuscany" || region === "Piedmont" ? "Italy" : region === "Mosel" ? "Germany" : "France",
      grapes: grapes[regionIndex],
      vintage,
      price_gbp,
      availability: 10 + (i % 18),
      scarcity_level,
      critic_signal,
      drink_window_start,
      drink_window_end,
      tags: tags[regionIndex],
      image: imagePool[i % imagePool.length]
    });
  }
  return items;
}

export const inventory = generateInventory();
