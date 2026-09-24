// components/detail/WhatsAppCTA.tsx
'use client';

import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, trackWhatsAppClick } from '@/utils/whatsapp';
import { SAMPLE_DATA_MODE } from '@/src/lib/site-config';
import { formatRupiah } from '@/src/lib/format';

interface WhatsAppCTAProps {
  kosId: string;
  kosNama: string;
  kontakPemilik: string;
  hargaBulanan: number;
}

function Unavailable({ message }: { message: string }) {
  return (
    <>
      <p className="text-sm leading-relaxed text-ink-soft">{message}</p>
      <p className="mt-4 rounded-sm border-2 border-dashed border-ink/30 px-4 py-3 text-center text-sm font-semibold text-muted-ink">
        Kontak belum tersedia
      </p>
    </>
  );
}

export default function WhatsAppCTA({ kosId, kosNama, kontakPemilik, hargaBulanan }: WhatsAppCTAProps) {
  let whatsappUrl: string | null = null;
  if (!SAMPLE_DATA_MODE) {
    try {
      whatsappUrl = buildWhatsAppUrl(kontakPemilik, kosNama);
    } catch (error) {
      console.error('Gagal membuat WhatsApp URL:', error);
    }
  }

  return (
    <div className="panel overflow-hidden lg:sticky lg:top-24">
      <div className="border-b-2 border-ink bg-paper-deep px-5 py-4">
        <p className="font-mono text-xs text-muted-ink">Harga per bulan</p>
        <p className="mt-1 font-mono text-2xl font-semibold">{formatRupiah(hargaBulanan)}</p>
      </div>
      <div className="p-5">
        <h2 className="mb-2 font-bold">Hubungi pemilik</h2>
        {SAMPLE_DATA_MODE ? (
          <Unavailable message="Kos ini adalah data contoh, jadi belum ada pemilik yang bisa dihubungi." />
        ) : whatsappUrl ? (
          <>
            <p className="text-sm leading-relaxed text-ink-soft">
              Tanyakan ketersediaan kamar atau atur jadwal survei langsung lewat WhatsApp.
            </p>
            <a
              id="whatsapp-cta"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick(kosId, kosNama)}
              className="btn mt-4 w-full bg-sign text-white hover:bg-sign-deep"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Chat via WhatsApp
            </a>
          </>
        ) : (
          <Unavailable message="Nomor pemilik belum tercatat untuk kos ini." />
        )}
      </div>
    </div>
  );
}
