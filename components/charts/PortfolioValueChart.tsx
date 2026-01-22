'use client';

import { useMemo } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type PortfolioValueChartProps = {
  data: { month: string; value: number }[];
};

export function PortfolioValueChart({ data }: PortfolioValueChartProps) {
  // Compute Y-axis domain with padding for better visualization
  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 100];
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    // Add 20% padding above and below, but ensure min doesn't go negative
    const padding = Math.max(range * 0.2, max * 0.02); // At least 2% of max for flat lines
    return [Math.max(0, Math.floor((min - padding) / 1000) * 1000), Math.ceil((max + padding) / 1000) * 1000];
  }, [data]);

  // Format large numbers as £Xk
  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `£${(value / 1000).toFixed(1)}k`;
    }
    return `£${value}`;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" tick={{ fill: '#8d8377', fontSize: 12 }} axisLine={false} />
          <YAxis
            domain={yDomain}
            tick={{ fill: '#8d8377', fontSize: 12 }}
            axisLine={false}
            tickFormatter={formatValue}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              borderColor: '#e4dfd7',
              backgroundColor: '#fff'
            }}
            formatter={(value: number) => [`£${value.toLocaleString()}`, 'Value']}
          />
          <Line type="monotone" dataKey="value" stroke="#2f2a26" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
