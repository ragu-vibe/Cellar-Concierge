'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, ChevronRight, ChevronLeft, Wine, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDemoStore } from '@/lib/store/demoStore';
import { cn } from '@/lib/utils';
import {
  PrimaryStrategy,
  OpenRateType,
  BottlePreference,
  SubstitutionTolerance,
  StorageNeed,
  CollectionStyle,
  MotiveWeights,
} from '@/lib/types/cellarProfile';
import { OnboardingAnswers, computeProfileFromAnswers } from '@/lib/scoring/profileScoring';

// ============================================================================
// SCREEN COPY & CONFIGURATION
// ============================================================================

const SCREENS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'strategy', title: 'Cellar Strategy' },
  { id: 'budget_split', title: 'Budget Split' },
  { id: 'cadence', title: 'Cadence & Volume' },
  { id: 'motives', title: 'Purchase Drivers' },
  { id: 'constraints', title: 'Guardrails' },
  { id: 'themes', title: 'Focus Areas' },
  { id: 'freetext', title: 'In Your Words' },
  { id: 'summary', title: 'Your Plan' },
  { id: 'finish', title: 'Ready' },
];

const STRATEGY_OPTIONS: { value: PrimaryStrategy; label: string; description: string }[] = [
  {
    value: 'drink_now_runway',
    label: 'A drink-now runway',
    description: "Bottles I'll love opening over the next 6–18 months — dinners, hosting, gifts.",
  },
  {
    value: 'cellar_for_future',
    label: 'A cellar for the future',
    description: 'Fewer, age-worthy bottles to open over 5–15+ years.',
  },
  {
    value: 'trophy_benchmarks',
    label: 'Trophy + benchmarks',
    description: 'Iconic producers and vintages, even if it means fewer bottles.',
  },
  {
    value: 'smart_value_discovery',
    label: 'Smart value + discovery',
    description: 'High quality-to-price picks and under-the-radar producers.',
  },
  {
    value: 'balanced_barbell',
    label: 'Balanced barbell',
    description: 'A mix of drink-now utility and long-term cellar building.',
  },
];

const CADENCE_OPTIONS: { value: OpenRateType; label: string }[] = [
  { value: 'two_per_month', label: 'About 2 bottles per month' },
  { value: 'one_per_month', label: 'About 1 bottle per month' },
  { value: 'eight_per_year', label: 'About 8 bottles per year' },
  { value: 'event_driven', label: 'Event-driven (holidays, dinners, celebrations)' },
  { value: 'not_sure', label: "Not sure — guide me" },
];

const BOTTLE_PREF_OPTIONS: { value: BottlePreference; label: string; description: string }[] = [
  { value: 'more_bottles', label: 'More bottles overall', description: 'Breadth + flexibility' },
  { value: 'fewer_better', label: 'Fewer, better bottles', description: 'Higher average quality' },
  { value: 'mix', label: 'A mix', description: 'Balance of both' },
];

const MOTIVE_ITEMS: { key: keyof MotiveWeights; label: string; description: string }[] = [
  { key: 'scarcity', label: 'Access / scarcity', description: 'Allocations, hard to find' },
  { key: 'provenance', label: 'Provenance / storage confidence', description: 'Chain of custody' },
  { key: 'prestige', label: 'Producer prestige', description: 'Iconic names' },
  { key: 'vintage_story', label: 'Vintage narrative', description: 'Great year, library release' },
  { key: 'value', label: 'Relative value', description: 'Good buying vs peers' },
  { key: 'planning', label: 'Cellar planning', description: 'Filling maturity gaps' },
  { key: 'entertaining', label: 'Entertaining / gifting', description: 'Hosting utility' },
  { key: 'discovery', label: 'Discovery / learning', description: 'New regions, producers' },
  { key: 'investment_curiosity', label: 'Investment curiosity', description: 'Resale liquidity*' },
];

