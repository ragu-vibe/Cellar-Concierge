import { NextResponse } from "next/server";
import { generatePlan } from "@/lib/ai/simulatedAi";

export async function POST(request: Request) {
  const body = await request.json();
  const plan = generatePlan(body.profile, body.objectives, body.budget);
  return NextResponse.json(plan);
}
