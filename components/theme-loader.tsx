"use client"

import { useEffect } from "react"
import { applyTheme } from "@/lib/themes"

export function ThemeLoader() {
  useEffect(() => {
    // The settings page will handle syncing with DB when user is authenticated
    const savedTheme = localStorage.getItem("theme") || "default"
    const customPrimary = localStorage.getItem("customPrimary")
    const customSecondary = localStorage.getItem("customSecondary")

    console.log("[v0] ThemeLoader - Loading theme from localStorage:", savedTheme)

    if (savedTheme === "custom" && customPrimary && customSecondary) {
      applyTheme("custom", customPrimary, customSecondary)
    } else {
      applyTheme(savedTheme)
    }
  }, [])

  return null
}
