import { unstable_cache } from 'next/cache';
import { and, asc, eq, sql } from 'drizzle-orm';
import { db } from '@/src/db';
import { area, kos } from '@/src/db/schema';

export type AreaOption = { id: string; nama: string; slug: string; jumlahKos: number };

// Error sengaja tidak ditangkap di sini: hasil gagal tidak boleh ikut
// di-cache selama satu jam. Pemanggil yang menangani error.
export const getCachedAreas = unstable_cache(
  async (): Promise<AreaOption[]> =>
    db
      .select({
        id: area.id,
        nama: area.nama,
        slug: area.slug,
        jumlahKos: sql<number>`count(${kos.id})::int`,
      })
      .from(area)
      .leftJoin(kos, and(eq(kos.area_id, area.id), eq(kos.is_published, true)))
      .groupBy(area.id)
      .orderBy(asc(area.nama)),
  ['areas-list'],
  { revalidate: 3600 }
);
