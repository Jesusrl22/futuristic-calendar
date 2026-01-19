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
}

export default nextConfig
