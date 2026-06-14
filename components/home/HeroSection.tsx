// components/home/HeroSection.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';

export default function HeroSection() {
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
    <section className="bg-gradient-to-br from-blue-600 to-indigo-800 py-20 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-3xl mx-auto text-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Cari Kos Dekat Unhas Tanpa Drama.</h1>
        <p className="text-lg text-blue-100 mb-10">Info transparan, lokasi akurat, survei dari rumah. Bebas zonk.</p>
        
        {/* Toggle Mode Pencarian */}
        <div className="flex justify-center gap-3 mb-6 max-w-sm mx-auto p-1 bg-blue-900/40 rounded-xl">
          <button
            type="button"
            onClick={() => setSearchType('standard')}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
              searchType === 'standard' 
                ? 'bg-white text-blue-700 shadow-md' 
                : 'text-blue-100 hover:text-white'
            }`}
          >
            Pencarian Area
          </button>
          <button
            type="button"
            onClick={() => setSearchType('ai')}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              searchType === 'ai' 
                ? 'bg-white text-blue-700 shadow-md' 
                : 'text-blue-100 hover:text-white'
            }`}
          >
            <Sparkles size={14} className={searchType === 'ai' ? 'text-blue-600 animate-pulse' : 'text-blue-100'} />
            AI Smart Search ✨
          </button>
        </div>

        <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-xl">
          {searchType === 'standard' ? (
            <select 
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="flex-grow px-4 py-3 rounded-xl text-slate-700 bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-sm"
            >
              <option value="semua">Semua Area Sekitar Unhas</option>
              <option value="Perintis Kemerdekaan 3">Perintis Kemerdekaan 3</option>
              <option value="Perintis Kemerdekaan 4">Perintis Kemerdekaan 4</option>
              <option value="Perintis Kemerdekaan 6">Perintis Kemerdekaan 6</option>
              <option value="Perintis Kemerdekaan 7">Perintis Kemerdekaan 7</option>
              <option value="Perintis Kemerdekaan 8">Perintis Kemerdekaan 8</option>
              <option value="Jalan Bung">Jalan Bung</option>
              <option value="Kera-Kera">Kera-Kera</option>
              <option value="Sahabat">Sahabat</option>
              <option value="Damai">Damai</option>
              <option value="Workshop">Workshop</option>
              <option value="Pintu Nol">Pintu Nol</option>
            </select>
          ) : (
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Coba: 'kos putri dekat sahabat under 1jt bebas banjir'"
              className="flex-grow px-4 py-3 rounded-xl text-slate-700 bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          )}
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Search size={18} />
            <span>Cari Kos</span>
          </button>
        </form>
      </div>
    </section>
  );
}