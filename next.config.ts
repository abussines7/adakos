import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://picsum.photos/**'),
      new URL('https://fastly.picsum.photos/**'),
      new URL('https://*.supabase.co/**'),
      new URL('https://res.cloudinary.com/**'),
    ],
  },
};

export default nextConfig;
