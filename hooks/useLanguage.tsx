"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, type Translations, getTranslations, isSupportedLanguage } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: keyof Translations) => string
  translations: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("es")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Load language from localStorage or detect from browser
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage && isSupportedLanguage(savedLanguage)) {
      setLanguageState(savedLanguage)
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split("-")[0]
      if (isSupportedLanguage(browserLanguage)) {
        setLanguageState(browserLanguage)
      }
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    if (mounted) {
      localStorage.setItem("language", newLanguage)
    }
  }

  const translations = getTranslations(language)

  const t = (key: keyof Translations): string => {
    return translations[key] || key
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    translations,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
