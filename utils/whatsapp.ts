// utils/whatsapp.ts
import { track } from '@vercel/analytics';

/**
 * Bangun URL WhatsApp dengan pesan template.
 * Sentralisasi di sini agar format pesan konsisten di seluruh aplikasi.
 */
export function buildWhatsAppUrl(kontakPemilik: string, kosNama: string): string {
  const phone = kontakPemilik.replace(/\D/g, '');
  if (!phone) {
    throw new Error('Invalid phone number');
  }

  const pesan = encodeURIComponent(
    `Halo, saya tertarik dengan ${kosNama}. Apakah masih tersedia?`
  );
  return `https://wa.me/${phone}?text=${pesan}`;
}

/**
 * Track klik WhatsApp CTA via Vercel Analytics.
 *
 * Production guard: tracking TIDAK berjalan di localhost/development.
 */
export function trackWhatsAppClick(kosId: string, kosNama: string): void {
  if (process.env.NODE_ENV === 'production') {
    track('whatsapp_click', { kosId, kosNama });
  }
}
