"use client"

import { useState } from "react"
import { CalendarView } from "./calendar-view"
import { WeeklyView } from "./weekly-view"
import PomodoroTimer from "./pomodoro-timer"
import PremiumSettings from "./premium-settings"
import AdBanner from "./ad-banner"
import { Chatbot } from "./chatbot"
import { WishlistGoals } from "./wishlist-goals"
import { NotesBlog } from "./notes-blog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Calendar,
  CalendarDays,
  Timer,
  Settings,
  Crown,
  MessageSquare,
  Target,
  BookOpen,
  BarChart3,
  Trophy,
  CreditCard,
} from "lucide-react"
import type { UserPreferences } from "@/types"
import PlanSelection from "./plan-selection"

interface User {
  name: string
  email: string
  isAuthenticated: boolean
}

interface CalendarAppProps {
  user: User
  preferences: UserPreferences
  onPreferencesChange: (preferences: UserPreferences) => void
}

export default function CalendarApp({ user, preferences, onPreferencesChange }: CalendarAppProps) {
  const [currentView, setCurrentView] = useState("calendar")
  const [showPlanDialog, setShowPlanDialog] = useState(false)

  const handleUpgrade = () => {
    setShowPlanDialog(true)
  }

  const handlePlanSelect = (isPremium: boolean) => {
    onPreferencesChange({
      ...preferences,
      isPremium,
    })
    setShowPlanDialog(false)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${preferences.backgroundGradient}`}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">FutureTask</h1>
              </div>
              {preferences.isPremium && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">¡Hola, {user.name}!</span>
              {!preferences.isPremium && (
                <Button onClick={handleUpgrade} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Actualizar a Premium
                </Button>
              )}
              {preferences.isPremium && (
                <Button
                  onClick={() => setShowPlanDialog(true)}
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Gestionar Plan
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Selection Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestionar Suscripción</DialogTitle>
          </DialogHeader>
          <PlanSelection onPlanSelect={handlePlanSelect} />
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <Tabs value={currentView} onValueChange={setCurrentView} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8 h-auto p-1">
            <TabsTrigger value="calendar" className="flex items-center space-x-2 py-3">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendario</span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center space-x-2 py-3">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Semanal</span>
            </TabsTrigger>
            <TabsTrigger value="pomodoro" className="flex items-center space-x-2 py-3">
              <Timer className="h-4 w-4" />
              <span className="hidden sm:inline">Pomodoro</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2 py-3">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Estadísticas</span>
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="flex items-center space-x-2 py-3">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-2 py-3" disabled={!preferences.isPremium}>
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Objetivos</span>
              {preferences.isPremium && <Crown className="h-3 w-3 text-yellow-500" />}
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center space-x-2 py-3" disabled={!preferences.isPremium}>
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Notas</span>
              {preferences.isPremium && <Crown className="h-3 w-3 text-yellow-500" />}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2 py-3">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Ajustes</span>
            </TabsTrigger>
          </TabsList>

          {/* Ad Banner for Free Users */}
          {!preferences.isPremium && <AdBanner onUpgrade={handleUpgrade} />}

          <TabsContent value="calendar" className="space-y-6">
            <CalendarView isPremium={preferences.isPremium} onUpgrade={handleUpgrade} />
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <WeeklyView isPremium={preferences.isPremium} onUpgrade={handleUpgrade} />
          </TabsContent>

          <TabsContent value="pomodoro" className="space-y-6">
            <PomodoroTimer isPremium={preferences.isPremium} onUpgrade={handleUpgrade} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="h-6 w-6 text-yellow-600" />
                <h2 className="text-2xl font-bold">Estadísticas y Logros</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">127</div>
                    <div className="text-sm text-gray-600">Tareas Completadas</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">15</div>
                    <div className="text-sm text-gray-600">Racha Actual</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">43h</div>
                    <div className="text-sm text-gray-600">Tiempo Enfocado</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">8</div>
                    <div className="text-sm text-gray-600">Logros Desbloqueados</div>
                  </div>
                </Card>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="chatbot" className="space-y-6">
            <Chatbot isPremium={preferences.isPremium} onUpgrade={handleUpgrade} />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            {preferences.isPremium ? (
              <WishlistGoals />
            ) : (
              <Card className="p-6 text-center">
                <Crown className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Función Premium</h3>
                <p className="text-gray-600 mb-4">
                  Actualiza a Premium para acceder al sistema de objetivos y wishlist
                </p>
                <Button onClick={handleUpgrade} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Actualizar ahora
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            {preferences.isPremium ? (
              <NotesBlog />
            ) : (
              <Card className="p-6 text-center">
                <Crown className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Función Premium</h3>
                <p className="text-gray-600 mb-4">
                  Actualiza a Premium para acceder al sistema de notas y blog personal
                </p>
                <Button onClick={handleUpgrade} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Actualizar ahora
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <PremiumSettings
              preferences={preferences}
              onPreferencesChange={onPreferencesChange}
              isPremium={preferences.isPremium}
              onUpgrade={handleUpgrade}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
