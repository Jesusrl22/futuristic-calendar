"use client"

import { useEffect, useState } from "react"

export type ThemeName =
  | "default-light"
  | "default-dark"
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
  | "dark-amoled"
  | "matrix"

interface ThemeConfig {
  theme: ThemeName
  fontSize: "small" | "medium" | "large"
  compactMode: boolean
}

export function useTheme() {
  const [mounted, setMounted] = useState(false)
  const [config, setConfig] = useState<ThemeConfig>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("themeConfig")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Error parsing theme config:", e)
        }
      }
    }
    return {
      theme: "default-dark",
      fontSize: "medium",
      compactMode: false,
    }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("themeConfig", JSON.stringify(config))
      applyTheme(config)
    }
  }, [config, mounted])

  const applyTheme = (themeConfig: ThemeConfig) => {
    // Remover todas las clases de tema anteriores
    document.documentElement.classList.remove(
      "theme-default-light",
      "theme-default-dark",
      "theme-ocean",
      "theme-forest",
      "theme-sunset",
      "theme-midnight",
      "theme-royal-purple",
      "theme-cyber-pink",
      "theme-neon-green",
      "theme-crimson",
      "theme-golden-hour",
      "theme-arctic-blue",
      "theme-dark-amoled",
      "theme-matrix",
    )

    // Aplicar nuevo tema
    document.documentElement.classList.add(`theme-${themeConfig.theme}`)

    // Aplicar tamaño de fuente
    const fontSizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
    }
    document.documentElement.style.fontSize = fontSizes[themeConfig.fontSize]

    // Aplicar modo compacto
    if (themeConfig.compactMode) {
      document.documentElement.classList.add("compact-mode")
    } else {
      document.documentElement.classList.remove("compact-mode")
    }
  }

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates }
      return newConfig
    })
  }

  return {
    config,
    updateTheme,
    mounted,
  }
}
