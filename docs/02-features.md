# Features & Functionality

This document details all current features in Cellar Concierge, organized by user role.

---

## Client-Facing Features

### 1. Landing Page

**Location**: [app/page.tsx](../app/page.tsx)

A luxury, AM-forward landing experience that sets the premium tone.

**Elements**:
- Hero section with "Begin Your Consultation" CTA
- Value propositions highlighting key benefits:
  - Investment & Legacy
  - Occasions & Entertaining
  - Access & Allocation
  - Personal Provenance
- Account Manager introduction
- Footer with age verification and disclaimers

---

### 2. Onboarding (Cellar Building Consultation)

**Location**: [components/onboarding/CellarPlanningModal.tsx](../components/onboarding/CellarPlanningModal.tsx)

A comprehensive 10-screen flow that captures the user's cellar profile.

| Screen | Purpose | Data Captured |
|--------|---------|---------------|
| 1. Welcome | Introduction | - |
| 2. Cellar Strategy | Primary collecting goal | Strategy type (5 options) |
| 3. Budget Split | Investment allocation | Monthly budget, horizon splits |
| 4. Cadence | Consumption rate | Bottles per month/year |
| 5. Purchase Drivers | What motivates purchases | 9 motive weights (0-1) |
| 6. Guardrails | Constraints & preferences | Avoid tags, mix ratios, substitution tolerance |
| 7. Focus Areas | Regional & style focus | Regions, collection style |
| 8. Free Text | Open-ended preferences | Natural language → AI extraction |
| 9. Summary | Review captured profile | Confirmation |
| 10. Ready | Completion | Transition to dashboard |

**Strategy Options**:
- Drink-now runway
- Cellar for future
- Trophy benchmarks
- Smart value discovery
- Balanced barbell

---

### 3. Welcome Flow

**Location**: [components/onboarding/WelcomeFlow.tsx](../components/onboarding/WelcomeFlow.tsx)

Post-onboarding personalized greeting with initial recommendations.

**Features**:
- Personalized welcome message from Account Manager
- 3 AI-generated wine recommendations based on profile
- Quick actions to explore dashboard

---

### 4. Dashboard

**Location**: [app/dashboard/page.tsx](../app/dashboard/page.tsx)

The main hub for client activity.

**Sections**:

#### Monthly Plan Card
- Current month's plan status (Draft/Pending/Approved)
- Budget allocation progress bar
- Quick actions: Review, Submit to AM

#### Account Manager Card
- AM profile with photo
- Curated note from AM
- "Message AM" CTA

#### Portfolio Overview
- Total bottles in collection
- Indicative portfolio value
- Overall gain/loss percentage
- Quick link to full portfolio

#### Gamification Elements
- **Cellar Health Score** (0-100)
  - Diversity rating
  - Drinking window coverage
  - Investment balance
- **Milestones** (e.g., "First 50 bottles", "Burgundy collection started")
- **Streak tracking** (consecutive months with plan activity)

#### Drink Windows
- Ready now (green)
- Approaching peak (amber)
- 3+ year hold (blue)

#### AI Chat Panel
- Persistent chat interface
- Context-aware recommendations
- Access to Ragu AI assistant

---

### 5. Chat Interface

**Location**: [components/chat/ChatPanel.tsx](../components/chat/ChatPanel.tsx)

AI-powered conversational wine recommendations.

**Features**:
- Natural language queries
- Context injection (portfolio, motives, constraints, current plan)
- Source attribution from RAG results
- Suggested topics:
  - Portfolio analysis
  - Plan review
  - Investment guidance
  - Drinking readiness
  - BBR stock availability

**Example Queries**:
- "What Burgundy should I add to my cellar?"
- "I have guests next month, what's ready to drink?"
- "Show me investment-grade Bordeaux under £200"

---

### 6. Plan Builder

**Location**: [app/plan/page.tsx](../app/plan/page.tsx)

Monthly wine selection and curation interface.

**Features**:

#### Wine Selection Grid
- Curated recommendations from AI
- Filter by objective toggles:
  - Drink-now
  - Cellar build
  - Entertaining
  - Prestige
  - Value
  - Discovery

#### Budget Tracking
- Monthly budget allocation
- Spent vs. remaining
- Visual progress bar

