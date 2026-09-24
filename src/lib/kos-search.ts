import 'server-only';
import { unstable_cache } from 'next/cache';
import { getCachedAreas } from '@/src/lib/areas';
import { toClientAiParams, type ClientAiParams, type ParsedAiParams } from '@/src/lib/ai-search';
import { parseQueryWithGemini } from '@/src/lib/gemini';
import {
  aiParamsToFilters,
  fallbackKeywordSearch,
  listPublishedKos,
  type KosListRow,
} from '@/src/lib/kos-queries';
import { checkRateLimit } from '@/src/lib/rate-limit';

const GEMINI_WINDOW_MS = 60_000;
// Panggilan Gemini per IP dan total per instance. Bila terlampaui, pencarian
// tetap jalan memakai kata kunci (tidak menolak pengguna).
const GEMINI_LIMIT_PER_IP = 10;
const GEMINI_LIMIT_GLOBAL = 60;
const PARSE_CACHE_SECONDS = 60 * 60 * 24;

export type KosSearchResult = {
  data: KosListRow[];
  total: number;
  ai_params: ClientAiParams | null;
};

const FALLBACK_AI_PARAMS: ClientAiParams = {
  fallback: true,
  error: 'AI Service Unavailable',
  tipe: null,
  area_slug: null,
  kondisi_jalan: null,
  status_banjir: null,
  harga_min: null,
  harga_max: null,
  keyword: null,
};

function normalizeQuery(queryText: string): string {
  return queryText.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Hasil parsing di-cache per query (kunci cache = argumen, yaitu query saja;
// clientIp dari closure tidak masuk kunci sehingga cache dipakai bersama).
// Rate limit dicek di dalam fungsi cache, jadi hanya panggilan Gemini
// sungguhan yang dihitung; error (termasuk limit terlampaui) tidak di-cache.
function getCachedAiParams(normalizedQuery: string, clientIp: string) {
  return unstable_cache(
    async (query: string) => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY belum diatur');
      }
      if (
        !checkRateLimit(`gemini:${clientIp}`, GEMINI_LIMIT_PER_IP, GEMINI_WINDOW_MS) ||
        !checkRateLimit('gemini:global', GEMINI_LIMIT_GLOBAL, GEMINI_WINDOW_MS)
      ) {
        throw new Error('Batas panggilan Gemini terlampaui');
      }
      const areas = await getCachedAreas();
      return parseQueryWithGemini(apiKey, query, areas);
    },
    ['ai-search-params'],
    { revalidate: PARSE_CACHE_SECONDS }
  )(normalizedQuery);
}

/**
 * Pencarian kos dari query bahasa alami. Memakai Gemini bila tersedia,
 * selain itu jatuh ke pencarian kata kunci. Hanya error database yang
 * dilempar ke pemanggil.
 */
export async function searchKosWithAi(
  queryText: string,
  options: { clientIp: string; limit: number; offset: number }
): Promise<KosSearchResult> {
  const pagination = { limit: options.limit, offset: options.offset };
  const normalizedQuery = normalizeQuery(queryText);

  let parsedParams: ParsedAiParams | null = null;
  try {
    parsedParams = await getCachedAiParams(normalizedQuery, options.clientIp);
  } catch (error) {
    console.warn('AI Smart Search tidak tersedia, memakai pencarian kata kunci:', error instanceof Error ? error.message : error);
  }

  if (parsedParams) {
    const { data, total } = await listPublishedKos(aiParamsToFilters(parsedParams), pagination);
    return { data, total, ai_params: toClientAiParams(parsedParams) };
  }

  const { data, total } = await fallbackKeywordSearch(queryText, pagination);
  return { data, total, ai_params: FALLBACK_AI_PARAMS };
}
