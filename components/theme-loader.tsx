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
          const dbTheme = data.profile?.theme || "default"

          console.log("[v0] ThemeLoader - Fetched theme from API:", dbTheme)

          // Get custom themes from localStorage
          let customThemes = []
          const savedThemes = localStorage.getItem("customThemes")
          if (savedThemes) {
            try {
              customThemes = JSON.parse(savedThemes)
            } catch (e) {
              customThemes = []
            }
          }

          localStorage.setItem("theme", dbTheme)

          // Check if the theme is a custom theme
          const customTheme = customThemes.find((t: any) => t.id === dbTheme)
          if (customTheme) {
            console.log("[v0] ThemeLoader - Applying custom theme:", dbTheme)
            applyTheme(dbTheme, customTheme.primary, customTheme.secondary)
          } else {
            console.log("[v0] ThemeLoader - Applying standard theme:", dbTheme)
            applyTheme(dbTheme)
          }
        } else {
          console.log("[v0] ThemeLoader - API failed, using localStorage")
          const savedTheme = localStorage.getItem("theme") || "default"
          applyTheme(savedTheme)
        }
      } catch (error) {
        console.log("[v0] ThemeLoader - Error loading theme:", error)
        const savedTheme = localStorage.getItem("theme") || "default"
        applyTheme(savedTheme)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeTheme()
  }, [pathname])

  return null
}
