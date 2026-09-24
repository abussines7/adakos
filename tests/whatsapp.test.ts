import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppUrl } from '@/utils/whatsapp';

describe('buildWhatsAppUrl', () => {
  it('menormalisasi nomor lokal ke format internasional Indonesia', () => {
    assert.match(buildWhatsAppUrl('0812-3456-7890', 'Kos A'), /^https:\/\/wa\.me\/6281234567890\?/);
    assert.match(buildWhatsAppUrl('81234567890', 'Kos A'), /^https:\/\/wa\.me\/6281234567890\?/);
    assert.match(buildWhatsAppUrl('+62 812 3456 7890', 'Kos A'), /^https:\/\/wa\.me\/6281234567890\?/);
  });

  it('meng-encode nama kos di pesan', () => {
    const url = new URL(buildWhatsAppUrl('6281234567890', 'Kos Putri & Co'));
    assert.equal(url.searchParams.get('text'), 'Halo, saya tertarik dengan Kos Putri & Co. Apakah masih tersedia?');
  });

  it('menolak nomor kosong', () => {
    assert.throws(() => buildWhatsAppUrl('', 'Kos A'));
    assert.throws(() => buildWhatsAppUrl('abc', 'Kos A'));
  });
});
