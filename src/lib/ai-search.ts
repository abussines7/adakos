export const MAX_QUERY_LENGTH = 200;

const TIPE_VALUES = ['putra', 'putri', 'campur', 'all'] as const;
const BANJIR_VALUES = ['aman', 'rawan', 'kadang_tergenang', 'all'] as const;
const JALAN_VALUES = ['mulus', 'cukup_baik', 'rusak', 'all'] as const;

export type ParsedAiParams = {
  tipe: (typeof TIPE_VALUES)[number];
  area_slug: string;
  kondisi_jalan: (typeof JALAN_VALUES)[number];
  status_banjir: (typeof BANJIR_VALUES)[number];
  harga_min: number;
  harga_max: number;
  keyword: string;
};

export type ClientAiParams = {
  tipe: string | null;
  area_slug: string | null;
  kondisi_jalan: string | null;
  status_banjir: string | null;
  harga_min: number | null;
  harga_max: number | null;
  keyword: string | null;
  fallback?: boolean;
  error?: string;
};

function isOneOf<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value);
}

// Batas atas harga: menjaga nilai tetap dalam rentang kolom integer Postgres.
const MAX_HARGA = 100_000_000;

function clampHarga(value: unknown): number {
  const parsed = Math.floor(Number(value) || 0);
  return Math.min(Math.max(0, parsed), MAX_HARGA);
}

export function sanitizeUserQuery(raw: unknown): string {
  if (typeof raw !== 'string') {
    throw new Error('Query string is required');
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error('Query string is required');
  }

  if (trimmed.length > MAX_QUERY_LENGTH) {
    throw new Error(`Query must be at most ${MAX_QUERY_LENGTH} characters`);
  }

  return trimmed;
}

export function validateAiParams(raw: unknown, validAreaSlugs: Set<string>): ParsedAiParams {
  const p = (raw ?? {}) as Record<string, unknown>;

  const tipe = isOneOf(p.tipe, TIPE_VALUES) ? p.tipe : 'all';
  const kondisi_jalan = isOneOf(p.kondisi_jalan, JALAN_VALUES) ? p.kondisi_jalan : 'all';
  const status_banjir = isOneOf(p.status_banjir, BANJIR_VALUES) ? p.status_banjir : 'all';

  let area_slug = typeof p.area_slug === 'string' ? p.area_slug : 'all';
  if (area_slug !== 'all' && !validAreaSlugs.has(area_slug)) {
    area_slug = 'all';
  }

  return {
    tipe,
    area_slug,
    kondisi_jalan,
    status_banjir,
    harga_min: clampHarga(p.harga_min),
    harga_max: clampHarga(p.harga_max),
    keyword: typeof p.keyword === 'string' ? p.keyword.slice(0, 100) : '',
  };
}

export function toClientAiParams(params: ParsedAiParams): ClientAiParams {
  return {
    tipe: params.tipe === 'all' ? null : params.tipe,
    area_slug: params.area_slug === 'all' ? null : params.area_slug,
    kondisi_jalan: params.kondisi_jalan === 'all' ? null : params.kondisi_jalan,
    status_banjir: params.status_banjir === 'all' ? null : params.status_banjir,
    harga_min: params.harga_min === 0 ? null : params.harga_min,
    harga_max: params.harga_max === 0 ? null : params.harga_max,
    keyword: params.keyword === '' ? null : params.keyword,
  };
}

export function buildAiSystemInstruction(areaListString: string): string {
  return `Anda adalah parser pencarian kos untuk aplikasi Adakos (aplikasi pencarian kos mahasiswa Universitas Hasanuddin, Makassar).
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
   - Kosongkan (string kosong "") jika tidak ada kata kunci tambahan.`;
}
