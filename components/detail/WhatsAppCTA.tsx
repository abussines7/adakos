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
  const handleClick = () => {
    // Track event via Vercel Analytics (hanya di production)
    trackWhatsAppClick(kosId, kosNama);

    // Buka WhatsApp di tab baru — UX tetap instan tanpa menunggu tracking
    window.open(buildWhatsAppUrl(kontakPemilik, kosNama), '_blank');
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24">
      <h3 className="font-bold text-lg text-slate-900 mb-4">Hubungi Pemilik</h3>
      <p className="text-sm text-slate-500 mb-4">
        Tertarik dengan kos ini? Hubungi pemilik langsung via WhatsApp.
      </p>
      <button
        id="whatsapp-cta"
        onClick={handleClick}
        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 cursor-pointer"
      >
        <MessageCircle size={20} />
        Chat via WhatsApp
      </button>
    </div>
  );
}
