"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Zap, User, ArrowRight, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface WelcomeScreenProps {
  onComplete: (data: { language: "en" | "es"; name: string; goals: string[] }) => void
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState(1)
  const [language, setLanguage] = useState<"en" | "es">("en")
  const [name, setName] = useState("")
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const translations = {
    en: {
      welcome: "Welcome to FutureTask!",
      subtitle: "Let's personalize your experience",
      step1Title: "Choose Your Language",
      step1Subtitle: "Select your preferred language for the app",
      step2Title: "What's Your Name?",
      step2Subtitle: "We'll use this to personalize your experience",
      step3Title: "What Are Your Goals?",
      step3Subtitle: "Select what you want to achieve with FutureTask",
      namePlaceholder: "Enter your name",
      continue: "Continue",
      finish: "Get Started",
      goals: {
        productivity: "Increase Productivity",
        organization: "Better Organization",
        timeManagement: "Time Management",
        workLifeBalance: "Work-Life Balance",
        habitBuilding: "Build Better Habits",
        projectManagement: "Project Management",
        teamCollaboration: "Team Collaboration",
        personalDevelopment: "Personal Development",
      },
    },
    es: {
      welcome: "¡Bienvenido a FutureTask!",
      subtitle: "Personalicemos tu experiencia",
      step1Title: "Elige Tu Idioma",
      step1Subtitle: "Selecciona tu idioma preferido para la aplicación",
      step2Title: "¿Cuál es tu nombre?",
      step2Subtitle: "Lo usaremos para personalizar tu experiencia",
      step3Title: "¿Cuáles son tus objetivos?",
      step3Subtitle: "Selecciona lo que quieres lograr con FutureTask",
      namePlaceholder: "Ingresa tu nombre",
      continue: "Continuar",
      finish: "Comenzar",
      goals: {
        productivity: "Aumentar Productividad",
        organization: "Mejor Organización",
        timeManagement: "Gestión del Tiempo",
        workLifeBalance: "Equilibrio Vida-Trabajo",
        habitBuilding: "Crear Mejores Hábitos",
        projectManagement: "Gestión de Proyectos",
        teamCollaboration: "Colaboración en Equipo",
        personalDevelopment: "Desarrollo Personal",
      },
    },
  }

  const t = translations[language]

  const goalOptions = [
    { id: "productivity", label: t.goals.productivity, icon: "⚡" },
    { id: "organization", label: t.goals.organization, icon: "📋" },
    { id: "timeManagement", label: t.goals.timeManagement, icon: "⏰" },
    { id: "workLifeBalance", label: t.goals.workLifeBalance, icon: "⚖️" },
    { id: "habitBuilding", label: t.goals.habitBuilding, icon: "🎯" },
    { id: "projectManagement", label: t.goals.projectManagement, icon: "📊" },
    { id: "teamCollaboration", label: t.goals.teamCollaboration, icon: "👥" },
    { id: "personalDevelopment", label: t.goals.personalDevelopment, icon: "🌱" },
  ]

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) => (prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]))
  }

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      if (!name.trim()) {
        toast.error(language === "es" ? "Por favor ingresa tu nombre" : "Please enter your name")
        return
      }
      setStep(3)
    } else {
      if (selectedGoals.length === 0) {
        toast.error(language === "es" ? "Por favor selecciona al menos un objetivo" : "Please select at least one goal")
        return
      }
      onComplete({ language, name: name.trim(), goals: selectedGoals })
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">FutureTask</h1>
            </div>
            <CardTitle className="text-2xl text-white mb-2">{t.welcome}</CardTitle>
            <p className="text-white/70">{t.subtitle}</p>

            {/* Progress Indicator */}
            <div className="flex justify-center space-x-2 mt-6">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-3 h-3 rounded-full transition-all ${stepNumber <= step ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">{t.step1Title}</h2>
                  <p className="text-white/70">{t.step1Subtitle}</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card
                      className={`cursor-pointer transition-all ${
                        language === "en"
                          ? "bg-white/20 border-white/40 ring-2 ring-white"
                          : "bg-white/10 border-white/20 hover:bg-white/15"
                      }`}
                      onClick={() => setLanguage("en")}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl mb-2">🇺🇸</div>
                        <div className="text-white font-medium">English</div>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all ${
                        language === "es"
                          ? "bg-white/20 border-white/40 ring-2 ring-white"
                          : "bg-white/10 border-white/20 hover:bg-white/15"
                      }`}
                      onClick={() => setLanguage("es")}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl mb-2">🇪🇸</div>
                        <div className="text-white font-medium">Español</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">{t.step2Title}</h2>
                  <p className="text-white/70">{t.step2Subtitle}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      {language === "es" ? "Nombre" : "Name"}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                      <Input
                        id="name"
                        type="text"
                        placeholder={t.namePlaceholder}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">{t.step3Title}</h2>
                  <p className="text-white/70">{t.step3Subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goalOptions.map((goal) => (
                    <Card
                      key={goal.id}
                      className={`cursor-pointer transition-all ${
                        selectedGoals.includes(goal.id)
                          ? "bg-white/20 border-white/40 ring-2 ring-white"
                          : "bg-white/10 border-white/20 hover:bg-white/15"
                      }`}
                      onClick={() => handleGoalToggle(goal.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{goal.icon}</div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{goal.label}</div>
                          </div>
                          {selectedGoals.includes(goal.id) && <CheckCircle className="h-5 w-5 text-green-400" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedGoals.length > 0 && (
                  <div className="text-center">
                    <Badge className="bg-white/20 text-white border-white/20">
                      {selectedGoals.length} {language === "es" ? "objetivos seleccionados" : "goals selected"}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {language === "es" ? "Atrás" : "Back"}
                </Button>
              )}

              <Button
                onClick={handleNext}
                className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white ${
                  step === 1 ? "ml-auto" : ""
                }`}
              >
                {step === 3 ? t.finish : t.continue}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
