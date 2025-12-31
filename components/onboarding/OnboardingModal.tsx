'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Wine, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoStore, MotivationWeights, RiskProfile, TimeHorizon, BudgetStrategy, RegionalFocus, CollectorProfile } from '@/lib/store/demoStore';
import { cn } from '@/lib/utils';

// Question types
type BinaryQuestion = {
  type: 'binary';
  id: string;
  title: string;
  optionA: { label: string; description: string };
  optionB: { label: string; description: string };
};

type MultiQuestion = {
  type: 'multi';
  id: string;
  title: string;
  options: Array<{ id: string; label: string; description: string }>;
};

type Question = BinaryQuestion | MultiQuestion;

// All 10 CBC questions
const questions: Question[] = [
  {
    type: 'binary',
    id: 'q1_investment_consumption',
    title: 'You have £250 to spend this month. Which would you prefer?',
    optionA: {
      label: '2 bottles likely to double in value over 5 years',
      description: "Won't be ready to drink for 10+ years"
    },
    optionB: {
      label: '6 bottles drinking beautifully now',
      description: 'Unlikely to appreciate significantly'
    }
  },
  {
    type: 'binary',
    id: 'q2_depth_breadth',
    title: 'Building your collection, would you rather:',
    optionA: {
      label: 'Own 3 bottles each from 10 different producers',
      description: 'Breadth, exploration, flexibility'
    },
    optionB: {
      label: 'Own 10 bottles each from 3 producers you love',
      description: 'Depth, expertise, verticals'
    }
  },
  {
    type: 'binary',
    id: 'q3_recognition_discovery',
    title: 'For an important dinner party, which matters more:',
    optionA: {
      label: 'A wine your guests will recognize and be impressed by',
      description: 'Prestige label, established name'
    },
    optionB: {
      label: "A wine they've never heard of but will absolutely love",
      description: 'Hidden gem, your personal discovery'
    }
  },
  {
    type: 'binary',
    id: 'q4_certainty_upside',
    title: 'Two investment approaches—which appeals more:',
    optionA: {
      label: 'A proven First Growth with steady 5% annual appreciation',
      description: 'Reliable, liquid, predictable'
    },
    optionB: {
      label: 'An emerging producer that might 10x or go nowhere',
      description: 'High risk, high potential reward'
    }
  },
  {
    type: 'binary',
    id: 'q5_liquidity_return',
    title: 'If you needed to sell from your cellar:',
    optionA: {
      label: 'A wine that sells within days at a modest profit',
      description: 'Liquid, easy exit'
    },
    optionB: {
      label: 'A wine that takes months to sell but at 3x your cost',
      description: 'Patient, maximum return'
    }
  },
  {
    type: 'multi',
    id: 'q6_drinking_timeline',
    title: 'For wines purchased today, when would you ideally drink them?',
    options: [
      { id: 'short', label: 'Ready within 1-2 years', description: 'Immediate enjoyment' },
      { id: 'medium', label: 'Peak drinking in 5-7 years', description: 'Medium-term cellaring' },
      { id: 'long', label: 'Best after 10+ years', description: 'Long-term investment' },
      { id: 'mix', label: 'A mix across all time horizons', description: 'Balanced approach' }
    ]
  },
  {
    type: 'binary',
    id: 'q7_regional_strategy',
    title: "For your cellar's character, would you rather:",
    optionA: {
      label: 'Deep expertise in one region',
      description: 'Become known for your Burgundy/Bordeaux/etc. collection'
    },
    optionB: {
      label: 'Broad coverage across all major regions',
      description: 'Something perfect for every occasion'
    }
  },
  {
    type: 'multi',
    id: 'q8_budget_split',
    title: 'How would you prefer to spend your £250 this month?',
    options: [
      { id: 'trophy', label: 'One exceptional £200 bottle + one £50 bottle', description: 'Trophy acquisition' },
      { id: 'balanced', label: 'Two very good £125 bottles', description: 'Quality balance' },
      { id: 'volume', label: 'Five solid £50 bottles', description: 'Volume and variety' }
    ]
  },
  {
    type: 'multi',
    id: 'q9_decision_inputs',
    title: 'When selecting wines, which input matters most to you?',
    options: [
      { id: 'data', label: 'Critic scores and market performance data', description: 'Objective metrics' },
      { id: 'personal', label: 'Your personal taste and past preferences', description: 'Subjective experience' },
      { id: 'am', label: "Your Account Manager's recommendations", description: 'Expert guidance' },
      { id: 'opportunity', label: "Opportunity—what's available now that won't be later", description: 'Scarcity-driven' }
    ]
  },
  {
    type: 'multi',
    id: 'q10_vision',
    title: 'In 10 years, your ideal cellar will be:',
    options: [
      { id: 'consumed', label: 'Entirely consumed', description: 'Every bottle enjoyed' },
      { id: 'sold', label: 'Sold at profit', description: 'Investment returns realized' },
      { id: 'mixed', label: 'Mixed—some drunk, some sold, some holding', description: 'Balanced outcome' },
      { id: 'legacy', label: 'Passed to heirs', description: 'Legacy asset' }
    ]
  }
];

