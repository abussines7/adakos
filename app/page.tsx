// app/page.tsx
import { listPublishedKos, type KosListRow } from '@/src/lib/kos-queries';
import { getCachedAreas, type AreaOption } from '@/src/lib/areas';
import HeroSection from '@/components/home/HeroSection';
import FeaturedKos from '@/components/home/FeaturedKos';

export const revalidate = 60;

export default async function Home() {
  let kosList: KosListRow[] = [];
  try {
    // 3 kos terbaru yang dipublikasikan
    ({ data: kosList } = await listPublishedKos({}, { limit: 3, offset: 0 }));
  } catch (error) {
    console.error('Gagal memuat kos terbaru:', error);
  }

  let areas: AreaOption[] = [];
  try {
    areas = await getCachedAreas();
  } catch (error) {
    console.error('Gagal memuat daftar area:', error);
  }

  return (
    <div className="flex flex-col">
      <HeroSection areas={areas} />
      <FeaturedKos kosList={kosList} />
    </div>
  );
}
