'use client';

import { useMemo, useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wine, DollarSign, Clock, Tag, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PortfolioValueChart } from '@/components/charts/PortfolioValueChart';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { generatePortfolioHistory } from '@/lib/ai/simulatedAi';
import { useDemoStore } from '@/lib/store/demoStore';
import { cn } from '@/lib/utils';

export default function PortfolioPage() {
  const portfolio = useDemoStore((state) => state.portfolio);
  const portfolioLoading = useDemoStore((state) => state.portfolioLoading);
  const fetchPortfolio = useDemoStore((state) => state.fetchPortfolio);
  const [region, setRegion] = useState('All');
  const [status, setStatus] = useState('All');

  // Fetch real portfolio data on mount
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const currentYear = new Date().getFullYear();

  const totalBottles = portfolio.reduce((sum, item) => sum + item.bottles, 0);
  const totalSpend = portfolio.reduce((sum, item) => sum + item.purchasePrice, 0);
  const totalValue = portfolio.reduce((sum, item) => sum + item.indicativeValue, 0);
  const gain = totalValue - totalSpend;
  const gainPercent = ((gain / totalSpend) * 100).toFixed(1);

  // Generate realistic chart history based on actual portfolio value
  const portfolioHistory = useMemo(() => {
    return generatePortfolioHistory(totalValue);
  }, [totalValue]);

  // Compute dynamic region options with counts
  const regionOptions = useMemo(() => {
    const regionCounts = new Map<string, number>();
    for (const item of portfolio) {
      const r = item.region || 'Unknown';
      regionCounts.set(r, (regionCounts.get(r) || 0) + 1);
    }
    // Sort by count descending
    return Array.from(regionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [portfolio]);

  // Helper to categorize BBR maturity status
  const getMaturityCategory = (maturity: string | null | undefined): 'not-ready' | 'ready' | 'mature' => {
    if (!maturity) return 'ready'; // Default if no data
    const m = maturity.toLowerCase();
    if (m.includes('not ready')) return 'not-ready';
    if (m.includes('mature')) return 'mature';
    return 'ready'; // "Ready - youthful", "Ready - at best"
  };

  // Compute status counts based on BBR maturity
  const statusCounts = useMemo(() => {
    let notReady = 0;
    let ready = 0;
    let mature = 0;
    for (const item of portfolio) {
      const category = getMaturityCategory(item.maturity);
      if (category === 'not-ready') notReady++;
      else if (category === 'mature') mature++;
      else ready++;
    }
    return { notReady, ready, mature };
  }, [portfolio]);

  const filtered = useMemo(() => {
    return portfolio.filter((item) => {
      const itemRegion = item.region || 'Unknown';
      const matchesRegion = region === 'All' || itemRegion === region;

      // Filter by BBR maturity status
      const category = getMaturityCategory(item.maturity);
      let matchesStatus = true;
      if (status === 'Not Ready') {
        matchesStatus = category === 'not-ready';
      } else if (status === 'Ready') {
        matchesStatus = category === 'ready';
      } else if (status === 'Mature') {
        matchesStatus = category === 'mature';
      }

      return matchesRegion && matchesStatus;
    });
  }, [portfolio, region, status]);

  // Get display label for BBR maturity
  const getMaturityLabel = (maturity: string | null | undefined): string => {
    if (!maturity) return 'Ready';
    // Clean up the BBR format for display
    if (maturity.toLowerCase().includes('not ready')) return 'Not Ready';
    if (maturity.toLowerCase().includes('youthful')) return 'Ready - Youthful';
    if (maturity.toLowerCase().includes('at best')) return 'Ready - At Best';
    if (maturity.toLowerCase().includes('mature')) return 'Ready - Mature';
    return maturity; // Return as-is if unknown format
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

  // Show loading state while fetching real data
  if (portfolioLoading) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Your Collection</p>
            <h1 className="font-display text-3xl text-foreground">
              Cellar Portfolio
              <Loader2 className="inline-block ml-2 h-6 w-6 animate-spin text-muted" />
            </h1>
          </div>
        </div>

        {/* Loading Skeleton for Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-ink-100 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-ink-100 rounded animate-pulse" />
                    <div className="h-6 w-24 bg-ink-100 rounded animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Skeleton for Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-bbr-burgundy" />
              Portfolio Value Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-ink-100 rounded animate-pulse" />
          </CardContent>
        </Card>

        {/* Loading Skeleton for Holdings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wine className="h-5 w-5 text-bbr-burgundy" />
              Your Holdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-white p-5 space-y-4">
                  <div className="h-5 w-3/4 bg-ink-100 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-ink-100 rounded animate-pulse" />
                  <div className="h-1.5 w-full bg-ink-100 rounded animate-pulse" />
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-ink-100 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-ink-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Your Collection</p>
          <h1 className="font-display text-3xl text-foreground">
            Cellar Portfolio
          </h1>
        </div>
        <div className="text-sm text-muted">
          {portfolio.length} holdings
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
        <Card className={cn(
          gain >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
        )}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                gain >= 0 ? "bg-green-200" : "bg-red-200"
              )}>
                {gain >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-700" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-700" />
                )}
              </div>
              <div>
                <p className={cn(
                  "text-xs uppercase",
                  gain >= 0 ? "text-green-700" : "text-red-700"
                )}>
                  Unrealized {gain >= 0 ? "Gain" : "Loss"}
                </p>
                <p className={cn(
                  "text-2xl font-semibold",
                  gain >= 0 ? "text-green-700" : "text-red-700"
                )}>
                  {gain >= 0 ? "+" : ""}{gainPercent}%
                </p>
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
          <PortfolioValueChart data={portfolioHistory} />
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
                <option value="All">All Regions ({portfolio.length})</option>
                {regionOptions.map(({ name, count }) => (
                  <option key={name} value={name}>
                    {name} ({count})
                  </option>
                ))}
              </Select>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="All">All Maturity ({portfolio.length})</option>
                <option value="Not Ready">Not Ready ({statusCounts.notReady})</option>
                <option value="Ready">Ready ({statusCounts.ready})</option>
                <option value="Mature">Mature ({statusCounts.mature})</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((item) => {
              const maturityCategory = getMaturityCategory(item.maturity);
              const maturityLabel = getMaturityLabel(item.maturity);
              // Parse drink window dates, with sensible defaults
              const parts = (item.drinkWindow || '').split('-').map(Number);
              const startYear = isNaN(parts[0]) ? currentYear : parts[0];
              const endYear = isNaN(parts[1]) ? currentYear + 10 : parts[1];
              // Always show date range format
              const drinkWindowDisplay = `${startYear}-${endYear}`;
              // Progress based on current year position within drink window
              const progress = currentYear < startYear ? 0
                : currentYear > endYear ? 100
                : Math.round(((currentYear - startYear) / (endYear - startYear)) * 100);

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
                        <span>{drinkWindowDisplay}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            maturityCategory === 'ready' && 'border-green-300 bg-green-50 text-green-700',
                            maturityCategory === 'not-ready' && 'border-amber-300 bg-amber-50 text-amber-700',
                            maturityCategory === 'mature' && 'border-purple-300 bg-purple-50 text-purple-700'
                          )}
                        >
                          {maturityLabel}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {item.bottles} {item.bottles === 1 ? 'bottle' : 'bottles'}
                    </Badge>
                  </div>

                  {/* Maturity Progress */}
                  <div className="space-y-1">
                    <div className="relative h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          maturityCategory === 'ready' && 'bg-green-500',
                          maturityCategory === 'not-ready' && 'bg-amber-400',
                          maturityCategory === 'mature' && 'bg-purple-500'
                        )}
                        style={{ width: `${progress}%` }}
                      />
                      {/* Current year marker when within drink window */}
                      {progress > 0 && progress < 100 && (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-foreground rounded-full border border-white shadow-sm"
                          style={{ left: `calc(${progress}% - 4px)` }}
                        />
                      )}
                    </div>
                    <div className="relative flex justify-between text-xs text-muted">
                      <span>{startYear}</span>
                      {/* Show current year label when within drink window */}
                      {progress > 0 && progress < 100 && (
                        <span
                          className="absolute text-foreground font-medium"
                          style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                        >
                          {currentYear}
                        </span>
                      )}
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
