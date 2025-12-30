import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    draftId: 'draft-001',
    status: 'Drafted',
    ...body
  });
}
