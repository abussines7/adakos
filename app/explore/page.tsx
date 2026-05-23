// src/app/explore/page.tsx
'use client';

import { Suspense } from 'react';
import { useKosFilter } from '@/hooks/useKosFilter';
import KosCard from '@/components/explore/KosCard';
import FilterSidebar from '@/components/explore/FilterSidebar';
import EmptyState from '@/components/explore/EmptyState';

// Komponen internal pembungkus agar useSearchParams aman
function ExploreContent() {
  const { filteredKos, resetFilters } = useKosFilter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Eksplorasi Kos</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Kiri */}
        <div className="w-full md:w-64 shrink-0">
          <FilterSidebar />
        </div>

        {/* Grid Kanan */}
        <div className="flex-grow">
          <div className="mb-4 text-sm text-slate-500">
            Menampilkan <span className="font-bold text-slate-900">{filteredKos.length}</span> properti
          </div>

          {filteredKos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKos.map(kos => (
                <KosCard key={kos.id} kos={kos} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={resetFilters} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat data...</div>}>
      <ExploreContent />
    </Suspense>
  );
}