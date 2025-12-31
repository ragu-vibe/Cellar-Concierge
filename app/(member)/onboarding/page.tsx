"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDemoStore } from "@/lib/store/demoStore";
import { CellarPlanningModal } from "@/components/onboarding/CellarPlanningModal";
import { WelcomeFlow } from "@/components/onboarding/WelcomeFlow";
import { UserCellarProfile } from "@/lib/types/cellarProfile";

export default function OnboardingPage() {
  const {
    member,
    prospectProfile,
    onboardingComplete,
    setProspectProfile,
    resetProspect
  } = useDemoStore();
  const [open, setOpen] = useState(false);

  const handleComplete = (profile: UserCellarProfile) => {
    setProspectProfile(profile);
    setOpen(false);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-soft">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Cellar planning consultation</p>
          <h1 className="text-3xl font-semibold">Tell us how you want to build your cellar.</h1>
          <p className="text-sm text-ink-600">
            Answer a few tradeoff questions and we will draft your monthly plan for your Account Manager to curate.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setOpen(true)}>Begin your consultation</Button>
            {onboardingComplete && (
              <Button variant="outline" onClick={resetProspect}>Restart consultation</Button>
            )}
          </div>
        </div>
      </section>

      {!onboardingComplete && (
        <Card>
          <CardContent className="space-y-2">
            <p className="text-sm text-ink-600">
              Your profile is private and only used to shape monthly recommendations.
            </p>
            <p className="text-xs text-ink-400">Indicative only. Not investment advice.</p>
          </CardContent>
        </Card>
      )}

      {onboardingComplete && prospectProfile && (
        <WelcomeFlow profile={prospectProfile} accountManagerName={member.accountManager.name} />
      )}

      <CellarPlanningModal
        open={open}
        onClose={() => setOpen(false)}
        onComplete={handleComplete}
        memberName={member.name}
        monthlyBudgetGBP={member.budgetGBP}
      />
    </div>
  );
}
