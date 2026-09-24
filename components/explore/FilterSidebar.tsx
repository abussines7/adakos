// components/explore/FilterSidebar.tsx
'use client';

import { ChevronDown } from 'lucide-react';
import { useExploreNavigation } from '@/hooks/useExploreNavigation';
import type { AreaOption } from '@/src/lib/areas';

const TIPE_OPTIONS = [
  { value: 'semua', label: 'Semua' },
  { value: 'putra', label: 'Putra' },
  { value: 'putri', label: 'Putri' },
  { value: 'campur', label: 'Campur' },
];

interface FilterSidebarProps {
  areas: AreaOption[];
  currentArea: string;
  currentTipe: string;
}

export default function FilterSidebar({ areas, currentArea, currentTipe }: FilterSidebarProps) {
  const { setFilter, resetFilters } = useExploreNavigation();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">Filter Pencarian</h2>
        <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline cursor-pointer">
          Reset
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="filter-area" className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
          Area / Lokasi
        </label>
        <div className="relative">
          <select
            id="filter-area"
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
          {TIPE_OPTIONS.map(({ value, label }) => {
            const isActive = currentTipe === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter('tipe', value)}
                className={`cursor-pointer transition-all rounded-full px-3 py-1.5 text-xs font-semibold border ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
