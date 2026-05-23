Adakos — Final MVP Implementation Blueprint
Platform e-katalog indekos area Universitas Hasanuddin (Unhas). Fokus 100% pada Front-End & UI/UX statis dengan mock data.

1. Tech Stack & Tooling Teroptimasi
Kategori	Teknologi	Alasan Keputusan
Framework	Next.js 15 (App Router)	Ekosistem modern, file-based routing.
Bahasa	TypeScript	Type safety wajib untuk struktur data UI.
Styling	Tailwind CSS v3.4	Ringan, menghindari bug ekosistem v4 yang belum stabil.
Peta	Leaflet + React-Leaflet	Gratis. Dioptimalkan hanya untuk Marker & Radius.
Ikon	Lucide React	Ringan dan konsisten.
Transisi	Tailwind Native	Menggantikan Framer Motion untuk menghemat pemakaian CPU.
Manajemen State	Custom Hooks (Bawaan)	Menggunakan URL Search Params sebagai single source of truth.
2. Arsitektur Direktori
Plaintext
src/
├── app/
│   ├── layout.tsx              ← Root layout (Navbar + Footer)
│   ├── page.tsx                ← Homepage (Hero + Dropdown Search + Featured)
│   ├── explore/page.tsx        ← E-Katalog Grid + Filter Sidebar
│   └── kos/[id]/page.tsx       ← Detail Kos
├── components/
│   ├── layout/                 ← Navbar.tsx, Footer.tsx
│   ├── home/                   ← HeroSection.tsx, AreaDropdown.tsx, FeaturedKos.tsx
│   ├── explore/                ← KosGrid.tsx, KosCard.tsx, FilterSidebar.tsx, EmptyState.tsx
│   ├── detail/                 ← ImageGallery.tsx, KosInfo.tsx, AccessibilitySection.tsx, MapEmbed.tsx
│   └── shared/                 ← Badge.tsx, IconLabel.tsx
├── hooks/
│   └── useKosFilter.ts         ← ⭐ Single Source of Truth untuk filter
├── utils/
│   └── whatsapp.ts             ← Helper pembuat link WA dengan pesan template
└── data/
    ├── kos-data.ts             ← 9 Mock data JSON (3 Lengkap, 6 Ringkas)
    └── types.ts                ← TypeScript interfaces
3. Implementasi Kritis (Bloker Arsitektur)
A. Tipe Data Inti (types.ts)
Fokuskan struktur pada fitur nilai jual utama (USP) Adakos.

TypeScript
export interface KosProperty {
  id: string;
  nama: string;
  tipe: 'putra' | 'putri' | 'campur';
  area: string;
  harga_bulanan: number;
  foto: string[];
  fasilitas_internal: string[];
  // USP Fields
  kondisi_jalan: 'mulus' | 'cukup_baik' | 'rusak';
  akses_kendaraan: ('motor' | 'mobil')[];
  status_banjir: 'aman' | 'rawan' | 'kadang_tergenang';
  fasilitas_sekitar: { nama: string; jarak_meter: number }[];
  rute_kampus: { rute: string; estimasi_waktu: string }[];
  koordinat: { lat: number; lng: number };
  kontak_pemilik: string;
}
B. Hook Pemfilteran (useKosFilter.ts)
Gunakan hook ini di semua halaman yang membutuhkan filter. Jangan buat state lokal di komponen UI.

TypeScript
import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { kosData } from '@/data/kos-data';

export function useKosFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ekstrak parameter URL (berikan default fallback)
  const currentArea = searchParams.get('area') || 'semua';
  const currentTipe = searchParams.get('tipe') || 'semua';

  // Fungsi untuk update URL (tanpa memanipulasi data langsung)
  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'semua' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/explore?${params.toString()}`);
  };

  const resetFilters = () => router.push('/explore');

  // Bungkus logika filter dengan useMemo agar CPU tidak over-render
  const filteredKos = useMemo(() => {
    return kosData.filter(kos => {
      const matchArea = currentArea === 'semua' || kos.area === currentArea;
      const matchTipe = currentTipe === 'semua' || kos.tipe === currentTipe;
      return matchArea && matchTipe;
    });
  }, [searchParams]);

  return { currentArea, currentTipe, setFilter, resetFilters, filteredKos };
}
C. Strategi Data & Gambar Deterministik (kos-data.ts)
Jangan buang waktu mengunduh gambar. Gunakan generator URL.

TypeScript
const generatePhotos = (id: string) => [
  `https://picsum.photos/seed/${id}-1/800/450`,
  `https://picsum.photos/seed/${id}-2/800/450`,
  `https://picsum.photos/seed/${id}-3/800/450`,
];

export const kosData: KosProperty[] = [
  {
    id: "berkah-perintis",
    nama: "Kos Berkah Perintis",
    area: "Perintis Kemerdekaan 3",
    tipe: "putri",
    harga_bulanan: 800000,
    foto: generatePhotos("berkah-perintis"),
    // ... isi sisa data untuk 3 kos premium, menengah, dan ekonomis.
  }
];
4. Panduan Komponen & UI/UX
Pencarian (Homepage): Jangan gunakan input text bebas. Gunakan select dropdown berisi daftar 9 area spesifik untuk mencegah hasil pencarian kosong di awal.

Peta (MapEmbed.tsx): Wajib menggunakan Dynamic Import (ssr: false). Tampilkan hanya titik koordinat kos, titik gerbang Unhas, dan lingkaran radius. Hapus fitur rute dinamis (polyline) untuk menghemat performa.

Aksesibilitas (Detail Kos): Gunakan kartu dengan warna latar belakang yang berbeda untuk menonjolkan status bebas banjir dan kondisi jalan. Ini adalah fitur penentu Adakos.

Empty State (Explore): Jika filteredKos.length === 0, render komponen EmptyState.tsx yang berisi ilustrasi dan tombol CTA "Atur Ulang Filter".

WhatsApp Redirect: Gunakan format tautan bawaan: https://wa.me/{nomor}?text=Halo, saya melihat {namaKos} di Adakos....

5. Urutan Eksekusi (Dioptimalkan untuk Perangkat Terbatas)
Mengingat kapasitas RAM 8GB dan prosesor dual-core perangkatmu, selesaikan satu fase utuh di editor kode ringan sebelum menekan tombol Save, guna menghindari kompilasi ulang Next.js yang memberatkan sistem.

Fase	Fokus Komponen / File	Target Waktu
1. Fondasi	Inisialisasi project, setup Tailwind, buat types.ts dan kos-data.ts.	60 Menit
2. State	Implementasi hooks/useKosFilter.ts. Uji logika tanpa antarmuka rumit.	45 Menit
3. Shared UI	Buat Layout (Navbar, Footer), Badge.tsx, dan IconLabel.tsx.	30 Menit
4. Homepage	Bangun Hero Section, Dropdown Pencarian, dan Featured Grid.	45 Menit
5. Eksplorasi	Terapkan Grid Layout, Sidebar Filter, dan integrasikan EmptyState.	60 Menit
6. Detail Atas	Galeri foto, Info Utama Kos, dan daftar fasilitas internal.	45 Menit
7. Detail Bawah	Susun komponen Aksesibilitas (Banjir, Jalan) yang menjadi nilai jual utama.	75 Menit
8. Eksternal	Integrasikan Leaflet Peta dan utilitas tautan WhatsApp.	45 Menit
9. Polesan	Validasi tata letak responsif (mobile) dan efek hover Tailwind.	45 Menit