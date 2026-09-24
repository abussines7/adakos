// app/layout.tsx
import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SampleDataBanner from "@/components/layout/SampleDataBanner";
import { cn } from "@/src/lib/utils";
import { SITE_NAME, SITE_URL } from "@/src/lib/site-config";

// Plus Jakarta Sans (dirancang untuk identitas kota Jakarta) untuk teks,
// Archivo lebar untuk judul ala rambu, JetBrains Mono untuk harga dan data.
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

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
    <html
      lang="id"
      className={cn("scroll-smooth scroll-pt-24", jakarta.variable, archivo.variable, jetbrains.variable)}
    >
      <body className="min-h-screen flex flex-col bg-paper text-ink antialiased font-sans">
        <Navbar />
        <SampleDataBanner />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
        {/* Vercel Analytics — auto-track pageviews + custom events (whatsapp_click) */}
        <Analytics />
      </body>
    </html>
  );
}
