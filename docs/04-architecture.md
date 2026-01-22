# Architecture

This document describes the technical architecture of Cellar Concierge.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                              │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                         Next.js Frontend                           │  │
│  │                                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │  │
│  │  │   Pages      │  │  Components  │  │    State (Zustand)       │  │  │
│  │  │  /dashboard  │  │  /chat       │  │  - member profile        │  │  │
│  │  │  /plan       │  │  /onboarding │  │  - portfolio             │  │  │
│  │  │  /portfolio  │  │  /shared     │  │  - messages              │  │  │
│  │  │  /sell       │  │  /ui         │  │  - chat history          │  │  │
│  │  │  /am/*       │  │  /charts     │  │  - monthly plan          │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS SERVER                                 │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                        API Routes (/api)                           │  │
│  │                                                                    │  │
│  │  ┌────────────┐  ┌────────────────┐  ┌──────────────────────────┐  │  │
│  │  │  /chat     │  │  /bbr/*        │  │  /ragu/*                 │  │  │
│  │  │            │  │  - inventory   │  │  - generatePlan          │  │  │
│  │  │  Main AI   │  │  - portfolio   │  │  - recommendSubstitutes  │  │  │
│  │  │  endpoint  │  │  - allocations │  │  - summarizeForAM        │  │  │
│  │  │            │  │  - orders      │  │                          │  │  │
│  │  └────────────┘  └────────────────┘  └──────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                         Libraries (/lib)                           │  │
│  │                                                                    │  │
│  │  ┌─────────────┐  ┌───────────────┐  ┌──────────────────────────┐  │  │
│  │  │ raguClient  │  │ bbrClient     │  │  profileScoring          │  │  │
│  │  │ (Ragu SDK)  │  │ (BBR APIs)    │  │  (CBC → weights)         │  │  │
│  │  └─────────────┘  └───────────────┘  └──────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────────┐
│         RAGU AI               │   │         BBR BACKEND               │
│                               │   │         (Future)                  │
│  ┌─────────────────────────┐  │   │  ┌─────────────────────────────┐  │
│  │  RAG Pipeline           │  │   │  │  Inventory Service          │  │
│  │  - BBR wine inventory   │  │   │  │  Portfolio Service          │  │
│  │  - Tasting notes        │  │   │  │  Order Service              │  │
│  │  - Critic reviews       │  │   │  │  Allocation Service         │  │
│  └─────────────────────────┘  │   │  │  Member Service             │  │
│                               │   │  └─────────────────────────────┘  │
│  ┌─────────────────────────┐  │   │                                   │
│  │  LLM (Claude/GPT)       │  │   │  ┌─────────────────────────────┐  │
│  │  - Chat responses       │  │   │  │  Valuation Service          │  │
│  │  - Profile extraction   │  │   │  │  (Liv-ex, Wine-Searcher)    │  │
│  └─────────────────────────┘  │   │  └─────────────────────────────┘  │
└───────────────────────────────┘   └───────────────────────────────────┘
```

---

## Directory Structure

```
f:\Ragu\Cellar-Concierge/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   │
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard
│   │
│   ├── onboarding/
│   │   └── page.tsx              # Onboarding entry
│   │
│   ├── plan/
│   │   └── page.tsx              # Plan builder
│   │
│   ├── portfolio/
│   │   └── page.tsx              # Portfolio view
│   │
│   ├── sell/
│   │   └── page.tsx              # Sell intent
│   │
│   ├── messages/
│   │   └── page.tsx              # Message threads
│   │
│   ├── am/                       # Account Manager routes
│   │   ├── page.tsx              # AM dashboard
│   │   ├── client/[id]/
│   │   │   └── page.tsx          # Client review
│   │   └── requests/
│   │       └── page.tsx          # Sell requests
│   │
│   ├── admin/                    # Admin routes
│   │   ├── integrations/
│   │   │   └── page.tsx          # Integration status
│   │   └── marketplace/
│   │       └── page.tsx          # Marketplace admin
│   │
│   └── api/                      # API routes
│       ├── chat/
│       │   └── route.ts          # Main chat endpoint
│       │
│       ├── bbr/                  # BBR integration
│       │   ├── inventory/
│       │   ├── portfolio/
│       │   ├── allocations/
│       │   ├── createDraftOrder/
│       │   ├── submitForAMReview/
│       │   ├── approvePlan/
│       │   └── createSellIntent/
│       │
│       └── ragu/                 # Ragu AI helpers
│           ├── generatePlan/
│           ├── recommendSubstitutes/
│           └── summarizeForAM/
│
├── components/
│   ├── onboarding/
│   │   ├── CellarPlanningModal.tsx    # 10-screen CBC flow
│   │   ├── OnboardingModal.tsx
│   │   └── WelcomeFlow.tsx            # Post-onboarding
│   │
│   ├── chat/
│   │   ├── ChatPanel.tsx              # Main chat UI
│   │   ├── ChatWidget.tsx
│   │   ├── MotivationsPanel.tsx
│   │   └── WelcomeMessage.tsx
│   │
│   ├── charts/
│   │   ├── MotiveRadarChart.tsx       # Radar chart
│   │   └── PortfolioValueChart.tsx    # Value over time
│   │
│   ├── shared/
│   │   ├── AMBriefCard.tsx
│   │   ├── BottleCard.tsx
│   │   ├── BudgetBar.tsx
│   │   ├── CellarHealthScoreCard.tsx
│   │   ├── Footer.tsx
│   │   ├── PlanItemRow.tsx
│   │   ├── StatusBadge.tsx
│   │   └── TopBar.tsx
│   │
│   ├── ui/                            # shadcn/ui components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   └── ...
│   │
│   └── ClientProviders.tsx            # Provider wrapper
│
├── lib/
│   ├── store/
│   │   └── demoStore.ts               # Zustand state
│   │
│   ├── types/
│   │   └── cellarProfile.ts           # Type definitions
│   │
│   ├── ragu/
│   │   ├── raguClient.ts              # Ragu SDK client
│   │   └── extractionPrompts.ts       # LLM prompts
│   │
│   ├── integrations/
│   │   └── bbrClient.ts               # BBR API client
│   │
│   ├── scoring/
│   │   └── profileScoring.ts          # CBC scoring
│   │
│   ├── ai/
│   │   └── simulatedAi.ts             # Mock AI
│   │
│   └── utils.ts                       # Utilities
│
├── data/                              # Mock data
│   ├── inventory.ts                   # 60 wines
│   ├── members.ts                     # Demo member
│   ├── plans.ts                       # Monthly plans
│   ├── portfolio.ts                   # Holdings
│   ├── messages.ts                    # Message threads
│   └── sellIntents.ts                 # Sell requests
│
├── docs/                              # Documentation
│   ├── 01-overview.md
│   ├── 02-features.md
│   ├── 03-api-reference.md
│   ├── 04-architecture.md
│   ├── 05-data-models.md
│   └── 06-integration-requirements.md
│
├── public/                            # Static assets
│
├── .env.example                       # Environment template
├── .env.local                         # Local environment (gitignored)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.mjs
└── README.md
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| React | 18.3.1 | UI library |
| TypeScript | 5.4 | Type safety |
| TailwindCSS | 3.4 | Utility-first styling |
| Radix UI | Latest | Accessible component primitives |
| Lucide React | Latest | Icon library |

### State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| Zustand | 4.5 | Lightweight state management |
| zustand/persist | - | LocalStorage persistence |

### Data Visualization

| Technology | Version | Purpose |
|------------|---------|---------|
| Recharts | 2.12 | Charts and graphs |

### Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| Zod | 3.23 | Schema validation |

### AI Integration

| Technology | Purpose |
|------------|---------|
| Ragu SDK | RAG + LLM for wine recommendations |

---

## State Management

The application uses Zustand for state management with the following stores:

### demoStore.ts

```typescript
interface DemoStore {
  // Member profile
  member: MemberProfile | null;
  setMember: (member: MemberProfile) => void;

  // Cellar profile (from CBC onboarding)
  cellarProfile: UserCellarProfile | null;
  setCellarProfile: (profile: UserCellarProfile) => void;

  // Account Manager
  accountManager: AccountManager | null;
  setAccountManager: (am: AccountManager) => void;

  // Monthly plan
  monthlyPlan: MonthlyPlan | null;
  setMonthlyPlan: (plan: MonthlyPlan) => void;

  // Portfolio
  portfolio: PortfolioItem[];
  setPortfolio: (items: PortfolioItem[]) => void;

  // Messages
  messages: MessageThread[];
  addMessage: (threadId: string, message: Message) => void;

  // Chat history
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;

  // Sell intents
  sellIntents: SellIntent[];
  addSellIntent: (intent: SellIntent) => void;

  // UI state
  isOnboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;

  currentRole: 'client' | 'am';
  setCurrentRole: (role: 'client' | 'am') => void;

  // Reset
  resetStore: () => void;
}
```

**Persistence**: State is persisted to localStorage for demo continuity.

---

## Data Flow

### Onboarding Flow

```
1. User clicks "Begin Consultation"
   │
   ▼
2. CellarPlanningModal opens (10 screens)
   │
   ├── Screen 1-7: Structured questions
   │   └── Data stored in component state
   │
   ├── Screen 8: Free text input
   │   └── Sent to Ragu AI for extraction
   │
   └── Screen 9-10: Summary & confirmation
       │
       ▼
3. Profile computed via profileScoring.ts
   │
   ▼
4. UserCellarProfile stored in Zustand
   │
   ▼
5. User redirected to Dashboard
```

### Chat Flow

```
1. User sends message in ChatPanel
   │
   ▼
2. Frontend packages context:
   - Member profile
   - Portfolio summary
   - Motive weights
   - Current plan status
   │
   ▼
3. POST /api/chat
   │
   ├── If Ragu configured:
   │   └── RaguClient.chat() → Ragu API
   │
   └── If no credentials:
       └── Mock response from simulatedAi.ts
   │
   ▼
4. Response displayed with sources
   │
   ▼
5. Message added to Zustand chatMessages
```

### Plan Submission Flow

```
1. Client reviews monthly plan
   │
   ▼
2. Adjusts selections (add/remove/swap)
   │
   ▼
3. Clicks "Submit to AM"
   │
   ▼
4. POST /api/bbr/submitForAMReview
   │
   ▼
5. Plan status → "pending_review"
   │
   ▼
6. AM sees plan in dashboard
   │
   ▼
7. AM reviews & approves
   │
   ▼
8. POST /api/bbr/approvePlan
   │
   ▼
9. Plan status → "approved"
   │
   ▼
10. Order created (future: actual purchase)
```

---

## Security Considerations

### Current (Demo Mode)
- Role switching via UI toggle
- No authentication
- All data in localStorage

### Production Requirements
- SSO integration with BBR portal
- JWT or session-based auth
- Protected API routes with middleware
- HTTPS everywhere
- Input sanitization
- Rate limiting on AI endpoints

---

## Scalability Considerations

### Current Architecture
- Single Next.js application
- Client-side state
- Mock data stores

### Production Scaling
- **API routes**: Can be deployed as serverless functions
- **State**: Move to server-side sessions or database
- **Caching**: Redis for portfolio valuations, inventory
- **CDN**: Static assets via Vercel/Cloudflare
- **Database**: PostgreSQL for member data, orders
- **Search**: Ragu handles wine search/RAG

---

## Deployment

### Development
```bash
npm install
npm run dev
# → http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
```

### Recommended Hosting
- **Vercel**: Native Next.js support, serverless functions
- **AWS**: ECS/Fargate for containers, or Lambda
- **Azure**: App Service or Container Apps

### Environment Configuration
See [.env.example](../.env.example) for all required variables.
