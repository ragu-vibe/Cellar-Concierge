'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PortfolioValueChart } from '@/components/charts/PortfolioValueChart';
import { mockPortfolioHistory } from '@/lib/ai/simulatedAi';
import { useDemoStore } from '@/lib/store/demoStore';

export default function PortfolioPage() {
  const portfolio = useDemoStore((state) => state.portfolio);
  const [region, setRegion] = useState('All');
  const [window, setWindow] = useState('All');

  const filtered = useMemo(() => {
    return portfolio.filter((item) => {
      const matchesRegion = region === 'All' || item.name.includes(region);
      const matchesWindow = window === 'All' || item.drinkWindow.includes(window);
      return matchesRegion && matchesWindow;
    });
  }, [portfolio, region, window]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Indicative portfolio value over time</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioValueChart data={mockPortfolioHistory} />
          <p className="mt-3 text-xs text-muted">Indicative only. Not investment advice.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cellar holdings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Select value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="All">All regions</option>
              <option value="Burgundy">Burgundy</option>
              <option value="Barolo">Barolo</option>
              <option value="Rioja">Rioja</option>
              <option value="Napa">Napa</option>
            </Select>
            <Select value={window} onChange={(event) => setWindow(event.target.value)}>
              <option value="All">All drink windows</option>
              <option value="2024">2024</option>
              <option value="2026">2026</option>
              <option value="2030">2030</option>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-primary">{item.name}</h4>
                    <p className="text-xs text-muted">Drink window: {item.drinkWindow}</p>
                  </div>
                  <Badge variant="secondary">{item.bottles} bottles</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-muted">
                  <span>Indicative value: £{item.indicativeValue}</span>
                  <span>Paid: £{item.purchasePrice}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
