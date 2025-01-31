import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['www.themoviedb.org'],
    remotePatterns: [{ hostname: 'lh3.googleusercontent.com' }],
  },
};

export default nextConfig;
