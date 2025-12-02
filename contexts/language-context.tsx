"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Language } from "@/lib/translations"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    const browserLang = navigator.language.split("-")[0] as Language
    const initialLang = savedLang || browserLang || "en"
    setLanguageState(initialLang)
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    window.dispatchEvent(new Event("languagechange"))
  }

  if (!mounted) {
    return null
  }

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
