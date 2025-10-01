"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Cookie, Shield, Settings } from "lucide-react"

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookie-consent")
    if (!cookieConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "all")
    setIsVisible(false)
    // Enable all tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      })
    }
  }

  const handleAcceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary")
    setIsVisible(false)
    // Only enable necessary cookies
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      })
    }
  }

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected")
    setIsVisible(false)
    // Disable all non-necessary tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      })
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl border-purple-500/20 bg-slate-900/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">🍪 Política de Cookies</h3>
              <p className="text-gray-300 text-sm mb-4">
                Utilizamos cookies para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el
                contenido. Puedes elegir qué tipos de cookies aceptar.
              </p>

              {showDetails && (
                <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium text-purple-300 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Cookies Necesarias
                      </h4>
                      <p className="text-gray-400 mt-1">
                        Esenciales para el funcionamiento básico del sitio. Incluyen autenticación, preferencias de tema
                        y funcionalidad básica.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-300">Cookies de Análisis</h4>
                      <p className="text-gray-400 mt-1">
                        Nos ayudan a entender cómo interactúas con nuestro sitio mediante Google Analytics. Información
                        anónima sobre páginas visitadas y tiempo de permanencia.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-300">Cookies de Marketing</h4>
                      <p className="text-gray-400 mt-1">
                        Utilizadas para mostrar anuncios relevantes y medir la efectividad de nuestras campañas
                        publicitarias.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleAcceptAll} className="bg-purple-600 hover:bg-purple-700">
                  Aceptar Todas
                </Button>
                <Button
                  onClick={handleAcceptNecessary}
                  variant="outline"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                >
                  Solo Necesarias
                </Button>
                <Button onClick={handleReject} variant="ghost" className="text-gray-400 hover:text-white">
                  Rechazar
                </Button>
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {showDetails ? "Ocultar" : "Detalles"}
                </Button>
              </div>
            </div>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
