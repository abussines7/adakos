// src/components/explore/FilterSidebar.tsx
'use client';

import { useKosFilter } from '@/hooks/useKosFilter';
import { useState, useEffect } from 'react';

interface AreaOption {
  id: string;
  nama: string;
  slug: string;
}

export default function FilterSidebar() {
  const { currentArea, currentTipe, setFilter, resetFilters } = useKosFilter();
  const [areas, setAreas] = useState<AreaOption[]>([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch('/api/areas');
        const json = await res.json();
        if (json.data) {
          setAreas(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch areas:', err);
      }
    };
    fetchAreas();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">Filter Pencarian</h2>
        <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline cursor-pointer">
          Reset
        </button>
      </div>

      {/* Filter Area */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Area / Lokasi</label>
        <select 
          value={currentArea}
          onChange={(e) => setFilter('area', e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer"
        >
          <option value="semua">Semua Area</option>
          {areas.map((a) => (
            <option key={a.id} value={a.nama}>
              {a.nama}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Tipe */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Tipe Kos</label>
        <div className="flex flex-col gap-2">
          {['semua', 'putra', 'putri', 'campur'].map((tipe) => (
            <label key={tipe} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="tipe" 
                value={tipe}
                checked={currentTipe === tipe}
                onChange={(e) => setFilter('tipe', e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm capitalize">{tipe}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}