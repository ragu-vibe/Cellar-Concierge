# Cellar Concierge

Premium, production-feeling prototype for fine-wine planning with Account Manager curation. Built with Next.js App Router, TypeScript, TailwindCSS, shadcn/ui patterns, recharts, and deterministic local “AI”.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Demo script (5 steps)

1. **Onboarding** → complete motive sliders and region constraints.
2. **Dashboard** → review this month’s draft plan and Cellar Health Score.
3. **Plan** → inspect the AI draft basket, swap objectives, and send to AM.
4. **AM view** → switch role to Account Manager and open the client review to approve.
5. **Portfolio + Sell** → review indicative value history and submit a Sell Intent.

## Architecture notes

### Mock AI (Ragu integration seam)
- `/lib/ragu/raguClient.ts` calls `/api/ragu/*` routes.
- `/app/api/ragu/*` uses deterministic functions in `/lib/ai/simulatedAi.ts`.
- Swap the mock in `/lib/ragu/raguClient.ts` to point at real Ragu endpoints.

### Mock BBR integration seam
- `/lib/integrations/bbrClient.ts` calls `/api/bbr/*` routes.
- `/app/api/bbr/*` uses mock data from `/data/*`.
- Replace the mock calls in `/lib/integrations/bbrClient.ts` with real BBR APIs.

### Demo data & state
- Seed data lives in `/data/*`.
- Client demo state is stored in localStorage via Zustand (`/lib/store/demoStore.ts`).
- Admin → Integrations includes a “Reset demo data” action.

## Compliance notes
- Footer includes age gate and valuation disclaimer.
- Portfolio views include “Indicative only. Not investment advice.”

## Design system
- Neutral palette with premium contrast, whitespace, and soft shadows.
- Components in `/components/ui` and `/components/shared`.

## Scripts
- `npm run dev` – local dev server
- `npm run build` – production build
- `npm run start` – start production server
