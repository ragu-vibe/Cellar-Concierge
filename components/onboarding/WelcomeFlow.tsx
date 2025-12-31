'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Wine, MessageCircle, User, ArrowRight, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDemoStore } from '@/lib/store/demoStore';
import { inventory } from '@/data/inventory';
import { cn } from '@/lib/utils';

/**
 * WelcomeFlow - Shown after onboarding completion
 *
 * This component:
 * 1. Shows a personalized welcome message based on their profile
 * 2. Displays 3 initial wine recommendations
 * 3. Introduces the Account Manager
 * 4. Opens chat with a personalized greeting
 */

// Get top wines based on profile (simplified scoring)
function getRecommendedWines(profile: {
  splitNow: number;
  splitMid: number;
  splitLong: number;
  regions: string[];
  budget: number;
}, count: number = 3) {
  // Score each wine based on profile match
  const scored = inventory.map((wine) => {
    let score = 0;

    // Drink window matching
    const yearsUntilReady = wine.drink_window_start - 2024;
    if (profile.splitNow > 0.4 && yearsUntilReady <= 2) score += 20;
    if (profile.splitMid > 0.3 && yearsUntilReady >= 2 && yearsUntilReady <= 10) score += 15;
    if (profile.splitLong > 0.3 && yearsUntilReady > 10) score += 15;

    // Region match
    if (profile.regions.some((r) => wine.region.toLowerCase().includes(r.toLowerCase()))) {
      score += 25;
    }

    // Price fit (prefer wines in the sweet spot of their budget)
    const avgBottlePrice = profile.budget / 4;
    const priceDiff = Math.abs(wine.price_gbp - avgBottlePrice);
    score += Math.max(0, 20 - priceDiff / 5);

    // Availability bonus
    if (wine.availability > 80) score += 10;

    // Critic signal
    if (wine.critic_signal >= 92) score += 10;

    return { wine, score };
  });

  // Sort by score and return top N
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.wine);
}

