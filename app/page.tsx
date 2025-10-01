"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Calendar,
  CheckCircle,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  Brain,
  Users,
  Star,
  ArrowRight,
  Menu,
  X,
  Crown,
  Info,
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/hooks/useLanguage"
import { Separator } from "@/components/ui/separator"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isYearly, setIsYearly] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement("script")
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AR4AW_SOK6UqtOenw2nW_cQs5gvC-_kGRKjKI9JWYUt5ybyt-K367rZ9lUeFPbtegsncbg4LZLR-pOmw&vault=true&intent=subscription"
    script.async = true
    script.onload = () => {
      initializePayPalButtons()
    }
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [isYearly])

  const initializePayPalButtons = () => {
    if (!(window as any).paypal) return

    const paypal = (window as any).paypal

    // Premium Annual Button
    const premiumAnnualContainer = document.getElementById("paypal-button-container-P-59N82236FG469130PNDN3XEQ")
    if (premiumAnnualContainer && isYearly) {
      premiumAnnualContainer.innerHTML = ""
      paypal
        .Buttons({
          style: {
            shape: "rect",
            color: "blue",
            layout: "vertical",
            label: "subscribe",
          },
          createSubscription: (data: any, actions: any) =>
            actions.subscription.create({
              plan_id: "P-59N82236FG469130PNDN3XEQ",
            }),
          onApprove: (data: any, actions: any) => {
            window.location.href = "/payment/success?subscription_id=" + data.subscriptionID + "&plan=premium-yearly"
          },
        })
        .render("#paypal-button-container-P-59N82236FG469130PNDN3XEQ")
    }
  }

  const checkUser = async () => {
    try {
      const supabase = createClient()
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Error getting session:", error)
        setUser(null)
        return
      }

      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error checking user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleGetStarted = () => {
    if (user) {
      router.push("/app")
    } else {
      router.push("/login")
    }
  }

  const handleDemo = () => {
    router.push("/app?demo=true")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const calculateVAT = (basePrice: number) => {
    return basePrice * 0.21
  }

  const plans = [
    {
      id: "free",
      name: "Gratuito",
      monthlyPriceBase: 0,
      monthlyPriceFinal: 0,
      yearlyPriceBase: 0,
      yearlyPriceFinal: 0,
      description: "Perfecto para empezar",
      features: [
        "Tareas ilimitadas",
        "Notas básicas",
        "Wishlist básica",
        "Timer Pomodoro",
        "Sin créditos IA incluidos",
        "Compra packs de créditos IA",
      ],
      aiCredits: "Sin créditos incluidos",
      popular: false,
      buttonId: null,
    },
    {
      id: "premium",
      name: "Premium",
      monthlyPriceBase: 2.06,
      monthlyPriceFinal: 2.49,
      yearlyPriceBase: 20.65,
      yearlyPriceFinal: 24.99,
      description: "Para usuarios productivos",
      features: [
        "Todo lo de Gratuito",
        "Notas avanzadas con formato",
        "Wishlist prioritaria",
        "Sincronización en la nube",
        "Sin anuncios",
        "Sin créditos IA incluidos",
        "Compra packs de créditos IA",
      ],
      aiCredits: "Sin créditos incluidos",
      popular: true,
      buttonId: isYearly ? "P-59N82236FG469130PNDN3XEQ" : null,
    },
    {
      id: "pro",
      name: "Pro",
      monthlyPriceBase: 4.95,
      monthlyPriceFinal: 5.99,
      yearlyPriceBase: 45.45,
      yearlyPriceFinal: 54.99,
      description: "Máximo rendimiento con IA",
      features: [
        "Todo lo de Premium",
        "500 créditos IA mensuales incluidos",
        "Asistente IA completo",
        "Prioridad en soporte",
        "Acceso anticipado a funciones",
        "Análisis avanzados",
        "Exportación de datos",
        "Compra packs adicionales de IA",
      ],
      aiCredits: "500 créditos/mes incluidos",
      popular: false,
      buttonId: null,
    },
  ]

  const getYearlySavings = (monthlyFinal: number, yearlyFinal: number) => {
    const monthlyCost = monthlyFinal * 12
    const savings = monthlyCost - yearlyFinal
    const percentage = Math.round((savings / monthlyCost) * 100)
    return { savings, percentage }
  }

  const features = [
    {
      icon: Calendar,
      title: "Gestión Visual",
      description: "Organiza tus tareas con un calendario intuitivo y fácil de usar",
    },
    {
      icon: Brain,
      title: "Asistente IA",
      description: "Tu asistente personal que te ayuda a planificar y optimizar tu día",
    },
    {
      icon: Clock,
      title: "Pomodoro Timer",
      description: "Técnica Pomodoro integrada para maximizar tu concentración",
    },
    {
      icon: Target,
      title: "Objetivos Claros",
      description: "Define y alcanza tus metas con seguimiento inteligente",
    },
    {
      icon: Sparkles,
      title: "Wishlist",
      description: "Guarda y prioriza tus deseos y aspiraciones futuras",
    },
    {
      icon: TrendingUp,
      title: "Estadísticas",
      description: "Analiza tu productividad y mejora continuamente",
    },
  ]

  const testimonials = [
    {
      name: "María García",
      role: "Desarrolladora",
      content: "Future Task ha transformado completamente mi productividad. La IA me ayuda a priorizar tareas.",
      rating: 5,
      image: "/professional-woman-diverse.png",
    },
    {
      name: "Carlos Rodríguez",
      role: "Emprendedor",
      content: "El mejor sistema de gestión de tareas que he usado. Simple, potente y con IA integrada.",
      rating: 5,
      image: "/professional-man.png",
    },
    {
      name: "Ana Martínez",
      role: "Diseñadora",
      content: "Me encanta el diseño futurista y las funciones avanzadas. Vale cada céntimo.",
      rating: 5,
      image: "/confident-business-woman.png",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Future Task</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Funciones
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Precios
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                Testimonios
              </a>
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contacto
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <LanguageSelector />
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {user ? "Ir a la App" : "Iniciar Sesión / Registro"}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <a
                href="#features"
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Funciones
              </a>
              <a
                href="#pricing"
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Precios
              </a>
              <a
                href="#testimonials"
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonios
              </a>
              <Link
                href="/blog"
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <div className="pt-4 space-y-2">
                <LanguageSelector />
                <Button onClick={handleGetStarted} className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                  {user ? "Ir a la App" : "Iniciar Sesión / Registro"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            🚀 La revolución de la productividad
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Tu Futuro,
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Organizado Hoy
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Gestiona tus tareas, notas y wishlist con el poder de la inteligencia artificial. Aumenta tu productividad
            hasta un 300%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
            >
              {user ? "Ir a la App" : "Comenzar gratis"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={handleDemo}
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10 bg-transparent"
            >
              Ver demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
            <div>
              <div className="text-4xl font-bold text-purple-400">10K+</div>
              <div className="text-gray-400">Usuarios activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400">98%</div>
              <div className="text-gray-400">Satisfacción</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">50K+</div>
              <div className="text-gray-400">Tareas completadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400">24/7</div>
              <div className="text-gray-400">Soporte IA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Funciones Potentes</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Todo lo que necesitas para ser más productivo, en una sola aplicación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Precios Transparentes</h2>
            <p className="text-xl text-gray-300 mb-8">Elige el plan que mejor se adapte a tus necesidades</p>

            {/* VAT Info */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6">
              <Info className="h-4 w-4" />
              <span>Todos los precios incluyen IVA (21%)</span>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-lg ${!isYearly ? "text-white font-semibold" : "text-gray-400"}`}>Mensual</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-purple-500" />
              <span className={`text-lg ${isYearly ? "text-white font-semibold" : "text-gray-400"}`}>Anual</span>
              {isYearly && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 ml-2">Ahorra hasta 17%</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const priceBase = isYearly ? plan.yearlyPriceBase : plan.monthlyPriceBase
              const priceFinal = isYearly ? plan.yearlyPriceFinal : plan.monthlyPriceFinal
              const vatAmount = calculateVAT(priceBase)
              const yearlySavings = getYearlySavings(plan.monthlyPriceFinal, plan.yearlyPriceFinal)

              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? "bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500"
                      : "bg-slate-800/50 border-purple-500/20"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-bold">
                      <Star className="inline w-4 h-4 mr-1" />
                      POPULAR
                    </div>
                  )}

                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {plan.id === "pro" && <Crown className="w-5 h-5 text-yellow-400" />}
                      {plan.id === "premium" && <Sparkles className="w-5 h-5 text-purple-400" />}
                      {plan.id === "free" && <Target className="w-5 h-5 text-gray-400" />}
                      <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                    <div className="space-y-3">
                      <div className="text-4xl font-bold text-white">
                        {formatPrice(priceFinal)}
                        <span className="text-sm font-normal text-gray-400">/{isYearly ? "año" : "mes"}</span>
                      </div>

                      {/* Price Breakdown */}
                      {priceFinal > 0 && (
                        <div className="bg-slate-800/50 rounded-lg p-3 text-xs space-y-1">
                          <div className="flex justify-between text-gray-400">
                            <span>Precio base:</span>
                            <span>{formatPrice(priceBase)}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>IVA (21%):</span>
                            <span>{formatPrice(vatAmount)}</span>
                          </div>
                          <Separator className="bg-slate-600" />
                          <div className="flex justify-between text-white font-medium">
                            <span>Total:</span>
                            <span>{formatPrice(priceFinal)}</span>
                          </div>
                        </div>
                      )}

                      {isYearly && priceFinal > 0 && (
                        <div className="text-sm text-green-400 font-medium">
                          ✨ Ahorras {formatPrice(yearlySavings.savings)} ({yearlySavings.percentage}%)
                        </div>
                      )}

                      {/* AI Credits Badge */}
                      <Badge
                        variant="outline"
                        className={`${
                          plan.id === "pro"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-slate-700/50 text-gray-400 border-slate-600"
                        }`}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        {plan.aiCredits}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <Separator className="bg-slate-700" />

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.buttonId && isYearly ? (
                      <div id={`paypal-button-container-${plan.buttonId}`} className="w-full min-h-[50px]" />
                    ) : (
                      <Button
                        onClick={handleGetStarted}
                        className={`w-full ${
                          plan.popular
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            : "bg-slate-700 hover:bg-slate-600"
                        } text-white`}
                      >
                        {user
                          ? "Actualizar Plan"
                          : plan.id === "free"
                            ? "Comenzar gratis"
                            : `Comenzar con ${plan.name}`}
                      </Button>
                    )}

                    {plan.id === "free" && (
                      <p className="text-xs text-gray-400 text-center">Sin tarjeta de crédito requerida</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-purple-500/20 rounded-full px-6 py-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300">Garantía de devolución de 30 días</span>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-blue-400 font-semibold mb-2">Información sobre Créditos IA</h3>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>
                      <strong>Plan Gratuito y Premium:</strong> No incluyen créditos IA, pero puedes comprar paquetes de
                      créditos por separado según tus necesidades.
                    </p>
                    <p>
                      <strong>Plan Pro:</strong> Incluye 500 créditos IA mensuales automáticamente. Si necesitas más,
                      puedes comprar paquetes adicionales.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      💡 Los paquetes de créditos comprados no caducan y se pueden usar en cualquier momento.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              Todos los precios incluyen IVA. Puedes cancelar en cualquier momento.
            </p>
            <p className="text-xs text-gray-500">Los pagos son procesados de forma segura por PayPal</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-xl text-gray-300">Miles de profesionales confían en Future Task</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500">
            <CardContent className="text-center py-16 px-4">
              <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                ¿Listo para transformar tu productividad?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Únete a miles de usuarios que ya están alcanzando sus objetivos con Future Task
              </p>
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
              >
                Comenzar ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-purple-500/20 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Future Task</span>
              </div>
              <p className="text-gray-400">Organiza tu futuro, hoy.</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Funciones
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Precios
                  </a>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-purple-500/20 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Future Task. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
