import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Sparkles, TrendingUp, Zap, CheckCircle2, Users, Globe } from "lucide-react"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { CookieBanner } from "@/components/cookie-banner"

export default function Home() {
  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <CookieBanner />

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="p-4 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl">
                  <Sparkles className="h-16 w-16 text-white" />
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                El Futuro de la
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Productividad con IA
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Organiza tu vida, potencia tu trabajo y alcanza tus objetivos con la ayuda de la inteligencia artificial
                más avanzada
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Comienza Gratis
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-purple-400 text-white hover:bg-purple-900/50 px-8 py-6 text-lg bg-transparent"
                  >
                    Ver Blog
                  </Button>
                </Link>
              </div>

              <div className="flex justify-center items-center gap-8 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Configuración en 2 minutos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Todo lo que necesitas para ser más productivo</h2>
              <p className="text-xl text-gray-400">Herramientas potenciadas por IA para maximizar tu eficiencia</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Calendario Inteligente</h3>
                  <p className="text-gray-400">
                    Visualiza y organiza todas tus tareas, eventos y proyectos en un calendario intuitivo con
                    sugerencias de IA
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-blue-500/20 backdrop-blur">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Asistente IA Avanzado</h3>
                  <p className="text-gray-400">
                    Obtén sugerencias inteligentes, planifica tu día automáticamente y recibe recomendaciones
                    personalizadas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-green-500/20 backdrop-blur">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Análisis de Productividad</h3>
                  <p className="text-gray-400">
                    Estadísticas detalladas, seguimiento de logros y visualización de tu progreso para mejorar
                    continuamente
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-yellow-500/20 backdrop-blur">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Modo Pomodoro</h3>
                  <p className="text-gray-400">
                    Mejora tu concentración con timer Pomodoro integrado, estadísticas de sesiones y música de enfoque
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-pink-500/20 backdrop-blur">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Gestión de Equipos</h3>
                  <p className="text-gray-400">
                    Colabora con tu equipo, comparte tareas y sincroniza calendarios para trabajar juntos eficientemente
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-indigo-500/20 backdrop-blur">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                    <Globe className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Multi-idioma</h3>
                  <p className="text-gray-400">
                    Disponible en español, inglés y más idiomas para que trabajes en tu lengua preferida
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 backdrop-blur">
              <CardContent className="p-12 text-center space-y-6">
                <h2 className="text-4xl font-bold text-white">¿Listo para transformar tu productividad?</h2>
                <p className="text-xl text-gray-300">
                  Únete a miles de usuarios que ya están alcanzando sus objetivos con FutureTask
                </p>
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Comenzar Ahora - Es Gratis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                  <span className="text-xl font-bold text-white">FutureTask</span>
                </div>
                <p className="text-gray-400 text-sm">El futuro de la productividad con IA</p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Producto</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/blog" className="text-gray-400 hover:text-white transition">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="text-gray-400 hover:text-white transition">
                      Comenzar
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Empresa</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/contact" className="text-gray-400 hover:text-white transition">
                      Contacto
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                      Privacidad
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-400 hover:text-white transition">
                      Términos
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Síguenos</h3>
                <p className="text-gray-400 text-sm">Mantente al día con las últimas actualizaciones</p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
              <p>&copy; 2025 FutureTask. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </AnalyticsProvider>
  )
}
