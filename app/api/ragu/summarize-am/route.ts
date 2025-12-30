import { NextResponse } from "next/server";
import { generateAMSummary } from "@/lib/ai/simulatedAi";

export async function POST(request: Request) {
  const body = await request.json();
  const summary = generateAMSummary(body.plan, body.profile);
  return NextResponse.json({ summary });
}
