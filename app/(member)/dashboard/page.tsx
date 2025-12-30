"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { CellarHealthScoreCard } from "@/components/CellarHealthScoreCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/store/demoStore";
import { LoadingState } from "@/components/LoadingState";

export default function DashboardPage() {
  const router = useRouter();
  const { member, plans, gamificationEnabled } = useDemoStore();
  const plan = plans[0];
  const spent = plan.items.reduce((sum, item) => sum + item.item.price_gbp * item.quantity, 0);

  const milestones = useMemo(
    () => [
      { label: "Planning streak", value: "4 months" },
      { label: "Goal alignment", value: "82%" },
      { label: "Opportunity capture", value: "3 scarce allocations" }
    ],
    []
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[40px] border border-ink-100 bg-white p-8 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">This month’s draft plan</p>
            <h1 className="text-3xl font-semibold">September draft for {member.name.split(" ")[0]}</h1>
          </div>
          <StatusBadge status={plan.status} />
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Card className="flex-1">
            <CardContent className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Curated with your AM</p>
              <p className="text-lg font-semibold">{member.accountManager.name}</p>
              <p className="text-sm text-ink-600">“{plan.amNote}”</p>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Plan highlights</p>
              <p className="text-lg font-semibold">£{spent.toFixed(0)} of £{plan.budgetGBP}</p>
              <p className="text-sm text-ink-600">{plan.items.length} recommended bottles across prestige + entertaining.</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => router.push("/plan")}>Review draft plan</Button>
          <Button variant="outline">Schedule AM call</Button>
        </div>
      </section>

      {gamificationEnabled && (
        <section className="grid gap-6 md:grid-cols-3">
          <CellarHealthScoreCard score={82} />
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Milestones & streaks</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {milestones.map((milestone) => (
                <div key={milestone.label} className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-400">{milestone.label}</p>
                  <p className="text-lg font-semibold">{milestone.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-ink-600">18 bottles • £2,340 spend • Indicative value band £2,600–£3,000</p>
            <p className="text-xs text-ink-400">Indicative only. Not investment advice.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-ink-600">Unlock allocation heads-up for Autumn 2024 with one more plan approval.</p>
            <Button variant="outline">See rewards</Button>
          </CardContent>
        </Card>
        <LoadingState label="Loading seasonal allocation signals..." />
      </section>
    </div>
  );
}
