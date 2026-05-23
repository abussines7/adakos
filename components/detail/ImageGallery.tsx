// src/components/detail/ImageGallery.tsx
import Image from 'next/image';

export default function ImageGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="md:col-span-2 aspect-video overflow-hidden rounded-2xl bg-slate-100 relative">
        <Image
          src={images[0]}
          alt="Foto Utama"
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover"
          loading="eager"
        />
      </div>
      <div className="flex flex-row md:flex-col gap-4">
        {images.slice(1, 3).map((img, idx) => (
          <div
            key={idx}
            className="aspect-video md:aspect-auto md:h-full overflow-hidden rounded-2xl bg-slate-100 w-full relative"
          >
            <Image
              src={img}
              alt={`Foto Tambahan ${idx + 1}`}
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