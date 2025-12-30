'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { memberProfile, accountManager } from '@/data/members';
import { monthlyPlan } from '@/data/plans';
import { portfolio } from '@/data/portfolio';
import { threads } from '@/data/messages';
import { sellIntents } from '@/data/sellIntents';

export type Role = 'member' | 'am' | 'admin';

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
  setRole: (role: Role) => void;
  setPlanStatus: (status: typeof monthlyPlan.status) => void;
  setGamificationEnabled: (value: boolean) => void;
  setMarketplaceExpansionEnabled: (value: boolean) => void;
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
  marketplaceExpansionEnabled: false
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      ...initialState,
      setRole: (role) => set({ role }),
      setPlanStatus: (status) => set((state) => ({ plan: { ...state.plan, status } })),
      setGamificationEnabled: (value) => set({ gamificationEnabled: value }),
      setMarketplaceExpansionEnabled: (value) => set({ marketplaceExpansionEnabled: value }),
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
