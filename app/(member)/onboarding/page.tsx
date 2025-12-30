"use client";

import { useMemo, useState } from "react";
import { MotiveRadarChart } from "@/components/MotiveRadarChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDemoStore } from "@/lib/store/demoStore";

const steps = [
  "Welcome",
  "Scarcity vs Access",
  "Prestige vs Discovery",
  "Value vs Narrative",
  "Entertaining Focus",
  "Drink Windows",
  "Constraints",
  "Summary"
];

export default function OnboardingPage() {
  const { member, updateMember } = useDemoStore();
  const [step, setStep] = useState(0);
  const [localMotives, setLocalMotives] = useState(member.motives);
  const [maxPrice, setMaxPrice] = useState(member.constraints.maxPriceGBP.toString());
  const [avoidRegions, setAvoidRegions] = useState(member.constraints.avoidRegions.join(", "));

  const summary = useMemo(
    () => ({
      motives: localMotives,
      constraints: {
        ...member.constraints,
        maxPriceGBP: Number(maxPrice || member.constraints.maxPriceGBP),
        avoidRegions: avoidRegions.split(",").map((region) => region.trim()).filter(Boolean)
      }
    }),
    [localMotives, maxPrice, avoidRegions, member.constraints]
  );

  const handleNext = () => {
    if (step === steps.length - 1) {
      updateMember({
        ...member,
        motives: localMotives,
        constraints: summary.constraints
      });
    }
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Onboarding wizard</p>
        <h1 className="text-3xl font-semibold">Let’s calibrate your cellar motives.</h1>
        <p className="text-sm text-ink-600">Step {step + 1} of {steps.length}: {steps[step]}</p>
      </div>

      <Card>
        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Hello, {member.name.split(" ")[0]}.</h2>
              <p className="text-sm text-ink-600">
                We’ll ask a few paired-choice questions to understand your priorities. Taste is a constraint; scarcity, prestige,
                and value signals drive the plan.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Scarcity vs Access</h2>
              <p className="text-sm text-ink-600">If given two similar wines, how much do you lean toward scarce allocations?</p>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={localMotives.scarcity}
                onChange={(event) =>
                  setLocalMotives((prev) => ({ ...prev, scarcity: Number(event.target.value) }))
                }
                className="w-full"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Prestige vs Discovery</h2>
              <p className="text-sm text-ink-600">Balance iconic producers with hidden gems.</p>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={localMotives.prestige}
                onChange={(event) => setLocalMotives((prev) => ({ ...prev, prestige: Number(event.target.value) }))}
                className="w-full"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Value vs Narrative</h2>
              <p className="text-sm text-ink-600">How much do you weigh value signals alongside story-led vintages?</p>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={localMotives.value}
                onChange={(event) => setLocalMotives((prev) => ({ ...prev, value: Number(event.target.value) }))}
                className="w-full"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Entertaining & Gifting</h2>
              <p className="text-sm text-ink-600">How much of your plan is meant for entertaining guests?</p>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={localMotives.entertaining}
                onChange={(event) => setLocalMotives((prev) => ({ ...prev, entertaining: Number(event.target.value) }))}
                className="w-full"
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Drink Windows</h2>
              <p className="text-sm text-ink-600">Preference for drink-now vs cellar-building selections.</p>
              <div className="grid gap-3 md:grid-cols-3">
                {["now", "balanced", "cellar"].map((option) => (
                  <button
                    key={option}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                      member.constraints.drinkWindowFocus === option ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200"
                    }`}
                    onClick={() => updateMember({
                      ...member,
                      constraints: { ...member.constraints, drinkWindowFocus: option as "now" | "balanced" | "cellar" }
                    })}
                  >
                    {option === "now" ? "Drink now" : option === "balanced" ? "Balanced" : "Cellar build"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Constraints</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-ink-600">Max bottle price (£)</label>
                  <Input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-ink-600">Avoid regions (comma separated)</label>
                  <Input value={avoidRegions} onChange={(event) => setAvoidRegions(event.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Your motive profile</h2>
              <MotiveRadarChart motives={summary.motives} />
              <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4 text-sm text-ink-600">
                <p><strong>Constraints:</strong> Max £{summary.constraints.maxPriceGBP} • Avoid {summary.constraints.avoidRegions.join(", ") || "None"}</p>
                <p><strong>Goals:</strong> {member.goals.join(" • ")}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
          Back
        </Button>
        <Button onClick={handleNext}>{step === steps.length - 1 ? "Save profile" : "Next"}</Button>
      </div>
    </div>
  );
}
