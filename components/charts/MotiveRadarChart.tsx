'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

type MotiveRadarChartProps = {
  data: { motive: string; value: number }[];
};

export function MotiveRadarChart({ data }: MotiveRadarChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e4dfd7" />
          <PolarAngleAxis dataKey="motive" tick={{ fill: '#8d8377', fontSize: 12 }} />
          <Radar dataKey="value" stroke="#8c6f56" fill="#8c6f56" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
