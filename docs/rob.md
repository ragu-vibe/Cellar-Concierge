# Demo Setup Guide

Quick guide to get Cellar Concierge running with fresh BBR data.

## TL;DR (if dependencies already installed)

```bash
# Put your CSV files in datafiles/ folder, then:
npx prisma generate && npx prisma db push && npx tsx prisma/seed.ts && npm run dev
```

---

## Full Setup

### Prerequisites

- Node.js 18+ installed
- BBR data export files (CSV format)
- Git checkout: `feature/prisma-database-integration`

### Step 1: Get the Data Files

You need 6 CSV files from BBR. Place them in the `datafiles/` folder at the project root:

```
datafiles/
├── J0064 - Product File.csv          # Wine catalog (199k+ products)
├── J0064 - Stock File.csv            # Pricing and availability
├── J0064 -DATA - CPR Holdings Fine Wine.csv      # Customer holdings (fine wine)
├── J0064 -DATA - CPR Holdings Non FINE WINE.csv  # Customer holdings (non-fine)
├── J0064 -DATA - T360.csv            # Customer preferences survey
└── DATA - Vintage Ratings.csv        # Region/year ratings
```

**Note:** The filenames must match exactly (including spaces and hyphens).

### Step 2: Environment Setup

Copy the example env file if you haven't already:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

The default `.env` should work for local demo:
```
DATABASE_URL="file:./cellar-concierge.db"
NEXT_PUBLIC_USE_LIVE_API=true
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Initialize Database

Generate the Prisma client and create the database schema:

```bash
npx prisma generate
npx prisma db push
```

### Step 5: Import the Data

Run the seed script to import all CSV data:

```bash
npx tsx prisma/seed.ts
```

This takes about 30-60 seconds and will show progress:

```
🌱 Starting fast database seed...
   Data directory: F:\...\datafiles

📦 Seeding wines...
   Found 199169 products, 36174 stock records
   ✅ Imported 199169 wines

👥 Seeding customers and holdings...
   Found 179241 non-fine wine + 118401 fine wine = 297642 total holdings
   ✅ Created 42 account managers
   ✅ Created 33290 customers
   ✅ Created 297642 portfolio holdings

🎯 Seeding customer preferences...
   Found 8623 preference records
   ✅ Imported 8623 customer preferences

🍷 Seeding vintage ratings...
   ✅ Imported 835 vintage ratings

📊 Database Summary:
   Wines: 199169
   Customers: 33290
   Account Managers: 42
   Portfolio Holdings: 297642
   Customer Preferences: 8623
   Vintage Ratings: 835

✅ Seed complete in 32.5 seconds!
```

### Step 6: Start the App

```bash
npm run dev
```

Open http://localhost:3000

---

## Troubleshooting

### "Data directory not found"
Create the `datafiles/` folder and add the CSV files.

### "File not found: J0064 - Product File.csv"
Check the filename matches exactly. The script is case-sensitive.

### Database locked errors
Close any other applications that might have the database open (e.g., DB Browser for SQLite).

### Want to re-import fresh data?
Just run the seed script again - it clears existing data before importing:

```bash
npx tsx prisma/seed.ts
```

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npx tsx prisma/seed.ts` | Import/refresh data from CSVs |
| `npx prisma studio` | Open database browser GUI |
| `npx prisma db push` | Reset database schema |

## Demo Customer

The app uses customer `0020249063` by default - a selective collector with clear preferences and a diverse cellar.

### T360 Survey Profile

| Category | Selections |
|----------|------------|
| **Wine Styles** | Red, White |
| **French Regions** | Red Bordeaux, Red Burgundy, Champagne, Rhône |
| **Italian Regions** | Piedmont, Tuscany |
| **Other Europe** | Spain, Portugal |
| **Rest of World** | Australia, New Zealand |
| **Collecting Budget** | £50-100, £100-250 |
| **Drinking Budget** | £20-50, £50-100 |

*20 preferences selected - selective but engaged (not a "yes to everything" customer)*

### Portfolio Summary

| Metric | Value |
|--------|-------|
| **Total Wines** | 71 different wines |
| **Total Bottles** | 204 bottles |
| **Total Value** | ~£25,000 |

**Top Regions by Holdings:**
- Burgundy: 102 bottles (50%) - *heavy Burgundy collector*
- Bordeaux: 27 bottles (13%)
- Rhône: 24 bottles (12%)
- Champagne: 18 bottles (9%)
- Italy: 15 bottles (7%)

### Interesting Demo Points

1. **Stated vs Revealed Preferences**: T360 says equal interest in Bordeaux and Burgundy, but portfolio is 50% Burgundy vs 13% Bordeaux - shows gap between stated and actual behaviour

2. **Discovery Opportunity**: Customer owns Rhône wines but didn't select Rhône in T360 survey - potential for AI to surface this insight

3. **Budget Alignment**: Collecting budget £50-250 matches portfolio average bottle value

---

### Changing Demo Customer

Edit `lib/store/demoStore.ts`:
```typescript
export const DEFAULT_MEMBER_ID = '0020249063';
```

Then clear browser localStorage to reset.

---

## Preference Systems: T360 vs CBC Wizard

The app has two different preference systems that both produce the same `CollectorProfile` output but capture data differently.

### T360 Survey (BBR's Real System)

BBR's existing customer preference survey. Stored in database, loaded via `/api/bbr/preferences`.

**What it captures:**
- Specific wine styles (red, white, rosé, sparkling, sweet, port, sake)
- Specific regions (Bordeaux, Burgundy, Champagne, Rhône, Loire, Piedmont, Tuscany, Spain, Portugal, Germany, Australia, NZ, Americas, South Africa)
- Budget ranges for collecting (£20-50, £50-100, £100-250, £250+)
- Budget ranges for drinking now (up to £20, £20-50, £50-100, £100+)
- Initial statement about collecting goals

**How we use it:**
- Transform boolean fields → `CollectorProfile` (motivations, riskProfile, timeHorizon, budgetStrategy, regionalFocus)
- Extract region list for display
- Infer budget from spending ranges

### CBC Wizard (In-App Preferences)

Choice-Based Conjoint questionnaire accessed via "Preferences" button in navbar. 10 behavioral trade-off questions.

**What it captures:**
- Investment vs consumption priority
- Collection depth vs breadth
- Recognition vs discovery
- Risk tolerance (certainty vs upside)
- Liquidity vs return preference
- Drinking timeline
- Regional strategy (focused vs diverse)
- Budget strategy (trophy/balanced/volume)
- Decision-making style
- 10-year vision

**What it does NOT capture:**
- Specific regions (only asks depth vs breadth)
- Specific wine styles
- Actual budget amounts in £

### Key Difference

| Aspect | T360 | CBC Wizard |
|--------|------|------------|
| **Approach** | Direct preferences ("Do you like Bordeaux?") | Behavioral inference ("Would you rather...") |
| **Region data** | Yes - specific regions | No - only depth/breadth strategy |
| **Budget data** | Yes - actual £ ranges | No - only trophy/balanced/volume |
| **Wine styles** | Yes - red, white, etc. | No |
| **Motivations** | Inferred from patterns | Directly measured via trade-offs |

### Demo Implications

- **Dashboard profile card**: Shows T360 data (real from database)
- **CBC wizard**: Lets users recalibrate behavioral preferences, but doesn't capture region/style specifics
- **If user completes CBC wizard**: It overwrites the behavioral aspects (motivations, risk, etc.) but doesn't touch regions since CBC doesn't capture them
