"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Zap,
  Calendar,
  Trophy,
  Clock,
  Sparkles,
  Star,
  CheckCircle,
  ArrowRight,
  Globe,
  Crown,
  Target,
  BarChart3,
  Shield,
  Smartphone,
} from "lucide-react"
import { translations } from "@/constants/translations"
import type { Language } from "@/types"

interface LandingPageProps {
  onGetStarted: () => void
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function LandingPage({ onGetStarted, language, onLanguageChange }: LandingPageProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const t = translations[language]

  const features = [
    {
      icon: Calendar,
      title: language === "es" ? "Gestión Inteligente" : "Smart Management",
      description:
        language === "es"
          ? "Organiza tus tareas con calendarios intuitivos y vistas personalizables"
          : "Organize your tasks with intuitive calendars and customizable views",
    },
    {
      icon: Clock,
      title: language === "es" ? "Técnica Pomodoro" : "Pomodoro Technique",
      description:
        language === "es"
          ? "Mejora tu productividad con temporizadores integrados y seguimiento de tiempo"
          : "Boost productivity with built-in timers and time tracking",
    },
    {
      icon: Trophy,
      title: language === "es" ? "Sistema de Logros" : "Achievement System",
      description:
        language === "es"
          ? "Mantente motivado con logros desbloqueables y seguimiento de progreso"
          : "Stay motivated with unlockable achievements and progress tracking",
    },
    {
      icon: BarChart3,
      title: language === "es" ? "Análisis Avanzado" : "Advanced Analytics",
      description:
        language === "es"
          ? "Obtén insights sobre tu productividad con estadísticas detalladas"
          : "Get insights into your productivity with detailed statistics",
    },
    {
      icon: Smartphone,
      title: language === "es" ? "Multiplataforma" : "Cross-Platform",
      description:
        language === "es"
          ? "Accede a tus tareas desde cualquier dispositivo, en cualquier momento"
          : "Access your tasks from any device, anytime",
    },
    {
      icon: Shield,
      title: language === "es" ? "Datos Seguros" : "Secure Data",
      description:
        language === "es"
          ? "Tus datos están protegidos con encriptación de nivel empresarial"
          : "Your data is protected with enterprise-grade encryption",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: language === "es" ? "Gerente de Producto" : "Product Manager",
      content:
        language === "es"
          ? "FutureTask ha transformado completamente mi flujo de trabajo. La integración del Pomodoro es perfecta."
          : "FutureTask has completely transformed my workflow. The Pomodoro integration is perfect.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "Miguel Rodriguez",
      role: language === "es" ? "Diseñador Freelance" : "Freelance Designer",
      content:
        language === "es"
          ? "La mejor app de gestión de tareas que he usado. Las estadísticas me ayudan a mantenerme enfocado."
          : "The best task management app I've used. The analytics help me stay focused.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "Emma Chen",
      role: language === "es" ? "Estudiante de Informática" : "Computer Science Student",
      content:
        language === "es"
          ? "Perfecta para gestionar mis estudios. Los temas son hermosos y la interfaz es muy intuitiva."
          : "Perfect for managing my studies. The themes are beautiful and the interface is so intuitive.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
    },
  ]

  const pricingPlans = [
    {
      name: language === "es" ? "Gratuito" : "Free",
      price: "€0",
      period: language === "es" ? "/mes" : "/month",
      features: [
        language === "es" ? "Hasta 50 tareas" : "Up to 50 tasks",
        language === "es" ? "3 temas básicos" : "3 basic themes",
        language === "es" ? "Temporizador Pomodoro" : "Pomodoro timer",
        language === "es" ? "Estadísticas básicas" : "Basic statistics",
      ],
      popular: false,
    },
    {
      name: "Premium",
      price: "€0.99",
      period: language === "es" ? "/mes" : "/month",
      features: [
        language === "es" ? "Tareas ilimitadas" : "Unlimited tasks",
        language === "es" ? "Todos los temas premium" : "All premium themes",
        language === "es" ? "Estadísticas avanzadas" : "Advanced analytics",
        language === "es" ? "Sin anuncios" : "Ad-free experience",
        language === "es" ? "Soporte prioritario" : "Priority support",
      ],
      popular: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">{t.appName}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLanguageChange(language === "en" ? "es" : "en")}
                className="text-white hover:bg-white/20"
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "🇪🇸 Español" : "🇺🇸 English"}
              </Button>
              <Button onClick={onGetStarted} className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                {language === "es" ? "Comenzar" : "Get Started"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-white/20 text-white border-white/20 mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              {language === "es" ? "La Próxima Generación de Productividad" : "Next-Gen Productivity"}
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {language === "es" ? (
                <>
                  Gestiona Tareas
                  <br />
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Como un Pro
                  </span>
                </>
              ) : (
                <>
                  Manage Tasks
                  <br />
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Like a Pro
                  </span>
                </>
              )}
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              {language === "es"
                ? "Revoluciona tu productividad con FutureTask. Calendarios inteligentes, técnica Pomodoro, logros desbloqueables y análisis avanzados en una sola aplicación."
                : "Revolutionize your productivity with FutureTask. Smart calendars, Pomodoro technique, unlockable achievements, and advanced analytics in one app."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 text-lg"
              >
                <Target className="h-5 w-5 mr-2" />
                {language === "es" ? "Comenzar Gratis" : "Start Free"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg"
              >
                <Crown className="h-5 w-5 mr-2" />
                {language === "es" ? "Ver Premium" : "View Premium"}
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-white/60">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>{language === "es" ? "Gratis para siempre" : "Free forever"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>{language === "es" ? "Sin tarjeta de crédito" : "No credit card"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>{language === "es" ? "Configuración en 2 minutos" : "2-minute setup"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === "es" ? "Funciones Poderosas" : "Powerful Features"}
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {language === "es"
                ? "Todo lo que necesitas para maximizar tu productividad y alcanzar tus objetivos."
                : "Everything you need to maximize your productivity and achieve your goals."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === "es" ? "Lo Que Dicen Nuestros Usuarios" : "What Our Users Say"}
            </h2>
            <p className="text-xl text-white/70">
              {language === "es"
                ? "Miles de usuarios confían en FutureTask para su productividad diaria."
                : "Thousands of users trust FutureTask for their daily productivity."}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-white mb-6 italic">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="flex items-center justify-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonials[currentTestimonial].avatar || "/placeholder.svg"} />
                      <AvatarFallback>{testimonials[currentTestimonial].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-white">{testimonials[currentTestimonial].name}</div>
                      <div className="text-white/60">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === "es" ? "Precios Simples" : "Simple Pricing"}
            </h2>
            <p className="text-xl text-white/70">
              {language === "es"
                ? "Comienza gratis, actualiza cuando estés listo."
                : "Start free, upgrade when you're ready."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all ${
                  plan.popular ? "ring-2 ring-yellow-400" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      {language === "es" ? "Más Popular" : "Most Popular"}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-white/60 ml-1">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-white/80">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={onGetStarted}
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                        : "bg-white/20 hover:bg-white/30 text-white border-white/20"
                    }`}
                  >
                    {language === "es" ? "Comenzar" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              {language === "es" ? "¿Listo para Ser Más Productivo?" : "Ready to Be More Productive?"}
            </h2>
            <p className="text-xl text-white/70 mb-8">
              {language === "es"
                ? "Únete a miles de usuarios que ya han transformado su productividad con FutureTask."
                : "Join thousands of users who have already transformed their productivity with FutureTask."}
            </p>
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-12 py-4 text-lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              {language === "es" ? "Comenzar Ahora - Es Gratis" : "Start Now - It's Free"}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/5 backdrop-blur-sm border-t border-white/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-semibold">{t.appName}</span>
            </div>
            <div className="text-white/60 text-sm">
              © 2024 FutureTask. {language === "es" ? "Todos los derechos reservados." : "All rights reserved."}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
