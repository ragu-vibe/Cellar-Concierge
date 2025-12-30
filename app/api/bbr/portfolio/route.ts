import { NextResponse } from "next/server";
import { portfolio } from "@/data/portfolio";

export async function GET() {
  return NextResponse.json(portfolio);
}
