// app/api/areas/route.ts
// Next.js Route Handler — Get all master areas
// Optimized lookup sorted alphabetically

import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { area } from '@/src/db/schema';
import { asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const areas = await db
      .select({
        id: area.id,
        nama: area.nama,
        slug: area.slug,
      })
      .from(area)
      .orderBy(asc(area.nama));

    return NextResponse.json({ data: areas });
  } catch (error) {
    console.error('Error fetching areas:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
