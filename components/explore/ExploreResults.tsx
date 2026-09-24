// components/explore/ExploreResults.tsx
import Link from 'next/link';
import { headers } from 'next/headers';
import KosCard from '@/components/explore/KosCard';
import EmptyState from '@/components/explore/EmptyState';
import AiParamsNotice from '@/components/explore/AiParamsNotice';
import { listPublishedKos } from '@/src/lib/kos-queries';
import { searchKosWithAi, type KosSearchResult } from '@/src/lib/kos-search';
import { getClientIp } from '@/src/lib/rate-limit';
import { EXPLORE_PAGE_SIZE, type ExploreParams } from '@/src/lib/explore-params';

async function fetchResults(params: ExploreParams): Promise<KosSearchResult> {
  const pagination = { limit: params.limit, offset: 0 };

  if (params.aiQuery) {
    const clientIp = getClientIp(await headers());
    return searchKosWithAi(params.aiQuery, { ...pagination, clientIp });
  }

  const { data, total } = await listPublishedKos(params.filters, pagination);
  return { data, total, ai_params: null };
}

export default async function ExploreResults({ params }: { params: ExploreParams }) {
  let result: KosSearchResult;
  try {
    result = await fetchResults(params);
  } catch (error) {
    console.error('Gagal memuat daftar kos:', error);
    return (
      <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
        Gagal memuat data kos. Silakan coba lagi beberapa saat lagi.
      </div>
    );
  }

  const { data, total, ai_params } = result;
  const hasMore = data.length < total && params.canLoadMore;

  return (
    <>
      {ai_params && <AiParamsNotice aiParams={ai_params} />}

      <div className="mb-4 text-sm text-slate-500">
        Menampilkan <span className="font-bold text-slate-900">{data.length}</span>
        {total > data.length ? ` dari ${total}` : ''} properti
      </div>

      {data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((kos) => (
              <KosCard key={kos.slug} kos={kos} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 text-center">
              <Link
                href={params.loadMoreHref}
                scroll={false}
                className="inline-flex items-center px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                Muat lebih banyak
              </Link>
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </>
  );
}

export function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
      {Array.from({ length: EXPLORE_PAGE_SIZE / 2 }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="aspect-video bg-slate-200" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-slate-200 rounded-md w-3/4" />
            <div className="h-4 bg-slate-200 rounded-md w-1/2" />
            <div className="h-5 bg-slate-200 rounded-md w-1/3 pt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
