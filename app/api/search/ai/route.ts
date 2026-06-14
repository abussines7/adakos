// app/api/search/ai/route.ts
// Next.js Route Handler — AI Smart Search (Google AI Studio Gemini)
// Parses natural language query to database filters and returns matched properties

import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { kos, area, kosFoto } from '@/src/db/schema';
import { and, eq, gte, lte, ilike, sql, SQL, desc } from 'drizzle-orm';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let queryText = '';
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Configuration Error', message: 'GEMINI_API_KEY environment variable is not configured.' },
        { status: 500 }
      );
    }

    // Parse request payload
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Bad Request', message: 'Invalid JSON body' }, { status: 400 });
    }

    const { query } = body;
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json({ error: 'Bad Request', message: 'Query string is required' }, { status: 400 });
    }
    queryText = query;

    // 1. Fetch dynamic areas from DB for accurate model parsing (entity linking)
    const dbAreas = await db.select({ nama: area.nama, slug: area.slug }).from(area);
    const areaListString = dbAreas
      .map((a) => `- Nama: "${a.nama}", Slug: "${a.slug}"`)
      .join('\n');

    // 2. Initialize Gemini SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
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
        } as any,
      },
    });

    // 3. Assemble prompt with instructions and user query
    const prompt = `
Anda adalah parser pencarian kos untuk aplikasi Adakos (aplikasi pencarian kos mahasiswa Universitas Hasanuddin, Makassar).
Tugas Anda adalah menerjemahkan query bahasa alami user menjadi parameter filter JSON yang terstruktur.

DAFTAR AREA YANG VALID:
${areaListString}

ATURAN MAPPING KETAT:
1. tipe:
   - "putra" jika mencari "kos putra", "cowok", "laki-laki", "pria"
   - "putri" jika mencari "kos putri", "cewek", "perempuan", "wanita", "akhwat"
   - "campur" jika mencari "campur", "pasutri", "gabung"
   - "all" jika tidak dispesifikasikan secara eksplisit.
2. area_slug:
   - Pilih slug area yang PALING COCOK dari daftar area di atas.
   - Contoh: "dekat jalan bung" -> "jalan-bung"
   - Contoh: "area sahabat" -> "sahabat"
   - "all" jika area tidak disebutkan.
3. kondisi_jalan:
   - "mulus" jika mencari "dekat jalan utama", "jalan mulus", "bisa mobil", "jalan besar"
   - "cukup_baik" atau "rusak" hanya jika secara eksplisit dispesifikasikan.
   - "all" jika tidak disebutkan.
4. status_banjir:
   - "aman" jika mencari "bebas banjir", "anti banjir", "aman banjir", "tidak banjir"
   - "all" jika tidak disebutkan.
5. harga_min & harga_max:
   - Cari angka harga. Contoh: "di bawah 1 juta" -> harga_max: 1000000, harga_min: 0
   - Contoh: "harga 800 ribu sampai 1.2 juta" -> harga_min: 800000, harga_max: 1200000
   - Gunakan 0 jika tidak ada batas bawah/atas yang dispesifikasikan.
6. keyword:
   - Kata kunci spesifik seperti "wifi", "ac", "kamar mandi dalam", "dekat gerbang utama".
   - Kosongkan (string kosong "") jika tidak ada kata kunci tambahan.

Query User: "${query}"
`;

    // 4. Call Gemini model
    const response = await model.generateContent(prompt);
    const responseText = response.response.text();
    
    let parsedParams;
    try {
      parsedParams = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Gemini output:', responseText, e);
      return NextResponse.json(
        { error: 'AI Parsing Error', message: 'The AI model generated an invalid structured output.' },
        { status: 502 }
      );
    }

    // 5. Build database query based on AI structured params
    const conditions: SQL[] = [eq(kos.is_published, true)];

    if (parsedParams.tipe && parsedParams.tipe !== 'all') {
      conditions.push(eq(kos.tipe, parsedParams.tipe as 'putra' | 'putri' | 'campur'));
    }

    if (parsedParams.status_banjir && parsedParams.status_banjir !== 'all') {
      conditions.push(eq(kos.status_banjir, parsedParams.status_banjir as 'aman' | 'rawan' | 'kadang_tergenang'));
    }

    if (parsedParams.kondisi_jalan && parsedParams.kondisi_jalan !== 'all') {
      conditions.push(eq(kos.kondisi_jalan, parsedParams.kondisi_jalan as 'mulus' | 'cukup_baik' | 'rusak'));
    }

    if (parsedParams.harga_min && parsedParams.harga_min > 0) {
      conditions.push(gte(kos.harga_bulanan, parsedParams.harga_min));
    }

    if (parsedParams.harga_max && parsedParams.harga_max > 0) {
      conditions.push(lte(kos.harga_bulanan, parsedParams.harga_max));
    }

    if (parsedParams.keyword && parsedParams.keyword.trim() !== '') {
      conditions.push(ilike(kos.nama, `%${parsedParams.keyword}%`));
    }

    if (parsedParams.area_slug && parsedParams.area_slug !== 'all') {
      conditions.push(eq(area.slug, parsedParams.area_slug));
    }

    // Query matched kos
    const rows = await db
      .select({
        slug: kos.slug,
        nama: kos.nama,
        tipe: kos.tipe,
        hargaBulanan: kos.harga_bulanan,
        statusBanjir: kos.status_banjir,
        kondisiJalan: kos.kondisi_jalan,
        area: {
          nama: area.nama,
          slug: area.slug,
        },
        fotoUtama: kosFoto.url,
      })
      .from(kos)
      .leftJoin(area, eq(kos.area_id, area.id))
      .leftJoin(kosFoto, and(eq(kos.id, kosFoto.kos_id), eq(kosFoto.urutan, 0)))
      .where(and(...conditions))
      .orderBy(desc(kos.created_at))
      .limit(20);

    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(kos)
      .leftJoin(area, eq(kos.area_id, area.id))
      .where(and(...conditions));

    const total = Number(totalCountResult[0]?.count || 0);

    // Format response matching camelCase to snake_case specifications
    const formattedData = rows.map((row) => ({
      slug: row.slug,
      nama: row.nama,
      tipe: row.tipe,
      area: row.area ? {
        nama: row.area.nama,
        slug: row.area.slug,
      } : null,
      harga_bulanan: row.hargaBulanan,
      foto_utama: row.fotoUtama || '',
      status_banjir: row.statusBanjir,
      kondisi_jalan: row.kondisiJalan,
    }));

    // Map internal params back to contract standard with null values for representation
    const clientAiParams = {
      tipe: parsedParams.tipe === 'all' ? null : parsedParams.tipe,
      area_slug: parsedParams.area_slug === 'all' ? null : parsedParams.area_slug,
      kondisi_jalan: parsedParams.kondisi_jalan === 'all' ? null : parsedParams.kondisi_jalan,
      status_banjir: parsedParams.status_banjir === 'all' ? null : parsedParams.status_banjir,
      harga_min: parsedParams.harga_min === 0 ? null : parsedParams.harga_min,
      harga_max: parsedParams.harga_max === 0 ? null : parsedParams.harga_max,
      keyword: parsedParams.keyword === '' ? null : parsedParams.keyword,
    };

    return NextResponse.json({
      data: formattedData,
      ai_params: clientAiParams,
      total,
    });
  } catch (error) {
    console.error('Error in AI Smart Search (falling back to token-based database keyword search):', error);
    try {
      const conditions: SQL[] = [eq(kos.is_published, true)];
      
      if (queryText && queryText.trim() !== '') {
        // Daftar stop words bahasa Indonesia untuk dibersihkan
        const stopWords = new Set(['cari', 'kos', 'yang', 'di', 'dan', 'dekat', 'dengan', 'saya', 'untuk', 'ke', 'ada', 'dari', 'bisa', 'anti', 'bebas']);
        const tokens = queryText
          .toLowerCase()
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '')
          .split(/\s+/)
          .filter(t => t.length > 1 && !stopWords.has(t));

        if (tokens.length > 0) {
          const tokenConditions = tokens.map(t => ilike(kos.nama, `%${t}%`));
          // Gabungkan pencarian kata kunci dengan operator OR
          conditions.push(sql`(${sql.join(tokenConditions, sql` OR `)})`);
        }
      }

      const rows = await db
        .select({
          slug: kos.slug,
          nama: kos.nama,
          tipe: kos.tipe,
          hargaBulanan: kos.harga_bulanan,
          statusBanjir: kos.status_banjir,
          kondisiJalan: kos.kondisi_jalan,
          area: {
            nama: area.nama,
            slug: area.slug,
          },
          fotoUtama: kosFoto.url,
        })
        .from(kos)
        .leftJoin(area, eq(kos.area_id, area.id))
        .leftJoin(kosFoto, and(eq(kos.id, kosFoto.kos_id), eq(kosFoto.urutan, 0)))
        .where(and(...conditions))
        .orderBy(desc(kos.created_at))
        .limit(20);

      const formattedData = rows.map((row) => ({
        slug: row.slug,
        nama: row.nama,
        tipe: row.tipe,
        area: row.area ? {
          nama: row.area.nama,
          slug: row.area.slug,
        } : null,
        harga_bulanan: row.hargaBulanan,
        foto_utama: row.fotoUtama || '',
        status_banjir: row.statusBanjir,
        kondisi_jalan: row.kondisiJalan,
      }));

      return NextResponse.json({
        data: formattedData,
        ai_params: {
          fallback: true,
          error: error instanceof Error ? error.message : 'AI Service Unavailable',
        },
        total: formattedData.length,
      });
    } catch (dbError) {
      console.error('Fallback query failed:', dbError);
      return NextResponse.json(
        { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  }
}
