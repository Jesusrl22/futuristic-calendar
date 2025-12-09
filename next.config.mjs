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
  experimental: {
    // Optimize server components
    serverComponentsExternalPackages: ['@upstash/redis'],
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
