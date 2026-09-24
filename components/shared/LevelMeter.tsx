// components/shared/LevelMeter.tsx
import type { RiskLevel } from '@/src/lib/kos-labels';

const TONE: Record<RiskLevel, string> = {
  1: 'bg-sign',
  2: 'bg-signal',
  3: 'bg-alert',
};

const SIZE = {
  sm: { box: 'h-3 gap-[2px]', bar: 'w-[3px]', heights: ['h-1', 'h-2', 'h-3'] },
  lg: { box: 'h-7 gap-1', bar: 'w-2', heights: ['h-2.5', 'h-[18px]', 'h-7'] },
};

/**
 * Indikator tingkat waspada 3 bar, seperti papan pengukur ketinggian air.
 * Bar terisi = tingkat; warna hijau / kuning / merah. Label teks tetap wajib
 * ditampilkan di sebelahnya, karena warna saja tidak cukup untuk aksesibilitas.
 */
export default function LevelMeter({ level, size = 'sm' }: { level: RiskLevel; size?: 'sm' | 'lg' }) {
  const s = SIZE[size];
  return (
    <span aria-hidden="true" className={`inline-flex items-end shrink-0 ${s.box}`}>
      {s.heights.map((height, idx) => (
        <span
          key={height}
          className={`${s.bar} ${height} rounded-[1px] ${idx < level ? TONE[level] : 'bg-line-soft'}`}
        />
      ))}
    </span>
  );
}
