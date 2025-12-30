'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useDemoStore } from '@/lib/store/demoStore';

export default function AdminIntegrationsPage() {
  const gamificationEnabled = useDemoStore((state) => state.gamificationEnabled);
  const marketplaceExpansionEnabled = useDemoStore((state) => state.marketplaceExpansionEnabled);
  const setGamificationEnabled = useDemoStore((state) => state.setGamificationEnabled);
  const setMarketplaceExpansionEnabled = useDemoStore((state) => state.setMarketplaceExpansionEnabled);
  const resetDemo = useDemoStore((state) => state.resetDemo);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integration status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted">
          <div className="flex items-center justify-between">
            <span>BBR feed</span>
            <span className="text-emerald-600">Connected · Last sync 8 min ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Ragu AI</span>
            <span className="text-emerald-600">Mocked · Deterministic simulation</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-primary">Gamification</p>
              <p className="text-xs text-muted">Milestones and cellar health scoring</p>
            </div>
            <Switch checked={gamificationEnabled} onCheckedChange={setGamificationEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-primary">Marketplace expansion</p>
              <p className="text-xs text-muted">Beyond BBR connectors (stub)</p>
            </div>
            <Switch checked={marketplaceExpansionEnabled} onCheckedChange={setMarketplaceExpansionEnabled} />
          </div>
          <Button variant="outline" onClick={resetDemo}>
            Reset demo data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