// Scoring logic for each question
function calculateProfile(answers: Record<string, string>): CollectorProfile {
  // Initialize scores
  const scores = {
    investment: 0,
    portfolio_building: 0,
    future_drinking: 0,
    status_gifting: 0,
    exploration: 0,
    legacy: 0
  };

  let riskScore = 0; // -100 to +100, negative = conservative, positive = aggressive
  let timeScore = 0; // -100 to +100, negative = short, positive = long
  let budgetStrategy: BudgetStrategy = 'balanced';
  let regionalFocus: RegionalFocus = 'breadth';

  // Q1: Investment vs. Consumption
  if (answers.q1_investment_consumption === 'A') {
    scores.investment += 40;
    scores.portfolio_building += 10;
  } else {
    scores.future_drinking += 40;
    scores.exploration += 10;
  }

  // Q2: Depth vs. Breadth
  if (answers.q2_depth_breadth === 'A') {
    scores.exploration += 30;
    scores.portfolio_building += 20;
  } else {
    scores.portfolio_building += 30;
    scores.investment += 20;
  }

  // Q3: Recognition vs. Discovery
  if (answers.q3_recognition_discovery === 'A') {
    scores.status_gifting += 35;
    scores.legacy += 15;
  } else {
    scores.exploration += 35;
    scores.future_drinking += 15;
  }

  // Q4: Certainty vs. Upside
  if (answers.q4_certainty_upside === 'A') {
    riskScore -= 40;
  } else {
    riskScore += 40;
  }

  // Q5: Liquidity vs. Return
  if (answers.q5_liquidity_return === 'A') {
    riskScore -= 20;
    timeScore -= 20;
  } else {
    riskScore += 20;
    timeScore += 30;
  }

  // Q6: Drinking Timeline
  switch (answers.q6_drinking_timeline) {
    case 'short':
      scores.future_drinking += 50;
      timeScore -= 40;
      break;
    case 'medium':
      scores.future_drinking += 30;
      scores.portfolio_building += 20;
      break;
    case 'long':
      scores.investment += 50;
      timeScore += 40;
      break;
    case 'mix':
      scores.future_drinking += 25;
      scores.investment += 25;
      break;
  }

  // Q7: Regional Strategy
  if (answers.q7_regional_strategy === 'A') {
    scores.portfolio_building += 40;
    scores.investment += 10;
    regionalFocus = 'depth';
  } else {
    scores.portfolio_building += 40;
    scores.exploration += 10;
    regionalFocus = 'breadth';
  }

  // Q8: Budget Split
  switch (answers.q8_budget_split) {
    case 'trophy':
      scores.status_gifting += 35;
      scores.investment += 15;
      budgetStrategy = 'trophy';
      break;
    case 'balanced':
      scores.portfolio_building += 30;
      scores.future_drinking += 20;
      budgetStrategy = 'balanced';
      break;
    case 'volume':
      scores.exploration += 30;
      scores.future_drinking += 20;
      budgetStrategy = 'volume';
      break;
  }

  // Q9: Decision Inputs
  switch (answers.q9_decision_inputs) {
    case 'data':
      scores.investment += 40;
      break;
    case 'personal':
      scores.future_drinking += 40;
      break;
    case 'am':
      scores.portfolio_building += 25;
      scores.status_gifting += 15;
      break;
    case 'opportunity':
      scores.exploration += 30;
      scores.investment += 10;
      break;
  }

  // Q10: 10-Year Vision
  switch (answers.q10_vision) {
    case 'consumed':
      scores.future_drinking += 50;
      break;
    case 'sold':
      scores.investment += 50;
      break;
    case 'mixed':
      scores.investment += 25;
      scores.future_drinking += 25;
      break;
    case 'legacy':
      scores.legacy += 40;
      scores.investment += 10;
      break;
  }

  // Normalize motivations to percentages (should sum to 100)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const motivations: MotivationWeights = {
    investment: Math.round((scores.investment / totalScore) * 100),
    portfolio_building: Math.round((scores.portfolio_building / totalScore) * 100),
    future_drinking: Math.round((scores.future_drinking / totalScore) * 100),
    status_gifting: Math.round((scores.status_gifting / totalScore) * 100),
    exploration: Math.round((scores.exploration / totalScore) * 100),
    legacy: Math.round((scores.legacy / totalScore) * 100)
  };

  // Determine risk profile
  let riskProfile: RiskProfile;
  if (riskScore <= -20) {
    riskProfile = 'conservative';
  } else if (riskScore >= 20) {
    riskProfile = 'aggressive';
  } else {
    riskProfile = 'balanced';
  }

  // Determine time horizon
  let timeHorizon: TimeHorizon;
  if (timeScore <= -20) {
    timeHorizon = 'short';
  } else if (timeScore >= 20) {
    timeHorizon = 'long';
  } else {
    timeHorizon = 'medium';
  }

  return {
    motivations,
    riskProfile,
    timeHorizon,
    budgetStrategy,
    regionalFocus
  };
}

