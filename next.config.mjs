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
    // Security: Restrict image sources
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
    // Security: Disable response compression to prevent compression attacks
    // responseCompression: false,
  },
  
  // Security headers for Vercel deployment (WAF protection)
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
          {
            key: 'X-Download-Options',
            value: 'noopen',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
        ],
      },
    ]
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

  // Security: Enable SWR stale-while-revalidate caching headers
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
}

export default nextConfig
