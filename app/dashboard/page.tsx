'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, TrendingUp, Wine, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CellarHealthScoreCard } from '@/components/shared/CellarHealthScoreCard';
import { BudgetBar } from '@/components/shared/BudgetBar';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { useDemoStore } from '@/lib/store/demoStore';
import { mockPortfolioSummary } from '@/lib/ai/simulatedAi';
import { WelcomeMessage } from '@/components/chat/WelcomeMessage';

export default function DashboardPage() {
  const router = useRouter();
  const plan = useDemoStore((state) => state.plan);
  const accountManager = useDemoStore((state) => state.accountManager);
  const portfolio = useDemoStore((state) => state.portfolio);
  const member = useDemoStore((state) => state.member);
  const gamificationEnabled = useDemoStore((state) => state.gamificationEnabled);
  const justCompletedOnboarding = useDemoStore((state) => state.justCompletedOnboarding);
  const setJustCompletedOnboarding = useDemoStore((state) => state.setJustCompletedOnboarding);
  const addChatMessage = useDemoStore((state) => state.addChatMessage);

  const totalSpent = plan.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalBottles = portfolio.reduce((acc, item) => acc + item.bottles, 0);
  const totalSpend = portfolio.reduce((acc, item) => acc + item.purchasePrice, 0);
  const totalValue = portfolio.reduce((acc, item) => acc + item.indicativeValue, 0);
  const gainPercent = ((totalValue - totalSpend) / totalSpend * 100).toFixed(1);

  const startChat = () => {
    setJustCompletedOnboarding(false);
    addChatMessage({
      sender: 'ai',
      content: `Thanks for completing your profile, ${member.name}. I see you have a balanced risk profile with a focus on investment. Let's find some wines that fit.`
    });
  };

  if (justCompletedOnboarding) {
    return <WelcomeMessage startChat={startChat} />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="hero-gradient rounded-3xl border border-border p-8 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">December 2024</p>
            <h1 className="font-display text-3xl md:text-4xl text-foreground">
              Welcome back, {member.name.split(' ')[0]}
            </h1>
            <p className="text-muted max-w-xl">
              Your cellar is growing nicely. This month's allocation is ready for your review.
            </p>
          </div>
          <StatusBadge status={plan.status} />
        </div>
      </section>

      {/* Three Column Layout */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Plan Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-bbr-burgundy" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">This Month's Plan</CardTitle>
              <Badge variant="secondary">{plan.month}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">{plan.items.length} bottles selected</span>
                <span className="font-medium">£{totalSpent} of £{plan.budget}</span>
              </div>
              <BudgetBar budget={plan.budget} spent={totalSpent} />
            </div>
            <Button
              onClick={() => router.push('/plan')}
              className="w-full bg-bbr-burgundy hover:bg-bbr-burgundy-light"
            >
              Review Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* AM Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-bbr-gold" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Curated With</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100">
                <User className="h-6 w-6 text-muted" />
              </div>
              <div>
                <p className="font-medium text-foreground">{accountManager.name}</p>
                <p className="text-xs text-muted">Account Manager, BBR</p>
              </div>
            </div>
            <blockquote className="am-quote">
              "{plan.amNote}"
            </blockquote>
            <Button variant="outline" className="w-full" onClick={() => router.push('/messages')}>
              Message {accountManager.name.split(' ')[0]}
            </Button>
          </CardContent>
        </Card>

        {/* Portfolio Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-ink-400" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Your Portfolio</CardTitle>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+{gainPercent}%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase text-muted">Bottles</p>
                <p className="text-2xl font-semibold text-foreground">{totalBottles}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted">Value</p>
                <p className="text-2xl font-semibold text-foreground">£{totalValue.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-muted">Indicative only. Not investment advice.</p>
            <Button variant="outline" className="w-full" onClick={() => router.push('/portfolio')}>
              View Portfolio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Second Row */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Gamification Card */}
        {gamificationEnabled && (
          <CellarHealthScoreCard
            score={mockPortfolioSummary.healthScore}
            milestones={mockPortfolioSummary.milestones}
            streak={mockPortfolioSummary.streak}
          />
        )}

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wine className="h-5 w-5 text-bbr-burgundy" />
              Cellar Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-ink-50">
              <div className="h-2 w-2 rounded-full bg-bbr-gold" />
              <div>
                <p className="text-sm font-medium">Next unlock</p>
                <p className="text-xs text-muted">Allocation heads-up briefing</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Rhône Explorer</Badge>
              <Badge variant="outline">Vintage Planner</Badge>
              <Badge variant="outline">Dinner Party Ready</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-bbr-burgundy" />
              Drink Windows
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Ready to drink</span>
                <span className="font-medium text-green-600">4 bottles</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Approaching peak</span>
                <span className="font-medium text-amber-600">2 bottles</span>
              </div>
              .
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Cellar for 3+ years</span>
                <span className="font-medium text-muted">12 bottles</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => router.push('/portfolio')}>
              See All Windows
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Chat Panel */}
      <ChatPanel />
    </div>
  );
}
