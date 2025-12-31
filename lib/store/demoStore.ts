'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { memberProfile, accountManager, CollectorProfile } from '@/data/members';
import { monthlyPlan } from '@/data/plans';
import { portfolio } from '@/data/portfolio';
import { threads } from '@/data/messages';
import { sellIntents } from '@/data/sellIntents';
import { UserCellarProfile, createEmptyProfile } from '@/lib/types/cellarProfile';

// Re-export types for convenience
export type { MotivationWeights, RiskProfile, TimeHorizon, BudgetStrategy, RegionalFocus, CollectorProfile } from '@/data/members';
export type { UserCellarProfile } from '@/lib/types/cellarProfile';

export type Role = 'member' | 'am' | 'admin';

export type ChatMessage = {
  id: string;
  sender: 'user' | 'ai' | 'am';
  content: string;
  timestamp: string;
};

export type DemoState = {
  role: Role;
  member: typeof memberProfile;
  accountManager: typeof accountManager;
  plan: typeof monthlyPlan;
  portfolio: typeof portfolio;
  messages: typeof threads;
  sellIntents: typeof sellIntents;
  gamificationEnabled: boolean;
  marketplaceExpansionEnabled: boolean;
  showOnboarding: boolean;
  hasCompletedOnboarding: boolean;
  justCompletedOnboarding: boolean;
  chatMessages: ChatMessage[];
  chatOpen: boolean;
  cellarProfile: UserCellarProfile | null;
  initialRecommendations: string[]; // Wine IDs for first recommendations
  setRole: (role: Role) => void;
  setPlanStatus: (status: typeof monthlyPlan.status) => void;
  setGamificationEnabled: (value: boolean) => void;
  setMarketplaceExpansionEnabled: (value: boolean) => void;
  setShowOnboarding: (value: boolean) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  setJustCompletedOnboarding: (value: boolean) => void;
  setChatOpen: (value: boolean) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMember: (member: Partial<typeof memberProfile>) => void;
  updateCollectorProfile: (profile: CollectorProfile) => void;
  setCellarProfile: (profile: UserCellarProfile) => void;
  setInitialRecommendations: (wineIds: string[]) => void;
  addSellIntent: (intent: { bottle: string; timeframe: string; targetPrice: string; reason: string }) => void;
  resetDemo: () => void;
};

const initialState = {
  role: 'member' as Role,
  member: memberProfile,
  accountManager,
  plan: monthlyPlan,
  portfolio,
  messages: threads,
  sellIntents,
  gamificationEnabled: true,
  marketplaceExpansionEnabled: false,
  showOnboarding: false,
  hasCompletedOnboarding: false,
  justCompletedOnboarding: false,
  chatMessages: [] as ChatMessage[],
  chatOpen: false,
  cellarProfile: null as UserCellarProfile | null,
  initialRecommendations: [] as string[]
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setRole: (role) => set({ role }),
      setPlanStatus: (status) => set((state) => ({ plan: { ...state.plan, status } })),
      setGamificationEnabled: (value) => set({ gamificationEnabled: value }),
      setMarketplaceExpansionEnabled: (value) => set({ marketplaceExpansionEnabled: value }),
      setShowOnboarding: (value) => set({ showOnboarding: value }),
      setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value, showOnboarding: false }),
      setJustCompletedOnboarding: (value) => set({ justCompletedOnboarding: value }),
      setChatOpen: (value) => set({ chatOpen: value }),
      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              ...message,
              id: `msg-${Date.now()}`,
              timestamp: new Date().toISOString()
            }
          ]
        })),
      updateMember: (updates) =>
        set((state) => ({
          member: { ...state.member, ...updates }
        })),
      updateCollectorProfile: (profile) =>
        set((state) => ({
          member: { ...state.member, collectorProfile: profile }
        })),
      setCellarProfile: (profile) => set({ cellarProfile: profile }),
      setInitialRecommendations: (wineIds) => set({ initialRecommendations: wineIds }),
      addSellIntent: (intent) =>
        set((state) => ({
          sellIntents: [
            ...state.sellIntents,
            {
              id: `sell-${state.sellIntents.length + 2}`,
              bottle: intent.bottle,
              status: 'Submitted',
              timeframe: intent.timeframe,
              targetPrice: intent.targetPrice,
              reason: intent.reason
            }
          ]
        })),
      resetDemo: () => set(initialState)
    }),
    { name: 'cellar-concierge-demo' }
  )
);
