// src/components/explore/EmptyState.tsx
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
      <div className="bg-slate-50 p-4 rounded-full mb-4">
        <SearchX size={32} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">Kos Tidak Ditemukan</h3>
      <p className="text-slate-500 max-w-md mb-6">
        Kami belum memiliki properti yang sesuai dengan kriteria filter Anda saat ini. Coba ubah area atau tipe kos.
      </p>
      <button 
        onClick={onReset}
        className="px-6 py-2 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-colors"
      >
        Atur Ulang Filter
      </button>
    </div>
  );
}