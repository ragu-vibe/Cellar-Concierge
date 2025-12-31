import { create } from "zustand";
import { persist } from "zustand/middleware";
import { members } from "@/data/members";
import { monthlyPlans } from "@/data/plans";
import { messageThreads } from "@/data/messages";
import { sellIntents } from "@/data/sellIntents";
import { Role, MemberProfile, MonthlyPlan, MessageThread, SellIntent } from "@/lib/types";
import { UserCellarProfile } from "@/lib/types/cellarProfile";

const defaultMember = members[0];

type DemoState = {
  role: Role;
  member: MemberProfile;
  plans: MonthlyPlan[];
  threads: MessageThread[];
  sellTickets: SellIntent[];
  gamificationEnabled: boolean;
  prospectProfile?: UserCellarProfile;
  onboardingComplete: boolean;
  setRole: (role: Role) => void;
  updateMember: (member: MemberProfile) => void;
  updatePlanStatus: (planId: string, status: MonthlyPlan["status"]) => void;
  addSellIntent: (intent: SellIntent) => void;
  resetDemo: () => void;
  toggleGamification: () => void;
  setProspectProfile: (profile: UserCellarProfile) => void;
  resetProspect: () => void;
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      role: "member",
      member: defaultMember,
      plans: monthlyPlans,
      threads: messageThreads,
      sellTickets: sellIntents,
      gamificationEnabled: true,
      prospectProfile: undefined,
      onboardingComplete: false,
      setRole: (role) => set({ role }),
      updateMember: (member) => set({ member }),
      updatePlanStatus: (planId, status) =>
        set((state) => ({
          plans: state.plans.map((plan) => (plan.id === planId ? { ...plan, status } : plan))
        })),
      addSellIntent: (intent) => set((state) => ({ sellTickets: [intent, ...state.sellTickets] })),
      toggleGamification: () => set((state) => ({ gamificationEnabled: !state.gamificationEnabled })),
      setProspectProfile: (profile) => set({ prospectProfile: profile, onboardingComplete: true }),
      resetProspect: () => set({ prospectProfile: undefined, onboardingComplete: false }),
      resetDemo: () =>
        set({
          role: "member",
          member: defaultMember,
          plans: monthlyPlans,
          threads: messageThreads,
          sellTickets: sellIntents,
          gamificationEnabled: true,
          prospectProfile: undefined,
          onboardingComplete: false
        })
    }),
    { name: "cellar-concierge-demo" }
  )
);
