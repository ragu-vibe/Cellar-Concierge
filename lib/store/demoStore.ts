'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { memberProfile, accountManager, CollectorProfile } from '@/data/members';
import { monthlyPlan } from '@/data/plans';
import { portfolio as mockPortfolio } from '@/data/portfolio';
import { threads } from '@/data/messages';
import { sellIntents } from '@/data/sellIntents';
import { UserCellarProfile, createEmptyProfile } from '@/lib/types/cellarProfile';

// Default customer ID for real data demo
// Customer 0020249063 has good T360 preferences (20 selected) and 204 bottles
export const DEFAULT_MEMBER_ID = '0020249063';

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

export type PortfolioItem = {
  id: string;
  skuId: string;
  name: string;
  region: string;
  vintage: number | null;
  bottles: number;
  drinkWindow: string;
  maturity: string | null; // BBR maturity: "Not ready", "Ready - youthful", "Ready - at best", "Ready - Mature"
  indicativeValue: number;
  purchasePrice: number;
  tags: string[];
};

export type DemoState = {
  role: Role;
  member: typeof memberProfile;
  accountManager: typeof accountManager;
  plan: typeof monthlyPlan;
  portfolio: PortfolioItem[];
  portfolioLoading: boolean;
  memberId: string;
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
  setPortfolio: (portfolio: PortfolioItem[]) => void;
  fetchPortfolio: (memberId?: string) => Promise<void>;
  resetDemo: () => void;
};

const initialState = {
  role: 'member' as Role,
  member: memberProfile,
  accountManager,
  plan: monthlyPlan,
  portfolio: [] as PortfolioItem[],  // Start empty, fetch real data
  portfolioLoading: true,  // Start in loading state
  memberId: DEFAULT_MEMBER_ID,
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
      setPortfolio: (portfolio) => set({ portfolio }),
      fetchPortfolio: async (memberId?: string) => {
        const id = memberId || get().memberId;
        set({ portfolioLoading: true });
        try {
          const response = await fetch(`/api/bbr/portfolio?memberId=${id}`);
          const data = await response.json();
          if (data.portfolio && data.portfolio.length > 0) {
            set({ portfolio: data.portfolio, memberId: id, portfolioLoading: false });
          } else {
            // Fall back to mock data if no real data found
            set({ portfolio: mockPortfolio as PortfolioItem[], portfolioLoading: false });
          }
        } catch (error) {
          console.error('Failed to fetch portfolio:', error);
          // Fall back to mock data on error
          set({ portfolio: mockPortfolio as PortfolioItem[], portfolioLoading: false });
        }
      },
      resetDemo: () => set(initialState)
    }),
{
      name: 'cellar-concierge-demo',
      // Don't persist portfolio data - always fetch fresh from API
      partialize: (state) => ({
        role: state.role,
        member: state.member,
        plan: state.plan,
        memberId: state.memberId,
        sellIntents: state.sellIntents,
        gamificationEnabled: state.gamificationEnabled,
        marketplaceExpansionEnabled: state.marketplaceExpansionEnabled,
        showOnboarding: state.showOnboarding,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        justCompletedOnboarding: state.justCompletedOnboarding,
        chatMessages: state.chatMessages,
        chatOpen: state.chatOpen,
        cellarProfile: state.cellarProfile,
        initialRecommendations: state.initialRecommendations,
        // Explicitly exclude: portfolio, portfolioLoading
      }),
    }
  )
);
