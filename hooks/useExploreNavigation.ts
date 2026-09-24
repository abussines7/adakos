// hooks/useExploreNavigation.ts
'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Filter halaman explore disimpan di URL (single source of truth).
 * Data diambil oleh Server Component berdasarkan URL tersebut.
 */
export function useExploreNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      // Filter manual menggantikan pencarian AI, dan hasil kembali ke halaman awal.
      params.delete('ai_query');
      params.delete('limit');

      if (value === 'semua' || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      const queryString = params.toString();
      router.push(queryString ? `/explore?${queryString}` : '/explore', { scroll: false });
    },
    [searchParams, router]
  );

  const resetFilters = useCallback(() => {
    router.push('/explore', { scroll: false });
  }, [router]);

  return { setFilter, resetFilters };
}
