// components/layout/SampleDataBanner.tsx
import { Info } from 'lucide-react';
import { SAMPLE_DATA_MODE } from '@/src/lib/site-config';

export default function SampleDataBanner() {
  if (!SAMPLE_DATA_MODE) {
    return null;
  }

  return (
    <div role="status" className="bg-amber-50 border-b border-amber-200 text-amber-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 text-xs sm:text-sm">
        <Info size={16} className="shrink-0 text-amber-600" />
        <span>
          Adakos masih dalam tahap uji coba. Seluruh data kos yang ditampilkan adalah <strong>data contoh</strong>, bukan kos sungguhan.
        </span>
      </div>
    </div>
  );
}
