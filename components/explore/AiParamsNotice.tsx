// components/explore/AiParamsNotice.tsx
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { ClientAiParams } from '@/src/lib/ai-search';

const formatRupiah = (value: number) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;

function FilterChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs bg-white text-blue-700 px-3 py-1 rounded-full border border-blue-200 capitalize font-semibold shadow-sm">
      {children}
    </span>
  );
}

export default function AiParamsNotice({ aiParams }: { aiParams: ClientAiParams }) {
  if (aiParams.fallback) {
    return (
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles size={16} className="text-amber-600 shrink-0" />
          <span>Pencarian AI sedang sibuk atau tidak tersedia. Menampilkan hasil pencarian berbasis kata kunci.</span>
        </div>
        <Link
          href="/explore"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-all shrink-0"
        >
          Hapus
        </Link>
      </div>
    );
  }

  const hasHarga = aiParams.harga_min !== null || aiParams.harga_max !== null;

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
          <Sparkles size={12} className="animate-pulse" />
          <span>AI Smart Search Parsed Filters</span>
        </div>
        <div className="text-sm text-slate-700 font-medium mb-2">Menampilkan hasil pencarian berdasarkan ekstraksi AI:</div>
        <div className="flex flex-wrap gap-2">
          {aiParams.tipe && <FilterChip>Tipe: {aiParams.tipe}</FilterChip>}
          {aiParams.area_slug && <FilterChip>Area: {aiParams.area_slug.replaceAll('-', ' ')}</FilterChip>}
          {aiParams.status_banjir && (
            <FilterChip>
              Banjir: {aiParams.status_banjir === 'aman' ? 'Bebas Banjir' : aiParams.status_banjir.replaceAll('_', ' ')}
            </FilterChip>
          )}
          {aiParams.kondisi_jalan && <FilterChip>Jalan: {aiParams.kondisi_jalan.replaceAll('_', ' ')}</FilterChip>}
          {hasHarga && (
            <FilterChip>
              Harga: {aiParams.harga_min ? formatRupiah(aiParams.harga_min) : '0'} -{' '}
              {aiParams.harga_max ? formatRupiah(aiParams.harga_max) : '∞'}
            </FilterChip>
          )}
          {aiParams.keyword && <FilterChip>Kata Kunci: &quot;{aiParams.keyword}&quot;</FilterChip>}
        </div>
      </div>
      <Link
        href="/explore"
        className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-xl transition-all self-start md:self-center"
      >
        Hapus Filter AI
      </Link>
    </div>
  );
}
