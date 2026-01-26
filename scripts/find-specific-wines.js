const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'cellar-concierge.db');
const db = new Database(dbPath, { readonly: true });

console.log('\n=== Finding Wines for Demo Plan (Budget: £250) ===\n');

// Bordeaux 2018
console.log('--- Bordeaux 2018 (looking for £50-100) ---');
const bordeaux = db.prepare(`
  SELECT id, name, region, vintage, ibPricePerUnit as price, bottlesAvailable as stock, colour
  FROM Wine
  WHERE region = 'Bordeaux'
    AND vintage = 2018
    AND bottlesAvailable > 3
    AND ibPricePerUnit BETWEEN 40 AND 100
  ORDER BY ibPricePerUnit DESC
  LIMIT 10
`).all();
for (const w of bordeaux) {
  console.log(`  £${w.price} | ${w.stock} btl | ${w.colour} | ${w.name?.substring(0, 65)}`);
}

// Burgundy 2021
console.log('\n--- Burgundy 2021 (looking for £50-100) ---');
const burgundy = db.prepare(`
  SELECT id, name, region, vintage, ibPricePerUnit as price, bottlesAvailable as stock, colour
  FROM Wine
  WHERE region = 'Burgundy'
    AND vintage = 2021
    AND bottlesAvailable > 3
    AND ibPricePerUnit BETWEEN 40 AND 100
  ORDER BY ibPricePerUnit DESC
  LIMIT 10
`).all();
for (const w of burgundy) {
  console.log(`  £${w.price} | ${w.stock} btl | ${w.colour} | ${w.name?.substring(0, 65)}`);
}

// Douro / Portugal
console.log('\n--- Douro / Portugal (looking for £30-80) ---');
const douro = db.prepare(`
  SELECT id, name, region, vintage, ibPricePerUnit as price, bottlesAvailable as stock, colour
  FROM Wine
  WHERE (region LIKE '%Portugal%' OR region LIKE '%Douro%' OR name LIKE '%Douro%' OR name LIKE '%Porto%')
    AND bottlesAvailable > 3
    AND ibPricePerUnit BETWEEN 20 AND 80
  ORDER BY ibPricePerUnit DESC
  LIMIT 10
`).all();
for (const w of douro) {
  console.log(`  £${w.price} | ${w.stock} btl | ${w.colour} | ${w.vintage || 'NV'} | ${w.name?.substring(0, 60)}`);
}

// If no Douro, check what Portugal wines exist
console.log('\n--- All Portugal/Port wines in stock ---');
const portugal = db.prepare(`
  SELECT id, name, region, vintage, ibPricePerUnit as price, bottlesAvailable as stock, colour
  FROM Wine
  WHERE (region LIKE '%Port%' OR name LIKE '%Portugal%' OR name LIKE '%Douro%' OR name LIKE '%Porto%')
    AND bottlesAvailable > 0
  ORDER BY ibPricePerUnit ASC
  LIMIT 15
`).all();
for (const w of portugal) {
  console.log(`  £${w.price} | ${w.stock} btl | ${w.region} | ${w.vintage || 'NV'} | ${w.name?.substring(0, 50)}`);
}

db.close();
