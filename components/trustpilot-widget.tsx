"use client"

import { useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"

interface TrustpilotWidgetProps {
  templateId?: string
  height?: string
  theme?: "light" | "dark"
}

export function TrustpilotWidget({ 
  templateId = "56278e9abfbbba0bdcd568bc", 
  height = "52px",
  theme = "light" 
}: TrustpilotWidgetProps) {
  const { language } = useLanguage()

  // Map language codes to Trustpilot locales
  const getTrustpilotLocale = (lang: string) => {
    const localeMap: Record<string, string> = {
      es: "es-ES",
      en: "en-US",
      fr: "fr-FR",
      de: "de-DE",
      it: "it-IT",
      pt: "pt-BR",
      ru: "ru-RU",
      zh: "zh-CN",
      ja: "ja-JP",
      ko: "ko-KR",
      ar: "ar-AE",
      hi: "hi-IN",
    }
    return localeMap[lang] || "en-US"
  }

  useEffect(() => {
    // Load Trustpilot widgets when component mounts or language changes
    if (typeof window !== "undefined" && (window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(document.getElementById("trustpilot-widget"), true)
    }
  }, [language])

  return (
    <div
      id="trustpilot-widget"
      className="trustpilot-widget"
      data-locale={getTrustpilotLocale(language)}
      data-template-id={templateId}
      data-businessunit-id="63a5f4eee19b8abb0b35f82f"
      data-style-height={height}
      data-style-width="100%"
      data-theme={theme}
      data-token="7b27f41d-88e4-4dea-938e-a3301b341de1"
    >
      <a href="https://www.trustpilot.com/review/future-task.com" target="_blank" rel="noopener">
        Trustpilot
      </a>
    </div>
  )
}

// Mini widget for reviews carousel (5-star rating display)
export function TrustpilotMiniWidget() {
  const { language } = useLanguage()

  const getTrustpilotLocale = (lang: string) => {
    const localeMap: Record<string, string> = {
      es: "es-ES",
      en: "en-US",
      fr: "fr-FR",
      de: "de-DE",
      it: "it-IT",
      pt: "pt-BR",
      ru: "ru-RU",
      zh: "zh-CN",
      ja: "ja-JP",
      ko: "ko-KR",
      ar: "ar-AE",
      hi: "hi-IN",
    }
    return localeMap[lang] || "en-US"
  }

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(document.getElementById("trustpilot-mini"), true)
    }
  }, [language])

  return (
    <div
      id="trustpilot-mini"
      className="trustpilot-widget"
      data-locale={getTrustpilotLocale(language)}
      data-template-id="5419b6a8b0d04a076446a9ad"
      data-businessunit-id="63a5f4eee19b8abb0b35f82f"
      data-style-height="24px"
      data-style-width="100%"
      data-theme="light"
    >
      <a href="https://www.trustpilot.com/review/future-task.com" target="_blank" rel="noopener">
        Trustpilot
      </a>
    </div>
  )
}

// Reviews carousel widget
export function TrustpilotCarousel() {
  const { language } = useLanguage()

  const getTrustpilotLocale = (lang: string) => {
    const localeMap: Record<string, string> = {
      es: "es-ES",
      en: "en-US",
      fr: "fr-FR",
      de: "de-DE",
      it: "it-IT",
      pt: "pt-BR",
      ru: "ru-RU",
      zh: "zh-CN",
      ja: "ja-JP",
      ko: "ko-KR",
      ar: "ar-AE",
      hi: "hi-IN",
    }
    return localeMap[lang] || "en-US"
  }

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(document.getElementById("trustpilot-carousel"), true)
    }
  }, [language])

  return (
    <div
      id="trustpilot-carousel"
      className="trustpilot-widget"
      data-locale={getTrustpilotLocale(language)}
      data-template-id="54ad5defc6454f065c28af8b"
      data-businessunit-id="63a5f4eee19b8abb0b35f82f"
      data-style-height="240px"
      data-style-width="100%"
      data-theme="light"
      data-stars="4,5"
      data-review-languages={language}
    >
      <a href="https://www.trustpilot.com/review/future-task.com" target="_blank" rel="noopener">
        Trustpilot
      </a>
    </div>
  )
}
