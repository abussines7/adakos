// hooks/useKosFilter.ts
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { kosData } from '@/data/kos-data';
import { KosProperty } from '@/data/types';

/**
 * Hook filter kos murni berbasis URL Search Params.
 * Menggantikan arsitektur Zustand + bridge yang redundan.
 *
 * Alasan migrasi:
 * - URL Search Params = single source of truth (shareable, bookmarkable)
 * - Menghapus lapisan sinkronisasi Zustand ↔ URL yang rawan race condition
 * - Mengurangi bundle size (Zustand ~3KB gzip dihapus)
 */

/** Fungsi filter murni — dipanggil dalam useMemo agar tidak recompute tiap render */
function filterKos(area: string, tipe: string): KosProperty[] {
  return kosData.filter((kos) => {
    const matchArea = area === 'semua' || kos.area === area;
    const matchTipe = tipe === 'semua' || kos.tipe === tipe;
    return matchArea && matchTipe;
  });
}

export function useKosFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Baca state langsung dari URL — tidak ada intermediate store
  const currentArea = searchParams.get('area') || 'semua';
  const currentTipe = searchParams.get('tipe') || 'semua';

  // Derived state: hasil filter di-memo agar stabil selama params tidak berubah
  const filteredKos = useMemo(
    () => filterKos(currentArea, currentTipe),
    [currentArea, currentTipe]
  );

  // Tulis filter ke URL — useCallback mencegah re-create fungsi tiap render
  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === 'semua' || !value) {
        // Hapus param default agar URL tetap bersih
        params.delete(key);
      } else {
        params.set(key, value);
      }

      const queryString = params.toString();
      router.push(queryString ? `/explore?${queryString}` : '/explore');
    },
    [searchParams, router]
  );

  // Reset = navigasi ke /explore tanpa params
  const resetFilters = useCallback(() => {
    router.push('/explore');
  }, [router]);

  return {
    currentArea,
    currentTipe,
    setFilter,
    resetFilters,
    filteredKos,
  };
}