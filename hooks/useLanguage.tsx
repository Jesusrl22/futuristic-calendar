"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, type Language } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (
      savedLanguage &&
      (savedLanguage === "es" ||
        savedLanguage === "en" ||
        savedLanguage === "fr" ||
        savedLanguage === "de" ||
        savedLanguage === "it" ||
        savedLanguage === "pt")
    ) {
      console.log("🌍 Loading saved language:", savedLanguage)
      setLanguageState(savedLanguage)
      document.documentElement.lang = savedLanguage
    } else {
      console.log("🌍 Using default language: es")
      setLanguageState("es")
      document.documentElement.lang = "es"
      localStorage.setItem("language", "es")
    }
  }, [])

  const setLanguage = (lang: Language) => {
    console.log("🌍 Setting language to:", lang)
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    document.documentElement.lang = lang

    window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: lang } }))
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        console.warn(`⚠️ Translation key not found: ${key} for language: ${language}`)
        return key
      }
    }

    return typeof value === "string" ? value : key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
