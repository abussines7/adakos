import { db } from '@/src/db';
import {
  kos,
  area,
  kosFoto,
  kosFasilitasInternal,
  fasilitasInternal,
} from '@/src/db/schema';
import {
  and,
  eq,
  gte,
  lte,
  ilike,
  sql,
  SQL,
  desc,
  or,
  exists,
} from 'drizzle-orm';
import type { ParsedAiParams } from '@/src/lib/ai-search';

export type KosListFilters = {
  tipe?: 'putra' | 'putri' | 'campur';
  areaSlug?: string;
  statusBanjir?: 'aman' | 'rawan' | 'kadang_tergenang';
  kondisiJalan?: 'mulus' | 'cukup_baik' | 'rusak';
  hargaMin?: number;
  hargaMax?: number;
  keyword?: string;
  tokenKeywords?: string[];
};

export type KosListRow = {
  slug: string;
  nama: string;
  tipe: 'putra' | 'putri' | 'campur';
  area: { nama: string; slug: string } | null;
  harga_bulanan: number;
  foto_utama: string;
  status_banjir: 'aman' | 'rawan' | 'kadang_tergenang';
  kondisi_jalan: 'mulus' | 'cukup_baik' | 'rusak';
};

const STOP_WORDS = new Set([
  'cari',
  'kos',
  'yang',
  'di',
  'dan',
  'dekat',
  'dengan',
  'saya',
  'untuk',
  'ke',
  'ada',
  'dari',
  'bisa',
  'anti',
  'bebas',
]);

function keywordMatchCondition(keyword: string): SQL {
  const pattern = `%${keyword}%`;

  return or(
    ilike(kos.nama, pattern),
    exists(
      db
        .select({ id: kosFasilitasInternal.kos_id })
        .from(kosFasilitasInternal)
        .innerJoin(
          fasilitasInternal,
          eq(kosFasilitasInternal.fasilitas_id, fasilitasInternal.id)
        )
        .where(
          and(
            eq(kosFasilitasInternal.kos_id, kos.id),
            ilike(fasilitasInternal.nama, pattern)
          )
        )
    )
  )!;
}

export function buildKosConditions(filters: KosListFilters): SQL[] {
  const conditions: SQL[] = [eq(kos.is_published, true)];

  if (filters.tipe) {
    conditions.push(eq(kos.tipe, filters.tipe));
  }

  if (filters.statusBanjir) {
    conditions.push(eq(kos.status_banjir, filters.statusBanjir));
  }

  if (filters.kondisiJalan) {
    conditions.push(eq(kos.kondisi_jalan, filters.kondisiJalan));
  }

  if (filters.hargaMin && filters.hargaMin > 0) {
    conditions.push(gte(kos.harga_bulanan, filters.hargaMin));
  }

  if (filters.hargaMax && filters.hargaMax > 0) {
    conditions.push(lte(kos.harga_bulanan, filters.hargaMax));
  }

  if (filters.areaSlug) {
    conditions.push(eq(area.slug, filters.areaSlug));
  }

  const keyword = filters.keyword?.trim();
  if (keyword) {
    conditions.push(keywordMatchCondition(keyword));
  }

  const tokens = filters.tokenKeywords?.filter(Boolean);
  if (tokens && tokens.length > 0) {
    const tokenConditions = tokens.map((token) => keywordMatchCondition(token));
    conditions.push(sql`(${sql.join(tokenConditions, sql` OR `)})`);
  }

  return conditions;
}

function formatKosListRow(row: {
  slug: string;
  nama: string;
  tipe: 'putra' | 'putri' | 'campur';
  hargaBulanan: number;
  statusBanjir: 'aman' | 'rawan' | 'kadang_tergenang';
  kondisiJalan: 'mulus' | 'cukup_baik' | 'rusak';
  area: { nama: string; slug: string } | null;
  fotoUtama: string | null;
}): KosListRow {
  return {
    slug: row.slug,
    nama: row.nama,
    tipe: row.tipe,
    area: row.area
      ? {
          nama: row.area.nama,
          slug: row.area.slug,
        }
      : null,
    harga_bulanan: row.hargaBulanan,
    foto_utama: row.fotoUtama || '',
    status_banjir: row.statusBanjir,
    kondisi_jalan: row.kondisiJalan,
  };
}

