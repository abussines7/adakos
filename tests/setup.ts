// Dimuat sebelum semua test (lihat script "test" di package.json).
// src/db/index.ts melempar error bila DATABASE_URL kosong saat di-import.
// Unit test tidak pernah menjalankan query; postgres-js baru membuka
// koneksi saat query pertama, jadi URL dummy ini aman.
process.env.DATABASE_URL ??= 'postgres://test:test@127.0.0.1:1/test';
