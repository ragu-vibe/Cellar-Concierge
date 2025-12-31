"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MotiveRadarChart } from "@/components/MotiveRadarChart";
import {
  MaxDiffRound,
  MotiveKey,
  OnboardingAnswers,
  StrategyAnchor,
  UserCellarProfile
} from "@/lib/types/cellarProfile";
import { computeProfileFromAnswers } from "@/lib/scoring/profileScoring";

const steps = [
  "Welcome",
  "Strategy Anchor",
  "Budget Split",
  "Cadence & Volume",
  "Motive Ranking",
  "Constraints",
  "Themes",
  "Free Text",
  "Summary",
  "Finish"
];

const strategyOptions: { id: StrategyAnchor; label: string; description: string }[] = [
  {
    id: "investment_growth",
    label: "Grow long-term value",
    description: "Prioritize appreciation, scarcity, and resale optionality."
  },
  {
    id: "legacy_cellar",
    label: "Build a legacy cellar",
    description: "Focus on provenance, classic vintages, and age-worthy bottles."
  },
  {
    id: "hosting_ready",
    label: "Always be hosting-ready",
    description: "Keep a versatile cellar for dinners, gifting, and celebrations."
  },
  {
    id: "prestige_collecting",
    label: "Collect iconic labels",
    description: "Secure trophy bottles and blue-chip producers."
  },
  {
    id: "exploration",
    label: "Explore and learn",
    description: "Discover new regions and winemakers with expert guidance."
  }
];

const themeOptions = [
  "Bordeaux blue chips",
  "Burgundy whites",
  "Champagne for celebrations",
  "Rhone discovery",
  "Italian classics",
  "New World icons",
  "Vintage verticals",
  "Trophy bottles",
  "Dinner party staples"
];

const maxDiffTemplate: MaxDiffRound[] = [
  {
    id: "round-1",
    options: ["investment_curiosity", "prestige", "value", "discovery"]
  },
  {
    id: "round-2",
    options: ["scarcity", "provenance", "planning", "entertaining"]
  },
  {
    id: "round-3",
    options: ["vintage_story", "value", "prestige", "scarcity"]
  }
];

const cadenceOptions = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "seasonal", label: "Seasonal" }
] as const;

const cadenceToDeliveries: Record<string, number> = {
  monthly: 12,
  quarterly: 4,
  seasonal: 6
};

const motiveLabels: Record<MotiveKey, string> = {
  scarcity: "Scarcity",
  provenance: "Provenance",
  prestige: "Prestige",
  vintage_story: "Vintage story",
  value: "Value",
  planning: "Planning",
  entertaining: "Entertaining",
  discovery: "Discovery",
  investment_curiosity: "Investment curiosity"
};

