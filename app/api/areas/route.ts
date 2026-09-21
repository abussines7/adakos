// app/api/areas/route.ts
// Next.js Route Handler — Get all master areas

import { NextResponse } from 'next/server';
import { getCachedAreas } from '@/src/lib/areas';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const areas = await getCachedAreas();
    return NextResponse.json({ data: areas });
  } catch (error) {
    console.error('Error fetching areas:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
