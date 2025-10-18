"use client"

import { useState, useEffect } from "react"
import { X, Cookie } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    setTimeout(() => {
      const consent = localStorage.getItem("cookie-consent")
      if (!consent) {
        setShowBanner(true)
      }
    }, 1000)
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      })
    }
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      })
    }
    setShowBanner(false)
  }

  if (!isClient || !showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-3xl">
              <Cookie className="w-8 h-8 text-amber-600 dark:text-amber-500" />
            </div>

            <div className="flex-1 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🍪 Usamos cookies</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Utilizamos cookies esenciales para el funcionamiento del sitio y cookies de análisis para mejorar tu
                experiencia. Puedes aceptar todas o solo las esenciales.{" "}
                <Link href="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Más información
                </Link>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleAccept}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Aceptar todas
                </Button>
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  className="border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium bg-transparent"
                >
                  Solo esenciales
                </Button>
              </div>
            </div>

            <button
              onClick={handleDecline}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
