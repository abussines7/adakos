// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Adakos - E-Katalog Kos Area Unhas.
      </div>
    </footer>
  );
}