// components/explore/KosCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ImageOff, MapPin } from 'lucide-react';
import AccessChip from '@/components/shared/AccessChip';
import type { KosListRow } from '@/src/lib/kos-queries';
import { BANJIR_INFO, JALAN_INFO, TIPE_LABEL } from '@/src/lib/kos-labels';
import { formatRupiah } from '@/src/lib/format';

export default function KosCard({ kos }: { kos: KosListRow }) {
  const banjir = BANJIR_INFO[kos.status_banjir];
  const jalan = JALAN_INFO[kos.kondisi_jalan];

  return (
    <Link
      href={`/kos/${kos.slug}`}
      className="group flex flex-col panel overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_6px_0_var(--sign)]"
    >
      <div className="relative aspect-[4/3] bg-paper-deep border-b-2 border-ink overflow-hidden">
        {kos.foto_utama ? (
          <Image
            src={kos.foto_utama}
            alt={kos.nama}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-ink">
            <ImageOff size={28} aria-hidden="true" />
            <span className="text-xs font-medium">Foto belum tersedia</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-sm bg-ink px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-paper">
          {TIPE_LABEL[kos.tipe]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-[17px] font-bold leading-snug decoration-2 underline-offset-4 group-hover:underline">
            {kos.nama}
          </h3>
          {kos.area && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-ink">
              <MapPin size={14} aria-hidden="true" className="shrink-0" />
              {kos.area.nama}
            </p>
          )}
        </div>

        <p className="font-mono text-lg font-semibold">
          {formatRupiah(kos.harga_bulanan)}
          <span className="text-sm font-normal text-muted-ink">/bln</span>
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          <AccessChip level={banjir.level} label={banjir.label} />
          <AccessChip level={jalan.level} label={jalan.label} />
        </div>
      </div>
    </Link>
  );
}
