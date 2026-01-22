# Cellar Concierge - Solution Overview

## What is Cellar Concierge?

Cellar Concierge is a premium wine cellar planning platform built for **Berry Bros. & Rudd (BBR)**, one of the world's oldest and most prestigious wine merchants. The application enables customers to build and manage investment-grade wine collections with the assistance of AI-powered recommendations and human Account Manager oversight.

**Tagline**: *"Your personal wine curator, at your service"*

---

## The Problem It Solves

Building a fine wine collection is complex. Collectors must balance:

- **Investment potential** vs. **drinking enjoyment**
- **Budget constraints** vs. **prestige acquisitions**
- **Immediate gratification** vs. **long-term cellaring**
- **Regional diversity** vs. **focused depth**
- **Scarcity/allocations** vs. **availability**

Traditional approaches rely heavily on Account Managers who may not scale, or self-service catalogs that lack personalization.

---

## The Solution

Cellar Concierge bridges this gap by combining:

1. **Comprehensive Onboarding (CBC)** - A 10-screen Cellar Building Consultation that captures the collector's strategy, budget, motivations, and constraints

2. **AI-Powered Recommendations** - Ragu AI integration provides context-aware wine suggestions based on the user's profile, portfolio, and current market availability

3. **Account Manager Curation** - Human oversight ensures quality control, relationship management, and access to exclusive allocations

4. **Portfolio Intelligence** - Track holdings, valuations, drinking windows, and collection health over time

---

## Target Users

### Primary: BBR Clients
- High-net-worth individuals building wine collections
- Investment-focused collectors seeking portfolio growth
- Enthusiasts wanting curated drinking experiences
- Gift buyers seeking prestigious presents

### Secondary: Account Managers
- BBR staff managing client relationships
- Reviewing and approving monthly plans
- Handling resale requests
- Curating exclusive allocations

---

## Business Model

Cellar Concierge supports BBR's existing business by:

- **Increasing engagement** - Monthly plan cadence keeps clients active
- **Improving personalization** - AI enables scaled personalization
- **Reducing AM workload** - AI handles routine queries, AMs focus on high-value interactions
- **Driving purchases** - Recommendations tied to real inventory and allocations
- **Facilitating resale** - Curated (non-marketplace) resale keeps wines in-house

---

## Current Status

**Production-Ready Prototype** - The application is fully functional with:

| Component | Status |
|-----------|--------|
| UI/UX | Complete - production-quality design |
| Onboarding Flow | Complete - 10-screen CBC |
| Dashboard | Complete - with gamification |
| AI Chat | Functional - Ragu integration + mock fallback |
| Plan Builder | Complete - full workflow |
| Portfolio View | Complete - with charts |
| AM Interface | Complete - review and approval |
| Authentication | Demo mode - role toggle |
| BBR APIs | Mocked - integration seams ready |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.4 |
| Styling | TailwindCSS 3.4 + Radix UI |
| State | Zustand 4.5 with persistence |
| Charts | Recharts 2.12 |
| AI | Ragu SDK (RAG + LLM) |
| Validation | Zod 3.23 |

---

## Key Differentiators

1. **AM-Forward, Not AI-Only** - AI assists but doesn't replace the human relationship
2. **Investment + Enjoyment** - Balances financial returns with drinking pleasure
3. **Comprehensive Profiling** - Deep understanding of collector motivations
4. **Gamification** - Cellar Health Score, milestones, streaks drive engagement
5. **Curated Resale** - Facilitates selling without marketplace complexity

---

## Next Steps for Production

See [06-integration-requirements.md](06-integration-requirements.md) for detailed production integration requirements including:

- Ragu AI configuration
- BBR backend API integration
- Authentication/SSO setup
- Portfolio valuation services
- Notification systems
