/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'vidsrc.xyz',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['image.tmdb.org', 'themoviedb.org'],
  },
  async headers() {
    return [
      {
        source: '/api/stream/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },
  experimental: {
    optimizeCss: true,
    // Enhanced CSS optimization
    cssMinifier: 'lightningcss',
  }
}

module.exports = nextConfig