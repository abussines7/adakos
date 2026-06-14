import { db } from './index';
import {
  area, pemilik, kos, kosFoto, fasilitasInternal,
  kosFasilitasInternal, fasilitasSekitar, ruteKampus
} from './schema';
import { kosData } from '../../data/kos-data';

const generateSlug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

async function main() {
  console.log('🚀 Memulai proses seeding data...');

  try {
    const uniqueAreas = Array.from(new Set(kosData.map((k) => k.area)));
    console.log(`Menemukan ${uniqueAreas.length} area unik. Menyisipkan ke database...`);

    const insertedAreas = await db.insert(area).values(
      uniqueAreas.map((nama) => ({
        nama,
        slug: generateSlug(nama),
      }))
    ).returning();

    const areaNameToId = insertedAreas.reduce((acc, curr) => {
      acc[curr.nama] = curr.id;
      return acc;
    }, {} as Record<string, string>);

    const uniqueTelepon = Array.from(new Set(kosData.map((k) => k.kontak_pemilik)));
    console.log(`Menemukan ${uniqueTelepon.length} pemilik unik. Menyisipkan ke database...`);

    const insertedPemilik = await db.insert(pemilik).values(
      uniqueTelepon.map((telepon) => ({
        nama: `Pemilik ${telepon}`,
        telepon,
      }))
    ).returning();

    const teleponToPemilikId = insertedPemilik.reduce((acc, curr) => {
      acc[curr.telepon] = curr.id;
      return acc;
    }, {} as Record<string, string>);

    console.log(`Menyisipkan ${kosData.length} entitas kos...`);

    const insertedKos = await db.insert(kos).values(
      kosData.map((k) => ({
        slug: k.id,
        nama: k.nama,
        tipe: k.tipe as any,
        area_id: areaNameToId[k.area],
        harga_bulanan: k.harga_bulanan,
        kondisi_jalan: k.kondisi_jalan as any,
        akses_kendaraan: k.akses_kendaraan,
        status_banjir: k.status_banjir as any,
        latitude: k.koordinat.lat,
        longitude: k.koordinat.lng,
        pemilik_id: teleponToPemilikId[k.kontak_pemilik],
      }))
    ).returning();

    const kosSlugToId = insertedKos.reduce((acc, curr) => {
      acc[curr.slug] = curr.id;
      return acc;
    }, {} as Record<string, string>);

    console.log('Menyisipkan relasi foto kos...');
    const fotoPayload = kosData.flatMap((k) =>
      k.foto.map((url, index) => ({
        kos_id: kosSlugToId[k.id],
        url,
        urutan: index,
        alt_text: `Foto ${index + 1} - ${k.nama}`,
      }))
    );
    await db.insert(kosFoto).values(fotoPayload);

    const allFasilitas = kosData.flatMap((k) => k.fasilitas_internal);
    const uniqueFasilitas = Array.from(new Set(allFasilitas));
    console.log(`Menemukan ${uniqueFasilitas.length} fasilitas unik. Menyisipkan ke database...`);

    const insertedFasilitas = await db.insert(fasilitasInternal).values(
      uniqueFasilitas.map((nama) => ({ nama }))
    ).returning();

    const fasilitasNameToId = insertedFasilitas.reduce((acc, curr) => {
      acc[curr.nama] = curr.id;
      return acc;
    }, {} as Record<string, string>);

    console.log('Menyisipkan relasi many-to-many kos_fasilitas_internal...');
    const junctionPayload = kosData.flatMap((k) =>
      k.fasilitas_internal.map((fasilitas) => ({
        kos_id: kosSlugToId[k.id],
        fasilitas_id: fasilitasNameToId[fasilitas],
      }))
    );
    await db.insert(kosFasilitasInternal).values(junctionPayload);

    console.log('Menyisipkan fasilitas sekitar...');
    const fasSekitarPayload = kosData.flatMap((k) =>
      (k.fasilitas_sekitar || []).map((fas) => ({
        kos_id: kosSlugToId[k.id],
        nama: fas.nama,
        jarak_meter: fas.jarak_meter,
      }))
    );
    if (fasSekitarPayload.length > 0) {
      await db.insert(fasilitasSekitar).values(fasSekitarPayload);
    }

    console.log('Menyisipkan rute kampus...');
    const rutePayload = kosData.flatMap((k) =>
      (k.rute_kampus || []).map((rute, index) => ({
        kos_id: kosSlugToId[k.id],
        rute: rute.rute,
        estimasi_waktu: rute.estimasi_waktu,
        urutan: index,
      }))
    );
    if (rutePayload.length > 0) {
      await db.insert(ruteKampus).values(rutePayload);
    }

    console.log('✅ SEEDING SELESAI DENGAN SUKSES!');

  } catch (error) {
    console.error('❌ GAGAL MELAKUKAN SEEDING:', error);
    process.exit(1);
  }
}

main();