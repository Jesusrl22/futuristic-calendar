"use client"

import { useState, useEffect } from "react"
import type { User } from "lucide-react"
import { CalendarView } from "@/components/calendar-view"
import { WelcomeScreen } from "@/components/welcome-screen"
import { AuthScreen } from "@/components/auth-screen"
import { PlanSelection } from "@/components/plan-selection"
import type { Task, UserPreferences, Achievement, Stats, Language } from "@/types"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useTasks } from "@/hooks/useTasks"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "auth" | "planSelection" | "main">("welcome")
  const [user, setUser] = useLocalStorage<User | null>("user", null)
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>("preferences", {
    selectedTheme: "purple",
    backgroundGradient: "from-slate-900 via-purple-900 to-slate-900",
    isPremium: false,
    userName: "Usuario",
    language: "es",
    notifications: true,
    soundEnabled: true,
    pomodoroTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    dailyGoal: 8,
    weeklyGoal: 40,
    showWeekends: true,
    startWeekOnMonday: true,
    timeFormat: "24h",
    dateFormat: "dd/MM/yyyy",
    timezone: "Europe/Madrid",
  })
  const [language, setLanguage] = useState<Language>("es")
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>("achievements", [])
  const [stats, setStats] = useLocalStorage<Stats>("stats", {
    dailyStreak: 0,
    totalTasksCompleted: 0,
    totalTimeSpent: 0,
    todayTasks: 0,
    weekTasks: 0,
    pomodoroSessions: 0,
    focusTime: 0,
    streak: 0,
  })

  const { toast } = useToast()
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks()

  // Determine initial screen based on user state
  useEffect(() => {
    if (!user) {
      setCurrentScreen("welcome")
    } else if (!user.isAuthenticated) {
      setCurrentScreen("auth")
    } else if (!user.hasSeenPlanSelection && !user.isPremium) {
      setCurrentScreen("planSelection")
    } else {
      setCurrentScreen("main")
    }
  }, [user])

  const handleWelcomeComplete = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage)
    setPreferences((prev) => ({ ...prev, language: selectedLanguage }))
    setCurrentScreen("auth")
  }

  const handleAuthSuccess = (userData: { name: string; email: string }) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      isAuthenticated: true,
      isPremium: false,
      hasSeenPlanSelection: false,
    }
    setUser(newUser)
    setPreferences((prev) => ({ ...prev, userName: userData.name }))
    setCurrentScreen("planSelection")
  }

  const handlePlanSelection = (isPremium: boolean) => {
    if (user) {
      const updatedUser = { ...user, isPremium, hasSeenPlanSelection: true }
      setUser(updatedUser)
      setPreferences((prev) => ({ ...prev, isPremium }))
      setCurrentScreen("main")

      if (isPremium) {
        toast({
          title: "¡Bienvenido a Premium!",
          description: "Ahora tienes acceso a todas las funciones premium de FutureTask.",
        })
      }
    }
  }

  const handleSignOut = () => {
    setUser(null)
    setCurrentScreen("welcome")
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    })
  }

  const handleUpgrade = () => {
    setCurrentScreen("planSelection")
  }

  const handlePreferencesChange = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences)
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setPreferences((prev) => ({ ...prev, language: newLanguage }))
  }

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    addTask(taskData)
    setStats((prev) => ({ ...prev, todayTasks: prev.todayTasks + 1 }))
  }

  const handleToggleTask = (taskId: string) => {
    toggleTask(taskId)
    const task = tasks.find((t) => t.id === taskId)
    if (task && !task.completed) {
      setStats((prev) => ({
        ...prev,
        totalTasksCompleted: prev.totalTasksCompleted + 1,
        streak: prev.streak + 1,
      }))
    }
  }

  // Render current screen
  if (currentScreen === "welcome") {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />
  }

  if (currentScreen === "auth") {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} language={language} onLanguageChange={handleLanguageChange} />
  }

  if (currentScreen === "planSelection") {
    return (
      <PlanSelection onPlanSelected={handlePlanSelection} language={language} onLanguageChange={handleLanguageChange} />
    )
  }

  // Main application
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <CalendarView
        user={user}
        preferences={preferences}
        onPreferencesChange={handlePreferencesChange}
        tasks={tasks}
        onAddTask={handleAddTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onToggleTask={handleToggleTask}
        achievements={achievements}
        stats={stats}
        language={language}
        onLanguageChange={handleLanguageChange}
        onSignOut={handleSignOut}
        onUpgrade={handleUpgrade}
        isPremium={user?.isPremium || false}
      />
    </div>
  )
}

type User = {
  id: string
  name: string
  email: string
  isAuthenticated: boolean
  isPremium: boolean
  hasSeenPlanSelection: boolean
}
