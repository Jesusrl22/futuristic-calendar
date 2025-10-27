"use client"

import { useState, useEffect } from "react"

export type ThemeName =
  | "light"
  | "dark"
  | "ocean"
  | "forest"
  | "sunset"
  | "midnight"
  | "royal-purple"
  | "cyber-pink"
  | "neon-green"
  | "crimson"
  | "golden-hour"
  | "arctic-blue"
  | "amoled"
  | "matrix"

export type FontSize = "small" | "medium" | "large"

export interface ThemeSettings {
  theme: ThemeName
  fontSize: FontSize
  compactMode: boolean
}

const DEFAULT_THEME: ThemeSettings = {
  theme: "dark",
  fontSize: "medium",
  compactMode: false,
}

export function useTheme() {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_THEME)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("themeSettings")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings(parsed)
        applyTheme(parsed)
      } catch (e) {
        console.error("Error loading theme settings:", e)
        applyTheme(DEFAULT_THEME)
      }
    } else {
      applyTheme(DEFAULT_THEME)
    }
    setIsInitialized(true)
  }, [])

  const applyTheme = (newSettings: ThemeSettings) => {
    const html = document.documentElement

    // Aplicar el tema usando data-theme
    html.setAttribute("data-theme", newSettings.theme)
    html.setAttribute("data-font-size", newSettings.fontSize)

    // Aplicar modo compacto
    if (newSettings.compactMode) {
      html.setAttribute("data-compact", "true")
    } else {
      html.removeAttribute("data-compact")
    }

    // Aplicar clase dark solo para temas oscuros
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
    if (darkThemes.includes(newSettings.theme)) {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }

    console.log("🎨 Theme applied:", newSettings)
  }

  const setTheme = (theme: ThemeName) => {
    const newSettings = { ...settings, theme }
    setSettings(newSettings)
    localStorage.setItem("themeSettings", JSON.stringify(newSettings))
    applyTheme(newSettings)
  }

  const updateFontSize = (fontSize: FontSize) => {
    const newSettings = { ...settings, fontSize }
    setSettings(newSettings)
    localStorage.setItem("themeSettings", JSON.stringify(newSettings))
    applyTheme(newSettings)
  }

  const toggleCompactMode = () => {
    const newSettings = { ...settings, compactMode: !settings.compactMode }
    setSettings(newSettings)
    localStorage.setItem("themeSettings", JSON.stringify(newSettings))
    applyTheme(newSettings)
  }

  return {
    theme: settings.theme,
    fontSize: settings.fontSize,
    compactMode: settings.compactMode,
    setTheme,
    updateFontSize,
    toggleCompactMode,
    isInitialized,
  }
}
