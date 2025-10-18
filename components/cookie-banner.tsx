"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-gray-600 dark:text-gray-300">
          <p>
            Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestro uso de cookies.{" "}
            <a href="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline">
              Más información
            </a>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={declineCookies} variant="outline" size="sm">
            Rechazar
          </Button>
          <Button onClick={acceptCookies} size="sm">
            Aceptar
          </Button>
          <Button onClick={declineCookies} variant="ghost" size="icon" className="ml-2">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
