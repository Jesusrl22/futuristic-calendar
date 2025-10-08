export const DOMAIN_CONFIG = {
  production: "future-task.com",
  staging: "staging.future-task.com",
  development: "localhost:3000",
}

export function getCurrentDomain(): string {
  if (typeof window === "undefined") {
    if (process.env.VERCEL_ENV === "production") {
      return DOMAIN_CONFIG.production
    }
    if (process.env.VERCEL_URL) {
      return process.env.VERCEL_URL
    }
    return DOMAIN_CONFIG.development
  }

  const hostname = window.location.hostname
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return DOMAIN_CONFIG.development
  }
  if (hostname.includes("vercel.app")) {
    return hostname
  }
  if (hostname === "future-task.com" || hostname === "www.future-task.com") {
    return DOMAIN_CONFIG.production
  }
  return hostname
}

export function getBaseUrl(): string {
  const domain = getCurrentDomain()
  if (domain.includes("localhost") || domain.includes("127.0.0.1")) {
    return `http://${domain}`
  }
  return `https://${domain}`
}

export function isProduction(): boolean {
  if (typeof window !== "undefined") {
    return window.location.hostname === "future-task.com" || window.location.hostname === "www.future-task.com"
  }
  return process.env.VERCEL_ENV === "production"
}
