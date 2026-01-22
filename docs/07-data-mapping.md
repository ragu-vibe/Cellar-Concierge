# Data Mapping: Designed vs. Available

This document maps what the Cellar Concierge prototype was designed to use vs. what data is actually available from BBR systems.

---

## ⚠️ Critical Integration Reality

**BBR currently has NO external APIs available for any of these purposes.**

All integrations would require BBR to build custom APIs. This has significant implications:

| Current State | Impact |
|---------------|--------|
| No external inventory API | BBR would need to expose product/stock data |
| No external portfolio API | BBR would need to expose CPR holdings data |
| No allocations system | Would need to be built from scratch |
| No order creation API | Would need to integrate with Cockpit or Magento backend |
| No plan workflow system | May be entirely internal to Cellar Concierge |
| No sell intent API | Would need integration with BBX or new system |

**Internal systems exist:**
- **Cockpit** (possibly SAP) - Used by Account Managers internally
- **Magento** - Powers the BBR website with some APIs
- **Data files** - Product File, Stock File, CPR Holdings, BBX Data exported as CSV/data extracts

**For POC/Demo:**
- All APIs are currently mocked within Cellar Concierge
- Data files can be imported to populate demo data
- Full integration would require BBR development effort

**Conversations Required:**
- Ian (BBR) to discuss API development approach
- Understand what BBR is willing/able to build
- Timeline and prioritization of integrations

---

## API #1: `GET /api/bbr/inventory`

**Purpose**: Fetch wine inventory/catalog

### Field Mapping

| Designed Field | Available? | BBR Data Source | Notes |
|----------------|------------|-----------------|-------|
| `id` | ✅ Yes | `Material Code` | Unique identifier |
| `name` | ✅ Yes | `Material Description (Long)` | Full wine name |
| `producer` | ✅ Yes | `Property` | Producer/Estate |
| `region` | ✅ Yes | `Region` | Wine region |
| `country` | ✅ Yes | `Country` | Country of origin |
| `grapes` | ✅ Yes | `Grape Variety 1-5` + `Percentage 1-5` | Up to 5 grapes with percentages |
| `vintage` | ✅ Yes | Extract from `Material Code` or `Material Description` | First 4 chars of Material Code (1000 = NV) |
| `price_gbp` | 🔄 Better | `IB Price PU`, `DP Price PU`, `IB Price per Case`, `DP Price per Case` | **Four prices available** - In Bond & Duty Paid, per bottle & per case |
| `availability` | 🔄 Better | `Bottles Available to Purchase`, `Cases Available to Purchase`, `Case size` | **⚠️ SENSITIVE** - Multiple units available |
| `scarcity_level` | ❌ No | - | Does not exist; could derive from availability |
| `critic_signal` | ❌ No | - | Does not exist; no critic score data |
| `drink_window_start` | ⚠️ Partial | `Drinking From Date` | Available for some wines only |
| `drink_window_end` | ⚠️ Partial | `Drinking To Date` | Available for some wines only |
| `tags` | ❌ No | - | Does not exist; could derive from other fields |
| `image` | ❌ No | - | Does not exist |

### Additional Fields Not Originally Designed For

| BBR Field | Available | Potential Use |
|-----------|-----------|---------------|
| `BBRWIN` | ✅ Yes | Alternative wine identifier |
| `Colour` | ✅ Yes | `White`, `Red`, `Rose` - filtering/display |
| `Sweetness` | ✅ Yes | `Dry`, `Off-dry`, `Sweet`, `Luscious` - filtering/display |
| `Volume` | ✅ Yes | Bottle size in litres (0.375, 0.75, 1.5, etc.) |
| `Code - Unit Size` | ✅ Yes | Format name: `BOTTLE`, `MAGNUM`, `HALF` |
| `Hierarchy Level 2` | ✅ Yes | Product category (Wine) |
| `Hierarchy Level 3` | ✅ Yes | Wine type: `Still`, `Sparkling`, `Fortified` |
| `Code - Alcohol Percentage` | ✅ Yes | ABV |
| `Maturity` | ✅ Yes | `Ready - Mature`, `Ready - at best` - useful fallback when no drink dates |
| `Case size` | ✅ Yes | Bottles per case (1, 3, 6, 12) |
| `Available Sales` | ✅ Yes | IB Price × Bottles - total value available |

### Key Differences

