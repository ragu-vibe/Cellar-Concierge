'use client';

import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Wine, DollarSign, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PortfolioValueChart } from '@/components/charts/PortfolioValueChart';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { mockPortfolioHistory } from '@/lib/ai/simulatedAi';
import { useDemoStore } from '@/lib/store/demoStore';
import { cn } from '@/lib/utils';

export default function PortfolioPage() {
  const portfolio = useDemoStore((state) => state.portfolio);
  const [region, setRegion] = useState('All');
  const [status, setStatus] = useState('All');

  const currentYear = new Date().getFullYear();

  const totalBottles = portfolio.reduce((sum, item) => sum + item.bottles, 0);
  const totalSpend = portfolio.reduce((sum, item) => sum + item.purchasePrice, 0);
  const totalValue = portfolio.reduce((sum, item) => sum + item.indicativeValue, 0);
  const gain = totalValue - totalSpend;
  const gainPercent = ((gain / totalSpend) * 100).toFixed(1);

  const filtered = useMemo(() => {
    return portfolio.filter((item) => {
      const matchesRegion = region === 'All' || item.name.toLowerCase().includes(region.toLowerCase());

      const [startYear] = item.drinkWindow.split('-').map(Number);
      let matchesStatus = true;
      if (status === 'Ready') matchesStatus = startYear <= currentYear;
      else if (status === 'Cellaring') matchesStatus = startYear > currentYear;

      return matchesRegion && matchesStatus;
    });
  }, [portfolio, region, status, currentYear]);

  const getWineStatus = (drinkWindow: string) => {
    const [start, end] = drinkWindow.split('-').map(Number);
    if (currentYear >= start && currentYear <= end) return 'ready';
    if (currentYear < start) return 'cellaring';
    return 'past-peak';
  };

  const getGainIndicator = (purchase: number, current: number) => {
    const gain = current - purchase;
    const percent = ((gain / purchase) * 100).toFixed(0);
    if (gain > 0) {
      return (
        <span className="flex items-center gap-1 text-green-600">
          <TrendingUp className="h-3 w-3" />+{percent}%
        </span>
      );
    } else if (gain < 0) {
      return (
        <span className="flex items-center gap-1 text-red-500">
          <TrendingDown className="h-3 w-3" />{percent}%
        </span>
      );
    }
    return <span className="text-muted">0%</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Your Collection</p>
          <h1 className="font-display text-3xl text-foreground">Cellar Portfolio</h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-100">
                <Wine className="h-5 w-5 text-muted" />
              </div>
              <div>
                <p className="text-xs uppercase text-muted">Bottles</p>
                <p className="text-2xl font-semibold">{totalBottles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-100">
                <DollarSign className="h-5 w-5 text-muted" />
              </div>
              <div>
                <p className="text-xs uppercase text-muted">Total Spend</p>
                <p className="text-2xl font-semibold">£{totalSpend.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs uppercase text-muted">Current Value</p>
                <p className="text-2xl font-semibold">£{totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-200">
                <TrendingUp className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-xs uppercase text-green-700">Unrealized Gain</p>
                <p className="text-2xl font-semibold text-green-700">+{gainPercent}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-bbr-burgundy" />
            Portfolio Value Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioValueChart data={mockPortfolioHistory} />
          <p className="mt-3 text-xs text-muted">Indicative only. Not investment advice.</p>
        </CardContent>
      </Card>

      {/* Holdings */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Wine className="h-5 w-5 text-bbr-burgundy" />
              Your Holdings
            </CardTitle>
            <div className="flex flex-wrap gap-3">
              <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="All">All Wines</option>
                <option value="Burgundy">Burgundy</option>
                <option value="Barolo">Barolo</option>
                <option value="Rioja">Rioja</option>
                <option value="Napa">Napa</option>
              </Select>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Ready">Ready to Drink</option>
                <option value="Cellaring">Cellaring</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((item) => {
              const wineStatus = getWineStatus(item.drinkWindow);
              const [startYear, endYear] = item.drinkWindow.split('-').map(Number);
              const progress = wineStatus === 'past-peak'
                ? 100
                : wineStatus === 'ready'
                ? Math.min(100, ((currentYear - startYear) / (endYear - startYear)) * 100)
                : 0;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-white p-5 space-y-4 hover:shadow-soft transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">{item.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Clock className="h-3 w-3" />
                        <span>{item.drinkWindow}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            wineStatus === 'ready' && 'border-green-300 bg-green-50 text-green-700',
                            wineStatus === 'cellaring' && 'border-amber-300 bg-amber-50 text-amber-700',
                            wineStatus === 'past-peak' && 'border-red-300 bg-red-50 text-red-700'
                          )}
                        >
                          {wineStatus === 'ready' ? 'Ready' : wineStatus === 'cellaring' ? 'Cellaring' : 'Past Peak'}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {item.bottles} {item.bottles === 1 ? 'bottle' : 'bottles'}
                    </Badge>
                  </div>

                  {/* Drink Window Progress */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          wineStatus === 'ready' && 'bg-green-500',
                          wineStatus === 'cellaring' && 'bg-amber-400',
                          wineStatus === 'past-peak' && 'bg-red-400'
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted">
                      <span>{startYear}</span>
                      <span>Peak</span>
                      <span>{endYear}</span>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-0.5">
                      <p className="text-muted">Value</p>
                      <p className="font-semibold">£{item.indicativeValue}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-muted">Paid</p>
                      <p className="font-medium">£{item.purchasePrice}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-muted">Gain</p>
                      <p className="font-medium">{getGainIndicator(item.purchasePrice, item.indicativeValue)}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      List for Sale
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Request Delivery
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Wine className="h-12 w-12 text-muted mx-auto mb-3" />
              <p className="text-muted">No wines match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Panel */}
      <ChatPanel />
    </div>
  );
}
