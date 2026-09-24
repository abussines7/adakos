// src/components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      scrolled 
        ? 'bg-white shadow-sm' 
        : 'bg-white/80 backdrop-blur-md border-b border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 font-bold text-xl text-slate-900 transition-transform hover:scale-105">
          <span>Ada</span><span className="text-blue-600">kos</span>
        </Link>
        <div className="flex gap-6">
          <Link href="/explore" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Eksplorasi
          </Link>
        </div>
      </div>
    </nav>
  );
}