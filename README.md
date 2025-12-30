# Cellar Concierge

Premium, production-feeling clickable prototype for a fine-wine planning experience. Built with Next.js App Router, Tailwind, and deterministic AI simulation so the product feels real end-to-end.

## Stack
- Next.js 14 App Router
- TypeScript
- TailwindCSS
- shadcn/ui-style components (lightweight local implementation)
- lucide-react icons
- recharts
- zustand (demo state)

## Getting started
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Demo script (5 steps)
1. Start at `/onboarding` and complete the 8-step wizard to update motive weights.
2. Visit `/dashboard` to see the draft plan status and cellar health indicators.
3. Open `/plan` to review the basket and send it to the AM.
4. Switch role to **Account Manager** and review `/am/client/member-1` for edits and approval.
5. Switch role to **Admin** to toggle gamification and reset demo data in `/admin/integrations`.

## Integration seams
### Replace mock BBR calls
- Client wrapper: `lib/integrations/bbrClient.ts`
- Mock API routes: `app/api/bbr/*`

Swap these API routes for real BBR endpoints or update the client to point to real services.

### Replace Ragu AI endpoints
- Client wrapper: `lib/ragu/raguClient.ts`
- Mock API routes: `app/api/ragu/*`
- Deterministic simulation: `lib/ai/simulatedAi.ts`

Update `lib/ragu/raguClient.ts` to call real Ragu endpoints, or swap the server routes with proxy logic.

## Notes
- Demo state is persisted in localStorage via Zustand (`lib/store/demoStore.ts`).
- Gamification is behind a feature flag in the admin console.
- All valuations are indicative only and not investment advice.
