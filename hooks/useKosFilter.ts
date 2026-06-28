// hooks/useKosFilter.ts
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { KosProperty } from '@/data/types';
import type { ClientAiParams } from '@/src/lib/ai-search';

export type KosFilterControls = {
  currentArea: string;
  currentTipe: string;
  currentAiQuery: string;
  setFilter: (key: string, value: string) => void;
  resetFilters: () => void;
  filteredKos: KosProperty[];
  loading: boolean;
  error: string | null;
  aiParams: ClientAiParams | null;
  total: number;
};

export function useKosFilter(): KosFilterControls {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentArea = searchParams.get('area') || 'semua';
  const currentTipe = searchParams.get('tipe') || 'semua';
  const currentQ = searchParams.get('q') || '';
  const currentAiQuery = searchParams.get('ai_query') || '';

  const [filteredKos, setFilteredKos] = useState<KosProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [aiParams, setAiParams] = useState<ClientAiParams | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let res;

        if (currentAiQuery) {
          res = await fetch('/api/search/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: currentAiQuery }),
          });
        } else {
          const params = new URLSearchParams();

          if (currentArea !== 'semua') {
            params.set('area', currentArea);
          }

          if (currentTipe !== 'semua') {
            params.set('tipe', currentTipe);
          }

          if (currentQ) {
            params.set('q', currentQ);
          }

          res = await fetch(`/api/kos?${params.toString()}`);
        }

        if (!res.ok) {
          throw new Error(`Gagal memuat data (HTTP ${res.status})`);
        }

        const json = await res.json();

        if (active) {
          const mapped: KosProperty[] = (json.data || []).map(
            (row: {
              slug: string;
              nama: string;
              tipe: KosProperty['tipe'];
              area: { nama: string } | null;
              harga_bulanan: number;
              foto_utama?: string;
              foto?: { url: string }[];
              status_banjir: KosProperty['status_banjir'];
              kondisi_jalan: KosProperty['kondisi_jalan'];
              fasilitas_internal?: string[];
              akses_kendaraan?: KosProperty['akses_kendaraan'];
              fasilitas_sekitar?: KosProperty['fasilitas_sekitar'];
              rute_kampus?: KosProperty['rute_kampus'];
              koordinat?: KosProperty['koordinat'];
              pemilik?: { telepon: string };
            }) => ({
              id: row.slug,
              nama: row.nama,
              tipe: row.tipe,
              area: row.area ? row.area.nama : '',
              harga_bulanan: row.harga_bulanan,
              foto: row.foto_utama
                ? [row.foto_utama]
                : row.foto
                  ? row.foto.map((f) => f.url)
                  : [],
              status_banjir: row.status_banjir,
              kondisi_jalan: row.kondisi_jalan,
              fasilitas_internal: row.fasilitas_internal || [],
              akses_kendaraan: row.akses_kendaraan || [],
              fasilitas_sekitar: row.fasilitas_sekitar || [],
              rute_kampus: row.rute_kampus || [],
              koordinat: row.koordinat || { lat: 0, lng: 0 },
              kontak_pemilik: row.pemilik ? row.pemilik.telepon : '',
            })
          );

          setFilteredKos(mapped);
          setAiParams(json.ai_params || null);
          setTotal(typeof json.total === 'number' ? json.total : mapped.length);
        }
      } catch (err) {
        if (active) {
          console.error('Error fetching filtered kos:', err);
          setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [currentArea, currentTipe, currentQ, currentAiQuery]);

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (key !== 'ai_query') {
        params.delete('ai_query');
      }

      if (value === 'semua' || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      const queryString = params.toString();
      router.push(queryString ? `/explore?${queryString}` : '/explore');
    },
    [searchParams, router]
  );

  const resetFilters = useCallback(() => {
    router.push('/explore');
  }, [router]);

  return {
    currentArea,
    currentTipe,
    currentAiQuery,
    setFilter,
    resetFilters,
    filteredKos,
    loading,
    error,
    aiParams,
    total,
  };
}
