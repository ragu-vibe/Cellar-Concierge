import { NextResponse } from "next/server";
import { inventory } from "@/data/inventory";
import { recommendSubstitutes } from "@/lib/ai/simulatedAi";

export async function POST(request: Request) {
  const body = await request.json();
  const item = inventory.find((candidate) => candidate.id === body.itemId);
  if (!item) {
    return NextResponse.json({ substitutes: [] });
  }
  const substitutes = recommendSubstitutes(item, body.profile);
  return NextResponse.json({ substitutes: substitutes.map((sub) => sub.id) });
}
