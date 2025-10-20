"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations } from "@/lib/translations"

type Language = "es" | "en" | "fr" | "de" | "it" | "pt"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  mounted: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["es", "en", "fr", "de", "it", "pt"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    } else {
      // Detectar idioma del navegador
      const browserLang = navigator.language.split("-")[0] as Language
      if (["es", "en", "fr", "de", "it", "pt"].includes(browserLang)) {
        setLanguageState(browserLang)
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    // Forzar recarga para aplicar el nuevo idioma
    window.location.reload()
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        return key
      }
    }

    return typeof value === "string" ? value : key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t, mounted }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
