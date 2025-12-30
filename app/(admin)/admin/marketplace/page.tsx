import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminMarketplacePage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Admin</p>
        <h1 className="text-3xl font-semibold">Marketplace expansion</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Merchant connectors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-ink-100 bg-ink-50 p-4">
            <span className="font-medium">Berry Bros. & Rudd (BBR)</span>
            <Badge variant="success">Enabled</Badge>
          </div>
          {[
            "LIV-EX", "Fine+Rare", "Arvi", "CultX"
          ].map((merchant) => (
            <div key={merchant} className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white p-4">
              <span className="font-medium">{merchant}</span>
              <Badge variant="outline">Disabled</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coverage gaps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-ink-600">Top 3 gaps by client demand:</p>
          <ul className="list-disc pl-5 text-sm text-ink-600">
            <li>Back vintages from cult Napa producers (currently excluded)</li>
            <li>Italian allocations for collectors (high scarcity)</li>
            <li>Prestige Champagne pre-2012 (limited supply)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