export async function listPublishedKos(
  filters: KosListFilters,
  pagination: { limit: number; offset: number }
): Promise<{ data: KosListRow[]; total: number }> {
  const conditions = buildKosConditions(filters);

  const [rows, totalCountResult] = await Promise.all([
    db
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
      .limit(pagination.limit)
      .offset(pagination.offset),

    db
      .select({ count: sql<number>`count(*)` })
      .from(kos)
      .leftJoin(area, eq(kos.area_id, area.id))
      .where(and(...conditions)),
  ]);

  return {
    data: rows.map(formatKosListRow),
    total: Number(totalCountResult[0]?.count ?? 0),
  };
}

export function parseKosFiltersFromSearchParams(searchParams: URLSearchParams): KosListFilters {
  const filters: KosListFilters = {};

  const tipe = searchParams.get('tipe');
  if (tipe && ['putra', 'putri', 'campur'].includes(tipe)) {
    filters.tipe = tipe as KosListFilters['tipe'];
  }

  const statusBanjir = searchParams.get('status_banjir');
  if (statusBanjir && ['aman', 'rawan', 'kadang_tergenang'].includes(statusBanjir)) {
    filters.statusBanjir = statusBanjir as KosListFilters['statusBanjir'];
  }

  const hargaMin = searchParams.get('harga_min');
  if (hargaMin) {
    const parsed = parseInt(hargaMin, 10);
    if (!isNaN(parsed)) {
      filters.hargaMin = parsed;
    }
  }

  const hargaMax = searchParams.get('harga_max');
  if (hargaMax) {
    const parsed = parseInt(hargaMax, 10);
    if (!isNaN(parsed)) {
      filters.hargaMax = parsed;
    }
  }

  const q = searchParams.get('q');
  if (q) {
    filters.keyword = q;
  }

  const areaSlug = searchParams.get('area');
  if (areaSlug) {
    filters.areaSlug = areaSlug;
  }

  return filters;
}

export function aiParamsToFilters(params: ParsedAiParams): KosListFilters {
  const filters: KosListFilters = {};

  if (params.tipe !== 'all') {
    filters.tipe = params.tipe;
  }

  if (params.status_banjir !== 'all') {
    filters.statusBanjir = params.status_banjir;
  }

  if (params.kondisi_jalan !== 'all') {
    filters.kondisiJalan = params.kondisi_jalan;
  }

  if (params.harga_min > 0) {
    filters.hargaMin = params.harga_min;
  }

  if (params.harga_max > 0) {
    filters.hargaMax = params.harga_max;
  }

  if (params.keyword.trim()) {
    filters.keyword = params.keyword.trim();
  }

  if (params.area_slug !== 'all') {
    filters.areaSlug = params.area_slug;
  }

  return filters;
}

export function tokenizeFallbackQuery(queryText: string): string[] {
  return queryText
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

export async function fallbackKeywordSearch(
  queryText: string,
  pagination: { limit: number; offset: number } = { limit: 20, offset: 0 }
): Promise<{ data: KosListRow[]; total: number }> {
  const tokens = tokenizeFallbackQuery(queryText);
  const filters: KosListFilters = {};

  if (tokens.length > 0) {
    filters.tokenKeywords = tokens;
  }

  return listPublishedKos(filters, pagination);
}

export async function findPublishedKosBySlug(slug: string) {
  const result = await db.query.kos.findFirst({
    where: and(eq(kos.slug, slug), eq(kos.is_published, true)),
    with: {
      area: true,
      pemilik: true,
      foto: { orderBy: (foto, { asc }) => [asc(foto.urutan)] },
      fasilitasInternal: { with: { fasilitas: true } },
      fasilitasSekitar: true,
      ruteKampus: { orderBy: (rute, { asc }) => [asc(rute.urutan)] },
    },
  });

  return result ?? null;
}
