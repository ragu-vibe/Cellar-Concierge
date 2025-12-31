# Cellar Concierge

Premium, production-feeling prototype for fine-wine cellar planning with Account Manager curation. Built with Next.js 14 App Router, TypeScript, TailwindCSS, shadcn/ui patterns, Zustand state management, and Ragu AI integration.

**Repository**: https://github.com/ragu-vibe/Cellar-Concierge

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Demo Flow

1. **Landing Page** → Luxury AM-forward messaging, "Begin Your Consultation" CTA
2. **Onboarding** → 10-screen CBC flow capturing strategy, budget, motives, constraints
3. **Welcome Flow** → Personalized greeting + 3 wine recommendations based on profile
4. **Dashboard** → Monthly plan draft, Cellar Health Score, portfolio overview
5. **Chat** → AI-powered wine recommendations via Ragu RAG
6. **Plan Builder** → Swap wines, adjust quantities, submit to AM for review
7. **AM View** → Switch role to Account Manager, approve/modify client plans
8. **Portfolio** → Track holdings, indicative valuations, drinking windows
9. **Sell Intent** → Submit wines for BBR resale facilitation

---

## Production Integration Requirements

This prototype is designed with clear integration seams. Below are all external services and data sources needed for production deployment.

### 1. Ragu AI (RAG + LLM)

**Purpose**: Powers chat recommendations, wine matching, and natural language understanding.

| Requirement | Description | Environment Variable |
|-------------|-------------|---------------------|
| API Key | Ragu SDK authentication | `RAGU_API_KEY` |
| Assistant ID | Pre-configured assistant with BBR knowledge | `RAGU_ASSISTANT_ID` |
| Base URL | API endpoint (default: sdk.ragu.ai) | `RAGU_BASE_URL` |

**Files to update**:
- [lib/ragu/raguClient.ts](lib/ragu/raguClient.ts) - Core SDK client
- [app/api/chat/route.ts](app/api/chat/route.ts) - Chat endpoint
- [lib/ragu/extractionPrompts.ts](lib/ragu/extractionPrompts.ts) - Prompt templates

**Current state**: Mock responses when credentials not configured. Real Ragu integration ready.

**Data to load into Ragu**:
- Full BBR wine inventory (see `Web Stock 16.01.25.xlsx` - 3,991 wines)
- Wine regions, producers, vintages, tasting notes
- Critic scores and reviews (if available)
- Allocation availability and pricing

---

### 2. Wine Inventory Data

**Purpose**: Wine catalog with pricing, availability, and metadata for recommendations.

**Current state**: 60 hand-curated wines in [data/inventory.ts](data/inventory.ts)

**Production data source**: BBR inventory feed (e.g., `Web Stock 16.01.25.xlsx`)

| Field | Source | Notes |
|-------|--------|-------|
| `name` | Excel: `Material Description (Long)` | Direct mapping |
| `vintage` | Excel: `Vintage` | NaN = NV |
| `region` | Excel: `Region` | Direct mapping |
| `price_gbp` | Excel: `Retail DP` | Duty-paid retail price |
| `availability` | Excel: `ATP` | Available to Promise |
| `drink_window` | Excel: `Maturity Desc` | Parse "Ready - Mature", "Not ready", etc. |
| `grapes` | **Missing** | Derive from name or external source |
| `critic_signal` | **Missing** | External API (Wine-Searcher, Vivino, etc.) |
| `scarcity_level` | **Missing** | Derive from ATP: <6 = Ultra, <12 = High, etc. |
| `tags` | **Missing** | Derive from price/region/name patterns |
| `producer` | **Missing** | Parse from wine name |

**Files to update**:
- [data/inventory.ts](data/inventory.ts) - Replace with parsed Excel data
- Create `scripts/parseInventory.ts` - Excel → TypeScript conversion

---

### 3. Critic Scores / Wine Ratings

**Purpose**: `critic_signal` field for investment-grade filtering and recommendation ranking.

**Options**:

| Provider | Coverage | Integration |
|----------|----------|-------------|
| Wine-Searcher API | Extensive | REST API |
| Vivino | Consumer ratings | Unofficial API |
| CellarTracker | Community scores | Export/API |
| Manual curation | BBR staff picks | Spreadsheet |

**Files to update**:
- [data/inventory.ts](data/inventory.ts) - Add `critic_signal` values
- Consider: `lib/integrations/criticScores.ts` - External API client

---

### 4. BBR Backend APIs

**Purpose**: Real order creation, portfolio management, and account data.

| Endpoint | Purpose | Mock Location |
|----------|---------|---------------|
| `GET /inventory` | Live wine availability | [app/api/bbr/inventory/route.ts](app/api/bbr/inventory/route.ts) |
| `GET /portfolio` | Client holdings | [app/api/bbr/portfolio/route.ts](app/api/bbr/portfolio/route.ts) |
| `GET /allocations` | Exclusive allocations | [app/api/bbr/allocations/route.ts](app/api/bbr/allocations/route.ts) |
| `POST /createDraftOrder` | Create purchase order | [app/api/bbr/createDraftOrder/route.ts](app/api/bbr/createDraftOrder/route.ts) |
| `POST /submitForAMReview` | Send plan to AM | [app/api/bbr/submitForAMReview/route.ts](app/api/bbr/submitForAMReview/route.ts) |
| `POST /approvePlan` | AM approval | [app/api/bbr/approvePlan/route.ts](app/api/bbr/approvePlan/route.ts) |
| `POST /createSellIntent` | Resale request | [app/api/bbr/createSellIntent/route.ts](app/api/bbr/createSellIntent/route.ts) |

