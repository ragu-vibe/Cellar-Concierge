import { InventoryItem, MonthlyPlan, PortfolioItem, SellIntent } from "@/lib/types";

export async function fetchInventory(): Promise<InventoryItem[]> {
  const res = await fetch("/api/bbr/inventory");
  return res.json();
}

export async function fetchMemberAllocations(memberId: string): Promise<MonthlyPlan[]> {
  const res = await fetch(`/api/bbr/allocations?memberId=${memberId}`);
  return res.json();
}

export async function createDraftOrder(memberId: string, items: { id: string; quantity: number }[]) {
  const res = await fetch("/api/bbr/draft-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, items })
  });
  return res.json();
}

export async function submitForAMReview(planId: string) {
  const res = await fetch("/api/bbr/submit-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId })
  });
  return res.json();
}

export async function approvePlan(planId: string, amNote: string, edits: string[]) {
  const res = await fetch("/api/bbr/approve-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId, amNote, edits })
  });
  return res.json();
}

export async function getPortfolio(memberId: string): Promise<PortfolioItem[]> {
  const res = await fetch(`/api/bbr/portfolio?memberId=${memberId}`);
  return res.json();
}

export async function createSellIntent(memberId: string, bottleId: string, details: Partial<SellIntent>) {
  const res = await fetch("/api/bbr/sell-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, bottleId, details })
  });
  return res.json();
}
