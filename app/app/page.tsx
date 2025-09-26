"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  CheckSquare,
  BookOpen,
  Heart,
  Trophy,
  Settings,
  Zap,
  Star,
  Activity,
  Timer,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Import components
import { CalendarWidget } from "@/components/calendar-widget"
import { TaskManager } from "@/components/task-manager"
import { NotesManager } from "@/components/notes-manager"
import { WishlistManager } from "@/components/wishlist-manager"
import { AchievementsDisplay } from "@/components/achievements-display"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { SettingsModal } from "@/components/settings-modal"
import { SubscriptionModal } from "@/components/subscription-modal"
import { StatsCards } from "@/components/stats-cards"
import { AIAssistant } from "@/components/ai-assistant"

export default function AppPage() {
  // State management
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [notes, setNotes] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showSettings, setShowSettings] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [aiCredits, setAiCredits] = useState(0)

  const router = useRouter()

  // Theme configuration
  const theme = {
    cardBg: "bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm",
    border: "border-slate-700/50",
    textPrimary: "text-white",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-400",
  }

  // Initialize user and data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true)

        // Get user from localStorage
        const storedUser = localStorage.getItem("user")
        if (!storedUser) {
          router.push("/")
          return
        }

        const userData = JSON.parse(storedUser)
        setUser(userData)
        setAiCredits(userData.aiCredits || 50)

        // Load user data from localStorage or initialize empty
        const storedTasks = localStorage.getItem(`tasks_${userData.id}`)
        const storedNotes = localStorage.getItem(`notes_${userData.id}`)
        const storedWishlist = localStorage.getItem(`wishlist_${userData.id}`)

        setTasks(storedTasks ? JSON.parse(storedTasks) : [])
        setNotes(storedNotes ? JSON.parse(storedNotes) : [])
        setWishlist(storedWishlist ? JSON.parse(storedWishlist) : [])
      } catch (error) {
        console.error("Error initializing app:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [router])

  // Save data to localStorage
  const saveToStorage = useCallback(
    (key, data) => {
      if (user) {
        localStorage.setItem(`${key}_${user.id}`, JSON.stringify(data))
      }
    },
    [user],
  )

  // Data management functions
  const handleTasksChange = useCallback(
    (newTasks) => {
      setTasks(newTasks)
      saveToStorage("tasks", newTasks)
    },
    [saveToStorage],
  )

  const handleNotesChange = useCallback(
    (newNotes) => {
      setNotes(newNotes)
      saveToStorage("notes", newNotes)
    },
    [saveToStorage],
  )

  const handleWishlistChange = useCallback(
    (newWishlist) => {
      setWishlist(newWishlist)
      saveToStorage("wishlist", newWishlist)
    },
    [saveToStorage],
  )

  // User update functions
  const handleUserUpdate = useCallback(
    (updates) => {
      if (!user) return

      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      if (updates.aiCredits !== undefined) {
        setAiCredits(updates.aiCredits)
      }
    },
    [user],
  )

  const handlePlanChange = useCallback(
    (newPlan) => {
      const credits = newPlan === "pro" ? 1000 : 50
      handleUserUpdate({
        plan: newPlan,
        aiCredits: credits,
      })
      setShowSubscription(false)
    },
    [handleUserUpdate],
  )

  const handleCancelPlan = useCallback(() => {
    handlePlanChange("free")
  }, [handlePlanChange])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  // Stats calculations
  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.completed).length,
    totalNotes: notes.length,
    totalWishlist: wishlist.length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0,
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white text-lg">Cargando tu espacio de trabajo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">FutureTask</h1>
                <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">Tu asistente de productividad</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* AI Credits Display */}
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                <span className="text-xs sm:text-sm text-white font-medium">{aiCredits}</span>
                <span className="text-xs text-slate-400 hidden sm:inline">créditos</span>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">{user?.name || "Usuario"}</p>
                  <div className="flex items-center gap-1">
                    <Badge variant={user?.plan === "pro" ? "default" : "secondary"} className="text-xs">
                      {user?.plan === "pro" ? "Pro" : "Free"}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="text-white hover:bg-slate-800/50"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-slate-800/50">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Tab Navigation - Responsive */}
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="text-white text-xs sm:text-sm">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">📊</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-white text-xs sm:text-sm">
              <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Tareas</span>
              <span className="sm:hidden">✓</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-white text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Calendario</span>
              <span className="sm:hidden">📅</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-white text-xs sm:text-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notas</span>
              <span className="sm:hidden">📝</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="text-white text-xs sm:text-sm">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Wishlist</span>
              <span className="sm:hidden">❤️</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-white text-xs sm:text-sm">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Logros</span>
              <span className="sm:hidden">🏆</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            {/* Welcome Section */}
            <Card className={`${theme.cardBg} ${theme.border} shadow-xl`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      ¡Bienvenido, {user?.name || "Usuario"}! 👋
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base">
                      Aquí tienes un resumen de tu productividad hoy
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => setShowSubscription(true)}
                      className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white flex-1 sm:flex-none"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {user?.plan === "pro" ? "Gestionar Plan" : "Upgrade Pro"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <StatsCards
              stats={{
                totalTasks: stats.totalTasks,
                completedTasks: stats.completedTasks,
                totalNotes: stats.totalNotes,
                totalWishlist: stats.totalWishlist,
                completionRate: stats.completionRate,
              }}
              theme={theme}
            />

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Quick Actions */}
              <Card className={`${theme.cardBg} ${theme.border} shadow-xl`}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setActiveTab("tasks")}
                    variant="outline"
                    className="w-full justify-start bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Crear Nueva Tarea
                  </Button>
                  <Button
                    onClick={() => setActiveTab("notes")}
                    variant="outline"
                    className="w-full justify-start bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Escribir Nota
                  </Button>
                  <Button
                    onClick={() => setActiveTab("calendar")}
                    variant="outline"
                    className="w-full justify-start bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Calendario
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className={`${theme.cardBg} ${theme.border} shadow-xl`}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-400" />
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks.slice(0, 3).map((task, index) => (
                      <div key={task.id || index} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                        <div className={`w-2 h-2 rounded-full ${task.completed ? "bg-green-400" : "bg-yellow-400"}`} />
                        <span className="text-sm text-slate-300 flex-1 truncate">{task.title}</span>
                        <span className="text-xs text-slate-500">{task.completed ? "Completada" : "Pendiente"}</span>
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <p className="text-slate-400 text-sm text-center py-4">No hay actividad reciente</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pomodoro Section */}
            <Card className={`${theme.cardBg} ${theme.border} shadow-xl`}>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Timer className="h-5 w-5 text-red-400" />
                  Técnica Pomodoro
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Mejora tu concentración con sesiones de trabajo enfocado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PomodoroTimer
                  userId={user?.id || "demo-user"}
                  theme={theme}
                  onSessionComplete={() => {
                    console.log("Pomodoro session completed!")
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <TaskManager
              userId={user?.id || "demo-user"}
              tasks={tasks}
              onTasksChange={handleTasksChange}
              theme={theme}
            />
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <CalendarWidget userId={user?.id || "demo-user"} tasks={tasks} theme={theme} />
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            <NotesManager
              userId={user?.id || "demo-user"}
              notes={notes}
              onNotesChange={handleNotesChange}
              theme={theme}
            />
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <WishlistManager
              userId={user?.id || "demo-user"}
              wishlist={wishlist}
              onWishlistChange={handleWishlistChange}
              theme={theme}
            />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <AchievementsDisplay userId={user?.id || "demo-user"} user={user} theme={theme} />
          </TabsContent>
        </Tabs>
      </main>

      {/* AI Assistant - Fixed Position */}
      <AIAssistant
        userId={user?.id || "demo-user"}
        isPro={user?.plan === "pro"}
        aiCredits={aiCredits}
        onUpgrade={() => setShowSubscription(true)}
        compact={true}
      />

      {/* Modals */}
      {showSettings && (
        <SettingsModal
          user={user}
          onUserUpdate={handleUserUpdate}
          onUpgrade={() => setShowSubscription(true)}
          onCancelPlan={handleCancelPlan}
        />
      )}

      {showSubscription && (
        <SubscriptionModal
          currentPlan={user?.plan || "free"}
          onClose={() => setShowSubscription(false)}
          onPlanChange={handlePlanChange}
        />
      )}
    </div>
  )
}
