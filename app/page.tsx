import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calendar,
  Sparkles,
  TrendingUp,
  Zap,
  CheckCircle2,
  Users,
  Globe,
  Clock,
  Target,
  Shield,
  Menu,
} from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FutureTask</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/blog" className="text-gray-300 hover:text-white transition">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition">
                Contacto
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white transition">
                Privacidad
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white transition">
                Términos
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <LanguageSelector variant="button" showName={false} className="hidden sm:block" />
              <Link href="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                  Iniciar Sesión
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            <div className="flex justify-center animate-float">
              <div className="p-4 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-2xl shadow-2xl">
                <Sparkles className="h-16 w-16 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight animate-fade-in">
              El Futuro de la
              <br />
              <span className="text-gradient">Productividad con IA</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-in">
              Organiza tu vida, potencia tu trabajo y alcanza tus objetivos con la ayuda de la inteligencia artificial
              más avanzada
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Link href="/login">
                <Button
                  size="lg"
                  className="btn-futuristic bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 text-lg shadow-xl"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Comienza Gratis
                </Button>
              </Link>
              <Link href="/blog">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-400 text-purple-300 hover:bg-purple-900/50 hover:text-white px-8 py-6 text-lg bg-transparent backdrop-blur-sm"
                >
                  Ver Blog
                </Button>
              </Link>
            </div>

            <div className="flex justify-center items-center gap-8 text-gray-400 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Configuración en 2 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Plan gratuito para siempre</span>
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
            <Card className="glass-effect neon-glow card-hover border-purple-500/20">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Calendario Inteligente</h3>
                <p className="text-gray-300">
                  Visualiza y organiza todas tus tareas, eventos y proyectos en un calendario intuitivo con sugerencias
                  de IA
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect neon-glow card-hover border-cyan-500/20">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Asistente IA Avanzado</h3>
                <p className="text-gray-300">
                  Obtén sugerencias inteligentes, planifica tu día automáticamente y recibe recomendaciones
                  personalizadas
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect neon-glow card-hover border-green-500/20">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Análisis de Productividad</h3>
                <p className="text-gray-300">
                  Estadísticas detalladas, seguimiento de logros y visualización de tu progreso para mejorar
                  continuamente
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect neon-glow card-hover border-yellow-500/20">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Modo Pomodoro</h3>
                <p className="text-gray-300">
                  Mejora tu concentración con timer Pomodoro integrado, estadísticas de sesiones y música de enfoque
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect neon-glow card-hover border-pink-500/20">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Sistema de Logros</h3>
                <p className="text-gray-300">
                  Gana medallas y desbloquea logros mientras cumples tus objetivos y mejoras tu productividad
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect neon-glow card-hover border-indigo-500/20">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Multi-idioma</h3>
                <p className="text-gray-300">
                  Disponible en español, inglés, francés, alemán, italiano y portugués para trabajar en tu lengua
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">¿Por qué elegir FutureTask?</h2>
            <p className="text-xl text-gray-400">La plataforma de productividad más completa y avanzada</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-effect border-purple-500/20 p-6">
              <CardContent className="flex gap-4 p-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">100% Seguro y Privado</h3>
                  <p className="text-gray-300">
                    Tus datos están encriptados y protegidos con los más altos estándares de seguridad
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-cyan-500/20 p-6">
              <CardContent className="flex gap-4 p-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Colaboración en Equipo</h3>
                  <p className="text-gray-300">
                    Comparte proyectos y trabaja en equipo de manera eficiente con sincronización en tiempo real
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-yellow-500/20 p-6">
              <CardContent className="flex gap-4 p-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Rápido y Eficiente</h3>
                  <p className="text-gray-300">
                    Interfaz optimizada y fluida para máxima velocidad y productividad sin interrupciones
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-green-500/20 p-6">
              <CardContent className="flex gap-4 p-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">IA de Última Generación</h3>
                  <p className="text-gray-300">
                    Tecnología de inteligencia artificial avanzada para optimizar tu tiempo y decisiones diarias
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-effect border-purple-500/30 neon-glow">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold text-white">¿Listo para transformar tu productividad?</h2>
              <p className="text-xl text-gray-300">
                Únete a miles de usuarios que ya están alcanzando sus objetivos con FutureTask
              </p>
              <Link href="/login">
                <Button
                  size="lg"
                  className="btn-futuristic bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-12 py-6 text-lg font-semibold shadow-2xl"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Comenzar Ahora - Es Gratis
                </Button>
              </Link>
              <p className="text-sm text-gray-400">No se requiere tarjeta de crédito • Configuración instantánea</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FutureTask</span>
              </div>
              <p className="text-gray-400 text-sm">
                El futuro de la productividad con IA. Organiza tu vida, potencia tu trabajo y alcanza tus objetivos.
              </p>
              <div className="flex gap-2">
                <LanguageSelector variant="select" showFlag={true} showName={false} className="w-32" />
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-purple-400 transition text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-purple-400 transition text-sm">
                    Comenzar
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition text-sm">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition text-sm">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition text-sm">
                    Términos de Servicio
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-purple-400 transition text-sm">
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <p className="text-gray-400 text-sm">FutureTask Inc.</p>
                </li>
                <li>
                  <p className="text-gray-400 text-sm">© 2025 Todos los derechos reservados</p>
                </li>
                <li>
                  <a
                    href="mailto:info@future-task.com"
                    className="text-gray-400 hover:text-purple-400 transition text-sm"
                  >
                    info@future-task.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-purple-500/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <p>© 2025 FutureTask. Todos los derechos reservados.</p>
              <div className="flex gap-6">
                <Link href="/privacy" className="hover:text-white transition">
                  Privacidad
                </Link>
                <Link href="/terms" className="hover:text-white transition">
                  Términos
                </Link>
                <Link href="/cookies" className="hover:text-white transition">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
