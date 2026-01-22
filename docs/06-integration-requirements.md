# Integration Requirements

This document details all external services and integrations required for production deployment.

---

## Overview

| Integration | Status | Priority | Description |
|-------------|--------|----------|-------------|
| Ragu AI | ✅ Ready | Critical | AI chat and recommendations |
| BBR Backend | ⚠️ Mocked | Critical | Inventory, orders, portfolio |
| Authentication | ❌ Demo mode | Critical | User identity and sessions |
| Portfolio Valuation | ⚠️ Static | High | Real-time wine valuations |
| Critic Scores | ❌ Missing | Medium | External rating data |
| Notifications | ❌ Not built | Medium | Email/SMS alerts |
| Storage Management | ❌ Not built | Low | Cellar/reserves tracking |
| Delivery | ❌ Not built | Low | Order fulfillment |

---

## 1. Ragu AI (RAG + LLM)

### Purpose
Powers all AI-driven features:
- Chat recommendations
- Wine matching
- Profile extraction from free text
- Plan generation

### Current Status
✅ **Integration ready** - Client configured, mock fallback when credentials missing

### Configuration

```env
RAGU_API_KEY=your_api_key
RAGU_ASSISTANT_ID=your_assistant_id
RAGU_BASE_URL=https://sdk.ragu.ai
```

### API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v2/chat/messages` | POST | Chat with assistant |
| `/v2/search` | POST | RAG search |
| `/v2/documents` | GET | List knowledge base |
| `/health` | GET | Health check |

### Files

| File | Purpose |
|------|---------|
| [lib/ragu/raguClient.ts](../lib/ragu/raguClient.ts) | SDK client |
| [lib/ragu/extractionPrompts.ts](../lib/ragu/extractionPrompts.ts) | Prompt templates |
| [app/api/chat/route.ts](../app/api/chat/route.ts) | Chat endpoint |

### Data Requirements

The Ragu assistant needs access to:
- Full BBR wine inventory (3,991+ wines)
- Wine metadata (regions, producers, vintages)
- Tasting notes and descriptions
- Critic scores (if available)
- Allocation information

### Action Items
1. Obtain API credentials from Ragu team
2. Configure assistant with BBR wine data
3. Test chat functionality
4. Tune prompts for optimal responses

---

## 2. BBR Backend APIs

### Purpose
Real-time data from Berry Bros. & Rudd systems:
- Wine inventory and availability
- Client portfolios
- Order management
- Allocations

### Current Status
⚠️ **Mocked** - Returns demo data, integration seams ready

### Required Endpoints

| Endpoint | Method | Purpose | Mock Location |
|----------|--------|---------|---------------|
| `GET /inventory` | GET | Wine catalog | [app/api/bbr/inventory](../app/api/bbr/inventory/route.ts) |
| `GET /portfolio/{memberId}` | GET | Client holdings | [app/api/bbr/portfolio](../app/api/bbr/portfolio/route.ts) |
| `GET /allocations/{memberId}` | GET | Exclusive offers | [app/api/bbr/allocations](../app/api/bbr/allocations/route.ts) |
| `POST /orders/draft` | POST | Create order | [app/api/bbr/createDraftOrder](../app/api/bbr/createDraftOrder/route.ts) |
| `POST /plans/{id}/submit` | POST | Submit to AM | [app/api/bbr/submitForAMReview](../app/api/bbr/submitForAMReview/route.ts) |
| `POST /plans/{id}/approve` | POST | AM approval | [app/api/bbr/approvePlan](../app/api/bbr/approvePlan/route.ts) |
| `POST /sell-intents` | POST | Resale request | [app/api/bbr/createSellIntent](../app/api/bbr/createSellIntent/route.ts) |

### Configuration

```env
BBR_API_BASE_URL=https://api.bbr.com
BBR_API_KEY=your_bbr_api_key
```

### Files

| File | Purpose |
|------|---------|
| [lib/integrations/bbrClient.ts](../lib/integrations/bbrClient.ts) | API client |
| [data/inventory.ts](../data/inventory.ts) | Mock inventory |
| [data/portfolio.ts](../data/portfolio.ts) | Mock portfolio |

### Data Mapping

