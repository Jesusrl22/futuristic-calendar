"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Cookie, Shield, Settings, BarChart } from "lucide-react"
import Link from "next/link"

export default function CookiesPage() {
  const { t } = useLanguage()

  const cookieTypes = [
    {
      icon: Shield,
      title: "Cookies Esenciales",
      description: "Necesarias para el funcionamiento básico del sitio",
      items: ["Gestión de sesión de usuario", "Preferencias de idioma y tema", "Seguridad y autenticación"],
      required: true,
    },
    {
      icon: BarChart,
      title: "Cookies Analíticas",
      description: "Nos ayudan a entender cómo usas la aplicación",
      items: [
        "Google Analytics para análisis de tráfico",
        "Métricas de uso de funcionalidades",
        "Identificación de errores técnicos",
      ],
      required: false,
    },
    {
      icon: Settings,
      title: "Cookies Funcionales",
      description: "Mejoran tu experiencia personalizada",
      items: ["Recordar tus preferencias", "Configuración del temporizador Pomodoro", "Estado de tareas y notas"],
      required: false,
    },
  ]

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted")
    if (typeof window !== "undefined" && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      })
    }
    alert("✅ Todas las cookies han sido aceptadas")
  }

  const handleRejectAll = () => {
    localStorage.setItem("cookie-consent", "declined")
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      })
    }
    alert("❌ Las cookies no esenciales han sido rechazadas")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Cookie className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Política de Cookies</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Última actualización: Octubre 2024</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>¿Qué son las cookies?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web.
              Nos ayudan a mejorar tu experiencia, recordar tus preferencias y entender cómo usas nuestra aplicación.
            </p>
            <p>
              En <strong>FutureTask</strong>, utilizamos cookies para ofrecerte una experiencia personalizada y mejorar
              continuamente nuestros servicios.
            </p>
          </CardContent>
        </Card>

        {/* Cookie Types */}
        <div className="space-y-4 mb-6">
          {cookieTypes.map((type, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <type.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </div>
                  </div>
                  {type.required && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                      Requeridas
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {type.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className="h-1.5 w-1.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cookie Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gestión de Cookies</CardTitle>
            <CardDescription>Puedes gestionar tus preferencias de cookies en cualquier momento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleAcceptAll} className="flex-1">
                Aceptar todas las cookies
              </Button>
              <Button onClick={handleRejectAll} variant="outline" className="flex-1 bg-transparent">
                Rechazar cookies no esenciales
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              También puedes configurar tu navegador para bloquear o alertarte sobre cookies. Ten en cuenta que algunas
              funcionalidades pueden no estar disponibles si bloqueas todas las cookies.
            </p>
          </CardContent>
        </Card>

        {/* Third Party Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cookies de Terceros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">Google Analytics</h3>
              <p className="text-sm">
                Utilizamos Google Analytics para analizar el uso de nuestra aplicación. Google Analytics establece
                cookies para ayudarnos a entender cómo los usuarios interactúan con nuestro sitio.
              </p>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-block mt-2"
              >
                Ver política de privacidad de Google →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>¿Tienes preguntas?</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 dark:text-gray-300">
            <p className="mb-4">
              Si tienes alguna pregunta sobre nuestra política de cookies, no dudes en contactarnos.
            </p>
            <Link href="/contact">
              <Button variant="outline">Contáctanos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
