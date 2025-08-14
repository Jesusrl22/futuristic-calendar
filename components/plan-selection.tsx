"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Zap, Check, Crown, ArrowLeft, Star, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface PlanSelectionProps {
  onBack: () => void
  onSelectPlan: (plan: "free" | "monthly" | "yearly") => void
  language: "en" | "es"
}

export function PlanSelection({ onBack, onSelectPlan, language }: PlanSelectionProps) {
  const [isYearly, setIsYearly] = useState(false)

  const translations = {
    en: {
      title: "Choose Your Plan",
      subtitle: "Start free, upgrade anytime",
      monthly: "Monthly",
      yearly: "Yearly",
      save: "Save 20%",
      free: "Free",
      premium: "Premium",
      mostPopular: "Most Popular",
      getStarted: "Get Started",
      selectPlan: "Select Plan",
      features: {
        tasks: "tasks",
        unlimitedTasks: "Unlimited tasks",
        basicThemes: "3 basic themes",
        premiumThemes: "All premium themes",
        basicStats: "Basic statistics",
        advancedStats: "Advanced analytics",
        pomodoroTimer: "Pomodoro timer",
        prioritySupport: "Priority support",
        adFree: "Ad-free experience",
        cloudSync: "Cloud synchronization",
      },
      freeFeatures: ["Up to 50 tasks", "3 basic themes", "Pomodoro timer", "Basic statistics", "Achievement system"],
      premiumFeatures: [
        "Unlimited tasks",
        "All premium themes",
        "Advanced analytics",
        "Priority support",
        "Ad-free experience",
        "Cloud synchronization",
        "Export data",
        "Custom categories",
      ],
    },
    es: {
      title: "Elige Tu Plan",
      subtitle: "Comienza gratis, actualiza cuando quieras",
      monthly: "Mensual",
      yearly: "Anual",
      save: "Ahorra 20%",
      free: "Gratuito",
      premium: "Premium",
      mostPopular: "Más Popular",
      getStarted: "Comenzar",
      selectPlan: "Seleccionar Plan",
      features: {
        tasks: "tareas",
        unlimitedTasks: "Tareas ilimitadas",
        basicThemes: "3 temas básicos",
        premiumThemes: "Todos los temas premium",
        basicStats: "Estadísticas básicas",
        advancedStats: "Análisis avanzados",
        pomodoroTimer: "Temporizador Pomodoro",
        prioritySupport: "Soporte prioritario",
        adFree: "Sin anuncios",
        cloudSync: "Sincronización en la nube",
      },
      freeFeatures: [
        "Hasta 50 tareas",
        "3 temas básicos",
        "Temporizador Pomodoro",
        "Estadísticas básicas",
        "Sistema de logros",
      ],
      premiumFeatures: [
        "Tareas ilimitadas",
        "Todos los temas premium",
        "Análisis avanzados",
        "Soporte prioritario",
        "Sin anuncios",
        "Sincronización en la nube",
        "Exportar datos",
        "Categorías personalizadas",
      ],
    },
  }

  const t = translations[language]

  const handlePlanSelect = (plan: "free" | "monthly" | "yearly") => {
    onSelectPlan(plan)
    toast.success(
      plan === "free"
        ? language === "es"
          ? "¡Plan gratuito seleccionado!"
          : "Free plan selected!"
        : language === "es"
          ? "¡Bienvenido a Premium!"
          : "Welcome to Premium!",
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <div className="w-full max-w-6xl relative z-10">
        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === "es" ? "Atrás" : "Back"}
        </Button>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">FutureTask</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">{t.title}</h2>
          <p className="text-xl text-white/70">{t.subtitle}</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <span className={`text-white ${!isYearly ? "font-semibold" : "opacity-70"}`}>{t.monthly}</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-white ${isYearly ? "font-semibold" : "opacity-70"}`}>{t.yearly}</span>
            {isYearly && (
              <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                {t.save}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">{t.free}</CardTitle>
              <div className="text-4xl font-bold text-white">€0</div>
              <div className="text-white/60">{language === "es" ? "para siempre" : "forever"}</div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {t.freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-white/80">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handlePlanSelect("free")}
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                {t.getStarted}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all ring-2 ring-yellow-400">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1">
                <Crown className="h-4 w-4 mr-1" />
                {t.mostPopular}
              </Badge>
            </div>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">{t.premium}</CardTitle>
              <div className="text-4xl font-bold text-white">€{isYearly ? "9.59" : "0.99"}</div>
              <div className="text-white/60">
                {isYearly
                  ? language === "es"
                    ? "/año (€0.80/mes)"
                    : "/year (€0.80/month)"
                  : language === "es"
                    ? "/mes"
                    : "/month"}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {t.premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-white/80">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handlePlanSelect(isYearly ? "yearly" : "monthly")}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                {t.selectPlan}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-white/60 text-sm">
            {language === "es"
              ? "Puedes cambiar o cancelar tu plan en cualquier momento"
              : "You can change or cancel your plan anytime"}
          </p>
        </div>
      </div>
    </div>
  )
}
