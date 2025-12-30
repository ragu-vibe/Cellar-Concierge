"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/store/demoStore";

export default function AdminIntegrationsPage() {
  const { gamificationEnabled, toggleGamification, resetDemo } = useDemoStore();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Admin</p>
        <h1 className="text-3xl font-semibold">Integrations & feature flags</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>BBR feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="success">Healthy</Badge>
            <p className="text-sm text-ink-600">Inventory sync refreshed 12 minutes ago.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ragu status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="success">Mocked</Badge>
            <p className="text-sm text-ink-600">Deterministic AI simulation active.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Gamification</p>
              <p className="text-xs text-ink-500">Cellar Health Score, milestones, and badges.</p>
            </div>
            <Button variant="outline" onClick={toggleGamification}>
              {gamificationEnabled ? "Disable" : "Enable"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Marketplace expansion</p>
              <p className="text-xs text-ink-500">Placeholder toggle for non-BBR merchants.</p>
            </div>
            <Badge variant="outline">Off</Badge>
          </div>
          <Button variant="ghost" onClick={resetDemo}>Reset demo data</Button>
        </CardContent>
      </Card>
    </div>
  );
}
