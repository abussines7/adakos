// src/components/layout/Navbar.tsx
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl transition-transform hover:scale-105">
          <Home size={24} />
          <span>Adakos</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/explore" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Eksplorasi
          </Link>
        </div>
      </div>
    </nav>
  );
}