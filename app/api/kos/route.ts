// app/api/kos/route.ts
// Next.js Route Handler — List & Filter Kos Properties

import { NextResponse } from 'next/server';
import { listPublishedKos, parseKosFiltersFromSearchParams } from '@/src/lib/kos-queries';

export const dynamic = 'force-dynamic';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseKosFiltersFromSearchParams(searchParams);

    const limitVal = clamp(parseInt(searchParams.get('limit') || '20', 10) || 20, 1, 100);
    const offsetVal = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0);

    const { data, total } = await listPublishedKos(filters, {
      limit: limitVal,
      offset: offsetVal,
    });

    return NextResponse.json({
      data,
      total,
      limit: limitVal,
      offset: offsetVal,
    });
  } catch (error) {
    console.error('Error fetching kos list:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Gagal memuat data kos' },
      { status: 500 }
    );
  }
}
