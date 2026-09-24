// app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

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
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Terjadi kesalahan</h1>
      <p className="text-slate-500 mb-8">
        Halaman ini gagal dimuat. Coba lagi beberapa saat lagi.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => unstable_retry()}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
        >
          Coba Lagi
        </button>
        <Link href="/" className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold">
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}
