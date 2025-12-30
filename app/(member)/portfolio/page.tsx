"use client";

import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { portfolio } from "@/data/portfolio";
const currentYear = new Date().getFullYear();

const chartData = [
  { month: "May", value: 2300 },
  { month: "Jun", value: 2380 },
  { month: "Jul", value: 2440 },
  { month: "Aug", value: 2520 },
  { month: "Sep", value: 2680 }
];

export default function PortfolioPage() {
  const filters = useMemo(() => ["Bordeaux", "Rhône", "Drink now", "Cellar"], []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Portfolio</p>
        <h1 className="text-3xl font-semibold">Your cellar overview</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Indicative portfolio value over time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <XAxis dataKey="month" stroke="#715b4b" fontSize={12} />
                <YAxis stroke="#715b4b" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2b231f" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-ink-400">Indicative only. Not investment advice.</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Badge key={filter} variant="outline">
            {filter}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {portfolio.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink-500">{item.region}</p>
                  <p className="text-lg font-semibold">{item.name}</p>
                </div>
                <Badge variant="outline">{item.bottles} bottles</Badge>
              </div>
              <p className="text-sm text-ink-600">Drink window {item.drink_window_start}-{item.drink_window_end}</p>
              <div className="h-2 w-full rounded-full bg-ink-100">
                <div
                  className="h-2 rounded-full bg-ink-900"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        ((currentYear - item.drink_window_start) / (item.drink_window_end - item.drink_window_start)) * 100
                      )
                    )}%`
                  }}
                />
              </div>
              <p className="text-sm text-ink-600">Indicative value £{item.indicative_value_gbp.toFixed(0)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
