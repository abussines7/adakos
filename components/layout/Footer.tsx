// src/components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div>
            <div className="text-white font-bold text-lg mb-2">Adakos</div>
            <p className="text-slate-500 text-sm max-w-sm">
              E-Katalog indekos transparan di sekitar Universitas Hasanuddin Makassar.
            </p>
          </div>
          
          {/* Right Column */}
          <div className="flex md:justify-end">
            <div className="flex flex-col space-y-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tautan</span>
              <Link href="/explore" className="text-sm hover:text-white transition-colors">
                Eksplorasi Kos
              </Link>
              <a 
                href="https://instagram.com/adakost_id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm hover:text-white transition-colors"
              >
                Instagram @adakost_id
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom divider with copyright */}
        <div className="border-t border-slate-800 pt-6">
          <div className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Adakos. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}