import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_QUERY_LENGTH,
  sanitizeUserQuery,
  toClientAiParams,
  validateAiParams,
} from '@/src/lib/ai-search';

const AREAS = new Set(['sahabat', 'jalan-bung']);

describe('sanitizeUserQuery', () => {
  it('memangkas spasi di awal dan akhir', () => {
    assert.equal(sanitizeUserQuery('  kos putri  '), 'kos putri');
  });

  it('menolak input bukan string atau kosong', () => {
    assert.throws(() => sanitizeUserQuery(undefined));
    assert.throws(() => sanitizeUserQuery(123));
    assert.throws(() => sanitizeUserQuery('   '));
  });

  it('menolak query yang terlalu panjang', () => {
    assert.throws(() => sanitizeUserQuery('a'.repeat(MAX_QUERY_LENGTH + 1)));
    assert.equal(sanitizeUserQuery('a'.repeat(MAX_QUERY_LENGTH)).length, MAX_QUERY_LENGTH);
  });
});

describe('validateAiParams', () => {
  it('meneruskan nilai yang valid', () => {
    const result = validateAiParams(
      {
        tipe: 'putri',
        area_slug: 'sahabat',
        kondisi_jalan: 'mulus',
        status_banjir: 'aman',
        harga_min: 500000,
        harga_max: 1000000,
        keyword: 'wifi',
      },
      AREAS
    );
    assert.deepEqual(result, {
      tipe: 'putri',
      area_slug: 'sahabat',
      kondisi_jalan: 'mulus',
      status_banjir: 'aman',
      harga_min: 500000,
      harga_max: 1000000,
      keyword: 'wifi',
    });
  });

  it('mengganti nilai enum dan area yang tidak dikenal dengan "all"', () => {
    const result = validateAiParams(
      { tipe: 'hack', area_slug: 'area-palsu', kondisi_jalan: 1, status_banjir: null },
      AREAS
    );
    assert.equal(result.tipe, 'all');
    assert.equal(result.area_slug, 'all');
    assert.equal(result.kondisi_jalan, 'all');
    assert.equal(result.status_banjir, 'all');
  });

  it('membatasi harga agar tetap dalam rentang integer Postgres', () => {
    const result = validateAiParams({ harga_min: -5, harga_max: 5e12 }, AREAS);
    assert.equal(result.harga_min, 0);
    assert.equal(result.harga_max, 100_000_000);
  });

  it('memotong keyword yang terlalu panjang dan menangani input null', () => {
    assert.equal(validateAiParams({ keyword: 'x'.repeat(500) }, AREAS).keyword.length, 100);
    assert.equal(validateAiParams(null, AREAS).tipe, 'all');
  });
});

describe('toClientAiParams', () => {
  it('mengubah "all", 0, dan string kosong menjadi null', () => {
    const client = toClientAiParams({
      tipe: 'all',
      area_slug: 'all',
      kondisi_jalan: 'all',
      status_banjir: 'aman',
      harga_min: 0,
      harga_max: 1000000,
      keyword: '',
    });
    assert.deepEqual(client, {
      tipe: null,
      area_slug: null,
      kondisi_jalan: null,
      status_banjir: 'aman',
      harga_min: null,
      harga_max: 1000000,
      keyword: null,
    });
  });
});
