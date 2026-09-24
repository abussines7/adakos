// components/home/HowWeRate.tsx
import { Construction, Route, Waves, type LucideIcon } from 'lucide-react';
import LevelMeter from '@/components/shared/LevelMeter';
import RouteLine from '@/components/shared/RouteLine';
import { BANJIR_INFO, JALAN_INFO, type LevelInfo } from '@/src/lib/kos-labels';

function CardHeader({ index, icon: Icon, title }: { index: string; icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3">
      <h3 className="flex items-center gap-2 font-bold">
        <Icon size={18} aria-hidden="true" className="text-sign" />
        {title}
      </h3>
      <span className="font-mono text-xs text-muted-ink">{index}</span>
    </div>
  );
}

function LevelLegend({ items }: { items: LevelInfo[] }) {
  return (
    <ul className="divide-y divide-line-soft px-5">
      {items.map((item) => (
        <li key={item.label} className="flex gap-3 py-3">
          <span className="pt-0.5">
            <LevelMeter level={item.level} />
          </span>
          <div>
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-muted-ink">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function HowWeRate() {
  return (
    <section id="cara-menilai" className="border-t-2 border-ink bg-paper-deep/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="kicker">Cara menilai</p>
        <h2 className="mt-2 max-w-2xl font-wide text-3xl leading-tight sm:text-4xl">
          Tiga hal yang jarang ditulis di iklan kos
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
          Setiap kos di Adakos punya tiga catatan ini. Bar di samping label menunjukkan tingkat waspada: makin banyak
          yang terisi, makin perlu hati-hati.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="panel overflow-hidden">
            <CardHeader index="01" icon={Waves} title="Risiko banjir" />
            <LevelLegend items={Object.values(BANJIR_INFO)} />
          </div>
          <div className="panel overflow-hidden">
            <CardHeader index="02" icon={Construction} title="Kondisi jalan" />
            <LevelLegend items={Object.values(JALAN_INFO)} />
          </div>
          <div className="panel overflow-hidden">
            <CardHeader index="03" icon={Route} title="Rute ke kampus" />
            <div className="px-5 py-5">
              <p className="mb-5 text-sm leading-relaxed text-muted-ink">
                Jalur dan perkiraan waktu dari kos ke gerbang kampus, dengan motor atau jalan kaki.
              </p>
              <RouteLine from="Kos kamu" to="Gerbang Utama Unhas" duration="5 menit naik motor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
