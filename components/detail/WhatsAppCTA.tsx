// components/detail/WhatsAppCTA.tsx
'use client';

import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, trackWhatsAppClick } from '@/utils/whatsapp';

interface WhatsAppCTAProps {
  kosId: string;
  kosNama: string;
  kontakPemilik: string;
}

export default function WhatsAppCTA({ kosId, kosNama, kontakPemilik }: WhatsAppCTAProps) {
  let whatsappUrl = '#';
  try {
    whatsappUrl = buildWhatsAppUrl(kontakPemilik, kosNama);
  } catch (error) {
    console.error('Gagal membuat WhatsApp URL:', error);
  }

  const handleTrackClick = () => {
    trackWhatsAppClick(kosId, kosNama);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24">
      <h3 className="font-bold text-lg text-slate-900 mb-4">Hubungi Pemilik</h3>
      <p className="text-sm text-slate-500 mb-4">
        Tertarik dengan kos ini? Hubungi pemilik langsung via WhatsApp.
      </p>
      {whatsappUrl !== '#' ? (
        <a
          id="whatsapp-cta"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleTrackClick}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 text-center"
        >
          <MessageCircle size={20} />
          <span>Chat via WhatsApp</span>
        </a>
      ) : (
        <div className="w-full text-center text-sm py-3 px-6 bg-slate-100 text-slate-400 font-semibold rounded-xl border border-dashed border-slate-200">
          Kontak Tidak Tersedia
        </div>
      )}
    </div>
  );
}
