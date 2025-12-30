import { MonthlyPlan } from "@/lib/types";
import { inventory } from "@/data/inventory";

export const monthlyPlans: MonthlyPlan[] = [
  {
    id: "plan-1",
    memberId: "member-1",
    month: "September",
    status: "Drafted",
    budgetGBP: 250,
    objectives: ["Cellar build", "Entertaining"],
    items: [
      {
        item: inventory[3],
        quantity: 2,
        rationale: "High prestige with a tightening allocation; aligns with your cellar-build target.",
        substitutes: [inventory[10], inventory[18]]
      },
      {
        item: inventory[7],
        quantity: 3,
        rationale: "Drink window opens now, perfect for upcoming hosting nights.",
        substitutes: [inventory[12], inventory[21]]
      },
      {
        item: inventory[15],
        quantity: 1,
        rationale: "Value signal well above the price band, with a strong critic narrative.",
        substitutes: [inventory[24], inventory[30]]
      }
    ],
    amNote: "Alex, I leaned into Rhône and Burgundy to meet your prestige + entertaining mix. Happy to swap in more discovery if needed."
  }
];
