"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { applyTheme } from "@/lib/themes"

export function ThemeLoader() {
  const pathname = usePathname()

  useEffect(() => {
    const isLandingPage = pathname === "/" || pathname === "/blog"

    if (isLandingPage) {
      console.log("[v0] ThemeLoader - Landing page detected, using default theme")
      applyTheme("default")
      return
    }

    const savedTheme = localStorage.getItem("theme") || "default"
    const customPrimary = localStorage.getItem("customPrimary")
    const customSecondary = localStorage.getItem("customSecondary")

    console.log("[v0] ThemeLoader - Loading theme from localStorage:", savedTheme)

    if (savedTheme === "custom" && customPrimary && customSecondary) {
      applyTheme("custom", customPrimary, customSecondary)
    } else {
      applyTheme(savedTheme)
    }

    const syncThemeFromDB = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          const dbTheme = data.profile?.theme || "default"

          // Only update if DB has a different theme than localStorage
          if (dbTheme !== savedTheme) {
            console.log("[v0] ThemeLoader - Syncing theme from DB:", dbTheme)
            localStorage.setItem("theme", dbTheme)

            // Parse theme_preference if exists
            let themePreference = data.profile?.theme_preference
            if (typeof themePreference === "string") {
              try {
                themePreference = JSON.parse(themePreference)
              } catch {
                themePreference = null
              }
            }

            if (dbTheme === "custom" && themePreference?.customPrimary && themePreference?.customSecondary) {
              localStorage.setItem("customPrimary", themePreference.customPrimary)
              localStorage.setItem("customSecondary", themePreference.customSecondary)
              applyTheme("custom", themePreference.customPrimary, themePreference.customSecondary)
            } else {
              applyTheme(dbTheme)
            }
          }
        }
      } catch (error) {
        console.log("[v0] ThemeLoader - DB sync failed (user may not be authenticated):", error)
        // Keep localStorage theme if DB sync fails
      }
    }

    // Sync after initial load
    syncThemeFromDB()
  }, [pathname])

  return null
}
