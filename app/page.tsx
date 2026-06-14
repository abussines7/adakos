// app/page.tsx
import { db } from '@/src/db';
import { kos, area, kosFoto } from '@/src/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { KosProperty } from '@/data/types';
import HeroSection from '@/components/home/HeroSection';
import FeaturedKos from '@/components/home/FeaturedKos';

export const revalidate = 60;

export default async function Home() {
  let kosList: KosProperty[] = [];
  try {
    // Ambil 3 kos terbaru (is_published: true) beserta area dan foto utama
    const rows = await db
      .select({
        slug: kos.slug,
        nama: kos.nama,
        tipe: kos.tipe,
        harga_bulanan: kos.harga_bulanan,
        status_banjir: kos.status_banjir,
        kondisi_jalan: kos.kondisi_jalan,
        area: {
          nama: area.nama,
        },
        fotoUtama: kosFoto.url,
      })
      .from(kos)
      .leftJoin(area, eq(kos.area_id, area.id))
      .leftJoin(kosFoto, and(eq(kos.id, kosFoto.kos_id), eq(kosFoto.urutan, 0)))
      .where(eq(kos.is_published, true))
      .orderBy(desc(kos.created_at))
      .limit(3);

    // Petakan ke format KosProperty agar tidak break komponen UI
    kosList = rows.map((row) => ({
      id: row.slug,
      nama: row.nama,
      tipe: row.tipe,
      area: row.area ? row.area.nama : '',
      harga_bulanan: row.harga_bulanan,
      foto: row.fotoUtama ? [row.fotoUtama] : [],
      fasilitas_internal: [],
      kondisi_jalan: row.kondisi_jalan,
      akses_kendaraan: [],
      status_banjir: row.status_banjir,
      fasilitas_sekitar: [],
      rute_kampus: [],
      koordinat: { lat: 0, lng: 0 },
      kontak_pemilik: '',
    }));
  } catch (error) {
    console.warn('Gagal memuat data dari database:', error);
    const isPlaceholderDb = 
      process.env.DATABASE_URL?.includes('[PASSWORD_ANDA]') || 
      process.env.DIRECT_URL?.includes('[PASSWORD_ANDA]') ||
      !process.env.DATABASE_URL;
      
    if (isPlaceholderDb) {
      console.info('Menggunakan fallback mock data karena database belum terkonfigurasi.');
      const { kosData } = require('@/data/kos-data');
      kosList = kosData.slice(0, 3);
    } else {
      throw error;
    }
  }

  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedKos kosList={kosList} />
    </div>
  );
}