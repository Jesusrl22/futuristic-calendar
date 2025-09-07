"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarWidget } from "@/components/calendar-widget"
import { StatsCards } from "@/components/stats-cards"
import { TaskForm } from "@/components/task-form"
import { NotificationService } from "@/components/notification-service"
import { DatabaseStatus } from "@/components/database-status"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  Trophy,
  Settings,
  User,
  Bell,
  Globe,
  Palette,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  Crown,
  Zap,
  Home,
  ChevronDown,
  Sparkles,
  Gift,
  Award,
  Activity,
  CalendarIcon as CalendarIconAlt,
  ListTodo,
  StickyNote,
} from "lucide-react"
import { format, isSameDay, parseISO } from "date-fns"
import { es, enUS as en, fr, de, it } from "date-fns/locale"
import {
  createUser,
  getUser,
  updateUser,
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  createWishlistItem,
  getWishlistItems,
  updateWishlistItem,
  deleteWishlistItem,
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  createAchievement,
  getAchievements,
  syncLocalToSupabase,
  syncSupabaseToLocal,
  type User as UserType,
  type Task,
  type WishlistItem,
  type Note,
  type Achievement,
} from "@/lib/database"

// Themes
const themes = {
  default: {
    name: "Predeterminado",
    primary: "from-purple-600 to-blue-600",
    secondary: "from-purple-500/20 to-blue-500/20",
    accent: "purple-500",
    background: "from-gray-900 via-purple-900 to-violet-900",
  },
  ocean: {
    name: "Océano",
    primary: "from-blue-600 to-cyan-600",
    secondary: "from-blue-500/20 to-cyan-500/20",
    accent: "blue-500",
    background: "from-gray-900 via-blue-900 to-cyan-900",
  },
  forest: {
    name: "Bosque",
    primary: "from-green-600 to-emerald-600",
    secondary: "from-green-500/20 to-emerald-500/20",
    accent: "green-500",
    background: "from-gray-900 via-green-900 to-emerald-900",
  },
  sunset: {
    name: "Atardecer",
    primary: "from-orange-600 to-red-600",
    secondary: "from-orange-500/20 to-red-500/20",
    accent: "orange-500",
    background: "from-gray-900 via-orange-900 to-red-900",
  },
  rose: {
    name: "Rosa",
    primary: "from-pink-600 to-rose-600",
    secondary: "from-pink-500/20 to-rose-500/20",
    accent: "pink-500",
    background: "from-gray-900 via-pink-900 to-rose-900",
  },
  gold: {
    name: "Oro",
    primary: "from-yellow-600 to-amber-600",
    secondary: "from-yellow-500/20 to-amber-500/20",
    accent: "yellow-500",
    background: "from-gray-900 via-yellow-900 to-amber-900",
  },
  lavender: {
    name: "Lavanda",
    primary: "from-violet-600 to-purple-600",
    secondary: "from-violet-500/20 to-purple-500/20",
    accent: "violet-500",
    background: "from-gray-900 via-violet-900 to-purple-900",
  },
  mint: {
    name: "Menta",
    primary: "from-teal-600 to-green-600",
    secondary: "from-teal-500/20 to-green-500/20",
    accent: "teal-500",
    background: "from-gray-900 via-teal-900 to-green-900",
  },
  cosmic: {
    name: "Cósmico",
    primary: "from-indigo-600 to-purple-600",
    secondary: "from-indigo-500/20 to-purple-500/20",
    accent: "indigo-500",
    background: "from-gray-900 via-indigo-900 to-purple-900",
  },
  fire: {
    name: "Fuego",
    primary: "from-red-600 to-orange-600",
    secondary: "from-red-500/20 to-orange-500/20",
    accent: "red-500",
    background: "from-gray-900 via-red-900 to-orange-900",
  },
}

// Languages
const languages = {
  es: { name: "Español", locale: es },
  en: { name: "English", locale: en },
  fr: { name: "Français", locale: fr },
  de: { name: "Deutsch", locale: de },
  it: { name: "Italiano", locale: it },
}

