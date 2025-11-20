"use client"

import { useEffect } from "react"
import { applyTheme } from "@/lib/themes"

export function ThemeLoader() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "neon-tech"
    const customPrimary = localStorage.getItem("customPrimary")
    const customSecondary = localStorage.getItem("customSecondary")

    if (savedTheme === "custom" && customPrimary && customSecondary) {
      applyTheme("custom", customPrimary, customSecondary)
    } else {
      applyTheme(savedTheme)
    }
  }, [])

  return null
}