BBR inventory fields → Cellar Concierge:

| BBR Field | Our Field | Notes |
|-----------|-----------|-------|
| Material Description (Long) | `name` | Direct |
| Vintage | `vintage` | NaN for NV |
| Region | `region` | Direct |
| Retail DP | `price_gbp` | Duty-paid |
| ATP | `availability` | Available to Promise |
| Maturity Desc | `drink_window` | Parse text |

### Action Items
1. Obtain API documentation from BBR
2. Implement authentication
3. Replace mock functions in `bbrClient.ts`
4. Add error handling and retry logic
5. Implement caching strategy

---

## 3. Authentication

### Purpose
- User identity verification
- Session management
- Role-based access (Client vs AM)
- AM-Client relationship mapping

### Current Status
❌ **Demo mode** - Role switching via UI toggle

### Requirements

| Requirement | Description |
|-------------|-------------|
| SSO | Integrate with BBR customer portal |
| JWT/Session | Token-based authentication |
| Roles | `client`, `account_manager`, `admin` |
| Mapping | Link clients to their Account Managers |

### Recommended Approach

NextAuth.js with custom provider:

```typescript
// lib/auth/authOptions.ts
export const authOptions = {
  providers: [
    {
      id: 'bbr',
      name: 'Berry Bros. & Rudd',
      type: 'oauth',
      // Configure BBR OAuth endpoints
    }
  ],
  callbacks: {
    session: async ({ session, token }) => {
      session.user.role = token.role;
      session.user.amId = token.amId;
      return session;
    }
  }
};
```

### Files to Create/Update

| File | Purpose |
|------|---------|
| `lib/auth/authOptions.ts` | NextAuth config |
| `app/api/auth/[...nextauth]/route.ts` | Auth routes |
| `middleware.ts` | Route protection |
| [lib/store/demoStore.ts](../lib/store/demoStore.ts) | Replace demo auth |

### Action Items
1. Determine BBR's auth mechanism (OAuth, SAML, etc.)
2. Implement NextAuth provider
3. Add middleware for protected routes
4. Update store to use real auth context
5. Test role-based access

---

## 4. Portfolio Valuation Service

### Purpose
Real-time indicative values for client wine holdings.

### Current Status
⚠️ **Static mock data** - Fixed values in portfolio

### Options

| Provider | Coverage | Integration |
|----------|----------|-------------|
| Liv-ex | Fine wine exchange | REST API |
| Wine-Searcher Pro | Market prices | REST API |
| BBR Internal | In-house valuations | TBD |

### Required Data

| Field | Source |
|-------|--------|
| `indicativeValue` | Live market price |
| `historicalValues` | Time series for charts |
| `marketMovement` | +/- indicator |

### Files to Update

| File | Purpose |
|------|---------|
| [data/portfolio.ts](../data/portfolio.ts) | Replace static values |
| [components/charts/PortfolioValueChart.tsx](../components/charts/PortfolioValueChart.tsx) | Real data binding |

