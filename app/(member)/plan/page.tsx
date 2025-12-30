"use client";

import { useState } from "react";
import { BudgetBar } from "@/components/BudgetBar";
import { PlanItemRow } from "@/components/PlanItemRow";
import { AMBriefCard } from "@/components/AMBriefCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoStore } from "@/lib/store/demoStore";

const objectiveOptions = ["Drink-now", "Cellar build", "Entertaining", "Prestige", "Value", "Discovery"];

export default function PlanPage() {
  const { plans, updatePlanStatus } = useDemoStore();
  const plan = plans[0];
  const [objectives, setObjectives] = useState(plan.objectives);
  const [toast, setToast] = useState<string | null>(null);

  const total = plan.items.reduce((sum, item) => sum + item.item.price_gbp * item.quantity, 0);

  const handleSend = () => {
    updatePlanStatus(plan.id, "Sent to AM");
    setToast("Plan sent to your Account Manager.");
    setTimeout(() => setToast(null), 2400);
  };

  const toggleObjective = (objective: string) => {
    setObjectives((prev) =>
      prev.includes(objective) ? prev.filter((item) => item !== objective) : [...prev, objective]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Draft plan</p>
          <h1 className="text-3xl font-semibold">September basket</h1>
        </div>
        <Button variant="accent" onClick={handleSend}>Send to AM</Button>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <BudgetBar budget={plan.budgetGBP} spent={total} />
          <div className="flex flex-wrap gap-2">
            {objectiveOptions.map((objective) => (
              <button
                key={objective}
                onClick={() => toggleObjective(objective)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  objectives.includes(objective) ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 text-ink-600"
                }`}
              >
                {objective}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {plan.items.map((item) => (
            <PlanItemRow key={item.item.id} item={item} />
          ))}
        </div>
        <div className="space-y-6">
          <AMBriefCard summary={plan.amNote} />
          <Card>
            <CardHeader>
              <CardTitle>Build toward</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-ink-600">Case goal £900 for Autumn hosting sets.</p>
              <Button variant="outline">Request AM call</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-ink-900 px-4 py-3 text-sm text-white shadow-soft">
          {toast}
        </div>
      )}
    </div>
  );
}
