"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Plus,
  Settings,
  Trophy,
  BarChart3,
  Clock,
  Search,
  Zap,
  Crown,
  LogOut,
  Menu,
  Check,
  AlertCircle,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  Briefcase,
  Heart,
  Activity,
  BookOpen,
  ShoppingCart,
  Plane,
  Home,
  Gamepad2,
} from "lucide-react"
import { format, isSameDay } from "date-fns"
import type { Task, UserPreferences, Achievement, Stats, Language, ViewMode } from "@/types"

// Define constants locally to avoid import issues
const TASK_CATEGORIES = [
  { id: "work", name: { en: "Work", es: "Trabajo" }, icon: Briefcase, color: "blue" },
  { id: "personal", name: { en: "Personal", es: "Personal" }, icon: Heart, color: "pink" },
  { id: "health", name: { en: "Health", es: "Salud" }, icon: Activity, color: "green" },
  { id: "learning", name: { en: "Learning", es: "Aprendizaje" }, icon: BookOpen, color: "purple" },
  { id: "shopping", name: { en: "Shopping", es: "Compras" }, icon: ShoppingCart, color: "orange" },
  { id: "travel", name: { en: "Travel", es: "Viajes" }, icon: Plane, color: "cyan" },
  { id: "home", name: { en: "Home", es: "Hogar" }, icon: Home, color: "yellow" },
  { id: "entertainment", name: { en: "Entertainment", es: "Entretenimiento" }, icon: Gamepad2, color: "red" },
]

const PRIORITY_COLORS = {
  low: "bg-green-500/20 text-green-300 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  high: "bg-red-500/20 text-red-300 border-red-500/30",
}

interface User {
  name: string
  email: string
  isAuthenticated: boolean
}

interface CalendarViewProps {
  user?: User | null
  preferences: UserPreferences
  onPreferencesChange: (preferences: UserPreferences) => void
  tasks: Task[]
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  onToggleTask: (id: string) => void
  achievements?: Achievement[]
  stats?: Stats
  language: Language
  onLanguageChange: (lang: Language) => void
  onSignOut: () => void
  onUpgrade: () => void
  isPremium?: boolean
}

