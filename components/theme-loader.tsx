"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { applyTheme } from "@/lib/themes"

export function ThemeLoader() {
  const pathname = usePathname()

  useEffect(() => {
    const isLandingPage = pathname === "/" || pathname === "/blog"

    if (isLandingPage) {
      applyTheme("default")
      return
    }

    const savedTheme = localStorage.getItem("theme") || "default"
    const customPrimary = localStorage.getItem("customPrimary")
    const customSecondary = localStorage.getItem("customSecondary")

    console.log("[v0] ThemeLoader - Saved theme from localStorage:", savedTheme)
    console.log("[v0] ThemeLoader - Custom colors from localStorage:", customPrimary, customSecondary)

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

          console.log("[v0] ThemeLoader - Theme from DB:", dbTheme)
          console.log("[v0] ThemeLoader - theme_preference from DB:", data.profile?.theme_preference)

          let customPrimaryDB = null
          let customSecondaryDB = null

          if (data.profile?.theme_preference) {
            let themePreference = data.profile.theme_preference
            console.log("[v0] ThemeLoader - theme_preference type:", typeof themePreference)

            if (typeof themePreference === "string") {
              try {
                themePreference = JSON.parse(themePreference)
                console.log("[v0] ThemeLoader - Parsed theme_preference:", themePreference)
              } catch (e) {
                console.log("[v0] ThemeLoader - Failed to parse theme_preference:", e)
                themePreference = null
              }
            }

            if (themePreference?.customPrimary) {
              customPrimaryDB = themePreference.customPrimary
            }
            if (themePreference?.customSecondary) {
              customSecondaryDB = themePreference.customSecondary
            }
          }

          if (!customPrimaryDB && data.profile?.customPrimary) {
            customPrimaryDB = data.profile.customPrimary
          }
          if (!customSecondaryDB && data.profile?.customSecondary) {
            customSecondaryDB = data.profile.customSecondary
          }

          console.log("[v0] ThemeLoader - Final custom colors from DB:", customPrimaryDB, customSecondaryDB)

          const themeChanged = dbTheme !== savedTheme
          const colorsChanged =
            dbTheme === "custom" &&
            savedTheme === "custom" &&
            (customPrimaryDB !== customPrimary || customSecondaryDB !== customSecondary)

          console.log("[v0] ThemeLoader - Theme changed?", themeChanged)
          console.log("[v0] ThemeLoader - Colors changed?", colorsChanged)

          if (themeChanged || colorsChanged) {
            console.log("[v0] ThemeLoader - Syncing theme from DB to localStorage")
            localStorage.setItem("theme", dbTheme)

            if (dbTheme === "custom" && customPrimaryDB && customSecondaryDB) {
              localStorage.setItem("customPrimary", customPrimaryDB)
              localStorage.setItem("customSecondary", customSecondaryDB)
              applyTheme("custom", customPrimaryDB, customSecondaryDB)
            } else {
              localStorage.removeItem("customPrimary")
              localStorage.removeItem("customSecondary")
              applyTheme(dbTheme)
            }
          }
        }
      } catch (error) {
        console.log("[v0] ThemeLoader - DB sync error:", error)
        // Keep localStorage theme if DB sync fails
      }
    }

    syncThemeFromDB()
  }, [pathname])

  return null
}
