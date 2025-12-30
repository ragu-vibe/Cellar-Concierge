import { NextResponse } from 'next/server';
import { inventory } from '@/data/inventory';

export async function GET() {
  return NextResponse.json({ inventory });
}
