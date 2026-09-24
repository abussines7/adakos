// src/db/seed.ts
// Isi database dengan data contoh dari data/kos-data.ts.
//
//   npm run db:seed              -> hanya mengisi database yang masih kosong
//   npm run db:seed -- --reset   -> hapus seluruh data kos lalu isi ulang
import 'dotenv/config';
import { count } from 'drizzle-orm';
import { db } from './index';
import {
  area, pemilik, kos, kosFoto, fasilitasInternal,
  kosFasilitasInternal, fasilitasSekitar, ruteKampus,
} from './schema';
import { kosData } from '../../data/kos-data';

const generateSlug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const toIdMap = <T extends { id: string }>(rows: T[], key: (row: T) => string) =>
  new Map(rows.map((row) => [key(row), row.id]));

function requireId(map: Map<string, string>, key: string, label: string): string {
  const id = map.get(key);
  if (!id) {
    throw new Error(`${label} "${key}" tidak ditemukan saat seeding`);
  }
  return id;
}

async function main() {
  const reset = process.argv.includes('--reset');
  const [{ value: existing }] = await db.select({ value: count() }).from(kos);

  if (existing > 0 && !reset) {
    console.log(`Database sudah berisi ${existing} kos. Seeding dilewati.`);
    console.log('Jalankan "npm run db:seed -- --reset" untuk menghapus dan mengisi ulang data.');
    return;
  }

  console.log('🚀 Memulai proses seeding data...');

  await db.transaction(async (tx) => {
    if (existing > 0) {
      console.log(`Menghapus ${existing} kos beserta data terkait...`);
      // Foto, fasilitas, dan rute ikut terhapus lewat ON DELETE CASCADE.
      await tx.delete(kos);
      await tx.delete(fasilitasInternal);
      await tx.delete(pemilik);
      await tx.delete(area);
    }

    const uniqueAreas = Array.from(new Set(kosData.map((k) => k.area)));
    const areaIds = toIdMap(
      await tx.insert(area).values(uniqueAreas.map((nama) => ({ nama, slug: generateSlug(nama) }))).returning(),
      (row) => row.nama
    );

    const uniqueTelepon = Array.from(new Set(kosData.map((k) => k.kontak_pemilik)));
    const pemilikIds = toIdMap(
      await tx.insert(pemilik).values(uniqueTelepon.map((telepon) => ({ nama: `Pemilik ${telepon}`, telepon }))).returning(),
      (row) => row.telepon
    );

    const kosIds = toIdMap(
      await tx.insert(kos).values(
        kosData.map((k) => ({
          slug: k.id,
          nama: k.nama,
          tipe: k.tipe,
          area_id: requireId(areaIds, k.area, 'Area'),
          harga_bulanan: k.harga_bulanan,
          kondisi_jalan: k.kondisi_jalan,
          akses_kendaraan: k.akses_kendaraan,
          status_banjir: k.status_banjir,
          latitude: k.koordinat.lat,
          longitude: k.koordinat.lng,
          pemilik_id: requireId(pemilikIds, k.kontak_pemilik, 'Pemilik'),
        }))
      ).returning(),
      (row) => row.slug
    );

    await tx.insert(kosFoto).values(
      kosData.flatMap((k) =>
        k.foto.map((url, index) => ({
          kos_id: requireId(kosIds, k.id, 'Kos'),
          url,
          urutan: index,
          alt_text: `Foto ${index + 1} - ${k.nama}`,
        }))
      )
    );

    const uniqueFasilitas = Array.from(new Set(kosData.flatMap((k) => k.fasilitas_internal)));
    const fasilitasIds = toIdMap(
      await tx.insert(fasilitasInternal).values(uniqueFasilitas.map((nama) => ({ nama }))).returning(),
      (row) => row.nama
    );

    await tx.insert(kosFasilitasInternal).values(
      kosData.flatMap((k) =>
        k.fasilitas_internal.map((fasilitas) => ({
          kos_id: requireId(kosIds, k.id, 'Kos'),
          fasilitas_id: requireId(fasilitasIds, fasilitas, 'Fasilitas'),
        }))
      )
    );

    const fasSekitarPayload = kosData.flatMap((k) =>
      k.fasilitas_sekitar.map((fas) => ({
        kos_id: requireId(kosIds, k.id, 'Kos'),
        nama: fas.nama,
        jarak_meter: fas.jarak_meter,
      }))
    );
    if (fasSekitarPayload.length > 0) {
      await tx.insert(fasilitasSekitar).values(fasSekitarPayload);
    }

    const rutePayload = kosData.flatMap((k) =>
      k.rute_kampus.map((rute, index) => ({
        kos_id: requireId(kosIds, k.id, 'Kos'),
        rute: rute.rute,
        estimasi_waktu: rute.estimasi_waktu,
        urutan: index,
      }))
    );
    if (rutePayload.length > 0) {
      await tx.insert(ruteKampus).values(rutePayload);
    }

    console.log(
      `Tersimpan: ${areaIds.size} area, ${pemilikIds.size} pemilik, ${kosIds.size} kos, ${fasilitasIds.size} fasilitas.`
    );
  });

  console.log('✅ SEEDING SELESAI DENGAN SUKSES!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ GAGAL MELAKUKAN SEEDING:', error);
    process.exit(1);
  });
