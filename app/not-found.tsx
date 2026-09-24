// app/not-found.tsx
import Link from 'next/link';
import DeadEndSign from '@/components/shared/DeadEndSign';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <DeadEndSign className="h-20 w-20" />
      <p className="kicker mt-6">404</p>
      <h1 className="mt-2 font-wide text-3xl sm:text-4xl">Jalan buntu</h1>
      <p className="mt-3 leading-relaxed text-ink-soft">
        Halaman yang kamu cari tidak ada, atau kosnya sudah tidak ditampilkan.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/explore" className="btn btn-signal">
          Cari kos lain
        </Link>
        <Link href="/" className="btn btn-ghost">
          Ke beranda
        </Link>
      </div>
    </div>
  );
}
