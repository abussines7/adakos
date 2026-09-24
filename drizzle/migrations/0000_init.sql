CREATE TYPE "public"."kondisi_jalan" AS ENUM('mulus', 'cukup_baik', 'rusak');--> statement-breakpoint
CREATE TYPE "public"."status_banjir" AS ENUM('aman', 'rawan', 'kadang_tergenang');--> statement-breakpoint
CREATE TYPE "public"."tipe_kos" AS ENUM('putra', 'putri', 'campur');--> statement-breakpoint
CREATE TABLE "area" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "area_nama_unique" UNIQUE("nama"),
	CONSTRAINT "area_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "fasilitas_internal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(100) NOT NULL,
	CONSTRAINT "fasilitas_internal_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "fasilitas_sekitar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kos_id" uuid NOT NULL,
	"nama" varchar(200) NOT NULL,
	"jarak_meter" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"nama" varchar(200) NOT NULL,
	"tipe" "tipe_kos" NOT NULL,
	"area_id" uuid NOT NULL,
	"harga_bulanan" integer NOT NULL,
	"kondisi_jalan" "kondisi_jalan" NOT NULL,
	"akses_kendaraan" text[] NOT NULL,
	"status_banjir" "status_banjir" NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"pemilik_id" uuid NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "kos_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "kos_fasilitas_internal" (
	"kos_id" uuid NOT NULL,
	"fasilitas_id" uuid NOT NULL,
	CONSTRAINT "kos_fasilitas_internal_kos_id_fasilitas_id_pk" PRIMARY KEY("kos_id","fasilitas_id")
);
--> statement-breakpoint
CREATE TABLE "kos_foto" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kos_id" uuid NOT NULL,
	"url" text NOT NULL,
	"urutan" integer DEFAULT 0 NOT NULL,
	"alt_text" varchar(200),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pemilik" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(100) NOT NULL,
	"telepon" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pemilik_telepon_unique" UNIQUE("telepon")
);
--> statement-breakpoint
CREATE TABLE "rute_kampus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kos_id" uuid NOT NULL,
	"rute" varchar(300) NOT NULL,
	"estimasi_waktu" varchar(100) NOT NULL,
	"urutan" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fasilitas_sekitar" ADD CONSTRAINT "fasilitas_sekitar_kos_id_kos_id_fk" FOREIGN KEY ("kos_id") REFERENCES "public"."kos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kos" ADD CONSTRAINT "kos_area_id_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."area"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kos" ADD CONSTRAINT "kos_pemilik_id_pemilik_id_fk" FOREIGN KEY ("pemilik_id") REFERENCES "public"."pemilik"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kos_fasilitas_internal" ADD CONSTRAINT "kos_fasilitas_internal_kos_id_kos_id_fk" FOREIGN KEY ("kos_id") REFERENCES "public"."kos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kos_fasilitas_internal" ADD CONSTRAINT "kos_fasilitas_internal_fasilitas_id_fasilitas_internal_id_fk" FOREIGN KEY ("fasilitas_id") REFERENCES "public"."fasilitas_internal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kos_foto" ADD CONSTRAINT "kos_foto_kos_id_kos_id_fk" FOREIGN KEY ("kos_id") REFERENCES "public"."kos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rute_kampus" ADD CONSTRAINT "rute_kampus_kos_id_kos_id_fk" FOREIGN KEY ("kos_id") REFERENCES "public"."kos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_fas_sekitar_kos" ON "fasilitas_sekitar" USING btree ("kos_id");--> statement-breakpoint
CREATE INDEX "idx_kos_area" ON "kos" USING btree ("area_id");--> statement-breakpoint
CREATE INDEX "idx_kos_tipe" ON "kos" USING btree ("tipe");--> statement-breakpoint
CREATE INDEX "idx_kos_harga" ON "kos" USING btree ("harga_bulanan");--> statement-breakpoint
CREATE INDEX "idx_kos_banjir" ON "kos" USING btree ("status_banjir");--> statement-breakpoint
CREATE INDEX "idx_kos_area_tipe" ON "kos" USING btree ("area_id","tipe");--> statement-breakpoint
CREATE INDEX "idx_foto_kos" ON "kos_foto" USING btree ("kos_id");--> statement-breakpoint
CREATE INDEX "idx_foto_urutan" ON "kos_foto" USING btree ("kos_id","urutan");--> statement-breakpoint
CREATE INDEX "idx_rute_kos" ON "rute_kampus" USING btree ("kos_id");