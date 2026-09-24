// components/shared/AccessChip.tsx
import LevelMeter from '@/components/shared/LevelMeter';
import type { RiskLevel } from '@/src/lib/kos-labels';

export default function AccessChip({ level, label }: { level: RiskLevel; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-ink/15 bg-paper px-2 py-1 text-xs font-semibold text-ink">
      <LevelMeter level={level} />
      {label}
    </span>
  );
}
