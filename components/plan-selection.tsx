"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Crown, Check, X, Zap, Target, Trophy, Clock, Brain, Palette, Shield, Headphones } from "lucide-react"
import type { Language } from "@/types"

interface PlanSelectionProps {
  onPlanSelected: (isPremium: boolean) => void
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function PlanSelection({ onPlanSelected, language, onLanguageChange }: PlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "monthly" | "yearly">("monthly")
  const [isLoading, setIsLoading] = useState(false)

  const languages = [
    { code: "es" as Language, name: "Español", flag: "🇪🇸" },
    { code: "en" as Language, name: "English", flag: "🇺🇸" },
    { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
    { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
    { code: "it" as Language, name: "Italiano", flag: "🇮🇹" },
  ]

  const translations = {
    es: {
      appName: "FutureTask",
      choosePlan: "Elige tu Plan",
      subtitle: "Selecciona el plan perfecto para tu productividad",
      free: "Gratis",
      premium: "Premium",
      monthly: "Mensual",
      yearly: "Anual",
      mostPopular: "Más Popular",
      bestValue: "Mejor Valor",
      save44: "Ahorra 44%",
      continueWith: "Continuar con",
      startFree: "Comenzar Gratis",
      selectLanguage: "Seleccionar idioma",
      features: "Características",
      // Free features
      basicTasks: "Gestión básica de tareas",
      basicCalendar: "Vista de calendario básica",
      basicPomodoro: "Timer Pomodoro básico",
      basicThemes: "3 temas básicos",
      // Premium features
      unlimitedTasks: "Tareas ilimitadas",
      advancedCalendar: "Vista de calendario avanzada",
      premiumPomodoro: "Pomodoro con sonidos premium",
      premiumThemes: "Temas premium ilimitados",
      aiAssistant: "Asistente IA integrado",
      advancedAnalytics: "Análisis avanzado",
      prioritySupport: "Soporte prioritario",
      cloudSync: "Sincronización en la nube",
      teamCollaboration: "Colaboración en equipo",
      customTemplates: "Plantillas personalizadas",
      advancedFilters: "Filtros avanzados",
      exportData: "Exportar datos",
      // Pricing
      freePrice: "€0",
      monthlyPrice: "€2.99",
      yearlyPrice: "€20",
      perMonth: "/mes",
      perYear: "/año",
      billedMonthly: "Facturado mensualmente",
      billedYearly: "Facturado anualmente",
      // CTA
      getStarted: "Comenzar",
      upgradeNow: "Actualizar Ahora",
      processing: "Procesando...",
    },
    en: {
      appName: "FutureTask",
      choosePlan: "Choose Your Plan",
      subtitle: "Select the perfect plan for your productivity",
      free: "Free",
      premium: "Premium",
      monthly: "Monthly",
      yearly: "Yearly",
      mostPopular: "Most Popular",
      bestValue: "Best Value",
      save44: "Save 44%",
      continueWith: "Continue with",
      startFree: "Start Free",
      selectLanguage: "Select language",
      features: "Features",
      // Free features
      basicTasks: "Basic task management",
      basicCalendar: "Basic calendar view",
      basicPomodoro: "Basic Pomodoro timer",
      basicThemes: "3 basic themes",
      // Premium features
      unlimitedTasks: "Unlimited tasks",
      advancedCalendar: "Advanced calendar view",
      premiumPomodoro: "Pomodoro with premium sounds",
      premiumThemes: "Unlimited premium themes",
      aiAssistant: "Integrated AI assistant",
      advancedAnalytics: "Advanced analytics",
      prioritySupport: "Priority support",
      cloudSync: "Cloud synchronization",
      teamCollaboration: "Team collaboration",
      customTemplates: "Custom templates",
      advancedFilters: "Advanced filters",
      exportData: "Export data",
      // Pricing
      freePrice: "€0",
      monthlyPrice: "€2.99",
      yearlyPrice: "€20",
      perMonth: "/month",
      perYear: "/year",
      billedMonthly: "Billed monthly",
      billedYearly: "Billed yearly",
      // CTA
      getStarted: "Get Started",
      upgradeNow: "Upgrade Now",
      processing: "Processing...",
    },
    fr: {
      appName: "FutureTask",
      choosePlan: "Choisissez Votre Plan",
      subtitle: "Sélectionnez le plan parfait pour votre productivité",
      free: "Gratuit",
      premium: "Premium",
      monthly: "Mensuel",
      yearly: "Annuel",
      mostPopular: "Plus Populaire",
      bestValue: "Meilleure Valeur",
      save44: "Économisez 44%",
      continueWith: "Continuer avec",
      startFree: "Commencer Gratuitement",
      selectLanguage: "Sélectionner la langue",
      features: "Fonctionnalités",
      // Free features
      basicTasks: "Gestion de tâches de base",
      basicCalendar: "Vue calendrier de base",
      basicPomodoro: "Timer Pomodoro de base",
      basicThemes: "3 thèmes de base",
      // Premium features
      unlimitedTasks: "Tâches illimitées",
      advancedCalendar: "Vue calendrier avancée",
      premiumPomodoro: "Pomodoro avec sons premium",
      premiumThemes: "Thèmes premium illimités",
      aiAssistant: "Assistant IA intégré",
      advancedAnalytics: "Analyses avancées",
      prioritySupport: "Support prioritaire",
      cloudSync: "Synchronisation cloud",
      teamCollaboration: "Collaboration d'équipe",
      customTemplates: "Modèles personnalisés",
      advancedFilters: "Filtres avancés",
      exportData: "Exporter les données",
      // Pricing
      freePrice: "€0",
      monthlyPrice: "€2,99",
      yearlyPrice: "€20",
      perMonth: "/mois",
      perYear: "/an",
      billedMonthly: "Facturé mensuellement",
      billedYearly: "Facturé annuellement",
      // CTA
      getStarted: "Commencer",
      upgradeNow: "Mettre à Niveau",
      processing: "Traitement...",
    },
    de: {
      appName: "FutureTask",
      choosePlan: "Wählen Sie Ihren Plan",
      subtitle: "Wählen Sie den perfekten Plan für Ihre Produktivität",
      free: "Kostenlos",
      premium: "Premium",
      monthly: "Monatlich",
      yearly: "Jährlich",
      mostPopular: "Am Beliebtesten",
      bestValue: "Bester Wert",
      save44: "44% Sparen",
      continueWith: "Weiter mit",
      startFree: "Kostenlos Starten",
      selectLanguage: "Sprache auswählen",
      features: "Funktionen",
      // Free features
      basicTasks: "Grundlegende Aufgabenverwaltung",
      basicCalendar: "Grundlegende Kalenderansicht",
      basicPomodoro: "Grundlegender Pomodoro-Timer",
      basicThemes: "3 grundlegende Themen",
      // Premium features
      unlimitedTasks: "Unbegrenzte Aufgaben",
      advancedCalendar: "Erweiterte Kalenderansicht",
      premiumPomodoro: "Pomodoro mit Premium-Sounds",
      premiumThemes: "Unbegrenzte Premium-Themen",
      aiAssistant: "Integrierter KI-Assistent",
      advancedAnalytics: "Erweiterte Analysen",
      prioritySupport: "Prioritäts-Support",
      cloudSync: "Cloud-Synchronisation",
      teamCollaboration: "Team-Zusammenarbeit",
      customTemplates: "Benutzerdefinierte Vorlagen",
      advancedFilters: "Erweiterte Filter",
      exportData: "Daten exportieren",
      // Pricing
      freePrice: "€0",
      monthlyPrice: "€2,99",
      yearlyPrice: "€20",
      perMonth: "/Monat",
      perYear: "/Jahr",
      billedMonthly: "Monatlich abgerechnet",
      billedYearly: "Jährlich abgerechnet",
      // CTA
      getStarted: "Loslegen",
      upgradeNow: "Jetzt Upgraden",
      processing: "Verarbeitung...",
    },
    it: {
      appName: "FutureTask",
      choosePlan: "Scegli il Tuo Piano",
      subtitle: "Seleziona il piano perfetto per la tua produttività",
      free: "Gratuito",
      premium: "Premium",
      monthly: "Mensile",
      yearly: "Annuale",
      mostPopular: "Più Popolare",
      bestValue: "Miglior Valore",
      save44: "Risparmia 44%",
      continueWith: "Continua con",
      startFree: "Inizia Gratis",
      selectLanguage: "Seleziona lingua",
      features: "Caratteristiche",
      // Free features
      basicTasks: "Gestione attività di base",
      basicCalendar: "Vista calendario di base",
      basicPomodoro: "Timer Pomodoro di base",
      basicThemes: "3 temi di base",
      // Premium features
      unlimitedTasks: "Attività illimitate",
      advancedCalendar: "Vista calendario avanzata",
      premiumPomodoro: "Pomodoro con suoni premium",
      premiumThemes: "Temi premium illimitati",
      aiAssistant: "Assistente IA integrato",
      advancedAnalytics: "Analisi avanzate",
      prioritySupport: "Supporto prioritario",
      cloudSync: "Sincronizzazione cloud",
      teamCollaboration: "Collaborazione di squadra",
      customTemplates: "Modelli personalizzati",
      advancedFilters: "Filtri avanzati",
      exportData: "Esporta dati",
      // Pricing
      freePrice: "€0",
      monthlyPrice: "€2,99",
      yearlyPrice: "€20",
      perMonth: "/mese",
      perYear: "/anno",
      billedMonthly: "Fatturato mensilmente",
      billedYearly: "Fatturato annualmente",
      // CTA
      getStarted: "Inizia",
      upgradeNow: "Aggiorna Ora",
      processing: "Elaborazione...",
    },
  }

  const t = translations[language]

  const handlePlanSelection = async (isPremium: boolean) => {
    setIsLoading(true)

    // Simulate payment processing for premium plans
    if (isPremium) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    onPlanSelected(isPremium)
  }

  const freeFeatures = [
    { icon: Target, text: t.basicTasks, included: true },
    { icon: Clock, text: t.basicCalendar, included: true },
    { icon: Clock, text: t.basicPomodoro, included: true },
    { icon: Palette, text: t.basicThemes, included: true },
    { icon: Brain, text: t.aiAssistant, included: false },
    { icon: Trophy, text: t.advancedAnalytics, included: false },
    { icon: Headphones, text: t.prioritySupport, included: false },
    { icon: Shield, text: t.cloudSync, included: false },
  ]

  const premiumFeatures = [
    { icon: Target, text: t.unlimitedTasks, included: true },
    { icon: Clock, text: t.advancedCalendar, included: true },
    { icon: Clock, text: t.premiumPomodoro, included: true },
    { icon: Palette, text: t.premiumThemes, included: true },
    { icon: Brain, text: t.aiAssistant, included: true },
    { icon: Trophy, text: t.advancedAnalytics, included: true },
    { icon: Headphones, text: t.prioritySupport, included: true },
    { icon: Shield, text: t.cloudSync, included: true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent)] pointer-events-none" />

      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t.appName}</h1>
          </div>

          <div className="flex justify-center mb-6">
            <Select value={language} onValueChange={(value) => onLanguageChange(value as Language)}>
              <SelectTrigger className="w-40 bg-black/20 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-white/10">
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">{t.choosePlan}</h2>
          <p className="text-purple-200 text-lg">{t.subtitle}</p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30 relative">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-xl mb-2">{t.free}</CardTitle>
              <div className="text-3xl font-bold text-white mb-2">
                {t.freePrice}
                <span className="text-sm font-normal text-purple-200">{t.perMonth}</span>
              </div>
              <p className="text-purple-200 text-sm">{t.startFree}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-red-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-white" : "text-purple-300"}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handlePlanSelection(false)}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
              >
                {isLoading ? t.processing : t.getStarted}
              </Button>
            </CardContent>
          </Card>

          {/* Monthly Premium Plan */}
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                {t.mostPopular}
              </Badge>
            </div>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-white text-xl mb-2 flex items-center justify-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                <span>
                  {t.premium} - {t.monthly}
                </span>
              </CardTitle>
              <div className="text-3xl font-bold text-white mb-2">
                {t.monthlyPrice}
                <span className="text-sm font-normal text-purple-200">{t.perMonth}</span>
              </div>
              <p className="text-purple-200 text-sm">{t.billedMonthly}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-white">{feature.text}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handlePlanSelection(true)}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mt-6"
              >
                {isLoading ? t.processing : t.upgradeNow}
              </Button>
            </CardContent>
          </Card>

          {/* Yearly Premium Plan */}
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1">{t.save44}</Badge>
            </div>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-white text-xl mb-2 flex items-center justify-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                <span>
                  {t.premium} - {t.yearly}
                </span>
              </CardTitle>
              <div className="text-3xl font-bold text-white mb-2">
                {t.yearlyPrice}
                <span className="text-sm font-normal text-purple-200">{t.perYear}</span>
              </div>
              <p className="text-purple-200 text-sm">{t.billedYearly}</p>
              <div className="text-sm text-green-400 font-medium">{t.bestValue}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-white">{feature.text}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handlePlanSelection(true)}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white mt-6"
              >
                {isLoading ? t.processing : t.upgradeNow}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-purple-300 text-sm">💳 Pago seguro • 🔒 Cancela cuando quieras • 📞 Soporte 24/7</p>
        </div>
      </div>
    </div>
  )
}

export default PlanSelection
