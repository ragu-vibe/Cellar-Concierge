import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find wines in customer's preferred regions and budget
  const preferredRegions = [
    'Bordeaux', 'Burgundy', 'Champagne', 'Rhône', 'Rhone',
    'Piedmont', 'Piemonte', 'Tuscany', 'Toscana',
    'Spain', 'Rioja', 'Ribera del Duero', 'Priorat',
    'Portugal', 'Douro', 'Port',
    'Australia', 'Barossa', 'Hunter Valley',
    'New Zealand', 'Marlborough', 'Central Otago'
  ];

  // Query wines in budget range with availability
  const wines = await prisma.wine.findMany({
    where: {
      bottlesAvailable: { gt: 0 },
      ibPricePerUnit: { gte: 50, lte: 250 },
    },
    select: {
      id: true,
      name: true,
      region: true,
      subRegion: true,
      producer: true,
      vintage: true,
      colour: true,
      ibPricePerUnit: true,
      bottlesAvailable: true,
      drinkingFromDate: true,
      drinkingToDate: true,
      maturity: true,
    },
    orderBy: { ibPricePerUnit: 'asc' },
    take: 500,
  });

  // Filter to preferred regions
  const matched = wines.filter(w =>
    preferredRegions.some(r =>
      w.region?.toLowerCase().includes(r.toLowerCase()) ||
      w.subRegion?.toLowerCase().includes(r.toLowerCase())
    )
  );

  console.log(`\nFound ${matched.length} wines in preferred regions (£50-250, in stock)\n`);

  // Group by region
  const byRegion: Record<string, typeof matched> = {};
  for (const wine of matched) {
    const region = wine.region || 'Unknown';
    if (!byRegion[region]) byRegion[region] = [];
    byRegion[region].push(wine);
  }

  // Show sample from each region
  for (const [region, regionWines] of Object.entries(byRegion).slice(0, 10)) {
    console.log(`\n=== ${region} (${regionWines.length} wines) ===`);
    for (const w of regionWines.slice(0, 3)) {
      console.log(`  £${w.ibPricePerUnit} | ${w.name} | ${w.colour} | ${w.vintage || 'NV'} | ${w.bottlesAvailable} btl`);
    }
  }

  // Summary stats
  const reds = matched.filter(w => w.colour?.toLowerCase() === 'red').length;
  const whites = matched.filter(w => w.colour?.toLowerCase() === 'white').length;
  console.log(`\n--- Summary ---`);
  console.log(`Total: ${matched.length} wines`);
  console.log(`Red: ${reds}, White: ${whites}, Other: ${matched.length - reds - whites}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
