// components/detail/InfoBoard.tsx
// Ringkasan akses kos sebagai papan rambu hijau: dibaca sekilas, detail di bawahnya.
import LevelMeter from '@/components/shared/LevelMeter';
import { BANJIR_INFO, JALAN_INFO, type KondisiJalan, type StatusBanjir } from '@/src/lib/kos-labels';

interface InfoBoardProps {
  statusBanjir: StatusBanjir;
  kondisiJalan: KondisiJalan;
  estimasiKeKampus?: string;
  aksesKendaraan: string[];
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-sign px-4 py-3">
      <dt className="font-mono text-[11px] text-white/70">{label}</dt>
      <dd className="mt-1 flex items-center gap-2 text-sm font-semibold leading-snug text-white">{children}</dd>
    </div>
  );
}

function MeterChip({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex rounded-sm bg-white px-1.5 py-1">
      <LevelMeter level={level} />
    </span>
  );
}

export default function InfoBoard({ statusBanjir, kondisiJalan, estimasiKeKampus, aksesKendaraan }: InfoBoardProps) {
  const banjir = BANJIR_INFO[statusBanjir];
  const jalan = JALAN_INFO[kondisiJalan];
  const kendaraan =
    aksesKendaraan.length === 0
      ? 'Tidak ada data'
      : aksesKendaraan.map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(' dan ');

  return (
    <div className="rounded-lg border-2 border-ink bg-sign p-1.5">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border-2 border-white/90 bg-white/30 lg:grid-cols-4">
        <Item label="Banjir">
          <MeterChip level={banjir.level} />
          {banjir.label}
        </Item>
        <Item label="Jalan">
          <MeterChip level={jalan.level} />
          {jalan.label}
        </Item>
        <Item label="Ke kampus">{estimasiKeKampus ?? 'Belum ada data'}</Item>
        <Item label="Kendaraan">{kendaraan}</Item>
      </dl>
    </div>
  );
}
