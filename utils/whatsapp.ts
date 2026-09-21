// utils/whatsapp.ts
import { track } from '@vercel/analytics';

/**
 * Bangun URL WhatsApp dengan pesan template.
 * Sentralisasi di sini agar format pesan konsisten di seluruh aplikasi.
 */
export function buildWhatsAppUrl(kontakPemilik: string, kosNama: string): string {
  let phone = kontakPemilik.replace(/\D/g, '');
  if (!phone) {
    throw new Error('Invalid phone number');
  }

  // Normalisasi nomor telepon ke format internasional (khusus Indonesia)
  if (phone.startsWith('0')) {
    phone = '62' + phone.slice(1);
  } else if (phone.startsWith('8')) {
    phone = '62' + phone;
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
