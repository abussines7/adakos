// components/explore/KosCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import Badge from '../shared/Badge';
import { ImageOff, MapPin } from 'lucide-react';
import type { KosListRow } from '@/src/lib/kos-queries';

const BANJIR_BADGE = {
  aman: { variant: 'success', label: 'Aman Banjir' },
  kadang_tergenang: { variant: 'warning', label: 'Kadang Tergenang' },
  rawan: { variant: 'danger', label: 'Rawan Banjir' },
} as const;

export default function KosCard({ kos }: { kos: KosListRow }) {
  const banjirBadge = BANJIR_BADGE[kos.status_banjir];
  const fotoUtama = kos.foto_utama;

  // Format harga ke Rupiah
  const hargaFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(kos.harga_bulanan);

  return (
    <Link href={`/kos/${kos.slug}`} className="group block bg-white rounded-2xl border border-slate-200 hover:border-blue-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
      {/* Thumbnail Image */}
      <div className="aspect-video relative overflow-hidden bg-slate-100">
        {fotoUtama ? (
          <Image
            src={fotoUtama}
            alt={kos.nama}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400">
            <ImageOff size={28} />
            <span className="text-xs font-medium">Foto belum tersedia</span>
          </div>
        )}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={kos.tipe === 'putri' ? 'success' : kos.tipe === 'putra' ? 'primary' : 'warning'}>
            {kos.tipe}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <Badge variant={banjirBadge.variant}>{banjirBadge.label}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-900 mb-1">{kos.nama}</h3>
        <div className="flex items-center gap-1 text-slate-500 mb-3">
          <MapPin size={14} />
          <span className="text-sm">{kos.area?.nama}</span>
        </div>
        <div className="font-bold text-blue-600 text-lg mb-3">
          {hargaFormatted} <span className="text-sm font-normal text-slate-500">/ bulan</span>
        </div>
        
        {/* Road Condition Indicator */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            kos.kondisi_jalan === 'mulus'
              ? 'bg-blue-50 text-blue-700'
              : kos.kondisi_jalan === 'cukup_baik'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-red-50 text-red-700'
          }`}>
            <span>🛣️</span>
            <span>
              {kos.kondisi_jalan === 'mulus'
                ? 'Jalan mulus'
                : kos.kondisi_jalan === 'cukup_baik'
                ? 'Jalan cukup baik'
                : 'Jalan rusak'}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}