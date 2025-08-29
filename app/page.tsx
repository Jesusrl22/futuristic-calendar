"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Types
interface User {
  id: string
  name: string
  email: string
  language: "es" | "en" | "de" | "fr" | "it"
  theme: string
  isPremium: boolean
  onboardingCompleted: boolean
}

// Translations
const translations = {
  es: {
    appName: "FutureTask",
    appDescription: "Tu calendario inteligente del futuro",
    welcome: "¡Bienvenido a FutureTask!",
    start: "Comenzar",
    dashboard: "Dashboard",
    loading: "Cargando aplicación...",
  },
  en: {
    appName: "FutureTask",
    appDescription: "Your intelligent calendar of the future",
    welcome: "Welcome to FutureTask!",
    start: "Start",
    dashboard: "Dashboard",
    loading: "Loading application...",
  },
}

export default function FutureTaskApp() {
  const [user, setUser] = useState<User | null>(null)
  const [language, setLanguage] = useState<"es" | "en">("es")
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "app">("welcome")
  const [isLoading, setIsLoading] = useState(true)

  const t = (key: string) => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  // Load user data only once on mount
  useEffect(() => {
    let mounted = true

    const loadUserData = () => {
      try {
        const savedUser = localStorage.getItem("futureTask_user")

        if (mounted) {
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser)
            setUser(parsedUser)
            setLanguage(parsedUser.language || "es")
            setCurrentScreen(parsedUser.onboardingCompleted ? "app" : "welcome")
          }
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    // Small delay to prevent hydration issues
    const timer = setTimeout(loadUserData, 100)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, []) // Empty dependency array - runs only once

  const handleStart = () => {
    setCurrentScreen("app")
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    )
  }

  // Welcome screen
  if (currentScreen === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

        <Card className="w-full max-w-md bg-black/20 backdrop-blur-xl border-purple-500/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
              <img src="/logo.png" alt="FutureTask" className="w-10 h-10 rounded-full" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {t("appName")}
            </CardTitle>
            <CardDescription className="text-gray-300">{t("appDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">{t("welcome")}</h2>
              <p className="text-gray-300 mb-6">
                Tu calendario inteligente del futuro te ayudará a ser más productivo que nunca.
              </p>
            </div>

            <Button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-white font-semibold py-3"
            >
              {t("start")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main app screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <img src="/logo.png" alt="FutureTask" className="w-8 h-8 rounded-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {t("appName")}
              </h1>
              <p className="text-gray-300">
                {user ? `Bienvenido, ${user.name}` : "Bienvenido a tu calendario del futuro"}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setCurrentScreen("welcome")}
            variant="outline"
            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
          >
            Volver al inicio
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 text-sm">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Completadas Hoy</p>
                  <p className="text-xl font-bold text-white">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 text-sm">📋</span>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Hoy</p>
                  <p className="text-xl font-bold text-white">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <span className="text-orange-400 text-sm">🔥</span>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Racha</p>
                  <p className="text-xl font-bold text-white">0 días</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <span className="text-yellow-400 text-sm">🏆</span>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Logros</p>
                  <p className="text-xl font-bold text-white">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <span>📅</span>
                <span>Calendario</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-400 text-2xl">📅</span>
                </div>
                <p className="text-white font-semibold mb-2">Calendario Inteligente</p>
                <p className="text-gray-300 text-sm">
                  Organiza tus tareas por fechas y mantén el control de tu productividad.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <span>✅</span>
                <span>Tareas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-400 text-2xl">✅</span>
                </div>
                <p className="text-white font-semibold mb-2">Gestión de Tareas</p>
                <p className="text-gray-300 text-sm">Crea, organiza y completa tareas con categorías y prioridades.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">¡Aplicación cargada correctamente! 🚀</h3>
            <p className="text-gray-300">
              El sistema completo de FutureTask se está inicializando. Todas las funcionalidades estarán disponibles
              próximamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
