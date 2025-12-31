'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MotiveRadarChart } from '@/components/charts/MotiveRadarChart';
import { generatePlan, defaultPlanInput, recommendSubstitutes, summarizeForAM } from '@/lib/ai/simulatedAi';
import { PlanItemRow } from '@/components/shared/PlanItemRow';
import { useDemoStore } from '@/lib/store/demoStore';

export default function AMClientPage() {
  const plan = useMemo(() => generatePlan(defaultPlanInput), []);
  const [signatureNote, setSignatureNote] = useState('');
  const setPlanStatus = useDemoStore((state) => state.setPlanStatus);
  const member = useDemoStore((state) => state.member);

  // Convert new motivation weights to radar chart format
  const radarData = Object.entries(member.collectorProfile.motivations).map(([motive, value]) => ({
    motive: motive.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    value: value as number // Already 0-100 range
  }));

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Collector Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <MotiveRadarChart data={radarData} />
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-muted">
                <span className="font-medium text-foreground">Risk Profile:</span> {member.collectorProfile.riskProfile}
              </p>
              <p className="text-muted">
                <span className="font-medium text-foreground">Time Horizon:</span> {member.collectorProfile.timeHorizon}
              </p>
              <p className="text-muted">
                <span className="font-medium text-foreground">Goals:</span> {member.goals.join(' · ')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Curated Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.items.map((item) => (
              <PlanItemRow
                key={item.id}
                item={item}
                rationale={plan.rationales.find((rationale) => rationale.id === item.id)?.text ?? ''}
                substitutes={recommendSubstitutes(item)}
              />
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Note to Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Add your personal note to accompany this selection..."
              value={signatureNote}
              onChange={(event) => setSignatureNote(event.target.value)}
            />
            <div className="text-xs text-muted">Summary: {summarizeForAM(defaultPlanInput)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => setPlanStatus('Approved')}>
              Approve & Send
            </Button>
            <Button variant="outline" className="w-full">
              Request Changes
            </Button>
            <Button variant="secondary" className="w-full">
              Suggest Upgrade (+£15)
            </Button>
            <Button variant="ghost" className="w-full">
              Hold for Later
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
