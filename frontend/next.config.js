/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
  async rewrites() {
    return [
      {
        source: '/tmdb-images/:path*',
        destination: 'https://image.tmdb.org/t/p/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
