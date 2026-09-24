# Adakos

E-katalog indekos di sekitar Universitas Hasanuddin (Unhas), Makassar. Fokus pada informasi yang jarang tersedia di platform lain: kondisi jalan, status banjir, akses kendaraan, dan rute ke kampus.

> **Status:** tahap uji coba. Seluruh data kos saat ini adalah **data contoh** (lihat [Mode data contoh](#mode-data-contoh)).

## Teknologi

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS 4, komponen shadcn/ui, ikon Lucide
- Postgres + [Drizzle ORM](https://orm.drizzle.team) (disarankan: [Neon](https://neon.tech))
- Pencarian AI dengan Google Gemini (opsional, dengan fallback pencarian kata kunci)
- Peta dengan Leaflet + OpenStreetMap
- Vercel Analytics

## Menjalankan secara lokal

Kebutuhan: Node.js 20.9 atau lebih baru, dan database Postgres.

```bash
npm install
cp .env.example .env      # lalu isi DATABASE_URL dan lainnya
npm run db:migrate        # buat tabel
npm run db:seed           # isi data contoh
npm run dev               # buka http://localhost:3000
```

## Script

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server development |
| `npm run build` / `npm start` | Build dan jalankan versi production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Pemeriksaan TypeScript |
| `npm test` | Unit test (`tests/`, memakai `node:test`) |
| `npm run db:generate` | Buat file migrasi dari perubahan `src/db/schema.ts` |
| `npm run db:migrate` | Terapkan migrasi ke database |
| `npm run db:seed` | Isi data contoh (dilewati bila database sudah berisi) |
| `npm run db:seed -- --reset` | Hapus semua data kos lalu isi ulang data contoh |
| `npm run db:studio` | Buka Drizzle Studio untuk melihat isi database |

Alur mengubah schema database: edit `src/db/schema.ts`, jalankan `npm run db:generate`, periksa file SQL di `drizzle/migrations/`, lalu `npm run db:migrate`. Commit file migrasi bersama perubahan schema.

## Variabel lingkungan

Lihat [.env.example](.env.example) untuk daftar lengkap.

| Variabel | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | Ya | Koneksi Postgres untuk aplikasi (pooled) |
| `DIRECT_URL` | Tidak | Koneksi langsung untuk drizzle-kit |
| `GEMINI_API_KEY` | Tidak | Pencarian AI; tanpa ini pencarian memakai kata kunci |
| `NEXT_PUBLIC_SAMPLE_DATA` | Tidak | `false` untuk mematikan mode data contoh |
| `NEXT_PUBLIC_SITE_URL` | Tidak | URL publik untuk metadata/SEO |

## Mode data contoh

Aktif secara default selama belum ada kerja sama dengan pemilik kos. Selama aktif:

- banner "data contoh" tampil di semua halaman,
- tombol WhatsApp dinonaktifkan dan nomor pemilik tidak dikirim ke browser,
- halaman detail kos tidak diindeks mesin pencari dan tidak masuk sitemap.

Setelah data kos asli masuk, set `NEXT_PUBLIC_SAMPLE_DATA=false` (di `.env` dan di pengaturan Vercel), lalu deploy ulang.

## Struktur folder

```
app/                 Halaman dan route API (App Router)
  api/               /api/kos, /api/kos/[slug], /api/areas, /api/search/ai
  explore/           Katalog dengan filter (dirender di server)
  kos/[slug]/        Detail kos
components/          Komponen UI per halaman (home, explore, detail, layout, shared, ui)
hooks/               Hook client (navigasi filter explore)
src/db/              Schema Drizzle, koneksi, seed
src/lib/             Logika server: query kos, pencarian AI, rate limit, konfigurasi
data/                Data contoh untuk seed
drizzle/migrations/  File migrasi SQL
tests/               Unit test
docs/                Dokumen perencanaan (arsip)
```

## Catatan keamanan

- Rate limit pencarian AI saat ini disimpan di memori per instance server. Di Vercel batas ini tidak berlaku lintas instance; untuk produksi yang ramai, ganti isi `checkRateLimit` di `src/lib/rate-limit.ts` dengan store bersama (mis. Upstash Redis).
- Jangan commit file `.env`.
