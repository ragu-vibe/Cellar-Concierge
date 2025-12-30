import { SellIntent } from "@/lib/types";

export const sellIntents: SellIntent[] = [
  {
    id: "sell-1",
    memberId: "member-1",
    bottleId: "pf-2",
    bottleName: "Domaine des Rives Côte de Nuits 2015",
    reason: "Rebalancing cellar toward Rhône",
    timeframe: "Next 90 days",
    targetPriceGBP: 120,
    status: "Reviewing"
  }
];
