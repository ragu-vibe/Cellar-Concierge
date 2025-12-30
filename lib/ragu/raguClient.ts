import { MonthlyPlan, MemberProfile } from "@/lib/types";

export async function generatePlan(input: { profile: MemberProfile; objectives: string[]; budget: number }): Promise<MonthlyPlan> {
  const res = await fetch("/api/ragu/generate-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  return res.json();
}

export async function summarizeForAM(input: { plan: MonthlyPlan; profile: MemberProfile }): Promise<{ summary: string }> {
  const res = await fetch("/api/ragu/summarize-am", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  return res.json();
}

export async function recommendSubstitutes(input: { itemId: string; profile: MemberProfile }): Promise<{ substitutes: string[] }> {
  const res = await fetch("/api/ragu/substitutes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  return res.json();
}
