import { APP_VERSION } from "./version"

export const DOMAIN_CONFIG = {
  production: "future-task.com",
  development: "localhost:3000",
  preview: process.env.NEXT_PUBLIC_VERCEL_URL || "preview.vercel.app",
}

export function getCurrentDomain(): string {
  if (typeof window === "undefined") {
    return DOMAIN_CONFIG.development
  }

  const hostname = window.location.hostname

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return DOMAIN_CONFIG.development
  }

  if (hostname.includes("vercel.app")) {
    return hostname
  }

  return DOMAIN_CONFIG.production
}

export function getBaseUrl(): string {
  const domain = getCurrentDomain()
  const protocol = domain.includes("localhost") ? "http" : "https"
  return `${protocol}://${domain}`
}

console.log("🌐 Domain Configuration")
console.log(`📦 Version: ${APP_VERSION.full}`)
console.log(`🏠 Base URL: ${getBaseUrl()}`)
console.log(`⏰ Timestamp: ${new Date().toISOString()}`)
