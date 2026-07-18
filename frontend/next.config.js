/** @type {import('next').NextConfig} */
const isTauri = process.env.IS_TAURI === 'true';

const nextConfig = {
  output: isTauri ? 'export' : undefined,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: '**.kinopoisk.ru',
      },
    ],
  },
  ...(isTauri ? {} : {
    async rewrites() {
      return [
        {
          source: '/tmdb-images/:path*',
          destination: 'https://image.tmdb.org/t/p/:path*',
        },
      ];
    },
  }),
};

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
