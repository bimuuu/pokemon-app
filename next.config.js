/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.pokemon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pokeapi.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.serebii.net',
        pathname: '/**',
      },
    ],
    unoptimized: false,
    domains: [
      'raw.githubusercontent.com',
      'assets.pokemon.com',
      'www.serebii.net'
    ],
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
  },
}

// Only use bundle analyzer when ANALYZE env var is set and package is available
if (process.env.ANALYZE === 'true') {
  try {
    const withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    })
    module.exports = withBundleAnalyzer(nextConfig)
  } catch (error) {
    console.warn('Bundle analyzer not installed. Run: npm install @next/bundle-analyzer')
    module.exports = nextConfig
  }
} else {
  module.exports = nextConfig
}
