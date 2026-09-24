import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BANJIR_INFO, JALAN_INFO, travelMode } from '@/src/lib/kos-labels';
import { formatJarak, formatRupiah } from '@/src/lib/format';

describe('tingkat waspada', () => {
  it('naik dari kondisi terbaik ke terburuk', () => {
    assert.deepEqual(
      [BANJIR_INFO.aman.level, BANJIR_INFO.kadang_tergenang.level, BANJIR_INFO.rawan.level],
      [1, 2, 3]
    );
    assert.deepEqual([JALAN_INFO.mulus.level, JALAN_INFO.cukup_baik.level, JALAN_INFO.rusak.level], [1, 2, 3]);
  });
});

describe('travelMode', () => {
  it('mengenali moda dari teks estimasi', () => {
    assert.equal(travelMode('5 menit naik motor'), 'motor');
    assert.equal(travelMode('10 menit jalan kaki'), 'jalan');
    assert.equal(travelMode('15 menit'), 'lainnya');
  });
});

describe('format', () => {
  it('memformat rupiah tanpa spasi dan desimal', () => {
    assert.equal(formatRupiah(800000), 'Rp800.000');
    assert.equal(formatRupiah(1250000), 'Rp1.250.000');
  });

  it('memformat jarak dalam meter atau kilometer', () => {
    assert.equal(formatJarak(50), '50 m');
    assert.equal(formatJarak(1200), '1,2 km');
    assert.equal(formatJarak(2000), '2 km');
  });
});