#### Wine Cards
- Wine details (name, region, vintage)
- Price and quantity selector
- Scarcity indicator
- Drink window
- Add/remove actions

#### AM Note
- Read AM's curated message
- See any special allocations or offers

#### Workflow
1. Review AI suggestions
2. Adjust selections
3. Submit to AM for review
4. Await approval
5. Order processed

---

### 7. Portfolio View

**Location**: [app/portfolio/page.tsx](../app/portfolio/page.tsx)

Complete holdings dashboard.

**Metrics**:
- Total bottles
- Total spend
- Current indicative value
- Overall gain/loss %

**Filters**:
- By region
- By drink status (Ready/Cellaring/Past-peak)
- By tag (Investment/Trophy/Value/etc.)

**Wine Details**:
- Purchase price vs. current value
- Gain indicator with percentage
- Drink window status
- Storage location (future)

**Visualizations**:
- Portfolio value over time (Recharts area chart)
- Regional distribution
- Drink window breakdown

---

### 8. Sell Intent

**Location**: [app/sell/page.tsx](../app/sell/page.tsx)

Submit wines for BBR resale facilitation.

**Flow**:
1. Select bottle from portfolio
2. Enter details:
   - Desired timeframe
   - Target price
   - Reason for selling
3. Submit request
4. AM reviews and facilitates sale

**Note**: This is curated resale through BBR, not a public marketplace.

---

### 9. Messages

**Location**: [app/messages/page.tsx](../app/messages/page.tsx)

Direct communication with Account Manager.

**Features**:
- Conversation threads
- Message history with timestamps
- Send new messages
- Notification badges for unread

---

## Account Manager Features

### 10. AM Dashboard

**Location**: [app/am/page.tsx](../app/am/page.tsx)

Queue of client plans awaiting review.

**Features**:
- Client list with pending plans
- Status badges (Pending Review/Approved/Needs Changes)
- Quick stats (plans this month, value, etc.)
- "Open Review" CTA per client

---

### 11. Client Review View

**Location**: [app/am/client/[id]/page.tsx](../app/am/client/[id]/page.tsx)

Detailed client plan review interface.

**Sections**:

#### Client Profile Summary
- Name, tier, location
- Motive weights visualization
- Constraints and preferences

#### Current Plan
- All selected wines
- Budget utilization
- Objective mix

#### Actions
- Approve plan as-is
- Add AM note
- Suggest edits/substitutions
- Request changes from client

---

### 12. AM Requests

**Location**: [app/am/requests/page.tsx](../app/am/requests/page.tsx)

Sell intent requests from clients.

**Features**:
- Queue of resale requests
- Client details and wine info
- Accept/decline/counter actions
- Facilitation workflow

---

## Admin Features

### 13. Integration Status

**Location**: [app/admin/integrations/page.tsx](../app/admin/integrations/page.tsx)

Monitor and configure system integrations.

**Features**:
- Feature flag toggles
- API connection status
- Ragu AI health check
- BBR API status

---

## Demo Features

### Role Switching

**Location**: [lib/store/demoStore.ts](../lib/store/demoStore.ts)

For demonstration purposes, users can switch between:
- **Client view** - See the member experience
- **AM view** - See Account Manager interface

This is controlled via UI toggle and will be replaced with proper authentication in production.

---

## Feature Status Summary

| Feature | Implementation | Status |
|---------|---------------|--------|
| Landing Page | Complete | ✅ Production-ready |
| Onboarding (10 screens) | Complete | ✅ Production-ready |
| Welcome Flow | Complete | ✅ Production-ready |
| Dashboard | Complete | ✅ Production-ready |
| AI Chat | Functional | ⚠️ Needs Ragu credentials |
| Plan Builder | Complete | ✅ Production-ready |
| Portfolio View | Complete | ✅ Production-ready |
| Sell Intent | Complete | ✅ Production-ready |
| Messages | Complete | ✅ Production-ready |
| AM Dashboard | Complete | ✅ Production-ready |
| Client Review | Complete | ✅ Production-ready |
| AM Requests | Complete | ✅ Production-ready |
| Admin Panel | Basic | ⚠️ Feature flags only |
| Authentication | Demo mode | ❌ Needs SSO integration |
