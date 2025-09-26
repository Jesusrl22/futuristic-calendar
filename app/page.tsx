"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/hooks/useLanguage"
import {
  Calendar,
  Brain,
  Target,
  BarChart3,
  Clock,
  Trophy,
  ArrowRight,
  CheckCircle,
  Zap,
  Users,
  TrendingUp,
  Sparkles,
  Play,
  Menu,
  X,
  ChevronRight,
  Mail,
  MapPin,
  Heart,
  Star,
  Crown,
  Shield,
  Eye,
  MessageCircle,
  BookOpen,
  Rocket,
  Coffee,
} from "lucide-react"

export default function HomePage() {
  const { t, mounted } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("tasks")
  const [isYearly, setIsYearly] = useState(false)

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">{t("loading")}</div>
      </div>
    )
  }

  const features = [
    {
      icon: Brain,
      title: t("aiAssistant") || "Asistente IA",
      description:
        t("aiAssistantDesc") ||
        "Inteligencia artificial que aprende de tus patrones y te ayuda a optimizar tu productividad",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: t("smartCalendar") || "Calendario Inteligente",
      description:
        t("smartCalendarDesc") ||
        "Organización automática de tareas con predicción de tiempo y optimización de horarios",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Target,
      title: t("taskManagement") || "Gestión de Tareas",
      description:
        t("taskManagementDesc") || "Sistema avanzado de tareas con categorías, prioridades y seguimiento automático",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: t("analytics") || "Análisis Avanzado",
      description:
        t("analyticsDesc") || "Métricas detalladas de productividad con insights personalizados y recomendaciones",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Clock,
      title: "Técnica Pomodoro",
      description: "Maximiza tu concentración con sesiones de trabajo estructuradas y descansos inteligentes.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Trophy,
      title: "Sistema de Logros",
      description: "Mantén la motivación alta con un sistema de gamificación que celebra tus éxitos diarios.",
      color: "from-yellow-500 to-orange-500",
    },
  ]

  const plans = [
    {
      name: t("free") || "Gratuito",
      price: { monthly: 0, yearly: 0 },
      description: "Perfecto para empezar tu viaje de productividad",
      features: [
        "Tareas básicas ilimitadas",
        "Calendario básico",
        "Pomodoro básico (25/5/15 min)",
        "Temas básicos (claro/oscuro)",
        "Logros e insignias básicas",
        "Sincronización en la nube",
        "Soporte por email",
      ],
      limitations: ["Sin lista de deseos", "Sin asistente IA", "Sin análisis avanzado"],
      cta: t("startFree") || "Comenzar Gratis",
      popular: false,
      color: "border-white/20",
      icon: Star,
    },
    {
      name: t("premium") || "Premium",
      price: { monthly: 1.99, yearly: 20 },
      description: "Para usuarios que buscan maximizar su potencial",
      features: [
        "Todo de Gratuito",
        "Tareas avanzadas ilimitadas",
        "Calendario inteligente",
        "Lista de deseos completa",
        "4 temas premium adicionales",
        "Notificaciones inteligentes",
        "Categorías y etiquetas avanzadas",
        "Exportar datos",
        "Soporte prioritario",
      ],
      limitations: ["Sin asistente IA", "Sin créditos IA"],
      cta: t("choosePlan") || "Elegir Plan",
      popular: true,
      color: "border-blue-500 shadow-lg shadow-blue-500/20",
      badge: t("mostPopular") || "Más Popular",
      icon: Crown,
      savings: isYearly ? "Ahorra €3.88 al año" : null,
    },
    {
      name: t("pro") || "Pro",
      price: { monthly: 4.99, yearly: 45 },
      description: "Para profesionales y equipos que necesitan lo mejor",
      features: [
        "Todo de Premium",
        "Asistente IA completo",
        "1000 créditos IA/mes",
        "4 temas futuristas exclusivos",
        "Análisis predictivo avanzado",
        "Colaboración en equipo",
        "API personalizada",
        "Integraciones avanzadas",
        "Soporte 24/7 prioritario",
      ],
      limitations: [],
      cta: t("choosePlan") || "Elegir Plan",
      popular: false,
      color: "border-purple-500 shadow-lg shadow-purple-500/20",
      badge: "Máximo Poder",
      icon: Zap,
      savings: isYearly ? "Ahorra €14.88 al año" : null,
      bonus: isYearly ? "1000 créditos IA bonus" : null,
    },
  ]

  const blogPosts = [
    {
      id: "productividad-2025",
      title: "10 Estrategias para Maximizar tu Productividad en 2025",
      excerpt:
        "Descubre las técnicas más efectivas respaldadas por la ciencia para optimizar tu tiempo, aumentar tu concentración y alcanzar tus objetivos más ambiciosos este año.",
      author: "Elena Martínez",
      authorRole: "Experta en Productividad",
      date: "15 Ene 2025",
      readTime: "12 min",
      category: "Productividad",
      image: "/productivity-workspace-2025.jpg",
      views: 2847,
      likes: 156,
      comments: 23,
      featured: true,
      tags: ["productividad", "estrategias", "2025", "optimización"],
    },
    {
      id: "futuro-trabajo-remoto",
      title: "El Futuro del Trabajo Remoto: Cómo la IA está Transformando Equipos",
      excerpt:
        "Explora cómo la inteligencia artificial está revolucionando la colaboración, comunicación y gestión de equipos distribuidos globalmente, creando nuevas oportunidades de crecimiento.",
      author: "Carlos Rodríguez",
      authorRole: "Consultor en Transformación Digital",
      date: "12 Ene 2025",
      readTime: "15 min",
      category: "Tecnología",
      image: "/remote-work-ai-technology.jpg",
      views: 1923,
      likes: 89,
      comments: 17,
      featured: true,
      tags: ["trabajo remoto", "IA", "equipos", "futuro"],
    },
    {
      id: "organizacion-digital-2025",
      title: "Organización Personal en la Era Digital: Guía Completa 2025",
      excerpt:
        "Una guía paso a paso para dominar el caos digital, organizar tu vida personal y profesional, y crear sistemas que realmente funcionen en el mundo hiperconectado actual.",
      author: "Ana López",
      authorRole: "Especialista en Organización Digital",
      date: "10 Ene 2025",
      readTime: "10 min",
      category: "Organización",
      image: "/digital-organization-planning.jpg",
      views: 2200,
      likes: 120,
      comments: 15,
      featured: true,
      tags: ["organización", "digital", "sistemas", "productividad"],
    },
  ]

  const demoTasks = [
    {
      id: 1,
      title: t("demoTask1") || "Completar presentación Q1",
      description: t("demoTask1Desc") || "Finalizar slides y preparar datos financieros",
      completed: true,
      priority: "high",
      category: "trabajo",
      time: "09:00",
    },
    {
      id: 2,
      title: t("demoTask2") || "Revisar propuesta de cliente",
      description: t("demoTask2Desc") || "Analizar requerimientos y presupuesto",
      completed: false,
      priority: "high",
      category: "trabajo",
      time: "11:30",
    },
    {
      id: 3,
      title: t("demoTask3") || "Sesión de ejercicio",
      description: t("demoTask3Desc") || "Cardio 30 min + fuerza",
      completed: false,
      priority: "medium",
      category: "salud",
      time: "18:00",
    },
    {
      id: 4,
      title: t("demoTask4") || "Planificar sprint siguiente",
      description: t("demoTask4Desc") || "Definir objetivos y asignar tareas",
      completed: false,
      priority: "medium",
      category: "trabajo",
      time: "15:00",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    FutureTask
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="#features" className="text-white hover:text-blue-300 transition-colors">
                  {t("features") || "Características"}
                </Link>
                <Link href="#pricing" className="text-white hover:text-blue-300 transition-colors">
                  {t("pricing") || "Precios"}
                </Link>
                <Link href="/blog" className="text-white hover:text-blue-300 transition-colors">
                  {t("blog") || "Blog"}
                </Link>
                <Link href="/contact" className="text-white hover:text-blue-300 transition-colors">
                  Contacto
                </Link>
              </div>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSelector />
              <Link href="/login">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  {t("login") || "Iniciar Sesión"}
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  {t("getStarted") || "Comenzar"}
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-blue-300 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="#features"
                className="block px-3 py-2 text-white hover:text-blue-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("features") || "Características"}
              </Link>
              <Link
                href="#pricing"
                className="block px-3 py-2 text-white hover:text-blue-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("pricing") || "Precios"}
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 text-white hover:text-blue-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("blog") || "Blog"}
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-white hover:text-blue-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <div className="px-3 py-2">
                <LanguageSelector />
              </div>
              <div className="px-3 py-2 space-y-2">
                <Link href="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    {t("login") || "Iniciar Sesión"}
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    {t("getStarted") || "Comenzar"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
              <span className="text-sm font-medium">Revoluciona tu productividad con IA</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              El Futuro de la{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Productividad
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Organiza tu vida, potencia tu trabajo y alcanza tus objetivos con la ayuda de la inteligencia artificial
              más avanzada
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  {t("startFree") || "Comenzar Gratis"}
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
              >
                <Play className="h-5 w-5 mr-2" />
                {t("watchDemo") || "Ver Demo"}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">50,000+</div>
                <div className="text-slate-400 text-sm">Usuarios Activos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">2.5M+</div>
                <div className="text-slate-400 text-sm">Tareas Completadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-slate-400 text-sm">Satisfacción</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">40%</div>
                <div className="text-slate-400 text-sm">Aumento Productividad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Experimenta el Futuro de la Productividad
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Interactúa con nuestra demo en vivo y descubre cómo FutureTask puede transformar tu forma de trabajar
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 md:p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm border border-white/20">
                <TabsTrigger
                  value="tasks"
                  className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500 text-white"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Tareas
                </TabsTrigger>
                <TabsTrigger
                  value="calendar"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 data-[state=active]:border-purple-500 text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendario
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:border-green-500 text-white"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Análisis
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-500 text-white"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  IA
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="mt-6">
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Gestión Inteligente de Tareas</h3>
                  <div className="space-y-3">
                    {demoTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/15 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              task.completed
                                ? "bg-green-500 border-green-500"
                                : "border-slate-400 hover:border-blue-500"
                            }`}
                          >
                            {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <span
                              className={`block font-medium ${
                                task.completed ? "line-through text-slate-500" : "text-white"
                              }`}
                            >
                              {task.title}
                            </span>
                            <span className="text-sm text-slate-400">{task.description}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              task.priority === "high"
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : task.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                  : "bg-green-500/20 text-green-300 border-green-500/30"
                            }
                          >
                            {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                          </Badge>
                          <span className="text-sm text-slate-400">{task.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      💡 <strong>Sugerencia IA:</strong> Programa las tareas de alta prioridad en tu horario de máxima
                      energía (9:00-11:00 AM)
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="mt-6">
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Calendario Inteligente</h3>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                      <div key={day} className="text-center text-slate-400 font-medium p-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors cursor-pointer ${
                          i === 15
                            ? "bg-blue-500 text-white"
                            : i === 22
                              ? "bg-purple-500/30 text-purple-300"
                              : i === 28
                                ? "bg-green-500/30 text-green-300"
                                : i === 8
                                  ? "bg-orange-500/30 text-orange-300"
                                  : "text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {i + 1 <= 31 ? i + 1 : ""}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-white">Reunión de equipo</span>
                      </div>
                      <span className="text-slate-400">10:00 - 11:00</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-white">Sesión de enfoque</span>
                      </div>
                      <span className="text-slate-400">14:00 - 16:00</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-white">Revisión de proyecto</span>
                      </div>
                      <span className="text-slate-400">16:30 - 17:30</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Análisis de Productividad</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">Tareas Completadas</span>
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">87%</div>
                      <Progress value={87} className="mt-2" />
                      <p className="text-xs text-green-400 mt-1">+12% vs semana anterior</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">Tiempo Enfocado</span>
                        <Clock className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">6.2h</div>
                      <Progress value={78} className="mt-2" />
                      <p className="text-xs text-blue-400 mt-1">Promedio diario</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">Objetivos Alcanzados</span>
                        <Trophy className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">12/15</div>
                      <Progress value={80} className="mt-2" />
                      <p className="text-xs text-yellow-400 mt-1">Meta mensual</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <h4 className="text-white font-medium mb-3">Productividad Semanal</h4>
                    <div className="space-y-2">
                      {[
                        { day: "Lun", value: 85, color: "bg-blue-500" },
                        { day: "Mar", value: 92, color: "bg-green-500" },
                        { day: "Mié", value: 78, color: "bg-yellow-500" },
                        { day: "Jue", value: 95, color: "bg-purple-500" },
                        { day: "Vie", value: 88, color: "bg-pink-500" },
                        { day: "Sáb", value: 45, color: "bg-orange-500" },
                        { day: "Dom", value: 30, color: "bg-red-500" },
                      ].map((item) => (
                        <div key={item.day} className="flex items-center space-x-3">
                          <div className="w-8 text-sm text-slate-400">{item.day}</div>
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <div
                              className={`${item.color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                          <div className="w-8 text-sm font-medium text-white">{item.value}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-6">
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Asistente IA</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Brain className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white mb-2">
                            <strong>Recomendación IA:</strong> Basándome en tu patrón de trabajo, te sugiero programar
                            las tareas más complejas entre las 9:00 y 11:00 AM, cuando tu concentración es máxima.
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
                            >
                              Aplicar sugerencia
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                            >
                              Más detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white">
                            <strong>Insight:</strong> Has completado el 15% más de tareas esta semana. ¡Excelente
                            progreso! Te sugiero mantener este ritmo para alcanzar tus objetivos mensuales.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          <Rocket className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white">
                            <strong>Predicción:</strong> Con tu ritmo actual, completarás el proyecto "Rediseño Web" 3
                            días antes de la fecha límite. ¡Vas por buen camino!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Características Revolucionarias</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Descubre las herramientas que transformarán tu productividad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Planes que se Adaptan a Ti</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Elige el plan perfecto para tu nivel de productividad
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!isYearly ? "text-white font-semibold" : "text-slate-400"}`}>Mensual</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-blue-500" />
              <span className={`text-sm ${isYearly ? "text-white font-semibold" : "text-slate-400"}`}>Anual</span>
              {isYearly && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ahorra hasta 25%</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`bg-white/10 backdrop-blur-sm ${plan.color} hover:bg-white/15 transition-all duration-300 relative`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge
                      className={`${plan.popular ? "bg-blue-500 text-white" : "bg-purple-500 text-white"} px-3 py-1`}
                    >
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">
                      €{isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && <span className="text-slate-300">/{isYearly ? "año" : "mes"}</span>}
                  </div>
                  {isYearly && plan.price.monthly > 0 && (
                    <div className="text-sm text-slate-400 mt-1">
                      €{(plan.price.yearly / 12).toFixed(2)}/mes facturado anualmente
                    </div>
                  )}
                  {plan.savings && (
                    <Badge variant="outline" className="mt-2 text-green-400 border-green-500/30 bg-green-500/10">
                      {plan.savings}
                    </Badge>
                  )}
                  {plan.bonus && (
                    <Badge variant="outline" className="mt-2 text-purple-400 border-purple-500/30 bg-purple-500/10">
                      {plan.bonus}
                    </Badge>
                  )}
                  <CardDescription className="text-slate-300 mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-slate-300">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.limitations.length > 0 && (
                    <ul className="space-y-2 mb-6 pb-4 border-b border-white/10">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start text-slate-400">
                          <X className="h-4 w-4 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link href="/login">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Garantía 30 días</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Soporte 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Sin permanencia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Últimos Artículos del Blog</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Mantente al día con las últimas tendencias en productividad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group overflow-hidden"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg?height=200&width=400"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">{post.category}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-black/20 backdrop-blur-sm text-white border-white/30">
                      {post.readTime}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg group-hover:text-blue-300 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-slate-300 line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {post.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {post.comments}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                      <div className="font-medium text-slate-300">{post.author}</div>
                      <div className="text-xs">{post.authorRole}</div>
                      <div className="text-xs">{post.date}</div>
                    </div>
                    <Link href={`/blog/${post.id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        Leer más
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs bg-white/5 border-white/20 text-slate-400 hover:bg-white/10"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/blog">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <BookOpen className="h-4 w-4 mr-2" />
                Ver Todos los Artículos
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Rocket className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para Revolucionar tu Productividad?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Únete a miles de profesionales que ya están transformando su forma de trabajar con FutureTask. Comienza
              gratis y descubre tu verdadero potencial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Comenzar Gratis
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
                >
                  <Coffee className="h-5 w-5 mr-2" />
                  Hablar con Nosotros
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-400 mt-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Configuración en 2 minutos</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Soporte gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  FutureTask
                </span>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                La plataforma de productividad del futuro. Organiza tu vida, potencia tu trabajo y alcanza tus objetivos
                con la ayuda de la inteligencia artificial.
              </p>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-400" />
                  <span>support@future-task.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                  <span>Granada, España</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Aplicación
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Actualizaciones
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© 2025 FutureTask. Todos los derechos reservados.</p>
            <p className="text-slate-400 text-sm mt-4 md:mt-0 flex items-center">
              Hecho con <Heart className="h-4 w-4 mx-1 text-red-400" /> en España
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
