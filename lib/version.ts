// Version tracking for deployment verification
export const APP_VERSION = {
  major: 7,
  minor: 6,
  patch: 1,
  build: 761,
  timestamp: "2025-01-03T12:05:00.000Z",
  full: "761.0.1",
}

export function getVersionString(): string {
  return `v${APP_VERSION.full} (Build ${APP_VERSION.build})`
}

export function logVersionInfo() {
  console.log("╔═══════════════════════════════════════════╗")
  console.log("║     FutureTask Application v761          ║")
  console.log("╚═══════════════════════════════════════════╝")
  console.log(`📦 Version: ${getVersionString()}`)
  console.log(`⏰ Build Time: ${APP_VERSION.timestamp}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔧 Next.js: ${process.env.npm_package_dependencies_next || "14.0.4"}`)
  console.log("═══════════════════════════════════════════")
}

// Auto-log on import
if (typeof window !== "undefined") {
  logVersionInfo()
}