**Pricing Model**
- Designed: Single `price_gbp` field
- Reality: Two prices - **In Bond** (for cellaring) and **Duty Paid** (for immediate drinking)
- Impact: UI needs to show both prices or contextually show one based on user intent

**Availability Model**
- Designed: Single `availability` number
- Reality: Two units - **Bottles** and **Cases**
- Impact: Need to decide how to display (bottles only? both? convert cases to bottles?)

**Missing Enrichment Data**
- No critic scores
- No tags/categories
- No images
- Partial grape data
- Partial drink window data

### ⚠️ Data Sensitivity: Inventory Levels

**Inventory availability is sensitive information.**

- BBR has indicated that inventory levels should not be freely exposed
- Rules for what can/cannot be shown are not yet defined
- Some wines may show exact counts, others may need to show "Limited", "Available", or nothing at all

**Decisions Needed:**
- What are the exact rules for displaying inventory?
- Should we show tiers (e.g., "In Stock", "Limited", "Last Few") instead of exact numbers?
- Are there different rules for different wine categories or client tiers?
- Can we use inventory data internally (for recommendations) even if we don't display it?

**Design Implications:**
- UI should be designed to work with both exact numbers AND vague availability indicators
- Scarcity-based features may need to be rethought if we can't expose inventory levels
- Recommendation engine can potentially use inventory data behind the scenes

### Additional Inventory Fields Available

Data comes from two source files that can be joined on `Material Code`:

#### Product File Fields

| Field | Example | Potential Use |
|-------|---------|---------------|
| `Material Code` | `2022-06-00750-00-8000486` | Unique identifier (includes vintage in code) |
| `Material Description (Long)` | `Champagne Gaston Chiquet, Tradition, 1er Cru, Brut` | Display name |
| `BBRWIN` | `1212572` | BBR wine reference number |
| `Country` | `France` | Country of origin |
| `Region` | `Champagne` | Wine region |
| `Property` | `Gaston Chiquet` | Producer/Estate |
| `Colour` | `White`, `Red`, `Rose` | Wine colour |
| `Sweetness` | `Dry`, `Off-dry`, `Sweet`, `Luscious` | Sweetness level |
| `Volume` | `0.75`, `1.5`, `0.375` | Bottle size in litres |
| `Hierarchy Level 2` | `Wine` | Product category |
| `Hierarchy Level 3` | `Sparkling`, `Still`, `Fortified` | Wine type |
| `Code - Unit Size` | `BOTTLE`, `MAGNUM`, `HALF` | Format name |
| `Code - Unit Volume` | `75CL`, `150CL`, `37_5CL` | Volume code |
| `Code - Alcohol Percentage` | `12.5` | ABV |
| `Drinking From Date` | `2005` | Drink window start (year) - *partial coverage* |
| `Drinking To Date` | `2033` | Drink window end (year) - *partial coverage* |
| `Maturity` | `Ready - Mature`, `Ready - at best` | Maturity status |
| `Grape Variety 1` | `Pinot Noir` | Primary grape |
| `Grape Variety Percentage 1` | `100` | Primary grape % |
| `Grape Variety 2-5` | | Additional grapes (up to 5 total) |
| `Grape Variety Percentage 2-5` | | Additional grape %s |

#### Stock File Fields

| Field | Example | Potential Use |
|-------|---------|---------------|
| `Material Code` | `2022-06-00750-00-8000486` | Join key to Product File |
| `Case size` | `6`, `12`, `3`, `1` | Bottles per case |
| `IB Price PU` | `162.5` | **In Bond price per unit (bottle)** |
| `IB Price per Case` | `975` | In Bond price per case |
| `DP Price PU` | `200` | **Duty Paid price per unit (bottle)** |
| `DP Price per Case` | `1200` | Duty Paid price per case |
| `Cases Available to Purchase` | `0.8` | ⚠️ **SENSITIVE** - Cases in stock (can be fractional) |
| `Bottles Available to Purchase` | `5` | ⚠️ **SENSITIVE** - Bottles in stock |
| `Available Sales` | `812.5` | Available sales value (IB Price PU × Bottles) |

### Fields We Didn't Know We Had

| Field | Value for App |
|-------|---------------|
| `Colour` | Can filter/display wine colour |
| `Sweetness` | Can filter/display sweetness profile |
| `Volume` / `Code - Unit Size` | Can show bottle format (bottle, magnum, half) |
| `Hierarchy Level 3` | Can filter by Still/Sparkling/Fortified |
| `Code - Alcohol Percentage` | Can display ABV |
| `Maturity` | Useful status even when no specific drink dates |
| `Case size` | Know how many bottles per case |
| `Multiple grape varieties` | Up to 5 grapes with percentages |

