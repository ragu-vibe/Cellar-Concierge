'use client';

import { useRouter } from 'next/navigation';
import { Wine, Gem, Users, Calendar, Phone, ArrowRight, Sparkles, Lock, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDemoStore } from '@/lib/store/demoStore';

export default function HomePage() {
  const router = useRouter();
  const setShowOnboarding = useDemoStore((state) => state.setShowOnboarding);
  const hasCompletedOnboarding = useDemoStore((state) => state.hasCompletedOnboarding);

  const handleGetStarted = () => {
    if (hasCompletedOnboarding) {
      router.push('/dashboard');
    } else {
      setShowOnboarding(true);
    }
  };

  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="relative">
        <div className="hero-gradient rounded-3xl border border-border p-12 md:p-16 shadow-soft">
          <div className="max-w-3xl space-y-8">
            {/* Eyebrow */}
            <p className="text-sm uppercase tracking-[0.3em] text-bbr-burgundy font-medium">
              Cellar Concierge
            </p>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
                Your personal wine curator, at your service
              </h1>
              <p className="text-xl text-muted max-w-2xl leading-relaxed">
                A dedicated Account Manager who understands not just what you drink, but why you collect. Building your cellar with intention, access, and expertise.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-bbr-burgundy hover:bg-bbr-burgundy-light text-base px-8"
              >
                {hasCompletedOnboarding ? 'View Your Cellar' : 'Begin Your Consultation'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="text-base"
              >
                Discover the Service
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Every Collection Tells a Story */}
      <section className="space-y-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            Every collection tells a story
          </h2>
          <p className="text-muted text-lg">
            Whether you're building for legacy, seeking allocation to rare bottlings, or curating for milestone occasions—your Account Manager crafts each recommendation around what matters most to you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-t-4 border-t-bbr-burgundy">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-bbr-burgundy/10">
                <LineChart className="h-5 w-5 text-bbr-burgundy" />
              </div>
              <h3 className="font-semibold text-lg">Investment & Legacy</h3>
              <p className="text-sm text-muted">
                Fine wine as a considered asset. Build a collection that appreciates—and means something.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-bbr-gold">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-bbr-gold/10">
                <Sparkles className="h-5 w-5 text-bbr-gold" />
              </div>
              <h3 className="font-semibold text-lg">Occasions & Entertaining</h3>
              <p className="text-sm text-muted">
                The perfect bottle for every milestone. Dinners, celebrations, gifts that leave an impression.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-600">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100">
                <Lock className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Access & Allocation</h3>
              <p className="text-sm text-muted">
                Doors open to limited releases and coveted allocations. Reserved for those who collect with purpose.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-violet-600">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-100">
                <Gem className="h-5 w-5 text-violet-600" />
              </div>
              <h3 className="font-semibold text-lg">Personal Provenance</h3>
              <p className="text-sm text-muted">
                Your cellar, your story. Every bottle sourced and stored with impeccable provenance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Your Journey */}
      <section className="space-y-10">
        <div className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Your Journey</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            From conversation to collection
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bbr-burgundy text-white font-semibold">
                1
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">A Conversation</h3>
                <p className="text-muted">
                  Your Account Manager learns your goals—investment horizons, drinking occasions, and the stories you want your cellar to tell.
                </p>
              </div>
            </div>
            <div className="hidden md:block absolute top-5 left-[calc(100%-2rem)] w-8 border-t-2 border-dashed border-ink-200" />
          </div>

          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bbr-burgundy text-white font-semibold">
                2
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Monthly Curation</h3>
                <p className="text-muted">
                  Each month, a personally selected proposal arrives—wines matched to your priorities, budget, and evolving collection.
                </p>
              </div>
            </div>
            <div className="hidden md:block absolute top-5 left-[calc(100%-2rem)] w-8 border-t-2 border-dashed border-ink-200" />
          </div>

          <div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bbr-burgundy text-white font-semibold">
                3
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">An Ongoing Partnership</h3>
                <p className="text-muted">
                  As your collection grows, so does our understanding. Your Account Manager refines recommendations over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete View of Your Collection */}
      <section className="bg-ink-50 rounded-3xl p-12 space-y-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            A complete view of your collection
          </h2>
          <p className="text-muted text-lg">
            Track every bottle, understand drinking windows, and when you're ready to part with something special, your Account Manager facilitates discreet resale.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          <div className="flex items-start gap-3 p-4">
            <Wine className="h-5 w-5 text-bbr-burgundy mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Portfolio Tracking</p>
              <p className="text-sm text-muted">Every bottle, current value, and provenance at a glance</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4">
            <Calendar className="h-5 w-5 text-bbr-burgundy mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Drinking Windows</p>
              <p className="text-sm text-muted">Know when each wine reaches its peak</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4">
            <LineChart className="h-5 w-5 text-bbr-burgundy mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Resale Facilitation</p>
              <p className="text-sm text-muted">Discrete exit when your plans change</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink-900 rounded-3xl p-12 text-white text-center space-y-8">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="font-display text-3xl">Begin your cellar journey</h2>
          <p className="text-ink-300">
            Whether you're starting fresh or refining an existing collection, your dedicated Account Manager is ready to help.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-ink-900 hover:bg-ink-100"
          >
            {hasCompletedOnboarding ? 'Continue to Your Cellar' : 'Start Your Consultation'}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-ink-400 pt-4">
          <Phone className="h-4 w-4" />
          <span className="text-sm">Or call +44 (0)20 7396 9600</span>
        </div>
      </section>
    </div>
  );
}
