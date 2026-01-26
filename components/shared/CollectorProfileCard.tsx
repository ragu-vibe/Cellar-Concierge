'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CollectorProfile } from '@/data/members';
import { Target, Clock, Wallet, MapPin, TrendingUp } from 'lucide-react';

interface CollectorProfileCardProps {
  profile: CollectorProfile;
  regions?: string[];
  loading?: boolean;
}

export function CollectorProfileCard({ profile, regions, loading }: CollectorProfileCardProps) {
  const motivationLabels: Record<string, string> = {
    investment: 'Investment',
    portfolio_building: 'Portfolio Building',
    future_drinking: 'Future Drinking',
    status_gifting: 'Entertaining & Gifting',
    exploration: 'Exploration',
    legacy: 'Legacy',
  };

  const riskLabels: Record<string, string> = {
    conservative: 'Conservative',
    balanced: 'Balanced',
    aggressive: 'Aggressive',
  };

  const timeHorizonLabels: Record<string, string> = {
    short: 'Near-term (1-3 yrs)',
    medium: 'Medium (3-7 yrs)',
    long: 'Long-term (7+ yrs)',
  };

  const budgetLabels: Record<string, string> = {
    volume: 'Value-focused',
    balanced: 'Balanced',
    trophy: 'Trophy-focused',
  };

  const regionalLabels: Record<string, string> = {
    depth: 'Focused regions',
    breadth: 'Diverse regions',
  };

  // Get top 3 motivations
  const topMotivations = Object.entries(profile.motivations)
    .filter(([, value]) => value > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-bbr-burgundy" />
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-bbr-burgundy" />
            Your Collector Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="h-4 bg-ink-100 rounded w-3/4" />
              <div className="h-4 bg-ink-100 rounded w-1/2" />
              <div className="h-4 bg-ink-100 rounded w-2/3" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-ink-100 rounded w-full" />
              <div className="h-4 bg-ink-100 rounded w-3/4" />
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-ink-100 rounded w-20" />
              <div className="h-6 bg-ink-100 rounded w-24" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 bg-ink-100 rounded w-16" />
              <div className="h-6 bg-ink-100 rounded w-20" />
              <div className="h-6 bg-ink-100 rounded w-14" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-bbr-burgundy" />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-bbr-burgundy" />
          Your Collector Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Top Motivations */}
          <div className="pr-8">
            <p className="text-xs uppercase text-muted mb-3">Top Motivations</p>
            <div className="space-y-2">
              {topMotivations.map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="truncate mr-2">{motivationLabels[key] || key}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-12 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-bbr-burgundy rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-muted text-xs w-7 text-right">{value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Attributes */}
          <div>
            <p className="text-xs uppercase text-muted mb-3">Approach</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted flex-shrink-0" />
                <span className="font-medium">{timeHorizonLabels[profile.timeHorizon]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted flex-shrink-0" />
                <span className="font-medium">{budgetLabels[profile.budgetStrategy]}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted flex-shrink-0" />
                <span className="font-medium">{riskLabels[profile.riskProfile]} risk</span>
              </div>
            </div>
          </div>

          {/* Regional Strategy */}
          <div>
            <p className="text-xs uppercase text-muted mb-3">Regional Strategy</p>
            <div className="flex items-center gap-2 text-sm mb-2">
              <MapPin className="h-4 w-4 text-muted flex-shrink-0" />
              <span className="font-medium">{regionalLabels[profile.regionalFocus]}</span>
            </div>
            {regions && regions.length > 0 && (
              <p className="text-xs text-muted">{regions.length} regions selected</p>
            )}
          </div>

          {/* Preferred Regions */}
          {regions && regions.length > 0 && (
            <div>
              <p className="text-xs uppercase text-muted mb-3">Preferred Regions</p>
              <div className="flex flex-wrap gap-1.5">
                {regions.slice(0, 8).map((region) => (
                  <Badge key={region} variant="secondary" className="text-xs">
                    {region}
                  </Badge>
                ))}
                {regions.length > 8 && (
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    title={regions.slice(8).join(', ')}
                  >
                    +{regions.length - 8}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