### Key Observations

#### 1. Material Code Structure

Format: `YYYY-CC-VVVVV-QQ-BBBBBBB`

| Segment | Example | Meaning |
|---------|---------|---------|
| `YYYY` | `2022` | Vintage year (`1000` = NV/no vintage) |
| `CC` | `06` | Case size (bottles per case) |
| `VVVVV` | `00750` | Bottle volume in ml |
| `QQ` | `00` | Quality code |
| `BBBBBBB` | `8000486` | BBR WIN |

**Quality Code:**
- `00` = Normal expected quality (most bottles)
- Other codes (e.g., `G2`) = Lesser quality - damaged packaging, label, markings, etc.
- Quality codes are NOT comparable across wines - just indicates "lower than normal"

#### 2. BBR WIN (Wine Identification Number)

- Similar to LWIN (Liv-ex Wine Identification Number)
- Represents a wine from a producer **across all vintages**
- Internal to BBR
- Useful for grouping same wine across different vintages

#### 3. Pricing Model

| Price Type | Use Case |
|------------|----------|
| **In Bond (IB)** | Without duty or VAT - for cellaring in bonded warehouse |
| **Duty Paid (DP)** | All taxes applied - for immediate drinking/delivery |

Both available per bottle AND per case.

#### 4. Maturity Model

BBR is moving to a unified 4-term model:

| Status | Meaning | Customer Guidance |
|--------|---------|-------------------|
| `Not ready` | Very young, austere | Wait for drinking window start |
| `Ready - youthful` | Entering window, fruity, noticeable tannins | Good now, can cellar for more complexity |
| `Ready - at best` | **Peak drinking window**, beautiful balance | Ideal time to drink |
| `Ready - Mature` | Fully mature, fruit faded | Drink before window ends |

**Legacy statuses still in system:**
- `Ready, but will improve` (9 records)
- `Ready, but will keep` (27 records)
- `Drink now` (27 records)
- `For laying down` (5 records)
- `NULL` (8,110 records - no maturity data)

#### 5. Availability Data

- Cases can be fractional (e.g., `0.8` cases = 5 bottles from a 6-bottle case)
- `Available Sales` = IB Price × Bottles (total value in stock)

#### 6. Grape Data

Up to 5 grape varieties with percentages in Product File

### Data Gaps Confirmed

| Missing | Notes |
|---------|-------|
| Critic scores | Not in Product/Stock files (but available in BBX data - see below) |
| Images | Not in source data |
| Tags/Categories | Not in source data (could derive some from Hierarchy, Colour, Sweetness) |
| Tasting notes | Not in source data |
| Producer description | Not in source data |
| Wine descriptions/copy | Only product name descriptor available |

### Other Data Sources Available

#### BBX Data (Exchange/Resale Listings)

The BBX data file contains additional fields that could enrich inventory data:

| Field | Notes |
|-------|-------|
| `LWIN` | Liv-ex Wine Identification Number - industry standard |
| `Wine Scores` | **Critic scores from:** Wine Advocate, Robert Parker, Galloni, Jancis, Burghound |
| `Livex Prices` | Adjusted Liv-ex price, market price, % difference |
| `WineSearcher Prices` | Adjusted lower list value, % difference |
| `OriginalPurchasePrice` | What customer paid |
| `Conditions` | Bottle, wine, and packaging conditions |
| `Location` | Storage location |
| `Bins` | Specific bin location |
| `Maturity` | Same model as Product File |

**Note:** BBX data is for wines listed for resale, not general inventory. But could potentially source critic scores from here.

### Data We Don't Have Yet (Wishlist)

From discussions, the following would be useful but isn't currently available:

| Data | Why It Would Help |
|------|-------------------|
| **Customer purchase history** | Identify patterns, pre-empt opportunities, constrain upsells to price range |
| **Wines bought direct (not in cellar)** | Currently only see cellar holdings - missing preferences from direct deliveries |
| **Tasting notes/reviews** | For email recommendations, describing wines, explaining matches |
| **Wine descriptions (website copy)** | Better describe wines to customers |
| **Customer demographics** | Age/nationality/account value - help LLM suggest appropriate wines |
| **Historical wine values/prices** | Currently single data point - can't show value increasing/decreasing |
| **Deals of the day** | AMs get daily upsell list via email - not available to LLM |
| **Logistics info** | Transport capabilities/costs, storage locations, delivery feasibility |

