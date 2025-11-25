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

          let customPrimaryDB = null
          let customSecondaryDB = null

          if (data.profile?.theme_preference) {
            let themePreference = data.profile.theme_preference
            if (typeof themePreference === "string") {
              try {
                themePreference = JSON.parse(themePreference)
              } catch {
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

          const themeChanged = dbTheme !== savedTheme
          const colorsChanged =
            dbTheme === "custom" &&
            savedTheme === "custom" &&
            (customPrimaryDB !== customPrimary || customSecondaryDB !== customSecondary)

          if (themeChanged || colorsChanged) {
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
        // Keep localStorage theme if DB sync fails
      }
    }

    syncThemeFromDB()
  }, [pathname])

  return null
}
