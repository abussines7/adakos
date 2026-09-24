// components/explore/AiParamsNotice.tsx
import Link from 'next/link';
import { Sparkles, X } from 'lucide-react';
import type { ClientAiParams } from '@/src/lib/ai-search';
import { BANJIR_INFO, JALAN_INFO, TIPE_LABEL, type KondisiJalan, type StatusBanjir, type TipeKos } from '@/src/lib/kos-labels';
import { formatRupiah } from '@/src/lib/format';

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-ink/20 bg-white px-2 py-1 text-xs">
      <span className="font-mono text-muted-ink">{label}</span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}

function ClearLink({ label }: { label: string }) {
  return (
    <Link
      href="/explore"
      className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold underline-offset-4 hover:underline"
    >
      <X size={14} aria-hidden="true" />
      {label}
    </Link>
  );
}

export default function AiParamsNotice({ aiParams }: { aiParams: ClientAiParams }) {
  if (aiParams.fallback) {
    return (
      <div className="mb-6 flex items-center justify-between gap-4 rounded-md border-2 border-ink bg-signal-tint px-4 py-3 text-sm">
        <p className="flex items-center gap-2">
          <Sparkles size={16} aria-hidden="true" className="shrink-0" />
          Pencarian AI sedang tidak tersedia. Hasil di bawah memakai pencarian kata kunci.
        </p>
        <ClearLink label="Hapus" />
      </div>
    );
  }

  const hargaText =
    aiParams.harga_min !== null || aiParams.harga_max !== null
      ? `${aiParams.harga_min ? formatRupiah(aiParams.harga_min) : 'Rp0'} – ${
          aiParams.harga_max ? formatRupiah(aiParams.harga_max) : 'tanpa batas'
        }`
      : null;

  return (
    <div className="mb-6 overflow-hidden rounded-md border-2 border-ink bg-white">
      <div className="flex items-center justify-between gap-3 bg-ink px-4 py-2 text-paper">
        <p className="flex items-center gap-2 font-mono text-xs">
          <Sparkles size={14} aria-hidden="true" className="text-signal" />
          Tafsiran AI dari pencarianmu
        </p>
        <Link href="/explore" className="text-xs font-semibold text-signal underline-offset-4 hover:underline">
          Hapus filter AI
        </Link>
      </div>
      <div className="flex flex-wrap gap-2 px-4 py-3">
        {aiParams.tipe && <Chip label="tipe" value={TIPE_LABEL[aiParams.tipe as TipeKos] ?? aiParams.tipe} />}
        {aiParams.area_slug && <Chip label="area" value={aiParams.area_slug.replaceAll('-', ' ')} />}
        {aiParams.status_banjir && (
          <Chip label="banjir" value={BANJIR_INFO[aiParams.status_banjir as StatusBanjir]?.label ?? aiParams.status_banjir} />
        )}
        {aiParams.kondisi_jalan && (
          <Chip label="jalan" value={JALAN_INFO[aiParams.kondisi_jalan as KondisiJalan]?.label ?? aiParams.kondisi_jalan} />
        )}
        {hargaText && <Chip label="harga" value={hargaText} />}
        {aiParams.keyword && <Chip label="kata kunci" value={`"${aiParams.keyword}"`} />}
        {!aiParams.tipe &&
          !aiParams.area_slug &&
          !aiParams.status_banjir &&
          !aiParams.kondisi_jalan &&
          !hargaText &&
          !aiParams.keyword && <span className="text-sm text-muted-ink">Tidak ada filter khusus, menampilkan semua kos.</span>}
      </div>
    </div>
  );
}
