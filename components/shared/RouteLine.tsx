// components/shared/RouteLine.tsx
// Rute dari kos ke kampus digambar seperti diagram jalur transit:
// halte awal (kos), garis hijau, dan halte tujuan kuning.
import { Bike, Clock3, Footprints } from 'lucide-react';
import { travelMode } from '@/src/lib/kos-labels';

interface RouteLineProps {
  from: string;
  to: string;
  duration: string;
}

export default function RouteLine({ from, to, duration }: RouteLineProps) {
  const mode = travelMode(duration);
  const ModeIcon = mode === 'motor' ? Bike : mode === 'jalan' ? Footprints : Clock3;

  return (
    <div className="grid grid-cols-[22px_1fr] gap-x-3">
      <span aria-hidden="true" className="mt-0.5 h-[22px] w-[22px] rounded-full border-[3px] border-ink bg-white" />
      <p className="text-sm font-semibold leading-snug">{from}</p>

      <span aria-hidden="true" className="mx-auto h-full min-h-12 w-[6px] bg-sign" />
      <p className="flex items-center gap-2 py-3 font-mono text-xs text-ink-soft">
        <ModeIcon size={15} aria-hidden="true" className="shrink-0 text-sign" />
        {duration}
      </p>

      <span aria-hidden="true" className="h-[22px] w-[22px] rounded-full border-[3px] border-ink bg-signal" />
      <p className="text-sm font-semibold leading-snug">{to}</p>
    </div>
  );
}
