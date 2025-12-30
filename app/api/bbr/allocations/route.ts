import { NextRequest, NextResponse } from "next/server";
import { monthlyPlans } from "@/data/plans";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("memberId");
  const plans = memberId ? monthlyPlans.filter((plan) => plan.memberId === memberId) : monthlyPlans;
  return NextResponse.json(plans);
}
