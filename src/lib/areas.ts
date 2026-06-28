import { unstable_cache } from 'next/cache';
import { db } from '@/src/db';
import { area } from '@/src/db/schema';

export const getCachedAreas = unstable_cache(
  async () => db.select({ nama: area.nama, slug: area.slug }).from(area),
  ['areas-list'],
  { revalidate: 3600 }
);
