"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const formatLabel = (key: string) => {
  const withSpaces = key.replace(/_/g, " ").replace(/([A-Z])/g, " $1");
  return withSpaces
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const mapData = (motives: Record<string, number>, order?: string[]) => {
  const entries = order ? order.map((key) => [key, motives[key] ?? 0]) : Object.entries(motives);
  return entries.map(([key, value]) => ({
    motive: formatLabel(key),
    value: Math.round((value ?? 0) * 100)
  }));
};

export function MotiveRadarChart({
  motives,
  order
}: {
  motives: Record<string, number>;
  order?: string[];
}) {
  const data = mapData(motives, order);
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke="#c2b7a5" />
          <PolarAngleAxis dataKey="motive" tick={{ fill: "#5b483c", fontSize: 11 }} />
          <Radar dataKey="value" stroke="#2b231f" fill="#2b231f" fillOpacity={0.2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
