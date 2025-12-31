"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MotivationWeights } from "@/data/members";

interface MotivationsPanelProps {
  motivations: MotivationWeights;
}

export function MotivationsPanel({ motivations }: MotivationsPanelProps) {
  const motivationMapping: { [key: string]: string } = {
    investment: "Investment",
    learning: "Learning",
    social: "Social",
    collecting: "Collecting",
    drinking: "Drinking",
    curiosity: "Curiosity",
  };

  const sortedMotivations = Object.entries(motivations)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Top 3 Motivations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {sortedMotivations.map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span>{motivationMapping[key]}</span>
              <span className="font-semibold">{(value * 100).toFixed(0)}%</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
