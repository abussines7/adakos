import 'server-only';
import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from '@google/generative-ai';
import { buildAiSystemInstruction, validateAiParams, type ParsedAiParams } from '@/src/lib/ai-search';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_TIMEOUT_MS = 8_000;

const RESPONSE_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    tipe: {
      type: SchemaType.STRING,
      format: 'enum',
      enum: ['putra', 'putri', 'campur', 'all'],
      description: "Tipe kos: 'putra', 'putri', 'campur'. Gunakan 'all' jika tidak secara eksplisit dispesifikasikan.",
    },
    area_slug: {
      type: SchemaType.STRING,
      description: "Slug area yang paling cocok dari daftar area. Gunakan 'all' jika tidak disebutkan.",
    },
    kondisi_jalan: {
      type: SchemaType.STRING,
      format: 'enum',
      enum: ['mulus', 'cukup_baik', 'rusak', 'all'],
      description: "Kondisi jalan: 'mulus', 'cukup_baik', 'rusak'. Gunakan 'all' jika tidak dispesifikasikan.",
    },
    status_banjir: {
      type: SchemaType.STRING,
      format: 'enum',
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
};

/**
 * Terjemahkan query bahasa alami menjadi parameter filter lewat Gemini.
 * Melempar error bila layanan gagal, timeout, atau output tidak valid —
 * pemanggil bertanggung jawab melakukan fallback.
 */
export async function parseQueryWithGemini(
  apiKey: string,
  queryText: string,
  areas: { nama: string; slug: string }[]
): Promise<ParsedAiParams> {
  const areaListString = areas.map((a) => `- Nama: "${a.nama}", Slug: "${a.slug}"`).join('\n');

  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel(
    {
      model: GEMINI_MODEL,
      systemInstruction: buildAiSystemInstruction(areaListString),
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    },
    { timeout: GEMINI_TIMEOUT_MS }
  );

  const response = await model.generateContent(queryText);
  const rawParsed: unknown = JSON.parse(response.response.text());

  return validateAiParams(rawParsed, new Set(areas.map((a) => a.slug)));
}
