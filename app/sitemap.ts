import type { MetadataRoute } from 'next';
import { listPublishedKos } from '@/src/lib/kos-queries';
import { SAMPLE_DATA_MODE, SITE_URL } from '@/src/lib/site-config';

export const revalidate = 3600;

const MAX_KOS_IN_SITEMAP = 1000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/explore`, changeFrequency: 'daily', priority: 0.8 },
  ];

  // Selama data masih contoh, halaman kos tidak dimasukkan ke sitemap.
  if (SAMPLE_DATA_MODE) {
    return staticPages;
  }

  try {
    const { data } = await listPublishedKos({}, { limit: MAX_KOS_IN_SITEMAP, offset: 0 });
    return [
      ...staticPages,
      ...data.map((kos) => ({
        url: `${SITE_URL}/kos/${kos.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
    ];
  } catch (error) {
    console.error('Gagal memuat kos untuk sitemap:', error);
    return staticPages;
  }
}