### Decisions Needed

1. **Pricing**: Show both prices? Show one based on context? Let user toggle?
2. **Availability**: Show bottles only? Show both? Convert cases (cases × 6 or × 12)?
3. **Scarcity**: Derive from availability or remove feature?
4. **Missing drink windows**: Show "Unknown"? Hide field? Estimate from region/vintage?
5. **Missing grapes**: Show "Unknown"? Hide field?
6. **Tags**: Remove feature? Derive basic tags from other fields?
7. **Images**: Use placeholder? Remove from UI?

---

## API #2: `GET /api/bbr/portfolio`

**Purpose**: Fetch client's wine holdings (CPR - Customer/Cellar Portfolio Record)

### Designed Schema

```typescript
{
  holdings: Array<{
    id: string;
    skuId: string;
    name: string;
    region: string;
    vintage: number;
    bottles: number;
    drinkWindow: {
      start: string;
      end: string;
    };
    indicativeValue: number;
    purchasePrice: number;
    tags: string[];
  }>;
}
```

### Field Mapping

| Designed Field | Available? | BBR Data Source | Notes |
|----------------|------------|-----------------|-------|
| `id` | ✅ Yes | `Material Code` | Unique identifier for the holding |
| `skuId` | 🔄 Different | `BBRWIN` | No SKU concept; BBRWIN is closest (wine across vintages) |
| `name` | ✅ Yes | `Material Description` | Full wine name |
| `region` | ✅ Yes | `Region` | From CPR Holdings or join to Product File |
| `vintage` | ✅ Yes | Extract from `Material Code` | First 4 chars (1000 = NV) |
| `bottles` | ✅ Yes | `Quantity` | Number of bottles in cellar |
| `drinkWindow.start` | ⚠️ Partial | `Drinking From Date` | Available for some wines (via Product File join) |
| `drinkWindow.end` | ⚠️ Partial | `Drinking To Date` | Available for some wines (via Product File join) |
| `indicativeValue` | ❌ No | - | **Not available** - only know current purchase price, not market value |
| `purchasePrice` | ✅ Yes | Purchase price | What customer paid |
| `tags` | ❌ No | - | Does not exist |

### Additional Fields Available (from CPR Holdings)

| BBR Field | Notes |
|-----------|-------|
| `Customer Number` | Unique customer identifier |
| `Account Manager` | Employee responsible for the customer |
| `Vineyard ID` | Property code |
| `Vineyard Name` | Property/producer name |
| `Wine Colour` | Red, White, Rosé |

### Key Differences from Design

**No Market Valuation**
- Designed: `indicativeValue` showing current market worth
- Reality: Only have purchase price - no market value data
- Impact: Cannot show gain/loss, portfolio appreciation, or investment performance
- Workaround options:
  - Use current BBR retail price as proxy (from Stock File)
  - Integrate with Liv-ex API for market prices (future)
  - Show "valuation not available" in UI

**No SKU Concept**
- `BBRWIN` is the closest equivalent - identifies a wine across all vintages
- `Material Code` is the unique identifier for a specific vintage/format

**Holdings Only Show Cellar Stock**
- Data only includes wines held in BBR storage (bonded warehouse)
- Does NOT include wines bought for direct delivery
- Missing insight into customer preferences from direct purchases

### Data Gaps

| Missing | Impact |
|---------|--------|
| Market/indicative value | Cannot show portfolio performance or gain/loss |
| Purchase history | Only see current holdings, not when purchased |
| Direct delivery purchases | Missing preference signals from non-cellar wines |
| Tags | Cannot filter by category |

### ⚠️ Security Requirements

**Portfolio data is highly sensitive and must be secured.**

- Portfolio data must ONLY be accessible to:
  1. The customer who owns it
  2. Their assigned Account Manager
- No other users, customers, or staff should have access
- API must verify authorization before returning data
- Audit logging recommended for access

**Implementation Requirements:**
- Authentication required for all portfolio endpoints
- Authorization check: `customer_id` matches logged-in user OR user is assigned AM
- Consider row-level security if using database
- Never expose portfolio data in client-side code/logs

### Decisions Needed

