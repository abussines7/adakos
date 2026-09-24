/* eslint-disable @typescript-eslint/no-explicit-any */
export const revalidate = 300;

// app/kos/[id]/page.tsx
import { findPublishedKosBySlug } from '@/src/lib/kos-queries';
import { KosProperty } from '@/data/types';
import { notFound } from 'next/navigation';
import ImageGallery from '@/components/detail/ImageGallery';
import AccessibilitySection from '@/components/detail/AccessibilitySection';
import KosMap from '@/components/detail/KosMap';
import WhatsAppCTA from '@/components/detail/WhatsAppCTA';
import IconLabel from '@/components/shared/IconLabel';
import { MapPin, CheckCircle2 } from 'lucide-react';

export default async function KosDetail({ params }: { params: Promise<{ id: string }> }) {
  // Tunggu parameter URL terekstrak (Standar baru Next.js 15)
  const resolvedParams = await params;
  
  const result = await findPublishedKosBySlug(resolvedParams.id);
  
  if (!result) {
    notFound();
  }

  // Petakan ke format KosProperty agar komponen UI tidak break
  const kos: KosProperty = {
    id: result.slug,
    nama: result.nama,
    tipe: result.tipe,
    area: result.area ? result.area.nama : '',
    harga_bulanan: result.harga_bulanan,
    foto: result.foto ? result.foto.map((f: any) => f.url) : [],
    fasilitas_internal: result.fasilitasInternal
      ? result.fasilitasInternal.map((junction: any) => junction.fasilitas.nama)
      : [],
    kondisi_jalan: result.kondisi_jalan,
    akses_kendaraan: (result.akses_kendaraan || []) as any,
    status_banjir: result.status_banjir,
    fasilitas_sekitar: result.fasilitasSekitar
      ? result.fasilitasSekitar.map((fs: any) => ({
          nama: fs.nama,
          jarak_meter: fs.jarak_meter,
        }))
      : [],
    rute_kampus: result.ruteKampus
      ? result.ruteKampus.map((r: any) => ({
          rute: r.rute,
          estimasi_waktu: r.estimasi_waktu,
        }))
      : [],
    koordinat: {
      lat: result.latitude,
      lng: result.longitude,
    },
    kontak_pemilik: result.pemilik ? result.pemilik.telepon : '',
  };

  const hargaFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(kos.harga_bulanan);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <ImageGallery images={kos.foto} namaKos={kos.nama} />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <MapPin size={16} /> <span>{kos.area}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{kos.nama}</h1>
            <div className="text-2xl font-bold text-blue-600">
              {hargaFormatted} <span className="text-base font-normal text-slate-500">/ bulan</span>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Fasilitas Internal</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white p-6 rounded-2xl border border-slate-200">
              {kos.fasilitas_internal.map((fasilitas, idx) => (
                <IconLabel key={idx} icon={CheckCircle2} text={fasilitas} className="text-slate-700" />
              ))}
            </div>
          </section>

          <AccessibilitySection kos={kos} />
          <KosMap lat={kos.koordinat.lat} lng={kos.koordinat.lng} namaKos={kos.nama} />
        </div>
        
        {/* Sidebar — CTA WhatsApp */}
        <div className="w-full lg:w-80 shrink-0">
          <WhatsAppCTA
            kosId={kos.id}
            kosNama={kos.nama}
            kontakPemilik={kos.kontak_pemilik}
          />
        </div>
      </div>
    </div>
  );
}