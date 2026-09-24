// components/layout/SampleDataBanner.tsx
import { SAMPLE_DATA_MODE } from '@/src/lib/site-config';

export default function SampleDataBanner() {
  if (!SAMPLE_DATA_MODE) {
    return null;
  }

  return (
    <div role="status" className="border-b-2 border-ink bg-signal text-ink">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-xs sm:px-6 sm:text-sm lg:px-8">
        <span className="shrink-0 rounded-sm bg-ink px-1.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-signal">
          Uji coba
        </span>
        <span>
          Semua kos yang tampil di sini adalah <strong>data contoh</strong>, bukan kos sungguhan.
        </span>
      </div>
    </div>
  );
}
