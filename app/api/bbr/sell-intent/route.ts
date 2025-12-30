import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    id: `sell-${Date.now()}`,
    status: "Submitted",
    ...body
  });
}
