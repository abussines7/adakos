// components/home/HeroSection.tsx
import HeroSearch from '@/components/home/HeroSearch';
import AreaSignBoard from '@/components/home/AreaSignBoard';
import type { AreaOption } from '@/src/lib/areas';

export default function HeroSection({ areas }: { areas: AreaOption[] }) {
  const totalKos = areas.reduce((sum, a) => sum + a.jumlahKos, 0);

  return (
    <section className="border-b-2 border-ink bg-map-grid">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:py-20">
        <div>
          <p className="kicker">Tamalanrea · Makassar</p>
          <h1 className="mt-3 font-wide text-[2.5rem] leading-[1.02] sm:text-5xl lg:text-[3.5rem]">
            Cari kos dekat Unhas. Cek jalannya dulu.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Setiap kos dicatat kondisi jalannya, risiko banjirnya, dan rute ke kampusnya. Hal yang biasanya baru
            ketahuan setelah pindah.
          </p>
          <div className="mt-8 max-w-xl">
            <HeroSearch areas={areas} />
          </div>
          {areas.length > 0 && (
            <p className="mt-4 font-mono text-xs text-muted-ink">
              {areas.length} area · {totalKos} kos terdaftar
            </p>
          )}
        </div>
        <AreaSignBoard areas={areas} />
      </div>
    </section>
  );
}
