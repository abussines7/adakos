// components/home/HeroSection.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';

interface AreaOption {
  id: string;
  nama: string;
  slug: string;
}

export default function HeroSection({ areas }: { areas: AreaOption[] }) {
  const router = useRouter();
  const [searchType, setSearchType] = useState<'standard' | 'ai'>('standard');
  const [selectedArea, setSelectedArea] = useState('semua');
  const [aiQuery, setAiQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === 'standard') {
      if (selectedArea === 'semua') {
        router.push('/explore');
      } else {
        router.push(`/explore?area=${encodeURIComponent(selectedArea)}`);
      }
    } else {
      if (aiQuery.trim()) {
        router.push(`/explore?ai_query=${encodeURIComponent(aiQuery.trim())}`);
      }
    }
  };

  return (
    <section className="bg-white border-b border-slate-100 py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="flex flex-col items-start text-left">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full uppercase tracking-wider mb-6">
            E-Katalog Indekos Unhas
          </span>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
            Cari Kos Dekat Unhas <br />
            <span className="text-blue-600">Tanpa Drama.</span>
          </h1>
          
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Info transparan, lokasi akurat, survei dari rumah. Bebas zonk.
          </p>

          {/* Compact Search Container */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2 space-y-2 mb-8">
            {/* Search mode toggle */}
            <div className="flex gap-2 max-w-[260px] p-1 bg-slate-200/50 rounded-xl">
              <button
                type="button"
                onClick={() => setSearchType('standard')}
                className={`flex-1 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                  searchType === 'standard' 
                    ? 'bg-white text-slate-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Pencarian Area
              </button>
              <button
                type="button"
                onClick={() => setSearchType('ai')}
                className={`flex-1 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  searchType === 'ai' 
                    ? 'bg-white text-slate-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Sparkles size={12} className={searchType === 'ai' ? 'text-blue-600' : 'text-slate-500'} />
                <span>AI Search</span>
              </button>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              {searchType === 'standard' ? (
                <select 
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer text-sm"
                >
                  <option value="semua">Semua Area Sekitar Unhas</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.slug}>
                      {a.nama}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Coba: 'kos putri dekat sahabat under 1jt bebas banjir'"
                  className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              )}
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 active:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Search size={18} />
                <span>Cari Kos</span>
              </button>
            </form>
          </div>

          {/* Social Proof Line */}
          <div className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2 flex-wrap">
            {areas.length > 0 && (
              <>
                <span>{areas.length} area</span>
                <span className="text-slate-300">•</span>
              </>
            )}
            <span>info kondisi jalan &amp; banjir</span>
            <span className="text-slate-300">•</span>
            <span>rute ke kampus</span>
          </div>
        </div>

        {/* Right Column (hidden on mobile) */}
        <div className="hidden lg:flex flex-col gap-4 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-3xl -m-6 -z-10" />
          <span className="self-end text-[10px] font-semibold text-slate-500 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
            Contoh tampilan
          </span>
          
          {/* Preview Card 1 */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-xs flex gap-4 items-center hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
              <div className="absolute inset-0 bg-pink-100 flex items-center justify-center text-pink-600 font-extrabold text-[10px] tracking-wider uppercase">Putri</div>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-pink-700 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-md uppercase">Putri</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Bebas Banjir
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mt-1 text-sm">Pondok Nirwana</h3>
              <p className="text-xs text-slate-500">Jl. Sahabat (Pintu Nol Unhas)</p>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                <span className="text-xs font-bold text-blue-600">Rp 850.000<span className="text-slate-400 font-normal">/bln</span></span>
                <span className="text-[10px] text-slate-500 font-medium">🛣️ Jalan Mulus</span>
              </div>
            </div>
          </div>

          {/* Preview Card 2 */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-xs flex gap-4 items-center translate-x-4 hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
              <div className="absolute inset-0 bg-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-[10px] tracking-wider uppercase">Putra</div>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase">Putra</span>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  ⚠️ Rawan Banjir
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mt-1 text-sm">Wisma Perdana</h3>
              <p className="text-xs text-slate-500">Kera-Kera (Pintu 2 Unhas)</p>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                <span className="text-xs font-bold text-blue-600">Rp 600.000<span className="text-slate-400 font-normal">/bln</span></span>
                <span className="text-[10px] text-slate-500 font-medium">🛣️ Jalan Cukup Baik</span>
              </div>
            </div>
          </div>

          {/* Preview Card 3 */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-xs flex gap-4 items-center hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300">
            <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
              <div className="absolute inset-0 bg-purple-100 flex items-center justify-center text-purple-600 font-extrabold text-[10px] tracking-wider uppercase">Campur</div>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md uppercase">Campur</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Bebas Banjir
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mt-1 text-sm">Exclusive Room Bung</h3>
              <p className="text-xs text-slate-500">Jl. Bung (Perintis Kemerdekaan)</p>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                <span className="text-xs font-bold text-blue-600">Rp 1.500.000<span className="text-slate-400 font-normal">/bln</span></span>
                <span className="text-[10px] text-slate-500 font-medium">🛣️ Jalan Mulus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}