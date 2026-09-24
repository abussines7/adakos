// components/layout/Navbar.tsx
import Link from 'next/link';
import Logo from '@/components/layout/Logo';

const LINKS = [
  { href: '/explore', label: 'Cari kos' },
  { href: '/#cara-menilai', label: 'Cara menilai' },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm px-2.5 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
