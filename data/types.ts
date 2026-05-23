// src/data/types.ts

export interface KosProperty {
  id: string;
  nama: string;
  tipe: 'putra' | 'putri' | 'campur';
  area: string;
  harga_bulanan: number;
  foto: string[];
  fasilitas_internal: string[];
  kondisi_jalan: 'mulus' | 'cukup_baik' | 'rusak';
  akses_kendaraan: ('motor' | 'mobil')[];
  status_banjir: 'aman' | 'rawan' | 'kadang_tergenang';
  fasilitas_sekitar: { nama: string; jarak_meter: number }[];
  rute_kampus: { rute: string; estimasi_waktu: string }[];
  koordinat: { lat: number; lng: number };
  kontak_pemilik: string;
}