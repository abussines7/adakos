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
      <div role="alert" className="rounded-md border-2 border-ink bg-alert-tint px-4 py-3 text-sm font-medium">
        Gagal memuat data kos. Coba lagi beberapa saat lagi.
      </div>
    );
  }

  const { data, total, ai_params } = result;
  const hasMore = data.length < total && params.canLoadMore;

  return (
    <>
      {ai_params && <AiParamsNotice aiParams={ai_params} />}

      <p className="mb-4 font-mono text-xs text-muted-ink">
        {total > data.length ? `${data.length} dari ${total} kos` : `${data.length} kos`}
      </p>

      {data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {data.map((kos) => (
              <KosCard key={kos.slug} kos={kos} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-10 flex justify-center">
              <Link href={params.loadMoreHref} scroll={false} className="btn btn-ghost px-6">
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
    <div aria-busy="true" aria-label="Memuat daftar kos">
      <div className="mb-4 h-4 w-24 rounded-sm bg-line-soft" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: EXPLORE_PAGE_SIZE / 2 }).map((_, idx) => (
          <div key={idx} className="animate-pulse overflow-hidden rounded-md border-2 border-ink/15 bg-white">
            <div className="aspect-[4/3] bg-paper-deep" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 rounded-sm bg-paper-deep" />
              <div className="h-4 w-1/2 rounded-sm bg-paper-deep" />
              <div className="h-5 w-1/3 rounded-sm bg-paper-deep" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-24 rounded-sm bg-paper-deep" />
                <div className="h-6 w-24 rounded-sm bg-paper-deep" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
