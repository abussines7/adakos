// components/detail/KosMap.tsx
'use client';

import dynamic from 'next/dynamic';
import { ExternalLink, MapPin } from 'lucide-react';

// Dynamic import dengan ssr: false — Leaflet bergantung pada `window` dan `document`.
// Skeleton loading mencegah Layout Shift (CLS) saat bundle peta diunduh.
const MapVisual = dynamic(() => import('./MapVisual'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full animate-pulse items-center justify-center bg-paper-deep">
      <span className="flex items-center gap-2 font-mono text-xs text-muted-ink">
        <MapPin size={16} aria-hidden="true" />
        Memuat peta…
      </span>
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
    <section aria-labelledby="lokasi-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="lokasi-heading" className="font-wide text-2xl">
          Lokasi
        </h2>
        <a
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
        >
          Buka di Google Maps
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
      <div className="mt-4 h-72 overflow-hidden rounded-md border-2 border-ink">
        <MapVisual lat={lat} lng={lng} namaKos={namaKos} />
      </div>
    </section>
  );
}
