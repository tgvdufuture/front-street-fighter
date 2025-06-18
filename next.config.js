/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Désactiver l'ajout des attributs data-np-*
  experimental: {
    optimizeCss: true,
    removeConsole: true,
  },
  // Configuration CORS pour l'API Symfony
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://127.0.0.1:8000/api/:path*',
      },
    ];
  },
  // Configuration de sécurité pour les API
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://127.0.0.1:8000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
