"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CookieBanner } from "@/components/cookie-banner"
import {
  Menu,
  X,
  Calendar,
  Brain,
  Target,
  BarChart3,
  Clock,
  Trophy,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  MapPin,
  Mail,
  Heart,
} from "lucide-react"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-white">FutureTask</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Inicio
                </Link>
                <Link
                  href="#features"
                  className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Características
                </Link>
                <Link
                  href="#pricing"
                  className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Precios
                </Link>
                <Link
                  href="/blog"
                  className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Contacto
                </Link>
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                <Link href="/app">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/app">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Comenzar Gratis</Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/20">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="text-white block px-3 py-2 rounded-md text-base font-medium">
                Inicio
              </Link>
              <Link
                href="#features"
                className="text-white/80 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Características
              </Link>
              <Link
                href="#pricing"
                className="text-white/80 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Precios
              </Link>
              <Link
                href="/blog"
                className="text-white/80 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-white/80 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Contacto
              </Link>
              <div className="pt-4 pb-3 border-t border-white/20">
                <div className="flex items-center px-3 space-x-3">
                  <Link href="/app" className="flex-1">
                    <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/app" className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Comenzar Gratis</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <div className="mx-auto max-w-4xl">
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">🚀 Potenciado por IA</Badge>
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-white sm:text-7xl">
              El Futuro de la{" "}
              <span className="relative whitespace-nowrap text-blue-400">
                <span className="relative">Productividad</span>
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-300">
              Transforma tu forma de trabajar con inteligencia artificial avanzada. Gestiona tareas, optimiza tu tiempo
              y alcanza tus objetivos como nunca antes.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Link href="/app">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg bg-transparent"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 flow-root sm:mt-24">
            <div className="relative rounded-xl bg-slate-900/50 p-2 ring-1 ring-white/10 backdrop-blur-sm">
              <div className="rounded-lg bg-white/5 p-8 shadow-2xl ring-1 ring-white/10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Calendar Widget */}
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        Calendario Inteligente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-blue-500/20 rounded">
                          <span className="text-sm text-white">Reunión con equipo</span>
                          <span className="text-xs text-blue-300">10:00</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-purple-500/20 rounded">
                          <span className="text-sm text-white">Revisión de proyecto</span>
                          <span className="text-xs text-purple-300">14:30</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-500/20 rounded">
                          <span className="text-sm text-white">Sesión de enfoque</span>
                          <span className="text-xs text-green-300">16:00</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tasks Widget */}
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Target className="mr-2 h-5 w-5" />
                        Tareas Pendientes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-white line-through opacity-60">Completar informe</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 border-2 border-white/40 rounded-full" />
                          <span className="text-sm text-white">Preparar presentación</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 border-2 border-white/40 rounded-full" />
                          <span className="text-sm text-white">Revisar documentos</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Analytics Widget */}
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Productividad
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white">Hoy</span>
                          <span className="text-sm text-green-400">+15%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: "75%" }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>6h 30m enfocado</span>
                          <span>Meta: 8h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-400">Características Revolucionarias</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Descubre cómo FutureTask está redefiniendo la productividad personal
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Con tecnología de vanguardia y diseño intuitivo, transformamos la manera en que trabajas y alcanzas tus
              objetivos.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-500">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  Asistente IA Inteligente
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-300">
                  <p className="flex-auto">
                    Tu asistente personal que aprende de tus hábitos y optimiza automáticamente tu flujo de trabajo para
                    maximizar tu productividad.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-500">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  Calendario Inteligente
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-300">
                  <p className="flex-auto">
                    Planificación automática que se adapta a tu energía y prioridades para maximizar tu productividad
                    diaria.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-500">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  Seguimiento de Objetivos
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-300">
                  <p className="flex-auto">
                    Convierte tus sueños en realidad con seguimiento inteligente y recordatorios personalizados que te
                    mantienen enfocado.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-500">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  Análisis Avanzado
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-300">
                  <p className="flex-auto">
                    Insights profundos sobre tu productividad con gráficas interactivas y recomendaciones
                    personalizadas.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-500">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  Pomodoro Inteligente
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-300">
                  <p className="flex-auto">
                    Técnica Pomodoro adaptativa que se ajusta a tu ritmo y tipo de trabajo para máximo enfoque.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-yellow-500">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  Sistema de Logros
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-300">
                  <p className="flex-auto">
                    Gamificación inteligente que te motiva a alcanzar tus metas con recompensas y desafíos
                    personalizados.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-400">Testimonios</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Lo que dicen nuestros usuarios
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4">
                    "FutureTask ha revolucionado mi productividad. La IA realmente entiende mis patrones de trabajo y me
                    ayuda a optimizar mi día."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">MG</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium">María García</p>
                      <p className="text-slate-400 text-sm">Directora de Marketing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4">
                    "Increíble cómo el calendario inteligente organiza automáticamente mis tareas. He aumentado mi
                    productividad un 40%."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">JL</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium">Juan López</p>
                      <p className="text-slate-400 text-sm">Desarrollador Senior</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4">
                    "El sistema de logros me mantiene motivada. Es como un juego, pero para mi vida profesional. ¡Me
                    encanta!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">AR</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium">Ana Rodríguez</p>
                      <p className="text-slate-400 text-sm">Consultora</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-400">Precios</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">Planes Diseñados para Ti</p>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Elige el plan perfecto para tu nivel de productividad. Todos incluyen acceso completo a nuestras
              características principales.
            </p>
          </div>
          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Free Plan */}
            <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Gratuito</CardTitle>
                <CardDescription className="text-slate-300">
                  Perfecto para comenzar tu viaje de productividad
                </CardDescription>
                <div className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">€0</span>
                  <span className="text-sm font-semibold leading-6 text-slate-300">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-300">
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    Hasta 10 tareas por día
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    Calendario básico
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    Pomodoro timer
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    Estadísticas básicas
                  </li>
                </ul>
                <Button className="mt-8 w-full bg-blue-600 hover:bg-blue-700">Comenzar Gratis</Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-white/10 border-blue-500/50 backdrop-blur-sm ring-2 ring-blue-500/20 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                Más Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-white">Premium</CardTitle>
                <CardDescription className="text-slate-300">
                  Para usuarios que buscan mayor productividad
                </CardDescription>
                <div className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">€9</span>
                  <span className="text-sm font-semibold leading-6 text-slate-300">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-300">
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    Tareas ilimitadas
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    IA Assistant básico
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    Calendario inteligente
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    Análisis avanzado
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    Sistema de logros
                  </li>
                </ul>
                <Button className="mt-8 w-full bg-blue-600 hover:bg-blue-700">Elegir Premium</Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Pro</CardTitle>
                <CardDescription className="text-slate-300">
                  Para profesionales que necesitan el máximo rendimiento
                </CardDescription>
                <div className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">€19</span>
                  <span className="text-sm font-semibold leading-6 text-slate-300">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-300">
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    Todo de Premium
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    IA Assistant avanzado
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    Integraciones ilimitadas
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    Soporte prioritario
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-blue-400" />
                    API access
                  </li>
                </ul>
                <Button className="mt-8 w-full bg-blue-600 hover:bg-blue-700">Elegir Pro</Button>
              </CardContent>
            </Card>
          </div>
          <p className="mt-8 text-center text-sm text-slate-400">
            Garantía de devolución de 30 días. Cancela en cualquier momento.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Números que Hablan por Sí Solos
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Miles de profesionales ya confían en FutureTask para maximizar su productividad
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-slate-300">Usuarios Activos</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">50,000+</dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-slate-300">Tareas Completadas</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">2.5M+</dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-slate-300">Tiempo Ahorrado</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">1,200h</dd>
              </div>
              <div className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-slate-300">Satisfacción</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">98%</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <div className="text-slate-300 text-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>support@future-task.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Granada, España</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-white">FutureTask</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              &copy; 2024 FutureTask. Todos los derechos reservados. Hecho con{" "}
              <Heart className="inline h-4 w-4 text-red-500" /> en España.
            </p>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  )
}
