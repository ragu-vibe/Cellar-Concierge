"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MotivationWeights } from "@/data/members";

interface MotivationsPanelProps {
  motivations: MotivationWeights;
}

export function MotivationsPanel({ motivations }: MotivationsPanelProps) {
  const motivationMapping: { [key: string]: string } = {
    investment: "Investment",
    portfolio_building: "Portfolio Building",
    future_drinking: "Future Drinking",
    status_gifting: "Entertaining & Gifting",
    exploration: "Exploration",
    legacy: "Legacy",
  };

  const sortedMotivations = Object.entries(motivations)
    .filter(([, value]) => value > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Top Motivations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {sortedMotivations.map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span>{motivationMapping[key] || key}</span>
              <span className="font-semibold">{value}%</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
