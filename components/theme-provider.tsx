"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface ThemeContextType {
  theme: string
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "default",
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

interface ThemeProviderProps {
  children: React.ReactNode
  theme?: string
}

export function ThemeProvider({ children, theme = "default" }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState(theme)

  useEffect(() => {
    setCurrentTheme(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme: setCurrentTheme }}>{children}</ThemeContext.Provider>
  )
}
