// hooks/useKosFilter.ts
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { KosProperty } from '@/data/types';

export function useKosFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil parameter pencarian dari URL
  const currentArea = searchParams.get('area') || 'semua';
  const currentTipe = searchParams.get('tipe') || 'semua';
  const currentQ = searchParams.get('q') || '';
  const currentAiQuery = searchParams.get('ai_query') || '';

  // State untuk data dinamis
  const [filteredKos, setFilteredKos] = useState<KosProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [aiParams, setAiParams] = useState<any>(null);

  useEffect(() => {
    let active = true;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let res;
        
        // Pilihan 1: Pencarian berbasis AI (Gemini)
        if (currentAiQuery) {
          res = await fetch('/api/search/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: currentAiQuery }),
          });
        } 
        // Pilihan 2: Pencarian standar database
        else {
          const params = new URLSearchParams();
          
          if (currentArea !== 'semua') {
            // Konversi nama area ke slug
            const areaSlug = currentArea
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '');
            params.set('area', areaSlug);
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
          // Petakan data dari backend ke interface KosProperty
          const mapped: KosProperty[] = (json.data || []).map((row: any) => ({
            id: row.slug,
            nama: row.nama,
            tipe: row.tipe,
            area: row.area ? row.area.nama : '',
            harga_bulanan: row.harga_bulanan,
            foto: row.foto_utama ? [row.foto_utama] : (row.foto ? row.foto.map((f: any) => f.url) : []),
            status_banjir: row.status_banjir,
            kondisi_jalan: row.kondisi_jalan,
            fasilitas_internal: row.fasilitas_internal || [],
            akses_kendaraan: row.akses_kendaraan || [],
            fasilitas_sekitar: row.fasilitas_sekitar || [],
            rute_kampus: row.rute_kampus || [],
            koordinat: row.koordinat || { lat: 0, lng: 0 },
            kontak_pemilik: row.pemilik ? row.pemilik.telepon : '',
          }));
          
          setFilteredKos(mapped);
          setAiParams(json.ai_params || null);
        }
      } catch (err: any) {
        if (active) {
          console.error('Error fetching filtered kos:', err);
          setError(err.message || 'Terjadi kesalahan saat memuat data');
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

  // Set filter ke URL Search Params secara reaktif
  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Hapus filter AI saat user berinteraksi dengan filter manual sidebar
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
  };
}