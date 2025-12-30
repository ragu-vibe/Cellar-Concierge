"use client";

import { useState } from "react";
import { portfolio } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDemoStore } from "@/lib/store/demoStore";

export default function SellPage() {
  const { addSellIntent } = useDemoStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("Next 90 days");
  const [targetPrice, setTargetPrice] = useState("150");
  const [reason, setReason] = useState("");

  const bottle = portfolio.find((item) => item.id === selected);

  const submitIntent = () => {
    if (!bottle) return;
    addSellIntent({
      id: `sell-${Date.now()}`,
      memberId: "member-1",
      bottleId: bottle.id,
      bottleName: `${bottle.name} ${bottle.vintage}`,
      reason: reason || "Rebalancing cellar",
      timeframe,
      targetPriceGBP: Number(targetPrice),
      status: "Submitted"
    });
    setSelected(null);
    setReason("");
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Sell Intent</p>
        <h1 className="text-3xl font-semibold">Signal bottles for AM review</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {portfolio.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-500">{item.region}</p>
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm text-ink-600">{item.bottles} bottles • {item.vintage}</p>
              </div>
              <Button variant="outline" onClick={() => setSelected(item.id)}>
                Considering selling
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && bottle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-soft">
            <CardHeader className="p-0">
              <CardTitle>{bottle.name} {bottle.vintage}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-0 pt-4">
              <div>
                <label className="text-sm text-ink-600">Timeframe</label>
                <Input value={timeframe} onChange={(event) => setTimeframe(event.target.value)} />
              </div>
              <div>
                <label className="text-sm text-ink-600">Target price (£)</label>
                <Input value={targetPrice} onChange={(event) => setTargetPrice(event.target.value)} />
              </div>
              <div>
                <label className="text-sm text-ink-600">Reason</label>
                <Textarea value={reason} onChange={(event) => setReason(event.target.value)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setSelected(null)}>Cancel</Button>
                <Button onClick={submitIntent}>Submit intent</Button>
              </div>
            </CardContent>
          </div>
        </div>
      )}
    </div>
  );
}
