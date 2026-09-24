// app/page.tsx
import { listPublishedKos } from '@/src/lib/kos-queries';
import { getCachedAreas } from '@/src/lib/areas';
import { KosProperty } from '@/data/types';
import HeroSection from '@/components/home/HeroSection';
import FeaturedKos from '@/components/home/FeaturedKos';

export const revalidate = 60;

export default async function Home() {
  let kosList: KosProperty[] = [];
  try {
    // Ambil 3 kos terbaru (is_published: true) beserta area dan foto utama
    const { data: rows } = await listPublishedKos({}, { limit: 3, offset: 0 });

    // Petakan ke format KosProperty agar tidak break komponen UI
    kosList = rows.map((row) => ({
      id: row.slug,
      nama: row.nama,
      tipe: row.tipe,
      area: row.area ? row.area.nama : '',
      harga_bulanan: row.harga_bulanan,
      foto: row.foto_utama ? [row.foto_utama] : [],
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
    console.error('Gagal memuat data dari database/mock:', error);
  }

  let areas: Awaited<ReturnType<typeof getCachedAreas>> = [];
  try {
    areas = await getCachedAreas();
  } catch (error) {
    console.error('Gagal memuat daftar area:', error);
  }

  return (
    <div className="flex flex-col">
      <HeroSection areas={areas} />
      <FeaturedKos kosList={kosList} />
    </div>
  );
}