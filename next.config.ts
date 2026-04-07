const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  // IMPORTANTE para Capacitor
  images: {
    unoptimized: true,
  },

  // Opcional pero recomendado
  trailingSlash: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // Configuración para Turbopack (Next.js 16)
  turbopack: {},
};

module.exports = nextConfig;