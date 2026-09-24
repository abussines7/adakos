import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EXPLORE_PAGE_SIZE, parseExploreParams } from '@/src/lib/explore-params';

describe('parseExploreParams', () => {
  it('memakai nilai default saat tanpa parameter', () => {
    const params = parseExploreParams({});
    assert.equal(params.currentArea, 'semua');
    assert.equal(params.currentTipe, 'semua');
    assert.equal(params.aiQuery, '');
    assert.equal(params.limit, EXPLORE_PAGE_SIZE);
    assert.equal(params.canLoadMore, true);
    assert.equal(params.loadMoreHref, `/explore?limit=${EXPLORE_PAGE_SIZE * 2}`);
  });

  it('mengabaikan limit dari resultsKey agar "muat lebih banyak" tidak me-reset Suspense', () => {
    const a = parseExploreParams({ area: 'sahabat', limit: '24' });
    const b = parseExploreParams({ area: 'sahabat' });
    assert.equal(a.resultsKey, b.resultsKey);
    assert.equal(a.loadMoreHref, '/explore?area=sahabat&limit=36');
  });

  it('membatasi limit ke rentang yang diizinkan', () => {
    assert.equal(parseExploreParams({ limit: '1' }).limit, EXPLORE_PAGE_SIZE);
    const max = parseExploreParams({ limit: '100000' });
    assert.equal(max.limit, 96);
    assert.equal(max.canLoadMore, false);
    assert.equal(parseExploreParams({ limit: 'abc' }).limit, EXPLORE_PAGE_SIZE);
  });

  it('menandai filter cepat hanya untuk nilai yang valid', () => {
    const active = parseExploreParams({ status_banjir: 'aman', kondisi_jalan: 'mulus' });
    assert.equal(active.onlyBebasBanjir, true);
    assert.equal(active.onlyJalanMulus, true);

    const other = parseExploreParams({ status_banjir: 'rawan', kondisi_jalan: 'bogus' });
    assert.equal(other.onlyBebasBanjir, false);
    assert.equal(other.onlyJalanMulus, false);
  });

  it('mengambil nilai pertama bila parameter berulang, dan memotong query AI', () => {
    const params = parseExploreParams({ tipe: ['putra', 'putri'], ai_query: ` ${'q'.repeat(300)} ` });
    assert.equal(params.currentTipe, 'putra');
    assert.equal(params.filters.tipe, 'putra');
    assert.equal(params.aiQuery.length, 200);
  });
});
