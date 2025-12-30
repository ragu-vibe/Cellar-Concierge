"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { MotiveWeights } from "@/lib/types";

const mapData = (motives: MotiveWeights) =>
  Object.entries(motives).map(([key, value]) => ({
    motive: key.replace(/([A-Z])/g, " $1"),
    value: Math.round(value * 100)
  }));

export function MotiveRadarChart({ motives }: { motives: MotiveWeights }) {
  const data = mapData(motives);
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
