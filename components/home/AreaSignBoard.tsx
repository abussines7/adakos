// components/home/AreaSignBoard.tsx
// Daftar area sebagai papan penunjuk jalan hijau (dengan dua tiang).
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { AreaOption } from '@/src/lib/areas';

export default function AreaSignBoard({ areas }: { areas: AreaOption[] }) {
  if (areas.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="rounded-lg border-2 border-ink bg-sign p-2">
        <div className="rounded-md border-2 border-white/90 px-5 pb-3 pt-5 text-white">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-wide text-lg">Area sekitar Unhas</h2>
            <span className="font-mono text-xs text-white/75">{areas.length} area</span>
          </div>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {areas.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/explore?area=${encodeURIComponent(a.slug)}`}
                  className="group flex h-full items-center justify-between gap-3 border-b border-white/20 py-2.5 text-[15px] font-semibold leading-snug decoration-signal decoration-2 underline-offset-4 hover:underline"
                >
                  <span>{a.nama}</span>
                  <span className="flex shrink-0 items-center gap-1 font-mono text-xs font-normal text-white/75">
                    {a.jumlahKos} kos
                    <ArrowRight size={14} aria-hidden="true" className="text-signal transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div aria-hidden="true" className="flex justify-between px-[22%]">
        <span className="h-12 w-3 bg-ink" />
        <span className="h-12 w-3 bg-ink" />
      </div>
    </div>
  );
}
