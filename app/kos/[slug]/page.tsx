// app/kos/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, MapPin } from 'lucide-react';
import { findPublishedKosBySlug } from '@/src/lib/kos-queries';
import { KosProperty } from '@/data/types';
import { SAMPLE_DATA_MODE } from '@/src/lib/site-config';
import { TIPE_LABEL } from '@/src/lib/kos-labels';
import { formatRupiah } from '@/src/lib/format';
import ImageGallery from '@/components/detail/ImageGallery';
import InfoBoard from '@/components/detail/InfoBoard';
import AccessibilitySection from '@/components/detail/AccessibilitySection';
import KosMap from '@/components/detail/KosMap';
import WhatsAppCTA from '@/components/detail/WhatsAppCTA';

export const revalidate = 300;

type KosPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: KosPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await findPublishedKosBySlug(slug);

  if (!result) {
    return { title: 'Kos tidak ditemukan' };
  }

  const areaNama = result.area?.nama ?? 'sekitar Unhas';
  const description = `Kos ${result.tipe} di ${areaNama}, ${formatRupiah(result.harga_bulanan)}/bulan. Lihat kondisi jalan, status banjir, dan rute ke kampus Unhas.`;
  const fotoUtama = result.foto[0]?.url;

  return {
    title: result.nama,
    description,
    alternates: { canonical: `/kos/${result.slug}` },
    // Kos data contoh bukan listing sungguhan; jangan diindeks mesin pencari.
    robots: SAMPLE_DATA_MODE ? { index: false, follow: true } : undefined,
    openGraph: {
      title: result.nama,
      description,
      url: `/kos/${result.slug}`,
      images: fotoUtama ? [{ url: fotoUtama, alt: result.nama }] : undefined,
    },
  };
}

const isAksesKendaraan = (value: string): value is KosProperty['akses_kendaraan'][number] =>
  value === 'motor' || value === 'mobil';

export default async function KosDetail({ params }: KosPageProps) {
  const { slug } = await params;
  const result = await findPublishedKosBySlug(slug);

  if (!result) {
    notFound();
  }

  const kos: KosProperty = {
    id: result.slug,
    nama: result.nama,
    tipe: result.tipe,
    area: result.area ? result.area.nama : '',
    harga_bulanan: result.harga_bulanan,
    foto: result.foto.map((f) => f.url),
    fasilitas_internal: result.fasilitasInternal.map((junction) => junction.fasilitas.nama),
    kondisi_jalan: result.kondisi_jalan,
    akses_kendaraan: result.akses_kendaraan.filter(isAksesKendaraan),
    status_banjir: result.status_banjir,
    fasilitas_sekitar: result.fasilitasSekitar.map((fs) => ({
      nama: fs.nama,
      jarak_meter: fs.jarak_meter,
    })),
    rute_kampus: result.ruteKampus.map((r) => ({
      rute: r.rute,
      estimasi_waktu: r.estimasi_waktu,
    })),
    koordinat: {
      lat: result.latitude,
      lng: result.longitude,
    },
    // Props client component ikut terkirim ke browser; jangan kirim nomor data contoh.
    kontak_pemilik: result.pemilik && !SAMPLE_DATA_MODE ? result.pemilik.telepon : '',
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-ink">
        <Link href="/explore" className="hover:text-ink hover:underline">
          Eksplorasi
        </Link>
        {result.area && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/explore?area=${encodeURIComponent(result.area.slug)}`} className="hover:text-ink hover:underline">
              {result.area.nama}
            </Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-ink">
          {kos.nama}
        </span>
      </nav>

      <ImageGallery images={kos.foto} namaKos={kos.nama} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-12">
          <header>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-sm bg-ink px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-paper">
                Kos {TIPE_LABEL[kos.tipe]}
              </span>
              {kos.area && (
                <span className="flex items-center gap-1 text-sm text-muted-ink">
                  <MapPin size={15} aria-hidden="true" />
                  {kos.area}
                </span>
              )}
            </div>
            <h1 className="mt-3 font-wide text-3xl leading-tight sm:text-[2.6rem]">{kos.nama}</h1>
            <p className="mt-3 font-mono text-2xl font-semibold">
              {formatRupiah(kos.harga_bulanan)}
              <span className="text-base font-normal text-muted-ink">/bulan</span>
            </p>
            <div className="mt-6">
              <InfoBoard
                statusBanjir={kos.status_banjir}
                kondisiJalan={kos.kondisi_jalan}
                estimasiKeKampus={kos.rute_kampus[0]?.estimasi_waktu}
                aksesKendaraan={kos.akses_kendaraan}
              />
            </div>
          </header>

          <AccessibilitySection kos={kos} />

          <section aria-labelledby="fasilitas-heading">
            <h2 id="fasilitas-heading" className="font-wide text-2xl">
              Fasilitas kamar
            </h2>
            {kos.fasilitas_internal.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {kos.fasilitas_internal.map((fasilitas) => (
                  <li
                    key={fasilitas}
                    className="flex items-center gap-2 rounded-sm border-2 border-ink/15 bg-white px-3 py-2 text-sm font-semibold"
                  >
                    <Check size={15} aria-hidden="true" className="text-sign" />
                    {fasilitas}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-ink">Fasilitas kamar belum dicatat.</p>
            )}
          </section>

          <KosMap lat={kos.koordinat.lat} lng={kos.koordinat.lng} namaKos={kos.nama} />
        </div>

        <aside>
          <WhatsAppCTA
            kosId={kos.id}
            kosNama={kos.nama}
            kontakPemilik={kos.kontak_pemilik}
            hargaBulanan={kos.harga_bulanan}
          />
        </aside>
      </div>
    </div>
  );
}