1. **Valuation**: Remove feature? Use BBR retail as proxy? Show "N/A"?
2. **Gain/Loss display**: Remove from UI since we can't calculate it?
3. **Portfolio charts**: What can we show without historical value data?

---

## API #3: `GET /api/bbr/allocations`

**Purpose**: Fetch exclusive allocations available to client

### ⚠️ Status: FUTURE FEATURE - No Current Data Source

**BBR does not currently have a formal allocation system.**

However, this feature could add significant value by digitizing an existing manual process.

### Current State at BBR

- BBR runs **campaigns with virtual stock** - pre-selling wines that aren't physically in stock yet (e.g., en primeur, upcoming releases)
- Currently, Account Managers manually reach out to their assigned customers to sell this stock
- No system for customers to see what's being offered to them specifically
- No self-service way for customers to accept/decline offers

### Opportunity

An allocations feature could transform this process:

| Current (Manual) | Future (With Allocations) |
|------------------|---------------------------|
| AM emails/calls customers one by one | Customers see allocations in app |
| No visibility for customer | Customer can browse available offers |
| AM tracks responses manually | System tracks accept/decline |
| Time-consuming outreach | Scalable, self-service |
| Easy to miss deadline | Expiry dates visible to customer |

### Designed Schema (For Future Implementation)

```typescript
{
  allocations: Array<{
    id: string;
    wine: {
      name: string;
      producer: string;
      vintage: number;
      region: string;
    };
    allocation: number;      // bottles allocated to this customer
    price_gbp: number;
    expires: string;         // deadline to accept
    notes: string;           // AM notes about why this is special
    campaign?: string;       // e.g., "En Primeur 2023", "Spring Burgundy"
  }>;
}
```

### Data Requirements (If BBR Builds This)

To support allocations, BBR would need:

| Data | Purpose |
|------|---------|
| Campaign/offer ID | Identify the allocation |
| Customer assignments | Which customers get which allocations |
| Quantity per customer | How many bottles they can purchase |
| Pricing | Price for this allocation |
| Expiry date | Deadline to accept |
| Wine details | Material Code or link to Product File |
| AM notes | Personalized message |

### Data Source: TBD

**Where would allocation data live?**

- Unknown at this stage
- Would require conversations with Ian (BBR) to determine:
  - Which system manages campaigns/offers
  - How customer assignments are tracked
  - What integration points exist
- May need new system/database on BBR side

### Demo/POC Approach

For demonstration purposes, we could:
- Create a mock API and database within Cellar Concierge
- Populate with sample allocation data based on current campaigns
- Show the UX flow without real BBR integration
- Use this to validate the concept with BBR stakeholders

### Decisions Needed

1. **Include in MVP?** Remove from initial build, or include as demo with mock data?
2. **BBR interest?** Is this something BBR would want to build/integrate?
3. **If yes:** Conversations needed with Ian to identify data source and integration approach

### Security Note

If implemented, allocations would have similar security requirements to portfolio:
- Only visible to the assigned customer and their AM
- Authentication and authorization required

---

## API #4: `POST /api/bbr/createDraftOrder`

**Purpose**: Create a purchase order draft

### ⚠️ Status: INTEGRATION REQUIRED - Multiple Existing Systems

**BBR has existing order systems, but integration approach TBD.**

### Current State at BBR

Orders/purchases currently work through multiple channels:

| Channel | System | Users |
|---------|--------|-------|
| Account Managers | **Cockpit** (possibly SAP-based) | Internal staff |
| Website | **Magento** via APIs | Customers |

### Integration Options

**Option A: Integrate with Magento APIs**
- Use existing website checkout flow
- Customers already familiar with this
- May have existing API documentation
- Cellar Concierge could hand off to Magento checkout

**Option B: Integrate with Cockpit/SAP**
- Create orders on behalf of customers (AM-assisted flow)
- May require different permissions/integration
- Likely more complex

**Option C: Hybrid approach**
- Customer self-service → Magento
- AM-curated plans → Cockpit
- Cellar Concierge as front-end for both

### Designed Schema

**Request:**
```typescript
{
  memberId: string;
  items: Array<{
    id: string;        // Material Code
    quantity: number;
  }>;
  priceType: 'IB' | 'DP';  // In Bond or Duty Paid
}
```

**Response:**
```typescript
{
  orderId: string;
  status: 'draft';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price_gbp: number;
    subtotal: number;
  }>;
  total: number;
}
```

### Key Considerations

