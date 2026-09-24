// src/components/detail/ImageGallery.tsx
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  namaKos: string;
}

export default function ImageGallery({ images, namaKos }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="aspect-video md:aspect-[3/1] mb-8 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400">
        <ImageOff size={36} />
        <span className="text-sm font-medium">Foto kos belum tersedia</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="md:col-span-2 aspect-video overflow-hidden rounded-2xl bg-slate-100 relative">
        <Image
          src={images[0]}
          alt={`Foto utama ${namaKos}`}
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover"
          loading="eager"
        />
      </div>
      <div className="flex flex-row md:flex-col gap-4">
        {images.slice(1, 3).map((img, idx) => (
          <div
            key={img}
            className="aspect-video md:aspect-auto md:h-full overflow-hidden rounded-2xl bg-slate-100 w-full relative"
          >
            <Image
              src={img}
              alt={`Foto ${idx + 2} ${namaKos}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
