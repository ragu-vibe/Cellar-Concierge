import { MemberProfile } from "@/lib/types";

export const members: MemberProfile[] = [
  {
    id: "member-1",
    name: "Alex Morgan",
    location: "London, UK",
    budgetGBP: 250,
    motives: {
      scarcity: 0.8,
      prestige: 0.7,
      value: 0.6,
      drinkingWindow: 0.5,
      provenance: 0.7,
      criticSignal: 0.4,
      discovery: 0.5,
      entertaining: 0.6
    },
    constraints: {
      minVintage: 2008,
      maxVintage: 2021,
      avoidRegions: ["Napa Valley"],
      maxPriceGBP: 120,
      drinkWindowFocus: "balanced"
    },
    goals: ["Build a dinner party-ready cellar", "Increase Rhône discovery", "Hold a prestige allocation for 2028"],
    accountManager: {
      id: "am-1",
      name: "Sophie Clarke"
    }
  }
];

export const accountManagers = [
  {
    id: "am-1",
    name: "Sophie Clarke",
    title: "Senior Account Manager"
  }
];
