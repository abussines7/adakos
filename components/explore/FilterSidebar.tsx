// src/components/explore/FilterSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface AreaOption {
  id: string;
  nama: string;
  slug: string;
}

interface FilterSidebarProps {
  currentArea: string;
  currentTipe: string;
  setFilter: (key: string, value: string) => void;
  resetFilters: () => void;
}

export default function FilterSidebar({
  currentArea,
  currentTipe,
  setFilter,
  resetFilters,
}: FilterSidebarProps) {
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

      <div className="mb-6">
        <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Area / Lokasi</span>
        <div className="relative">
          <select
            value={currentArea}
            onChange={(e) => setFilter('area', e.target.value)}
            className="w-full p-2.5 pr-10 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm cursor-pointer appearance-none"
          >
            <option value="semua">Semua Area</option>
            {areas.map((a) => (
              <option key={a.id} value={a.slug}>
                {a.nama}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      <div>
        <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Tipe Kos</span>
        <div className="flex flex-wrap gap-2">
          {['semua', 'putra', 'putri', 'campur'].map((tipe) => {
            const isActive = currentTipe === tipe;
            const displayLabel = tipe === 'semua' ? 'Semua' : tipe === 'putra' ? 'Putra' : tipe === 'putri' ? 'Putri' : 'Campur';
            return (
              <button
                key={tipe}
                type="button"
                onClick={() => setFilter('tipe', tipe)}
                className={`cursor-pointer transition-all ${
                  isActive
                    ? 'bg-blue-600 border border-blue-600 text-white rounded-full px-3 py-1.5 text-xs font-semibold'
                    : 'bg-white border border-slate-200 text-slate-600 rounded-full px-3 py-1.5 text-xs font-semibold hover:border-slate-300'
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
