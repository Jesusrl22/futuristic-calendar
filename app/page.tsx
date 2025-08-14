"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Settings,
  Plus,
  Search,
  Zap,
  Edit3,
  Trash2,
  MoreHorizontal,
  Menu,
  Check,
  AlertCircle,
  Crown,
  LogOut,
  Copy,
  Briefcase,
  Globe,
  Trophy,
  BarChart3,
  Bell,
  Volume2,
  VolumeX,
  Sparkles,
  Filter,
  SortAsc,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { LandingPage } from "@/components/landing-page"
import { AuthScreen } from "@/components/auth-screen"
import { PlanSelection } from "@/components/plan-selection"
import { WelcomeScreen } from "@/components/welcome-screen"
import { PricingSection } from "@/components/pricing-section"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { format, subDays, isSameDay } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { calculateStats } from "@/utils"
import { DEFAULT_PREFERENCES, ACHIEVEMENTS } from "@/constants"
import type { UserPreferences, Achievement, Task, AppUser, AppState, Language } from "@/types"
import { translations } from "@/constants/translations"
import { freeThemes, premiumThemes } from "@/constants/themes"
import { taskCategories } from "@/constants/categories"
import { priorityColors } from "@/constants/priority"

export default function Index() {
  const [appState, setAppState] = useState<AppState>("landing")
  const [language, setLanguage] = useState<Language>("en")
  const [user, setUser] = useState<AppUser | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState("agenda")
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCompleted, setShowCompleted] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPomodoro, setShowPomodoro] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium")
  const [taskCategory, setTaskCategory] = useState("work")
  const [taskDate, setTaskDate] = useState(new Date())
  const [taskTime, setTaskTime] = useState("09:00")
  const [taskTags, setTaskTags] = useState("")
  const [taskEstimatedTime, setTaskEstimatedTime] = useState(30)
  const [taskRecurring, setTaskRecurring] = useState<"none" | "daily" | "weekly" | "monthly">("none")
  const [taskReminder, setTaskReminder] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES)
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(ACHIEVEMENTS)
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    todayTasks: 0,
    weekTasks: 0,
    pomodoroSessions: 0,
    focusTime: 0,
    streak: 0,
    productivity: 0,
  })

  const t = translations[preferences.language]
  const currentTheme =
    [...freeThemes, ...premiumThemes].find((theme) => theme.id === preferences.selectedTheme) || freeThemes[0]

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("app-state")
    const savedLanguage = localStorage.getItem("app-language")
    const savedUser = localStorage.getItem("app-user")
    const savedPlan = localStorage.getItem("selected-plan")
    const savedPreferences = localStorage.getItem("futureTaskPreferences")
    const savedTasks = localStorage.getItem("futureTaskTasks")
    const savedAchievements = localStorage.getItem("futureTaskAchievements")

    if (savedLanguage) {
      setLanguage(savedLanguage as Language)
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (savedPlan) {
      setSelectedPlan(savedPlan)
    }

    if (savedState) {
      setAppState(savedState as AppState)
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser))

      if (savedPreferences) {
        const prefs = JSON.parse(savedPreferences)
        setPreferences(prefs)

        // Determine app state based on user progress
        if (!prefs.hasSelectedPlan) {
          setAppState("plan-selection")
        } else if (!prefs.userName) {
          setAppState("welcome")
        } else {
          setAppState("app")
        }
      } else {
        setAppState("plan-selection")
      }
    } else {
      setAppState("landing")
    }

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        date: new Date(task.date),
      }))
      setTasks(parsedTasks)
      const calculatedStats = calculateStats(parsedTasks, preferences.pomodoroTime)
      setStats(calculatedStats)
    }

    if (savedAchievements) {
      setUserAchievements(JSON.parse(savedAchievements))
    }
  }, [])

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("app-state", appState)
  }, [appState])

  useEffect(() => {
    localStorage.setItem("app-language", language)
    setPreferences({ ...preferences, language: language })
  }, [language])

  useEffect(() => {
    if (user) {
      localStorage.setItem("app-user", JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem("selected-plan", selectedPlan)
    }
  }, [selectedPlan])

  // Save data to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("futureTaskPreferences", JSON.stringify(preferences))
    }
  }, [preferences, user])

  useEffect(() => {
    if (user && tasks.length > 0) {
      localStorage.setItem("futureTaskTasks", JSON.stringify(tasks))
    }
  }, [tasks, user])

  useEffect(() => {
    if (user) {
      localStorage.setItem("futureTaskAchievements", JSON.stringify(userAchievements))
    }
  }, [userAchievements, user])

  // Initialize sample data when user completes onboarding
  useEffect(() => {
    if (user && tasks.length === 0 && preferences.userName && appState === "app") {
      const sampleTasks: Task[] = [
        {
          id: "1",
          title: preferences.language === "es" ? "Completar proyecto de React" : "Complete React project",
          description:
            preferences.language === "es"
              ? "Finalizar la aplicación de calendario con todas las funcionalidades"
              : "Finish the calendar application with all functionalities",
          completed: false,
          priority: "high",
          category: "work",
          dueDate: "2024-01-15",
          createdAt: "2024-01-10",
          pomodoroSessions: 3,
          date: new Date(),
          tags: ["react", "project"],
          subtasks: [],
        },
        {
          id: "2",
          title: preferences.language === "es" ? "Ejercicio matutino" : "Morning exercise",
          description:
            preferences.language === "es"
              ? "30 minutos de cardio y estiramientos"
              : "30 minutes of cardio and stretching",
          completed: true,
          priority: "medium",
          category: "health",
          dueDate: "2024-01-12",
          createdAt: "2024-01-12",
          pomodoroSessions: 1,
          date: new Date(),
          tags: ["health", "exercise"],
          subtasks: [],
        },
      ]

      setTasks(sampleTasks)
      const calculatedStats = calculateStats(sampleTasks, preferences.pomodoroTime)
      setStats(calculatedStats)
    }
  }, [user, preferences.language, preferences.userName, appState])

  const checkAchievements = (taskList: Task[]) => {
    const completedTasks = taskList.filter((task) => task.completed)
    const totalPomodoros = taskList.reduce((sum, task) => sum + task.pomodoroSessions, 0)
    const categoriesUsed = new Set(taskList.map((task) => task.category)).size

    const updatedAchievements = userAchievements.map((achievement) => {
      if (achievement.unlocked) return achievement

      let shouldUnlock = false
      let newProgress = achievement.progress || 0

      switch (achievement.id) {
        case "first_task":
          newProgress = completedTasks.length
          shouldUnlock = completedTasks.length >= 1
          break
        case "task_master_10":
          newProgress = completedTasks.length
          shouldUnlock = completedTasks.length >= 10
          break
        case "task_master_50":
          newProgress = completedTasks.length
          shouldUnlock = completedTasks.length >= 50
          break
        case "streak_week":
          newProgress = stats.streak
          shouldUnlock = stats.streak >= 7
          break
        case "pomodoro_master":
          newProgress = totalPomodoros
          shouldUnlock = totalPomodoros >= 50
          break
      }

      if (shouldUnlock && !achievement.unlocked) {
        toast.success(`🎉 ${t.unlocked}: ${achievement.title[preferences.language]}`)
        return { ...achievement, unlocked: true, unlockedAt: new Date(), progress: newProgress }
      }

      return { ...achievement, progress: newProgress }
    })

    setUserAchievements(updatedAchievements)
  }

  const handleGetStarted = () => {
    setAppState("auth")
  }

  const handleAuth = (userData: { email: string; name: string; isSignUp: boolean }) => {
    const newUser: AppUser = {
      id: crypto.randomUUID(),
      email: userData.email,
      name: userData.name,
      isAuthenticated: true,
    }

    setUser(newUser)
    localStorage.setItem("futureTaskUser", JSON.stringify(newUser))

    // Check if user has selected a plan before
    const savedPreferences = localStorage.getItem("futureTaskPreferences")
    if (savedPreferences) {
      const prefs = JSON.parse(savedPreferences)
      if (prefs.hasSelectedPlan) {
        if (prefs.userName) {
          setAppState("app")
        } else {
          setAppState("welcome")
        }
      } else {
        setAppState("plan-selection")
      }
    } else {
      setAppState("plan-selection")
    }
  }

  const handlePlanSelection = (plan: "free" | "monthly" | "yearly") => {
    const newPreferences = {
      ...preferences,
      hasSelectedPlan: true,
      isPremium: plan !== "free",
      premiumExpiry:
        plan !== "free" ? new Date(Date.now() + (plan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000) : undefined,
    }
    setPreferences(newPreferences)
    setAppState("welcome")

    if (plan !== "free") {
      toast.success(preferences.language === "es" ? "¡Bienvenido a Premium!" : "Welcome to Premium!")
    }
  }

  const handleWelcomeComplete = (welcomeData: { language: "en" | "es"; name: string; goals: string[] }) => {
    const newPreferences = {
      ...preferences,
      language: welcomeData.language,
      userName: welcomeData.name,
      userGoals: welcomeData.goals,
    }
    setPreferences(newPreferences)
    setAppState("app")
    toast.success(welcomeData.language === "es" ? `¡Bienvenido, ${welcomeData.name}!` : `Welcome, ${welcomeData.name}!`)
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setPreferences({ ...preferences, language: newLanguage })
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem("futureTaskUser")
    localStorage.removeItem("futureTaskPreferences")
    localStorage.removeItem("futureTaskTasks")
    localStorage.removeItem("futureTaskAchievements")
    setTasks([])
    setUserAchievements(ACHIEVEMENTS)
    setPreferences(DEFAULT_PREFERENCES)
    setAppState("landing")
  }

  const createTask = () => {
    if (!taskTitle.trim()) return

    // Check free plan limitations
    if (!preferences.isPremium && tasks.length >= 50) {
      toast.error(
        preferences.language === "es"
          ? "Has alcanzado el límite de 50 tareas. Actualiza a Premium para tareas ilimitadas."
          : "You've reached the 50 task limit. Upgrade to Premium for unlimited tasks.",
      )
      setAppState("pricing")
      return
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskTitle,
      description: taskDescription,
      date: new Date(taskDate.toDateString() + " " + taskTime),
      completed: false,
      priority: taskPriority,
      category: taskCategory,
      estimatedTime: taskEstimatedTime,
      tags: taskTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      subtasks: [],
      recurring: taskRecurring !== "none" ? taskRecurring : undefined,
      reminder: taskReminder ? subDays(new Date(taskDate.toDateString() + " " + taskTime), 1) : undefined,
      createdAt: new Date().toISOString(),
      pomodoroSessions: 0,
      dueDate: taskDate.toISOString().split("T")[0],
    }

    const updatedTasks = [newTask, ...tasks]
    setTasks(updatedTasks)
    const calculatedStats = calculateStats(updatedTasks, preferences.pomodoroTime)
    setStats(calculatedStats)
    checkAchievements(updatedTasks)
    resetTaskForm()
    setShowTaskDialog(false)

    toast.success(preferences.language === "es" ? "¡Tarea creada exitosamente!" : "Task created successfully!")
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    setTasks(updatedTasks)
    const calculatedStats = calculateStats(updatedTasks, preferences.pomodoroTime)
    setStats(calculatedStats)
    checkAchievements(updatedTasks)

    if (updates.completed) {
      toast.success(preferences.language === "es" ? "¡Tarea completada!" : "Task completed!")
    }
  }

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    const calculatedStats = calculateStats(updatedTasks, preferences.pomodoroTime)
    setStats(calculatedStats)
    toast.success(preferences.language === "es" ? "¡Tarea eliminada exitosamente!" : "Task deleted successfully!")
  }

  const resetTaskForm = () => {
    setTaskTitle("")
    setTaskDescription("")
    setTaskPriority("medium")
    setTaskCategory("work")
    setTaskDate(new Date())
    setTaskTime("09:00")
    setTaskTags("")
    setTaskEstimatedTime(30)
    setTaskRecurring("none")
    setTaskReminder(false)
    setEditingTask(null)
  }

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === "all" || task.category === filterCategory
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority
      const matchesCompleted = showCompleted || !task.completed

      return matchesSearch && matchesCategory && matchesPriority && matchesCompleted
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "dueDate":
          return a.date.getTime() - b.date.getTime()
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const todayTasks = tasks.filter((task) => isSameDay(task.date, new Date()))

  // Render different states
  if (appState === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} language={language} onLanguageChange={handleLanguageChange} />
  }

  if (appState === "auth") {
    return <AuthScreen onAuth={handleAuth} />
  }

  if (appState === "plan-selection") {
    return (
      <PlanSelection
        onBack={() => setAppState("auth")}
        onSelectPlan={handlePlanSelection}
        language={preferences.language}
      />
    )
  }

  if (appState === "welcome") {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />
  }

  if (appState === "pricing") {
    return (
      <PricingSection
        onBack={() => setAppState("app")}
        onUpgrade={(plan) => {
          const newPreferences = {
            ...preferences,
            isPremium: true,
            premiumExpiry: new Date(Date.now() + (plan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000),
          }
          setPreferences(newPreferences)
          setAppState("app")
          toast.success(preferences.language === "es" ? "¡Bienvenido a Premium!" : "Welcome to Premium!")
        }}
      />
    )
  }

  // Main app interface
  if (appState === "app") {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} transition-all duration-500`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

        {/* Ad Placeholder for Free Users */}
        {!preferences.isPremium && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 text-center text-sm relative z-50">
            <span className="mr-2">
              🚀{" "}
              {preferences.language === "es"
                ? "Actualiza a Premium por solo €0.99/mes!"
                : "Upgrade to Premium for just €0.99/month!"}
            </span>
            <Button size="sm" variant="secondary" onClick={() => setAppState("pricing")} className="ml-2">
              {preferences.language === "es" ? "Actualizar Ahora" : "Upgrade Now"}
            </Button>
          </div>
        )}

        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden text-white hover:bg-white/20"
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">{t.appName}</h1>
                  {preferences.isPremium && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    placeholder={t.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 w-64"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPomodoro(true)}
                  className="text-white hover:bg-white/20"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {t.pomodoro}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAchievements(true)}
                  className="text-white hover:bg-white/20"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  {t.achievements}
                </Button>

                <Button
                  onClick={() => setShowTaskDialog(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addTask}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>
                          {preferences.userName ? preferences.userName.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setShowStatistics(true)}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      {t.statistics}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowSettings(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      {t.settings}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAppState("pricing")}>
                      <Crown className="h-4 w-4 mr-2" />
                      {preferences.isPremium ? t.managePremium : t.upgrade}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {t.signOut}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowTaskDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t.addTask}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowPomodoro(true)}>
                      <Clock className="h-4 w-4 mr-2" />
                      {t.pomodoro}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowAchievements(true)}>
                      <Trophy className="h-4 w-4 mr-2" />
                      {t.achievements}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowStatistics(true)}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      {t.statistics}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowSettings(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      {t.settings}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Free Plan Limitation Warning */}
            {!preferences.isPremium && tasks.length >= 45 && (
              <Card className="bg-yellow-500/20 border-yellow-500/30 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                      <div>
                        <h3 className="text-white font-semibold">
                          {preferences.language === "es" ? "Límite de tareas" : "Task Limit"}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {preferences.language === "es"
                            ? `Has usado ${tasks.length}/50 tareas. Actualiza a Premium para tareas ilimitadas.`
                            : `You've used ${tasks.length}/50 tasks. Upgrade to Premium for unlimited tasks.`}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setAppState("pricing")}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      {preferences.language === "es" ? "Actualizar" : "Upgrade"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* View Selector and Filters */}
            <div className="mb-6 space-y-4">
              <Tabs value={currentView} onValueChange={setCurrentView}>
                <TabsList className="bg-white/10 border-white/20">
                  <TabsTrigger value="month" className="text-white data-[state=active]:bg-white/20">
                    {t.month}
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-white data-[state=active]:bg-white/20">
                    {t.week}
                  </TabsTrigger>
                  <TabsTrigger value="day" className="text-white data-[state=active]:bg-white/20">
                    {t.day}
                  </TabsTrigger>
                  <TabsTrigger value="agenda" className="text-white data-[state=active]:bg-white/20">
                    {t.agenda}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/60">{t.filters}:</span>
                </div>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={t.allCategories} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allCategories}</SelectItem>
                    {taskCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name[preferences.language]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={t.allPriorities} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allPriorities}</SelectItem>
                    <SelectItem value="high">{t.high}</SelectItem>
                    <SelectItem value="medium">{t.medium}</SelectItem>
                    <SelectItem value="low">{t.low}</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Switch checked={showCompleted} onCheckedChange={setShowCompleted} />
                  <span className="text-sm text-white/60">{t.showCompleted}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <SortAsc className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/60">{t.sortBy}:</span>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t.newest}</SelectItem>
                    <SelectItem value="oldest">{t.oldest}</SelectItem>
                    <SelectItem value="priority">{t.priority}</SelectItem>
                    <SelectItem value="dueDate">{t.dueDate}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">{t.noTasks}</h3>
                    <p className="text-white/60 mb-4">
                      {searchQuery || filterCategory !== "all" || filterPriority !== "all"
                        ? preferences.language === "es"
                          ? "Intenta ajustar tus filtros o consulta de búsqueda."
                          : "Try adjusting your filters or search query."
                        : t.createFirst}
                    </p>
                    <Button
                      onClick={() => setShowTaskDialog(true)}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t.addTask}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map((task) => {
                  const category = taskCategories.find((c) => c.id === task.category)
                  const CategoryIcon = category?.icon || Briefcase

                  return (
                    <Card
                      key={task.id}
                      className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateTask(task.id, { completed: !task.completed })}
                            className="p-0 h-auto text-white hover:bg-white/20 mt-1"
                          >
                            {task.completed ? (
                              <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 border-2 border-white/40 rounded-full" />
                            )}
                          </Button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3
                                className={`text-lg font-semibold text-white ${task.completed ? "line-through opacity-60" : ""}`}
                              >
                                {task.title}
                              </h3>
                              <Badge className={`${priorityColors[task.priority]} text-xs`}>{t[task.priority]}</Badge>
                              {task.priority === "high" && <AlertCircle className="h-4 w-4 text-red-400" />}
                            </div>

                            {task.description && (
                              <p className={`text-white/70 mb-2 ${task.completed ? "line-through opacity-60" : ""}`}>
                                {task.description}
                              </p>
                            )}

                            <div className="flex items-center space-x-4 text-sm text-white/60">
                              <div className="flex items-center space-x-1">
                                <CategoryIcon className="h-4 w-4" />
                                <span>{category?.name[preferences.language] || task.category}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{format(task.date, "MMM d, yyyy HH:mm")}</span>
                              </div>
                              {task.estimatedTime && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{task.estimatedTime}m</span>
                                </div>
                              )}
                            </div>

                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {task.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs bg-white/10 text-white/80">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingTask(task)
                                  setTaskTitle(task.title)
                                  setTaskDescription(task.description)
                                  setTaskPriority(task.priority)
                                  setTaskCategory(task.category)
                                  setTaskDate(task.date)
                                  setTaskTime(format(task.date, "HH:mm"))
                                  setShowTaskDialog(true)
                                }}
                              >
                                <Edit3 className="h-4 w-4 mr-2" />
                                {t.edit}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  const newTask = { ...task, id: crypto.randomUUID(), title: `${task.title} (Copy)` }
                                  const updatedTasks = [newTask, ...tasks]
                                  setTasks(updatedTasks)
                                  const calculatedStats = calculateStats(updatedTasks, preferences.pomodoroTime)
                                  setStats(calculatedStats)
                                }}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                {t.duplicate}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t.delete}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        </main>

        {/* Task Dialog */}
        <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
          <DialogContent className="sm:max-w-[600px] bg-white/10 backdrop-blur-md border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>{editingTask ? t.updateTask : t.createTask}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">{t.title}</Label>
                <Input
                  id="task-title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder={
                    preferences.language === "es" ? "Ingresa el título de la tarea..." : "Enter task title..."
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <div>
                <Label htmlFor="task-description">{t.description}</Label>
                <Textarea
                  id="task-description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder={
                    preferences.language === "es"
                      ? "Ingresa la descripción de la tarea..."
                      : "Enter task description..."
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-category">{t.category}</Label>
                  <Select value={taskCategory} onValueChange={setTaskCategory}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {taskCategories.map((category) => {
                        const Icon = category.icon
                        return (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span>{category.name[preferences.language]}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="task-priority">{t.priority}</Label>
                  <Select
                    value={taskPriority}
                    onValueChange={(value: "low" | "medium" | "high") => setTaskPriority(value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t.low}</SelectItem>
                      <SelectItem value="medium">{t.medium}</SelectItem>
                      <SelectItem value="high">{t.high}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-date">{t.date}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(taskDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={taskDate}
                        onSelect={(date) => date && setTaskDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="task-time">{t.time}</Label>
                  <Input
                    id="task-time"
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetTaskForm()
                    setShowTaskDialog(false)
                  }}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {t.cancel}
                </Button>
                <Button
                  onClick={
                    editingTask
                      ? () => {
                          if (editingTask) {
                            updateTask(editingTask.id, {
                              title: taskTitle,
                              description: taskDescription,
                              priority: taskPriority,
                              category: taskCategory,
                              date: new Date(taskDate.toDateString() + " " + taskTime),
                              estimatedTime: taskEstimatedTime,
                            })
                            resetTaskForm()
                            setShowTaskDialog(false)
                            toast.success(preferences.language === "es" ? "¡Tarea actualizada!" : "Task updated!")
                          }
                        }
                      : createTask
                  }
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  {editingTask ? t.updateTask : t.createTask}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="sm:max-w-[700px] bg-white/10 backdrop-blur-md border-white/20 text-white max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.settings}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
                <TabsTrigger value="general" className="text-white data-[state=active]:bg-white/20">
                  {t.general}
                </TabsTrigger>
                <TabsTrigger value="appearance" className="text-white data-[state=active]:bg-white/20">
                  {t.appearance}
                </TabsTrigger>
                <TabsTrigger value="premium" className="text-white data-[state=active]:bg-white/20">
                  {t.premium}
                </TabsTrigger>
                <TabsTrigger value="account" className="text-white data-[state=active]:bg-white/20">
                  {t.account}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span>{t.notifications}</span>
                    </Label>
                    <p className="text-sm text-white/60">
                      {preferences.language === "es"
                        ? "Recibir recordatorios de tareas y actualizaciones"
                        : "Receive task reminders and updates"}
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="flex items-center space-x-2">
                      {preferences.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      <span>{t.soundEffects}</span>
                    </Label>
                    <p className="text-sm text-white/60">
                      {preferences.language === "es"
                        ? "Reproducir sonidos para completar tareas y notificaciones"
                        : "Play sounds for task completion and notifications"}
                    </p>
                  </div>
                  <Switch
                    checked={preferences.soundEnabled}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, soundEnabled: checked })}
                  />
                </div>

                <div>
                  <Label className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>{t.language}</span>
                  </Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value: "en" | "es") => {
                      setLanguage(value)
                      setPreferences({ ...preferences, language: value })
                    }}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t.dailyGoal}</Label>
                  <div className="mt-2">
                    <Slider
                      value={[preferences.dailyGoal]}
                      onValueChange={(value) => setPreferences({ ...preferences, dailyGoal: value[0] })}
                      max={20}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-white/60 mt-1">
                      <span>1 {preferences.language === "es" ? "tarea" : "task"}</span>
                      <span className="font-medium text-white">
                        {preferences.dailyGoal} {preferences.language === "es" ? "tareas" : "tasks"}
                      </span>
                      <span>20 {preferences.language === "es" ? "tareas" : "tasks"}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6 mt-6">
                <div>
                  <Label className="text-lg font-semibold">{t.freeThemes}</Label>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {freeThemes.map((theme) => (
                      <Card
                        key={theme.id}
                        className={`cursor-pointer transition-all ${
                          preferences.selectedTheme === theme.id
                            ? "ring-2 ring-white bg-white/20"
                            : "bg-white/10 hover:bg-white/15"
                        } border-white/20`}
                        onClick={() =>
                          setPreferences({
                            ...preferences,
                            selectedTheme: theme.id,
                            backgroundGradient: theme.gradient,
                          })
                        }
                      >
                        <CardContent className="p-4">
                          <div className={`w-full h-16 rounded-lg ${theme.preview} mb-3`} />
                          <h3 className="text-white font-medium text-sm">{theme.name[preferences.language]}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg font-semibold">{t.premiumThemes}</Label>
                    {!preferences.isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {premiumThemes.map((theme) => (
                      <Card
                        key={theme.id}
                        className={`cursor-pointer transition-all relative ${
                          preferences.selectedTheme === theme.id && preferences.isPremium
                            ? "ring-2 ring-white bg-white/20"
                            : "bg-white/10 hover:bg-white/15"
                        } border-white/20 ${!preferences.isPremium ? "opacity-60" : ""}`}
                        onClick={() => {
                          if (preferences.isPremium) {
                            setPreferences({
                              ...preferences,
                              selectedTheme: theme.id,
                              backgroundGradient: theme.gradient,
                            })
                          } else {
                            setAppState("pricing")
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className={`w-full h-16 rounded-lg ${theme.preview} mb-3`} />
                          <h3 className="text-white font-medium text-sm">{theme.name[preferences.language]}</h3>
                          {!preferences.isPremium && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                              <Crown className="h-6 w-6 text-yellow-400" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {!preferences.isPremium && (
                    <p className="text-sm text-white/60 mt-4 text-center">{t.upgradeForThemes}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="premium" className="space-y-6 mt-6">
                {preferences.isPremium ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                      <Crown className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {preferences.language === "es" ? "¡Eres Premium!" : "You're Premium!"}
                    </h3>
                    <p className="text-white/70">
                      {preferences.language === "es"
                        ? "Disfruta de todas las funciones premium sin límites."
                        : "Enjoy all premium features without limits."}
                    </p>
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">
                        {preferences.language === "es" ? "Funciones Premium:" : "Premium Features:"}
                      </h4>
                      <ul className="text-sm text-white/80 space-y-1">
                        <li>✓ {preferences.language === "es" ? "Tareas ilimitadas" : "Unlimited tasks"}</li>
                        <li>✓ {preferences.language === "es" ? "Temas premium" : "Premium themes"}</li>
                        <li>✓ {preferences.language === "es" ? "Sin anuncios" : "Ad-free experience"}</li>
                        <li>✓ {preferences.language === "es" ? "Estadísticas avanzadas" : "Advanced statistics"}</li>
                        <li>✓ {preferences.language === "es" ? "Soporte prioritario" : "Priority support"}</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {preferences.language === "es" ? "Desbloquea Premium" : "Unlock Premium"}
                    </h3>
                    <p className="text-white/70">
                      {preferences.language === "es"
                        ? "Obtén acceso a todas las funciones premium por solo €0.99/mes."
                        : "Get access to all premium features for just €0.99/month."}
                    </p>
                    <Button
                      onClick={() => setAppState("pricing")}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      {preferences.language === "es" ? "Actualizar Ahora" : "Upgrade Now"}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="account" className="space-y-4 mt-6">
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {preferences.userName ? preferences.userName.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-white">{preferences.userName || user?.name}</h3>
                    <p className="text-sm text-white/60">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                    <div>
                      <Label className="text-white">
                        {preferences.language === "es" ? "Cuenta creada" : "Account created"}
                      </Label>
                      <p className="text-sm text-white/60">
                        {preferences.language === "es" ? "Enero 2024" : "January 2024"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                    <div>
                      <Label className="text-white">
                        {preferences.language === "es" ? "Tareas completadas" : "Tasks completed"}
                      </Label>
                      <p className="text-sm text-white/60">{stats.completedTasks}</p>
                    </div>
                  </div>

                  <Button onClick={handleSignOut} variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t.signOut}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Achievements Dialog */}
        <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
          <DialogContent className="sm:max-w-[700px] bg-white/10 backdrop-blur-md border-white/20 text-white max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span>{t.achievements}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">
                    {userAchievements.filter((a) => a.unlocked).length}
                  </div>
                  <div className="text-sm text-white/60">{t.unlocked}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{userAchievements.length}</div>
                  <div className="text-sm text-white/60">Total</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{stats.streak}</div>
                  <div className="text-sm text-white/60">{t.currentStreak}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{stats.productivity}%</div>
                  <div className="text-sm text-white/60">{t.productivity}</div>
                </div>
              </div>

              <ScrollArea className="h-96">
                <div className="grid gap-4">
                  {userAchievements.map((achievement) => {
                    const rarityColors = {
                      common: "bg-gray-500",
                      rare: "bg-blue-500",
                      epic: "bg-purple-500",
                      legendary: "bg-yellow-500",
                    }

                    return (
                      <Card
                        key={achievement.id}
                        className={`${
                          achievement.unlocked
                            ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
                            : "bg-white/10 border-white/20 opacity-60"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-white">{achievement.title[preferences.language]}</h3>
                                <Badge className={`text-xs ${rarityColors[achievement.rarity]}`}>
                                  {t[
                                    `rarity${achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}` as keyof typeof t
                                  ] || achievement.rarity}
                                </Badge>
                              </div>
                              <p className="text-sm text-white/70">{achievement.description[preferences.language]}</p>

                              {/* Progress bar for achievements with progress */}
                              {achievement.maxProgress && achievement.maxProgress > 1 && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs text-white/60 mb-1">
                                    <span>{t.progress}</span>
                                    <span>
                                      {achievement.progress || 0} / {achievement.maxProgress}
                                    </span>
                                  </div>
                                  <Progress
                                    value={((achievement.progress || 0) / achievement.maxProgress) * 100}
                                    className="h-2 bg-white/20"
                                  />
                                </div>
                              )}

                              {achievement.unlocked && achievement.unlockedAt && (
                                <p className="text-xs text-white/50 mt-1">
                                  {preferences.language === "es" ? "Desbloqueado el" : "Unlocked on"}{" "}
                                  {format(achievement.unlockedAt, "MMM d, yyyy")}
                                </p>
                              )}
                            </div>
                            {achievement.unlocked ? (
                              <Check className="h-5 w-5 text-green-400" />
                            ) : (
                              <div className="h-5 w-5 border border-white/40 rounded" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>

        {/* Statistics Dialog */}
        <Dialog open={showStatistics} onOpenChange={setShowStatistics}>
          <DialogContent className="sm:max-w-[700px] bg-white/10 backdrop-blur-md border-white/20 text-white max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <span>{t.statistics}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white">{stats.totalTasks}</div>
                    <div className="text-sm text-white/60">{t.totalTasks}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white">{stats.completedTasks}</div>
                    <div className="text-sm text-white/60">{t.completedTasks}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white">{stats.pomodoroSessions}</div>
                    <div className="text-sm text-white/60">{t.pomodoroSessions}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white">{stats.focusTime}m</div>
                    <div className="text-sm text-white/60">{t.focusTime}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-white">{t.dailyGoal}</Label>
                    <span className="text-sm text-white/60">
                      {stats.todayTasks} / {preferences.dailyGoal}
                    </span>
                  </div>
                  <Progress value={(stats.todayTasks / preferences.dailyGoal) * 100} className="h-2 bg-white/20" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-white">{t.weeklyGoal}</Label>
                    <span className="text-sm text-white/60">
                      {stats.weekTasks} / {preferences.weeklyGoal}
                    </span>
                  </div>
                  <Progress value={(stats.weekTasks / preferences.weeklyGoal) * 100} className="h-2 bg-white/20" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-white">{t.productivity}</Label>
                    <span className="text-sm text-white/60">{stats.productivity}%</span>
                  </div>
                  <Progress value={stats.productivity} className="h-2 bg-white/20" />
                </div>
              </div>

              {/* Category Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {preferences.language === "es" ? "Tareas por Categoría" : "Tasks by Category"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {taskCategories.map((category) => {
                    const categoryTasks = tasks.filter((task) => task.category === category.id)
                    const Icon = category.icon
                    return (
                      <div key={category.id} className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                        <Icon className="h-5 w-5 text-white" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{category.name[preferences.language]}</div>
                          <div className="text-xs text-white/60">
                            {categoryTasks.length} {preferences.language === "es" ? "tareas" : "tasks"}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-white">{categoryTasks.length}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pomodoro Timer Dialog */}
        <Dialog open={showPomodoro} onOpenChange={setShowPomodoro}>
          <DialogContent className="sm:max-w-[400px] bg-white/10 backdrop-blur-md border-white/20 text-white">
            <PomodoroTimer
              preferences={preferences}
              onClose={() => setShowPomodoro(false)}
              onComplete={(sessionType) => {
                toast.success(
                  sessionType === "focus"
                    ? preferences.language === "es"
                      ? "¡Sesión de enfoque completada!"
                      : "Focus session complete!"
                    : preferences.language === "es"
                      ? "¡Hora del descanso!"
                      : "Break time!",
                )
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return null
}
