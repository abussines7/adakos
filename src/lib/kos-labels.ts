// Label dan tingkat waspada untuk atribut kos. Dipakai bersama oleh kartu,
// halaman detail, penjelasan "cara menilai", dan ringkasan pencarian AI.
// Tingkat 1-3 selalu berarti "makin tinggi, makin perlu waspada".

export type RiskLevel = 1 | 2 | 3;
export type StatusBanjir = 'aman' | 'kadang_tergenang' | 'rawan';
export type KondisiJalan = 'mulus' | 'cukup_baik' | 'rusak';
export type TipeKos = 'putra' | 'putri' | 'campur';

export type LevelInfo = { level: RiskLevel; label: string; description: string };

export const BANJIR_INFO: Record<StatusBanjir, LevelInfo> = {
  aman: {
    level: 1,
    label: 'Bebas banjir',
    description: 'Tidak ada catatan genangan di akses menuju kos.',
  },
  kadang_tergenang: {
    level: 2,
    label: 'Kadang tergenang',
    description: 'Akses jalan bisa tergenang saat hujan deras, biasanya surut dalam beberapa jam.',
  },
  rawan: {
    level: 3,
    label: 'Rawan banjir',
    description: 'Area ini tercatat sering tergenang di musim hujan. Siapkan tempat aman untuk kendaraan dan barang.',
  },
};

export const JALAN_INFO: Record<KondisiJalan, LevelInfo> = {
  mulus: {
    level: 1,
    label: 'Jalan mulus',
    description: 'Aspal atau paving rata, nyaman dilalui motor maupun mobil.',
  },
  cukup_baik: {
    level: 2,
    label: 'Jalan cukup baik',
    description: 'Ada tambalan atau lubang kecil di beberapa titik, masih aman untuk harian.',
  },
  rusak: {
    level: 3,
    label: 'Jalan rusak',
    description: 'Berlubang atau berbatu. Berkendara pelan, terutama saat hujan.',
  },
};

export const TIPE_LABEL: Record<TipeKos, string> = {
  putra: 'Putra',
  putri: 'Putri',
  campur: 'Campur',
};

/** "5 menit naik motor" -> moda perjalanan, untuk memilih ikon rute. */
export function travelMode(estimasi: string): 'motor' | 'jalan' | 'lainnya' {
  const text = estimasi.toLowerCase();
  if (text.includes('motor')) return 'motor';
  if (text.includes('jalan kaki')) return 'jalan';
  return 'lainnya';
}
