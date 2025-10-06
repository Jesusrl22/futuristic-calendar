// FutureTask Version Management System
// This file provides centralized version information

export const APP_VERSION = {
  major: 761,
  minor: 0,
  patch: 2,
  full: "761.0.2",
  buildDate: "2025-01-03T12:10:00.000Z",
  name: "FutureTask",
}

export function getVersionString(): string {
  return `v${APP_VERSION.full}`
}

export function getFullVersionInfo() {
  return {
    version: APP_VERSION.full,
    buildDate: APP_VERSION.buildDate,
    name: APP_VERSION.name,
  }
}

// Client-safe logging (no process.env references)
export function logVersion() {
  console.log("╔═══════════════════════════════════════════╗")
  console.log(`║   ${APP_VERSION.name} v${APP_VERSION.full}`)
  console.log("╚═══════════════════════════════════════════╝")
  console.log(`📦 Version: ${APP_VERSION.full}`)
  console.log(`🏗️  Build Date: ${APP_VERSION.buildDate}`)
  console.log(`⏰ Current Time: ${new Date().toISOString()}`)
  console.log("═══════════════════════════════════════════")
}
