"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/hooks/useLanguage"
import { Globe, ChevronDown } from "lucide-react"

interface LanguageSelectorProps {
  variant?: "default" | "compact" | "mobile"
  className?: string
}

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
]

export function LanguageSelector({ variant = "default", className = "" }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any)
    setIsOpen(false)
  }

  if (variant === "mobile") {
    return (
      <div className={`w-full ${className}`}>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentLanguage.flag}</span>
                <span>{currentLanguage.name}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {languages.map((lang) => (
              <SelectItem
                key={lang.code}
                value={lang.code}
                className="text-white hover:bg-slate-700 focus:bg-slate-700"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`relative ${className}`}>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-auto min-w-[120px] bg-transparent border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span className="text-sm">{currentLanguage.flag}</span>
                <span className="text-sm font-medium">{currentLanguage.name}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
            {languages.map((lang) => (
              <SelectItem
                key={lang.code}
                value={lang.code}
                className="hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-200"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-sm">{currentLanguage.name}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                  language === lang.code
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {language === lang.code && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
