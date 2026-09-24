import { unstable_cache } from 'next/cache';
import { asc } from 'drizzle-orm';
import { db } from '@/src/db';
import { area } from '@/src/db/schema';

export type AreaOption = { id: string; nama: string; slug: string };

// Error sengaja tidak ditangkap di sini: hasil gagal tidak boleh ikut
// di-cache selama satu jam. Pemanggil yang menangani error.
export const getCachedAreas = unstable_cache(
  async (): Promise<AreaOption[]> =>
    db
      .select({ id: area.id, nama: area.nama, slug: area.slug })
      .from(area)
      .orderBy(asc(area.nama)),
  ['areas-list'],
  { revalidate: 3600 }
);
