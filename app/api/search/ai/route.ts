// app/api/search/ai/route.ts
// Next.js Route Handler — AI Smart Search (Google AI Studio Gemini)

import { NextResponse } from 'next/server';
import { getCachedAreas } from '@/src/lib/areas';
import { sanitizeUserQuery, toClientAiParams, type ParsedAiParams } from '@/src/lib/ai-search';
import { parseQueryWithGemini } from '@/src/lib/gemini';
import {
  aiParamsToFilters,
  fallbackKeywordSearch,
  listPublishedKos,
} from '@/src/lib/kos-queries';
import { checkRateLimit, getClientIp } from '@/src/lib/rate-limit';

export const dynamic = 'force-dynamic';

const AI_RATE_WINDOW_MS = 60_000;
// Batas per IP: melindungi database dan kuota Gemini dari satu klien.
const AI_RATE_LIMIT_PER_IP = 10;
// Batas total per instance: bila terlampaui, lewati Gemini dan pakai
// pencarian kata kunci (tidak menolak request).
const AI_RATE_LIMIT_GLOBAL = 60;
const MAX_BODY_BYTES = 2_048;
const RESULT_LIMIT = 20;

const FALLBACK_AI_PARAMS = {
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

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  if (!checkRateLimit(`ai-search:${clientIp}`, AI_RATE_LIMIT_PER_IP, AI_RATE_WINDOW_MS)) {
    return NextResponse.json(
      { error: 'Too Many Requests', message: 'Terlalu banyak permintaan. Coba lagi nanti.' },
      { status: 429 }
    );
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload Too Large' }, { status: 413 });
  }

  let queryText: string;
  try {
    const body = (await request.json()) as { query?: unknown } | null;
    queryText = sanitizeUserQuery(body?.query);
  } catch (err) {
    const message = err instanceof SyntaxError ? 'Invalid JSON body' : err instanceof Error ? err.message : 'Query string is required';
    return NextResponse.json({ error: 'Bad Request', message }, { status: 400 });
  }

  let parsedParams: ParsedAiParams | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY belum diatur, memakai pencarian kata kunci.');
  } else if (checkRateLimit('ai-search:global', AI_RATE_LIMIT_GLOBAL, AI_RATE_WINDOW_MS)) {
    try {
      const areas = await getCachedAreas();
      parsedParams = await parseQueryWithGemini(apiKey, queryText, areas);
    } catch (error) {
      console.error('AI Smart Search tidak tersedia, memakai pencarian kata kunci:', error);
    }
  }

  try {
    if (parsedParams) {
      const { data, total } = await listPublishedKos(aiParamsToFilters(parsedParams), {
        limit: RESULT_LIMIT,
        offset: 0,
      });
      return NextResponse.json({ data, ai_params: toClientAiParams(parsedParams), total });
    }

    const { data, total } = await fallbackKeywordSearch(queryText, { limit: RESULT_LIMIT, offset: 0 });
    return NextResponse.json({ data, ai_params: FALLBACK_AI_PARAMS, total });
  } catch (error) {
    console.error('Gagal memproses pencarian:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Gagal memproses pencarian' },
      { status: 500 }
    );
  }
}
