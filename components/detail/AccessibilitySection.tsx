// components/detail/AccessibilitySection.tsx
'use client';

import { KosProperty } from '@/data/types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Construction, 
  Map, 
  Clock, 
  Navigation,
  Car,
  Bike
} from 'lucide-react';

export default function AccessibilitySection({ kos }: { kos: KosProperty }) {
  
  // ============================================================
  // PENGATURAN STATUS BANJIR (DECISION HELPER)
  // ============================================================
  const getBanjirConfig = (status: string) => {
    switch (status) {
      case 'aman':
        return {
          bg: 'bg-white border-emerald-200 shadow-md text-slate-900',
          iconBg: 'bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/50',
          icon: <ShieldCheck className="w-8 h-8" />,
          titleColor: 'text-slate-900',
          badgeText: '✓ BEBAS BANJIR 100%',
          badgeBg: 'bg-emerald-600 text-white font-bold tracking-wide text-xs px-3 py-1 rounded-full shadow-sm shadow-emerald-200',
          description: 'Lokasi ini tidak memiliki riwayat genangan banjir berdasarkan informasi pemilik kos. Aman untuk kendaraan motor dan mobil sepanjang tahun.',
          socialProof: 'Cocok untuk kendaraan motor dan mobil sepanjang tahun.'
        };
      case 'kadang_tergenang':
        return {
          bg: 'bg-white border-amber-200 shadow-md text-slate-900',
          iconBg: 'bg-amber-50 text-amber-600 ring-4 ring-amber-50/50',
          icon: <AlertTriangle className="w-8 h-8" />,
          titleColor: 'text-slate-900',
          badgeText: '⚠️ KADANG TERGENANG',
          badgeBg: 'bg-amber-500 text-white font-bold tracking-wide text-xs px-3 py-1 rounded-full shadow-sm shadow-amber-200',
          description: 'Jalan akses kadang tergenang saat hujan lebat. Kondisi biasanya kembali normal setelah hujan reda.',
          socialProof: 'Disarankan waspada saat membawa kendaraan di musim hujan.'
        };
      case 'rawan':
      default:
        return {
          bg: 'bg-white border-rose-200 shadow-md text-slate-900',
          iconBg: 'bg-rose-50 text-rose-600 ring-4 ring-rose-50/50',
          icon: <AlertTriangle className="w-8 h-8" />,
          titleColor: 'text-slate-900',
          badgeText: '🚨 RAWAN BANJIR',
          badgeBg: 'bg-rose-600 text-white font-bold tracking-wide text-xs px-3 py-1 rounded-full shadow-sm shadow-rose-200',
          description: 'Lokasi ini rawan genangan banjir saat curah hujan tinggi. Disarankan menyimpan barang berharga dan kendaraan di tempat yang lebih tinggi selama musim penghujan tiba.',
          socialProof: '🚨 Pengguna kendaraan wajib memarkir di area aman tinggi'
        };
    }
  };

  // ============================================================
  // PENGATURAN KONDISI JALAN (DECISION HELPER)
  // ============================================================
  const getJalanConfig = (kondisi: string) => {
    switch (kondisi) {
      case 'mulus':
        return {
          bg: 'bg-white border-emerald-200 shadow-md text-slate-900',
          iconBg: 'bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/50',
          icon: <ShieldCheck className="w-8 h-8" />,
          titleColor: 'text-slate-900',
          badgeText: 'Jalan Mulus',
          badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold',
          description: 'Akses jalan dilapisi aspal rata atau paving block yang lebar. Sangat nyaman, halus, dan stabil dilalui baik oleh mobil maupun motor.',
          kendaraanLabel: 'Akses Mobil & Motor Sangat Lancar'
        };
      case 'cukup_baik':
        return {
          bg: 'bg-white border-amber-200 shadow-md text-slate-900',
          iconBg: 'bg-amber-50 text-amber-600 ring-4 ring-amber-50/50',
          icon: <AlertTriangle className="w-8 h-8" />,
          titleColor: 'text-slate-900',
          badgeText: 'Jalan Cukup Baik',
          badgeBg: 'bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-bold',
          description: 'Kondisi jalan cor semen atau paving memadai. Terdapat beberapa kerusakan atau tambalan minor di beberapa titik namun masih aman dilalui berkendara sehari-hari.',
          kendaraanLabel: 'Akses Motor Utama, Mobil Harus Hati-Hati'
        };
      case 'rusak':
      default:
        return {
          bg: 'bg-white border-rose-200 shadow-md text-slate-900',
          iconBg: 'bg-rose-50 text-rose-600 ring-4 ring-rose-50/50',
          icon: <Construction className="w-8 h-8" />,
          titleColor: 'text-slate-900',
          badgeText: 'Jalan Rusak',
          badgeBg: 'bg-rose-100 text-rose-800 border border-rose-200 px-3 py-1 rounded-full font-bold',
          description: 'Akses jalan berbatu, berlubang signifikan, atau tanah becek becek saat musim hujan. Harap mengendarai kendaraan dengan sangat pelan demi keselamatan.',
          kendaraanLabel: 'Hanya Direkomendasikan untuk Motor'
        };
    }
  };

  const banjir = getBanjirConfig(kos.status_banjir);
  const jalan = getJalanConfig(kos.kondisi_jalan);

  return (
    <section className="mb-10 mt-6">
      {/* HEADER UTAMA SEKSI */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Map className="text-blue-600 w-6 h-6" />
        <span>Aksesibilitas & Lingkungan Sekitar</span>
      </h2>

      {/* GRID RESPONSIVE MOBILE-FIRST (md:grid-cols-2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ============================================================
            1. CARD STATUS BANJIR (PREMIUM SEMANTIC CARD)
            ============================================================
            KEPUTUSAN DESAIN (STATUS BANJIR):
            Mengapa menggunakan background solid dengan soft glow semantik dan ikon ShieldCheck besar?
            1. Mengurangi beban kognitif pengguna (cognitive load) dengan langsung mengomunikasikan tingkat keamanan banjir melalui warna universal (hijau/kuning/merah).
            2. Memberikan jaminan psikologis (psychological safety) yang kuat bagi calon penyewa luar daerah melalui "Social Proof & Trust Badge" berskala besar (bukan sekadar label kecil).
            3. Menggunakan solid background bg-white untuk menjamin rasio kontras maksimal di perangkat mobile.
        */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${banjir.bg}`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className={`p-3 rounded-2xl shrink-0 ${banjir.iconBg}`}>
              {banjir.icon}
            </div>
            <span className={`inline-flex items-center text-xs uppercase tracking-wider ${banjir.badgeBg}`}>
              {banjir.badgeText}
            </span>
          </div>
          
          <h3 className={`text-xl font-bold mb-2 ${banjir.titleColor}`}>Keamanan & Risiko Banjir</h3>
          <p className="text-sm leading-relaxed text-slate-700 mb-4">{banjir.description}</p>
          
          {/* Badge Social Proof khusus sebagai trust signal */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>{banjir.socialProof}</span>
          </div>
        </div>

        {/* ============================================================
            2. CARD KONDISI JALAN (PREMIUM SEMANTIC CARD)
            ============================================================
            KEPUTUSAN DESAIN (KONDISI JALAN):
            Mengapa memisahkan kondisi jalan dan akses kendaraan ke dalam visualisasi kartu semantik?
            1. Kondisi jalan adalah faktor penentu kedua setelah banjir untuk mahasiswa yang membawa kendaraan.
            2. Ikon 'Construction' secara visual langsung memicu kehati-hatian pengguna terhadap jalan rusak tanpa perlu membaca deskripsi teks panjang.
            3. Menggunakan solid background bg-white untuk kontras maksimal di segala kondisi pencahayaan.
        */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${jalan.bg}`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className={`p-3 rounded-2xl shrink-0 ${jalan.iconBg}`}>
              {jalan.icon}
            </div>
            <span className={`inline-flex items-center text-xs uppercase tracking-wider ${jalan.badgeBg}`}>
              {jalan.badgeText}
            </span>
          </div>
          
          <h3 className={`text-xl font-bold mb-2 ${jalan.titleColor}`}>Kondisi Akses Jalan</h3>
          <p className="text-sm leading-relaxed text-slate-700 mb-4">{jalan.description}</p>
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>🚀 {jalan.kendaraanLabel}</span>
          </div>
        </div>

        {/* ============================================================
            3. CARD RUTE KAMPUS & AKSES KENDARAAN (TIMELINE MAP PANEL)
            ============================================================
            KEPUTUSAN DESAIN (RUTE KAMPUS):
            Mengapa memvisualisasikan rute kampus seperti panel navigasi maps?
            1. Mahasiswa membutuhkan navigasi instan dan kepastian jarak temporal (estimasi waktu) daripada jarak spasial (meter).
            2. List berdesain garis rute (timeline-like) memberikan pemahaman spasial yang lebih natural seperti melihat petunjuk jalan.
        */}
        <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-100/50 md:col-span-2 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 ring-4 ring-blue-50">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Rute & Estimasi Waktu ke Kampus Unhas</h3>
              <p className="text-sm text-slate-500">Panduan praktis waktu tempuh dari lokasi kos menuju area penting Unhas.</p>
            </div>
          </div>
          
          {/* GRID RUTE TIMELINE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kos.rute_kampus.map((rute, idx) => (
              <div 
                key={idx} 
                className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  {idx < kos.rute_kampus.length - 1 && (
                    <div className="w-0.5 grow bg-blue-100 my-1 border-dashed"></div>
                  )}
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-slate-800 text-sm">{rute.rute}</h4>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                      {rute.estimasi_waktu}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DOCK BAR AKSES KENDARAAN */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-slate-600">
              Aksesibilitas parkir properti ini mendukung kendaraan berikut:
            </div>
            <div className="flex flex-wrap gap-2">
              {kos.akses_kendaraan.map((kendaraan) => (
                <span 
                  key={kendaraan} 
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 capitalize shadow-sm"
                >
                  {kendaraan === 'mobil' ? <Car size={14} className="text-slate-500" /> : <Bike size={14} className="text-slate-500" />}
                  {kendaraan}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}