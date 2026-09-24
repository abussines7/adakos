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
  asc,
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

const MAX_KEYWORD_LENGTH = 100;
const MAX_FALLBACK_TOKENS = 8;
const MAX_HARGA = 100_000_000;
const AREA_SLUG_PATTERN = /^[a-z0-9-]{1,100}$/;

const TIPE_VALUES = ['putra', 'putri', 'campur'] as const;
const BANJIR_VALUES = ['aman', 'rawan', 'kadang_tergenang'] as const;
const JALAN_VALUES = ['mulus', 'cukup_baik', 'rusak'] as const;

function isOneOf<T extends readonly string[]>(value: string | null, allowed: T): value is T[number] {
  return value !== null && (allowed as readonly string[]).includes(value);
}

function parseHarga(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed <= 0) {
    return undefined;
  }
  return Math.min(parsed, MAX_HARGA);
}

// Escape karakter wildcard LIKE (% dan _) serta backslash (escape default
// Postgres) agar input user dicocokkan secara literal.
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

function keywordMatchCondition(keyword: string): SQL {
  const pattern = `%${escapeLikePattern(keyword)}%`;

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
        // Subquery (bukan join) agar satu kos selalu satu baris, walau ada
        // beberapa foto dengan urutan sama atau tidak ada foto berurutan 0.
        fotoUtama: sql<string | null>`(
          select ${kosFoto.url} from ${kosFoto}
          where ${kosFoto.kos_id} = ${kos.id}
          order by ${kosFoto.urutan} asc, ${kosFoto.id} asc
          limit 1
        )`,
      })
      .from(kos)
      .leftJoin(area, eq(kos.area_id, area.id))
      .where(and(...conditions))
      // id sebagai pembeda agar urutan stabil antarhalaman (paginasi).
      .orderBy(desc(kos.created_at), asc(kos.id))
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
  if (isOneOf(tipe, TIPE_VALUES)) {
    filters.tipe = tipe;
  }

  const statusBanjir = searchParams.get('status_banjir');
  if (isOneOf(statusBanjir, BANJIR_VALUES)) {
    filters.statusBanjir = statusBanjir;
  }

  const kondisiJalan = searchParams.get('kondisi_jalan');
  if (isOneOf(kondisiJalan, JALAN_VALUES)) {
    filters.kondisiJalan = kondisiJalan;
  }

  filters.hargaMin = parseHarga(searchParams.get('harga_min'));
  filters.hargaMax = parseHarga(searchParams.get('harga_max'));

  const q = searchParams.get('q')?.trim();
  if (q) {
    filters.keyword = q.slice(0, MAX_KEYWORD_LENGTH);
  }

  const areaSlug = searchParams.get('area');
  if (areaSlug && AREA_SLUG_PATTERN.test(areaSlug)) {
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
  // Tanda baca diganti spasi (bukan dihapus) agar "kera-kera" tidak
  // menyatu menjadi "kerakera".
  const tokens = queryText
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'\\]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

  // Setiap token menjadi satu subquery EXISTS; batasi jumlahnya.
  return Array.from(new Set(tokens)).slice(0, MAX_FALLBACK_TOKENS);
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
