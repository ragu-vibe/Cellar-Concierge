'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type PortfolioValueChartProps = {
  data: { month: string; value: number }[];
};

export function PortfolioValueChart({ data }: PortfolioValueChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" tick={{ fill: '#8d8377', fontSize: 12 }} axisLine={false} />
          <YAxis tick={{ fill: '#8d8377', fontSize: 12 }} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              borderColor: '#e4dfd7',
              backgroundColor: '#fff'
            }}
          />
          <Line type="monotone" dataKey="value" stroke="#2f2a26" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
