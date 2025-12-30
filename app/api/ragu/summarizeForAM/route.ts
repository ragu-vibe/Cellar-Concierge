import { NextResponse } from 'next/server';
import { summarizeForAM } from '@/lib/ai/simulatedAi';

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json({ summary: summarizeForAM(input) });
}
