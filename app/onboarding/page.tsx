'use client';

import { useMemo, useState } from 'react';
import { MotiveRadarChart } from '@/components/charts/MotiveRadarChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { memberProfile } from '@/data/members';

const steps = [
  'Primary motivations',
  'Scarcity vs. Value trade-off',
  'Prestige vs. Discovery',
  'Drink window focus',
  'Entertaining & gifting',
  'Budget comfort',
  'Region constraints',
  'Goals & summary'
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [motiveWeights, setMotiveWeights] = useState(memberProfile.motives);
  const [budget, setBudget] = useState(memberProfile.constraints.budget);
  const [regions, setRegions] = useState(memberProfile.constraints.regions);

  const radarData = useMemo(
    () =>
      Object.entries(motiveWeights).map(([motive, value]) => ({
        motive: motive.replace(/([A-Z])/g, ' $1'),
        value
      })),
    [motiveWeights]
  );

  const updateWeight = (key: keyof typeof motiveWeights, value: number) => {
    setMotiveWeights((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Onboarding</p>
          <h2 className="text-2xl font-semibold text-primary">{steps[step]}</h2>
        </div>
        <Badge variant="secondary">Step {step + 1} of {steps.length}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shape your cellar motives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step < 6 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-medium">Scarcity</label>
                <Slider min={1} max={10} value={motiveWeights.scarcity} onChange={(e) => updateWeight('scarcity', Number(e.target.value))} />
                <label className="text-sm font-medium">Prestige</label>
                <Slider min={1} max={10} value={motiveWeights.prestige} onChange={(e) => updateWeight('prestige', Number(e.target.value))} />
                <label className="text-sm font-medium">Value signals</label>
                <Slider min={1} max={10} value={motiveWeights.value} onChange={(e) => updateWeight('value', Number(e.target.value))} />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Drink window</label>
                <Slider min={1} max={10} value={motiveWeights.drinkWindow} onChange={(e) => updateWeight('drinkWindow', Number(e.target.value))} />
                <label className="text-sm font-medium">Entertaining</label>
                <Slider min={1} max={10} value={motiveWeights.entertaining} onChange={(e) => updateWeight('entertaining', Number(e.target.value))} />
                <label className="text-sm font-medium">Discovery</label>
                <Slider min={1} max={10} value={motiveWeights.discovery} onChange={(e) => updateWeight('discovery', Number(e.target.value))} />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <p className="text-sm text-muted">Select your preferred regions (used as a constraint).</p>
              <div className="grid gap-3 md:grid-cols-2">
                {['Bordeaux', 'Burgundy', 'Rhône', 'Tuscany', 'Champagne', 'Rioja'].map((region) => (
                  <label key={region} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={regions.includes(region)}
                      onChange={(event) =>
                        setRegions((prev) =>
                          event.target.checked ? [...prev, region] : prev.filter((item) => item !== region)
                        )
                      }
                    />
                    {region}
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Monthly budget comfort</label>
              <Select value={String(budget)} onChange={(event) => setBudget(Number(event.target.value))}>
                <option value="150">£150</option>
                <option value="250">£250</option>
                <option value="350">£350</option>
                <option value="500">£500</option>
              </Select>
            </div>
          )}

          {step === 7 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <p className="text-sm text-muted">Your motive profile</p>
                <MotiveRadarChart data={radarData} />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Constraints</p>
                  <ul className="mt-2 text-sm text-muted">
                    <li>Budget: £{budget}</li>
                    <li>Regions: {regions.join(', ')}</li>
                    <li>Drink window: 2024-2036</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium">Goals</p>
                  <ul className="mt-2 text-sm text-muted">
                    {memberProfile.goals.map((goal) => (
                      <li key={goal}>{goal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((prev) => prev - 1)}>
              Back
            </Button>
            <Button onClick={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))}>
              {step === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