export function CalendarView({
  user,
  preferences,
  onPreferencesChange,
  tasks = [], // Default to empty array to prevent filter error
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  achievements = [],
  stats = {
    dailyStreak: 0,
    totalTasksCompleted: 0,
    totalTimeSpent: 0,
    todayTasks: 0,
    weekTasks: 0,
    pomodoroSessions: 0,
    focusTime: 0,
    streak: 0,
  },
  language,
  onLanguageChange,
  onSignOut,
  onUpgrade,
  isPremium = false,
}: CalendarViewProps) {
  const [currentView, setCurrentView] = useState<ViewMode>("agenda")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [showCompleted, setShowCompleted] = useState(true)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { toast } = useToast()

  // Safe access to preferences with defaults
  const safePreferences = {
    selectedTheme: "purple",
    backgroundGradient: "from-slate-900 via-purple-900 to-slate-900",
    isPremium: false,
    userName: "Usuario",
    ...preferences,
  }

  const translations = {
    en: {
      appName: "FutureTask",
      addTask: "Add Task",
      search: "Search tasks...",
      pomodoro: "Pomodoro",
      settings: "Settings",
      signOut: "Sign Out",
      upgrade: "Upgrade to Premium",
      managePremium: "Manage Premium",
      todayTasks: "Today's Tasks",
      completed: "Completed",
      noTasks: "No tasks found",
      createFirst: "Create your first task to get started.",
      month: "Month",
      week: "Week",
      day: "Day",
      agenda: "Agenda",
      achievements: "Achievements",
      statistics: "Statistics",
      filters: "Filters",
      allCategories: "All Categories",
      allPriorities: "All Priorities",
      showCompleted: "Show Completed",
    },
    es: {
      appName: "FutureTask",
      addTask: "Añadir Tarea",
      search: "Buscar tareas...",
      pomodoro: "Pomodoro",
      settings: "Configuración",
      signOut: "Cerrar Sesión",
      upgrade: "Actualizar a Premium",
      managePremium: "Gestionar Premium",
      todayTasks: "Tareas de Hoy",
      completed: "Completadas",
      noTasks: "No se encontraron tareas",
      createFirst: "Crea tu primera tarea para comenzar.",
      month: "Mes",
      week: "Semana",
      day: "Día",
      agenda: "Agenda",
      achievements: "Logros",
      statistics: "Estadísticas",
      filters: "Filtros",
      allCategories: "Todas las Categorías",
      allPriorities: "Todas las Prioridades",
      showCompleted: "Mostrar Completadas",
    },
    fr: {
      appName: "FutureTask",
      addTask: "Ajouter Tâche",
      search: "Rechercher tâches...",
      pomodoro: "Pomodoro",
      settings: "Paramètres",
      signOut: "Se Déconnecter",
      upgrade: "Passer à Premium",
      managePremium: "Gérer Premium",
      todayTasks: "Tâches d'Aujourd'hui",
      completed: "Terminées",
      noTasks: "Aucune tâche trouvée",
      createFirst: "Créez votre première tâche pour commencer.",
      month: "Mois",
      week: "Semaine",
      day: "Jour",
      agenda: "Agenda",
      achievements: "Réalisations",
      statistics: "Statistiques",
      filters: "Filtres",
      allCategories: "Toutes les Catégories",
      allPriorities: "Toutes les Priorités",
      showCompleted: "Afficher Terminées",
    },
    de: {
      appName: "FutureTask",
      addTask: "Aufgabe Hinzufügen",
      search: "Aufgaben suchen...",
      pomodoro: "Pomodoro",
      settings: "Einstellungen",
      signOut: "Abmelden",
      upgrade: "Auf Premium Upgraden",
      managePremium: "Premium Verwalten",
      todayTasks: "Heutige Aufgaben",
      completed: "Abgeschlossen",
      noTasks: "Keine Aufgaben gefunden",
      createFirst: "Erstelle deine erste Aufgabe um zu beginnen.",
      month: "Monat",
      week: "Woche",
      day: "Tag",
      agenda: "Agenda",
      achievements: "Erfolge",
      statistics: "Statistiken",
      filters: "Filter",
      allCategories: "Alle Kategorien",
      allPriorities: "Alle Prioritäten",
      showCompleted: "Abgeschlossene Anzeigen",
    },
    it: {
      appName: "FutureTask",
      addTask: "Aggiungi Attività",
      search: "Cerca attività...",
      pomodoro: "Pomodoro",
      settings: "Impostazioni",
      signOut: "Disconnetti",
      upgrade: "Aggiorna a Premium",
      managePremium: "Gestisci Premium",
      todayTasks: "Attività di Oggi",
      completed: "Completate",
      noTasks: "Nessuna attività trovata",
      createFirst: "Crea la tua prima attività per iniziare.",
      month: "Mese",
      week: "Settimana",
      day: "Giorno",
      agenda: "Agenda",
      achievements: "Risultati",
      statistics: "Statistiche",
      filters: "Filtri",
      allCategories: "Tutte le Categorie",
      allPriorities: "Tutte le Priorità",
      showCompleted: "Mostra Completate",
    },
  }

  const t = translations[language] || translations.es

  // Safe filtering with default empty array
  const filteredTasks = (tasks || []).filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = filterCategory === "all" || task.category === filterCategory
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesCompleted = showCompleted || !task.completed

    return matchesSearch && matchesCategory && matchesPriority && matchesCompleted
  })

  const todayTasks = (tasks || []).filter((task) => isSameDay(task.date, new Date()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 transition-all duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent)] pointer-events-none" />

      {/* Free Plan Ad Banner */}
      {!safePreferences.isPremium && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 text-center text-sm relative z-50">
          <span className="mr-2">
            🚀{" "}
            {language === "es" ? "Actualiza a Premium por solo €2.99/mes!" : "Upgrade to Premium for just €2.99/month!"}
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={onUpgrade}
            className="ml-2 bg-white/20 hover:bg-white/30 text-white border-white/20"
          >
            {language === "es" ? "Actualizar Ahora" : "Upgrade Now"}
          </Button>
        </div>
      )}

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-white hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">{t.appName}</h1>
                {safePreferences.isPremium && (
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
                  className="pl-10 bg-white/10 border-purple-500/30 text-white placeholder:text-white/60 w-64 focus:border-purple-400"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAchievements(true)}
                className="text-white hover:bg-white/10"
              >
                <Trophy className="h-4 w-4 mr-2" />
                {t.achievements}
              </Button>

              <Button
                onClick={() => setShowTaskDialog(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white border-purple-500/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.addTask}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {safePreferences.userName ? safePreferences.userName.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-purple-500/30">
                  <DropdownMenuItem onClick={() => setShowStatistics(true)} className="text-white hover:bg-white/10">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {t.statistics}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSettings(true)} className="text-white hover:bg-white/10">
                    <Settings className="h-4 w-4 mr-2" />
                    {t.settings}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onUpgrade} className="text-white hover:bg-white/10">
                    <Crown className="h-4 w-4 mr-2" />
                    {safePreferences.isPremium ? t.managePremium : t.upgrade}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onSignOut} className="text-white hover:bg-white/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t.signOut}
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
          {/* View Selector */}
          <div className="mb-6">
            <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as ViewMode)}>
              <TabsList className="bg-black/20 border-purple-500/30">
                <TabsTrigger
                  value="month"
                  className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  {t.month}
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  {t.week}
                </TabsTrigger>
                <TabsTrigger
                  value="day"
                  className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  {t.day}
                </TabsTrigger>
                <TabsTrigger
                  value="agenda"
                  className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  {t.agenda}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tasks Display */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{t.noTasks}</h3>
                  <p className="text-purple-200 mb-4">{t.createFirst}</p>
                  <Button
                    onClick={() => setShowTaskDialog(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white border-purple-500/30"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t.addTask}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => {
                const category = TASK_CATEGORIES.find((c) => c.id === task.category)
                const CategoryIcon = category?.icon || Calendar

                return (
                  <Card
                    key={task.id}
                    className="bg-black/20 backdrop-blur-md border-purple-500/30 hover:bg-black/30 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleTask(task.id)}
                          className="p-0 h-auto text-white hover:bg-white/10 mt-1"
                        >
                          {task.completed ? (
                            <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          ) : (
                            <div className="h-5 w-5 border-2 border-purple-400 rounded-full" />
                          )}
                        </Button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3
                              className={`text-lg font-semibold text-white ${task.completed ? "line-through opacity-60" : ""}`}
                            >
                              {task.title}
                            </h3>
                            <Badge className={`${PRIORITY_COLORS[task.priority]} text-xs`}>
                              {task.priority === "low" ? "Baja" : task.priority === "medium" ? "Media" : "Alta"}
                            </Badge>
                            {task.priority === "high" && <AlertCircle className="h-4 w-4 text-red-400" />}
                          </div>

                          {task.description && (
                            <p className={`text-purple-200 mb-2 ${task.completed ? "line-through opacity-60" : ""}`}>
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center space-x-4 text-sm text-purple-300">
                            <div className="flex items-center space-x-1">
                              <CategoryIcon className="h-4 w-4" />
                              <span>{category?.name[language] || task.category}</span>
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
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs bg-purple-500/20 text-purple-200 border-purple-500/30"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-purple-500/30">
                            <DropdownMenuItem className="text-white hover:bg-white/10">
                              <Edit3 className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-white/10">
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDeleteTask(task.id)}
                              className="text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
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
    </div>
  )
}

export default CalendarView
