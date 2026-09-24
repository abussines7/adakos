// components/detail/AccessibilitySection.tsx
import { Bike, Car, Construction, Route, Store, Waves, type LucideIcon } from 'lucide-react';
import LevelMeter from '@/components/shared/LevelMeter';
import RouteLine from '@/components/shared/RouteLine';
import type { KosProperty } from '@/data/types';
import { BANJIR_INFO, JALAN_INFO, type LevelInfo, type RiskLevel } from '@/src/lib/kos-labels';
import { formatJarak } from '@/src/lib/format';

const LEVEL_STRIP: Record<RiskLevel, string> = {
  1: 'bg-sign',
  2: 'bg-signal',
  3: 'bg-alert',
};

function PanelTitle({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 font-bold">
      <Icon size={18} aria-hidden="true" className="text-sign" />
      {children}
    </h3>
  );
}

function LevelPanel({
  icon,
  title,
  info,
  children,
}: {
  icon: LucideIcon;
  title: string;
  info: LevelInfo;
  children?: React.ReactNode;
}) {
  return (
    <div className="panel overflow-hidden">
      <div aria-hidden="true" className={`h-1.5 ${LEVEL_STRIP[info.level]}`} />
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <PanelTitle icon={icon}>{title}</PanelTitle>
          <span className="font-mono text-xs text-muted-ink">waspada {info.level}/3</span>
        </div>
        <p className="mt-4 flex items-center gap-3 text-xl font-bold">
          <LevelMeter level={info.level} size="lg" />
          {info.label}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{info.description}</p>
        {children}
      </div>
    </div>
  );
}

export default function AccessibilitySection({ kos }: { kos: KosProperty }) {
  const sekitar = [...kos.fasilitas_sekitar].sort((a, b) => a.jarak_meter - b.jarak_meter);

  return (
    <section aria-labelledby="akses-heading">
      <h2 id="akses-heading" className="font-wide text-2xl">
        Akses dan lingkungan
      </h2>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <LevelPanel icon={Waves} title="Risiko banjir" info={BANJIR_INFO[kos.status_banjir]} />
        <LevelPanel icon={Construction} title="Kondisi jalan" info={JALAN_INFO[kos.kondisi_jalan]}>
          {kos.akses_kendaraan.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {kos.akses_kendaraan.map((kendaraan) => {
                const Icon = kendaraan === 'mobil' ? Car : Bike;
                return (
                  <span
                    key={kendaraan}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-ink/20 bg-paper px-2 py-1 text-xs font-semibold capitalize"
                  >
                    <Icon size={14} aria-hidden="true" />
                    Bisa {kendaraan}
                  </span>
                );
              })}
            </div>
          )}
        </LevelPanel>

        <div className="panel p-5">
          <PanelTitle icon={Route}>Rute ke kampus</PanelTitle>
          {kos.rute_kampus.length > 0 ? (
            <div className="mt-5 space-y-6">
              {kos.rute_kampus.map((rute) => (
                <RouteLine key={rute.rute} from={kos.nama} to={rute.rute} duration={rute.estimasi_waktu} />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-ink">Rute ke kampus belum dicatat.</p>
          )}
        </div>

        <div className="panel p-5">
          <PanelTitle icon={Store}>Sekitar kos</PanelTitle>
          {sekitar.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {sekitar.map((tempat) => (
                <li key={tempat.nama} className="flex items-baseline gap-2 text-sm">
                  <span className="font-medium">{tempat.nama}</span>
                  <span aria-hidden="true" className="flex-1 border-b-2 border-dotted border-ink/25" />
                  <span className="font-mono text-xs text-ink-soft">{formatJarak(tempat.jarak_meter)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-ink">Fasilitas sekitar belum dicatat.</p>
          )}
        </div>
      </div>
    </section>
  );
}
