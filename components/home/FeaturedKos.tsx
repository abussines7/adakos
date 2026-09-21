import KosCard from '../explore/KosCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { KosProperty } from '@/data/types';

interface FeaturedKosProps {
  kosList: KosProperty[];
}

export default function FeaturedKos({ kosList }: FeaturedKosProps) {
  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div className="pl-4 border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Pilihan Populer</h2>
            <p className="text-slate-500">Kos favorit mahasiswa Unhas minggu ini.</p>
          </div>
          <Link href="/explore" className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kosList.map((kos) => (
            <KosCard key={kos.id} kos={kos} />
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link href="/explore" className="inline-flex items-center gap-2 text-blue-600 font-semibold bg-blue-50 px-6 py-3 rounded-xl">
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}