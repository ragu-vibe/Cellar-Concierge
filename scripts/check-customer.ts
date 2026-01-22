import { prisma } from '../lib/db';

async function main() {
  // First, find customers with rich preferences AND holdings
  const prefsWithCounts = await prisma.customerPreference.findMany({
    where: {
      customer: {
        portfolioHoldings: { some: {} }
      }
    },
    take: 100
  });

  // Score each by how many preferences they've selected
  const scored = prefsWithCounts.map(p => {
    let score = 0;
    // Wine styles
    if (p.styleInterestRed) score++;
    if (p.styleInterestWhite) score++;
    if (p.styleInterestRose) score++;
    if (p.styleInterestSweet) score++;
    if (p.styleInterestPort) score++;
    if (p.styleInterestSake) score++;
    // French
    if (p.frenchRedBordeaux) score++;
    if (p.frenchWhiteBordeaux) score++;
    if (p.frenchRedBurgundy) score++;
    if (p.frenchWhiteBurgundyChablis) score++;
    if (p.frenchChampagne) score++;
    if (p.frenchRhoneValley) score++;
    if (p.frenchLoireValley) score++;
    if (p.frenchBeaujolais) score++;
    if (p.frenchAlsace) score++;
    if (p.frenchSweetWines) score++;
    if (p.frenchSouthernFrance) score++;
    // Italian
    if (p.italianPiedmont) score++;
    if (p.italianTuscany) score++;
    if (p.italianBrunelloMontalcino) score++;
    if (p.italianOther) score++;
    // European
    if (p.europeanSpain) score++;
    if (p.europeanPortugal) score++;
    if (p.europeanGermanyAustria) score++;
    if (p.europeanEngland) score++;
    // ROW
    if (p.rowSouthAmerica) score++;
    if (p.rowNorthAmerica) score++;
    if (p.rowAustralia) score++;
    if (p.rowNewZealand) score++;
    if (p.rowSouthAfrica) score++;
    // Budget
    if (p.collectorSpend20to50) score++;
    if (p.collectorSpend50to100) score++;
    if (p.collectorSpend100to250) score++;
    if (p.collectorSpend250plus) score++;
    if (p.drinkNowSpendUpTo20) score++;
    if (p.drinkNowSpend20to50) score++;
    if (p.drinkNowSpend50to100) score++;
    if (p.drinkNowSpend100plus) score++;

    return { customerId: p.customerId, score, prefs: p };
  });

  // Sort by score and filter to 16-20 range (selective but engaged)
  scored.sort((a, b) => b.score - a.score);
  const selective = scored.filter(s => s.score >= 16 && s.score <= 20);
  console.log('Customers with 16-20 preferences (selective but engaged):');
  selective.slice(0, 10).forEach(s => console.log(`  ${s.customerId}: ${s.score} preferences selected`));

  const best = selective[0];
  if (!best) {
    console.log('No customers found with both preferences and holdings');
    return;
  }

  const customerId = best.customerId;
  const p = best.prefs;
  console.log('\n\n========================================');
  console.log('SELECTED CUSTOMER:', customerId);
  console.log('Preference richness score:', best.score);
  console.log('========================================');

  console.log('\nT360 PREFERENCES:');
  console.log('  Initial statement:', p.initialStatement);
  console.log('  Primary motivation:', p.primaryMotivation);

  console.log('\n  Wine Styles:');
  const styles = [];
  if (p.styleInterestRed) styles.push('Red');
  if (p.styleInterestWhite) styles.push('White');
  if (p.styleInterestRose) styles.push('Rosé');
  if (p.styleInterestSweet) styles.push('Sweet');
  if (p.styleInterestPort) styles.push('Port');
  if (p.styleInterestSake) styles.push('Sake');
  if (p.styleInterestSherryMadeira) styles.push('Sherry/Madeira');
  console.log('   ', styles.length > 0 ? styles.join(', ') : '(none selected)');

  console.log('\n  French Regions:');
  const french = [];
  if (p.frenchRedBordeaux) french.push('Red Bordeaux');
  if (p.frenchWhiteBordeaux) french.push('White Bordeaux');
  if (p.frenchRedBurgundy) french.push('Red Burgundy');
  if (p.frenchWhiteBurgundyChablis) french.push('White Burgundy/Chablis');
  if (p.frenchChampagne) french.push('Champagne');
  if (p.frenchRhoneValley) french.push('Rhône');
  if (p.frenchLoireValley) french.push('Loire');
  if (p.frenchBeaujolais) french.push('Beaujolais');
  if (p.frenchAlsace) french.push('Alsace');
  if (p.frenchSweetWines) french.push('Sweet Wines');
  if (p.frenchSouthernFrance) french.push('Southern France');
  console.log('   ', french.length > 0 ? french.join(', ') : '(none selected)');

  console.log('\n  Italian Regions:');
  const italian = [];
  if (p.italianPiedmont) italian.push('Piedmont');
  if (p.italianTuscany) italian.push('Tuscany');
  if (p.italianBrunelloMontalcino) italian.push('Brunello');
  if (p.italianOther) italian.push('Other Italy');
  console.log('   ', italian.length > 0 ? italian.join(', ') : '(none selected)');

  console.log('\n  European (non-French/Italian):');
  const euro = [];
  if (p.europeanSpain) euro.push('Spain');
  if (p.europeanPortugal) euro.push('Portugal');
  if (p.europeanGermanyAustria) euro.push('Germany/Austria');
  if (p.europeanEngland) euro.push('England');
  if (p.europeanOther) euro.push('Other Europe');
  console.log('   ', euro.length > 0 ? euro.join(', ') : '(none selected)');

  console.log('\n  Rest of World:');
  const row = [];
  if (p.rowNorthAmerica) row.push('North America');
  if (p.rowSouthAmerica) row.push('South America');
  if (p.rowAustralia) row.push('Australia');
  if (p.rowNewZealand) row.push('New Zealand');
  if (p.rowSouthAfrica) row.push('South Africa');
  console.log('   ', row.length > 0 ? row.join(', ') : '(none selected)');

  console.log('\n  Budget - Collecting:');
  const collectBudget = [];
  if (p.collectorSpend20to50) collectBudget.push('£20-50');
  if (p.collectorSpend50to100) collectBudget.push('£50-100');
  if (p.collectorSpend100to250) collectBudget.push('£100-250');
  if (p.collectorSpend250plus) collectBudget.push('£250+');
  console.log('   ', collectBudget.length > 0 ? collectBudget.join(', ') : '(none selected)');

  console.log('\n  Budget - Drinking Now:');
  const drinkBudget = [];
  if (p.drinkNowSpendUpTo20) drinkBudget.push('<£20');
  if (p.drinkNowSpend20to50) drinkBudget.push('£20-50');
  if (p.drinkNowSpend50to100) drinkBudget.push('£50-100');
  if (p.drinkNowSpend100plus) drinkBudget.push('£100+');
  console.log('   ', drinkBudget.length > 0 ? drinkBudget.join(', ') : '(none selected)');

  // Get holdings summary
  const holdings = await prisma.portfolioHolding.findMany({
    where: { customerId },
    include: {
      wine: {
        select: { name: true, region: true, vintage: true, colour: true, ibPricePerUnit: true }
      }
    }
  });

  console.log('\n\nPORTFOLIO HOLDINGS:');
  console.log('  Total wines:', holdings.length);
  const totalBottles = holdings.reduce((s, h) => s + h.quantity, 0);
  const totalValue = holdings.reduce((s, h) => s + (h.currentMarketValue || 0), 0);
  console.log('  Total bottles:', totalBottles);
  console.log('  Total value: £', totalValue.toLocaleString());

  // Region breakdown
  const regions = new Map<string, { bottles: number; value: number }>();
  for (const h of holdings) {
    const r = h.wine?.region || 'Unknown';
    const existing = regions.get(r) || { bottles: 0, value: 0 };
    regions.set(r, {
      bottles: existing.bottles + h.quantity,
      value: existing.value + (h.currentMarketValue || 0)
    });
  }

  console.log('\n  Region breakdown:');
  [...regions.entries()]
    .sort((a, b) => b[1].bottles - a[1].bottles)
    .slice(0, 10)
    .forEach(([r, data]) => {
      console.log(`    ${r}: ${data.bottles} bottles (£${data.value.toLocaleString()})`);
    });

  // Sample wines
  console.log('\n  Sample wines:');
  holdings.slice(0, 5).forEach(h => {
    console.log(`    - ${h.wine?.name} (${h.quantity} btls, £${h.currentMarketValue})`);
  });
}

main()
  .then(() => prisma.$disconnect())
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
