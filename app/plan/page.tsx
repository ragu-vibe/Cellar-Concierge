'use client';

import { useMemo, useState } from 'react';
import { BudgetBar } from '@/components/shared/BudgetBar';
import { PlanItemRow } from '@/components/shared/PlanItemRow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generatePlan, defaultPlanInput, recommendSubstitutes } from '@/lib/ai/simulatedAi';
import { useDemoStore } from '@/lib/store/demoStore';

const objectivesList = ['Drink-now', 'Cellar build', 'Entertaining', 'Prestige', 'Value', 'Discovery'];

export default function PlanPage() {
  const [objectives, setObjectives] = useState(defaultPlanInput.objectives);
  const setPlanStatus = useDemoStore((state) => state.setPlanStatus);

  const plan = useMemo(() => {
    return generatePlan({ ...defaultPlanInput, objectives });
  }, [objectives]);

  const spent = plan.items.reduce((acc, item) => acc + item.price_gbp, 0);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>£250 Draft Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BudgetBar budget={defaultPlanInput.budget} spent={spent} />
          <div className="flex flex-wrap gap-3">
            {objectivesList.map((objective) => (
              <label key={objective} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={objectives.includes(objective)}
                  onChange={(event) =>
                    setObjectives((prev) =>
                      event.target.checked ? [...prev, objective] : prev.filter((item) => item !== objective)
                    )
                  }
                />
                {objective}
              </label>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-accent/5 p-4 text-sm text-muted">
            Build Toward: £900 prestige case · Balanced drink windows for 2026-2034
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h3 className="section-title">Recommended basket</h3>
        <div className="space-y-4">
          {plan.items.map((item) => (
            <PlanItemRow
              key={item.id}
              item={item}
              rationale={plan.rationales.find((rationale) => rationale.id === item.id)?.text ?? ''}
              substitutes={recommendSubstitutes(item)}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setPlanStatus('Sent to AM')}>Send to AM</Button>
        <Button variant="outline">Request AM call</Button>
      </div>
    </div>
  );
}
