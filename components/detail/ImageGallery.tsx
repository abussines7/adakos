// components/detail/ImageGallery.tsx
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  namaKos: string;
}

const frame = 'relative overflow-hidden rounded-md border-2 border-ink bg-paper-deep';

export default function ImageGallery({ images, namaKos }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className={`${frame} flex aspect-video flex-col items-center justify-center gap-2 text-muted-ink md:aspect-[3/1]`}>
        <ImageOff size={36} aria-hidden="true" />
        <span className="text-sm font-medium">Foto kos belum tersedia</span>
      </div>
    );
  }

  const thumbnails = images.slice(1, 3);

  return (
    <div className={`grid gap-3 ${thumbnails.length > 0 ? 'md:grid-cols-3' : ''}`}>
      <div className={`${frame} aspect-video md:col-span-2`}>
        <Image
          src={images[0]}
          alt={`Foto utama ${namaKos}`}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover"
        />
      </div>
      {thumbnails.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          {thumbnails.map((img, idx) => (
            <div key={img} className={`${frame} aspect-video md:aspect-auto`}>
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
      )}
    </div>
  );
}