// Progress indicator component
function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            i < current
              ? 'w-6 bg-bbr-burgundy'
              : i === current
              ? 'w-6 bg-bbr-burgundy/50'
              : 'w-1.5 bg-ink-200'
          )}
        />
      ))}
    </div>
  );
}

// Option card component
function OptionCard({
  selected,
  onClick,
  label,
  description,
  optionLetter
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  description: string;
  optionLetter?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-5 rounded-xl border-2 transition-all duration-200',
        'hover:border-bbr-burgundy/50 hover:shadow-md',
        selected
          ? 'border-bbr-burgundy bg-bbr-burgundy/5 shadow-md'
          : 'border-ink-200 bg-white'
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors',
            selected
              ? 'border-bbr-burgundy bg-bbr-burgundy'
              : 'border-ink-300'
          )}
        >
          {selected && <Check className="h-3.5 w-3.5 text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium leading-snug',
            selected ? 'text-bbr-burgundy' : 'text-foreground'
          )}>
            {label}
          </p>
          <p className="text-sm text-muted mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
}

// Profile display component
function ProfileDisplay({ profile }: { profile: CollectorProfile }) {
  const sortedMotivations = Object.entries(profile.motivations)
    .sort(([, a], [, b]) => b - a);

  const motivationLabels: Record<keyof MotivationWeights, string> = {
    investment: 'Investment & Appreciation',
    portfolio_building: 'Portfolio Building',
    future_drinking: 'Future Drinking',
    status_gifting: 'Status & Gifting',
    exploration: 'Exploration & Discovery',
    legacy: 'Legacy Planning'
  };

  const riskLabels: Record<RiskProfile, string> = {
    conservative: 'Conservative',
    balanced: 'Balanced',
    aggressive: 'Aggressive'
  };

  const timeLabels: Record<TimeHorizon, string> = {
    short: '1-3 years',
    medium: '5-10 years',
    long: '10+ years'
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted mb-3 uppercase tracking-wide">Motivation Weights</h3>
        <div className="space-y-2">
          {sortedMotivations.map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">
                    {motivationLabels[key as keyof MotivationWeights]}
                  </span>
                  <span className="text-sm text-muted">{value}%</span>
                </div>
                <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-bbr-burgundy rounded-full transition-all duration-500"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-ink-50">
          <p className="text-xs text-muted uppercase tracking-wide">Risk Profile</p>
          <p className="font-medium mt-1">{riskLabels[profile.riskProfile]}</p>
        </div>
        <div className="p-4 rounded-xl bg-ink-50">
          <p className="text-xs text-muted uppercase tracking-wide">Time Horizon</p>
          <p className="font-medium mt-1">{timeLabels[profile.timeHorizon]}</p>
        </div>
        <div className="p-4 rounded-xl bg-ink-50">
          <p className="text-xs text-muted uppercase tracking-wide">Budget Strategy</p>
          <p className="font-medium mt-1 capitalize">{profile.budgetStrategy}</p>
        </div>
        <div className="p-4 rounded-xl bg-ink-50">
          <p className="text-xs text-muted uppercase tracking-wide">Regional Focus</p>
          <p className="font-medium mt-1 capitalize">{profile.regionalFocus}</p>
        </div>
      </div>
    </div>
  );
}

export function OnboardingModal() {
  const showOnboarding = useDemoStore((state) => state.showOnboarding);
  const setShowOnboarding = useDemoStore((state) => state.setShowOnboarding);
  const setHasCompletedOnboarding = useDemoStore((state) => state.setHasCompletedOnboarding);
  const setJustCompletedOnboarding = useDemoStore((state) => state.setJustCompletedOnboarding);
  const updateCollectorProfile = useDemoStore((state) => state.updateCollectorProfile);

  const [step, setStep] = useState(0); // 0 = welcome, 1-10 = questions, 11 = summary
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Track time spent on each question (could be used for analytics)
  useEffect(() => {
    setStartTime(Date.now());
  }, [step]);

  if (!showOnboarding) return null;

  const totalSteps = questions.length + 2; // welcome + questions + summary
  const isWelcome = step === 0;
  const isSummary = step === questions.length + 1;
  const currentQuestion = !isWelcome && !isSummary ? questions[step - 1] : null;

  const canProceed = isWelcome || isSummary || (currentQuestion && answers[currentQuestion.id]);

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Calculate and save profile
      const profile = calculateProfile(answers);
      updateCollectorProfile(profile);
      setHasCompletedOnboarding(true);
      setJustCompletedOnboarding(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleClose = () => {
    setShowOnboarding(false);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const calculatedProfile = isSummary ? calculateProfile(answers) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-ink-100 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-muted" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Welcome Step */}
          {isWelcome && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-2xl bg-bbr-burgundy flex items-center justify-center">
                  <Wine className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="font-display text-2xl text-foreground">
                  Let's understand your collecting style
                </h2>
                <p className="text-muted max-w-md mx-auto">
                  Ten quick questions to help your Account Manager curate wines that truly match your goals—not just your palate.
                </p>
              </div>
              <div className="pt-4 text-sm text-muted">
                This takes about 2 minutes
              </div>
            </div>
          )}

          {/* Question Steps */}
          {currentQuestion && (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-muted">Question {step} of {questions.length}</p>
                <h2 className="font-display text-xl text-foreground leading-snug">
                  {currentQuestion.title}
                </h2>
              </div>

              <div className="space-y-3 py-2">
                {currentQuestion.type === 'binary' ? (
                  <>
                    <OptionCard
                      selected={answers[currentQuestion.id] === 'A'}
                      onClick={() => handleAnswer(currentQuestion.id, 'A')}
                      label={currentQuestion.optionA.label}
                      description={currentQuestion.optionA.description}
                    />
                    <OptionCard
                      selected={answers[currentQuestion.id] === 'B'}
                      onClick={() => handleAnswer(currentQuestion.id, 'B')}
                      label={currentQuestion.optionB.label}
                      description={currentQuestion.optionB.description}
                    />
                  </>
                ) : (
                  currentQuestion.options.map((option) => (
                    <OptionCard
                      key={option.id}
                      selected={answers[currentQuestion.id] === option.id}
                      onClick={() => handleAnswer(currentQuestion.id, option.id)}
                      label={option.label}
                      description={option.description}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Summary Step */}
          {isSummary && calculatedProfile && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="font-display text-xl text-foreground">Your Collector Profile</h2>
                <p className="text-sm text-muted">
                  Your Account Manager will use this to curate wines that match your priorities
                </p>
              </div>
              <ProfileDisplay profile={calculatedProfile} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border p-4 bg-ink-50">
          <ProgressIndicator current={step} total={totalSteps} />
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={handleBack} size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              size="sm"
              className={cn(
                'bg-bbr-burgundy hover:bg-bbr-burgundy-light',
                !canProceed && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSummary ? 'Start Planning' : 'Continue'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
