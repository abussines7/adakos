// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adakos | Cari Kos Area Unhas",
  description: "E-Katalog indekos transparan di sekitar Universitas Hasanuddin Makassar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${plusJakarta.className} min-h-screen flex flex-col text-slate-900 bg-slate-50 antialiased`}>
        <Navbar />
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