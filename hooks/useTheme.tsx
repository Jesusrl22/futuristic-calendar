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

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("themeSettings")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings(parsed)
        applyTheme(parsed)
      } catch (e) {
        console.error("Error loading theme settings:", e)
      }
    } else {
      applyTheme(DEFAULT_THEME)
    }
  }, [])

  const applyTheme = (newSettings: ThemeSettings) => {
    const html = document.documentElement

    // Apply theme
    html.setAttribute("data-theme", newSettings.theme)

    // Apply font size
    html.setAttribute("data-font-size", newSettings.fontSize)

    // Apply compact mode
    if (newSettings.compactMode) {
      html.setAttribute("data-compact", "true")
    } else {
      html.removeAttribute("data-compact")
    }

    console.log("Theme applied:", newSettings)
  }

  const updateTheme = (theme: ThemeName) => {
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
    ...settings,
    updateTheme,
    updateFontSize,
    toggleCompactMode,
  }
}