1. **Price Type** - Need to know if customer wants In Bond (cellar) or Duty Paid (delivery)
2. **Stock reservation** - How long is stock held during draft/checkout?
3. **Payment** - Does Cellar Concierge handle payment or hand off to existing system?
4. **Order confirmation** - Who sends confirmation? Cellar Concierge or BBR systems?

### Data Source: TBD

**Requires investigation:**
- What APIs does Magento expose?
- Can we integrate with Cockpit, or is that internal-only?
- Who owns API documentation? (Ian / BBR tech team)

### Demo/POC Approach

For demonstration purposes:
- Mock the order creation API
- Show the UX flow (add to cart → review → confirm)
- Don't actually create real orders
- Hand off to "Contact your AM to complete this order" as interim step

### Decisions Needed

1. **Integration target**: Magento APIs? Cockpit? Both?
2. **Flow**: Full checkout in Cellar Concierge, or hand off to existing BBR checkout?
3. **Payment**: Handle in-app or redirect to BBR payment?
4. **Conversations needed**: With Ian/BBR tech team to understand available APIs

---

## API #5: `POST /api/bbr/submitForAMReview`

**Purpose**: Submit a plan for Account Manager review

### ⚠️ Status: CELLAR CONCIERGE INTERNAL - No BBR API Required

**This is a workflow feature internal to Cellar Concierge, not a BBR backend API.**

### Designed Schema

**Request:**
```typescript
{
  planId: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  plan: {
    id: string;
    status: 'pending_review';
    submittedAt: string;
  };
}
```

### Concept

The plan review workflow is a Cellar Concierge concept:
1. Customer creates/adjusts a plan (monthly wine selections)
2. Customer submits plan for AM review
3. AM receives notification (in Cellar Concierge)
4. AM reviews, modifies if needed, approves
5. Approved plan becomes an order

### Data Requirements

This requires Cellar Concierge to store:

| Data | Purpose |
|------|---------|
| Plans table | Store customer plans with status |
| Plan items | Wines in each plan |
| Plan status | draft → pending_review → approved → ordered |
| Timestamps | Created, submitted, approved dates |
| AM assignments | Which AM reviews which customer's plans |

### Current State at BBR

- AMs don't currently have a "review queue" system
- Client requests come via email, phone, or direct conversation
- No formal plan/review workflow exists
- This is new functionality, not integration with existing system

### Implementation Approach

For Cellar Concierge:
- Build plans/reviews as internal database tables
- No BBR API integration needed
- Notification system (email or in-app) to alert AMs
- Dashboard for AMs to see pending reviews

### Decisions Needed

1. **Notification method**: Email? In-app? Both?
2. **AM assignment**: Auto-assign based on customer? Manual?
3. **Escalation**: What if AM doesn't respond within X days?

---

## API #6: `POST /api/bbr/approvePlan`

**Purpose**: Account Manager approves a client plan

### ⚠️ Status: CELLAR CONCIERGE INTERNAL - No BBR API Required

**This is a workflow feature internal to Cellar Concierge, not a BBR backend API.**

### Designed Schema

**Request:**
```typescript
{
  planId: string;
  amNote: string;
  edits?: Array<{
    action: 'add' | 'remove' | 'substitute';
    wineId: string;
    newWineId?: string;
    reason?: string;
  }>;
}
```

**Response:**
```typescript
{
  success: boolean;
  plan: {
    id: string;
    status: 'approved';
    approvedAt: string;
    amNote: string;
  };
}
```

### Concept

Part of the same workflow as API #5:
1. AM reviews submitted plan
2. Can approve as-is, or make edits first
3. AM adds personal note to customer
4. Approved plan can then proceed to order

### AM Edit Capabilities

| Action | Use Case |
|--------|----------|
| `add` | Add a wine AM thinks customer would enjoy |
| `remove` | Remove a wine that's out of stock or not suitable |
| `substitute` | Replace with better alternative |

Each edit includes `reason` - so customer understands the change.

### Data Requirements

Same as API #5, plus:

| Data | Purpose |
|------|---------|
| Plan history | Track changes made by AM |
| AM notes | Personal message to customer |
| Edit log | What was changed and why |

### Post-Approval Flow

After approval, what happens next?

