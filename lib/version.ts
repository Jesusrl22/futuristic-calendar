export const APP_VERSION = {
  major: 764,
  minor: 0,
  patch: 0,
  full: "764.0.0",
  buildDate: "2025-01-06T13:00:00.000Z",
  buildId: "BUILD_764",
  name: "FutureTask",
}

export function getVersionString(): string {
  return `v${APP_VERSION.full}`
}

export function getFullVersionInfo() {
  return {
    version: APP_VERSION.full,
    buildDate: APP_VERSION.buildDate,
    buildId: APP_VERSION.buildId,
    name: APP_VERSION.name,
  }
}

export function logVersion(): void {
  console.log("╔═══════════════════════════════════════════╗")
  console.log(`║      FutureTask v${APP_VERSION.full}      ║`)
  console.log("╚═══════════════════════════════════════════╝")
  console.log(`📦 Version: v${APP_VERSION.full}`)
  console.log(`🆔 Build ID: ${APP_VERSION.buildId}`)
  console.log(`🏗️  Build: ${APP_VERSION.buildDate}`)
  console.log(`⏰ Current Time: ${new Date().toISOString()}`)
  console.log("═══════════════════════════════════════════")
}
