import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Cellar Concierge</p>
          <h1 className="text-4xl font-semibold tracking-tight text-primary">
            Curated fine-wine planning, shaped by your motives and guided by your Account Manager.
          </h1>
          <p className="text-muted">
            Craft plans that reflect scarcity, prestige, and cellar strategy — while staying grounded in budget, drink
            windows, and gifting moments.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/onboarding">Start onboarding</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">View dashboard</Link>
            </Button>
          </div>
        </div>
        <Card className="glass">
          <CardContent className="space-y-4 p-8">
            <p className="text-xs uppercase text-muted">What feels premium</p>
            <ul className="space-y-2 text-sm text-muted">
              <li>• AI drafts + AM curation built into every step.</li>
              <li>• Motive-driven recommendations, not taste-first sorting.</li>
              <li>• Clear compliance language and cellar health insights.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
