export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return "http://localhost:3000"
}

export function isDevelopment(): boolean {
  return getBaseUrl().includes("localhost") || getBaseUrl().includes("127.0.0.1")
}

export function isProduction(): boolean {
  return !isDevelopment()
}
