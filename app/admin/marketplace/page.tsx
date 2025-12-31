'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDemoStore } from '@/lib/store/demoStore';

export default function AdminMarketplacePage() {
  const marketplaceExpansionEnabled = useDemoStore((state) => state.marketplaceExpansionEnabled);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expansion beyond BBR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted">
          <p>Status: {marketplaceExpansionEnabled ? 'Enabled (stub)' : 'Disabled'}</p>
          <p>This page is a placeholder for marketplace expansion analytics.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Merchant connectors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>BBR</span>
            <Badge>Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>La Place de Bordeaux</span>
            <Badge variant="outline">Disabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Global Broker Network</span>
            <Badge variant="outline">Disabled</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coverage gaps</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          <ul className="list-disc space-y-2 pl-4">
            <li>Limited access to boutique Rhône producers.</li>
            <li>Champagne grower allocation volatility.</li>
            <li>Fine wine availability outside UK distribution.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
