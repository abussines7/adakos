// app/api/search/ai/route.ts
// Next.js Route Handler — AI Smart Search (Google AI Studio Gemini)

import { NextResponse } from 'next/server';
import { sanitizeUserQuery } from '@/src/lib/ai-search';
import { searchKosWithAi } from '@/src/lib/kos-search';
import { checkRateLimit, getClientIp } from '@/src/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Batas request per IP ke endpoint ini (melindungi database). Batas
// panggilan Gemini diatur terpisah di searchKosWithAi.
const ENDPOINT_RATE_LIMIT = 20;
const ENDPOINT_RATE_WINDOW_MS = 60_000;
const MAX_BODY_BYTES = 2_048;
const RESULT_LIMIT = 20;

export async function POST(request: Request) {
  const clientIp = getClientIp(request.headers);
  if (!checkRateLimit(`ai-endpoint:${clientIp}`, ENDPOINT_RATE_LIMIT, ENDPOINT_RATE_WINDOW_MS)) {
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

  try {
    const result = await searchKosWithAi(queryText, { clientIp, limit: RESULT_LIMIT, offset: 0 });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Gagal memproses pencarian:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Gagal memproses pencarian' },
      { status: 500 }
    );
  }
}
