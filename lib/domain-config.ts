export const DOMAIN_CONFIG = {
  production: "https://future-task.com",
  development: "http://localhost:3000",
  vercel: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  buildTimestamp: "2025-01-03T11:46:00Z",
  version: "758.0.0",
}

export function getCurrentDomain(): string {
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  const env = process.env.NODE_ENV
  const vercelUrl = process.env.VERCEL_URL

  console.log("🌐 [v758] Domain detection:", {
    env,
    vercelUrl,
    hasVercelUrl: !!vercelUrl,
    timestamp: DOMAIN_CONFIG.buildTimestamp,
  })

  if (env === "production") {
    return DOMAIN_CONFIG.production
  }

  if (vercelUrl) {
    return `https://${vercelUrl}`
  }

  return DOMAIN_CONFIG.development
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || getCurrentDomain()
}
