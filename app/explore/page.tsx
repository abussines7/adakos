// app/explore/page.tsx
import { Suspense } from 'react';
import type { Metadata } from 'next';
import FilterSidebar from '@/components/explore/FilterSidebar';
import AiSearchForm from '@/components/explore/AiSearchForm';
import ExploreResults, { ResultsSkeleton } from '@/components/explore/ExploreResults';
import { getCachedAreas, type AreaOption } from '@/src/lib/areas';
import { parseExploreParams, type RawSearchParams } from '@/src/lib/explore-params';

export const metadata: Metadata = {
  title: 'Eksplorasi Kos',
  description: 'Cari kos di sekitar Universitas Hasanuddin berdasarkan area, tipe, kondisi jalan, dan status banjir.',
};

export default async function ExplorePage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const params = parseExploreParams(await searchParams);

  let areas: AreaOption[] = [];
  try {
    areas = await getCachedAreas();
  } catch (error) {
    console.error('Gagal memuat daftar area:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Eksplorasi Kos</h1>
          <p className="text-slate-500 mt-1">Cari kos impian Anda di sekitar Universitas Hasanuddin.</p>
        </div>
        {/* key: form di-reset saat query AI di URL berubah (mis. setelah "Hapus Filter AI") */}
        <AiSearchForm key={params.aiQuery} initialQuery={params.aiQuery} />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <FilterSidebar areas={areas} currentArea={params.currentArea} currentTipe={params.currentTipe} />
        </div>

        <div className="flex-grow">
          {/* key tanpa limit: ganti filter menampilkan skeleton, "muat lebih banyak" tidak */}
          <Suspense key={params.resultsKey} fallback={<ResultsSkeleton />}>
            <ExploreResults params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
