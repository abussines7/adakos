// components/layout/Logo.tsx
import Link from 'next/link';

/** Logo berbentuk papan nama jalan. */
export default function Logo() {
  return (
    <Link href="/" aria-label="Adakos, ke beranda" className="sign-plate inline-block px-3.5 py-1.5 text-lg leading-none font-wide">
      adakos
    </Link>
  );
}
