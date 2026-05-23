// data/kos-data.ts
// Mock data 20 properti kos area Tamalanrea Indah — kawasan Universitas Hasanuddin Makassar
// Distribusi: 10 area, variasi tipe/harga/kondisi jalan/status banjir

import { KosProperty } from './types';

/** Helper: generate 3 foto placeholder konsisten per kos */
const generatePhotos = (id: string) => [
  `https://picsum.photos/seed/${id}-1/800/450`,
  `https://picsum.photos/seed/${id}-2/800/450`,
  `https://picsum.photos/seed/${id}-3/800/450`,
];

export const kosData: KosProperty[] = [
  // ============================================================
  // AREA: Perintis Kemerdekaan 3 (2 kos)
  // ============================================================
  {
    id: "berkah-perintis",
    nama: "Kos Berkah Perintis",
    area: "Perintis Kemerdekaan 3",
    tipe: "putri",
    harga_bulanan: 800000,
    foto: generatePhotos("berkah-perintis"),
    fasilitas_internal: ['WiFi', 'AC', 'Kamar Mandi Dalam', 'Kasur', 'Lemari'],
    kondisi_jalan: 'mulus',
    akses_kendaraan: ['motor', 'mobil'],
    status_banjir: 'aman',
    fasilitas_sekitar: [
      { nama: "Laundry Utama", jarak_meter: 20 },
      { nama: "Warung Makan Pak Andi", jarak_meter: 50 }
    ],
    rute_kampus: [
      { rute: "Gerbang Utama via Jl. Perintis", estimasi_waktu: "5 menit naik motor" }
    ],
    koordinat: { lat: -5.1334, lng: 119.4883 },
    kontak_pemilik: "6281234567890"
  },
  {
    id: "griya-perintis3",
    nama: "Kos Griya Perintis",
    area: "Perintis Kemerdekaan 3",
    tipe: "campur",
    harga_bulanan: 1000000,
    foto: generatePhotos("griya-perintis3"),
    fasilitas_internal: ['WiFi', 'AC', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Meja Belajar'],
    kondisi_jalan: 'mulus',
    akses_kendaraan: ['motor', 'mobil'],
    status_banjir: 'aman',
    fasilitas_sekitar: [
      { nama: "Alfamart", jarak_meter: 80 },
      { nama: "Fotokopi Murah", jarak_meter: 30 }
    ],
    rute_kampus: [
      { rute: "Gerbang Utama via Jl. Perintis", estimasi_waktu: "7 menit naik motor" }
    ],
    koordinat: { lat: -5.1338, lng: 119.4878 },
    kontak_pemilik: "6281234567901"
  },

  // ============================================================
  // AREA: Perintis Kemerdekaan 4 (1 kos)
  // ============================================================
  {
    id: "daeng-rimba-4",
    nama: "Kos Daeng Rimba",
    area: "Perintis Kemerdekaan 4",
    tipe: "putra",
    harga_bulanan: 650000,
    foto: generatePhotos("daeng-rimba-4"),
    fasilitas_internal: ['Kasur', 'Lemari', 'Kipas Angin', 'Kamar Mandi Dalam'],
    kondisi_jalan: 'cukup_baik',
    akses_kendaraan: ['motor'],
    status_banjir: 'kadang_tergenang',
    fasilitas_sekitar: [
      { nama: "Warung Makan Siang", jarak_meter: 40 },
      { nama: "Bengkel Motor", jarak_meter: 200 }
    ],
    rute_kampus: [
      { rute: "Gerbang 2 via Perintis", estimasi_waktu: "8 menit naik motor" }
    ],
    koordinat: { lat: -5.1340, lng: 119.4860 },
    kontak_pemilik: "6281234567902"
  },

  // ============================================================
  // AREA: Perintis Kemerdekaan 6 (1 kos)
  // ============================================================
  {
    id: "anugrah-perintis6",
    nama: "Kos Anugrah 06",
    area: "Perintis Kemerdekaan 6",
    tipe: "putri",
    harga_bulanan: 750000,
    foto: generatePhotos("anugrah-perintis6"),
    fasilitas_internal: ['WiFi', 'Kipas Angin', 'Kamar Mandi Dalam', 'Kasur', 'Lemari'],
    kondisi_jalan: 'mulus',
    akses_kendaraan: ['motor', 'mobil'],
    status_banjir: 'aman',
    fasilitas_sekitar: [
      { nama: "Kantin Deket Kampus", jarak_meter: 100 },
      { nama: "ATM BRI", jarak_meter: 150 }
    ],
    rute_kampus: [
      { rute: "Fakultas Hukum via Perintis", estimasi_waktu: "6 menit naik motor" }
    ],
    koordinat: { lat: -5.1345, lng: 119.4845 },
    kontak_pemilik: "6281234567903"
  },

  // ============================================================
  // AREA: Perintis Kemerdekaan 7 (2 kos)
  // ============================================================
  {
    id: "mutiara-77",
    nama: "Kos Mutiara 77",
    area: "Perintis Kemerdekaan 7",
    tipe: "putra",
    harga_bulanan: 550000,
    foto: generatePhotos("mutiara-77"),
    fasilitas_internal: ['Kasur', 'Lemari', 'Kipas Angin', 'Dapur Bersama'],
    kondisi_jalan: 'cukup_baik',
    akses_kendaraan: ['motor'],
    status_banjir: 'kadang_tergenang',
    fasilitas_sekitar: [
      { nama: "Warung Kopi", jarak_meter: 30 },
      { nama: "Tempat Print/Fotokopi", jarak_meter: 100 }
    ],
    rute_kampus: [
      { rute: "Fakultas Teknik via Pintu 0", estimasi_waktu: "10 menit jalan kaki" }
    ],
    koordinat: { lat: -5.1350, lng: 119.4820 },
    kontak_pemilik: "6281234567891"
  },
  {
    id: "wisma-perintis7",
    nama: "Wisma Perintis Jaya",
    area: "Perintis Kemerdekaan 7",
    tipe: "campur",
    harga_bulanan: 900000,
    foto: generatePhotos("wisma-perintis7"),
    fasilitas_internal: ['WiFi', 'AC', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Parkir Motor'],
    kondisi_jalan: 'mulus',
    akses_kendaraan: ['motor', 'mobil'],
    status_banjir: 'aman',
    fasilitas_sekitar: [
      { nama: "Indomaret", jarak_meter: 50 },
      { nama: "Laundry Kiloan", jarak_meter: 70 }
    ],
    rute_kampus: [
      { rute: "Gerbang Utama via Perintis", estimasi_waktu: "10 menit naik motor" }
    ],
    koordinat: { lat: -5.1355, lng: 119.4815 },
    kontak_pemilik: "6281234567904"
  },

  // ============================================================
  // AREA: Jalan Bung (2 kos)
  // ============================================================
  {
    id: "bung-residence",
    nama: "Kos Bung Residence",
    area: "Jalan Bung",
    tipe: "campur",
    harga_bulanan: 1200000,
    foto: generatePhotos("bung-residence"),
    fasilitas_internal: ['WiFi', 'AC', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Parkir Mobil'],
    kondisi_jalan: 'mulus',
    akses_kendaraan: ['motor', 'mobil'],
    status_banjir: 'aman',
    fasilitas_sekitar: [
      { nama: "Minimarket", jarak_meter: 150 },
      { nama: "Masjid", jarak_meter: 100 }
    ],
    rute_kampus: [
      { rute: "Pintu 1 Unhas", estimasi_waktu: "8 menit naik motor" }
    ],
    koordinat: { lat: -5.1380, lng: 119.4890 },
    kontak_pemilik: "6281234567892"
  },
  {
    id: "bung-putri-asri",
    nama: "Kos Putri Asri Bung",
    area: "Jalan Bung",
    tipe: "putri",
    harga_bulanan: 1500000,
    foto: generatePhotos("bung-putri-asri"),
    fasilitas_internal: ['WiFi', 'AC', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Water Heater', 'CCTV'],
    kondisi_jalan: 'mulus',
    akses_kendaraan: ['motor', 'mobil'],
    status_banjir: 'aman',
    fasilitas_sekitar: [
      { nama: "Kafe Kekinian", jarak_meter: 100 },
      { nama: "Apotek Kimia Farma", jarak_meter: 200 }
    ],
    rute_kampus: [
      { rute: "Pintu 1 Unhas", estimasi_waktu: "7 menit naik motor" }
    ],
    koordinat: { lat: -5.1375, lng: 119.4895 },
    kontak_pemilik: "6281234567905"
  },

  // ============================================================
  // AREA: Kera-Kera (2 kos — segmen ekonomis 400rb–600rb)
  // ============================================================
  {
    id: "kera-kera-putra",
    nama: "Kos Putra Kera-Kera",
    area: "Kera-Kera",
    tipe: "putra",
    harga_bulanan: 400000,
    foto: generatePhotos("kera-kera-putra"),
    fasilitas_internal: ['Kasur', 'Lemari', 'Kamar Mandi Luar'],
    kondisi_jalan: 'rusak',
    akses_kendaraan: ['motor'],
    status_banjir: 'rawan',
    fasilitas_sekitar: [
      { nama: "Warung Nasi Campur", jarak_meter: 30 },
      { nama: "Bengkel Motor", jarak_meter: 150 }
    ],
    rute_kampus: [
      { rute: "Pintu 2 Unhas via jalan kampung", estimasi_waktu: "12 menit naik motor" }
    ],
    koordinat: { lat: -5.1420, lng: 119.4910 },
    kontak_pemilik: "6281234567906"
  },
  {
    id: "kera-kera-sederhana",
    nama: "Kos Sederhana Kera-Kera",
    area: "Kera-Kera",
    tipe: "campur",
    harga_bulanan: 500000,
    foto: generatePhotos("kera-kera-sederhana"),
    fasilitas_internal: ['Kasur', 'Lemari', 'Kipas Angin', 'Dapur Bersama'],
    kondisi_jalan: 'rusak',
    akses_kendaraan: ['motor'],
    status_banjir: 'rawan',
    fasilitas_sekitar: [
      { nama: "Warung Kelontong", jarak_meter: 20 },
      { nama: "Lapangan Bola", jarak_meter: 300 }
    ],
    rute_kampus: [
      { rute: "Pintu 2 Unhas via lorong", estimasi_waktu: "15 menit naik motor" }
    ],
    koordinat: { lat: -5.1425, lng: 119.4905 },
    kontak_pemilik: "6281234567907"
  },

  // ============================================================
  // AREA: Pintu Nol (2 kos — akses strategis, harga 900rb–1.5jt)
  // ============================================================
  {
    id: "pintu-nol-exclusive",
    nama: "Kos Exclusive Pintu Nol",
    area: "Pintu Nol",
    tipe: "putri",
    harga_bulanan: 1500000,
    foto: generatePhotos("pintu-nol-exclusive"),
    fasilitas_internal: ['WiFi', 'AC', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Meja Belajar', 'CCTV'],
    kondisi_jalan: 'mulus',
    akses_kendaraan: ['motor', 'mobil'],
    status_banjir: 'aman',
    fasilitas_sekitar: [
      { nama: "Kantin Teknik", jarak_meter: 50 },
      { nama: "Perpustakaan Pusat Unhas", jarak_meter: 400 }
    ],
    rute_kampus: [
      { rute: "Fakultas Teknik via Pintu 0", estimasi_waktu: "3 menit jalan kaki" }
    ],
    koordinat: { lat: -5.1360, lng: 119.4830 },
    kontak_pemilik: "6281234567908"
  },
  {
    id: "pintu-nol-strategis",
    nama: "Kos Strategis Pintu Nol",
    area: "Pintu Nol",
    tipe: "putra",
    harga_bulanan: 950000,
    foto: generatePhotos("pintu-nol-strategis"),
    fasilitas_internal: ['WiFi', 'Kipas Angin', 'Kamar Mandi Dalam', 'Kasur', 'Lemari'],
    kondisi_jalan: 'cukup_baik',
    akses_kendaraan: ['motor'],
    status_banjir: 'kadang_tergenang',
    fasilitas_sekitar: [
      { nama: "Warung Teknik", jarak_meter: 30 },
      { nama: "Fotokopi & Print", jarak_meter: 60 }
    ],
    rute_kampus: [
      { rute: "Fakultas Teknik via Pintu 0", estimasi_waktu: "5 menit jalan kaki" }
    ],
    koordinat: { lat: -5.1365, lng: 119.4825 },
    kontak_pemilik: "6281234567909"
  },

  // ============================================================
  // AREA: Damai (2 kos)
  // ============================================================
  {
    id: "damai-residence",
    nama: "Kos Damai Residence",
    area: "Damai",
    tipe: "putri",
    harga_bulanan: 850000,
    foto: generatePhotos("damai-residence"),
    fasilitas_internal: ['WiFi', 'AC', 'Kamar Mandi Dalam', 'Kasur', 'Lemari'],
    kondisi_jalan: 'mulus',
    akses_kendaraan: ['motor', 'mobil'],
    status_banjir: 'aman',
    fasilitas_sekitar: [
      { nama: "Warung Makan Bu Ani", jarak_meter: 30 },
      { nama: "Laundry Express", jarak_meter: 80 }
    ],
    rute_kampus: [
      { rute: "Gerbang Utama via Jl. Damai", estimasi_waktu: "10 menit naik motor" }
    ],
    koordinat: { lat: -5.1395, lng: 119.4870 },
    kontak_pemilik: "6281234567910"
  },
  {
    id: "damai-putra-mandiri",
    nama: "Kos Putra Mandiri Damai",
    area: "Damai",
    tipe: "putra",
    harga_bulanan: 600000,
    foto: generatePhotos("damai-putra-mandiri"),
    fasilitas_internal: ['Kasur', 'Lemari', 'Kipas Angin', 'Kamar Mandi Luar'],
    kondisi_jalan: 'rusak',
    akses_kendaraan: ['motor'],
    status_banjir: 'rawan',
    fasilitas_sekitar: [
      { nama: "Warung Pecel", jarak_meter: 20 },
      { nama: "Masjid Nurul Iman", jarak_meter: 100 }
    ],
    rute_kampus: [
      { rute: "Gerbang Utama via Jl. Damai", estimasi_waktu: "12 menit naik motor" }
    ],
    koordinat: { lat: -5.1400, lng: 119.4865 },
    kontak_pemilik: "6281234567911"
  },

  // ============================================================
  // AREA: Sahabat (3 kos)
  // ============================================================
  {
    id: "sahabat-putri-indah",
    nama: "Kos Putri Indah Sahabat",
    area: "Sahabat",
    tipe: "putri",
    harga_bulanan: 700000,
    foto: generatePhotos("sahabat-putri-indah"),
    fasilitas_internal: ['WiFi', 'Kipas Angin', 'Kamar Mandi Dalam', 'Kasur', 'Lemari'],
    kondisi_jalan: 'cukup_baik',
    akses_kendaraan: ['motor'],
    status_banjir: 'aman',
    fasilitas_sekitar: [
      { nama: "Warung Mie Titi", jarak_meter: 50 },
      { nama: "Toko ATK", jarak_meter: 120 }
    ],
    rute_kampus: [
      { rute: "Gerbang Utama via Jl. Sahabat", estimasi_waktu: "8 menit naik motor" }
    ],
    koordinat: { lat: -5.1385, lng: 119.4855 },
    kontak_pemilik: "6281234567912"
  },
  {
    id: "sahabat-campur-harmoni",
    nama: "Kos Harmoni Sahabat",
    area: "Sahabat",
    tipe: "campur",
    harga_bulanan: 1100000,
    foto: generatePhotos("sahabat-campur-harmoni"),
    fasilitas_internal: ['WiFi', 'AC', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Meja Belajar'],
    kondisi_jalan: 'mulus',
    akses_kendaraan: ['motor', 'mobil'],
    status_banjir: 'aman',
    fasilitas_sekitar: [
      { nama: "Alfamidi", jarak_meter: 60 },
      { nama: "Rumah Makan Padang", jarak_meter: 90 }
    ],
    rute_kampus: [
      { rute: "Gerbang Utama via Jl. Sahabat", estimasi_waktu: "7 menit naik motor" }
    ],
    koordinat: { lat: -5.1390, lng: 119.4850 },
    kontak_pemilik: "6281234567913"
  },
  {
    id: "sahabat-putra-hemat",
    nama: "Kos Putra Sahabat Hemat",
    area: "Sahabat",
    tipe: "putra",
    harga_bulanan: 750000,
    foto: generatePhotos("sahabat-putra-hemat"),
    fasilitas_internal: ['WiFi', 'Kipas Angin', 'Kamar Mandi Dalam', 'Kasur', 'Lemari'],
    kondisi_jalan: 'mulus',
    akses_kendaraan: ['motor'],
    status_banjir: 'aman',
    fasilitas_sekitar: [
      { nama: "Warung Kopi Sahabat", jarak_meter: 40 },
      { nama: "Toko Kelontong", jarak_meter: 70 }
    ],
    rute_kampus: [
      { rute: "Gerbang Utama via Jl. Sahabat", estimasi_waktu: "9 menit naik motor" }
    ],
    koordinat: { lat: -5.1392, lng: 119.4848 },
    kontak_pemilik: "6281234567916"
  },

  // ============================================================
  // AREA: Workshop (2 kos — relevan mahasiswa teknik)
  // ============================================================
  {
    id: "workshop-teknik-putra",
    nama: "Kos Teknik Putra Workshop",
    area: "Workshop",
    tipe: "putra",
    harga_bulanan: 700000,
    foto: generatePhotos("workshop-teknik-putra"),
    fasilitas_internal: ['WiFi', 'Kipas Angin', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Meja Belajar'],
    kondisi_jalan: 'rusak',
    akses_kendaraan: ['motor'],
    status_banjir: 'rawan',
    fasilitas_sekitar: [
      { nama: "Kantin Workshop", jarak_meter: 40 },
      { nama: "Laboratorium Teknik", jarak_meter: 200 }
    ],
    rute_kampus: [
      { rute: "Fakultas Teknik via jalan Workshop", estimasi_waktu: "5 menit jalan kaki" }
    ],
    koordinat: { lat: -5.1370, lng: 119.4840 },
    kontak_pemilik: "6281234567914"
  },
  {
    id: "workshop-campur-nyaman",
    nama: "Kos Nyaman Workshop",
    area: "Workshop",
    tipe: "campur",
    harga_bulanan: 850000,
    foto: generatePhotos("workshop-campur-nyaman"),
    fasilitas_internal: ['WiFi', 'AC', 'Kamar Mandi Dalam', 'Kasur', 'Lemari'],
    kondisi_jalan: 'rusak',
    akses_kendaraan: ['motor'],
    status_banjir: 'kadang_tergenang',
    fasilitas_sekitar: [
      { nama: "Warung Makan Sore", jarak_meter: 50 },
      { nama: "Masjid Al-Ikhlas", jarak_meter: 150 }
    ],
    rute_kampus: [
      { rute: "Fakultas Teknik via jalan Workshop", estimasi_waktu: "7 menit jalan kaki" }
    ],
    koordinat: { lat: -5.1375, lng: 119.4835 },
    kontak_pemilik: "6281234567915"
  },

  // ============================================================
  // AREA: Perintis Kemerdekaan 8 (1 kos)
  // ============================================================
  {
    id: "wisma-perintis8",
    nama: "Wisma Perintis 8 Exclusive",
    area: "Perintis Kemerdekaan 8",
    tipe: "campur",
    harga_bulanan: 1200000,
    foto: generatePhotos("wisma-perintis8"),
    fasilitas_internal: ['WiFi', 'AC', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Dapur Bersama'],
    kondisi_jalan: 'mulus',
    akses_kendaraan: ['motor', 'mobil'],
    status_banjir: 'aman',
    fasilitas_sekitar: [
      { nama: "Rumah Makan Padang", jarak_meter: 30 },
      { nama: "Indomaret", jarak_meter: 100 }
    ],
    rute_kampus: [
      { rute: "Gerbang Utama via Jl. Perintis", estimasi_waktu: "6 menit naik motor" }
    ],
    koordinat: { lat: -5.1328, lng: 119.4892 },
    kontak_pemilik: "6281234567917"
  }
];