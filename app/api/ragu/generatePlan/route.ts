import { NextResponse } from 'next/server';
import { generatePlan } from '@/lib/ai/simulatedAi';

export async function POST(request: Request) {
  const input = await request.json();
  return NextResponse.json(generatePlan(input));
}
