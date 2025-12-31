import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get('memberId');
  return NextResponse.json({
    memberId,
    allocations: [
      { id: 'alloc-1', label: 'Bordeaux En Primeur', available: true },
      { id: 'alloc-2', label: 'Rhône Grower Parcel', available: false }
    ]
  });
}
