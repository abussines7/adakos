// src/app/explore/page.tsx
'use client';

import { Suspense, useState } from 'react';
import { useKosFilter } from '@/hooks/useKosFilter';
import KosCard from '@/components/explore/KosCard';
import FilterSidebar from '@/components/explore/FilterSidebar';
import EmptyState from '@/components/explore/EmptyState';
import { Sparkles } from 'lucide-react';

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="aspect-video bg-slate-200" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-slate-200 rounded-md w-3/4" />
            <div className="h-4 bg-slate-200 rounded-md w-1/2" />
            <div className="h-5 bg-slate-200 rounded-md w-1/3 pt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Komponen internal pembungkus agar useSearchParams aman
function ExploreContent() {
  const {
    filteredKos,
    resetFilters,
    loading,
    error,
    aiParams,
    currentAiQuery,
    currentArea,
    currentTipe,
    setFilter,
    total,
  } = useKosFilter();

  const [localAiQuery, setLocalAiQuery] = useState(currentAiQuery);
  const [prevAiQuery, setPrevAiQuery] = useState(currentAiQuery);

  if (currentAiQuery !== prevAiQuery) {
    setLocalAiQuery(currentAiQuery);
    setPrevAiQuery(currentAiQuery);
  }

  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localAiQuery.trim()) {
      setFilter('ai_query', localAiQuery.trim());
    } else {
      setFilter('ai_query', '');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Eksplorasi dengan Kolom AI Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Eksplorasi Kos</h1>
          <p className="text-slate-500 mt-1">Cari kos impian Anda di sekitar Universitas Hasanuddin.</p>
        </div>
        
        <form onSubmit={handleAiSearchSubmit} className="flex gap-2 max-w-md w-full">
          <input
            type="text"
            value={localAiQuery}
            onChange={(e) => setLocalAiQuery(e.target.value)}
            placeholder="Cari dengan AI (misal: kos putri jalan bung)"
            className="flex-grow px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>AI Search</span>
          </button>
        </form>
      </div>
      
      {/* AI Search Badges or Fallback Notice */}
      {aiParams && (
        aiParams.fallback ? (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles size={16} className="text-amber-600 shrink-0" />
              <span>Pencarian AI sedang sibuk atau tidak tersedia. Menampilkan hasil pencarian berbasis kata kunci.</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0"
            >
              Hapus
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sparkles size={12} className="animate-pulse" />
                <span>AI Smart Search Parsed Filters</span>
              </div>
              <div className="text-sm text-slate-700 font-medium mb-2">
                Menampilkan hasil pencarian berdasarkan ekstraksi AI:
              </div>
              <div className="flex flex-wrap gap-2">
                {aiParams.tipe && (
                  <span className="text-xs bg-white text-blue-700 px-3 py-1 rounded-full border border-blue-200 capitalize font-semibold shadow-sm">
                    Tipe: {aiParams.tipe}
                  </span>
                )}
                {aiParams.area_slug && (
                  <span className="text-xs bg-white text-blue-700 px-3 py-1 rounded-full border border-blue-200 capitalize font-semibold shadow-sm">
                    Area: {aiParams.area_slug.replaceAll('-', ' ')}
                  </span>
                )}
                {aiParams.status_banjir && (
                  <span className="text-xs bg-white text-blue-700 px-3 py-1 rounded-full border border-blue-200 capitalize font-semibold shadow-sm">
                    Banjir: {aiParams.status_banjir === 'aman' ? 'Bebas Banjir' : aiParams.status_banjir.replace('_', ' ')}
                  </span>
                )}
                {aiParams.kondisi_jalan && (
                  <span className="text-xs bg-white text-blue-700 px-3 py-1 rounded-full border border-blue-200 capitalize font-semibold shadow-sm">
                    Jalan: {aiParams.kondisi_jalan.replace('_', ' ')}
                  </span>
                )}
                {(aiParams.harga_min || aiParams.harga_max) && (
                  <span className="text-xs bg-white text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-semibold shadow-sm">
                    Harga: {aiParams.harga_min ? `Rp ${new Intl.NumberFormat('id-ID').format(aiParams.harga_min)}` : '0'} - {aiParams.harga_max ? `Rp ${new Intl.NumberFormat('id-ID').format(aiParams.harga_max)}` : '∞'}
                  </span>
                )}
                {aiParams.keyword && (
                  <span className="text-xs bg-white text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-semibold shadow-sm">
                    Kata Kunci: &quot;{aiParams.keyword}&quot;
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-xl transition-all self-start md:self-center cursor-pointer"
            >
              Hapus Filter AI
            </button>
          </div>
        )
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Kiri */}
        <div className="w-full md:w-64 shrink-0">
          <FilterSidebar
            currentArea={currentArea}
            currentTipe={currentTipe}
            setFilter={setFilter}
            resetFilters={resetFilters}
          />
        </div>

        {/* Grid Kanan */}
        <div className="flex-grow">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <div className="mb-4 text-sm text-slate-500">
            Menampilkan <span className="font-bold text-slate-900">{filteredKos.length}</span>
            {total > filteredKos.length ? ` dari ${total}` : ''} properti
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : filteredKos.length > 0 ? (
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