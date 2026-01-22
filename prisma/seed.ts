/**
 * Database Seed Script - Fast Bulk Import
 *
 * Uses better-sqlite3 directly with prepared statements and transactions
 * for fast bulk imports (similar to C# bulk operations).
 *
 * Usage: npx tsx prisma/seed.ts
 */

import 'dotenv/config';
import Database from 'better-sqlite3';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

// Get database path from DATABASE_URL
const dbUrl = process.env.DATABASE_URL || 'file:./cellar-concierge.db';
// Handle both relative (file:./db.db) and absolute (file:F:/path/db.db) paths
const dbPath = dbUrl.replace(/^file:/, '');
const absoluteDbPath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath.replace(/^\.\//, ''));

console.log(`Database: ${absoluteDbPath}`);

const db = new Database(absoluteDbPath);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = OFF');  // Faster for bulk imports
db.pragma('cache_size = 10000');
db.pragma('foreign_keys = OFF');  // Disable FK checks during seed

const DATA_DIR = path.join(__dirname, '..', 'datafiles');

// Helper to read and parse CSV
function readCSV(filename: string): Record<string, string>[] {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  File not found: ${filename} - skipping`);
    return [];
  }

  const content = fs.readFileSync(filepath, 'utf-8');
  const cleanContent = content.replace(/^\uFEFF/, '');

  return parse(cleanContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

// Helper to parse numeric values
function parseFloatValue(value: string | undefined): number | null {
  if (!value || value.trim() === '') return null;
  const num = Number(value.replace(/,/g, ''));
  return isNaN(num) ? null : num;
}

function parseIntValue(value: string | undefined): number | null {
  if (!value || value.trim() === '') return null;
  const num = Number(value.replace(/,/g, ''));
  return isNaN(num) ? null : Math.floor(num);
}

function parseYN(value: string | undefined): number {
  return value?.toUpperCase() === 'Y' ? 1 : 0;
}

function extractVintage(materialCode: string): number | null {
  const vintageStr = materialCode.substring(0, 4);
  const vintage = Number(vintageStr);
  if (isNaN(vintage) || vintage === 1000) return null;
  return vintage;
}

function extractQualityCode(materialCode: string): string | null {
  const parts = materialCode.split('-');
  if (parts.length >= 4) return parts[3];
  return null;
}

function seedWines() {
  console.log('\n📦 Seeding wines...');

  const productData = readCSV('J0064 - Product File.csv');
  const stockData = readCSV('J0064 - Stock File.csv');

  if (productData.length === 0) {
    console.log('   No product data');
    return;
  }

  const stockMap = new Map<string, Record<string, string>>();
  for (const row of stockData) {
    stockMap.set(row['Material Code'], row);
  }

  console.log(`   Found ${productData.length} products, ${stockData.length} stock records`);

  // Clear existing
  db.exec('DELETE FROM Wine');

  // Prepare statement for bulk insert
  const insert = db.prepare(`
    INSERT OR IGNORE INTO Wine (
      id, bbrWin, name, country, region, producer, colour, sweetness,
      volume, hierarchyLevel2, hierarchyLevel3, unitSize, unitVolume,
      alcoholPercentage, drinkingFromDate, drinkingToDate, maturity,
      grapeVariety1, grapePercentage1, grapeVariety2, grapePercentage2,
      grapeVariety3, grapePercentage3, grapeVariety4, grapePercentage4,
      grapeVariety5, grapePercentage5,
      caseSize, ibPricePerUnit, ibPricePerCase, dpPricePerUnit, dpPricePerCase,
      casesAvailable, bottlesAvailable, availableSales, vintage, qualityCode,
      createdAt, updatedAt
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
    )
  `);

  // Use transaction for speed
  const insertMany = db.transaction((products: typeof productData) => {
    let count = 0;
    for (const product of products) {
      const materialCode = product['Material Code'];
      if (!materialCode) continue;

      const stock = stockMap.get(materialCode) || {};

      insert.run(
        materialCode,
        product['BBRWIN'] || null,
        product['Material Description (Long)'] || 'Unknown',
        product['Country'] || null,
        product['Region'] || null,
        product['Property'] || null,
        product['Colour'] || null,
        product['Sweetness'] || null,
        parseFloatValue(product['Volume']),
        product['Hierarchy Level 2'] || null,
        product['Hierarchy Level 3'] || null,
        product['Code - Unit Size'] || null,
        product['Code - Unit Volume'] || null,
        parseFloatValue(product['Code - Alcohol Percentage']),
        parseIntValue(product['Drinking From Date']),
        parseIntValue(product['Drinking To Date']),
        product['Maturity'] || null,
        product['Grape Variety 1'] || null,
        parseFloatValue(product['Grape Variety Percentage 1']),
        product['Grape Variety 2'] || null,
        parseFloatValue(product['Grape Variety Percentage 2']),
        product['Grape Variety 3'] || null,
        parseFloatValue(product['Grape Variety Percentage 3']),
        product['Grape Variety 4'] || null,
        parseFloatValue(product['Grape Variety Percentage 4']),
        product['Grape Variety 5'] || null,
        parseFloatValue(product['Grape Variety Percentage 5']),
        parseIntValue(stock['Case size']),
        parseFloatValue(stock['IB Price PU']),
        parseFloatValue(stock['IB Price per Case']),
        parseFloatValue(stock['DP Price PU']),
        parseFloatValue(stock['DP Price per Case']),
        parseFloatValue(stock[' Cases Available to Purchase ']?.trim()),
        parseIntValue(stock['Bottles Available to Purchase']),
        parseFloatValue(stock['Available Sales']),
        extractVintage(materialCode),
        extractQualityCode(materialCode)
      );
      count++;
    }
    return count;
  });

  const count = insertMany(productData);
  console.log(`   ✅ Imported ${count} wines`);
}

function seedCustomersAndHoldings() {
  console.log('\n👥 Seeding customers and holdings...');

  // Read both CPR holdings files (Non Fine Wine + Fine Wine)
  const nonFineWineData = readCSV('J0064 -DATA - CPR Holdings Non FINE WINE.csv');
  const fineWineData = readCSV('J0064 -DATA - CPR Holdings Fine Wine.csv');

  const holdingsData = [...nonFineWineData, ...fineWineData];

  if (holdingsData.length === 0) {
    console.log('   No holdings data');
    return;
  }

  console.log(`   Found ${nonFineWineData.length} non-fine wine + ${fineWineData.length} fine wine = ${holdingsData.length} total holdings`);

  // Collect unique customers and AMs
  const customersMap = new Map<string, string | null>();
  const accountManagers = new Set<string>();

  for (const row of holdingsData) {
    const customerId = row['Dimension - Customer[Customer Number]'];
    const amId = row['Dimension - Customer[Employee Responsible]'];
    if (customerId) customersMap.set(customerId, amId || null);
    if (amId) accountManagers.add(amId);
  }

  // Clear existing
  db.exec('DELETE FROM PortfolioHolding');
  db.exec('DELETE FROM CustomerPreference');
  db.exec('DELETE FROM Customer');
  db.exec('DELETE FROM AccountManager');

  // Insert Account Managers
  const insertAM = db.prepare(`
    INSERT OR IGNORE INTO AccountManager (id, createdAt, updatedAt)
    VALUES (?, datetime('now'), datetime('now'))
  `);

  const insertAMs = db.transaction((ams: string[]) => {
    for (const id of ams) {
      insertAM.run(id);
    }
  });
  insertAMs(Array.from(accountManagers));
  console.log(`   ✅ Created ${accountManagers.size} account managers`);

  // Insert Customers
  const insertCustomer = db.prepare(`
    INSERT OR IGNORE INTO Customer (id, accountManagerId, createdAt, updatedAt)
    VALUES (?, ?, datetime('now'), datetime('now'))
  `);

  const insertCustomers = db.transaction((customers: [string, string | null][]) => {
    for (const [id, amId] of customers) {
      insertCustomer.run(id, amId);
    }
  });
  insertCustomers(Array.from(customersMap.entries()));
  console.log(`   ✅ Created ${customersMap.size} customers`);

  // Get wine IDs for validation
  const wineIds = new Set(
    db.prepare('SELECT id FROM Wine').all().map((r: any) => r.id)
  );

  // Insert Holdings
  const insertHolding = db.prepare(`
    INSERT OR IGNORE INTO PortfolioHolding (
      id, customerId, wineId, quantity, purchasePrice, currentMarketValue,
      storedStatus, dutyStatus, region, propertyCode, propertyName, colour,
      createdAt, updatedAt
    ) VALUES (
      lower(hex(randomblob(12))), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      datetime('now'), datetime('now')
    )
  `);

  const insertHoldings = db.transaction((holdings: typeof holdingsData) => {
    let count = 0;
    for (const row of holdings) {
      const customerId = row['Dimension - Customer[Customer Number]'];
      const wineId = row['Fact - CPR Stock and Value[Material Code]'];
      const quantity = parseIntValue(row['[CPR_Current_Quantity__Units___as_Measure_]']);

      if (!customerId || !wineId || !quantity || !wineIds.has(wineId)) continue;

      try {
        insertHolding.run(
          customerId,
          wineId,
          quantity,
          parseFloatValue(row['Purchase Price']),
          parseFloatValue(row['Current Market Value']),
          row['Stored Status'] || null,
          row['Duty Status'] || null,
          row['Dimension - Material[Region]'] || null,
          row['Dimension - Property[Property Code]'] || null,
          row['Dimension - Property[Property Name]'] || null,
          row['Dimension - Material[Colour]'] || null
        );
        count++;
      } catch {
        // Skip duplicates
      }
    }
    return count;
  });

  const holdingsCount = insertHoldings(holdingsData);
  console.log(`   ✅ Created ${holdingsCount} portfolio holdings`);
}

function seedCustomerPreferences() {
  console.log('\n🎯 Seeding customer preferences...');

  const t360Data = readCSV('J0064 -DATA - T360.csv');
  if (t360Data.length === 0) {
    console.log('   No T360 data');
    return;
  }

  console.log(`   Found ${t360Data.length} preference records`);

  // Get existing customer IDs
  const existingCustomerIds = new Set(
    db.prepare('SELECT id FROM Customer').all().map((r: any) => r.id)
  );

  const insertCustomer = db.prepare(`
    INSERT OR IGNORE INTO Customer (id, createdAt, updatedAt)
    VALUES (?, datetime('now'), datetime('now'))
  `);

  const insertPref = db.prepare(`
    INSERT OR IGNORE INTO CustomerPreference (
      id, customerId, originalSource, responseType, initialStatement,
      primaryMotivation, whichInterests,
      styleInterestAnswered, styleInterestAll, styleInterestRed, styleInterestWhite,
      styleInterestRose, styleInterestSweet, styleInterestSherryMadeira,
      styleInterestPort, styleInterestSake,
      frenchWineAnswered, frenchWineAll, frenchRedBordeaux, frenchWhiteBordeaux,
      frenchRedBurgundy, frenchWhiteBurgundyChablis, frenchChampagne,
      frenchRhoneValley, frenchLoireValley, frenchBeaujolais, frenchAlsace,
      frenchSweetWines, frenchSouthernFrance, frenchNone,
      italianWineAnswered, italianWineAll, italianPiedmont, italianBrunelloMontalcino,
      italianTuscany, italianOther, italianNone,
      europeanWineAnswered, europeanWineAll, europeanSpain, europeanPortugal,
      europeanGermanyAustria, europeanEngland, europeanOther, europeanNone,
      rowWineAnswered, rowWineAll, rowSouthAmerica, rowNorthAmerica,
      rowAustralia, rowNewZealand, rowSouthAfrica, rowNone,
      collectorSpendAnswered, collectorSpendAllRanges, collectorSpend20to50,
      collectorSpend50to100, collectorSpend100to250, collectorSpend250plus,
      drinkNowSpendAnswered, drinkNowSpendAllRanges, drinkNowSpendUpTo20,
      drinkNowSpend20to50, drinkNowSpend50to100, drinkNowSpend100plus,
      spiritsInterestAnswered, spiritsInterestAll, spiritsScotchWhiskies,
      spiritsOtherWhiskies, spiritsGin, spiritsRum, spiritsTequilaMezcal,
      spiritsCognacArmagnac, spiritsVodka,
      whiskyRegionAnswered, whiskyRegionAll, whiskySpeyside, whiskyHighland,
      whiskyLowland, whiskyIslayIslands, whiskyCampbeltown, whiskyEngland,
      whiskyIreland, whiskyScandinavia, whiskyRestOfEurope, whiskyBourbonUSA,
      whiskyRyeUSA, whiskyTaiwanIndia, whiskyJapan, whiskyAustraliaNewZealand,
      spiritsSpendAnswered, spiritsSpendAllRanges, spiritsSpendUpTo100,
      spiritsSpend100to200, spiritsSpend200to1000, spiritsSpend1000plus,
      createdAt, updatedAt
    ) VALUES (
      lower(hex(randomblob(12))), ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      datetime('now'), datetime('now')
    )
  `);

  const insertPrefs = db.transaction((data: typeof t360Data) => {
    let count = 0;
    for (const row of data) {
      const customerId = (row['Account No'] || row['Account No '])?.trim();
      if (!customerId) continue;

      // Ensure customer exists
      if (!existingCustomerIds.has(customerId)) {
        insertCustomer.run(customerId);
        existingCustomerIds.add(customerId);
      }

      try {
        insertPref.run(
          customerId,
          row['Original Source'] || null,
          row['Response Type'] || null,
          row['Initial Statement'] || null,
          row['Primary Motivation'] || null,
          row['Which Interests'] || null,
          parseYN(row['Style Interest - Answered']),
          parseYN(row['Style Interest - All']),
          parseYN(row['Style Interest - Red wine']),
          parseYN(row['Style Interest - White wine']),
          parseYN(row['Style Interest - Rosé wine']),
          parseYN(row['Style Interest - Sweet wine']),
          parseYN(row['Style Interest - Sherry & Madeira']),
          parseYN(row['Style Interest - Port']),
          parseYN(row['Style Interest - Sake']),
          parseYN(row['French Wine Interest - Answered']),
          parseYN(row['French Wine Interest - All']),
          parseYN(row['French Wine Interest - Red Bordeaux']),
          parseYN(row['French Wine Interest - White Bordeaux']),
          parseYN(row['French Wine Interest - Red Burgundy']),
          parseYN(row['French Wine Interest - White Burgundy Chablis']),
          parseYN(row['French Wine Interest - Champagne']),
          parseYN(row['French Wine Interest - Rhône valley']),
          parseYN(row['French Wine Interest - Loire valley']),
          parseYN(row['French Wine Interest - Beaujolais']),
          parseYN(row['French Wine Interest - Alsace']),
          parseYN(row['French Wine Interest - Sweet wines']),
          parseYN(row['French Wine Interest - Southern France']),
          parseYN(row['French Wine Interest - None']),
          parseYN(row['Italian Wine Interest - Answered']),
          parseYN(row['Italian Wine Interest - All']),
          parseYN(row['Italian Wine Interest - Piedmont']),
          parseYN(row['Italian Wine Interest - Brunello di Montalcino']),
          parseYN(row['Italian Wine Interest - Tuscany']),
          parseYN(row['Italian Wine Interest - Other']),
          parseYN(row['Italian Wine Interest - None']),
          parseYN(row['European Wine Interest - Answered']),
          parseYN(row['European Wine Interest - All']),
          parseYN(row['European Wine Interest - Spain']),
          parseYN(row['European Wine Interest - Portugal']),
          parseYN(row['European Wine Interest - GermanyAustria']),
          parseYN(row['European Wine Interest - England']),
          parseYN(row['European Wine Interest - Other']),
          parseYN(row['European Wine Interest - None']),
          parseYN(row['Rest of World Wine Interest - Answered']),
          parseYN(row['Rest of World Wine Interest - All']),
          parseYN(row['Rest of World Wine Interest - South America']),
          parseYN(row['Rest of World Wine Interest - North America']),
          parseYN(row['Rest of World Wine Interest - Australia']),
          parseYN(row['Rest of World Wine Interest - New Zealand']),
          parseYN(row['Rest of World Wine Interest - South Africa']),
          parseYN(row['Rest of World Wine Interest - None']),
          parseYN(row['Collector - Wine Spend per Bottle - Answered']),
          parseYN(row['Collector - Wine Spend per Bottle - All ranges']),
          parseYN(row['Collector - Wine Spend per Bottle - £20 - £50']),
          parseYN(row['Collector - Wine Spend per Bottle - £50 - £100']),
          parseYN(row['Collector - Wine Spend per Bottle - £100 - £250']),
          parseYN(row['Collector - Wine Spend per Bottle - £250 +']),
          parseYN(row['Drink Now - Wine Spend per Bottle - Answered']),
          parseYN(row['Drink Now - Wine Spend per Bottle - All ranges']),
          parseYN(row['Drink Now - Wine Spend per Bottle - Up to £20']),
          parseYN(row['Drink Now - Wine Spend per Bottle - £20 - £50']),
          parseYN(row['Drink Now - Wine Spend per Bottle - £50 - £100']),
          parseYN(row['Drink Now - Wine Spend per Bottle - £100 +']),
          parseYN(row['Spirits Interest - Answered']),
          parseYN(row['Spirits Interest - All']),
          parseYN(row['Spirits Interest - Scotch Whiskies']),
          parseYN(row['Spirits Interest - Other Whiskies']),
          parseYN(row['Spirits Interest - Gin']),
          parseYN(row['Spirits Interest - Rum']),
          parseYN(row['Spirits Interest - Tequila Mezcal']),
          parseYN(row['Spirits Interest - Cognac Armagnac']),
          parseYN(row['Spirits Interest - Vodka']),
          parseYN(row['Whisky Region Interest - Answered']),
          parseYN(row['Whisky Region Interest - All']),
          parseYN(row['Whisky Region Interest - Speyside']),
          parseYN(row['Whisky Region Interest - Highland']),
          parseYN(row['Whisky Region Interest - Lowland']),
          parseYN(row['Whisky Region Interest - Islay & Islands']),
          parseYN(row['Whisky Region Interest - Campbeltown']),
          parseYN(row['Whisky Region Interest - England']),
          parseYN(row['Whisky Region Interest - Ireland']),
          parseYN(row['Whisky Region Interest - Scandinavia']),
          parseYN(row['Whisky Region Interest - Rest of Europe']),
          parseYN(row['Whisky Region Interest - Bourbon (USA)']),
          parseYN(row['Whisky Region Interest - Rye (USA)']),
          parseYN(row['Whisky Region Interest - Taiwan & India']),
          parseYN(row['Whisky Region Interest - Japan']),
          parseYN(row['Whisky Region Interest - Australia & New Zealand']),
          parseYN(row['Spirits Spend per Bottle - Answered']),
          parseYN(row['Spirits Spend per Bottle - All ranges']),
          parseYN(row['Spirits Spend per Bottle - Up to £100']),
          parseYN(row['Spirits Spend per Bottle - £100 - £200']),
          parseYN(row['Spirits Spend per Bottle - £200 - £1000']),
          parseYN(row['Spirits Spend per Bottle - £1000 +'])
        );
        count++;
      } catch {
        // Skip duplicates
      }
    }
    return count;
  });

  const count = insertPrefs(t360Data);
  console.log(`   ✅ Imported ${count} customer preferences`);
}

function seedVintageRatings() {
  console.log('\n🍷 Seeding vintage ratings...');

  const ratingsData = readCSV('DATA - Vintage Ratings.csv');
  if (ratingsData.length === 0) {
    console.log('   No vintage ratings');
    return;
  }

  db.exec('DELETE FROM VintageRating');

  const insert = db.prepare(`
    INSERT OR IGNORE INTO VintageRating (id, region, year, rating)
    VALUES (lower(hex(randomblob(12))), ?, ?, ?)
  `);

  const insertRatings = db.transaction((data: typeof ratingsData) => {
    let count = 0;
    for (const row of data) {
      const region = row['Region'];
      if (!region) continue;

      for (const [key, value] of Object.entries(row)) {
        if (key === 'Region') continue;
        const year = parseIntValue(key);
        const rating = parseIntValue(value);
        if (year && rating) {
          insert.run(region, year, rating);
          count++;
        }
      }
    }
    return count;
  });

  const count = insertRatings(ratingsData);
  console.log(`   ✅ Imported ${count} vintage ratings`);
}

// Main
console.log('🌱 Starting fast database seed...');
console.log(`   Data directory: ${DATA_DIR}`);

if (!fs.existsSync(DATA_DIR)) {
  console.log('\n❌ Data directory not found!');
  process.exit(1);
}

const startTime = Date.now();

seedWines();
seedCustomersAndHoldings();
seedCustomerPreferences();
seedVintageRatings();

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

// Summary
console.log('\n📊 Database Summary:');
console.log(`   Wines: ${db.prepare('SELECT COUNT(*) as c FROM Wine').get()?.c}`);
console.log(`   Customers: ${db.prepare('SELECT COUNT(*) as c FROM Customer').get()?.c}`);
console.log(`   Account Managers: ${db.prepare('SELECT COUNT(*) as c FROM AccountManager').get()?.c}`);
console.log(`   Portfolio Holdings: ${db.prepare('SELECT COUNT(*) as c FROM PortfolioHolding').get()?.c}`);
console.log(`   Customer Preferences: ${db.prepare('SELECT COUNT(*) as c FROM CustomerPreference').get()?.c}`);
console.log(`   Vintage Ratings: ${db.prepare('SELECT COUNT(*) as c FROM VintageRating').get()?.c}`);

console.log(`\n✅ Seed complete in ${elapsed} seconds!`);

db.pragma('foreign_keys = ON');  // Re-enable FK checks
db.close();
