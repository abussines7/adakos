// app/api/kos/[slug]/route.ts
// Next.js Route Handler — Get detailed single Kos property
// Uses Drizzle Relational Query API to join all related sub-tables

import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { kos } from '@/src/db/schema';
import { and, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    // Query single Kos along with all relations
    const result = await db.query.kos.findFirst({
      where: and(eq(kos.slug, slug), eq(kos.is_published, true)),
      with: {
        area: true,
        pemilik: true,
        foto: {
          orderBy: (foto, { asc }) => [asc(foto.urutan)],
        },
        fasilitasInternal: {
          with: {
            fasilitas: true,
          },
        },
        fasilitasSekitar: true,
        ruteKampus: {
          orderBy: (rute, { asc }) => [asc(rute.urutan)],
        },
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Not Found', message: `Kos with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    // Format fields from camelCase to snake_case matching the front-end contracts
    const formattedData = {
      slug: result.slug,
      nama: result.nama,
      tipe: result.tipe,
      area: result.area ? {
        nama: result.area.nama,
        slug: result.area.slug,
      } : null,
      harga_bulanan: result.harga_bulanan,
      kondisi_jalan: result.kondisi_jalan,
      akses_kendaraan: result.akses_kendaraan,
      status_banjir: result.status_banjir,
      koordinat: {
        lat: result.latitude,
        lng: result.longitude,
      },
      pemilik: result.pemilik ? {
        nama: result.pemilik.nama,
        telepon: result.pemilik.telepon,
      } : null,
      foto: result.foto.map((f) => ({
        url: f.url,
        urutan: f.urutan,
        alt_text: f.alt_text,
      })),
      fasilitas_internal: result.fasilitasInternal
        .map((junction) => junction.fasilitas.nama),
      fasilitas_sekitar: result.fasilitasSekitar.map((fs) => ({
        nama: fs.nama,
        jarak_meter: fs.jarak_meter,
      })),
      rute_kampus: result.ruteKampus.map((r) => ({
        rute: r.rute,
        estimasi_waktu: r.estimasi_waktu,
        urutan: r.urutan,
      })),
    };

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error('Error fetching kos detail:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Gagal memuat detail kos' },
      { status: 500 }
    );
  }
}
