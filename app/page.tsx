"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CookieBanner } from "@/components/cookie-banner"
import {
  Calendar,
  CheckSquare,
  Brain,
  Trophy,
  Crown,
  Star,
  BarChart3,
  Menu,
  X,
  Clock,
  Target,
  Users,
  MessageSquare,
  Phone,
  MapPin,
  Mail,
  Play,
  Check,
  Sparkles,
  Rocket,
  Headphones,
  ArrowRight,
  PlayCircle,
} from "lucide-react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isYearly, setIsYearly] = useState(false)
  const [activeWidget, setActiveWidget] = useState("calendar")
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate dashboard widgets
  useEffect(() => {
    const widgets = ["calendar", "tasks", "analytics"]
    const interval = setInterval(() => {
      setActiveWidget((prev) => {
        const currentIndex = widgets.indexOf(prev)
        return widgets[(currentIndex + 1) % widgets.length]
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "María González",
      role: "Directora de Proyectos",
      company: "TechStart",
      content:
        "FutureTask ha revolucionado mi productividad. El asistente IA me ayuda a priorizar tareas y el sistema Pomodoro me mantiene enfocada.",
      rating: 5,
      avatar: "MG",
    },
    {
      name: "Carlos Rodríguez",
      role: "Freelancer",
      company: "Diseño Digital",
      content:
        "Como freelancer, necesito organizar múltiples proyectos. La lista de deseos y las notas avanzadas son perfectas para mi flujo de trabajo.",
      rating: 5,
      avatar: "CR",
    },
    {
      name: "Ana Martín",
      role: "Estudiante de Máster",
      company: "Universidad de Granada",
      content:
        "Los logros y estadísticas me motivan a mantener mis hábitos de estudio. Es como gamificar mi productividad personal.",
      rating: 5,
      avatar: "AM",
    },
  ]

  const features = [
    {
      icon: <CheckSquare className="h-8 w-8" />,
      title: "Gestión de Tareas Inteligente",
      description: "Organiza, prioriza y completa tus tareas con nuestro sistema avanzado de gestión.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Calendario Futurista",
      description: "Visualiza tu tiempo con un calendario interactivo y planifica tu futuro con precisión.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Técnica Pomodoro Avanzada",
      description: "Mejora tu concentración con temporizadores personalizables y estadísticas detalladas.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Asistente IA Personalizado",
      description: "Obtén sugerencias inteligentes y análisis de productividad con inteligencia artificial.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Sistema de Logros",
      description: "Mantente motivado con insignias, logros y un sistema de gamificación completo.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Análisis de Productividad",
      description: "Comprende tus patrones de trabajo con gráficas detalladas y métricas avanzadas.",
      color: "from-indigo-500 to-purple-500",
    },
  ]

  const stats = [
    { number: "50,000+", label: "Usuarios Activos", icon: <Users className="h-6 w-6" /> },
    { number: "2.5M+", label: "Tareas Completadas", icon: <CheckSquare className="h-6 w-6" /> },
    { number: "98%", label: "Satisfacción", icon: <Star className="h-6 w-6" /> },
    { number: "24/7", label: "Soporte", icon: <Headphones className="h-6 w-6" /> },
  ]

  // Updated pricing plans to match the application
  const pricingPlans = [
    {
      id: "free",
      name: "Gratuito",
      price: { monthly: 0, yearly: 0 },
      description: "Perfecto para empezar",
      popular: false,
      features: [
        "Tareas básicas ilimitadas",
        "Calendario básico",
        "Pomodoro básico (25/5/15 min)",
        "Temas básicos (claro/oscuro)",
        "Logros e insignias básicas",
        "Sincronización en la nube",
        "Soporte por email",
      ],
      color: "from-gray-400 to-gray-600",
      icon: <Target className="h-6 w-6" />,
    },
    {
      id: "premium",
      name: "Premium",
      price: { monthly: 1.99, yearly: 20 },
      description: "Para usuarios productivos",
      popular: true,
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
      color: "from-yellow-400 to-orange-500",
      icon: <Star className="h-6 w-6" />,
      savings: "Ahorra €3.88 al año",
    },
    {
      id: "pro",
      name: "Pro",
      price: { monthly: 4.99, yearly: 45 },
      description: "Máxima productividad con IA",
      popular: false,
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
      color: "from-purple-500 to-blue-600",
      icon: <Crown className="h-6 w-6" />,
      savings: "Ahorra €14.88 al año",
      yearlyBonus: "1000 créditos IA bonus",
    },
  ]

  const getPrice = (plan: any) => {
    if (plan.price.monthly === 0) return "€0"
    if (isYearly) {
      if (plan.id === "premium") return "€1.67/mes"
      if (plan.id === "pro") return "€3.75/mes"
      return `€${(plan.price.yearly / 12).toFixed(2)}/mes`
    }
    return `€${plan.price.monthly}/mes`
  }

  const getYearlyPrice = (plan: any) => {
    if (plan.price.yearly === 0) return ""
    return `€${plan.price.yearly}/año`
  }

  const getSavings = (plan: any) => {
    if (plan.price.monthly === 0) return 0
    const monthlyCost = plan.price.monthly * 12
    return Math.round(((monthlyCost - plan.price.yearly) / monthlyCost) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">FutureTask</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">
                Características
              </a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                Precios
              </a>
              <a href="/blog" className="text-slate-300 hover:text-white transition-colors">
                Blog
              </a>
              <a href="/contact" className="text-slate-300 hover:text-white transition-colors">
                Contacto
              </a>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <a href="/app">Comenzar Gratis</a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-700">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-slate-300 hover:text-white transition-colors">
                  Características
                </a>
                <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                  Precios
                </a>
                <a href="/blog" className="text-slate-300 hover:text-white transition-colors">
                  Blog
                </a>
                <a href="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contacto
                </a>
                <Button asChild className="bg-purple-600 hover:bg-purple-700 w-fit">
                  <a href="/app">Comenzar Gratis</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center gap-2 mb-6">
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Nuevo: Asistente IA
            </Badge>
            <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
              <Rocket className="h-3 w-3 mr-1" />
              50,000+ usuarios
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            El Futuro de la
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Productividad
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revoluciona tu forma de trabajar con FutureTask. Gestión inteligente de tareas, calendario futurista,
            técnica Pomodoro avanzada y asistente IA personalizado. Todo en una plataforma diseñada para el éxito.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
              <a href="/app">
                <PlayCircle className="h-5 w-5 mr-2" />
                Comenzar Gratis
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-3 bg-transparent"
            >
              <Play className="h-5 w-5 mr-2" />
              Ver Demo
            </Button>
          </div>

          {/* Interactive Dashboard Preview */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-slate-400 text-sm ml-4">futuretask.com/app</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Calendar Widget */}
                <Card
                  className={`bg-slate-700/50 border-slate-600 transition-all duration-300 cursor-pointer ${
                    activeWidget === "calendar" ? "ring-2 ring-purple-500 scale-105" : "hover:bg-slate-700/70"
                  }`}
                  onClick={() => setActiveWidget("calendar")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      Calendario
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
                        <div key={day} className="text-slate-400 text-center p-1">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 35 }, (_, i) => (
                        <div
                          key={i}
                          className={`text-center p-1 rounded ${
                            i === 15
                              ? "bg-purple-600 text-white"
                              : i === 8 || i === 22
                                ? "bg-blue-600/50 text-blue-200"
                                : "text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          {i > 6 && i < 32 ? i - 6 : ""}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tasks Widget */}
                <Card
                  className={`bg-slate-700/50 border-slate-600 transition-all duration-300 cursor-pointer ${
                    activeWidget === "tasks" ? "ring-2 ring-blue-500 scale-105" : "hover:bg-slate-700/70"
                  }`}
                  onClick={() => setActiveWidget("tasks")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-blue-400" />
                      Tareas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-green-600/20 rounded border border-green-600/30">
                      <Check className="h-4 w-4 text-green-400" />
                      <span className="text-green-200 text-sm">Completar presentación</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-600/50 rounded">
                      <div className="w-4 h-4 border border-slate-400 rounded"></div>
                      <span className="text-slate-300 text-sm">Revisar emails</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-600/50 rounded">
                      <div className="w-4 h-4 border border-slate-400 rounded"></div>
                      <span className="text-slate-300 text-sm">Llamada con cliente</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Analytics Widget */}
                <Card
                  className={`bg-slate-700/50 border-slate-600 transition-all duration-300 cursor-pointer ${
                    activeWidget === "analytics" ? "ring-2 ring-green-500 scale-105" : "hover:bg-slate-700/70"
                  }`}
                  onClick={() => setActiveWidget("analytics")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-400" />
                      Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 text-sm">Productividad</span>
                        <span className="text-green-400 font-semibold">87%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-[87%]"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-white font-bold">24</div>
                          <div className="text-slate-400 text-xs">Completadas</div>
                        </div>
                        <div>
                          <div className="text-white font-bold">3.2h</div>
                          <div className="text-slate-400 text-xs">Tiempo focus</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 text-center">
                <p className="text-slate-400 text-sm">
                  ✨ Dashboard interactivo • Haz clic en los widgets para explorar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Características que
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Transforman
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Descubre las herramientas avanzadas que harán de tu productividad una experiencia extraordinaria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 group"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Lo que dicen nuestros
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Usuarios
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Miles de profesionales ya han transformado su productividad con FutureTask
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-slate-200 mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold">{testimonials[currentTestimonial].name}</div>
                      <div className="text-slate-400 text-sm">
                        {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].company}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-purple-500" : "bg-slate-600"
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Planes que se adaptan a
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {" "}
                tu Ritmo
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Desde principiantes hasta profesionales avanzados, tenemos el plan perfecto para potenciar tu
              productividad
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 p-1 bg-slate-800 rounded-lg w-fit mx-auto">
              <span className={`text-sm ${!isYearly ? "font-semibold text-white" : "text-slate-400"}`}>Mensual</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={`text-sm ${isYearly ? "font-semibold text-white" : "text-slate-400"}`}>
                Anual
                <Badge variant="secondary" className="ml-2 text-xs bg-green-600 text-white">
                  Ahorra hasta 25%
                </Badge>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? "bg-gradient-to-b from-slate-800 to-slate-900 border-orange-500 ring-2 ring-orange-500/50 scale-105"
                    : "bg-slate-800/50 border-slate-700 hover:bg-slate-800/70"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-1 -right-1">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                      Más Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center space-y-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}
                  >
                    {plan.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                    <CardDescription className="text-slate-300">{plan.description}</CardDescription>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-white">{getPrice(plan)}</span>
                    </div>
                    {isYearly && plan.price.yearly > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm text-slate-400">Facturado anualmente: {getYearlyPrice(plan)}</div>
                        <div className="text-sm text-green-400">
                          Ahorras {getSavings(plan)}% (€{(plan.price.monthly * 12 - plan.price.yearly).toFixed(2)}/año)
                        </div>
                        {plan.yearlyBonus && <div className="text-sm text-purple-400">+ {plan.yearlyBonus}</div>}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                        : plan.id === "free"
                          ? "bg-slate-700 hover:bg-slate-600 text-white"
                          : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`
                    }`}
                  >
                    <a href="/app">
                      {plan.id === "free" ? "Comenzar Gratis" : `Elegir ${plan.name}`}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-400 mb-4">¿Necesitas algo más personalizado?</p>
            <Button
              variant="outline"
              asChild
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <a href="/contact">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contactar Ventas
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para Transformar tu
            <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Productividad?
            </span>
          </h2>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Únete a miles de profesionales que ya han revolucionado su forma de trabajar con FutureTask
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-purple-900 hover:bg-slate-100 text-lg px-8 py-3">
              <a href="/app">
                <Rocket className="h-5 w-5 mr-2" />
                Comenzar Gratis Ahora
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-purple-900 text-lg px-8 py-3 bg-transparent"
            >
              <a href="/contact">
                <MessageSquare className="h-5 w-5 mr-2" />
                Hablar con Ventas
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-purple-400" />
                <span className="text-xl font-bold text-white">FutureTask</span>
              </div>
              <p className="text-slate-400">
                La plataforma de productividad del futuro. Gestiona tareas, optimiza tu tiempo y alcanza tus metas con
                inteligencia artificial.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-slate-400 hover:text-white transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="/app" className="text-slate-400 hover:text-white transition-colors">
                    Aplicación
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-slate-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/contact" className="text-slate-400 hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Estado del Sistema
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-400">
                  <Mail className="h-4 w-4" />
                  support@future-task.com
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-4 w-4" />
                  Granada, España
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Phone className="h-4 w-4" />
                  +34 958 123 456
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 FutureTask. Todos los derechos reservados. Hecho con ❤️ en Granada, España.
            </p>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  )
}
