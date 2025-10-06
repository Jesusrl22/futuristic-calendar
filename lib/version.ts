// FutureTask Version 762 - Critical Build Identifier
export const APP_VERSION = {
  major: 762,
  minor: 0,
  patch: 0,
  full: "762.0.0",
  buildDate: "2025-01-06T12:15:00.000Z",
  buildId: "BUILD_762_CRITICAL_UPDATE",
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

export function logVersion() {
  console.log("╔═══════════════════════════════════════════╗")
  console.log(`║   🚀 ${APP_VERSION.name} ${APP_VERSION.full} 🚀   ║`)
  console.log("╚═══════════════════════════════════════════╝")
  console.log(`📦 Version: ${APP_VERSION.full}`)
  console.log(`🆔 Build ID: ${APP_VERSION.buildId}`)
  console.log(`🏗️  Build Date: ${APP_VERSION.buildDate}`)
  console.log(`⏰ Current Time: ${new Date().toISOString()}`)
  console.log("═══════════════════════════════════════════")
}