// Translations
const translations = {
  es: {
    // Navigation
    dashboard: "Panel Principal",
    tasks: "Tareas",
    calendar: "Calendario",
    wishlist: "Lista de Deseos",
    notes: "Notas",
    pomodoro: "Pomodoro",
    achievements: "Logros",
    settings: "Configuración",

    // User
    welcome: "Bienvenido",
    profile: "Perfil",
    premium: "Premium",

    // Tasks
    addTask: "Agregar Tarea",
    editTask: "Editar Tarea",
    deleteTask: "Eliminar Tarea",
    taskTitle: "Título de la tarea",
    taskDescription: "Descripción",
    taskCategory: "Categoría",
    taskPriority: "Prioridad",
    taskDate: "Fecha",
    taskTime: "Hora",
    completed: "Completada",
    pending: "Pendiente",

    // Categories
    work: "Trabajo",
    personal: "Personal",
    health: "Salud",
    learning: "Aprendizaje",
    other: "Otro",

    // Priority
    low: "Baja",
    medium: "Media",
    high: "Alta",

    // Calendar
    today: "Hoy",
    tomorrow: "Mañana",
    yesterday: "Ayer",
    thisWeek: "Esta Semana",
    nextWeek: "Próxima Semana",

    // Pomodoro
    workSession: "Sesión de Trabajo",
    shortBreak: "Descanso Corto",
    longBreak: "Descanso Largo",
    start: "Iniciar",
    pause: "Pausar",
    reset: "Reiniciar",

    // Settings
    language: "Idioma",
    theme: "Tema",
    notifications: "Notificaciones",
    account: "Cuenta",

    // Common
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Agregar",
    close: "Cerrar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",

    // Stats
    totalTasks: "Total de Tareas",
    completedTasks: "Tareas Completadas",
    pendingTasks: "Tareas Pendientes",
    completionRate: "Tasa de Finalización",

    // Premium features
    premiumFeature: "Función Premium",
    upgradeToPremium: "Actualizar a Premium",
    premiumBenefits: "Beneficios Premium",
  },
  en: {
    // Navigation
    dashboard: "Dashboard",
    tasks: "Tasks",
    calendar: "Calendar",
    wishlist: "Wishlist",
    notes: "Notes",
    pomodoro: "Pomodoro",
    achievements: "Achievements",
    settings: "Settings",

    // User
    welcome: "Welcome",
    profile: "Profile",
    premium: "Premium",

    // Tasks
    addTask: "Add Task",
    editTask: "Edit Task",
    deleteTask: "Delete Task",
    taskTitle: "Task title",
    taskDescription: "Description",
    taskCategory: "Category",
    taskPriority: "Priority",
    taskDate: "Date",
    taskTime: "Time",
    completed: "Completed",
    pending: "Pending",

    // Categories
    work: "Work",
    personal: "Personal",
    health: "Health",
    learning: "Learning",
    other: "Other",

    // Priority
    low: "Low",
    medium: "Medium",
    high: "High",

    // Calendar
    today: "Today",
    tomorrow: "Tomorrow",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    nextWeek: "Next Week",

    // Pomodoro
    workSession: "Work Session",
    shortBreak: "Short Break",
    longBreak: "Long Break",
    start: "Start",
    pause: "Pause",
    reset: "Reset",

    // Settings
    language: "Language",
    theme: "Theme",
    notifications: "Notifications",
    account: "Account",

    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    close: "Close",
    loading: "Loading...",
    error: "Error",
    success: "Success",

    // Stats
    totalTasks: "Total Tasks",
    completedTasks: "Completed Tasks",
    pendingTasks: "Pending Tasks",
    completionRate: "Completion Rate",

    // Premium features
    premiumFeature: "Premium Feature",
    upgradeToPremium: "Upgrade to Premium",
    premiumBenefits: "Premium Benefits",
  },
  fr: {
    // Navigation
    dashboard: "Tableau de Bord",
    tasks: "Tâches",
    calendar: "Calendrier",
    wishlist: "Liste de Souhaits",
    notes: "Notes",
    pomodoro: "Pomodoro",
    achievements: "Réalisations",
    settings: "Paramètres",

    // User
    welcome: "Bienvenue",
    profile: "Profil",
    premium: "Premium",

    // Tasks
    addTask: "Ajouter une Tâche",
    editTask: "Modifier la Tâche",
    deleteTask: "Supprimer la Tâche",
    taskTitle: "Titre de la tâche",
    taskDescription: "Description",
    taskCategory: "Catégorie",
    taskPriority: "Priorité",
    taskDate: "Date",
    taskTime: "Heure",
    completed: "Terminée",
    pending: "En Attente",

    // Categories
    work: "Travail",
    personal: "Personnel",
    health: "Santé",
    learning: "Apprentissage",
    other: "Autre",

    // Priority
    low: "Faible",
    medium: "Moyenne",
    high: "Élevée",

    // Calendar
    today: "Aujourd'hui",
    tomorrow: "Demain",
    yesterday: "Hier",
    thisWeek: "Cette Semaine",
    nextWeek: "Semaine Prochaine",

    // Pomodoro
    workSession: "Session de Travail",
    shortBreak: "Pause Courte",
    longBreak: "Pause Longue",
    start: "Commencer",
    pause: "Pause",
    reset: "Réinitialiser",

    // Settings
    language: "Langue",
    theme: "Thème",
    notifications: "Notifications",
    account: "Compte",

    // Common
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    close: "Fermer",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",

    // Stats
    totalTasks: "Total des Tâches",
    completedTasks: "Tâches Terminées",
    pendingTasks: "Tâches en Attente",
    completionRate: "Taux de Réalisation",

    // Premium features
    premiumFeature: "Fonction Premium",
    upgradeToPremium: "Passer à Premium",
    premiumBenefits: "Avantages Premium",
  },
  de: {
    // Navigation
    dashboard: "Dashboard",
    tasks: "Aufgaben",
    calendar: "Kalender",
    wishlist: "Wunschliste",
    notes: "Notizen",
    pomodoro: "Pomodoro",
    achievements: "Erfolge",
    settings: "Einstellungen",

    // User
    welcome: "Willkommen",
    profile: "Profil",
    premium: "Premium",

    // Tasks
    addTask: "Aufgabe Hinzufügen",
    editTask: "Aufgabe Bearbeiten",
    deleteTask: "Aufgabe Löschen",
    taskTitle: "Aufgabentitel",
    taskDescription: "Beschreibung",
    taskCategory: "Kategorie",
    taskPriority: "Priorität",
    taskDate: "Datum",
    taskTime: "Zeit",
    completed: "Abgeschlossen",
    pending: "Ausstehend",

    // Categories
    work: "Arbeit",
    personal: "Persönlich",
    health: "Gesundheit",
    learning: "Lernen",
    other: "Andere",

    // Priority
    low: "Niedrig",
    medium: "Mittel",
    high: "Hoch",

    // Calendar
    today: "Heute",
    tomorrow: "Morgen",
    yesterday: "Gestern",
    thisWeek: "Diese Woche",
    nextWeek: "Nächste Woche",

    // Pomodoro
    workSession: "Arbeitssitzung",
    shortBreak: "Kurze Pause",
    longBreak: "Lange Pause",
    start: "Starten",
    pause: "Pausieren",
    reset: "Zurücksetzen",

    // Settings
    language: "Sprache",
    theme: "Design",
    notifications: "Benachrichtigungen",
    account: "Konto",

    // Common
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    edit: "Bearbeiten",
    add: "Hinzufügen",
    close: "Schließen",
    loading: "Laden...",
    error: "Fehler",
    success: "Erfolg",

    // Stats
    totalTasks: "Gesamte Aufgaben",
    completedTasks: "Erledigte Aufgaben",
    pendingTasks: "Ausstehende Aufgaben",
    completionRate: "Abschlussrate",

    // Premium features
    premiumFeature: "Premium-Funktion",
    upgradeToPremium: "Auf Premium Upgraden",
    premiumBenefits: "Premium-Vorteile",
  },
  it: {
    // Navigation
    dashboard: "Dashboard",
    tasks: "Attività",
    calendar: "Calendario",
    wishlist: "Lista dei Desideri",
    notes: "Note",
    pomodoro: "Pomodoro",
    achievements: "Risultati",
    settings: "Impostazioni",

    // User
    welcome: "Benvenuto",
    profile: "Profilo",
    premium: "Premium",

    // Tasks
    addTask: "Aggiungi Attività",
    editTask: "Modifica Attività",
    deleteTask: "Elimina Attività",
    taskTitle: "Titolo dell'attività",
    taskDescription: "Descrizione",
    taskCategory: "Categoria",
    taskPriority: "Priorità",
    taskDate: "Data",
    taskTime: "Ora",
    completed: "Completata",
    pending: "In Sospeso",

    // Categories
    work: "Lavoro",
    personal: "Personale",
    health: "Salute",
    learning: "Apprendimento",
    other: "Altro",

    // Priority
    low: "Bassa",
    medium: "Media",
    high: "Alta",

    // Calendar
    today: "Oggi",
    tomorrow: "Domani",
    yesterday: "Ieri",
    thisWeek: "Questa Settimana",
    nextWeek: "Prossima Settimana",

    // Pomodoro
    workSession: "Sessione di Lavoro",
    shortBreak: "Pausa Breve",
    longBreak: "Pausa Lunga",
    start: "Inizia",
    pause: "Pausa",
    reset: "Reimposta",

    // Settings
    language: "Lingua",
    theme: "Tema",
    notifications: "Notifiche",
    account: "Account",

    // Common
    save: "Salva",
    cancel: "Annulla",
    delete: "Elimina",
    edit: "Modifica",
    add: "Aggiungi",
    close: "Chiudi",
    loading: "Caricamento...",
    error: "Errore",
    success: "Successo",

    // Stats
    totalTasks: "Totale Attività",
    completedTasks: "Attività Completate",
    pendingTasks: "Attività in Sospeso",
    completionRate: "Tasso di Completamento",

    // Premium features
    premiumFeature: "Funzione Premium",
    upgradeToPremium: "Passa a Premium",
    premiumBenefits: "Vantaggi Premium",
  },
}

