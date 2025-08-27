"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Target, Trophy, Clock, ArrowRight, CheckCircle, Star, Rocket, Brain, Heart } from "lucide-react"
import type { Language } from "@/types"

interface WelcomeScreenProps {
  onComplete: (language: Language) => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("es")

  const languages = [
    { code: "es" as Language, name: "Español", flag: "🇪🇸" },
    { code: "en" as Language, name: "English", flag: "🇺🇸" },
    { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
    { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
    { code: "it" as Language, name: "Italiano", flag: "🇮🇹" },
  ]

  const translations = {
    es: {
      welcome: "¡Bienvenido a FutureTask!",
      subtitle: "Tu asistente de productividad del futuro",
      description:
        "Organiza tus tareas, alcanza tus metas y desbloquea tu potencial con la aplicación de productividad más avanzada.",
      selectLanguage: "Selecciona tu idioma",
      features: "Características Principales",
      getStarted: "Comenzar",
      next: "Siguiente",
      skip: "Omitir",
      feature1Title: "Gestión Inteligente de Tareas",
      feature1Desc: "Organiza y prioriza tus tareas con IA avanzada",
      feature2Title: "Técnica Pomodoro",
      feature2Desc: "Mejora tu concentración con sesiones de trabajo cronometradas",
      feature3Title: "Seguimiento de Logros",
      feature3Desc: "Desbloquea logros y mantén tu motivación alta",
      feature4Title: "Análisis de Productividad",
      feature4Desc: "Obtén insights detallados sobre tu rendimiento",
      readyTitle: "¡Todo Listo!",
      readyDesc: "Estás a punto de transformar tu productividad",
      startJourney: "Comenzar Mi Viaje",
    },
    en: {
      welcome: "Welcome to FutureTask!",
      subtitle: "Your productivity assistant from the future",
      description:
        "Organize your tasks, achieve your goals, and unlock your potential with the most advanced productivity app.",
      selectLanguage: "Select your language",
      features: "Key Features",
      getStarted: "Get Started",
      next: "Next",
      skip: "Skip",
      feature1Title: "Smart Task Management",
      feature1Desc: "Organize and prioritize your tasks with advanced AI",
      feature2Title: "Pomodoro Technique",
      feature2Desc: "Improve your focus with timed work sessions",
      feature3Title: "Achievement Tracking",
      feature3Desc: "Unlock achievements and keep your motivation high",
      feature4Title: "Productivity Analytics",
      feature4Desc: "Get detailed insights into your performance",
      readyTitle: "All Set!",
      readyDesc: "You're about to transform your productivity",
      startJourney: "Start My Journey",
    },
    fr: {
      welcome: "Bienvenue sur FutureTask !",
      subtitle: "Votre assistant de productivité du futur",
      description:
        "Organisez vos tâches, atteignez vos objectifs et libérez votre potentiel avec l'application de productivité la plus avancée.",
      selectLanguage: "Sélectionnez votre langue",
      features: "Fonctionnalités Principales",
      getStarted: "Commencer",
      next: "Suivant",
      skip: "Passer",
      feature1Title: "Gestion Intelligente des Tâches",
      feature1Desc: "Organisez et priorisez vos tâches avec l'IA avancée",
      feature2Title: "Technique Pomodoro",
      feature2Desc: "Améliorez votre concentration avec des sessions chronométrées",
      feature3Title: "Suivi des Réalisations",
      feature3Desc: "Débloquez des réalisations et maintenez votre motivation",
      feature4Title: "Analyses de Productivité",
      feature4Desc: "Obtenez des insights détaillés sur vos performances",
      readyTitle: "Tout est Prêt !",
      readyDesc: "Vous êtes sur le point de transformer votre productivité",
      startJourney: "Commencer Mon Voyage",
    },
    de: {
      welcome: "Willkommen bei FutureTask!",
      subtitle: "Ihr Produktivitätsassistent aus der Zukunft",
      description:
        "Organisieren Sie Ihre Aufgaben, erreichen Sie Ihre Ziele und entfalten Sie Ihr Potenzial mit der fortschrittlichsten Produktivitäts-App.",
      selectLanguage: "Wählen Sie Ihre Sprache",
      features: "Hauptfunktionen",
      getStarted: "Loslegen",
      next: "Weiter",
      skip: "Überspringen",
      feature1Title: "Intelligente Aufgabenverwaltung",
      feature1Desc: "Organisieren und priorisieren Sie Ihre Aufgaben mit fortschrittlicher KI",
      feature2Title: "Pomodoro-Technik",
      feature2Desc: "Verbessern Sie Ihre Konzentration mit zeitgesteuerten Arbeitssitzungen",
      feature3Title: "Erfolgs-Tracking",
      feature3Desc: "Schalten Sie Erfolge frei und halten Sie Ihre Motivation hoch",
      feature4Title: "Produktivitätsanalysen",
      feature4Desc: "Erhalten Sie detaillierte Einblicke in Ihre Leistung",
      readyTitle: "Alles Bereit!",
      readyDesc: "Sie sind dabei, Ihre Produktivität zu transformieren",
      startJourney: "Meine Reise Beginnen",
    },
    it: {
      welcome: "Benvenuto su FutureTask!",
      subtitle: "Il tuo assistente di produttività dal futuro",
      description:
        "Organizza le tue attività, raggiungi i tuoi obiettivi e sblocca il tuo potenziale con l'app di produttività più avanzata.",
      selectLanguage: "Seleziona la tua lingua",
      features: "Caratteristiche Principali",
      getStarted: "Inizia",
      next: "Avanti",
      skip: "Salta",
      feature1Title: "Gestione Intelligente delle Attività",
      feature1Desc: "Organizza e prioritizza le tue attività con IA avanzata",
      feature2Title: "Tecnica Pomodoro",
      feature2Desc: "Migliora la tua concentrazione con sessioni di lavoro cronometrate",
      feature3Title: "Tracciamento dei Risultati",
      feature3Desc: "Sblocca risultati e mantieni alta la tua motivazione",
      feature4Title: "Analisi della Produttività",
      feature4Desc: "Ottieni insights dettagliati sulle tue performance",
      readyTitle: "Tutto Pronto!",
      readyDesc: "Stai per trasformare la tua produttività",
      startJourney: "Inizia il Mio Viaggio",
    },
  }

  const t = translations[selectedLanguage]

  const steps = [
    {
      title: t.welcome,
      content: (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{t.welcome}</h2>
          <p className="text-xl text-purple-200 mb-4">{t.subtitle}</p>
          <p className="text-purple-300 max-w-md mx-auto">{t.description}</p>

          <div className="mt-8">
            <label className="block text-sm font-medium text-purple-200 mb-2">{t.selectLanguage}</label>
            <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as Language)}>
              <SelectTrigger className="w-full max-w-xs mx-auto bg-black/20 border-purple-500/30 text-white">
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
        </div>
      ),
    },
    {
      title: t.features,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center mb-8">{t.features}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white">{t.feature1Title}</h3>
                </div>
                <p className="text-purple-200 text-sm">{t.feature1Desc}</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-red-400" />
                  </div>
                  <h3 className="font-semibold text-white">{t.feature2Title}</h3>
                </div>
                <p className="text-purple-200 text-sm">{t.feature2Desc}</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h3 className="font-semibold text-white">{t.feature3Title}</h3>
                </div>
                <p className="text-purple-200 text-sm">{t.feature3Desc}</p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white">{t.feature4Title}</h3>
                </div>
                <p className="text-purple-200 text-sm">{t.feature4Desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: t.readyTitle,
      content: (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <Rocket className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{t.readyTitle}</h2>
          <p className="text-xl text-purple-200 mb-4">{t.readyDesc}</p>

          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-purple-200">Tareas</p>
            </div>
            <div className="text-center">
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-purple-200">Logros</p>
            </div>
            <div className="text-center">
              <Heart className="h-8 w-8 text-pink-400 mx-auto mb-2" />
              <p className="text-sm text-purple-200">Motivación</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(selectedLanguage)
    }
  }

  const handleSkip = () => {
    onComplete(selectedLanguage)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent)] pointer-events-none" />

      <Card className="w-full max-w-2xl bg-black/20 backdrop-blur-md border-purple-500/30">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? "bg-purple-500" : "bg-purple-500/30"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="min-h-[400px] flex flex-col justify-center">{steps[currentStep].content}</div>

          <div className="flex justify-between items-center mt-8">
            <Button variant="ghost" onClick={handleSkip} className="text-purple-300 hover:text-white hover:bg-white/10">
              {t.skip}
            </Button>

            <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700 text-white px-8">
              {currentStep === steps.length - 1 ? t.startJourney : t.next}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WelcomeScreen
