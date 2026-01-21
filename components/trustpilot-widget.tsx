"use client"

import { useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Star } from "lucide-react"

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

// Reviews carousel widget - improved responsive design
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
    <Card className="glass-card p-6 sm:p-8 border border-primary/20 hover:border-primary/40 transition-colors">
      <div
        id="trustpilot-carousel"
        className="trustpilot-widget w-full"
        data-locale={getTrustpilotLocale(language)}
        data-template-id="54ad5defc6454f065c28af8b"
        data-businessunit-id="63a5f4eee19b8abb0b35f82f"
        data-style-height="auto"
        data-style-width="100%"
        data-theme="light"
        data-stars="4,5"
        data-review-languages={language}
      >
        <a href="https://www.trustpilot.com/review/future-task.com" target="_blank" rel="noopener">
          Trustpilot
        </a>
      </div>
    </Card>
  )
}

// Featured reviews CTA section
export function TrustpilotCTA({ locale = "es" }: { locale?: string }) {
  const getTrustpilotUrl = () => {
    const localeMap: Record<string, string> = {
      es: "es",
      en: "www",
      fr: "fr",
      de: "de",
      it: "it",
      pt: "pt",
      ru: "ru",
      zh: "cn",
      ja: "jp",
      ko: "kr",
    }
    const subdomain = localeMap[locale] || "www"
    return `https://${subdomain}.trustpilot.com/review/future-task.com`
  }

  // Translations for each language
  const translations: Record<string, Record<string, string>> = {
    es: {
      viewReviews: "Ver Todas las Reviews",
      viewReviewsDesc: "Descubre qué dicen nuestros usuarios en Trustpilot",
      writeReview: "Escribe tu Reseña",
      writeReviewDesc: "Comparte tu experiencia con Future Task",
    },
    en: {
      viewReviews: "View All Reviews",
      viewReviewsDesc: "Discover what our users say on Trustpilot",
      writeReview: "Write Your Review",
      writeReviewDesc: "Share your experience with Future Task",
    },
    fr: {
      viewReviews: "Voir Tous les Avis",
      viewReviewsDesc: "Découvrez ce que nos utilisateurs disent sur Trustpilot",
      writeReview: "Écrivez Votre Avis",
      writeReviewDesc: "Partagez votre expérience avec Future Task",
    },
    de: {
      viewReviews: "Alle Bewertungen Ansehen",
      viewReviewsDesc: "Erfahren Sie, was unsere Benutzer auf Trustpilot sagen",
      writeReview: "Schreiben Sie Ihre Bewertung",
      writeReviewDesc: "Teilen Sie Ihre Erfahrung mit Future Task",
    },
    it: {
      viewReviews: "Vedi Tutte le Recensioni",
      viewReviewsDesc: "Scopri cosa dicono i nostri utenti su Trustpilot",
      writeReview: "Scrivi la Tua Recensione",
      writeReviewDesc: "Condividi la tua esperienza con Future Task",
    },
  }

  const lang = locale || "es"
  const trans = translations[lang] || translations.es

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
      {/* View All Reviews */}
      <Card className="glass-card p-4 sm:p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 group cursor-pointer">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto group-hover:bg-primary/30 transition-colors">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold">{trans.viewReviews}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {trans.viewReviewsDesc}
            </p>
          </div>
          <Button
            onClick={() => window.open(getTrustpilotUrl(), "_blank", "noopener,noreferrer")}
            className="bg-primary hover:bg-primary/90 w-full text-sm sm:text-base transition-all"
          >
            {trans.viewReviews}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Write a Review */}
      <Card className="glass-card p-4 sm:p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 group cursor-pointer">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto group-hover:bg-primary/30 transition-colors">
            <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold">{trans.writeReview}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {trans.writeReviewDesc}
            </p>
          </div>
          <Button
            onClick={() => window.open(getTrustpilotUrl(), "_blank", "noopener,noreferrer")}
            className="bg-primary hover:bg-primary/90 w-full text-sm sm:text-base transition-all"
          >
            {trans.writeReview}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