**Files to update**:
- [lib/integrations/bbrClient.ts](lib/integrations/bbrClient.ts) - Replace mock calls with real API
- Add authentication headers, error handling, retry logic

---

### 5. User Authentication

**Purpose**: Client identity, AM assignments, session management.

**Current state**: Role switching via UI toggle (demo mode)

**Production requirements**:
- SSO integration (BBR customer portal)
- JWT or session-based auth
- AM ↔ Client relationship mapping

**Files to update**:
- [lib/store/demoStore.ts](lib/store/demoStore.ts) - Replace with auth context
- Add `lib/auth/` directory with auth utilities
- Add middleware for protected routes

---

### 6. Portfolio Valuation Service

**Purpose**: Real-time indicative values for client holdings.

**Current state**: Static mock data in [data/portfolio.ts](data/portfolio.ts)

**Production requirements**:
- Integration with Liv-ex, Wine-Searcher Pro, or BBR's valuation engine
- Historical price data for charts
- Market movement indicators

**Files to update**:
- [data/portfolio.ts](data/portfolio.ts) - Replace with API calls
- [components/charts/PortfolioValueChart.tsx](components/charts/PortfolioValueChart.tsx) - Real data binding

---

### 7. Storage & Cellar Management

**Purpose**: Track where wines are physically stored.

**Current state**: Not implemented

**Production requirements**:
- BBR Reserves storage integration
- Delivery address management
- Temperature/condition monitoring (optional)

**Files to add**:
- `lib/integrations/storageClient.ts`
- `app/api/storage/` routes
- Storage location UI in portfolio view

---

### 8. Order Fulfillment & Delivery

**Purpose**: Dispatch wines from storage to client.

**Current state**: Not implemented

**Production requirements**:
- Delivery scheduling
- Carrier integration (DPD, specialized wine couriers)
- Tracking notifications

**Files to add**:
- `lib/integrations/deliveryClient.ts`
- `app/api/delivery/` routes
- Order tracking UI

---

### 9. Notification Service

**Purpose**: Email/SMS for plan approvals, new allocations, drinking window alerts.

**Current state**: Not implemented

**Production requirements**:
- Email service (SendGrid, AWS SES, etc.)
- SMS for urgent allocations
- Push notifications (optional)

**Files to add**:
- `lib/integrations/notificationClient.ts`
- Email templates
- Notification preferences UI

---

## Environment Variables

Create `.env.local` with:

```bash
# Ragu AI
RAGU_API_KEY=your_api_key
RAGU_ASSISTANT_ID=your_assistant_id
RAGU_BASE_URL=https://sdk.ragu.ai

# BBR APIs (when available)
BBR_API_BASE_URL=https://api.bbr.com
BBR_API_KEY=your_bbr_api_key

# Auth (when implemented)
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

See [.env.example](.env.example) for all variables.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Next.js)                         │
├─────────────────────────────────────────────────────────────────┤
│  Components          │  State (Zustand)    │  API Routes        │
│  - Onboarding        │  - demoStore.ts     │  - /api/chat       │
│  - Chat              │  - cellarProfile    │  - /api/bbr/*      │
│  - Portfolio         │  - chatMessages     │  - /api/ragu/*     │
│  - Plan Builder      │  - portfolio        │                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                          │
├──────────────────┬──────────────────┬───────────────────────────┤
│   Ragu AI        │   BBR Backend    │   Third-Party             │
│   - Chat/RAG     │   - Inventory    │   - Liv-ex (valuation)    │
│   - Extraction   │   - Portfolio    │   - Critics (scores)      │
│   - Matching     │   - Orders       │   - Delivery              │
└──────────────────┴──────────────────┴───────────────────────────┘
```

---

## Key Files Reference

| Area | File | Purpose |
|------|------|---------|
| **Onboarding** | [components/onboarding/CellarPlanningModal.tsx](components/onboarding/CellarPlanningModal.tsx) | 10-screen CBC flow |
| **Profile Schema** | [lib/types/cellarProfile.ts](lib/types/cellarProfile.ts) | User preference types |
| **Profile Scoring** | [lib/scoring/profileScoring.ts](lib/scoring/profileScoring.ts) | CBC → motive weights |
| **Ragu Client** | [lib/ragu/raguClient.ts](lib/ragu/raguClient.ts) | AI SDK integration |
| **Extraction Prompts** | [lib/ragu/extractionPrompts.ts](lib/ragu/extractionPrompts.ts) | LLM prompts |
| **Chat UI** | [components/chat/ChatPanel.tsx](components/chat/ChatPanel.tsx) | Chat interface |
| **Welcome Flow** | [components/onboarding/WelcomeFlow.tsx](components/onboarding/WelcomeFlow.tsx) | Post-onboarding |
| **Wine Inventory** | [data/inventory.ts](data/inventory.ts) | 60 demo wines |
| **State Store** | [lib/store/demoStore.ts](lib/store/demoStore.ts) | Zustand store |
| **BBR Mock APIs** | [lib/integrations/bbrClient.ts](lib/integrations/bbrClient.ts) | API client |

---

## Compliance Notes

- Footer includes age gate and valuation disclaimer
- Portfolio views include "Indicative only. Not investment advice."
- No financial advice claims in AI responses
- GDPR considerations for profile data storage

---

## Scripts

```bash
npm run dev      # Local dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with clear commit messages
4. Submit a pull request

---

## License

Proprietary - Berry Bros. & Rudd / Ragu AI
