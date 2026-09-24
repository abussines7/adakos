const angka = new Intl.NumberFormat('id-ID');

/** 800000 -> "Rp800.000" */
export function formatRupiah(value: number): string {
  return `Rp${angka.format(value)}`;
}

/** 850 -> "850 m", 1200 -> "1,2 km" */
export function formatJarak(meter: number): string {
  if (meter < 1000) {
    return `${angka.format(meter)} m`;
  }
  return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(meter / 1000)} km`;
}
