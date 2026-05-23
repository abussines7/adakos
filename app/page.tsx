// app/page.tsx
import HeroSection from '@/components/home/HeroSection';
import FeaturedKos from '@/components/home/FeaturedKos';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedKos />
    </div>
  );
}