// Helper function to get current theme
function getCurrentTheme() {
  if (typeof window === "undefined") return themes.default
  const savedTheme = localStorage.getItem("theme") || "default"
  return themes[savedTheme as keyof typeof themes] || themes.default
}

export default function CalendarApp() {
  const isMobile = useIsMobile()

  // User state
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // App state
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme())
  const [currentLanguage, setCurrentLanguage] = useState<keyof typeof languages>("es")

  // Data state
  const [tasks, setTasks] = useState<Task[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  // UI state
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showWishlistForm, setShowWishlistForm] = useState(false)
  const [editingWishlistItem, setEditingWishlistItem] = useState<WishlistItem | null>(null)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  // Pomodoro state
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25 minutes in seconds
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [pomodoroType, setPomodoroType] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [pomodoroSessions, setPomodoroSessions] = useState(0)

  // Filter and search state
  const [taskFilter, setTaskFilter] = useState<"all" | "completed" | "pending">("all")
  const [taskSearch, setTaskSearch] = useState("")
  const [taskSort, setTaskSort] = useState<"date" | "priority" | "category">("date")

  // Get translations for current language
  const t = translations[currentLanguage]
  const locale = languages[currentLanguage].locale

  // Initialize user and load data
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true)
      try {
        // Check for existing user in localStorage
        const savedUserId = localStorage.getItem("currentUserId")
        let user: UserType | null = null

        if (savedUserId) {
          user = await getUser(savedUserId)
        }

        // Create default user if none exists
        if (!user) {
          user = await createUser({
            name: "Usuario Demo",
            email: "demo@example.com",
            password: "demo123",
            language: "es",
            theme: "default",
            is_premium: false,
            onboarding_completed: true,
            pomodoro_sessions: 0,
            work_duration: 25,
            short_break_duration: 5,
            long_break_duration: 15,
            sessions_until_long_break: 4,
          })
          localStorage.setItem("currentUserId", user.id)
        }

        setCurrentUser(user)
        setCurrentLanguage(user.language)

        // Load theme
        const savedTheme = localStorage.getItem("theme") || user.theme
        setCurrentTheme(themes[savedTheme as keyof typeof themes] || themes.default)

        // Load user data
        await loadUserData(user.id)

        // Sync data if Supabase is available
        try {
          await syncSupabaseToLocal(user.id)
        } catch (error) {
          console.log("Sync not available, using local data")
        }
      } catch (error) {
        console.error("Failed to initialize app:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  // Auto-sync data periodically
  useEffect(() => {
    if (!currentUser) return

    const syncInterval = setInterval(async () => {
      try {
        await syncSupabaseToLocal(currentUser.id)
        await loadUserData(currentUser.id)
      } catch (error) {
        console.log("Auto-sync failed, continuing with local data")
      }
    }, 30000) // Sync every 30 seconds

    return () => clearInterval(syncInterval)
  }, [currentUser])

  // Load user data
  const loadUserData = async (userId: string) => {
    try {
      const [userTasks, userWishlist, userNotes, userAchievements] = await Promise.all([
        getTasks(userId),
        getWishlistItems(userId),
        getNotes(userId),
        getAchievements(userId),
      ])

      setTasks(userTasks)
      setWishlistItems(userWishlist)
      setNotes(userNotes)
      setAchievements(userAchievements)
    } catch (error) {
      console.error("Failed to load user data:", error)
    }
  }

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1)
      }, 1000)
    } else if (pomodoroTime === 0) {
      // Timer finished
      setPomodoroActive(false)

      if (pomodoroType === "work") {
        setPomodoroSessions((sessions) => sessions + 1)
        // Switch to break
        if ((pomodoroSessions + 1) % (currentUser?.sessions_until_long_break || 4) === 0) {
          setPomodoroType("longBreak")
          setPomodoroTime((currentUser?.long_break_duration || 15) * 60)
        } else {
          setPomodoroType("shortBreak")
          setPomodoroTime((currentUser?.short_break_duration || 5) * 60)
        }
      } else {
        // Switch back to work
        setPomodoroType("work")
        setPomodoroTime((currentUser?.work_duration || 25) * 60)
      }

      // Show notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("¡Pomodoro completado!", {
          body: pomodoroType === "work" ? "¡Tiempo de descanso!" : "¡Hora de trabajar!",
          icon: "/favicon.png",
        })
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [pomodoroActive, pomodoroTime, pomodoroType, pomodoroSessions, currentUser])

  // Task management functions
  const handleCreateTask = async (taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!currentUser) return

    try {
      const newTask = await createTask({
        ...taskData,
        user_id: currentUser.id,
      })
      setTasks((prev) => [newTask, ...prev])
      setShowTaskForm(false)

      // Sync to Supabase
      try {
        await syncLocalToSupabase(currentUser.id)
      } catch (error) {
        console.log("Sync failed, task saved locally")
      }
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!currentUser) return

    try {
      const updatedTask = await updateTask(taskId, updates)
      if (updatedTask) {
        setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)))
        setEditingTask(null)
        setShowTaskForm(false)

        // Check for achievements
        if (updates.completed && !tasks.find((t) => t.id === taskId)?.completed) {
          await checkTaskAchievements()
        }

        // Sync to Supabase
        try {
          await syncLocalToSupabase(currentUser.id)
        } catch (error) {
          console.log("Sync failed, task updated locally")
        }
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task.id !== taskId))

      // Sync to Supabase
      if (currentUser) {
        try {
          await syncLocalToSupabase(currentUser.id)
        } catch (error) {
          console.log("Sync failed, task deleted locally")
        }
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  // Wishlist management functions
  const handleCreateWishlistItem = async (
    itemData: Omit<WishlistItem, "id" | "user_id" | "created_at" | "updated_at">,
  ) => {
    if (!currentUser) return

    try {
      const newItem = await createWishlistItem({
        ...itemData,
        user_id: currentUser.id,
      })
      setWishlistItems((prev) => [newItem, ...prev])
      setShowWishlistForm(false)

      // Sync to Supabase
      try {
        await syncLocalToSupabase(currentUser.id)
      } catch (error) {
        console.log("Sync failed, wishlist item saved locally")
      }
    } catch (error) {
      console.error("Failed to create wishlist item:", error)
    }
  }

  const handleUpdateWishlistItem = async (itemId: string, updates: Partial<WishlistItem>) => {
    try {
      const updatedItem = await updateWishlistItem(itemId, updates)
      if (updatedItem) {
        setWishlistItems((prev) => prev.map((item) => (item.id === itemId ? updatedItem : item)))
        setEditingWishlistItem(null)
        setShowWishlistForm(false)

        // Sync to Supabase
        if (currentUser) {
          try {
            await syncLocalToSupabase(currentUser.id)
          } catch (error) {
            console.log("Sync failed, wishlist item updated locally")
          }
        }
      }
    } catch (error) {
      console.error("Failed to update wishlist item:", error)
    }
  }

  const handleDeleteWishlistItem = async (itemId: string) => {
    try {
      await deleteWishlistItem(itemId)
      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))

      // Sync to Supabase
      if (currentUser) {
        try {
          await syncLocalToSupabase(currentUser.id)
        } catch (error) {
          console.log("Sync failed, wishlist item deleted locally")
        }
      }
    } catch (error) {
      console.error("Failed to delete wishlist item:", error)
    }
  }

  // Note management functions
  const handleCreateNote = async (noteData: Omit<Note, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!currentUser) return

    try {
      const newNote = await createNote({
        ...noteData,
        user_id: currentUser.id,
      })
      setNotes((prev) => [newNote, ...prev])
      setShowNoteForm(false)

      // Sync to Supabase
      try {
        await syncLocalToSupabase(currentUser.id)
      } catch (error) {
        console.log("Sync failed, note saved locally")
      }
    } catch (error) {
      console.error("Failed to create note:", error)
    }
  }

  const handleUpdateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      const updatedNote = await updateNote(noteId, updates)
      if (updatedNote) {
        setNotes((prev) => prev.map((note) => (note.id === noteId ? updatedNote : note)))
        setEditingNote(null)
        setShowNoteForm(false)

        // Sync to Supabase
        if (currentUser) {
          try {
            await syncLocalToSupabase(currentUser.id)
          } catch (error) {
            console.log("Sync failed, note updated locally")
          }
        }
      }
    } catch (error) {
      console.error("Failed to update note:", error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId)
      setNotes((prev) => prev.filter((note) => note.id !== noteId))

      // Sync to Supabase
      if (currentUser) {
        try {
          await syncLocalToSupabase(currentUser.id)
        } catch (error) {
          console.log("Sync failed, note deleted locally")
        }
      }
    } catch (error) {
      console.error("Failed to delete note:", error)
    }
  }

  // Achievement checking
  const checkTaskAchievements = async () => {
    if (!currentUser) return

    const completedTasks = tasks.filter((task) => task.completed)
    const existingAchievements = achievements.map((a) => a.type)

    // First task achievement
    if (completedTasks.length === 1 && !existingAchievements.includes("first_task")) {
      await createAchievement({
        user_id: currentUser.id,
        type: "first_task",
        title: "Primera Tarea",
        description: "Completaste tu primera tarea",
        unlocked_at: getCurrentTimestamp(),
      })
    }

    // 10 tasks achievement
    if (completedTasks.length === 10 && !existingAchievements.includes("ten_tasks")) {
      await createAchievement({
        user_id: currentUser.id,
        type: "ten_tasks",
        title: "Productivo",
        description: "Completaste 10 tareas",
        unlocked_at: getCurrentTimestamp(),
      })
    }

    // 50 tasks achievement
    if (completedTasks.length === 50 && !existingAchievements.includes("fifty_tasks")) {
      await createAchievement({
        user_id: currentUser.id,
        type: "fifty_tasks",
        title: "Súper Productivo",
        description: "Completaste 50 tareas",
        unlocked_at: getCurrentTimestamp(),
      })
    }

    // Reload achievements
    if (currentUser) {
      const userAchievements = await getAchievements(currentUser.id)
      setAchievements(userAchievements)
    }
  }

  // Settings functions
  const handleLanguageChange = async (language: keyof typeof languages) => {
    setCurrentLanguage(language)
    if (currentUser) {
      await updateUser(currentUser.id, { language })
      setCurrentUser((prev) => (prev ? { ...prev, language } : null))
    }
  }

  const handleThemeChange = async (themeName: string) => {
    const theme = themes[themeName as keyof typeof themes] || themes.default
    setCurrentTheme(theme)
    localStorage.setItem("theme", themeName)
    if (currentUser) {
      await updateUser(currentUser.id, { theme: themeName })
      setCurrentUser((prev) => (prev ? { ...prev, theme: themeName } : null))
    }
  }

  // Pomodoro functions
  const startPomodoro = () => {
    setPomodoroActive(true)
  }

  const pausePomodoro = () => {
    setPomodoroActive(false)
  }

  const resetPomodoro = () => {
    setPomodoroActive(false)
    setPomodoroTime((currentUser?.work_duration || 25) * 60)
    setPomodoroType("work")
  }

  // Filter and search functions
  const getFilteredTasks = () => {
    let filtered = tasks

    // Apply filter
    if (taskFilter === "completed") {
      filtered = filtered.filter((task) => task.completed)
    } else if (taskFilter === "pending") {
      filtered = filtered.filter((task) => !task.completed)
    }

    // Apply search
    if (taskSearch) {
      filtered = filtered.filter(
        (task) =>
          task.text.toLowerCase().includes(taskSearch.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(taskSearch.toLowerCase())),
      )
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (taskSort) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "category":
          return a.category.localeCompare(b.category)
        case "date":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }

  // Get tasks for selected date
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = parseISO(task.date)
      return isSameDay(taskDate, date)
    })
  }

  // Get task stats
  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const pending = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, pending, completionRate }
  }

  // Format time for pomodoro
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Get current timestamp
  const getCurrentTimestamp = () => {
    return new Date().toISOString()
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-white text-xl">{t.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.background}`}>
      {/* Notification Service */}
      <NotificationService />

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Calendar App</h1>
                {currentUser && (
                  <p className="text-sm text-gray-300">
                    {t.welcome}, {currentUser.name}
                    {currentUser.is_premium && <Crown className="inline-block w-4 h-4 ml-1 text-yellow-400" />}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Database Status - Only show if there are issues */}
              <DatabaseStatus className="hidden lg:block" />

              {/* Settings Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="text-white hover:bg-white/10"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isMobile ? (
          // Mobile Layout
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-xl">
              <TabsTrigger value="dashboard" className="text-xs">
                <Home className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-xs">
                <ListTodo className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="calendar" className="text-xs">
                <CalendarIconAlt className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="more" className="text-xs">
                <ChevronDown className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <div className="space-y-6">
                <StatsCards tasks={tasks} />
                <CalendarWidget
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  tasks={tasks}
                  locale={locale}
                />
                <DatabaseStatus />
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <TaskForm
                tasks={tasks}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                currentLanguage={currentLanguage}
              />
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <CalendarWidget
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                tasks={tasks}
                locale={locale}
                fullSize={true}
              />
            </TabsContent>

            <TabsContent value="more" className="mt-6">
              <div className="grid gap-4">
                <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Gift className="h-5 w-5" />
                      <span>{t.wishlist}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setActiveTab("wishlist")}
                      className={`w-full bg-gradient-to-r ${currentTheme.primary} hover:opacity-90`}
                    >
                      Ver Lista de Deseos
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <StickyNote className="h-5 w-5" />
                      <span>{t.notes}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setActiveTab("notes")}
                      className={`w-full bg-gradient-to-r ${currentTheme.primary} hover:opacity-90`}
                    >
                      Ver Notas
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>{t.pomodoro}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setActiveTab("pomodoro")}
                      className={`w-full bg-gradient-to-r ${currentTheme.primary} hover:opacity-90`}
                    >
                      Abrir Pomodoro
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Additional mobile tabs */}
            <TabsContent value="wishlist" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{t.wishlist}</h2>
                  <Button
                    onClick={() => setShowWishlistForm(true)}
                    className={`bg-gradient-to-r ${currentTheme.primary} hover:opacity-90`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>

                <div className="space-y-3">
                  {wishlistItems.map((item) => (
                    <Card key={item.id} className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateWishlistItem(item.id, { completed: !item.completed })}
                              className="text-white hover:bg-white/10"
                            >
                              {item.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                              ) : (
                                <Circle className="h-5 w-5" />
                              )}
                            </Button>
                            <div>
                              <p className={`text-white ${item.completed ? "line-through opacity-60" : ""}`}>
                                {item.text}
                              </p>
                              {item.description && <p className="text-sm text-gray-400">{item.description}</p>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingWishlistItem(item)
                                setShowWishlistForm(true)
                              }}
                              className="text-white hover:bg-white/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteWishlistItem(item.id)}
                              className="text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{t.notes}</h2>
                  <Button
                    onClick={() => setShowNoteForm(true)}
                    className={`bg-gradient-to-r ${currentTheme.primary} hover:opacity-90`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>

                <div className="grid gap-4">
                  {notes.map((note) => (
                    <Card key={note.id} className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{note.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingNote(note)
                                setShowNoteForm(true)
                              }}
                              className="text-white hover:bg-white/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(parseISO(note.updated_at), "PPp", { locale })}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pomodoro" className="mt-6">
              <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-center">
                    {pomodoroType === "work" && t.workSession}
                    {pomodoroType === "shortBreak" && t.shortBreak}
                    {pomodoroType === "longBreak" && t.longBreak}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="text-6xl font-mono text-white">{formatTime(pomodoroTime)}</div>

                  <div className="flex justify-center space-x-4">
                    {!pomodoroActive ? (
                      <Button
                        onClick={startPomodoro}
                        className={`bg-gradient-to-r ${currentTheme.primary} hover:opacity-90`}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {t.start}
                      </Button>
                    ) : (
                      <Button
                        onClick={pausePomodoro}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        {t.pause}
                      </Button>
                    )}

                    <Button
                      onClick={resetPomodoro}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {t.reset}
                    </Button>
                  </div>

                  <div className="text-white">
                    <p>Sesiones completadas: {pomodoroSessions}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          // Desktop Layout
          <div className="grid grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="col-span-3 space-y-6">
              <StatsCards tasks={tasks} />
              <CalendarWidget
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                tasks={tasks}
                locale={locale}
              />
              <DatabaseStatus />
            </div>

            {/* Main Content */}
            <div className="col-span-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-black/20 backdrop-blur-xl">
                  <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
                  <TabsTrigger value="tasks">{t.tasks}</TabsTrigger>
                  <TabsTrigger value="calendar">{t.calendar}</TabsTrigger>
                  <TabsTrigger value="wishlist">{t.wishlist}</TabsTrigger>
                  <TabsTrigger value="notes">{t.notes}</TabsTrigger>
                  <TabsTrigger value="pomodoro">{t.pomodoro}</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="mt-6">
                  <div className="space-y-6">
                    <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center space-x-2">
                          <Activity className="h-5 w-5" />
                          <span>Resumen de Hoy</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {getTasksForDate(new Date()).length > 0 ? (
                            getTasksForDate(new Date()).map((task) => (
                              <div key={task.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateTask(task.id, { completed: !task.completed })}
                                  className="text-white hover:bg-white/10"
                                >
                                  {task.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                                  ) : (
                                    <Circle className="h-5 w-5" />
                                  )}
                                </Button>
                                <div className="flex-1">
                                  <p className={`text-white ${task.completed ? "line-through opacity-60" : ""}`}>
                                    {task.text}
                                  </p>
                                  {task.time && <p className="text-sm text-gray-400">{task.time}</p>}
                                </div>
                                <Badge
                                  variant={
                                    task.priority === "high"
                                      ? "destructive"
                                      : task.priority === "medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {t[task.priority]}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400 text-center py-8">No hay tareas para hoy</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent achievements */}
                    {achievements.length > 0 && (
                      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center space-x-2">
                            <Trophy className="h-5 w-5" />
                            <span>Logros Recientes</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {achievements.slice(0, 3).map((achievement) => (
                              <div
                                key={achievement.id}
                                className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                              >
                                <Award className="h-8 w-8 text-yellow-400" />
                                <div>
                                  <p className="text-white font-medium">{achievement.title}</p>
                                  <p className="text-sm text-gray-400">{achievement.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="mt-6">
                  <TaskForm
                    tasks={tasks}
                    onCreateTask={handleCreateTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                    currentLanguage={currentLanguage}
                  />
                </TabsContent>

                <TabsContent value="calendar" className="mt-6">
                  <CalendarWidget
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    tasks={tasks}
                    locale={locale}
                    fullSize={true}
                  />
                </TabsContent>

                <TabsContent value="wishlist" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">{t.wishlist}</h2>
                      <Button
                        onClick={() => setShowWishlistForm(true)}
                        className={`bg-gradient-to-r ${currentTheme.primary} hover:opacity-90`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Deseo
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      {wishlistItems.map((item) => (
                        <Card key={item.id} className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateWishlistItem(item.id, { completed: !item.completed })}
                                  className="text-white hover:bg-white/10"
                                >
                                  {item.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                                  ) : (
                                    <Circle className="h-5 w-5" />
                                  )}
                                </Button>
                                <div>
                                  <p className={`text-white ${item.completed ? "line-through opacity-60" : ""}`}>
                                    {item.text}
                                  </p>
                                  {item.description && <p className="text-sm text-gray-400">{item.description}</p>}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingWishlistItem(item)
                                    setShowWishlistForm(true)
                                  }}
                                  className="text-white hover:bg-white/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteWishlistItem(item.id)}
                                  className="text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {wishlistItems.length === 0 && (
                        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                          <CardContent className="p-8 text-center">
                            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400">No tienes deseos aún</p>
                            <p className="text-sm text-gray-500">Agrega algo que quieras lograr</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">{t.notes}</h2>
                      <Button
                        onClick={() => setShowNoteForm(true)}
                        className={`bg-gradient-to-r ${currentTheme.primary} hover:opacity-90`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Nota
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      {notes.map((note) => (
                        <Card key={note.id} className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-white text-lg">{note.title}</CardTitle>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingNote(note)
                                    setShowNoteForm(true)
                                  }}
                                  className="text-white hover:bg-white/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300 whitespace-pre-wrap">{note.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {format(parseISO(note.updated_at), "PPp", { locale })}
                            </p>
                          </CardContent>
                        </Card>
                      ))}

                      {notes.length === 0 && (
                        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                          <CardContent className="p-8 text-center">
                            <StickyNote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400">No tienes notas aún</p>
                            <p className="text-sm text-gray-500">Crea tu primera nota</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pomodoro" className="mt-6">
                  <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white text-center">
                        {pomodoroType === "work" && t.workSession}
                        {pomodoroType === "shortBreak" && t.shortBreak}
                        {pomodoroType === "longBreak" && t.longBreak}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-8">
                      <div className="text-8xl font-mono text-white">{formatTime(pomodoroTime)}</div>

                      <div className="flex justify-center space-x-4">
                        {!pomodoroActive ? (
                          <Button
                            onClick={startPomodoro}
                            size="lg"
                            className={`bg-gradient-to-r ${currentTheme.primary} hover:opacity-90`}
                          >
                            <Play className="h-5 w-5 mr-2" />
                            {t.start}
                          </Button>
                        ) : (
                          <Button
                            onClick={pausePomodoro}
                            size="lg"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            <Pause className="h-5 w-5 mr-2" />
                            {t.pause}
                          </Button>
                        )}

                        <Button
                          onClick={resetPomodoro}
                          size="lg"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <RotateCcw className="h-5 w-5 mr-2" />
                          {t.reset}
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-white">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{pomodoroSessions}</p>
                          <p className="text-sm text-gray-400">Sesiones Completadas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {Math.floor(pomodoroSessions / (currentUser?.sessions_until_long_break || 4))}
                          </p>
                          <p className="text-sm text-gray-400">Ciclos Completados</p>
                        </div>
                      </div>

                      {currentUser?.is_premium && (
                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
                          <div className="flex items-center justify-center space-x-2 text-yellow-300">
                            <Crown className="h-5 w-5" />
                            <span className="font-medium">Configuración Premium</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                            <div className="text-center">
                              <p className="text-white">{currentUser.work_duration}min</p>
                              <p className="text-gray-400">Trabajo</p>
                            </div>
                            <div className="text-center">
                              <p className="text-white">{currentUser.short_break_duration}min</p>
                              <p className="text-gray-400">Descanso</p>
                            </div>
                            <div className="text-center">
                              <p className="text-white">{currentUser.long_break_duration}min</p>
                              <p className="text-gray-400">Descanso Largo</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="col-span-3 space-y-6">
              {/* Quick Actions */}
              <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Acciones Rápidas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setShowTaskForm(true)}
                    className={`w-full bg-gradient-to-r ${currentTheme.primary} hover:opacity-90`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Tarea
                  </Button>
                  <Button
                    onClick={() => setShowNoteForm(true)}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <StickyNote className="h-4 w-4 mr-2" />
                    Nueva Nota
                  </Button>
                  <Button
                    onClick={() => setActiveTab("pomodoro")}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Iniciar Pomodoro
                  </Button>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>{t.achievements}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {achievements.length > 0 ? (
                    <div className="space-y-3">
                      {achievements.slice(0, 5).map((achievement) => (
                        <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                          <Award className="h-6 w-6 text-yellow-400" />
                          <div>
                            <p className="text-white text-sm font-medium">{achievement.title}</p>
                            <p className="text-xs text-gray-400">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No hay logros aún</p>
                      <p className="text-xs text-gray-500">Completa tareas para desbloquear logros</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Premium Status */}
              {currentUser && (
                <Card
                  className={`backdrop-blur-xl border-2 ${
                    currentUser.is_premium
                      ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
                      : "bg-black/20 border-purple-500/20"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Crown className={`h-5 w-5 ${currentUser.is_premium ? "text-yellow-400" : "text-gray-400"}`} />
                      <span>{currentUser.is_premium ? "Premium Activo" : "Cuenta Gratuita"}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentUser.is_premium ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-yellow-300">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-sm">Funciones premium desbloqueadas</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {currentUser.premium_expiry && (
                            <p>Expira: {format(parseISO(currentUser.premium_expiry), "PP", { locale })}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-400 text-sm">Desbloquea funciones premium:</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• Configuración personalizada de Pomodoro</li>
                          <li>• Temas adicionales</li>
                          <li>• Estadísticas avanzadas</li>
                          <li>• Sincronización en la nube</li>
                        </ul>
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90"
                        >
                          <Crown className="h-4 w-4 mr-2" />
                          Actualizar a Premium
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Dialogs */}

      {/* Task Form Dialog */}
      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle>{editingTask ? t.editTask : t.addTask}</DialogTitle>
          </DialogHeader>
          <TaskFormContent
            task={editingTask}
            onSubmit={(taskData) => {
              if (editingTask) {
                handleUpdateTask(editingTask.id, taskData)
              } else {
                handleCreateTask(taskData)
              }
            }}
            onCancel={() => {
              setShowTaskForm(false)
              setEditingTask(null)
            }}
            currentLanguage={currentLanguage}
          />
        </DialogContent>
      </Dialog>

      {/* Wishlist Form Dialog */}
      <Dialog open={showWishlistForm} onOpenChange={setShowWishlistForm}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle>{editingWishlistItem ? "Editar Deseo" : "Nuevo Deseo"}</DialogTitle>
          </DialogHeader>
          <WishlistFormContent
            item={editingWishlistItem}
            onSubmit={(itemData) => {
              if (editingWishlistItem) {
                handleUpdateWishlistItem(editingWishlistItem.id, itemData)
              } else {
                handleCreateWishlistItem(itemData)
              }
            }}
            onCancel={() => {
              setShowWishlistForm(false)
              setEditingWishlistItem(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Note Form Dialog */}
      <Dialog open={showNoteForm} onOpenChange={setShowNoteForm}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Editar Nota" : "Nueva Nota"}</DialogTitle>
          </DialogHeader>
          <NoteFormContent
            note={editingNote}
            onSubmit={(noteData) => {
              if (editingNote) {
                handleUpdateNote(editingNote.id, noteData)
              } else {
                handleCreateNote(noteData)
              }
            }}
            onCancel={() => {
              setShowNoteForm(false)
              setEditingNote(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>{t.settings}</span>
            </DialogTitle>
          </DialogHeader>
          <SettingsContent
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            currentTheme={
              Object.keys(themes).find((key) => themes[key as keyof typeof themes] === currentTheme) || "default"
            }
            onLanguageChange={handleLanguageChange}
            onThemeChange={handleThemeChange}
            onClose={() => setShowSettings(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Task Form Component
function TaskFormContent({
  task,
  onSubmit,
  onCancel,
  currentLanguage,
}: {
  task?: Task | null
  onSubmit: (data: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => void
  onCancel: () => void
  currentLanguage: keyof typeof languages
}) {
  const [formData, setFormData] = useState({
    text: task?.text || "",
    description: task?.description || "",
    category: task?.category || ("personal" as Task["category"]),
    priority: task?.priority || ("medium" as Task["priority"]),
    date: task?.date || format(new Date(), "yyyy-MM-dd"),
    time: task?.time || "",
    completed: task?.completed || false,
    notification_enabled: task?.notification_enabled || false,
  })

  const t = translations[currentLanguage]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="text">{t.taskTitle}</Label>
        <Input
          id="text"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">{t.taskDescription}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">{t.taskCategory}</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as Task["category"] })}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20">
              <SelectItem value="work">{t.work}</SelectItem>
              <SelectItem value="personal">{t.personal}</SelectItem>
              <SelectItem value="health">{t.health}</SelectItem>
              <SelectItem value="learning">{t.learning}</SelectItem>
              <SelectItem value="other">{t.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">{t.taskPriority}</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value as Task["priority"] })}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20">
              <SelectItem value="low">{t.low}</SelectItem>
              <SelectItem value="medium">{t.medium}</SelectItem>
              <SelectItem value="high">{t.high}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">{t.taskDate}</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="time">{t.taskTime}</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="notification"
          checked={formData.notification_enabled}
          onChange={(e) => setFormData({ ...formData, notification_enabled: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="notification">Habilitar notificaciones</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          {t.cancel}
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
          {t.save}
        </Button>
      </div>
    </form>
  )
}

// Wishlist Form Component
function WishlistFormContent({
  item,
  onSubmit,
  onCancel,
}: {
  item?: WishlistItem | null
  onSubmit: (data: Omit<WishlistItem, "id" | "user_id" | "created_at" | "updated_at">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    text: item?.text || "",
    description: item?.description || "",
    completed: item?.completed || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="text">Título del deseo</Label>
        <Input
          id="text"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          Cancelar
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
          Guardar
        </Button>
      </div>
    </form>
  )
}

// Note Form Component
function NoteFormContent({
  note,
  onSubmit,
  onCancel,
}: {
  note?: Note | null
  onSubmit: (data: Omit<Note, "id" | "user_id" | "created_at" | "updated_at">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: note?.title || "",
    content: note?.content || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
          rows={8}
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          Cancelar
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
          Guardar
        </Button>
      </div>
    </form>
  )
}

// Settings Component
function SettingsContent({
  currentUser,
  currentLanguage,
  currentTheme,
  onLanguageChange,
  onThemeChange,
  onClose,
}: {
  currentUser: UserType | null
  currentLanguage: keyof typeof languages
  currentTheme: string
  onLanguageChange: (language: keyof typeof languages) => void
  onThemeChange: (theme: string) => void
  onClose: () => void
}) {
  const t = translations[currentLanguage]

  return (
    <div className="space-y-6">
      {/* Language Settings */}
      <div>
        <h3 className="text-lg font-medium text-white mb-3 flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>{t.language}</span>
        </h3>
        <Select value={currentLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/20">
            {Object.entries(languages).map(([key, lang]) => (
              <SelectItem key={key} value={key}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Theme Settings */}
      <div>
        <h3 className="text-lg font-medium text-white mb-3 flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>{t.theme}</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(themes).map(([key, theme]) => (
            <Button
              key={key}
              variant={currentTheme === key ? "default" : "outline"}
              onClick={() => onThemeChange(key)}
              className={`p-3 h-auto flex flex-col items-center space-y-2 ${
                currentTheme === key
                  ? `bg-gradient-to-r ${theme.primary}`
                  : "border-white/20 text-white hover:bg-white/10"
              }`}
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.primary}`}></div>
              <span className="text-sm">{theme.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      {currentUser && (
        <div>
          <h3 className="text-lg font-medium text-white mb-3 flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{t.account}</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">{currentUser.name}</p>
                <p className="text-sm text-gray-400">{currentUser.email}</p>
              </div>
              {currentUser.is_premium && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      <div>
        <h3 className="text-lg font-medium text-white mb-3 flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>{t.notifications}</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white">Notificaciones del navegador</p>
              <p className="text-sm text-gray-400">Recibe notificaciones de tareas y Pomodoro</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if ("Notification" in window) {
                  Notification.requestPermission()
                }
              }}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Habilitar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onClose} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
          Cerrar
        </Button>
      </div>
    </div>
  )
}
