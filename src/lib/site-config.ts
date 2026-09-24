// Mode data contoh: aktif selama data kos masih dummy (belum ada kerja sama
// dengan pemilik kos sungguhan). Matikan dengan NEXT_PUBLIC_SAMPLE_DATA=false
// setelah data asli masuk.
export const SAMPLE_DATA_MODE = process.env.NEXT_PUBLIC_SAMPLE_DATA !== 'false';

export const SITE_NAME = 'Adakos';

// URL publik situs, dipakai untuk metadata (Open Graph, canonical).
// Di Vercel, VERCEL_PROJECT_PRODUCTION_URL terisi otomatis (tanpa protokol).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');
