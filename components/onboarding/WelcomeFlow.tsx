"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottleCard } from "@/components/BottleCard";
import { inventory } from "@/data/inventory";
import { generateWelcomeMessage } from "@/lib/ragu/extractionPrompts";
import { MotiveKey, UserCellarProfile } from "@/lib/types/cellarProfile";

const tagMotiveMap: Record<string, MotiveKey> = {
  prestige: "prestige",
  value: "value",
  entertaining: "entertaining",
  discovery: "discovery",
  scarce: "scarcity",
  cellar: "planning",
  legacy: "provenance",
  celebration: "entertaining",
  "drink-now": "entertaining"
};

const scoreForProfile = (profile: UserCellarProfile) => (item: (typeof inventory)[number]) => {
  const tagScore = item.tags.reduce((sum, tag) => {
    const motive = tagMotiveMap[tag];
    if (!motive) return sum;
    return sum + profile.motiveWeights[motive];
  }, 0);
  const scarcityBoost = (item.scarcity_level / 10) * profile.motiveWeights.scarcity;
  const criticBoost = (item.critic_signal / 100) * profile.motiveWeights.prestige;
  return tagScore + scarcityBoost + criticBoost;
};

export function WelcomeFlow({
  profile,
  accountManagerName
}: {
  profile: UserCellarProfile;
  accountManagerName: string;
}) {
  const recommendations = useMemo(() => {
    const scored = inventory
      .map((item) => ({ item, score: scoreForProfile(profile)(item) }))
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map((entry) => entry.item);
  }, [profile]);

  const greeting = useMemo(() => generateWelcomeMessage(profile), [profile]);
  const [messages] = useState([
    { id: "m1", sender: "concierge", content: greeting }
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Cellar Concierge, {profile.name.split(" ")[0]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-ink-600">
          <p>Based on what you've shared, we've got a clear picture of your collecting goals. Here's what happens next.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Personalized selections</p>
              <p>We'll curate wines that match your priorities—not just your palate.</p>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Monthly plans</p>
              <p>Each month, you'll receive a proposal aligned to your budget and goals.</p>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Account Manager review</p>
              <p>{accountManagerName} reviews every selection before it reaches you.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your first recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((item) => (
            <BottleCard key={item.id} item={item} />
          ))}
          <Button variant="outline">Draft my full basket</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Account Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-ink-600">
          <p>{accountManagerName} will curate every plan before it is finalized.</p>
          <Button variant="outline">Schedule an intro call</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Concierge chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="rounded-2xl bg-ink-900 px-4 py-3 text-sm text-white"
            >
              {message.content}
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Plan for a dinner party</Button>
            <Button variant="outline">Show me trophy bottles</Button>
            <Button variant="outline">Balance my portfolio</Button>
          </div>
          <input
            className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm"
            placeholder="Ask your concierge a question..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
