const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'cellar-concierge.db');
const db = new Database(dbPath, { readonly: true });

console.log('\n=== Searching for Plan Wines in Real Database ===\n');

// The 3 wines currently in the mock plan
const planWines = [
  { name: 'Léoville-Barton', vintage: 2018, region: 'Saint-Julien' },
  { name: 'Roulot', vintage: 2021, region: 'Meursault' },
  { name: 'Luis Seabra', vintage: 2020, region: 'Douro' }
];

for (const wine of planWines) {
  console.log(`\n--- Searching: ${wine.name} ${wine.vintage} ---`);

  const results = db.prepare(`
    SELECT id, name, region, vintage, ibPricePerUnit as price, bottlesAvailable as stock, colour
    FROM Wine
    WHERE name LIKE ?
      AND bottlesAvailable > 0
    ORDER BY ABS(COALESCE(vintage, 0) - ?) ASC, ibPricePerUnit ASC
    LIMIT 5
  `).all(`%${wine.name}%`, wine.vintage);

  if (results.length === 0) {
    console.log('  No matches found');
  } else {
    for (const r of results) {
      console.log(`  ${r.vintage || 'NV'} | £${r.price} | ${r.stock} btl | ${r.name?.substring(0, 60)}`);
    }
  }
}

// Now let's find some good alternatives that DO exist
console.log('\n\n=== Finding Real Wines for a Better Demo Plan ===\n');

// Get one nice Bordeaux
console.log('--- Bordeaux (£70-120) ---');
const bordeaux = db.prepare(`
  SELECT id, name, region, vintage, ibPricePerUnit as price, bottlesAvailable as stock
  FROM Wine
  WHERE region = 'Bordeaux'
    AND bottlesAvailable > 5
    AND ibPricePerUnit BETWEEN 70 AND 120
  ORDER BY ibPricePerUnit DESC
  LIMIT 5
`).all();
for (const w of bordeaux) {
  console.log(`  ${w.vintage || 'NV'} | £${w.price} | ${w.stock} btl | ${w.name?.substring(0, 60)}`);
}

// Get one nice Burgundy white
console.log('\n--- Burgundy White (£80-150) ---');
const burgundyWhite = db.prepare(`
  SELECT id, name, region, vintage, ibPricePerUnit as price, bottlesAvailable as stock
  FROM Wine
  WHERE region = 'Burgundy'
    AND colour = 'White'
    AND bottlesAvailable > 3
    AND ibPricePerUnit BETWEEN 80 AND 150
  ORDER BY ibPricePerUnit DESC
  LIMIT 5
`).all();
for (const w of burgundyWhite) {
  console.log(`  ${w.vintage || 'NV'} | £${w.price} | ${w.stock} btl | ${w.name?.substring(0, 60)}`);
}

// Get one nice Rhône
console.log('\n--- Rhône (£60-100) ---');
const rhone = db.prepare(`
  SELECT id, name, region, vintage, ibPricePerUnit as price, bottlesAvailable as stock
  FROM Wine
  WHERE region = 'Rhône'
    AND bottlesAvailable > 5
    AND ibPricePerUnit BETWEEN 60 AND 100
  ORDER BY ibPricePerUnit DESC
  LIMIT 5
`).all();
for (const w of rhone) {
  console.log(`  ${w.vintage || 'NV'} | £${w.price} | ${w.stock} btl | ${w.name?.substring(0, 60)}`);
}

db.close();
