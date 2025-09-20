"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  CheckCircle,
  Brain,
  Zap,
  Star,
  ArrowRight,
  Play,
  Mail,
  MapPin,
  ChevronRight,
  BarChart3,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/useLanguage"

export default function HomePage() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-blue-500" />,
      title: "Calendario Inteligente",
      description: "Organiza tu tiempo con IA que aprende de tus patrones y optimiza tu agenda automáticamente.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Gestión de Tareas",
      description: "Crea, organiza y completa tareas con recordatorios inteligentes y priorización automática.",
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Asistente IA",
      description: "Tu asistente personal que te ayuda a planificar, recordar y optimizar tu productividad.",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Automatización",
      description: "Automatiza tareas repetitivas y enfócate en lo que realmente importa.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-red-500" />,
      title: "Analytics Avanzados",
      description: "Analiza tu productividad con métricas detalladas y reportes personalizados.",
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-500" />,
      title: "Seguridad Total",
      description: "Tus datos están protegidos con encriptación de nivel empresarial y backups automáticos.",
    },
  ]

  const testimonials = [
    {
      name: "María González",
      role: "Directora de Marketing",
      image: "/professional-woman-diverse.png",
      content:
        "FutureTask ha revolucionado mi forma de trabajar. La IA realmente entiende mis patrones y me ayuda a ser más productiva.",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      role: "Emprendedor",
      image: "/professional-man.png",
      content: "Increíble cómo la plataforma se adapta a mi estilo de trabajo. He aumentado mi productividad un 40%.",
      rating: 5,
    },
    {
      name: "Ana Martín",
      role: "Consultora",
      image: "/confident-business-woman.png",
      content:
        "La mejor inversión que he hecho para mi productividad. El asistente IA es como tener un secretario personal.",
      rating: 5,
    },
  ]

  const stats = [
    { number: "50K+", label: "Usuarios Activos" },
    { number: "2M+", label: "Tareas Completadas" },
    { number: "98%", label: "Satisfacción" },
    { number: "40%", label: "Aumento Productividad" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FutureTask
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Características
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonios
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/app">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/app">Comenzar Gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit mx-auto">
                🚀 Nuevo: IA Generativa Integrada
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Organiza tu vida con{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Inteligencia Artificial
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                La plataforma de productividad más avanzada del 2025. Gestiona tareas, calendario y notas con el poder
                de la IA que aprende de ti.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/app">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Dashboard Preview */}
            <div className="relative mt-16">
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Calendar className="h-8 w-8 text-blue-600" />
                          <Badge variant="secondary" className="text-xs">
                            Hoy
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Calendario Inteligente</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">8 eventos programados</p>
                        <div className="mt-3 space-y-2">
                          <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                          </div>
                          <p className="text-xs text-blue-600 dark:text-blue-400">75% del día planificado</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                          <Badge variant="secondary" className="text-xs">
                            +3
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Tareas Completadas</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">12 de 15 tareas</p>
                        <div className="mt-3 space-y-2">
                          <div className="h-2 bg-green-200 dark:bg-green-700 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full w-4/5"></div>
                          </div>
                          <p className="text-xs text-green-600 dark:text-green-400">80% completado</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Brain className="h-8 w-8 text-purple-600" />
                          <Badge variant="secondary" className="text-xs">
                            IA
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Asistente IA</h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300">5 sugerencias nuevas</p>
                        <div className="mt-3 space-y-2">
                          <div className="h-2 bg-purple-200 dark:bg-purple-700 rounded-full">
                            <div className="h-2 bg-purple-500 rounded-full w-3/5"></div>
                          </div>
                          <p className="text-xs text-purple-600 dark:text-purple-400">Optimizando tu día</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background/50">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto">
              ✨ Características
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold">Todo lo que necesitas para ser más productivo</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Herramientas inteligentes que se adaptan a tu forma de trabajar y te ayudan a alcanzar tus objetivos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto">
              💬 Testimonios
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold">Lo que dicen nuestros usuarios</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Miles de profesionales ya han transformado su productividad con FutureTask.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-white">¿Listo para revolucionar tu productividad?</h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Únete a miles de profesionales que ya han transformado su forma de trabajar con FutureTask.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <Link href="/app">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Ver Precios
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FutureTask</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                La plataforma de productividad más avanzada del 2025. Organiza tu vida con inteligencia artificial.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="/app" className="hover:text-white transition-colors">
                    Aplicación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Ayuda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Comunidad
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@future-task.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Granada, España</span>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors flex items-center space-x-1">
                    <span>Página de contacto</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">© 2025 FutureTask. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                Términos
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
