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

  const radarData = Object.entries(member.motives).map(([motive, value]) => ({
    motive: motive.replace(/([A-Z])/g, ' $1'),
    value
  }));

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Client motives</CardTitle>
          </CardHeader>
          <CardContent>
            <MotiveRadarChart data={radarData} />
            <p className="mt-4 text-sm text-muted">Goals: {member.goals.join(' · ')}</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>AI draft basket</CardTitle>
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
            <CardTitle>AM signature note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Required AM note to member"
              value={signatureNote}
              onChange={(event) => setSignatureNote(event.target.value)}
            />
            <div className="text-xs text-muted">AI brief: {summarizeForAM(defaultPlanInput)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => setPlanStatus('Approved')}>
              Approve
            </Button>
            <Button variant="outline" className="w-full">
              Request tweaks
            </Button>
            <Button variant="secondary" className="w-full">
              Suggest upgrade (+£15)
            </Button>
            <Button variant="ghost" className="w-full">
              Hold for later
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
