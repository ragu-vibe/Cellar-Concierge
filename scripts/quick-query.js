const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'cellar-concierge.db');
console.log('DB path:', dbPath);
const db = new Database(dbPath, { readonly: true });

// Customer 0020249063's preferred regions from T360
const preferredRegions = ['Bordeaux', 'Burgundy', 'Bourgogne', 'Champagne', 'Rhône', 'Rhone',
  'Piedmont', 'Piemonte', 'Tuscany', 'Toscana', 'Spain', 'Portugal', 'Australia', 'New Zealand'];

console.log('\n=== Wines in Stock (£50-250) by Region ===\n');

const regionStats = db.prepare(`
  SELECT region, COUNT(*) as count, ROUND(AVG(ibPricePerUnit), 2) as avg_price
  FROM Wine
  WHERE bottlesAvailable > 0
    AND ibPricePerUnit BETWEEN 50 AND 250
  GROUP BY region
  ORDER BY count DESC
  LIMIT 20
`).all();

console.table(regionStats);

// Sample wines from preferred regions
console.log('\n=== Sample Wines from Customer Preferred Regions ===\n');

const sampleWines = db.prepare(`
  SELECT name, region, colour, vintage, ibPricePerUnit as price, bottlesAvailable as stock
  FROM Wine
  WHERE bottlesAvailable > 0
    AND ibPricePerUnit BETWEEN 50 AND 250
    AND (region LIKE '%Bordeaux%' OR region LIKE '%Burgundy%' OR region LIKE '%Bourgogne%'
         OR region LIKE '%Champagne%' OR region LIKE '%Rhône%' OR region LIKE '%Rhone%'
         OR region LIKE '%Piedmont%' OR region LIKE '%Piemonte%'
         OR region LIKE '%Tuscany%' OR region LIKE '%Toscana%')
  ORDER BY RANDOM()
  LIMIT 20
`).all();

for (const w of sampleWines) {
  console.log(`£${w.price.toString().padStart(3)} | ${w.colour?.padEnd(6) || '      '} | ${w.region?.substring(0,20).padEnd(20) || ''} | ${w.name?.substring(0,50)}`);
}

console.log(`\nTotal sample: ${sampleWines.length} wines`);
db.close();
