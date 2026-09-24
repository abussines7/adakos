import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  integer,
  text,
  doublePrecision,
  boolean,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// ENUMS
// ==========================================
export const tipeKosEnum = pgEnum('tipe_kos', ['putra', 'putri', 'campur']);
export const kondisiJalanEnum = pgEnum('kondisi_jalan', ['mulus', 'cukup_baik', 'rusak']);
export const statusBanjirEnum = pgEnum('status_banjir', ['aman', 'rawan', 'kadang_tergenang']);

// ==========================================
// TABLES
// ==========================================

export const area = pgTable('area', {
  id: uuid('id').defaultRandom().primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const pemilik = pgTable('pemilik', {
  id: uuid('id').defaultRandom().primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull(),
  telepon: varchar('telepon', { length: 20 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const kos = pgTable('kos', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  nama: varchar('nama', { length: 200 }).notNull(),
  tipe: tipeKosEnum('tipe').notNull(),
  area_id: uuid('area_id').references(() => area.id).notNull(),
  harga_bulanan: integer('harga_bulanan').notNull(),
  kondisi_jalan: kondisiJalanEnum('kondisi_jalan').notNull(),
  akses_kendaraan: text('akses_kendaraan').array().notNull(),
  status_banjir: statusBanjirEnum('status_banjir').notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  pemilik_id: uuid('pemilik_id').references(() => pemilik.id).notNull(),
  is_published: boolean('is_published').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_kos_area').on(table.area_id),
  index('idx_kos_tipe').on(table.tipe),
  index('idx_kos_harga').on(table.harga_bulanan),
  index('idx_kos_banjir').on(table.status_banjir),
  index('idx_kos_area_tipe').on(table.area_id, table.tipe),
]);

export const kosFoto = pgTable('kos_foto', {
  id: uuid('id').defaultRandom().primaryKey(),
  kos_id: uuid('kos_id').references(() => kos.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(),
  urutan: integer('urutan').default(0).notNull(),
  alt_text: varchar('alt_text', { length: 200 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_foto_kos').on(table.kos_id),
  index('idx_foto_urutan').on(table.kos_id, table.urutan),
]);

export const fasilitasInternal = pgTable('fasilitas_internal', {
  id: uuid('id').defaultRandom().primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull().unique(),
});

export const kosFasilitasInternal = pgTable('kos_fasilitas_internal', {
  kos_id: uuid('kos_id').references(() => kos.id, { onDelete: 'cascade' }).notNull(),
  fasilitas_id: uuid('fasilitas_id').references(() => fasilitasInternal.id, { onDelete: 'cascade' }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.kos_id, table.fasilitas_id] }),
]);

export const fasilitasSekitar = pgTable('fasilitas_sekitar', {
  id: uuid('id').defaultRandom().primaryKey(),
  kos_id: uuid('kos_id').references(() => kos.id, { onDelete: 'cascade' }).notNull(),
  nama: varchar('nama', { length: 200 }).notNull(),
  jarak_meter: integer('jarak_meter').notNull(),
}, (table) => [
  index('idx_fas_sekitar_kos').on(table.kos_id),
]);

export const ruteKampus = pgTable('rute_kampus', {
  id: uuid('id').defaultRandom().primaryKey(),
  kos_id: uuid('kos_id').references(() => kos.id, { onDelete: 'cascade' }).notNull(),
  rute: varchar('rute', { length: 300 }).notNull(),
  estimasi_waktu: varchar('estimasi_waktu', { length: 100 }).notNull(),
  urutan: integer('urutan').default(0).notNull(),
}, (table) => [
  index('idx_rute_kos').on(table.kos_id),
]);

// ==========================================
// RELATIONS
// ==========================================

export const areaRelations = relations(area, ({ many }) => ({
  kosList: many(kos),
}));

export const pemilikRelations = relations(pemilik, ({ many }) => ({
  kosList: many(kos),
}));

export const fasilitasInternalRelations = relations(fasilitasInternal, ({ many }) => ({
  kosLinks: many(kosFasilitasInternal),
}));

export const kosRelations = relations(kos, ({ one, many }) => ({
  area: one(area, { fields: [kos.area_id], references: [area.id] }),
  pemilik: one(pemilik, { fields: [kos.pemilik_id], references: [pemilik.id] }),
  foto: many(kosFoto),
  fasilitasInternal: many(kosFasilitasInternal),
  fasilitasSekitar: many(fasilitasSekitar),
  ruteKampus: many(ruteKampus),
}));

export const kosFasilitasInternalRelations = relations(kosFasilitasInternal, ({ one }) => ({
  kos: one(kos, { fields: [kosFasilitasInternal.kos_id], references: [kos.id] }),
  fasilitas: one(fasilitasInternal, { fields: [kosFasilitasInternal.fasilitas_id], references: [fasilitasInternal.id] }),
}));
// Tambahan relasi balikan (Child to Parent) yang hilang

export const kosFotoRelations = relations(kosFoto, ({ one }) => ({
  kos: one(kos, {
    fields: [kosFoto.kos_id],
    references: [kos.id]
  }),
}));

export const fasilitasSekitarRelations = relations(fasilitasSekitar, ({ one }) => ({
  kos: one(kos, {
    fields: [fasilitasSekitar.kos_id],
    references: [kos.id]
  }),
}));

export const ruteKampusRelations = relations(ruteKampus, ({ one }) => ({
  kos: one(kos, {
    fields: [ruteKampus.kos_id],
    references: [kos.id]
  }),
}));