const AVOID_TAGS = [
  'Heavy oak',
  'High alcohol',
  'Very sweet',
  'Very tannic',
  'Natural/funky',
  'Oxidative',
  'Smoky peat',
];

const REGIONS = [
  'Bordeaux',
  'Burgundy',
  'Rhône',
  'Champagne',
  'Tuscany',
  'Piedmont',
  'Rioja',
  'Napa',
  'Germany',
  'Austria',
  'Portugal',
  'New Zealand',
];

const COLLECTION_STYLES: { value: CollectionStyle; label: string }[] = [
  { value: 'verticals', label: 'Verticals (same producer across vintages)' },
  { value: 'horizontals', label: 'Horizontals (same vintage across producers)' },
  { value: 'producer_deep_dives', label: 'Producer deep-dives' },
  { value: 'broad_exploration', label: 'Broad exploration' },
  { value: 'no_preference', label: 'No preference' },
];

// ============================================================================
// COMPONENTS
// ============================================================================

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="h-1 bg-ink-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-bbr-burgundy transition-all duration-300"
        style={{ width: `${((current + 1) / total) * 100}%` }}
      />
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  label,
  description,
  disabled,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
        'hover:border-bbr-burgundy/50 hover:shadow-md',
        selected
          ? 'border-bbr-burgundy bg-bbr-burgundy/5 shadow-md'
          : 'border-ink-200 bg-white',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5',
            selected ? 'border-bbr-burgundy bg-bbr-burgundy' : 'border-ink-300'
          )}
        >
          {selected && <Check className="h-3 w-3 text-white" />}
        </div>
        <div>
          <p className={cn('font-medium', selected && 'text-bbr-burgundy')}>{label}</p>
          {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
        </div>
      </div>
    </button>
  );
}

