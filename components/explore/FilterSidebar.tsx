// src/components/explore/FilterSidebar.tsx
'use client';

import { useKosFilter } from '@/hooks/useKosFilter';

export default function FilterSidebar() {
  const { currentArea, currentTipe, setFilter, resetFilters } = useKosFilter();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">Filter Pencarian</h2>
        <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline">
          Reset
        </button>
      </div>

      {/* Filter Area */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Area / Lokasi</label>
        <select 
          value={currentArea}
          onChange={(e) => setFilter('area', e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        >
          <option value="semua">Semua Area</option>
          <option value="Perintis Kemerdekaan 3">Perintis Kemerdekaan 3</option>
          <option value="Perintis Kemerdekaan 4">Perintis Kemerdekaan 4</option>
          <option value="Perintis Kemerdekaan 6">Perintis Kemerdekaan 6</option>
          <option value="Perintis Kemerdekaan 7">Perintis Kemerdekaan 7</option>
          <option value="Perintis Kemerdekaan 8">Perintis Kemerdekaan 8</option>
          <option value="Jalan Bung">Jalan Bung</option>
          <option value="Kera-Kera">Kera-Kera</option>
          <option value="Sahabat">Sahabat</option>
          <option value="Damai">Damai</option>
          <option value="Workshop">Workshop</option>
          <option value="Pintu Nol">Pintu Nol</option>
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