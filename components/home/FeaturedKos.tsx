// components/home/FeaturedKos.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import KosCard from '@/components/explore/KosCard';
import type { KosListRow } from '@/src/lib/kos-queries';

export default function FeaturedKos({ kosList }: { kosList: KosListRow[] }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Baru ditambahkan</p>
          <h2 className="mt-2 font-wide text-3xl sm:text-4xl">Kos terbaru</h2>
        </div>
        <Link href="/explore" className="btn btn-ghost">
          Lihat semua kos
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {kosList.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kosList.map((kos) => (
            <KosCard key={kos.slug} kos={kos} />
          ))}
        </div>
      ) : (
        <p className="rounded-md border-2 border-dashed border-ink/30 p-8 text-center text-muted-ink">
          Belum ada kos yang bisa ditampilkan saat ini.
        </p>
      )}
    </section>
  );
}
