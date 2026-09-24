// components/explore/EmptyState.tsx
import Link from 'next/link';
import DeadEndSign from '@/components/shared/DeadEndSign';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-md border-2 border-dashed border-ink/30 bg-white/50 px-4 py-16 text-center">
      <DeadEndSign />
      <h3 className="mt-5 font-wide text-2xl">Jalan buntu</h3>
      <p className="mt-2 max-w-md leading-relaxed text-muted-ink">
        Belum ada kos yang cocok dengan filter ini. Coba longgarkan filter atau pilih area lain.
      </p>
      <Link href="/explore" className="btn btn-ghost mt-6">
        Atur ulang filter
      </Link>
    </div>
  );
}
