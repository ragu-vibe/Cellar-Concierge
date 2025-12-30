'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDemoStore } from '@/lib/store/demoStore';

export default function AMRequestsPage() {
  const sellIntents = useDemoStore((state) => state.sellIntents);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sell intent tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sellIntents.map((intent) => (
            <div key={intent.id} className="rounded-lg border border-border bg-white p-4">
              <p className="font-semibold text-primary">{intent.bottle}</p>
              <p className="text-xs text-muted">Timeframe: {intent.timeframe}</p>
              <p className="text-xs text-muted">Target: {intent.targetPrice}</p>
              <p className="text-xs text-muted">Reason: {intent.reason}</p>
              <p className="mt-2 text-xs text-muted">Status: {intent.status}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
