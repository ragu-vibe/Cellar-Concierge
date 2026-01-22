# Cellar Concierge Documentation

Welcome to the Cellar Concierge documentation. This folder contains comprehensive documentation for the solution.

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [01-overview.md](01-overview.md) | Solution overview, purpose, and business context |
| [02-features.md](02-features.md) | Complete feature list with implementation details |
| [03-api-reference.md](03-api-reference.md) | API endpoints, request/response formats |
| [04-architecture.md](04-architecture.md) | Technical architecture, directory structure, data flows |
| [05-data-models.md](05-data-models.md) | TypeScript types and data schemas |
| [06-integration-requirements.md](06-integration-requirements.md) | External service requirements for production |

---

## Quick Links

### For Product/Business
- [What is Cellar Concierge?](01-overview.md#what-is-cellar-concierge)
- [Feature List](02-features.md)
- [Integration Roadmap](06-integration-requirements.md#integration-priority-roadmap)

### For Developers
- [Architecture Overview](04-architecture.md#high-level-architecture)
- [Directory Structure](04-architecture.md#directory-structure)
- [API Reference](03-api-reference.md)
- [Data Models](05-data-models.md)

### For Operations
- [Environment Variables](06-integration-requirements.md#environment-variables-summary)
- [Deployment](04-architecture.md#deployment)
- [Integration Status](06-integration-requirements.md#overview)

---

## Summary

**Cellar Concierge** is a premium wine cellar planning platform for Berry Bros. & Rudd that combines:

- **AI-Powered Recommendations** via Ragu RAG
- **Account Manager Curation** for human oversight
- **Comprehensive Profiling** through 10-screen onboarding
- **Portfolio Intelligence** with valuations and drink windows
- **Gamification** to drive engagement

### Current Status

| Component | Status |
|-----------|--------|
| Frontend UI | ✅ Production-ready |
| Onboarding | ✅ Complete |
| Dashboard | ✅ Complete |
| AI Chat | ⚠️ Needs Ragu credentials |
| Plan Builder | ✅ Complete |
| Portfolio | ✅ Complete |
| AM Interface | ✅ Complete |
| Authentication | ❌ Demo mode only |
| BBR APIs | ⚠️ Mocked |

### Tech Stack

- Next.js 14 + TypeScript
- TailwindCSS + Radix UI
- Zustand for state
- Ragu AI for recommendations
- Recharts for visualizations

---

## Getting Started

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

See the main [README.md](../README.md) for full setup instructions.
