'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useDemoStore } from '@/lib/store/demoStore';

export default function SellPage() {
  const portfolio = useDemoStore((state) => state.portfolio);
  const addSellIntent = useDemoStore((state) => state.addSellIntent);
  const sellIntents = useDemoStore((state) => state.sellIntents);

  const [selectedBottle, setSelectedBottle] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [reason, setReason] = useState('');

  const resetForm = () => {
    setSelectedBottle('');
    setTimeframe('');
    setTargetPrice('');
    setReason('');
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Sell Intent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted">
            This is not an open marketplace. Submit a sell intent and your Account Manager will respond with options.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {portfolio.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-white p-4">
                <h4 className="font-semibold text-primary">{item.name}</h4>
                <p className="text-xs text-muted">{item.bottles} bottles · Drink {item.drinkWindow}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-3" size="sm" onClick={() => setSelectedBottle(item.name)}>
                      Considering selling
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Sell intent details</DialogTitle>
                      <DialogDescription>Capture timeframe and expectations for the AM to review.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <Input placeholder="Timeframe (e.g. next 90 days)" value={timeframe} onChange={(e) => setTimeframe(e.target.value)} />
                      <Input placeholder="Target price" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} />
                      <Textarea placeholder="Reason or constraints" value={reason} onChange={(e) => setReason(e.target.value)} />
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          addSellIntent({ bottle: selectedBottle, timeframe, targetPrice, reason });
                          resetForm();
                        }}
                      >
                        Submit sell intent
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submitted intents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sellIntents.map((intent) => (
            <div key={intent.id} className="rounded-lg border border-border bg-accent/5 p-3 text-sm text-muted">
              <p className="font-medium text-primary">{intent.bottle}</p>
              <p>Timeframe: {intent.timeframe}</p>
              <p>Target price: {intent.targetPrice}</p>
              <p>Reason: {intent.reason}</p>
              <p>Status: {intent.status}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
