"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Timer,
  Target,
  Crown,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Smartphone,
  Users,
  TrendingUp,
  Heart,
} from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: "Gestión Inteligente de Tareas",
      description:
        "Organiza tus tareas con categorías, prioridades y fechas límite. Sistema intuitivo y fácil de usar.",
    },
    {
      icon: <Timer className="h-8 w-8 text-green-600" />,
      title: "Temporizador Pomodoro",
      description:
        "Mejora tu productividad con la técnica Pomodoro. Sesiones personalizables y estadísticas detalladas.",
    },
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Objetivos y Metas",
      description: "Define y alcanza tus objetivos con nuestro sistema de seguimiento de metas y logros.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "Estadísticas Avanzadas",
      description: "Analiza tu productividad con gráficos detallados y métricas de rendimiento.",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-pink-600" />,
      title: "Diseño Responsivo",
      description: "Accede desde cualquier dispositivo. Optimizado para móvil, tablet y escritorio.",
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Datos Seguros",
      description: "Tus datos se almacenan de forma segura y privada. Control total sobre tu información.",
    },
  ]

  const testimonials = [
    {
      name: "María González",
      role: "Diseñadora UX",
      content: "FuturoCalendario ha transformado mi productividad. La interfaz es hermosa y muy intuitiva.",
      rating: 5,
      avatar: "MG",
    },
    {
      name: "Carlos Rodríguez",
      role: "Desarrollador",
      content: "El temporizador Pomodoro es increíble. He mejorado mi concentración significativamente.",
      rating: 5,
      avatar: "CR",
    },
    {
      name: "Ana Martín",
      role: "Estudiante",
      content: "Perfecto para organizar mis estudios. Los temas premium son preciosos.",
      rating: 5,
      avatar: "AM",
    },
  ]

  const pricingPlans = [
    {
      name: "Gratuito",
      price: "0€",
      period: "siempre",
      features: [
        "Hasta 50 tareas por mes",
        "Temporizador Pomodoro básico",
        "3 temas incluidos",
        "Estadísticas básicas",
        "Soporte por email",
      ],
      popular: false,
    },
    {
      name: "Premium",
      price: "4.99€",
      period: "mes",
      features: [
        "Tareas ilimitadas",
        "Temporizador Pomodoro avanzado",
        "8 temas premium exclusivos",
        "Estadísticas avanzadas",
        "Sistema de objetivos",
        "Notas y blog personal",
        "Soporte prioritario",
        "Sin anuncios",
      ],
      popular: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Nueva versión disponible
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              Tu Futuro
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Productivo
              </span>
              <br />
              Comienza Hoy
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              La aplicación de productividad más avanzada y hermosa. Organiza tus tareas, mejora tu concentración y
              alcanza tus objetivos con FuturoCalendario.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
              >
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent">
                Ver Demo
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Sin tarjeta de crédito
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Configuración en 2 minutos
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Cancela cuando quieras
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Todo lo que necesitas para ser más productivo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas poderosas diseñadas para ayudarte a organizar tu vida y alcanzar tus metas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-50 rounded-lg">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-xl text-gray-600">Miles de personas ya han transformado su productividad</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Planes simples y transparentes</h2>
            <p className="text-xl text-gray-600">Elige el plan que mejor se adapte a tus necesidades</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 relative ${plan.popular ? "border-2 border-blue-500 shadow-xl" : "border shadow-lg"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      <Crown className="h-4 w-4 mr-1" />
                      Más Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-0">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={onGetStarted}
                    className={`w-full py-3 ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    {plan.name === "Gratuito" ? "Comenzar Gratis" : "Comenzar Prueba"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">¿Listo para transformar tu productividad?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya han mejorado su organización y productividad con FuturoCalendario
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              Comenzar Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 bg-transparent"
            >
              <Users className="mr-2 h-5 w-5" />
              Hablar con Ventas
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calendar className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">FuturoCalendario</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <span>© 2024 FuturoCalendario. Todos los derechos reservados.</span>
              <Heart className="h-4 w-4 text-red-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
