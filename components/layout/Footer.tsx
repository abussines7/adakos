// components/layout/Footer.tsx
import Link from 'next/link';
import Logo from '@/components/layout/Logo';
import { SAMPLE_DATA_MODE } from '@/src/lib/site-config';

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-paper">
      {/* Marka jalan: garis kuning putus-putus */}
      <div aria-hidden="true" className="h-1.5 road-dash" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
              Katalog kos di sekitar Universitas Hasanuddin, lengkap dengan kondisi jalan, risiko banjir, dan rute ke
              kampus.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-signal">Jelajahi</span>
              <Link href="/explore" className="text-paper/85 hover:text-paper hover:underline">
                Cari kos
              </Link>
              <Link href="/#cara-menilai" className="text-paper/85 hover:text-paper hover:underline">
                Cara menilai
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-signal">Ikuti</span>
              <a
                href="https://instagram.com/adakost_id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper/85 hover:text-paper hover:underline"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-1 border-t border-paper/15 pt-6 font-mono text-xs text-paper/60 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Adakos · Dibuat di Makassar</span>
          {SAMPLE_DATA_MODE && <span>Data kos saat ini adalah data contoh</span>}
        </div>
      </div>
    </footer>
  );
}
