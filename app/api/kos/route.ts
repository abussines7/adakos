// app/api/kos/route.ts
// Next.js Route Handler — List & Filter Kos Properties
// Highly optimized using clean SQL joins, dynamic filters, and pagination

import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { kos, area, kosFoto } from '@/src/db/schema';
import { and, eq, gte, lte, ilike, sql, SQL, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters from query string
    const areaSlug = searchParams.get('area') || undefined;
    const tipe = searchParams.get('tipe') || undefined;
    const hargaMin = searchParams.get('harga_min') || undefined;
    const hargaMax = searchParams.get('harga_max') || undefined;
    const statusBanjir = searchParams.get('status_banjir') || undefined;
    const q = searchParams.get('q') || undefined;

    // Pagination
    const limitVal = Math.min(Math.max(parseInt(searchParams.get('limit') || '20'), 1), 100);
    const offsetVal = Math.max(parseInt(searchParams.get('offset') || '0'), 0);

    // Build dynamic conditions
    const conditions: SQL[] = [eq(kos.is_published, true)];

    if (tipe && ['putra', 'putri', 'campur'].includes(tipe)) {
      conditions.push(eq(kos.tipe, tipe as 'putra' | 'putri' | 'campur'));
    }

    if (statusBanjir && ['aman', 'rawan', 'kadang_tergenang'].includes(statusBanjir)) {
      conditions.push(eq(kos.status_banjir, statusBanjir as 'aman' | 'rawan' | 'kadang_tergenang'));
    }

    if (hargaMin) {
      const minPrice = parseInt(hargaMin);
      if (!isNaN(minPrice)) {
        conditions.push(gte(kos.harga_bulanan, minPrice));
      }
    }

    if (hargaMax) {
      const maxPrice = parseInt(hargaMax);
      if (!isNaN(maxPrice)) {
        conditions.push(lte(kos.harga_bulanan, maxPrice));
      }
    }

    if (q) {
      conditions.push(ilike(kos.nama, `%${q}%`));
    }

    if (areaSlug) {
      conditions.push(eq(area.slug, areaSlug));
    }

    // Execute query for data
    const rows = await db
      .select({
        slug: kos.slug,
        nama: kos.nama,
        tipe: kos.tipe,
        hargaBulanan: kos.harga_bulanan,
        statusBanjir: kos.status_banjir,
        kondisiJalan: kos.kondisi_jalan,
        area: {
          nama: area.nama,
          slug: area.slug,
        },
        fotoUtama: kosFoto.url,
      })
      .from(kos)
      .leftJoin(area, eq(kos.area_id, area.id))
      .leftJoin(kosFoto, and(eq(kos.id, kosFoto.kos_id), eq(kosFoto.urutan, 0)))
      .where(and(...conditions))
      .orderBy(desc(kos.created_at))
      .limit(limitVal)
      .offset(offsetVal);

    // Execute query for count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(kos)
      .leftJoin(area, eq(kos.area_id, area.id))
      .where(and(...conditions));

    const total = Number(totalCountResult[0]?.count || 0);

    // Format response payload (camelCase to snake_case matching implementation plan)
    const formattedData = rows.map((row) => ({
      slug: row.slug,
      nama: row.nama,
      tipe: row.tipe,
      area: row.area ? {
        nama: row.area.nama,
        slug: row.area.slug,
      } : null,
      harga_bulanan: row.hargaBulanan,
      foto_utama: row.fotoUtama || '',
      status_banjir: row.statusBanjir,
      kondisi_jalan: row.kondisiJalan,
    }));

    return NextResponse.json({
      data: formattedData,
      total,
      limit: limitVal,
      offset: offsetVal,
    });
  } catch (error) {
    console.error('Error fetching kos list:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
