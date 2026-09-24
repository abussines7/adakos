// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SampleDataBanner from "@/components/layout/SampleDataBanner";
import { cn } from "@/src/lib/utils";
import { SITE_NAME, SITE_URL } from "@/src/lib/site-config";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

const SITE_DESCRIPTION = "E-Katalog indekos transparan di sekitar Universitas Hasanuddin Makassar.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Adakos | Cari Kos Area Unhas",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("scroll-smooth", "font-sans", inter.variable)}>
      <body className={`${plusJakarta.className} min-h-screen flex flex-col text-slate-900 bg-slate-50 antialiased`}>
        <Navbar />
        <SampleDataBanner />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
        {/* Vercel Analytics — auto-track pageviews + custom events (whatsapp_click) */}
        <Analytics />
      </body>
    </html>
  );
}