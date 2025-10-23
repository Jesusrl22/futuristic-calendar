"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme =
  | "light"
  | "dark"
  | "sunset"
  | "ocean"
  | "forest"
  | "midnight"
  | "rose"
  | "lavender"
  | "ember"
  | "mint"
  | "coral"
  | "arctic"
  | "sahara"
  | "neon"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") || "dark") as Theme
    setThemeState(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement
    html.setAttribute("data-theme", newTheme)
    if (newTheme === "light") {
      html.classList.remove("dark")
    } else {
      html.classList.add("dark")
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