**Option A: Manual order**
- Customer reviews approved plan
- Customer manually proceeds to checkout
- Uses createDraftOrder (API #4)

**Option B: Auto-order**
- Approved plan automatically becomes order
- Customer has pre-authorized purchases
- More friction-free but higher risk

### Decisions Needed

1. **Post-approval flow**: Manual or auto-order?
2. **Customer notification**: How is customer told plan is approved?
3. **Edit limits**: Can AM change anything or are there guardrails?
4. **Audit trail**: How much history to keep?

---

## API #7: `POST /api/bbr/createSellIntent`

**Purpose**: Submit a wine for resale

### ⚠️ Status: INTEGRATION TBD - BBX System Exists

**BBR has an existing resale system (BBX) but integration approach is unknown.**

### Designed Schema

**Request:**
```typescript
{
  memberId: string;
  bottleId: string;         // Material Code from portfolio
  details: {
    timeframe: string;      // "Within 1 month", "3-6 months", "No rush"
    targetPrice: number;    // Customer's desired price
    reason: string;         // Why selling (optional context for AM)
  };
}
```

**Response:**
```typescript
{
  success: boolean;
  sellIntent: {
    id: string;
    status: 'submitted';
    createdAt: string;
  };
}
```

### Current State at BBR

BBR has **BBX** (Berry Bros. Exchange):
- Customers can list wines for resale
- Includes bidding system (BBXHighestBid, BBXLowestBid)
- Tracks conditions (bottle, wine, packaging)
- References Liv-ex and WineSearcher prices
- Shows listing status and history

### BBX Data Available (from BBX Data file)

| Field | Description |
|-------|-------------|
| `ListingId` | Unique identifier for listing |
| `MaterialCode` | Wine being sold |
| `ListedQuantity` | Bottles listed |
| `ListedValue` | Total value of listing |
| `BBXHighestBid` | Highest bid received |
| `BBXHighestBidderReference` | Customer number of bidder |
| `BBXLowestBid` | Lowest bid received |
| `Livex Prices` | Market reference prices |
| `WineSearcher Prices` | Alternative market prices |
| `OriginalPurchasePrice` | What customer paid |
| `ListingDatetime` | When listed |
| `ListingStatus` | Active, sold, etc. |
| `Conditions` | Bottle, wine, packaging condition |

### Integration Options

**Option A: Submit to BBX**
- Create listing directly in BBX system
- Would need BBX API (doesn't exist externally)
- Full resale flow handled by BBX

**Option B: AM-facilitated**
- Capture sell intent in Cellar Concierge
- Notify AM
- AM manually creates BBX listing or handles sale
- Current manual process, digitized

**Option C: Hybrid**
- Cellar Concierge captures intent and gathers details
- Submits to BBX via new API (when built)
- Customer tracks status in Cellar Concierge

### Field Mapping

| Designed Field | Available? | BBR Data Source | Notes |
|----------------|------------|-----------------|-------|
| `memberId` | ✅ Yes | `Customer Number` | In CPR Holdings data |
| `bottleId` | ✅ Yes | `Material Code` | From portfolio holdings |
| `details.timeframe` | ❌ New | - | Not in BBX - would be new data |
| `details.targetPrice` | ⚠️ Similar | `ListedValue` / `ListedQuantity` | BBX has ListedValue, could derive |
| `details.reason` | ❌ New | - | Not in BBX - would be new data |

### Demo/POC Approach

For demonstration:
- Capture sell intent in Cellar Concierge database
- Show as "Sell Request Submitted"
- Mock flow: AM receives notification → Reviews → Creates BBX listing
- No actual BBX integration

### Pricing Guidance

Cellar Concierge could help customers set realistic prices:
- Show BBX bid range for similar wines (if available)
- Reference Liv-ex market prices
- Show their original purchase price for context
- Recommend price based on data

### Decisions Needed

1. **Integration target**: Direct BBX API (when available)? Or AM-facilitated?
2. **Pricing guidance**: Should we help customers set prices?
3. **Status tracking**: Can customer see status updates?
4. **BBX access**: Who at BBR to talk to about BBX capabilities?

---

## Summary: Data Availability

### Overall Integration Status

| API | Status | BBR Integration Required? |
|-----|--------|---------------------------|
| #1 Inventory | ⚠️ Mapped | Yes - Need API to expose Product/Stock files |
| #2 Portfolio | ⚠️ Mapped | Yes - Need API to expose CPR Holdings |
| #3 Allocations | 🔮 Future | Yes - No current system, would need new build |
| #4 Orders | ⚠️ Mapped | Yes - Integrate with Cockpit or Magento |
| #5 Submit for Review | ✅ Internal | No - Cellar Concierge internal workflow |
| #6 Approve Plan | ✅ Internal | No - Cellar Concierge internal workflow |
| #7 Sell Intent | ⚠️ Mapped | Partial - BBX exists, API integration TBD |

### Inventory (API #1)
| Status | Fields |
|--------|--------|
| ✅ Available | id, name, producer, region, country, vintage |
| ✅ Better than designed | price (4 options: IB/DP × bottle/case), availability (bottles + cases) |
| ✅ Bonus fields | colour, sweetness, volume, alcohol %, maturity, case size |
| ⚠️ Partial | grapes (up to 5), drink_window_start/end |
| ❌ Not available | scarcity_level, critic_signal, tags, image |
| ⚠️ Sensitive | Inventory levels - display rules TBD |

### Portfolio (API #2)
| Status | Fields |
|--------|--------|
| ✅ Available | id (Material Code), name, region, vintage, bottles, purchasePrice |
| 🔄 Different | skuId → BBRWIN (closest equivalent) |
| ⚠️ Partial | drinkWindow.start/end (via Product File join) |
| ❌ Not available | indicativeValue (no market value data), tags |
| ⚠️ Security | Must be secured - only customer + their AM can access |

### Allocations (API #3)
| Status | Notes |
|--------|-------|
| 🔮 Future feature | BBR doesn't have formal allocation system |
| 💡 Opportunity | Could digitize manual campaign/offer process |
| 📝 Data source | TBD - conversations needed with Ian at BBR |
| 🎭 Demo | Mock data for POC demonstration |

### Orders (API #4)
| Status | Notes |
|--------|-------|
| ⚠️ Integration TBD | BBR has internal systems but no external APIs |
| 🏢 Internal systems | Cockpit (AMs), Magento (website) |
| 📝 Decision needed | Integrate with Magento? Cockpit? Hand off to existing checkout? |
| 🎭 Demo | Mock order creation, hand off to "Contact AM" |

### Plan Workflow (APIs #5, #6)
| Status | Notes |
|--------|-------|
| ✅ Internal | New functionality - not BBR integration |
| 🏗️ Build in CC | Plans, statuses, AM assignments stored internally |
| 📧 Notifications | Need to build notification system for AMs |
| 📝 Decision needed | Post-approval flow (manual order vs auto-order) |

### Sell Intent (API #7)
| Status | Notes |
|--------|-------|
| ⚠️ BBX exists | BBR has resale system with good data |
| ❌ No API | Would need BBX API to integrate |
| 💡 Opportunity | Show pricing guidance from BBX/Liv-ex data |
| 🎭 Demo | Capture intent, mock AM-facilitated flow |

---

## Key Decisions Required

### High Priority
1. **Inventory sensitivity rules** - What can/can't be shown?
2. **Pricing display** - Both IB/DP? Contextual? User choice?
3. **Portfolio valuation** - Remove feature? Use retail as proxy?
4. **Order integration** - Magento API? Hand off? Build new?

### Medium Priority
5. **Allocations scope** - Include in MVP or defer?
6. **Scarcity feature** - Derive from stock or remove?
7. **Missing data handling** - Placeholders vs hide fields?
8. **Notification system** - Email? In-app? Both?

### Lower Priority (For Production)
9. **Critic scores** - Source from BBX? External API?
10. **Wine images** - Producer images? Placeholders?
11. **Tags/categories** - Derive from existing fields?
12. **Historical values** - Liv-ex integration?

---

## Conversations Needed

| Topic | Contact | Questions |
|-------|---------|-----------|
| API development | Ian (BBR) | What can BBR build? Timeline? Priorities? |
| Inventory sensitivity | BBR business | Display rules for stock levels |
| Allocations data | Ian (BBR) | Where do campaigns live? Can we access? |
| Order integration | BBR tech | Magento API docs? Cockpit access? |
| BBX integration | BBR tech | Is there an API? Can we create listings? |
| Security requirements | BBR | Authentication, authorization, audit needs |

---

## Next Steps

1. ✅ Document all API mappings - **COMPLETE**
2. Review decisions with BBR stakeholders
3. Prioritize which gaps to address for MVP
4. Design interim solutions for missing data
5. Update UI components to reflect actual data model
6. Build internal workflow features (plans, reviews)
7. Discuss API development timeline with BBR
