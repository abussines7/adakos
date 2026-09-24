import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  aiParamsToFilters,
  escapeLikePattern,
  parseKosFiltersFromSearchParams,
  tokenizeFallbackQuery,
} from '@/src/lib/kos-queries';

const BS = '\\';

describe('escapeLikePattern', () => {
  it('meng-escape wildcard LIKE dan backslash', () => {
    assert.equal(escapeLikePattern('100%_off'), `100${BS}%${BS}_off`);
    assert.equal(escapeLikePattern(`a${BS}b`), `a${BS}${BS}b`);
  });

  it('tidak mengubah teks biasa', () => {
    assert.equal(escapeLikePattern('kamar mandi dalam'), 'kamar mandi dalam');
  });
});

describe('parseKosFiltersFromSearchParams', () => {
  const parse = (query: Record<string, string>) =>
    parseKosFiltersFromSearchParams(new URLSearchParams(query));

  it('menerima nilai yang valid', () => {
    const filters = parse({
      tipe: 'putri',
      status_banjir: 'aman',
      kondisi_jalan: 'mulus',
      harga_min: '500000',
      harga_max: '1500000',
      q: ' wifi ',
      area: 'jalan-bung',
    });
    assert.equal(filters.tipe, 'putri');
    assert.equal(filters.statusBanjir, 'aman');
    assert.equal(filters.kondisiJalan, 'mulus');
    assert.equal(filters.hargaMin, 500000);
    assert.equal(filters.hargaMax, 1500000);
    assert.equal(filters.keyword, 'wifi');
    assert.equal(filters.areaSlug, 'jalan-bung');
  });

  it('membuang nilai yang tidak valid', () => {
    const filters = parse({
      tipe: 'semua',
      status_banjir: 'bogus',
      kondisi_jalan: 'bogus',
      harga_min: '-5',
      harga_max: 'abc',
      q: '   ',
      area: 'DROP TABLE',
    });
    assert.equal(filters.tipe, undefined);
    assert.equal(filters.statusBanjir, undefined);
    assert.equal(filters.kondisiJalan, undefined);
    assert.equal(filters.hargaMin, undefined);
    assert.equal(filters.hargaMax, undefined);
    assert.equal(filters.keyword, undefined);
    assert.equal(filters.areaSlug, undefined);
  });

  it('membatasi harga dan panjang kata kunci', () => {
    const filters = parse({ harga_max: '99999999999', q: 'x'.repeat(300) });
    assert.equal(filters.hargaMax, 100_000_000);
    assert.equal(filters.keyword?.length, 100);
  });
});

describe('aiParamsToFilters', () => {
  it('mengabaikan nilai "all", 0, dan keyword kosong', () => {
    const filters = aiParamsToFilters({
      tipe: 'all',
      area_slug: 'sahabat',
      kondisi_jalan: 'all',
      status_banjir: 'aman',
      harga_min: 0,
      harga_max: 1000000,
      keyword: '  ',
    });
    assert.deepEqual(filters, { statusBanjir: 'aman', hargaMax: 1000000, areaSlug: 'sahabat' });
  });
});

describe('tokenizeFallbackQuery', () => {
  it('membuang stop word dan tanda baca, tanpa duplikat', () => {
    assert.deepEqual(tokenizeFallbackQuery('Cari kos yang ada WiFi, AC dan wifi!'), ['wifi', 'ac']);
  });

  it('memisahkan kata bertanda hubung alih-alih menyatukannya', () => {
    assert.deepEqual(tokenizeFallbackQuery('kera-kera'), ['kera']);
  });

  it('membatasi jumlah token menjadi 8', () => {
    assert.equal(tokenizeFallbackQuery('a1 b1 c1 d1 e1 f1 g1 h1 i1 j1').length, 8);
  });
});
