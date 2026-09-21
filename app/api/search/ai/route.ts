// app/api/search/ai/route.ts
// Next.js Route Handler — AI Smart Search (Google AI Studio Gemini)

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { getCachedAreas } from '@/src/lib/areas';
import {
  buildAiSystemInstruction,
  isGeminiServiceError,
  sanitizeUserQuery,
  toClientAiParams,
  validateAiParams,
} from '@/src/lib/ai-search';
import {
  aiParamsToFilters,
  fallbackKeywordSearch,
  listPublishedKos,
} from '@/src/lib/kos-queries';
import { checkRateLimit, getClientIp } from '@/src/lib/rate-limit';

export const dynamic = 'force-dynamic';

const AI_RATE_LIMIT = 10;
const AI_RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  if (!checkRateLimit(`ai-search:${clientIp}`, AI_RATE_LIMIT, AI_RATE_WINDOW_MS)) {
    return NextResponse.json(
      { error: 'Too Many Requests', message: 'Terlalu banyak permintaan. Coba lagi nanti.' },
      { status: 429 }
    );
  }

  let queryText = '';

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Configuration Error', message: 'Layanan pencarian AI belum dikonfigurasi.' },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Bad Request', message: 'Invalid JSON body' }, { status: 400 });
    }

    try {
      queryText = sanitizeUserQuery((body as { query?: unknown })?.query);
    } catch (err) {
      return NextResponse.json(
        { error: 'Bad Request', message: err instanceof Error ? err.message : 'Query string is required' },
        { status: 400 }
      );
    }

    const dbAreas = await getCachedAreas();
    const validAreaSlugs = new Set(dbAreas.map((a) => a.slug));
    const areaListString = dbAreas
      .map((a) => `- Nama: "${a.nama}", Slug: "${a.slug}"`)
      .join('\n');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: buildAiSystemInstruction(areaListString),
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            tipe: {
              type: SchemaType.STRING,
              enum: ['putra', 'putri', 'campur', 'all'],
              description: "Tipe kos: 'putra', 'putri', 'campur'. Gunakan 'all' jika tidak secara eksplisit dispesifikasikan.",
            },
            area_slug: {
              type: SchemaType.STRING,
              description: "Slug area yang paling cocok dari daftar area. Gunakan 'all' jika tidak disebutkan.",
            },
            kondisi_jalan: {
              type: SchemaType.STRING,
              enum: ['mulus', 'cukup_baik', 'rusak', 'all'],
              description: "Kondisi jalan: 'mulus', 'cukup_baik', 'rusak'. Gunakan 'all' jika tidak dispesifikasikan.",
            },
            status_banjir: {
              type: SchemaType.STRING,
              enum: ['aman', 'rawan', 'kadang_tergenang', 'all'],
              description: "Kerawanan banjir: 'aman', 'rawan', 'kadang_tergenang'. Gunakan 'all' jika tidak dispesifikasikan.",
            },
            harga_min: {
              type: SchemaType.INTEGER,
              description: 'Batas harga minimum bulanan dalam Rupiah. Gunakan 0 jika tidak ada batas bawah.',
            },
            harga_max: {
              type: SchemaType.INTEGER,
              description: 'Batas harga maksimum bulanan dalam Rupiah. Gunakan 0 jika tidak ada batas atas.',
            },
            keyword: {
              type: SchemaType.STRING,
              description: 'Kata kunci umum untuk nama kos atau fasilitas (misal: "wifi", "ac", "dekat gerbang"). Gunakan string kosong "" jika tidak ada.',
            },
          },
          required: ['tipe', 'area_slug', 'kondisi_jalan', 'status_banjir', 'harga_min', 'harga_max', 'keyword'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      },
    });

    const response = await model.generateContent(queryText);
    const responseText = response.response.text();

    let rawParsed: unknown;
    try {
      rawParsed = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Gemini output:', responseText, e);
      return NextResponse.json(
        { error: 'AI Parsing Error', message: 'The AI model generated an invalid structured output.' },
        { status: 502 }
      );
    }

    const parsedParams = validateAiParams(rawParsed, validAreaSlugs);
    const filters = aiParamsToFilters(parsedParams);
    const { data, total } = await listPublishedKos(filters, { limit: 20, offset: 0 });

    return NextResponse.json({
      data,
      ai_params: toClientAiParams(parsedParams),
      total,
    });
  } catch (error) {
    if (isGeminiServiceError(error)) {
      console.error('AI Smart Search unavailable, using keyword fallback:', error);
      try {
        const { data, total } = await fallbackKeywordSearch(queryText, { limit: 20, offset: 0 });
        return NextResponse.json({
          data,
          ai_params: {
            fallback: true,
            error: 'AI Service Unavailable',
            tipe: null,
            area_slug: null,
            kondisi_jalan: null,
            status_banjir: null,
            harga_min: null,
            harga_max: null,
            keyword: null,
          },
          total,
        });
      } catch (dbError) {
        console.error('Fallback query failed:', dbError);
      }
    }

    console.error('Unexpected AI search error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Gagal memproses pencarian' },
      { status: 500 }
    );
  }
}