export function WelcomeFlow() {
  const router = useRouter();
  const justCompletedOnboarding = useDemoStore((s) => s.justCompletedOnboarding);
  const setJustCompletedOnboarding = useDemoStore((s) => s.setJustCompletedOnboarding);
  const setChatOpen = useDemoStore((s) => s.setChatOpen);
  const addChatMessage = useDemoStore((s) => s.addChatMessage);
  const member = useDemoStore((s) => s.member);
  const accountManager = useDemoStore((s) => s.accountManager);
  const cellarProfile = useDemoStore((s) => s.cellarProfile);

  const [step, setStep] = useState<'welcome' | 'recommendations' | 'am_intro'>('welcome');
  const [isVisible, setIsVisible] = useState(false);

  // Get recommended wines based on profile
  const recommendedWines = useMemo(() => {
    const profile = {
      splitNow: member.collectorProfile?.motivations.future_drinking / 100 || 0.3,
      splitMid: 0.35,
      splitLong: member.collectorProfile?.motivations.investment / 100 || 0.35,
      regions: cellarProfile?.themes.regions || ['bordeaux', 'burgundy'],
      budget: member.constraints.budget,
    };
    return getRecommendedWines(profile);
  }, [member, cellarProfile]);

  useEffect(() => {
    if (justCompletedOnboarding) {
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [justCompletedOnboarding]);

  if (!justCompletedOnboarding || !isVisible) return null;

  const handleContinue = () => {
    if (step === 'welcome') {
      setStep('recommendations');
    } else if (step === 'recommendations') {
      setStep('am_intro');
    } else {
      // Final step - open chat with personalized greeting
      const greeting = generatePersonalizedGreeting(member.name, accountManager.name);
      addChatMessage({
        sender: 'ai',
        content: greeting,
      });

      setJustCompletedOnboarding(false);
      setChatOpen(true);
      router.push('/dashboard');
    }
  };

  const handleSkipToChat = () => {
    const greeting = generatePersonalizedGreeting(member.name, accountManager.name);
    addChatMessage({
      sender: 'ai',
      content: greeting,
    });

    setJustCompletedOnboarding(false);
    setChatOpen(true);
    router.push('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={cn(
          'relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500',
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {/* Step: Welcome */}
        {step === 'welcome' && (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-bbr-burgundy/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-bbr-burgundy" />
                </div>
              </div>
              <h2 className="font-display text-2xl">
                Welcome to Cellar Concierge, {member.name.split(' ')[0]}
              </h2>
              <p className="text-muted max-w-md mx-auto">
                Based on what you've shared, we've got a clear picture of your collecting goals.
                Here's what happens next.
              </p>
            </div>

            <div className="grid gap-4 py-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-ink-50">
                <div className="h-10 w-10 rounded-lg bg-bbr-burgundy/10 flex items-center justify-center shrink-0">
                  <Wine className="h-5 w-5 text-bbr-burgundy" />
                </div>
                <div>
                  <p className="font-medium">Personalized selections</p>
                  <p className="text-sm text-muted">
                    We'll curate wines that match your priorities—not just your palate.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-ink-50">
                <div className="h-10 w-10 rounded-lg bg-bbr-burgundy/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-bbr-burgundy" />
                </div>
                <div>
                  <p className="font-medium">Monthly plans</p>
                  <p className="text-sm text-muted">
                    Each month, you'll receive a £{member.constraints.budget} proposal tailored to your goals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-ink-50">
                <div className="h-10 w-10 rounded-lg bg-bbr-burgundy/10 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-bbr-burgundy" />
                </div>
                <div>
                  <p className="font-medium">Account Manager review</p>
                  <p className="text-sm text-muted">
                    {accountManager.name} reviews every selection before it reaches you.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleContinue} className="bg-bbr-burgundy hover:bg-bbr-burgundy-light">
                See wines we'd recommend
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Recommendations */}
        {step === 'recommendations' && (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl">Wines we think you'll love</h2>
              <p className="text-muted">Based on your profile, here are three to start the conversation.</p>
            </div>

            <div className="space-y-4">
              {recommendedWines.map((wine, index) => (
                <Card key={wine.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{wine.name}</p>
                        <p className="text-sm text-muted">{wine.producer} · {wine.region}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {wine.drink_window_start}-{wine.drink_window_end}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {wine.critic_signal} pts
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-bbr-burgundy">£{wine.price_gbp}</p>
                        <p className="text-xs text-muted capitalize">{wine.scarcity_level} availability</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted mt-3 pt-3 border-t border-border">
                      {getWineRationale(wine, member.collectorProfile)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={handleSkipToChat}>
                Discuss in chat
              </Button>
              <Button onClick={handleContinue} className="bg-bbr-burgundy hover:bg-bbr-burgundy-light">
                Meet your Account Manager
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: AM Introduction */}
        {step === 'am_intro' && (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-bbr-burgundy to-bbr-burgundy-light flex items-center justify-center text-white text-2xl font-display">
                  {accountManager.name.split(' ').map((n) => n[0]).join('')}
                </div>
              </div>
              <div>
                <h2 className="font-display text-2xl">{accountManager.name}</h2>
                <p className="text-muted">Your dedicated Account Manager</p>
              </div>
            </div>

            <div className="p-6 bg-ink-50 rounded-xl space-y-4">
              <p className="text-center">
                "{member.name.split(' ')[0]}, I've reviewed your preferences and I'm excited to help you build
                a collection that truly reflects your goals. I specialize in {accountManager.specialties.slice(0, 2).join(' and ')},
                and I'll personally review every recommendation before it reaches you."
              </p>
              <p className="text-sm text-muted text-center">
                — {accountManager.name}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-center">Specialties</p>
              <div className="flex flex-wrap justify-center gap-2">
                {accountManager.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-white border border-border rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleContinue} className="bg-bbr-burgundy hover:bg-bbr-burgundy-light">
                <MessageCircle className="mr-2 h-4 w-4" />
                Start the conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function generatePersonalizedGreeting(memberName: string, amName: string): string {
  const firstName = memberName.split(' ')[0];
  return `Welcome, ${firstName}! I'm your Cellar Concierge assistant, working alongside ${amName} to curate wines that match your collecting goals.

Based on your profile, I can see you're interested in building a balanced collection with both drink-now enjoyment and long-term cellaring potential.

I've prepared some initial recommendations for you—you can see them in your dashboard. Would you like me to:

• **Explain the rationale** behind any of these selections
• **Suggest alternatives** in a different price range or region
• **Help plan** for a specific occasion or milestone

What would you like to explore first?`;
}

function getWineRationale(
  wine: (typeof inventory)[0],
  profile: { motivations: Record<string, number> } | undefined
): string {
  const motivations = profile?.motivations || {};
  const topMotives = Object.entries(motivations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k);

  const rationales: string[] = [];

  if (topMotives.includes('investment') && wine.scarcity_level === 'High') {
    rationales.push('strong secondary market appeal');
  }
  if (topMotives.includes('future_drinking') && wine.drink_window_start <= 2026) {
    rationales.push('ready to enjoy soon');
  }
  if (topMotives.includes('exploration') && wine.scarcity_level === 'Low') {
    rationales.push('excellent discovery value');
  }
  if (wine.critic_signal >= 93) {
    rationales.push(`critically acclaimed (${wine.critic_signal} pts)`);
  }

  if (rationales.length === 0) {
    rationales.push('matches your profile preferences');
  }

  return `Selected for ${rationales.join(', ')}. Drinking window ${wine.drink_window_start}-${wine.drink_window_end}.`;
}
