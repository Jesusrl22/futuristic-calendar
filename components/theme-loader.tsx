"use client"

import { useEffect } from "react"
import { applyTheme } from "@/lib/themes"

export function ThemeLoader() {
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          const dbTheme = data.profile?.theme || "default"
          let themePreference = data.profile?.theme_preference

          // Parse theme_preference if it's a string
          if (typeof themePreference === "string") {
            try {
              themePreference = JSON.parse(themePreference)
            } catch {
              themePreference = null
            }
          }

          console.log("[v0] ThemeLoader - Loaded theme from DB:", dbTheme)

          // Apply custom theme with preferences
          if (dbTheme === "custom" && themePreference) {
            const { customPrimary, customSecondary } = themePreference
            if (customPrimary && customSecondary) {
              console.log("[v0] ThemeLoader - Applying custom theme from DB")
              applyTheme("custom", customPrimary, customSecondary)
              // Update localStorage to match DB
              localStorage.setItem("theme", "custom")
              localStorage.setItem("customPrimary", customPrimary)
              localStorage.setItem("customSecondary", customSecondary)
              return
            }
          }

          // Apply regular theme
          console.log("[v0] ThemeLoader - Applying theme from DB:", dbTheme)
          applyTheme(dbTheme)
          // Update localStorage to match DB
          localStorage.setItem("theme", dbTheme)
          return
        }
      } catch (error) {
        console.error("[v0] ThemeLoader - Failed to load theme from DB:", error)
      }

      const savedTheme = localStorage.getItem("theme") || "default"
      const customPrimary = localStorage.getItem("customPrimary")
      const customSecondary = localStorage.getItem("customSecondary")

      console.log("[v0] ThemeLoader - Using localStorage fallback:", savedTheme)

      if (savedTheme === "custom" && customPrimary && customSecondary) {
        applyTheme("custom", customPrimary, customSecondary)
      } else {
        applyTheme(savedTheme)
      }
    }

    loadTheme()
  }, [])

  return null
}
