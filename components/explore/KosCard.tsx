// components/explore/KosCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import Badge from '../shared/Badge';
import { MapPin } from 'lucide-react';
import { KosProperty } from '@/data/types';

export default function KosCard({ kos }: { kos: KosProperty }) {
  // Format harga ke Rupiah
  const hargaFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(kos.harga_bulanan);

  return (
    <Link href={`/kos/${kos.id}`} className="group block bg-white rounded-2xl border border-slate-200 hover:border-blue-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
      {/* Thumbnail Image */}
      <div className="aspect-video relative overflow-hidden bg-slate-100">
        <Image
          src={kos.foto[0]}
          alt={kos.nama}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={kos.tipe === 'putri' ? 'success' : kos.tipe === 'putra' ? 'primary' : 'warning'}>
            {kos.tipe}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <Badge variant={kos.status_banjir === 'aman' ? 'success' : 'danger'}>
            {kos.status_banjir === 'aman' ? 'Aman Banjir' : 'Rawan Banjir'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-900 mb-1">{kos.nama}</h3>
        <div className="flex items-center gap-1 text-slate-500 mb-3">
          <MapPin size={14} />
          <span className="text-sm">{kos.area}</span>
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