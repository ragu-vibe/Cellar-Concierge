'use client';

import { useState } from 'react';
import { Send, Phone, Info, ArrowRight, User } from 'lucide-react';
import { BudgetBar } from '@/components/shared/BudgetBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { useDemoStore } from '@/lib/store/demoStore';
import { cn } from '@/lib/utils';

const objectivesList = ['Drink-now', 'Cellar build', 'Entertaining', 'Prestige', 'Value', 'Discovery'];

export default function PlanPage() {
  const plan = useDemoStore((state) => state.plan);
  const accountManager = useDemoStore((state) => state.accountManager);
  const setPlanStatus = useDemoStore((state) => state.setPlanStatus);
  const [objectives, setObjectives] = useState(['Prestige', 'Cellar build']);
  const [toast, setToast] = useState<string | null>(null);

  const totalSpent = plan.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currentMonth = new Date().toLocaleDateString('en-GB', { month: 'long' });

  const handleSendToAM = () => {
    setPlanStatus('Sent to AM');
    setToast('Plan sent to your Account Manager for review.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">{currentMonth} Plan</p>
          <h1 className="font-display text-3xl text-foreground">Review Your Draft</h1>
          <p className="text-muted">
            £{totalSpent} of £{plan.budget} allocated
          </p>
        </div>
        <StatusBadge status={plan.status} />
      </div>

      {/* Budget & Objectives */}
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Budget allocation</span>
              <span className="font-medium">
                £{plan.budget - totalSpent} remaining
              </span>
            </div>
            <BudgetBar budget={plan.budget} spent={totalSpent} />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Current objectives</p>
            <div className="flex flex-wrap gap-2">
              {objectivesList.map((objective) => (
                <button
                  key={objective}
                  onClick={() =>
                    setObjectives((prev) =>
                      prev.includes(objective)
                        ? prev.filter((o) => o !== objective)
                        : [...prev, objective]
                    )
                  }
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm transition-colors',
                    objectives.includes(objective)
                      ? 'border-bbr-burgundy bg-bbr-burgundy text-white'
                      : 'border-border text-muted hover:border-ink-300'
                  )}
                >
                  {objective}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AM Brief */}
      <Card className="border-l-4 border-l-bbr-gold">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink-100">
              <User className="h-6 w-6 text-muted" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="font-medium">{accountManager.name}</p>
                <Badge variant="secondary">Account Manager</Badge>
              </div>
              <blockquote className="text-muted italic">
                "{plan.amNote}"
              </blockquote>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wine List */}
      <section className="space-y-4">
        <h2 className="section-title">Recommended Wines</h2>
        <div className="space-y-4">
          {plan.items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Wine Image Placeholder */}
                  <div className="w-full lg:w-48 h-32 lg:h-auto bg-ink-100 flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="text-xs text-muted uppercase">Wine Photo</p>
                    </div>
                  </div>

                  {/* Wine Details */}
                  <div className="flex-1 p-6 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted">{item.region} • {item.vintage}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold">£{item.price}</p>
                        <p className="text-xs text-muted">× {item.quantity}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="capitalize">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-lg bg-ink-50">
                      <Info className="h-4 w-4 text-muted mt-0.5 shrink-0" />
                      <p className="text-sm text-muted">{item.rationale}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        Swap Wine
                      </Button>
                      <Button variant="outline" size="sm">
                        Ask AI About This
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Actions */}
      <Card className="bg-ink-50 border-dashed">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-medium">Ready to proceed?</p>
              <p className="text-sm text-muted">
                Your AM will review and may suggest adjustments
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Request AM Call
              </Button>
              <Button
                onClick={handleSendToAM}
                className="bg-bbr-burgundy hover:bg-bbr-burgundy-light"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to AM
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-ink-900 px-6 py-3 text-sm text-white shadow-lg animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Chat Panel */}
      <ChatPanel />
    </div>
  );
}
