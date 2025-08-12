"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Target, Clock, Trophy, Calendar, Star, CheckCircle, ArrowRight, Sparkles } from "lucide-react"

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: "Gestión Inteligente de Tareas",
      description: "Organiza, prioriza y completa tus tareas con un sistema intuitivo y poderoso.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: "Técnica Pomodoro Integrada",
      description: "Mejora tu productividad con sesiones de trabajo enfocado y descansos programados.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      title: "Sistema de Logros",
      description: "Mantén la motivación con logros desbloqueables y seguimiento de progreso.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-500" />,
      title: "Vista Semanal Avanzada",
      description: "Planifica tu semana con una vista de calendario completa y personalizable.",
      color: "from-purple-500 to-pink-500",
    },
  ]

  const benefits = [
    "🎯 Aumenta tu productividad hasta un 40%",
    "⏰ Gestiona mejor tu tiempo con Pomodoro",
    "🏆 Mantén la motivación con logros",
    "📱 Interfaz moderna y responsive",
    "🌙 Modo oscuro para trabajar de noche",
    "🔔 Notificaciones inteligentes",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              FutureTask
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Tu asistente de productividad del futuro. Organiza tus tareas, alcanza tus metas y desbloquea tu potencial
            con herramientas inteligentes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Comenzar Ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Gratis para siempre</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Usuarios activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">1M+</div>
              <div className="text-gray-600 dark:text-gray-400">Tareas completadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
              <div className="text-gray-600 dark:text-gray-400">Aumento productividad</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Características Principales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                onClick={() => setCurrentFeature(index)}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            ¿Por qué elegir FutureTask?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="text-2xl">{benefit.split(" ")[0]}</div>
                <div className="text-gray-700 dark:text-gray-300">{benefit.substring(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                ¿Listo para transformar tu productividad?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Únete a miles de usuarios que ya han mejorado su productividad con FutureTask.
              </p>
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Star className="w-5 h-5 mr-2" />
                Empezar Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  Sin tarjeta de crédito
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  Configuración en 2 minutos
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
