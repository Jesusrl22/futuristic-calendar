"use client"

import { useEffect } from "react"
import { applyTheme } from "@/lib/themes"

export function ThemeLoader() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "neon-tech"
    const customPrimary = localStorage.getItem("customPrimary")
    const customSecondary = localStorage.getItem("customSecondary")

    console.log("[v0] ThemeLoader - Loading saved theme:", savedTheme)

    if (savedTheme === "custom" && customPrimary && customSecondary) {
      console.log("[v0] ThemeLoader - Applying custom theme")
      applyTheme("custom", customPrimary, customSecondary)
    } else {
      console.log("[v0] ThemeLoader - Applying theme:", savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  return null
}
