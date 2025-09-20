"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Settings, Shield, Eye, BarChart3 } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
}

export function CookieBanner() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedConsent = localStorage.getItem("cookie-consent")
      const savedPreferences = localStorage.getItem("cookie-preferences")

      if (!savedConsent) {
        setIsVisible(true)
      }

      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences)
          // Validate the structure
          if (
            parsed &&
            typeof parsed === "object" &&
            typeof parsed.necessary === "boolean" &&
            typeof parsed.analytics === "boolean" &&
            typeof parsed.marketing === "boolean" &&
            typeof parsed.preferences === "boolean"
          ) {
            setPreferences(parsed)
          } else {
            // Invalid structure, reset to defaults
            console.warn("Invalid cookie preferences structure, resetting to defaults")
            localStorage.removeItem("cookie-preferences")
            setPreferences(DEFAULT_PREFERENCES)
          }
        } catch (error) {
          console.error("Error parsing cookie preferences:", error)
          // Clear corrupted data
          localStorage.removeItem("cookie-preferences")
          setPreferences(DEFAULT_PREFERENCES)
        }
      }
    } catch (error) {
      console.error("Error loading cookie preferences:", error)
      setPreferences(DEFAULT_PREFERENCES)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const savePreferences = (newPreferences: CookiePreferences) => {
    try {
      localStorage.setItem("cookie-preferences", JSON.stringify(newPreferences))
      localStorage.setItem("cookie-consent", "true")
      setPreferences(newPreferences)

      // Update Google Analytics consent
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: newPreferences.analytics ? "granted" : "denied",
          ad_storage: newPreferences.marketing ? "granted" : "denied",
          functionality_storage: newPreferences.preferences ? "granted" : "denied",
          personalization_storage: newPreferences.preferences ? "granted" : "denied",
        })
      }

      setIsVisible(false)
    } catch (error) {
      console.error("Error saving cookie preferences:", error)
    }
  }

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    savePreferences(allAccepted)
  }

  const acceptNecessary = () => {
    savePreferences(DEFAULT_PREFERENCES)
  }

  const acceptSelected = () => {
    savePreferences(preferences)
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "necessary") return // Necessary cookies cannot be disabled
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  if (isLoading || !isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("cookieBanner.title") || "Configuración de Cookies"}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {t("cookieBanner.description") ||
              "Utilizamos cookies para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el contenido. Puedes elegir qué tipos de cookies aceptar."}
          </p>

          {showDetails && (
            <div className="space-y-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {t("cookieBanner.necessary") || "Cookies Necesarias"}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("cookieBanner.necessaryDesc") || "Esenciales para el funcionamiento básico del sitio web."}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {t("cookieBanner.required") || "Requeridas"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {t("cookieBanner.analytics") || "Cookies de Análisis"}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("cookieBanner.analyticsDesc") ||
                        "Nos ayudan a entender cómo interactúas con nuestro sitio web."}
                    </p>
                  </div>
                </div>
                <Button
                  variant={preferences.analytics ? "default" : "outline"}
                  size="sm"
                  onClick={() => updatePreference("analytics", !preferences.analytics)}
                  className="min-w-[80px]"
                >
                  {preferences.analytics
                    ? t("cookieBanner.enabled") || "Activado"
                    : t("cookieBanner.disabled") || "Desactivado"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-purple-600" />
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {t("cookieBanner.marketing") || "Cookies de Marketing"}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("cookieBanner.marketingDesc") ||
                        "Utilizadas para mostrar anuncios relevantes y medir su efectividad."}
                    </p>
                  </div>
                </div>
                <Button
                  variant={preferences.marketing ? "default" : "outline"}
                  size="sm"
                  onClick={() => updatePreference("marketing", !preferences.marketing)}
                  className="min-w-[80px]"
                >
                  {preferences.marketing
                    ? t("cookieBanner.enabled") || "Activado"
                    : t("cookieBanner.disabled") || "Desactivado"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4 text-orange-600" />
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {t("cookieBanner.preferences") || "Cookies de Preferencias"}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("cookieBanner.preferencesDesc") ||
                        "Recuerdan tus preferencias y configuraciones personalizadas."}
                    </p>
                  </div>
                </div>
                <Button
                  variant={preferences.preferences ? "default" : "outline"}
                  size="sm"
                  onClick={() => updatePreference("preferences", !preferences.preferences)}
                  className="min-w-[80px]"
                >
                  {preferences.preferences
                    ? t("cookieBanner.enabled") || "Activado"
                    : t("cookieBanner.disabled") || "Desactivado"}
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={acceptAll} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
              {t("cookieBanner.acceptAll") || "Aceptar Todas"}
            </Button>

            {showDetails && (
              <Button onClick={acceptSelected} variant="outline" className="flex-1 bg-transparent">
                {t("cookieBanner.acceptSelected") || "Aceptar Seleccionadas"}
              </Button>
            )}

            <Button onClick={acceptNecessary} variant="outline" className="flex-1 bg-transparent">
              {t("cookieBanner.acceptNecessary") || "Solo Necesarias"}
            </Button>

            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="ghost"
              size="sm"
              className="text-slate-600 dark:text-slate-400"
            >
              <Settings className="h-4 w-4 mr-2" />
              {showDetails
                ? t("cookieBanner.hideDetails") || "Ocultar"
                : t("cookieBanner.showDetails") || "Personalizar"}
            </Button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
            {t("cookieBanner.footer") ||
              "Puedes cambiar tus preferencias en cualquier momento desde la configuración de privacidad."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
