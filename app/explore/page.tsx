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
    <div className="w-full">
      <header className="border-b-2 border-ink bg-map-grid">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="kicker">Katalog kos · sekitar Unhas</p>
            <h1 className="mt-2 font-wide text-4xl sm:text-5xl">Eksplorasi kos</h1>
            <p className="mt-2 max-w-xl text-ink-soft">
              Saring berdasarkan area, tipe, dan kondisi akses, atau tanya AI dengan bahasa sehari-hari.
            </p>
          </div>
          {/* key: form di-reset saat query AI di URL berubah (mis. setelah "Hapus filter AI") */}
          <AiSearchForm key={params.aiQuery} initialQuery={params.aiQuery} />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row lg:px-8">
        <aside className="w-full shrink-0 md:w-72">
          <FilterSidebar
            areas={areas}
            currentArea={params.currentArea}
            currentTipe={params.currentTipe}
            onlyBebasBanjir={params.onlyBebasBanjir}
            onlyJalanMulus={params.onlyJalanMulus}
          />
        </aside>

        <div className="min-w-0 flex-1">
          {/* key tanpa limit: ganti filter menampilkan skeleton, "muat lebih banyak" tidak */}
          <Suspense key={params.resultsKey} fallback={<ResultsSkeleton />}>
            <ExploreResults params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