### Action Items
1. Evaluate valuation providers
2. Implement API client
3. Add caching (values don't need real-time updates)
4. Update portfolio display components
5. Implement historical data for charts

---

## 5. Critic Scores

### Purpose
`critic_signal` field for investment filtering and recommendation ranking.

### Current Status
❌ **Missing** - Not currently in inventory data

### Options

| Provider | Coverage | Notes |
|----------|----------|-------|
| Wine-Searcher API | Aggregated scores | Comprehensive |
| Vivino | Consumer ratings | Unofficial API |
| CellarTracker | Community scores | Export or API |
| Manual curation | BBR staff picks | Spreadsheet |

### Implementation

```typescript
// lib/integrations/criticScores.ts
export async function getCriticScore(wineName: string, vintage: number): Promise<number> {
  // Call external API
  // Return 0-100 score
}
```

### Files to Update

| File | Purpose |
|------|---------|
| [data/inventory.ts](../data/inventory.ts) | Add scores to wines |
| `lib/integrations/criticScores.ts` | API client (new) |

### Action Items
1. Select critic score provider
2. Implement API integration
3. Backfill existing inventory
4. Add to inventory import pipeline

---

## 6. Notification Service

### Purpose
Alerts for:
- Plan approvals
- New allocations
- Drinking window reminders
- Order updates

### Current Status
❌ **Not implemented**

### Requirements

| Channel | Use Case |
|---------|----------|
| Email | Plan approvals, order confirmations |
| SMS | Urgent allocations (time-sensitive) |
| Push | Optional mobile notifications |

### Recommended Providers

| Provider | Channels | Notes |
|----------|----------|-------|
| SendGrid | Email | Reliable, good templates |
| AWS SES | Email | Cost-effective at scale |
| Twilio | SMS | Industry standard |

### Files to Create

| File | Purpose |
|------|---------|
| `lib/integrations/notificationClient.ts` | Notification service |
| `app/api/notifications/` | Notification routes |
| `components/settings/NotificationPrefs.tsx` | User preferences |

### Action Items
1. Select email/SMS provider
2. Design notification templates
3. Implement notification service
4. Add user preference settings
5. Create notification triggers

---

## 7. Storage & Cellar Management

### Purpose
Track physical wine storage locations.

### Current Status
❌ **Not implemented**

### Requirements

| Feature | Description |
|---------|-------------|
| BBR Reserves | Integration with BBR storage |
| Delivery addresses | Client locations |
| Transfer requests | Move between locations |
| Condition tracking | Temperature, humidity (optional) |

### Files to Create

| File | Purpose |
|------|---------|
| `lib/integrations/storageClient.ts` | Storage API client |
| `app/api/storage/` | Storage routes |
| `components/portfolio/StorageLocation.tsx` | Location display |

### Action Items
1. Document BBR Reserves API
2. Implement storage client
3. Add location to portfolio view
4. Build transfer request workflow

---

## 8. Delivery & Fulfillment

### Purpose
Dispatch wines from storage to client.

### Current Status
❌ **Not implemented**

### Requirements

| Feature | Description |
|---------|-------------|
| Scheduling | Delivery date selection |
| Carrier integration | DPD, wine couriers |
| Tracking | Real-time status |
| Notifications | Dispatch/delivery alerts |

### Files to Create

| File | Purpose |
|------|---------|
| `lib/integrations/deliveryClient.ts` | Delivery API client |
| `app/api/delivery/` | Delivery routes |
| `components/orders/DeliveryTracking.tsx` | Tracking UI |

### Action Items
1. Identify carrier integrations needed
2. Implement delivery scheduling
3. Add tracking integration
4. Connect to notification service

---

## Environment Variables Summary

```env
# Ragu AI (Critical)
RAGU_API_KEY=your_api_key
RAGU_ASSISTANT_ID=your_assistant_id
RAGU_BASE_URL=https://sdk.ragu.ai

# BBR Backend (Critical)
BBR_API_BASE_URL=https://api.bbr.com
BBR_API_KEY=your_bbr_api_key

# Authentication (Critical)
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
BBR_OAUTH_CLIENT_ID=your_client_id
BBR_OAUTH_CLIENT_SECRET=your_client_secret

# Valuation (High)
LIVEX_API_KEY=your_livex_key
# or
WINE_SEARCHER_API_KEY=your_ws_key

# Critic Scores (Medium)
CRITIC_API_KEY=your_critic_key

# Notifications (Medium)
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# Feature Flags
NEXT_PUBLIC_USE_LIVE_API=true
```

---

## Integration Priority Roadmap

### Phase 1: MVP (Critical)
1. ✅ Ragu AI - Configure credentials
2. 🔲 Authentication - Implement SSO
3. 🔲 BBR Inventory API - Live wine data
4. 🔲 BBR Portfolio API - Client holdings

### Phase 2: Core Features (High)
5. 🔲 BBR Order APIs - Real purchases
6. 🔲 Portfolio Valuation - Live pricing
7. 🔲 Notifications - Email alerts

### Phase 3: Enhanced Experience (Medium)
8. 🔲 Critic Scores - External ratings
9. 🔲 SMS Notifications - Urgent alerts
10. 🔲 Storage Management - Reserves integration

### Phase 4: Full Feature Set (Low)
11. 🔲 Delivery Integration - Fulfillment
12. 🔲 Push Notifications - Mobile
13. 🔲 Advanced Analytics - Insights
