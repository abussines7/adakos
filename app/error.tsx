// app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Construction } from 'lucide-react';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-md border-2 border-ink bg-signal">
        <Construction size={40} aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-wide text-3xl sm:text-4xl">Jalan sedang diperbaiki</h1>
      <p className="mt-3 leading-relaxed text-ink-soft">Halaman ini gagal dimuat. Coba lagi beberapa saat lagi.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => unstable_retry()} className="btn btn-signal">
          Coba lagi
        </button>
        <Link href="/" className="btn btn-ghost">
          Ke beranda
        </Link>
      </div>
    </div>
  );
}
