import { MAX_QUERY_LENGTH } from '@/src/lib/ai-search';
import { parseKosFiltersFromSearchParams, type KosListFilters } from '@/src/lib/kos-queries';

export const EXPLORE_PAGE_SIZE = 12;
const EXPLORE_MAX_LIMIT = 96;

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type ExploreParams = {
  filters: KosListFilters;
  currentArea: string;
  currentTipe: string;
  onlyBebasBanjir: boolean;
  onlyJalanMulus: boolean;
  aiQuery: string;
  limit: number;
  canLoadMore: boolean;
  /** Query string tanpa limit; dipakai sebagai key Suspense. */
  resultsKey: string;
  loadMoreHref: string;
};

function toUrlSearchParams(raw: RawSearchParams): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first) {
      params.set(key, first);
    }
  }
  return params;
}

export function parseExploreParams(raw: RawSearchParams): ExploreParams {
  const params = toUrlSearchParams(raw);

  const parsedLimit = parseInt(params.get('limit') ?? '', 10);
  const limit = isNaN(parsedLimit)
    ? EXPLORE_PAGE_SIZE
    : Math.min(Math.max(parsedLimit, EXPLORE_PAGE_SIZE), EXPLORE_MAX_LIMIT);

  params.delete('limit');
  const resultsKey = params.toString();

  const loadMoreParams = new URLSearchParams(params);
  loadMoreParams.set('limit', String(limit + EXPLORE_PAGE_SIZE));

  const filters = parseKosFiltersFromSearchParams(params);

  return {
    filters,
    currentArea: params.get('area') ?? 'semua',
    currentTipe: params.get('tipe') ?? 'semua',
    onlyBebasBanjir: filters.statusBanjir === 'aman',
    onlyJalanMulus: filters.kondisiJalan === 'mulus',
    aiQuery: (params.get('ai_query') ?? '').trim().slice(0, MAX_QUERY_LENGTH),
    limit,
    canLoadMore: limit < EXPLORE_MAX_LIMIT,
    resultsKey,
    loadMoreHref: `/explore?${loadMoreParams.toString()}`,
  };
}
