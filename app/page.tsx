"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { CookieBanner } from "@/components/cookie-banner"
import {
  Calendar,
  CheckSquare,
  Brain,
  Trophy,
  Zap,
  Shield,
  Users,
  Star,
  ArrowRight,
  Menu,
  X,
  Clock,
  BarChart3,
  Heart,
  Crown,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Play,
  Pause,
  RotateCcw,
  Plus,
  CreditCard,
  Check,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isYearly, setIsYearly] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [dashboardTab, setDashboardTab] = useState("calendar")
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [tasks, setTasks] = useState([
    { id: 1, text: "Revisar propuesta de cliente", completed: false, priority: "high" },
    { id: 2, text: "Llamada con equipo de desarrollo", completed: true, priority: "medium" },
    { id: 3, text: "Actualizar documentación", completed: false, priority: "low" },
  ])

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, pomodoroTime])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribed(true)
    setEmail("")
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  const testimonials = [
    {
      name: "María González",
      role: "Directora de Proyectos",
      company: "TechCorp",
      content:
        "FutureTask ha revolucionado la forma en que gestiono mis proyectos. La IA predictiva me ayuda a anticipar problemas antes de que ocurran.",
      rating: 5,
      avatar: "MG",
    },
    {
      name: "Carlos Rodríguez",
      role: "Freelancer",
      company: "Independiente",
      content:
        "Como freelancer, necesito herramientas que me ayuden a ser más productivo. FutureTask es exactamente lo que necesitaba.",
      rating: 5,
      avatar: "CR",
    },
    {
      name: "Ana Martín",
      role: "CEO",
      company: "StartupXYZ",
      content:
        "La integración de IA en FutureTask nos ha permitido aumentar nuestra productividad en un 40%. Es impresionante.",
      rating: 5,
      avatar: "AM",
    },
  ]

  const features = [
    {
      icon: Calendar,
      title: "Calendario Inteligente",
      description:
        "Organiza tus tareas con un calendario que aprende de tus patrones y sugiere los mejores momentos para cada actividad.",
    },
    {
      icon: Brain,
      title: "IA Predictiva",
      description:
        "Nuestra inteligencia artificial analiza tu productividad y predice cuándo serás más eficiente para cada tipo de tarea.",
    },
    {
      icon: Trophy,
      title: "Sistema de Logros",
      description: "Mantén la motivación con nuestro sistema de gamificación que recompensa tus hábitos productivos.",
    },
    {
      icon: Zap,
      title: "Pomodoro Avanzado",
      description:
        "Técnica Pomodoro personalizable con estadísticas detalladas y sugerencias de descanso inteligentes.",
    },
    {
      icon: BarChart3,
      title: "Analytics Profundo",
      description:
        "Visualiza tu productividad con gráficos detallados y obtén insights accionables sobre tu rendimiento.",
    },
    {
      icon: Shield,
      title: "Sincronización Segura",
      description: "Tus datos están protegidos con encriptación de extremo a extremo y sincronización en tiempo real.",
    },
  ]

  const pricingPlans = [
    {
      name: "Gratuito",
      price: { monthly: 0, yearly: 0 },
      description: "Perfecto para empezar",
      features: [
        "Tareas básicas ilimitadas",
        "Calendario básico",
        "Pomodoro básico (25/5/15 min)",
        "Temas básicos (claro/oscuro)",
        "Logros e insignias básicas",
        "Sincronización en la nube",
        "Soporte por email",
      ],
      cta: "Comenzar Gratis",
      popular: false,
      color: "gray",
    },
    {
      name: "Premium",
      price: { monthly: 1.99, yearly: 20 },
      description: "Para usuarios avanzados",
      features: [
        "Todo lo del plan Gratuito",
        "Ajustes avanzados de Pomodoro",
        "Temas premium y personalización",
        "Lista de deseos completa",
        "Notas avanzadas con etiquetas",
        "Logros e insignias premium",
        "Gráficas de rendimiento avanzadas",
        "Estadísticas detalladas",
        "Soporte prioritario",
      ],
      cta: "Comenzar Premium",
      popular: true,
      color: "yellow",
      savings: isYearly ? "Ahorra €3.88 al año" : null,
    },
    {
      name: "Pro",
      price: { monthly: 4.99, yearly: 45 },
      description: "Para profesionales y equipos",
      features: [
        "Todo lo del plan Premium",
        "Asistente IA completo",
        "500 créditos IA mensuales",
        "Análisis inteligente de productividad",
        "Sugerencias personalizadas por IA",
        "Automatizaciones inteligentes",
        "Predicciones de rendimiento",
        "Integración con APIs externas",
        "Soporte premium 24/7",
      ],
      cta: "Comenzar Pro",
      popular: false,
      color: "purple",
      savings: isYearly ? "Ahorra €14.88 al año" : null,
      bonus: isYearly ? "1000 créditos IA bonus" : null,
    },
  ]

  const stats = [
    { number: "50,000+", label: "Usuarios Activos" },
    { number: "2.5M+", label: "Tareas Completadas" },
    { number: "98%", label: "Satisfacción" },
    { number: "40%", label: "Aumento Productividad" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">FutureTask</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Características
              </a>
              <a
                href="#pricing"
                className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Precios
              </a>
              <Link
                href="/blog"
                className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Contacto
              </Link>
              <Link
                href="/app"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                Abrir App
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Características
                </a>
                <a
                  href="#pricing"
                  className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Precios
                </a>
                <Link
                  href="/blog"
                  className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/contact"
                  className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Contacto
                </Link>
                <Link
                  href="/app"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all text-center"
                >
                  Abrir App
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Nuevo: IA Predictiva Disponible
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            El Futuro de la
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              {" "}
              Productividad
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revoluciona tu forma de trabajar con FutureTask. Nuestra plataforma impulsada por IA te ayuda a ser más
            productivo, predice tus patrones de trabajo y optimiza tu tiempo automáticamente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/app"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Comenzar Gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-2 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.number}</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Dashboard Preview */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Experimenta FutureTask en Acción</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Interactúa con nuestra demo en vivo y descubre cómo FutureTask puede transformar tu productividad
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Demo Header */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold">FutureTask Demo</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Demo Tabs */}
              <div className="border-b border-slate-200 dark:border-slate-700">
                <div className="flex">
                  {[
                    { id: "calendar", label: "Calendario", icon: Calendar },
                    { id: "tasks", label: "Tareas", icon: CheckSquare },
                    { id: "pomodoro", label: "Pomodoro", icon: Clock },
                    { id: "analytics", label: "Analytics", icon: BarChart3 },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setDashboardTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                        dashboardTab === tab.id
                          ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                          : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-6">
                {dashboardTab === "calendar" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Calendario Inteligente
                      </h3>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                        <div className="grid grid-cols-7 gap-2 mb-4">
                          {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
                            <div
                              key={day}
                              className="text-center text-sm font-medium text-slate-600 dark:text-slate-400 py-2"
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                          {Array.from({ length: 35 }, (_, i) => (
                            <div
                              key={i}
                              className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ${
                                i === 15
                                  ? "bg-purple-500 text-white"
                                  : i === 8 || i === 22
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                    : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              {i > 6 && i < 32 ? i - 6 : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Próximas Tareas</h3>
                      <div className="space-y-3">
                        {[
                          { time: "09:00", task: "Reunión de equipo", priority: "high" },
                          { time: "11:30", task: "Revisar propuesta", priority: "medium" },
                          { time: "14:00", task: "Llamada con cliente", priority: "high" },
                          { time: "16:30", task: "Planificación semanal", priority: "low" },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                          >
                            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 w-16">
                              {item.time}
                            </div>
                            <div className="flex-1 text-slate-900 dark:text-white">{item.task}</div>
                            <Badge
                              variant={
                                item.priority === "high"
                                  ? "destructive"
                                  : item.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {item.priority === "high" ? "Alta" : item.priority === "medium" ? "Media" : "Baja"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {dashboardTab === "tasks" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Gestión de Tareas</h3>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Tarea
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                            task.completed
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md"
                          }`}
                        >
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              task.completed
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-slate-300 dark:border-slate-600 hover:border-purple-500"
                            }`}
                          >
                            {task.completed && <Check className="w-3 h-3" />}
                          </button>
                          <div className="flex-1">
                            <span
                              className={`${
                                task.completed
                                  ? "line-through text-slate-500 dark:text-slate-400"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {task.text}
                            </span>
                          </div>
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {dashboardTab === "pomodoro" && (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Técnica Pomodoro</h3>
                    <div className="max-w-md mx-auto">
                      <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-full w-64 h-64 mx-auto flex items-center justify-center mb-8">
                        <div className="text-6xl font-bold text-white">{formatTime(pomodoroTime)}</div>
                      </div>
                      <div className="flex justify-center space-x-4 mb-6">
                        <Button
                          onClick={() => setIsRunning(!isRunning)}
                          className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                          {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                          {isRunning ? "Pausar" : "Iniciar"}
                        </Button>
                        <Button
                          onClick={() => {
                            setPomodoroTime(25 * 60)
                            setIsRunning(false)
                          }}
                          variant="outline"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reiniciar
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">8</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Completados</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3h 20m</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Tiempo Total</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">95%</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Eficiencia</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {dashboardTab === "analytics" && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                      Analytics de Productividad
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-4">Productividad Semanal</h4>
                        <div className="space-y-3">
                          {[
                            { day: "Lun", value: 85 },
                            { day: "Mar", value: 92 },
                            { day: "Mié", value: 78 },
                            { day: "Jue", value: 95 },
                            { day: "Vie", value: 88 },
                            { day: "Sáb", value: 45 },
                            { day: "Dom", value: 30 },
                          ].map((item) => (
                            <div key={item.day} className="flex items-center space-x-3">
                              <div className="w-8 text-sm text-slate-600 dark:text-slate-400">{item.day}</div>
                              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${item.value}%` }}
                                ></div>
                              </div>
                              <div className="w-8 text-sm font-medium text-slate-900 dark:text-white">
                                {item.value}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-4">Estadísticas del Mes</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">127</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Tareas Completadas</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">45h</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Tiempo Productivo</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">89%</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Eficiencia Media</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">12</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Logros Desbloqueados</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Características que Marcan la Diferencia
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Descubre las herramientas avanzadas que hacen de FutureTask la plataforma de productividad más completa
              del mercado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Lo que Dicen Nuestros Usuarios</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Miles de profesionales ya han transformado su productividad con FutureTask
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-slate-700 dark:text-slate-300 mb-6 italic">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm">
                        {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].company}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial
                      ? "bg-purple-500"
                      : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Planes Diseñados para Ti</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              Elige el plan que mejor se adapte a tus necesidades. Todos incluyen nuestra garantía de satisfacción de 30
              días.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span
                className={`text-sm ${!isYearly ? "text-slate-900 dark:text-white font-semibold" : "text-slate-600 dark:text-slate-400"}`}
              >
                Mensual
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-purple-500" />
              <span
                className={`text-sm ${isYearly ? "text-slate-900 dark:text-white font-semibold" : "text-slate-600 dark:text-slate-400"}`}
              >
                Anual
              </span>
              {isYearly && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Ahorra hasta 25%
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white dark:bg-slate-800 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  plan.popular ? "border-purple-500 shadow-lg" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1">
                      Más Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      plan.color === "purple"
                        ? "bg-gradient-to-br from-purple-500 to-blue-500"
                        : plan.color === "yellow"
                          ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                          : "bg-gradient-to-br from-gray-500 to-gray-600"
                    }`}
                  >
                    {plan.color === "purple" ? (
                      <Crown className="w-8 h-8 text-white" />
                    ) : plan.color === "yellow" ? (
                      <Star className="w-8 h-8 text-white" />
                    ) : (
                      <Heart className="w-8 h-8 text-white" />
                    )}
                  </div>

                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</CardTitle>

                  <CardDescription className="text-slate-600 dark:text-slate-400 mb-4">
                    {plan.description}
                  </CardDescription>

                  <div className="mb-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-slate-900 dark:text-white">
                        €{isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-slate-600 dark:text-slate-400 ml-2">/{isYearly ? "año" : "mes"}</span>
                      )}
                    </div>

                    {isYearly && plan.price.monthly > 0 && (
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        €{(plan.price.yearly / 12).toFixed(2)}/mes facturado anualmente
                      </div>
                    )}

                    {plan.savings && (
                      <Badge
                        variant="outline"
                        className="mt-2 text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                      >
                        {plan.savings}
                      </Badge>
                    )}

                    {plan.bonus && (
                      <Badge
                        variant="outline"
                        className="mt-2 text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
                      >
                        {plan.bonus}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/app"
                    className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transform hover:scale-105"
                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              ¿Necesitas un plan empresarial?{" "}
              <Link href="/contact" className="text-purple-600 dark:text-purple-400 hover:underline">
                Contáctanos
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Garantía 30 días</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Pago seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Mantente al Día con FutureTask</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Recibe las últimas actualizaciones, consejos de productividad y ofertas exclusivas directamente en tu
            bandeja de entrada.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                />
                <Button type="submit" className="bg-white text-purple-600 hover:bg-purple-50 font-semibold">
                  Suscribirse
                </Button>
              </div>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <Check className="w-8 h-8 text-white mx-auto mb-3" />
                <p className="text-white font-semibold">¡Gracias por suscribirte!</p>
                <p className="text-purple-100 text-sm mt-2">Recibirás nuestro primer email muy pronto.</p>
              </div>
            </div>
          )}

          <p className="text-purple-200 text-sm mt-4">
            No spam, solo contenido valioso. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">FutureTask</span>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                La plataforma de productividad del futuro. Potenciada por IA, diseñada para humanos. Transforma tu
                manera de trabajar y alcanza tus objetivos con mayor eficiencia.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">support@future-task.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">Granada, España</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">+34 958 123 456</span>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Producto</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-slate-300 hover:text-purple-400 transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-slate-300 hover:text-purple-400 transition-colors">
                    Precios
                  </a>
                </li>
                <li>
                  <Link href="/app" className="text-slate-300 hover:text-purple-400 transition-colors">
                    Aplicación
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-300 hover:text-purple-400 transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Soporte</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-slate-300 hover:text-purple-400 transition-colors">
                    Contacto
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-purple-400 transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-purple-400 transition-colors">
                    Términos de Servicio
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-purple-400 transition-colors">
                    Política de Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-slate-400 text-sm mb-4 md:mb-0">
                © 2024 FutureTask. Todos los derechos reservados.
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-slate-400 text-sm">Hecho con ❤️ en España</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  )
}
