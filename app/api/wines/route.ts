import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { id: { contains: search } },
            { producer: { contains: search } },
            { region: { contains: search } },
          ],
        }
      : {};

    const [wines, total] = await Promise.all([
      prisma.wine.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { name: 'asc' },
      }),
      prisma.wine.count({ where }),
    ]);

    return NextResponse.json({
      wines,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + wines.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching wines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wines' },
      { status: 500 }
    );
  }
}
