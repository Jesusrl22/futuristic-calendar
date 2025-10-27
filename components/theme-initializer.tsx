"use client"

import { useEffect } from "react"

export function ThemeInitializer() {
  useEffect(() => {
    try {
      // Cargar tema guardado
      const savedThemeSettings = localStorage.getItem("themeSettings")
      if (savedThemeSettings) {
        const settings = JSON.parse(savedThemeSettings)
        const html = document.documentElement

        // Aplicar tema
        html.setAttribute("data-theme", settings.theme || "dark")
        html.setAttribute("data-font-size", settings.fontSize || "medium")

        // Aplicar modo compacto
        if (settings.compactMode) {
          html.setAttribute("data-compact", "true")
        } else {
          html.removeAttribute("data-compact")
        }

        // Aplicar clase dark para temas oscuros
        const darkThemes = [
          "dark",
          "ocean",
          "forest",
          "sunset",
          "midnight",
          "royal-purple",
          "cyber-pink",
          "neon-green",
          "crimson",
          "golden-hour",
          "arctic-blue",
          "amoled",
          "matrix",
        ]
        if (darkThemes.includes(settings.theme)) {
          html.classList.add("dark")
        } else {
          html.classList.remove("dark")
        }

        console.log("🎨 Theme initialized:", settings)
      } else {
        // Tema por defecto
        const html = document.documentElement
        html.setAttribute("data-theme", "dark")
        html.setAttribute("data-font-size", "medium")
        html.classList.add("dark")
      }
    } catch (error) {
      console.error("Error initializing theme:", error)
    }
  }, [])

  return null
}
