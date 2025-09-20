"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/hooks/useLanguage"
import { X, Settings, Shield, BarChart3, Target, Palette } from "lucide-react"

export function CookieBanner() {
  const { t } = useLanguage()
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent")
    if (!cookieConsent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 2000)
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(cookieConsent)
        setPreferences(savedPreferences)
      } catch (error) {
        console.warn("Error parsing cookie preferences:", error)
      }
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    setPreferences(allAccepted)
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted))
    setShowBanner(false)
    setShowSettings(false)

    // Enable Google Analytics if accepted
    if (allAccepted.analytics && typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      })
    }
  }

  const handleDeclineAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
    setPreferences(onlyNecessary)
    localStorage.setItem("cookieConsent", JSON.stringify(onlyNecessary))
    setShowBanner(false)
    setShowSettings(false)

    // Disable Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      })
    }
  }

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences))
    setShowBanner(false)
    setShowSettings(false)

    // Update Google Analytics consent
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: preferences.analytics ? "granted" : "denied",
        ad_storage: preferences.marketing ? "granted" : "denied",
      })
    }
  }

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    if (key === "necessary") return // Can't disable necessary cookies
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-in-up">
        <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Configuración de Cookies</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestro uso de
                  cookies.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleAcceptAll}
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1 transition-all duration-300 hover:scale-105"
              >
                Aceptar Todas
              </Button>
              <Button
                onClick={() => setShowSettings(true)}
                variant="outline"
                className="flex-1 transition-all duration-300 hover:scale-105"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
              <Button
                onClick={handleDeclineAll}
                variant="ghost"
                className="flex-1 transition-all duration-300 hover:scale-105"
              >
                Rechazar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white dark:bg-slate-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Configuración de Cookies</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Gestiona tus preferencias de cookies a continuación. Puedes habilitar o deshabilitar diferentes tipos de
                cookies según tus preferencias.
              </p>

              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">Cookies Necesarias</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        >
                          Siempre activas
                        </Badge>
                        <Switch checked={true} disabled />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Estas cookies son esenciales para el funcionamiento del sitio web y no se pueden desactivar.
                    </p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">Cookies de Análisis</h3>
                      <Switch
                        checked={preferences.analytics}
                        onCheckedChange={(checked) => updatePreference("analytics", checked)}
                      />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web recopilando y
                      reportando información de forma anónima.
                    </p>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">Cookies de Marketing</h3>
                      <Switch
                        checked={preferences.marketing}
                        onCheckedChange={(checked) => updatePreference("marketing", checked)}
                      />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Se utilizan para rastrear visitantes en sitios web con fines publicitarios y mostrar anuncios
                      relevantes.
                    </p>
                  </div>
                </div>

                {/* Preference Cookies */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Palette className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">Cookies de Preferencias</h3>
                      <Switch
                        checked={preferences.preferences}
                        onCheckedChange={(checked) => updatePreference("preferences", checked)}
                      />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Recuerdan tus preferencias y configuraciones para personalizar tu experiencia.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button
                  onClick={handleSavePreferences}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1 transition-all duration-300 hover:scale-105"
                >
                  Guardar Preferencias
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="flex-1 transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  Aceptar Todas
                </Button>
                <Button
                  onClick={handleDeclineAll}
                  variant="ghost"
                  className="flex-1 transition-all duration-300 hover:scale-105"
                >
                  Solo Necesarias
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
