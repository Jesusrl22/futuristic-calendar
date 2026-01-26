"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { applyTheme } from "@/lib/themes"

export function ThemeLoader() {
  const pathname = usePathname()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const isPublicPage =
      pathname === "/" ||
      pathname === "/blog" ||
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/admin" ||
      pathname === "/contact" ||
      pathname === "/reviews"

    if (isPublicPage) {
      applyTheme("neon-tech")
      setIsInitialized(true)
      return
    }

    const initializeTheme = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          const dbTheme = data.profile?.theme || "neon-tech"

          // Get custom themes from database
          let customThemes = []
          if (data.profile?.custom_themes) {
            try {
              customThemes =
                typeof data.profile.custom_themes === "string"
                  ? JSON.parse(data.profile.custom_themes)
                  : data.profile.custom_themes
            } catch (e) {
              customThemes = []
            }
          }

          localStorage.setItem("theme", dbTheme)

          // Check if the theme is a custom theme
          const customTheme = customThemes.find((t: any) => t.id === dbTheme)
          if (customTheme) {
            applyTheme(dbTheme, customTheme.primary, customTheme.secondary)
          } else {
            applyTheme(dbTheme)
          }
        } else {
          const savedTheme = localStorage.getItem("theme") || "neon-tech"
          applyTheme(savedTheme)
        }
      } catch (error) {
        console.log("[v0] Error loading theme:", error)
        const savedTheme = localStorage.getItem("theme") || "neon-tech"
        applyTheme(savedTheme)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeTheme()
  }, [pathname])

  return null
}