function ChipSelector({
  options,
  selected,
  onToggle,
  multiSelect = true,
}: {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  multiSelect?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onToggle(option)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm border transition-colors',
            selected.includes(option)
              ? 'border-bbr-burgundy bg-bbr-burgundy/10 text-bbr-burgundy'
              : 'border-ink-200 bg-white text-muted hover:border-ink-300'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  label,
  leftLabel,
  rightLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="font-medium">{label}</span>
          <span className="text-muted">{value}%</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-ink-100 rounded-full appearance-none cursor-pointer accent-bbr-burgundy"
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-xs text-muted">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CellarPlanningModal() {
  const showOnboarding = useDemoStore((state) => state.showOnboarding);
  const setShowOnboarding = useDemoStore((state) => state.setShowOnboarding);
  const setHasCompletedOnboarding = useDemoStore((state) => state.setHasCompletedOnboarding);
  const setJustCompletedOnboarding = useDemoStore((state) => state.setJustCompletedOnboarding);
  const setChatOpen = useDemoStore((state) => state.setChatOpen);
  const member = useDemoStore((state) => state.member);

  const [step, setStep] = useState(0);

  // Form state
  const [strategy, setStrategy] = useState<PrimaryStrategy | null>(null);
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [splitNow, setSplitNow] = useState(25);
  const [splitMid, setSplitMid] = useState(35);
  const [splitLong, setSplitLong] = useState(40);
  const [openRate, setOpenRate] = useState<OpenRateType | null>(null);
  const [bottlePref, setBottlePref] = useState<BottlePreference | null>(null);
  const [motiveRankings, setMotiveRankings] = useState<{ most: string | null; least: string | null }[]>([
    { most: null, least: null },
    { most: null, least: null },
    { most: null, least: null },
  ]);
  const [currentMotiveRound, setCurrentMotiveRound] = useState(0);
  const [avoidTags, setAvoidTags] = useState<string[]>([]);
  const [wineVsSpirits, setWineVsSpirits] = useState(0);
  const [redVsWhite, setRedVsWhite] = useState(50);
  const [maxBottles, setMaxBottles] = useState<number | 'surprise_me'>(4);
  const [substitutionTolerance, setSubstitutionTolerance] = useState<SubstitutionTolerance>('flexible');
  const [storageNeed, setStorageNeed] = useState<StorageNeed>('not_sure');
  const [regions, setRegions] = useState<string[]>([]);
  const [collectionStyle, setCollectionStyle] = useState<CollectionStyle>('no_preference');
  const [freeText, setFreeText] = useState('');

  // Motive round items (shuffled)
  const motiveRounds = useMemo(() => {
    const shuffled = [...MOTIVE_ITEMS].sort(() => Math.random() - 0.5);
    return [
      shuffled.slice(0, 4),
      shuffled.slice(4, 8),
      [...shuffled.slice(8), shuffled[0]].slice(0, 4), // Pad if needed
    ];
  }, []);

  if (!showOnboarding) return null;

  const handleClose = () => setShowOnboarding(false);

  const canProceed = () => {
    switch (step) {
      case 0: return true; // Welcome
      case 1: return strategy !== null;
      case 2: return splitNow + splitMid + splitLong === 100;
      case 3: return openRate !== null && bottlePref !== null;
      case 4: {
        const currentRound = motiveRankings[currentMotiveRound];
        return currentRound?.most !== null && currentRound?.least !== null;
      }
      case 5: return true; // Constraints optional
      case 6: return true; // Themes optional
      case 7: return true; // Free text optional
      case 8: return true; // Summary
      case 9: return true; // Finish
      default: return true;
    }
  };

  const handleNext = () => {
    // Special handling for motive rounds
    if (step === 4 && currentMotiveRound < 2) {
      setCurrentMotiveRound(currentMotiveRound + 1);
      return;
    }

    if (step < SCREENS.length - 1) {
      setStep(step + 1);
      if (step === 4) setCurrentMotiveRound(0); // Reset for next visit
    } else {
      // Complete onboarding
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step === 4 && currentMotiveRound > 0) {
      setCurrentMotiveRound(currentMotiveRound - 1);
      return;
    }
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = () => {
    // Build answers object
    const answers: OnboardingAnswers = {
      primaryStrategy: strategy!,
      initialInvestmentGBP: initialInvestment,
      splitNow: splitNow / 100,
      splitMid: splitMid / 100,
      splitLong: splitLong / 100,
      openRateType: openRate!,
      avgBottlePreference: bottlePref!,
      maxDiffRounds: motiveRankings
        .filter((r) => r.most && r.least)
        .map((r, i) => ({
          shown: motiveRounds[i].map((m) => m.key),
          mostImportant: r.most as keyof MotiveWeights,
          leastImportant: r.least as keyof MotiveWeights,
        })),
      avoidTags: avoidTags.map((t) => t.toLowerCase().replace(/[^a-z]/g, '_')),
      wineVsSpiritsMix: wineVsSpirits / 100,
      redWhiteMix: redVsWhite / 100,
      maxBottlesPerMonth: maxBottles,
      substitutionTolerance,
      storageNeed,
      regions: regions.map((r) => r.toLowerCase()),
      collectionStyle,
      freeText,
      monthlyBudgetGBP: member.constraints.budget,
    };

    // Compute profile
    const profile = computeProfileFromAnswers(member.id, member.name, answers);

    // Save to store (simplified - in real app would save full profile)
    setHasCompletedOnboarding(true);
    setJustCompletedOnboarding(true);

    // Open chat with personalized greeting
    setTimeout(() => setChatOpen(true), 500);
  };

  const toggleAvoidTag = (tag: string) => {
    setAvoidTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleRegion = (region: string) => {
    setRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const applyBudgetPreset = (preset: 'drink_now' | 'balanced' | 'cellar') => {
    switch (preset) {
      case 'drink_now':
        setSplitNow(60);
        setSplitMid(30);
        setSplitLong(10);
        break;
      case 'balanced':
        setSplitNow(33);
        setSplitMid(34);
        setSplitLong(33);
        break;
      case 'cellar':
        setSplitNow(15);
        setSplitMid(35);
        setSplitLong(50);
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-ink-100 transition-colors"
        >
          <X className="h-5 w-5 text-muted" />
        </button>

        {/* Progress bar */}
        <ProgressBar current={step} total={SCREENS.length} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Screen 0: Welcome */}
          {step === 0 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-2xl bg-bbr-burgundy flex items-center justify-center">
                  <Wine className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="font-display text-2xl">Let's set up your cellar plan</h2>
                <p className="text-muted max-w-md mx-auto">
                  In about 3 minutes, we'll learn what you're building toward so your monthly £{member.constraints.budget} plan is drafted by AI and curated with your Account Manager.
                </p>
              </div>
            </div>
          )}

          {/* Screen 1: Strategy */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-display text-xl">
                  If you had £10,000 to build your cellar today, what would be your top priority?
                </h2>
                <p className="text-sm text-muted">No wrong answer — this just sets a starting point.</p>
              </div>
              <div className="space-y-3">
                {STRATEGY_OPTIONS.map((option) => (
                  <OptionCard
                    key={option.value}
                    selected={strategy === option.value}
                    onClick={() => setStrategy(option.value)}
                    label={option.label}
                    description={option.description}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Screen 2: Budget Split */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-display text-xl">How would you split that £10k today?</h2>
                <p className="text-sm text-muted">This guides your drinkability runway and long-term horizon.</p>
              </div>

              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyBudgetPreset('drink_now')}
                  className={splitNow >= 50 ? 'border-bbr-burgundy' : ''}
                >
                  Mostly drink-now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyBudgetPreset('balanced')}
                  className={splitNow >= 30 && splitNow <= 40 ? 'border-bbr-burgundy' : ''}
                >
                  Balanced
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyBudgetPreset('cellar')}
                  className={splitLong >= 45 ? 'border-bbr-burgundy' : ''}
                >
                  Mostly cellar
                </Button>
              </div>

              <div className="space-y-6">
                <Slider
                  value={splitNow}
                  onChange={(v) => {
                    setSplitNow(v);
                    const remaining = 100 - v;
                    setSplitMid(Math.round(remaining * 0.5));
                    setSplitLong(remaining - Math.round(remaining * 0.5));
                  }}
                  label="Drink in 0–18 months"
                />
                <Slider
                  value={splitMid}
                  onChange={(v) => {
                    setSplitMid(v);
                    setSplitLong(100 - splitNow - v);
                  }}
                  label="Cellar 2–10 years"
                />
                <Slider
                  value={splitLong}
                  onChange={(v) => {
                    setSplitLong(v);
                    setSplitMid(100 - splitNow - v);
                  }}
                  label="Cellar 10+ years / long hold"
                />
              </div>

              <div className="p-4 bg-ink-50 rounded-xl text-center">
                <p className="text-sm font-medium">
                  Your split: {splitNow}% now / {splitMid}% mid / {splitLong}% long
                </p>
                {splitNow + splitMid + splitLong !== 100 && (
                  <p className="text-xs text-red-600 mt-1">Must sum to 100%</p>
                )}
              </div>
            </div>
          )}

          {/* Screen 3: Cadence */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-display text-xl">How do you expect to open from your cellar?</h2>
                <div className="space-y-2">
                  {CADENCE_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.value}
                      selected={openRate === option.value}
                      onClick={() => setOpenRate(option.value)}
                      label={option.label}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-display text-xl">All else equal, would you rather...</h2>
                <div className="space-y-2">
                  {BOTTLE_PREF_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.value}
                      selected={bottlePref === option.value}
                      onClick={() => setBottlePref(option.value)}
                      label={option.label}
                      description={option.description}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Screen 4: Motives (MaxDiff) */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-display text-xl">What tends to drive your purchases?</h2>
                <p className="text-sm text-muted">
                  Round {currentMotiveRound + 1} of 3: Pick the ONE that matters most and the ONE that matters least.
                </p>
              </div>

              <div className="space-y-3">
                {motiveRounds[currentMotiveRound].map((item) => {
                  const isMost = motiveRankings[currentMotiveRound]?.most === item.key;
                  const isLeast = motiveRankings[currentMotiveRound]?.least === item.key;

                  return (
                    <div
                      key={item.key}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all',
                        isMost && 'border-green-500 bg-green-50',
                        isLeast && 'border-red-400 bg-red-50',
                        !isMost && !isLeast && 'border-ink-200'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted">{item.description}</p>
                          {item.key === 'investment_curiosity' && (
                            <p className="text-xs text-muted mt-1 italic">*Indicative only. Not investment advice.</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setMotiveRankings((prev) => {
                                const updated = [...prev];
                                updated[currentMotiveRound] = {
                                  ...updated[currentMotiveRound],
                                  most: isMost ? null : item.key,
                                  least: updated[currentMotiveRound].least === item.key ? null : updated[currentMotiveRound].least,
                                };
                                return updated;
                              });
                            }}
                            className={cn(
                              'px-3 py-1 text-xs rounded-full border transition-colors',
                              isMost
                                ? 'bg-green-500 text-white border-green-500'
                                : 'border-green-300 text-green-600 hover:bg-green-50'
                            )}
                          >
                            Most
                          </button>
                          <button
                            onClick={() => {
                              setMotiveRankings((prev) => {
                                const updated = [...prev];
                                updated[currentMotiveRound] = {
                                  ...updated[currentMotiveRound],
                                  least: isLeast ? null : item.key,
                                  most: updated[currentMotiveRound].most === item.key ? null : updated[currentMotiveRound].most,
                                };
                                return updated;
                              });
                            }}
                            className={cn(
                              'px-3 py-1 text-xs rounded-full border transition-colors',
                              isLeast
                                ? 'bg-red-400 text-white border-red-400'
                                : 'border-red-300 text-red-500 hover:bg-red-50'
                            )}
                          >
                            Least
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-2 h-2 rounded-full',
                      i === currentMotiveRound ? 'bg-bbr-burgundy' : 'bg-ink-200'
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Screen 5: Constraints */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl">Any guardrails for your plan?</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Styles to avoid</label>
                  <ChipSelector
                    options={AVOID_TAGS}
                    selected={avoidTags}
                    onToggle={toggleAvoidTag}
                  />
                </div>

                <Slider
                  value={wineVsSpirits}
                  onChange={setWineVsSpirits}
                  label="Wine vs. Spirits mix"
                  leftLabel="All wine"
                  rightLabel="Include spirits"
                />

                <Slider
                  value={redVsWhite}
                  onChange={setRedVsWhite}
                  label="Red vs. White mix"
                  leftLabel="Mostly red"
                  rightLabel="Mostly white"
                />

                <div>
                  <label className="text-sm font-medium block mb-2">Max bottles per month</label>
                  <div className="flex gap-2">
                    {[2, 4, 6, 8].map((n) => (
                      <button
                        key={n}
                        onClick={() => setMaxBottles(n)}
                        className={cn(
                          'px-4 py-2 rounded-lg border transition-colors',
                          maxBottles === n
                            ? 'border-bbr-burgundy bg-bbr-burgundy/10'
                            : 'border-ink-200 hover:border-ink-300'
                        )}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setMaxBottles('surprise_me')}
                      className={cn(
                        'px-4 py-2 rounded-lg border transition-colors',
                        maxBottles === 'surprise_me'
                          ? 'border-bbr-burgundy bg-bbr-burgundy/10'
                          : 'border-ink-200 hover:border-ink-300'
                      )}
                    >
                      Surprise me
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">If something's out of stock...</label>
                  <div className="space-y-2">
                    {[
                      { value: 'close_only' as const, label: 'Only close substitutes' },
                      { value: 'flexible' as const, label: "I'm flexible" },
                      { value: 'ask_am' as const, label: 'Ask my Account Manager' },
                    ].map((option) => (
                      <OptionCard
                        key={option.value}
                        selected={substitutionTolerance === option.value}
                        onClick={() => setSubstitutionTolerance(option.value)}
                        label={option.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Screen 6: Themes */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl">Anything you want to build around?</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Regions to focus on (optional)</label>
                  <ChipSelector
                    options={REGIONS}
                    selected={regions}
                    onToggle={toggleRegion}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Collection style</label>
                  <div className="space-y-2">
                    {COLLECTION_STYLES.map((style) => (
                      <OptionCard
                        key={style.value}
                        selected={collectionStyle === style.value}
                        onClick={() => setCollectionStyle(style.value)}
                        label={style.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Screen 7: Free Text */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-display text-xl">Describe your ideal cellar plan</h2>
                <p className="text-sm text-muted">
                  If you have a specific split in mind (e.g., "£2k drink-now this year and £8k for 15 years") write it here. Also mention any must-haves, avoids, or special occasions.
                </p>
              </div>

              <Textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="For example: I'd love to build a vertical of Opus One, have some Champagne for our anniversary next June, and gradually explore Burgundy. I prefer wines that are ready to drink within 5 years..."
                className="min-h-[150px]"
              />

              <p className="text-xs text-muted italic">
                We'll turn this into a plan you can edit.
              </p>
            </div>
          )}

          {/* Screen 8: Summary */}
          {step === 8 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <Sparkles className="h-8 w-8 text-bbr-gold mx-auto" />
                <h2 className="font-display text-xl">We heard you</h2>
                <p className="text-sm text-muted">Here's what we'll use to draft your plan</p>
              </div>

              <div className="space-y-4">
                <SummaryRow label="Strategy" value={STRATEGY_OPTIONS.find((s) => s.value === strategy)?.label || '—'} />
                <SummaryRow label="Budget split" value={`${splitNow}% now / ${splitMid}% mid / ${splitLong}% long`} />
                <SummaryRow label="Opening rate" value={CADENCE_OPTIONS.find((c) => c.value === openRate)?.label || '—'} />
                <SummaryRow label="Bottle preference" value={BOTTLE_PREF_OPTIONS.find((b) => b.value === bottlePref)?.label || '—'} />
                {regions.length > 0 && <SummaryRow label="Focus regions" value={regions.join(', ')} />}
                {avoidTags.length > 0 && <SummaryRow label="Avoiding" value={avoidTags.join(', ')} />}
                {freeText && <SummaryRow label="Your notes" value={freeText.slice(0, 100) + (freeText.length > 100 ? '...' : '')} />}
              </div>

              <div className="flex gap-2 justify-center pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Edit
                </Button>
                <Button variant="outline" onClick={() => {/* Would send to AM for review */}}>
                  Ask AM to review
                </Button>
              </div>
            </div>
          )}

          {/* Screen 9: Finish */}
          {step === 9 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="font-display text-2xl">You're set</h2>
                <p className="text-muted max-w-md mx-auto">
                  Your first monthly £{member.constraints.budget} draft will be prepared and sent to your Account Manager for curation.
                </p>
              </div>
              <div className="text-xs text-muted space-y-1 pt-4">
                <p>18+ to purchase alcohol.</p>
                <p>Indicative values only. Not investment advice.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border p-4 bg-ink-50">
          <div className="text-xs text-muted">
            {step === 4
              ? `Round ${currentMotiveRound + 1} of 3`
              : `Step ${step + 1} of ${SCREENS.length}`}
          </div>
          <div className="flex gap-2">
            {(step > 0 || (step === 4 && currentMotiveRound > 0)) && (
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-bbr-burgundy hover:bg-bbr-burgundy-light"
            >
              {step === SCREENS.length - 1 ? 'Go to Dashboard' : step === 4 && currentMotiveRound < 2 ? 'Next Round' : 'Continue'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start p-3 bg-ink-50 rounded-lg">
      <span className="text-sm font-medium text-muted">{label}</span>
      <span className="text-sm text-right max-w-[60%]">{value}</span>
    </div>
  );
}
