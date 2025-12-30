import { NextResponse } from 'next/server';
import { portfolio } from '@/data/portfolio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get('memberId');
  return NextResponse.json({ memberId, portfolio });
}
