"use client";

import { useDemoStore } from "@/lib/store/demoStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AMRequestsPage() {
  const { sellTickets } = useDemoStore();
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Sell intents</p>
        <h1 className="text-3xl font-semibold">Client requests</h1>
      </div>

      <Card>
        <CardHeader>
        <CardTitle>Active tickets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
          {sellTickets.map((intent) => (
            <div key={intent.id} className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink-500">{intent.bottleName}</p>
                  <p className="text-lg font-semibold">Target £{intent.targetPriceGBP}</p>
                </div>
                <Badge variant="warning">{intent.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-ink-600">Reason: {intent.reason}</p>
              <p className="text-xs text-ink-400">Timeframe: {intent.timeframe}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
