import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets-2-prod.whop.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.whop.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
