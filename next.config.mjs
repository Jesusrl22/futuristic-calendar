/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BUILD_VERSION: "761",
    BUILD_TIMESTAMP: new Date().toISOString(),
  },
  images: {
    domains: ["blob.v0.app", "placeholder.svg"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "blob.v0.app",
      },
    ],
    unoptimized: true, // Added from updates
  },
  eslint: {
    ignoreDuringBuilds: true, // Added from updates
  },
  typescript: {
    ignoreBuildErrors: true, // Added from updates
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-App-Version",
            value: "761",
          },
          {
            key: "X-Build-Time",
            value: new Date().toISOString(),
          },
        ],
      },
    ]
  },
}

export default nextConfig