export function CellarPlanningModal({
  open,
  onClose,
  onComplete,
  memberName,
  monthlyBudgetGBP
}: {
  open: boolean;
  onClose: () => void;
  onComplete: (profile: UserCellarProfile) => void;
  memberName: string;
  monthlyBudgetGBP: number;
}) {
  const currentYear = new Date().getFullYear();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(() => ({
    strategyAnchor: "hosting_ready",
    budgetSplit: { drinkNow: 40, midTerm: 40, longTerm: 20 },
    cadence: "monthly",
    bottlesPerDelivery: 6,
    maxDiffRounds: maxDiffTemplate,
    constraints: {
      minVintage: 2008,
      maxVintage: currentYear,
      maxPriceGBP: 150,
      avoidRegions: [],
      storagePreference: "bonded"
    },
    themes: { mustHave: [], niceToHave: [] },
    freeText: "",
    monthlyBudgetGBP
  }));
  const [avoidRegionsText, setAvoidRegionsText] = useState("");

  const budgetTotal =
    answers.budgetSplit.drinkNow + answers.budgetSplit.midTerm + answers.budgetSplit.longTerm;
  const deliveriesPerYear = cadenceToDeliveries[answers.cadence];
  const bottlesPerYear = deliveriesPerYear * answers.bottlesPerDelivery;

  const maxDiffComplete = answers.maxDiffRounds.every(
    (round) => round.most && round.least && round.most !== round.least
  );

  const profilePreview = useMemo(
    () => computeProfileFromAnswers(answers, { id: "prospect-1", name: memberName }),
    [answers, memberName]
  );

  const updateMaxDiff = (roundId: string, type: "most" | "least", value: MotiveKey) => {
    setAnswers((prev) => ({
      ...prev,
      maxDiffRounds: prev.maxDiffRounds.map((round) => {
        if (round.id !== roundId) return round;
        if (type === "most") {
          return {
            ...round,
            most: value,
            least: round.least === value ? undefined : round.least
          };
        }
        return {
          ...round,
          least: value,
          most: round.most === value ? undefined : round.most
        };
      })
    }));
  };

  const toggleTheme = (bucket: "mustHave" | "niceToHave", value: string) => {
    setAnswers((prev) => {
      const exists = prev.themes[bucket].includes(value);
      return {
        ...prev,
        themes: {
          ...prev.themes,
          [bucket]: exists
            ? prev.themes[bucket].filter((item) => item !== value)
            : [...prev.themes[bucket], value]
        }
      };
    });
  };

  const handleNext = () => {
    if (step === 2 && budgetTotal !== 100) {
      const normalized = {
        drinkNow: Math.round((answers.budgetSplit.drinkNow / budgetTotal) * 100),
        midTerm: Math.round((answers.budgetSplit.midTerm / budgetTotal) * 100),
        longTerm: Math.round((answers.budgetSplit.longTerm / budgetTotal) * 100)
      };
      setAnswers((prev) => ({ ...prev, budgetSplit: normalized }));
    }
    if (step === steps.length - 1) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleFinish = () => {
    const profile = computeProfileFromAnswers(answers, { id: "prospect-1", name: memberName });
    onComplete(profile);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-soft">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Cellar planning</p>
            <h2 className="text-2xl font-semibold">Cellar Planning Consultation</h2>
            <p className="text-sm text-ink-600">Step {step + 1} of {steps.length}: {steps[step]}</p>
          </div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <div className="mt-6 space-y-6">
          {step === 0 && (
            <Card>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">Let's set up your cellar plan.</h3>
                <p className="text-sm text-ink-600">
                  In about 3 minutes, we'll learn what you're building toward so your monthly plan is drafted and curated with your Account Manager.
                </p>
                <p className="text-sm text-ink-600">Average time: 3 minutes.</p>
              </CardContent>
            </Card>
          )}

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>If you had 10,000 GBP to build your cellar today, what is your top priority?</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {strategyOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`rounded-3xl border px-4 py-4 text-left transition ${
                      answers.strategyAnchor === option.id ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200"
                    }`}
                    onClick={() => setAnswers((prev) => ({ ...prev, strategyAnchor: option.id }))}
                  >
                    <p className="text-base font-semibold">{option.label}</p>
                    <p className={`text-sm ${answers.strategyAnchor === option.id ? "text-ink-100" : "text-ink-600"}`}>{option.description}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>How should we split your monthly budget?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm text-ink-600">0-18 months (drink now)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={answers.budgetSplit.drinkNow}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        budgetSplit: { ...prev.budgetSplit, drinkNow: Number(event.target.value) }
                      }))
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-ink-600">{answers.budgetSplit.drinkNow}%</div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-ink-600">2-10 years (cellar build)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={answers.budgetSplit.midTerm}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        budgetSplit: { ...prev.budgetSplit, midTerm: Number(event.target.value) }
                      }))
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-ink-600">{answers.budgetSplit.midTerm}%</div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-ink-600">10+ years (legacy)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={answers.budgetSplit.longTerm}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        budgetSplit: { ...prev.budgetSplit, longTerm: Number(event.target.value) }
                      }))
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-ink-600">{answers.budgetSplit.longTerm}%</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, budgetSplit: { drinkNow: 60, midTerm: 30, longTerm: 10 } }))
                    }
                  >
                    Drink-now focus
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, budgetSplit: { drinkNow: 40, midTerm: 40, longTerm: 20 } }))
                    }
                  >
                    Balanced
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, budgetSplit: { drinkNow: 20, midTerm: 40, longTerm: 40 } }))
                    }
                  >
                    Cellar heavy
                  </Button>
                </div>
                <p className={`text-sm ${budgetTotal === 100 ? "text-ink-600" : "text-accent-600"}`}>
                  Total: {budgetTotal}% {budgetTotal === 100 ? "" : "(we will normalize to 100%)"}
                </p>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>How often do you want allocations?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {cadenceOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`rounded-full border px-4 py-2 text-sm ${
                        answers.cadence === option.id ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 text-ink-600"
                      }`}
                      onClick={() => setAnswers((prev) => ({ ...prev, cadence: option.id }))}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-ink-600">Bottles per delivery</label>
                  <Input
                    value={answers.bottlesPerDelivery}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        bottlesPerDelivery: Number(event.target.value || 0)
                      }))
                    }
                  />
                </div>
                <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4 text-sm text-ink-600">
                  Estimated volume: {bottlesPerYear} bottles per year.
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Pick what matters most and least in each round.</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {answers.maxDiffRounds.map((round, index) => (
                  <div key={round.id} className="rounded-2xl border border-ink-100 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Round {index + 1}</p>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Most important</p>
                        {round.options.map((option) => (
                          <button
                            key={`${round.id}-most-${option}`}
                            className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                              round.most === option ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200"
                            }`}
                            onClick={() => updateMaxDiff(round.id, "most", option)}
                          >
                            {motiveLabels[option]}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Least important</p>
                        {round.options.map((option) => (
                          <button
                            key={`${round.id}-least-${option}`}
                            className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                              round.least === option ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200"
                            }`}
                            onClick={() => updateMaxDiff(round.id, "least", option)}
                          >
                            {motiveLabels[option]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {!maxDiffComplete && (
                  <p className="text-sm text-accent-600">Select one most and one least in each round.</p>
                )}
              </CardContent>
            </Card>
          )}

          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Constraints and guardrails</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-ink-600">Max bottle price (GBP)</label>
                  <Input
                    value={answers.constraints.maxPriceGBP}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        constraints: { ...prev.constraints, maxPriceGBP: Number(event.target.value || 0) }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-ink-600">Storage preference</label>
                  <div className="flex flex-wrap gap-2">
                    {["bonded", "delivery", "either"].map((option) => (
                      <button
                        key={option}
                        className={`rounded-full border px-3 py-2 text-sm ${
                          answers.constraints.storagePreference === option
                            ? "border-ink-900 bg-ink-900 text-white"
                            : "border-ink-200 text-ink-600"
                        }`}
                        onClick={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            constraints: { ...prev.constraints, storagePreference: option as "bonded" | "delivery" | "either" }
                          }))
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-ink-600">Vintage range</label>
                  <div className="flex gap-2">
                    <Input
                      value={answers.constraints.minVintage}
                      onChange={(event) =>
                        setAnswers((prev) => ({
                          ...prev,
                          constraints: { ...prev.constraints, minVintage: Number(event.target.value || 0) }
                        }))
                      }
                    />
                    <Input
                      value={answers.constraints.maxVintage}
                      onChange={(event) =>
                        setAnswers((prev) => ({
                          ...prev,
                          constraints: { ...prev.constraints, maxVintage: Number(event.target.value || 0) }
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-ink-600">Avoid regions (comma separated)</label>
                  <Input
                    value={avoidRegionsText}
                    onChange={(event) => {
                      const value = event.target.value;
                      setAvoidRegionsText(value);
                      setAnswers((prev) => ({
                        ...prev,
                        constraints: {
                          ...prev.constraints,
                          avoidRegions: value.split(",").map((item) => item.trim()).filter(Boolean)
                        }
                      }));
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 6 && (
            <Card>
              <CardHeader>
                <CardTitle>Choose focus areas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold">Must have</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {themeOptions.map((theme) => (
                      <button
                        key={`must-${theme}`}
                        className={`rounded-full border px-3 py-2 text-sm ${
                          answers.themes.mustHave.includes(theme)
                            ? "border-ink-900 bg-ink-900 text-white"
                            : "border-ink-200 text-ink-600"
                        }`}
                        onClick={() => toggleTheme("mustHave", theme)}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">Nice to have</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {themeOptions.map((theme) => (
                      <button
                        key={`nice-${theme}`}
                        className={`rounded-full border px-3 py-2 text-sm ${
                          answers.themes.niceToHave.includes(theme)
                            ? "border-ink-900 bg-ink-900 text-white"
                            : "border-ink-200 text-ink-600"
                        }`}
                        onClick={() => toggleTheme("niceToHave", theme)}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 7 && (
            <Card>
              <CardHeader>
                <CardTitle>Anything else we should know?</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Tell us about upcoming events, favorite producers, or gifting plans."
                  value={answers.freeText}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, freeText: event.target.value }))}
                />
              </CardContent>
            </Card>
          )}

          {step === 8 && (
            <Card>
              <CardHeader>
                <CardTitle>Summary and confirmation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MotiveRadarChart motives={profilePreview.motiveWeights} />
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4 text-sm text-ink-600">
                    <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Strategy</p>
                    <p className="text-base font-semibold">
                      {strategyOptions.find((option) => option.id === answers.strategyAnchor)?.label}
                    </p>
                    <p className="text-sm">Budget split: {profilePreview.budgetPolicy.split.drinkNow}% / {profilePreview.budgetPolicy.split.midTerm}% / {profilePreview.budgetPolicy.split.longTerm}%</p>
                  </div>
                  <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4 text-sm text-ink-600">
                    <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Constraints</p>
                    <p>Max price: GBP {answers.constraints.maxPriceGBP}</p>
                    <p>Storage: {answers.constraints.storagePreference}</p>
                    <p>Avoid: {answers.constraints.avoidRegions.join(", ") || "None"}</p>
                  </div>
                  <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4 text-sm text-ink-600 md:col-span-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Themes</p>
                    <p>Must have: {answers.themes.mustHave.join(", ") || "None"}</p>
                    <p>Nice to have: {answers.themes.niceToHave.join(", ") || "None"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 9 && (
            <Card>
              <CardHeader>
                <CardTitle>You're set.</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-ink-600">
                <p>Your first monthly draft will be prepared and sent to your Account Manager for curation.</p>
                <p className="text-xs text-ink-400">18+ to purchase alcohol.</p>
                <p className="text-xs text-ink-400">Indicative values only. Not investment advice.</p>
                <p className="text-xs text-ink-400">Drafted by intelligent tools, curated with your Account Manager.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={step === 4 && !maxDiffComplete}>
              Next
            </Button>
          ) : (
            <Button onClick={handleFinish}>Finish</Button>
          )}
        </div>
      </div>
    </div>
  );
}
