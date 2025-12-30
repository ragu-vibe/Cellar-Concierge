'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CellarHealthScoreCard } from '@/components/shared/CellarHealthScoreCard';
import { useDemoStore } from '@/lib/store/demoStore';
import { mockPortfolioSummary } from '@/lib/ai/simulatedAi';

export default function DashboardPage() {
  const plan = useDemoStore((state) => state.plan);
  const accountManager = useDemoStore((state) => state.accountManager);
  const portfolio = useDemoStore((state) => state.portfolio);
  const gamificationEnabled = useDemoStore((state) => state.gamificationEnabled);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>This month’s draft plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <StatusBadge status={plan.status} />
              <Badge variant="secondary">{plan.month}</Badge>
            </div>
            <p className="text-sm text-muted">Curated with your Account Manager: {accountManager.name}</p>
            <div className="rounded-lg border border-dashed border-border bg-accent/5 p-4 text-sm text-muted">
              AM note preview: “{plan.amNote}”
            </div>
          </CardContent>
        </Card>
        {gamificationEnabled && (
          <CellarHealthScoreCard
            score={mockPortfolioSummary.healthScore}
            milestones={mockPortfolioSummary.milestones}
            streak={mockPortfolioSummary.streak}
          />
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Cellar milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted">
            <p>Next unlock: Allocation heads-up briefing</p>
            <p>Track: Rhône Explorer · Vintage Planner · Dinner Party Ready</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-muted">Bottles owned</p>
              <p className="text-2xl font-semibold text-primary">{portfolio.reduce((acc, item) => acc + item.bottles, 0)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted">Spend to date</p>
              <p className="text-2xl font-semibold text-primary">£{portfolio.reduce((acc, item) => acc + item.purchasePrice, 0)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted">Indicative value band</p>
              <p className="text-2xl font-semibold text-primary">{mockPortfolioSummary.valueBand}</p>
              <p className="text-xs text-muted">Indicative only. Not investment advice.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
