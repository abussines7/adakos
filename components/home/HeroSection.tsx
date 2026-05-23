// components/home/HeroSection.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const [selectedArea, setSelectedArea] = useState('semua');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedArea === 'semua') {
      router.push('/explore');
    } else {
      router.push(`/explore?area=${encodeURIComponent(selectedArea)}`);
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-600 to-indigo-800 py-20 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-3xl mx-auto text-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Cari Kos Dekat Unhas Tanpa Drama.</h1>
        <p className="text-lg text-blue-100 mb-10">Info transparan, lokasi akurat, survei dari rumah. Bebas zonk.</p>
        
        <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-xl">
          <select 
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="flex-grow px-4 py-3 rounded-xl text-slate-700 bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
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
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Search size={18} />
            Cari Kos
          </button>
        </form>
      </div>
    </section>
  );
}