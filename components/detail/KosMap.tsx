// components/detail/KosMap.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamic import dengan ssr: false — Leaflet bergantung pada `window` dan `document`.
// Skeleton loading mencegah Layout Shift (CLS) saat bundle peta diunduh.
const MapVisual = dynamic(() => import('./MapVisual'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center border border-slate-200">
      <div className="flex flex-col items-center gap-2">
        <svg
          className="w-8 h-8 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
        <span className="text-sm text-slate-400 font-medium">Memuat Peta Lokasi...</span>
      </div>
    </div>
  ),
});

interface KosMapProps {
  lat: number;
  lng: number;
  namaKos: string;
}

export default function KosMap({ lat, lng, namaKos }: KosMapProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        📍 Lokasi di Peta
      </h2>
      <div className="h-72 rounded-2xl overflow-hidden border border-slate-200">
        <MapVisual lat={lat} lng={lng} namaKos={namaKos} />
      </div>
    </section>
  );
}
