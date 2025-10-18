"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
]

interface LanguageSelectorProps {
  variant?: "button" | "select"
  showFlag?: boolean
  showName?: boolean
  className?: string
}

export function LanguageSelector({
  variant = "select",
  showFlag = true,
  showName = true,
  className = "",
}: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`} />
  }

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0]

  if (variant === "button") {
    return (
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className={`w-auto h-10 px-3 bg-transparent border-gray-200 dark:border-gray-600 ${className}`}>
          <SelectValue>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              {showFlag && <span className="mr-2">{currentLanguage.flag}</span>}
              {showName && <span className="hidden sm:inline">{currentLanguage.name}</span>}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          {languages.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
            >
              <div className="flex items-center">
                {showFlag && <span className="mr-2">{lang.flag}</span>}
                {showName && <span>{lang.name}</span>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className={`w-full bg-white/10 border-white/20 text-white hover:bg-white/20 ${className}`}>
        <SelectValue>
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            {showFlag && <span className="mr-2">{currentLanguage.flag}</span>}
            {showName && <span>{currentLanguage.name}</span>}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-gray-700">
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-gray-700 focus:bg-gray-700">
            <div className="flex items-center">
              {showFlag && <span className="mr-2">{lang.flag}</span>}
              {showName && <span>{lang.name}</span>}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
