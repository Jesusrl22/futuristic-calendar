/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
  serverExternalPackages: ['@upstash/redis'],

  output: 'standalone',

  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },

  // Optimize bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle Upstash Redis in client
      config.resolve.alias = {
        ...config.resolve.alias,
        '@upstash/redis': false,
      }
    }
    return config
  },

  // Security: Disable X-Powered-By header
  poweredByHeader: false,
}

export default nextConfig
