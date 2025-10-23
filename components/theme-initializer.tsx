"use client"

import { useEffect } from "react"

export function ThemeInitializer() {
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") || "dark"
      const savedFontSize = localStorage.getItem("fontSize") || "medium"
      const savedCompactMode = localStorage.getItem("compactMode") === "true"

      const html = document.documentElement
      html.setAttribute("data-theme", savedTheme)
      html.setAttribute("data-font-size", savedFontSize)

      if (savedTheme === "light") {
        html.classList.remove("dark")
      } else {
        html.classList.add("dark")
      }

      if (savedCompactMode) {
        html.setAttribute("data-compact", "true")
      }

      console.log("Theme initialized:", { savedTheme, savedFontSize, savedCompactMode })
    } catch (error) {
      console.error("Error initializing theme:", error)
    }
  }, [])

  return null
}
