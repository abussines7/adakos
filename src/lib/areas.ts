import { unstable_cache } from 'next/cache';
import { db } from '@/src/db';
import { area } from '@/src/db/schema';
import { kosData } from '@/data/kos-data';
import { asc } from 'drizzle-orm';

const isPlaceholderDb =
  process.env.DATABASE_URL?.includes('[PASSWORD_ANDA]') ||
  process.env.DIRECT_URL?.includes('[PASSWORD_ANDA]') ||
  !process.env.DATABASE_URL;

const getAreasFromMock = () => {
  const uniqueNames = Array.from(new Set(kosData.map((k) => k.area)));
  return uniqueNames.sort().map((nama, idx) => ({
    id: `mock-area-${idx}`,
    nama,
    slug: nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
  }));
};

export const getCachedAreas = unstable_cache(
  async () => {
    if (isPlaceholderDb) {
      return getAreasFromMock();
    }
    try {
      return await db
        .select({
          id: area.id,
          nama: area.nama,
          slug: area.slug,
        })
        .from(area)
        .orderBy(asc(area.nama));
    } catch (error) {
      console.warn('Gagal memuat areas dari database, menggunakan fallback mock:', error);
      return getAreasFromMock();
    }
  },
  ['areas-list'],
  { revalidate: 3600 }
);

