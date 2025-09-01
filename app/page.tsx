"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Trophy,
  CalendarIcon,
  CheckCircle,
  Star,
  Target,
  Flame,
  Crown,
  StickyNote,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Edit,
  Check,
  X,
  Bell,
  Clock,
  Menu,
  Search,
} from "lucide-react"

import {
  createUser,
  getUserByEmail,
  updateUser,
  getUserTasks,
  createTask,
  updateTask,
  deleteTask,
  getUserWishlist,
  getUserNotes,
} from "@/lib/database"

// Types
interface Task {
  id: string
  user_id: string
  text: string
  description?: string | null
  completed: boolean
  date: string
  time?: string | null
  category: "work" | "personal" | "health" | "learning" | "other"
  priority: "low" | "medium" | "high"
  completed_at?: string | null
  notification_enabled?: boolean
}

interface User {
  id: string
  name: string
  email: string
  password: string
  language: "es" | "en" | "fr" | "de" | "it"
  theme: string
  is_premium: boolean
  onboarding_completed: boolean
  pomodoro_sessions: number
  created_at: string
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
}

// Constants
const translations = {
  es: {
    appName: "FutureTask",
    appDescription: "Tu calendario inteligente del futuro",
    welcomeTitle: "¡Bienvenido a FutureTask!",
    login: "Iniciar Sesión",
    register: "Registrarse",
    email: "Email",
    password: "Contraseña",
    name: "Nombre",
    calendar: "Calendario",
    tasks: "Tareas",
    wishlist: "Lista de Deseos",
    notes: "Notas",
    pomodoro: "Pomodoro",
    newTask: "Nueva tarea...",
    description: "Descripción (opcional)...",
    time: "Hora (opcional)",
    completedToday: "Completadas Hoy",
    totalToday: "Total Hoy",
    streak: "Racha",
    achievements: "Logros",
    progressToday: "Progreso Hoy",
    work: "Trabajo",
    personal: "Personal",
    health: "Salud",
    learning: "Aprendizaje",
    other: "Otros",
    high: "Alta",
    medium: "Media",
    low: "Baja",
    profile: "Perfil",
    logout: "Cerrar Sesión",
    start: "Iniciar",
    pause: "Pausar",
    reset: "Reiniciar",
    workSession: "Sesión de Trabajo",
    shortBreak: "Descanso Corto",
    premium: "Premium",
    free: "Gratuito",
    choosePlan: "Elige tu plan",
    startPremium: "Comenzar Premium",
    continueFreee: "Continuar gratis",
    monthly: "Mensual",
    yearly: "Anual",
    monthlyPrice: "€1,99/mes",
    yearlyPrice: "€20/año",
    yearlyDiscount: "Ahorra €3,88",
    billingMonthly: "Facturación mensual",
    billingYearly: "Facturación anual (2 meses gratis)",
    upgradeButton: "Actualizar a Premium",
    notification: "Notificación",
    taskReminder: "Recordatorio de tarea",
    notificationPermission: "Permitir notificaciones",
    notificationPermissionDesc: "Activa las notificaciones para recibir recordatorios de tus tareas",
    enableNotifications: "Activar Notificaciones",
  },
  en: {
    appName: "FutureTask",
    appDescription: "Your intelligent calendar of the future",
    welcomeTitle: "Welcome to FutureTask!",
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    name: "Name",
    calendar: "Calendar",
    tasks: "Tasks",
    wishlist: "Wishlist",
    notes: "Notes",
    pomodoro: "Pomodoro",
    newTask: "New task...",
    description: "Description (optional)...",
    time: "Time (optional)",
    completedToday: "Completed Today",
    totalToday: "Total Today",
    streak: "Streak",
    achievements: "Achievements",
    progressToday: "Progress Today",
    work: "Work",
    personal: "Personal",
    health: "Health",
    learning: "Learning",
    other: "Other",
    high: "High",
    medium: "Medium",
    low: "Low",
    profile: "Profile",
    logout: "Logout",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    workSession: "Work Session",
    shortBreak: "Short Break",
    premium: "Premium",
    free: "Free",
    choosePlan: "Choose your plan",
    startPremium: "Start Premium",
    continueFreee: "Continue free",
    monthly: "Monthly",
    yearly: "Yearly",
    monthlyPrice: "$1.99/month",
    yearlyPrice: "$20/year",
    yearlyDiscount: "Save $3.88",
    billingMonthly: "Monthly billing",
    billingYearly: "Yearly billing (2 months free)",
    upgradeButton: "Upgrade to Premium",
    notification: "Notification",
    taskReminder: "Task reminder",
    notificationPermission: "Allow notifications",
    notificationPermissionDesc: "Enable notifications to receive task reminders",
    enableNotifications: "Enable Notifications",
  },
  fr: {
    appName: "FutureTask",
    appDescription: "Votre calendrier intelligent du futur",
    welcomeTitle: "Bienvenue sur FutureTask!",
    login: "Se connecter",
    register: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    name: "Nom",
    calendar: "Calendrier",
    tasks: "Tâches",
    wishlist: "Liste de souhaits",
    notes: "Notes",
    pomodoro: "Pomodoro",
    newTask: "Nouvelle tâche...",
    description: "Description (optionnelle)...",
    time: "Heure (optionnelle)",
    completedToday: "Terminées aujourd'hui",
    totalToday: "Total aujourd'hui",
    streak: "Série",
    achievements: "Réalisations",
    progressToday: "Progrès aujourd'hui",
    work: "Travail",
    personal: "Personnel",
    health: "Santé",
    learning: "Apprentissage",
    other: "Autres",
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
    profile: "Profil",
    logout: "Se déconnecter",
    start: "Commencer",
    pause: "Pause",
    reset: "Réinitialiser",
    workSession: "Session de travail",
    shortBreak: "Pause courte",
    premium: "Premium",
    free: "Gratuit",
    choosePlan: "Choisissez votre plan",
    startPremium: "Commencer Premium",
    continueFreee: "Continuer gratuitement",
    monthly: "Mensuel",
    yearly: "Annuel",
    monthlyPrice: "€1,99/mois",
    yearlyPrice: "€20/an",
    yearlyDiscount: "Économisez €3,88",
    billingMonthly: "Facturation mensuelle",
    billingYearly: "Facturation annuelle (2 mois gratuits)",
    upgradeButton: "Passer à Premium",
    notification: "Notification",
    taskReminder: "Rappel de tâche",
    notificationPermission: "Autoriser les notifications",
    notificationPermissionDesc: "Activez les notifications pour recevoir des rappels de tâches",
    enableNotifications: "Activer les notifications",
  },
  de: {
    appName: "FutureTask",
    appDescription: "Ihr intelligenter Kalender der Zukunft",
    welcomeTitle: "Willkommen bei FutureTask!",
    login: "Anmelden",
    register: "Registrieren",
    email: "E-Mail",
    password: "Passwort",
    name: "Name",
    calendar: "Kalender",
    tasks: "Aufgaben",
    wishlist: "Wunschliste",
    notes: "Notizen",
    pomodoro: "Pomodoro",
    newTask: "Neue Aufgabe...",
    description: "Beschreibung (optional)...",
    time: "Zeit (optional)",
    completedToday: "Heute erledigt",
    totalToday: "Gesamt heute",
    streak: "Serie",
    achievements: "Erfolge",
    progressToday: "Fortschritt heute",
    work: "Arbeit",
    personal: "Persönlich",
    health: "Gesundheit",
    learning: "Lernen",
    other: "Andere",
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig",
    profile: "Profil",
    logout: "Abmelden",
    start: "Starten",
    pause: "Pause",
    reset: "Zurücksetzen",
    workSession: "Arbeitssitzung",
    shortBreak: "Kurze Pause",
    premium: "Premium",
    free: "Kostenlos",
    choosePlan: "Wählen Sie Ihren Plan",
    startPremium: "Premium starten",
    continueFreee: "Kostenlos fortfahren",
    monthly: "Monatlich",
    yearly: "Jährlich",
    monthlyPrice: "€1,99/Monat",
    yearlyPrice: "€20/Jahr",
    yearlyDiscount: "Sparen Sie €3,88",
    billingMonthly: "Monatliche Abrechnung",
    billingYearly: "Jährliche Abrechnung (2 Monate kostenlos)",
    upgradeButton: "Auf Premium upgraden",
    notification: "Benachrichtigung",
    taskReminder: "Aufgabenerinnerung",
    notificationPermission: "Benachrichtigungen zulassen",
    notificationPermissionDesc: "Aktivieren Sie Benachrichtigungen für Aufgabenerinnerungen",
    enableNotifications: "Benachrichtigungen aktivieren",
  },
  it: {
    appName: "FutureTask",
    appDescription: "Il tuo calendario intelligente del futuro",
    welcomeTitle: "Benvenuto su FutureTask!",
    login: "Accedi",
    register: "Registrati",
    email: "Email",
    password: "Password",
    name: "Nome",
    calendar: "Calendario",
    tasks: "Attività",
    wishlist: "Lista desideri",
    notes: "Note",
    pomodoro: "Pomodoro",
    newTask: "Nuova attività...",
    description: "Descrizione (opzionale)...",
    time: "Ora (opzionale)",
    completedToday: "Completate oggi",
    totalToday: "Totale oggi",
    streak: "Serie",
    achievements: "Risultati",
    progressToday: "Progresso oggi",
    work: "Lavoro",
    personal: "Personale",
    health: "Salute",
    learning: "Apprendimento",
    other: "Altri",
    high: "Alta",
    medium: "Media",
    low: "Bassa",
    profile: "Profilo",
    logout: "Disconnetti",
    start: "Inizia",
    pause: "Pausa",
    reset: "Reimposta",
    workSession: "Sessione di lavoro",
    shortBreak: "Pausa breve",
    premium: "Premium",
    free: "Gratuito",
    choosePlan: "Scegli il tuo piano",
    startPremium: "Inizia Premium",
    continueFreee: "Continua gratis",
    monthly: "Mensile",
    yearly: "Annuale",
    monthlyPrice: "€1,99/mese",
    yearlyPrice: "€20/anno",
    yearlyDiscount: "Risparmia €3,88",
    billingMonthly: "Fatturazione mensile",
    billingYearly: "Fatturazione annuale (2 mesi gratis)",
    upgradeButton: "Passa a Premium",
    notification: "Notifica",
    taskReminder: "Promemoria attività",
    notificationPermission: "Consenti notifiche",
    notificationPermissionDesc: "Abilita le notifiche per ricevere promemoria delle attività",
    enableNotifications: "Abilita notifiche",
  },
}

// Reemplazar la constante THEMES con colores de texto dinámicos:
const THEMES = {
  free: {
    default: {
      name: "Futurista (Predeterminado)",
      gradient: "from-slate-900 via-purple-900 to-slate-900",
      cardBg: "bg-black/20",
      border: "border-purple-500/20",
      textPrimary: "text-white",
      textSecondary: "text-gray-300",
      textMuted: "text-gray-400",
      textAccent: "text-purple-300",
      placeholder: "placeholder:text-gray-400",
      buttonText: "text-white",
    },
    light: {
      name: "Claro",
      gradient: "from-gray-100 via-white to-gray-100",
      cardBg: "bg-white/80",
      border: "border-gray-300/50",
      textPrimary: "text-gray-900",
      textSecondary: "text-gray-700",
      textMuted: "text-gray-500",
      textAccent: "text-purple-600",
      placeholder: "placeholder:text-gray-400",
      buttonText: "text-white",
    },
    dark: {
      name: "Oscuro",
      gradient: "from-gray-900 via-black to-gray-900",
      cardBg: "bg-gray-800/80",
      border: "border-gray-600/30",
      textPrimary: "text-gray-100",
      textSecondary: "text-gray-300",
      textMuted: "text-gray-400",
      textAccent: "text-gray-200",
      placeholder: "placeholder:text-gray-500",
      buttonText: "text-white",
    },
    ocean: {
      name: "Océano",
      gradient: "from-blue-900 via-cyan-900 to-blue-900",
      cardBg: "bg-blue-900/20",
      border: "border-cyan-500/20",
      textPrimary: "text-cyan-100",
      textSecondary: "text-cyan-200",
      textMuted: "text-cyan-300",
      textAccent: "text-cyan-300",
      placeholder: "placeholder:text-cyan-400",
      buttonText: "text-white",
    },
    forest: {
      name: "Bosque",
      gradient: "from-green-900 via-emerald-900 to-green-900",
      cardBg: "bg-green-900/20",
      border: "border-emerald-500/20",
      textPrimary: "text-emerald-100",
      textSecondary: "text-emerald-200",
      textMuted: "text-emerald-300",
      textAccent: "text-emerald-300",
      placeholder: "placeholder:text-emerald-400",
      buttonText: "text-white",
    },
  },
  premium: {
    neon: {
      name: "Neón",
      gradient: "from-pink-900 via-purple-900 to-cyan-900",
      cardBg: "bg-black/30",
      border: "border-pink-500/30",
      textPrimary: "text-pink-100",
      textSecondary: "text-pink-200",
      textMuted: "text-pink-300",
      textAccent: "text-pink-300",
      placeholder: "placeholder:text-pink-400",
      buttonText: "text-white",
    },
    galaxy: {
      name: "Galaxia",
      gradient: "from-indigo-900 via-purple-900 to-pink-900",
      cardBg: "bg-black/40",
      border: "border-indigo-500/30",
      textPrimary: "text-indigo-100",
      textSecondary: "text-indigo-200",
      textMuted: "text-indigo-300",
      textAccent: "text-indigo-300",
      placeholder: "placeholder:text-indigo-400",
      buttonText: "text-white",
    },
    sunset: {
      name: "Atardecer",
      gradient: "from-orange-900 via-red-900 to-pink-900",
      cardBg: "bg-orange-900/20",
      border: "border-orange-500/30",
      textPrimary: "text-orange-100",
      textSecondary: "text-orange-200",
      textMuted: "text-orange-300",
      textAccent: "text-orange-300",
      placeholder: "placeholder:text-orange-400",
      buttonText: "text-white",
    },
    aurora: {
      name: "Aurora",
      gradient: "from-green-900 via-blue-900 to-purple-900",
      cardBg: "bg-green-900/20",
      border: "border-green-400/30",
      textPrimary: "text-green-100",
      textSecondary: "text-green-200",
      textMuted: "text-green-300",
      textAccent: "text-green-300",
      placeholder: "placeholder:text-green-400",
      buttonText: "text-white",
    },
    cyberpunk: {
      name: "Cyberpunk",
      gradient: "from-yellow-900 via-pink-900 to-cyan-900",
      cardBg: "bg-black/50",
      border: "border-yellow-500/30",
      textPrimary: "text-yellow-100",
      textSecondary: "text-yellow-200",
      textMuted: "text-yellow-300",
      textAccent: "text-yellow-300",
      placeholder: "placeholder:text-yellow-400",
      buttonText: "text-white",
    },
  },
}

const DEFAULT_ACHIEVEMENTS = [
  {
    id: "first-task",
    name: "Primer Paso",
    description: "Completa tu primera tarea",
    icon: <Star className="w-5 h-5" />,
    rarity: "common" as const,
    unlocked: false,
  },
  {
    id: "streak-3",
    name: "Constancia",
    description: "Completa tareas 3 días seguidos",
    icon: <Flame className="w-5 h-5" />,
    rarity: "common" as const,
    unlocked: false,
  },
  {
    id: "task-master",
    name: "Conquistador",
    description: "Completa 50 tareas en total",
    icon: <Target className="w-5 h-5" />,
    rarity: "rare" as const,
    unlocked: false,
  },
]

const CATEGORY_COLORS = {
  work: "bg-blue-500/20 border-blue-400/60 text-blue-200",
  personal: "bg-green-500/20 border-green-400/60 text-green-200",
  health: "bg-red-500/20 border-red-400/60 text-red-200",
  learning: "bg-purple-500/20 border-purple-400/60 text-purple-200",
  other: "bg-gray-500/20 border-gray-400/60 text-gray-200",
}

const PRIORITY_COLORS = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-red-400",
}

export default function FutureTaskApp() {
  // Core state
  const [user, setUser] = useState<User | null>(null)
  const [language, setLanguage] = useState<"es" | "en" | "fr" | "de" | "it">("es")
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "auth" | "premium" | "app">("welcome")
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // App state
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState("tasks")
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS)

  // Notification state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)

  // Task form state
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskTime, setNewTaskTime] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState<Task["category"]>("personal")
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("medium")

  // Edit task state
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editTaskText, setEditTaskText] = useState("")
  const [editTaskDescription, setEditTaskDescription] = useState("")
  const [editTaskTime, setEditTaskTime] = useState("")
  const [editTaskCategory, setEditTaskCategory] = useState<Task["category"]>("personal")
  const [editTaskPriority, setEditTaskPriority] = useState<Task["priority"]>("medium")

  // Auth state
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  // Pomodoro state
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [pomodoroType, setPomodoroType] = useState<"work" | "shortBreak">("work")

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileName, setProfileName] = useState("")
  const [profileEmail, setProfileEmail] = useState("")
  const [profilePassword, setProfilePassword] = useState("")
  const [profileLanguage, setProfileLanguage] = useState<"es" | "en" | "fr" | "de" | "it">("es")
  const [profileTheme, setProfileTheme] = useState("default")
  const [billingType, setBillingType] = useState<"monthly" | "yearly">("monthly")

  // Filter state
  const [taskFilter, setTaskFilter] = useState<"all" | "completed" | "pending">("all")
  const [categoryFilter, setCategoryFilter] = useState<"all" | Task["category"]>("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | Task["priority"]>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)

  // Wishlist and Notes state
  const [wishlistItems, setWishlistItems] = useState<
    Array<{ id: string; text: string; description?: string; completed: boolean }>
  >([])
  const [notes, setNotes] = useState<Array<{ id: string; title: string; content: string; createdAt: string }>>([])
  const [newWishItem, setNewWishItem] = useState("")
  const [newWishDescription, setNewWishDescription] = useState("")
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editNoteTitle, setEditNoteTitle] = useState("")
  const [editNoteContent, setEditNoteContent] = useState("")
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const t = useCallback(
    (key: string) => {
      return translations[language][key as keyof (typeof translations)[typeof language]] || key
    },
    [language],
  )

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Request notification permission and check status
  useEffect(() => {
    if (!("Notification" in window)) return

    setNotificationPermission(Notification.permission)

    if (user && currentScreen === "app" && Notification.permission === "default") {
      const timer = setTimeout(() => {
        setShowNotificationPrompt(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [user, currentScreen])

  // Mejorar la función requestNotificationPermission para que sea más robusta
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Este navegador no soporta notificaciones")
      setShowNotificationPrompt(false)
      return
    }

    try {
      let permission
      if (Notification.requestPermission.length) {
        permission = await new Promise((resolve) => {
          Notification.requestPermission(resolve)
        })
      } else {
        permission = await Notification.requestPermission()
      }

      setNotificationPermission(permission)
      setShowNotificationPrompt(false)

      if (permission === "granted") {
        new Notification("¡Notificaciones activadas! 🎉", {
          body: "Ahora recibirás recordatorios de tus tareas",
          icon: "/favicon-32x32.png",
        })
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      setShowNotificationPrompt(false)
    }
  }

  // Función para verificar si el usuario existe en la base de datos
  const verifyUserExists = async (email: string, password: string): Promise<User | null> => {
    try {
      return await getUserByEmail(email, password)
    } catch (error) {
      console.error("Error verifying user:", error)
      return null
    }
  }

  // Initialize app - runs only once
  const initializeApp = async () => {
    try {
      const savedUser = localStorage.getItem("futureTask_user")
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)

        // Verificar que el usuario aún existe en la base de datos
        const userExists = await verifyUserExists(parsedUser.email, parsedUser.password)
        if (!userExists) {
          localStorage.removeItem("futureTask_user")
          setCurrentScreen("welcome")
          setIsInitialized(true)
          return
        }

        setUser(userExists)
        setLanguage(userExists.language || "es")

        // Cargar datos del usuario desde Supabase
        const [userTasks, userWishlist, userNotes] = await Promise.all([
          getUserTasks(userExists.id),
          getUserWishlist(userExists.id),
          getUserNotes(userExists.id),
        ])

        setTasks(userTasks)
        setWishlistItems(userWishlist)
        setNotes(userNotes)

        setCurrentScreen(userExists.onboarding_completed ? "app" : "welcome")
      }
    } catch (error) {
      console.error("Error initializing app:", error)
    } finally {
      setIsInitialized(true)
    }
  }

  // Initialize app - runs only once
  useEffect(() => {
    if (isInitialized) return

    const timer = setTimeout(initializeApp, 100)
    return () => clearTimeout(timer)
  }, [isInitialized])

  // Save tasks when they change
  useEffect(() => {
    if (user && tasks.length > 0) {
      localStorage.setItem(`futureTask_tasks_${user.id}`, JSON.stringify(tasks))
    }
  }, [tasks, user])

  // Save wishlist when it changes
  useEffect(() => {
    if (user && wishlistItems.length >= 0) {
      localStorage.setItem(`futureTask_wishlist_${user.id}`, JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, user])

  // Save notes when they change
  useEffect(() => {
    if (user && notes.length >= 0) {
      localStorage.setItem(`futureTask_notes_${user.id}`, JSON.stringify(notes))
    }
  }, [notes, user])

  // Check for task notifications
  useEffect(() => {
    if (!user || !("Notification" in window)) return

    const checkNotifications = () => {
      console.log("Checking notifications, permission:", notificationPermission)

      if (notificationPermission !== "granted") {
        console.log("Notifications not granted")
        return
      }

      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

      console.log("Current time:", currentTime, "Today:", today)

      tasks.forEach((task) => {
        if (!task.completed && task.date === today && task.time === currentTime && task.notificationEnabled) {
          console.log("Showing notification for task:", task.text)
          try {
            const notification = new Notification(`⏰ ${t("taskReminder")}`, {
              body: task.text,
              icon: "/favicon-32x32.png",
              tag: task.id,
              requireInteraction: true,
              silent: false,
            })

            notification.onclick = () => {
              window.focus()
              notification.close()
            }

            // Auto close after 10 seconds
            setTimeout(() => {
              notification.close()
            }, 10000)
          } catch (error) {
            console.error("Error showing task notification:", error)
          }
        }
      })
    }

    // Check immediately and then every minute
    checkNotifications()
    const interval = setInterval(checkNotifications, 60000)
    return () => clearInterval(interval)
  }, [tasks, user, t, notificationPermission])

  // Pomodoro timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1)
      }, 1000)
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false)

      // Show notification when pomodoro ends
      if (notificationPermission === "granted" && "Notification" in window) {
        try {
          const title = pomodoroType === "work" ? "¡Tiempo de descanso! ☕" : "¡Volvamos al trabajo! 💪"
          const body =
            pomodoroType === "work"
              ? "Has completado una sesión de trabajo. Tómate un descanso."
              : "El descanso ha terminado. Es hora de una nueva sesión."

          const notification = new Notification(title, {
            body: body,
            icon: "/favicon-32x32.png",
            tag: "pomodoro-complete",
            requireInteraction: true,
            silent: false,
          })

          notification.onclick = () => {
            window.focus()
            notification.close()
          }

          // Auto close after 10 seconds
          setTimeout(() => {
            notification.close()
          }, 10000)
        } catch (error) {
          console.error("Error showing pomodoro notification:", error)
        }
      }

      if (pomodoroType === "work") {
        setPomodoroType("shortBreak")
        setPomodoroTime(5 * 60)
      } else {
        setPomodoroType("work")
        setPomodoroTime(25 * 60)
      }
    }
    return () => clearInterval(interval)
  }, [pomodoroActive, pomodoroTime, pomodoroType, notificationPermission])

  // Helper functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTasksForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    return tasks.filter((task) => task.date === dateStr)
  }

  const getTodayTasks = () => getTasksForDate(selectedDate)

  const getGlobalSearchResults = () => {
    if (!searchTerm.trim()) return []

    return tasks
      .filter(
        (task) =>
          task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Agregar función para navegar a la fecha de una tarea:
  const navigateToTaskDate = (taskDate: string) => {
    const [year, month, day] = taskDate.split("-").map(Number)
    const date = new Date(year, month - 1, day)
    setSelectedDate(date)
    setSearchTerm("")
    setShowGlobalSearch(false)
    setActiveTab("tasks")
    if (isMobile) setSidebarOpen(false)
  }

  // Modificar el handleSearch para mostrar/ocultar resultados:
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setShowGlobalSearch(value.trim().length > 0)
  }

  const getFilteredTasks = () => {
    let filtered = getTodayTasks()

    // Filter by completion status
    if (taskFilter === "completed") {
      filtered = filtered.filter((task) => task.completed)
    } else if (taskFilter === "pending") {
      filtered = filtered.filter((task) => !task.completed)
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((task) => task.category === categoryFilter)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    // Sort by time if available
    return filtered.sort((a, b) => {
      if (a.time && b.time) {
        return a.time.localeCompare(b.time)
      }
      if (a.time && !b.time) return -1
      if (!a.time && b.time) return 1
      return 0
    })
  }

  const getCompletedTasks = () => getFilteredTasks().filter((task) => task.completed)
  const getTodayProgress = () => {
    const todayTasks = getTodayTasks()
    if (todayTasks.length === 0) return 0
    return (getCompletedTasks().length / todayTasks.length) * 100
  }

  // Wishlist functions
  const addWishItem = () => {
    if (!newWishItem.trim() || !user) return

    const item = {
      id: `${user.id}_wish_${Date.now()}`,
      text: newWishItem,
      description: newWishDescription,
      completed: false,
    }

    setWishlistItems((prev) => [...prev, item])
    setNewWishItem("")
    setNewWishDescription("")
  }

  const toggleWishItem = (itemId: string) => {
    setWishlistItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
    )
  }

  const deleteWishItem = (itemId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  // Notes functions
  const addNote = () => {
    if (!newNoteTitle.trim() || !user) return

    const note = {
      id: `${user.id}_note_${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: new Date().toISOString(),
    }

    setNotes((prev) => [...prev, note])
    setNewNoteTitle("")
    setNewNoteContent("")
  }

  const startEditNote = (note: any) => {
    setEditingNote(note.id)
    setEditNoteTitle(note.title)
    setEditNoteContent(note.content)
  }

  const saveEditNote = () => {
    if (!editNoteTitle.trim() || !editingNote) return

    setNotes((prev) =>
      prev.map((note) =>
        note.id === editingNote ? { ...note, title: editNoteTitle, content: editNoteContent } : note,
      ),
    )

    setEditingNote(null)
    setEditNoteTitle("")
    setEditNoteContent("")
  }

  const cancelEditNote = () => {
    setEditingNote(null)
    setEditNoteTitle("")
    setEditNoteContent("")
  }

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
  }

  // Event handlers
  const handleAuth = async () => {
    try {
      if (authMode === "login") {
        const existingUser = await verifyUserExists(email, password)
        if (!existingUser) {
          alert("Usuario o contraseña incorrectos.")
          return
        }

        setUser(existingUser)
        localStorage.setItem("futureTask_user", JSON.stringify(existingUser))
        setCurrentScreen(existingUser.onboarding_completed ? "app" : "premium")
      } else {
        // Registro
        try {
          const newUser = await createUser({
            name: name,
            email,
            password,
            language,
            theme: "default",
            is_premium: false,
            onboarding_completed: false,
            pomodoro_sessions: 0,
          })

          setUser(newUser)
          localStorage.setItem("futureTask_user", JSON.stringify(newUser))
          setCurrentScreen("premium")
        } catch (error) {
          alert("Error al crear usuario. Es posible que el email ya esté registrado.")
          return
        }
      }

      setEmail("")
      setPassword("")
      setName("")
    } catch (error) {
      console.error("Error in auth:", error)
      alert("Error de conexión. Intenta de nuevo.")
    }
  }

  const handlePremiumChoice = async (isPremium: boolean) => {
    if (!user) return

    try {
      const updatedUser = await updateUser(user.id, {
        is_premium: isPremium,
        onboarding_completed: true,
      })

      setUser(updatedUser)
      localStorage.setItem("futureTask_user", JSON.stringify(updatedUser))
      setCurrentScreen("app")
    } catch (error) {
      console.error("Error updating premium status:", error)
      alert("Error al actualizar el plan. Intenta de nuevo.")
    }
  }

  // Agregar función para manejar mejor los errores de tareas
  const handleTaskAction = (action: () => void, actionName: string) => {
    try {
      console.log(`🎯 Executing task action: ${actionName}`)
      action()
      console.log(`✅ Task action completed: ${actionName}`)
    } catch (error) {
      console.error(`❌ Error in task action ${actionName}:`, error)
      alert(`Error al ${actionName}: ${error.message}`)
    }
  }

  const addTask = async () => {
    if (!newTask.trim() || !user) return

    try {
      const taskData = {
        user_id: user.id,
        text: newTask,
        description: newTaskDescription || null,
        time: newTaskTime || null,
        completed: false,
        date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
        category: newTaskCategory,
        priority: newTaskPriority,
        notification_enabled: !!newTaskTime && notificationPermission === "granted",
      }

      const newTaskFromDB = await createTask(taskData)
      setTasks((prev) => [...prev, newTaskFromDB])

      setNewTask("")
      setNewTaskDescription("")
      setNewTaskTime("")
    } catch (error) {
      console.error("Error adding task:", error)
      alert("Error al agregar tarea. Intenta de nuevo.")
    }
  }

  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      const updatedTask = await updateTask(taskId, {
        completed: !task.completed,
        completed_at: !task.completed ? new Date().toISOString() : null,
      })

      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)))
    } catch (error) {
      console.error("Error toggling task:", error)
      alert("Error al actualizar tarea. Intenta de nuevo.")
    }
  }

  const deleteTaskHandler = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error("Error deleting task:", error)
      alert("Error al eliminar tarea. Intenta de nuevo.")
    }
  }

  const startEditTask = (task: Task) => {
    setEditingTask(task.id)
    setEditTaskText(task.text)
    setEditTaskDescription(task.description || "")
    setEditTaskTime(task.time || "")
    setEditTaskCategory(task.category)
    setEditTaskPriority(task.priority)
  }

  const saveEditTask = () => {
    if (!editTaskText.trim() || !editingTask) return

    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask
          ? {
              ...task,
              text: editTaskText,
              description: editTaskDescription,
              time: editTaskTime,
              category: editTaskCategory,
              priority: editTaskPriority,
              notificationEnabled: !!editTaskTime && notificationPermission === "granted",
            }
          : task,
      ),
    )

    setEditingTask(null)
    setEditTaskText("")
    setEditTaskDescription("")
    setEditTaskTime("")
  }

  const cancelEditTask = () => {
    setEditingTask(null)
    setEditTaskText("")
    setEditTaskDescription("")
    setEditTaskTime("")
  }

  const handleTabChange = (value: string) => {
    if ((value === "wishlist" || value === "notes") && !user?.isPremium) {
      setShowPremiumModal(true)
      return
    }
    setActiveTab(value)
    if (isMobile) setSidebarOpen(false)
  }

  const openProfileModal = () => {
    if (user) {
      setProfileName(user.name)
      setProfileEmail(user.email)
      setProfilePassword("")
      setProfileLanguage(user.language)
      setProfileTheme(user.theme)
      setShowProfileModal(true)
    }
  }

  const saveProfile = async () => {
    if (!user) return

    try {
      const updatedUser = await updateUser(user.id, {
        name: profileName,
        email: profileEmail,
        language: profileLanguage,
        theme: profileTheme,
      })

      setUser(updatedUser)
      setLanguage(profileLanguage)
      localStorage.setItem("futureTask_user", JSON.stringify(updatedUser))
      setShowProfileModal(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error al actualizar perfil. Intenta de nuevo.")
    }
  }

  const logout = () => {
    setUser(null)
    setTasks([])
    setCurrentScreen("welcome")
    localStorage.removeItem("futureTask_user")
  }

  const getCurrentTheme = () => {
    if (!user) return THEMES.free.default

    const allThemes = { ...THEMES.free, ...THEMES.premium }
    return allThemes[user.theme as keyof typeof allThemes] || THEMES.free.default
  }

  const getPricing = () => {
    const isEnglish = language === "en"
    const currency = isEnglish ? "$" : "€"

    return {
      monthly: {
        price: `${currency}1.99`,
        period: isEnglish ? "/month" : billingType === "monthly" ? "/mes" : "/mois",
        full: isEnglish ? "$1.99/month" : "€1,99/mes",
      },
      yearly: {
        price: `${currency}20`,
        period: isEnglish ? "/year" : "/año",
        full: isEnglish ? "$20/year" : "€20/año",
        discount: isEnglish ? "Save $3.88" : "Ahorra €3,88",
      },
    }
  }

  // Loading state
  if (!isInitialized) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().gradient} flex items-center justify-center`}>
        <div className={`${getCurrentTheme().textPrimary} text-lg`}>Cargando...</div>
      </div>
    )
  }

  // Welcome Screen
  if (currentScreen === "welcome") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().gradient} flex items-center justify-center p-4`}
      >
        <Card className={`w-full max-w-md ${getCurrentTheme().cardBg} backdrop-blur-xl ${getCurrentTheme().border}`}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {t("appName")}
            </CardTitle>
            <CardDescription className={getCurrentTheme().textSecondary}>{t("appDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setCurrentScreen("auth")}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
            >
              Comenzar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Auth Screen
  if (currentScreen === "auth") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().gradient} flex items-center justify-center p-4`}
      >
        <Card className={`w-full max-w-md ${getCurrentTheme().cardBg} backdrop-blur-xl ${getCurrentTheme().border}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {authMode === "login" ? t("login") : t("register")}
            </CardTitle>
            {authMode === "login" && (
              <p className={`text-sm ${getCurrentTheme().textSecondary} mt-2`}>
                Solo usuarios registrados en la base de datos pueden acceder
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {authMode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name" className={getCurrentTheme().textSecondary}>
                  {t("name")}
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                  placeholder="Tu nombre"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className={getCurrentTheme().textSecondary}>
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                placeholder="tu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className={getCurrentTheme().textSecondary}>
                {t("password")}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                placeholder="••••••••"
              />
            </div>
            <Button
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
            >
              {authMode === "login" ? t("login") : t("register")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              className={`w-full ${getCurrentTheme().textAccent}`}
            >
              {authMode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Premium Screen
  if (currentScreen === "premium") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().gradient} flex items-center justify-center p-4`}
      >
        <Card className={`w-full max-w-4xl ${getCurrentTheme().cardBg} backdrop-blur-xl ${getCurrentTheme().border}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {t("choosePlan")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Billing Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-black/20 p-1 rounded-lg flex">
                <Button
                  onClick={() => setBillingType("monthly")}
                  variant={billingType === "monthly" ? "default" : "ghost"}
                  className={`px-4 md:px-6 py-2 text-sm md:text-base ${
                    billingType === "monthly"
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {t("monthly")}
                </Button>
                <Button
                  onClick={() => setBillingType("yearly")}
                  variant={billingType === "yearly" ? "default" : "ghost"}
                  className={`px-4 md:px-6 py-2 text-sm md:text-base relative ${
                    billingType === "yearly"
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {t("yearly")}
                  <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1">
                    {language === "en" ? "Save" : "Ahorra"}
                  </Badge>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className={`text-lg md:text-xl ${getCurrentTheme().textPrimary}`}>{t("free")}</CardTitle>
                  <div className={`text-2xl md:text-3xl font-bold ${getCurrentTheme().textPrimary}`}>
                    {language === "en" ? "$0" : "€0"}
                    <span className="text-sm md:text-lg font-normal text-gray-400">
                      {billingType === "monthly"
                        ? language === "en"
                          ? "/month"
                          : "/mes"
                        : language === "en"
                          ? "/year"
                          : "/año"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>Hasta 10 tareas</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>Calendario básico</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <X className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textMuted}`}>Lista de deseos</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <X className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textMuted}`}>Notas</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <X className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textMuted}`}>Temas premium</span>
                    </div>
                  </div>
                  <Button onClick={() => handlePremiumChoice(false)} variant="outline" className="w-full">
                    {t("continueFreee")}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/30 relative">
                {billingType === "yearly" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
                      {getPricing().yearly.discount}
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle
                    className={`text-lg md:text-xl ${getCurrentTheme().textPrimary} flex items-center space-x-2`}
                  >
                    <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                    <span>{t("premium")}</span>
                  </CardTitle>
                  <div className={`text-2xl md:text-3xl font-bold ${getCurrentTheme().textPrimary}`}>
                    {billingType === "monthly" ? (
                      <>
                        {getPricing().monthly.price}
                        <span className="text-sm md:text-lg font-normal text-gray-400">
                          {getPricing().monthly.period}
                        </span>
                      </>
                    ) : (
                      <>
                        {getPricing().yearly.price}
                        <span className="text-sm md:text-lg font-normal text-gray-400">
                          {getPricing().yearly.period}
                        </span>
                      </>
                    )}
                  </div>
                  {billingType === "yearly" && (
                    <p className={`text-sm ${getCurrentTheme().textMuted}`}>
                      {language === "en" ? "2 months free!" : "¡2 meses gratis!"}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>Tareas ilimitadas</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>Lista de deseos</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>Notas ilimitadas</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>
                        Todos los temas premium
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>Notificaciones</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>
                        Soporte prioritario
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePremiumChoice(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-sm md:text-lg py-2 md:py-3"
                  >
                    <Crown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {t("startPremium")} -{" "}
                    {billingType === "monthly" ? getPricing().monthly.full : getPricing().yearly.full}
                  </Button>
                  {billingType === "yearly" && (
                    <p className={`text-center text-xs md:text-sm ${getCurrentTheme().textMuted}`}>
                      💰 {getPricing().yearly.discount} • {language === "en" ? "Best value!" : "¡Mejor precio!"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main App
  if (!user) return null

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().gradient}`}>
      <div className="flex h-screen">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-50 bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
            size="sm"
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}

        {/* Sidebar */}
        <div
          className={`${isMobile ? "fixed inset-y-0 left-0 z-40" : "relative"} ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"} transition-transform duration-300 ease-in-out`}
        >
          <div
            className={`${isMobile ? "w-80" : "w-80 xl:w-96"} h-full ${getCurrentTheme().cardBg} backdrop-blur-xl ${getCurrentTheme().border} border-r overflow-y-auto`}
          >
            {/* Header */}
            <div className="p-4 border-b border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {t("appName")}
                      </h1>
                      {user.isPremium && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${getCurrentTheme().textSecondary}`}>Hola, {user.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={openProfileModal}>
                  <Bell className="w-5 h-5" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative mt-4">
                <Input
                  type="search"
                  placeholder={t("search")}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} ${getCurrentTheme().placeholder} pl-10`}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Tabs */}
            <nav className="p-4 space-y-2">
              <Button
                variant={activeTab === "calendar" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleTabChange("calendar")}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {t("calendar")}
              </Button>
              <Button
                variant={activeTab === "tasks" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleTabChange("tasks")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t("tasks")}
              </Button>
              <Button
                variant={activeTab === "wishlist" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleTabChange("wishlist")}
              >
                <Star className="w-4 h-4 mr-2" />
                {t("wishlist")}
              </Button>
              <Button
                variant={activeTab === "notes" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleTabChange("notes")}
              >
                <StickyNote className="w-4 h-4 mr-2" />
                {t("notes")}
              </Button>
              <Button
                variant={activeTab === "pomodoro" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleTabChange("pomodoro")}
              >
                <Timer className="w-4 h-4 mr-2" />
                {t("pomodoro")}
              </Button>
              <Button
                variant={activeTab === "achievements" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleTabChange("achievements")}
              >
                <Trophy className="w-4 h-4 mr-2" />
                {t("achievements")}
              </Button>
              <Button onClick={logout} variant="ghost" className="w-full justify-start">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("logout")}
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {showGlobalSearch && searchTerm.trim() ? (
            <div>
              <h2 className={`text-lg font-bold mb-4 ${getCurrentTheme().textPrimary}`}>
                {t("search")} "{searchTerm}"
              </h2>
              {getGlobalSearchResults().length > 0 ? (
                <ul>
                  {getGlobalSearchResults().map((task) => (
                    <li
                      key={task.id}
                      className={`mb-2 p-3 rounded-md ${getCurrentTheme().cardBg} ${getCurrentTheme().border} cursor-pointer hover:opacity-80 transition-opacity`}
                      onClick={() => navigateToTaskDate(task.date)}
                    >
                      <div className="flex items-center justify-between">
                        <p className={`${getCurrentTheme().textPrimary} font-medium`}>{task.text}</p>
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className={`text-sm ${getCurrentTheme().textSecondary}`}>
                        {task.description || "Sin descripción"} - {task.date}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={getCurrentTheme().textMuted}>No se encontraron resultados.</p>
              )}
            </div>
          ) : activeTab === "calendar" ? (
            <Card className={`max-w-sm mx-auto ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
              <CardHeader>
                <CardTitle className={getCurrentTheme().textPrimary}>{t("calendar")}</CardTitle>
                <CardDescription className={getCurrentTheme().textSecondary}>
                  Selecciona un día para ver tus tareas
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-none shadow-none"
                />
              </CardContent>
            </Card>
          ) : activeTab === "tasks" ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${getCurrentTheme().textPrimary}`}>
                  {t("tasks")} - {selectedDate.toLocaleDateString(language)}
                </h2>
                <div className="space-x-2">
                  <Select value={taskFilter} onValueChange={setTaskFilter}>
                    <SelectTrigger className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}>
                      <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/80 backdrop-blur-xl border-purple-500/30">
                      <SelectItem value="all">{t("all")}</SelectItem>
                      <SelectItem value="completed">{t("completedToday")}</SelectItem>
                      <SelectItem value="pending">{t("pending")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}>
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/80 backdrop-blur-xl border-purple-500/30">
                      <SelectItem value="all">{t("all")}</SelectItem>
                      <SelectItem value="work">{t("work")}</SelectItem>
                      <SelectItem value="personal">{t("personal")}</SelectItem>
                      <SelectItem value="health">{t("health")}</SelectItem>
                      <SelectItem value="learning">{t("learning")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}>
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/80 backdrop-blur-xl border-purple-500/30">
                      <SelectItem value="all">{t("all")}</SelectItem>
                      <SelectItem value="high">{t("high")}</SelectItem>
                      <SelectItem value="medium">{t("medium")}</SelectItem>
                      <SelectItem value="low">{t("low")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Task List */}
              {getFilteredTasks().length > 0 ? (
                <ul className="space-y-3">
                  {getFilteredTasks().map((task) => (
                    <li
                      key={task.id}
                      className={`p-4 rounded-md ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => handleTaskAction(() => toggleTask(task.id), "toggleTask")}
                          />
                          <Label
                            htmlFor={`task-${task.id}`}
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              task.completed ? "line-through opacity-50" : getCurrentTheme().textPrimary
                            }`}
                          >
                            {task.text}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          {task.priority && <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>}
                          {task.time && (
                            <Badge className="opacity-70">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.time}
                            </Badge>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => startEditTask(task)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTaskAction(() => deleteTaskHandler(task.id), "deleteTask")}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      {task.description && (
                        <p className={`mt-2 text-sm ${getCurrentTheme().textSecondary}`}>{task.description}</p>
                      )}
                      <div className="mt-2 flex items-center space-x-2">
                        <Badge className={CATEGORY_COLORS[task.category]}>{t(task.category)}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={getCurrentTheme().textMuted}>No hay tareas para este día.</p>
              )}

              {/* New Task Form */}
              <Card className={`mt-6 ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                <CardHeader>
                  <CardTitle className={getCurrentTheme().textPrimary}>{t("newTask")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="text"
                    placeholder={t("newTask")}
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                  />
                  <Textarea
                    placeholder={t("description")}
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                  />
                  <div className="flex items-center space-x-4">
                    <Input
                      type="time"
                      placeholder={t("time")}
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(e.target.value)}
                      className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                    />
                    <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                      <SelectTrigger className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}>
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-purple-500/30">
                        <SelectItem value="work">{t("work")}</SelectItem>
                        <SelectItem value="personal">{t("personal")}</SelectItem>
                        <SelectItem value="health">{t("health")}</SelectItem>
                        <SelectItem value="learning">{t("learning")}</SelectItem>
                        <SelectItem value="other">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                      <SelectTrigger className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}>
                        <SelectValue placeholder="Prioridad" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-purple-500/30">
                        <SelectItem value="high">{t("high")}</SelectItem>
                        <SelectItem value="medium">{t("medium")}</SelectItem>
                        <SelectItem value="low">{t("low")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => handleTaskAction(addTask, "addTask")} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Tarea
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : activeTab === "wishlist" ? (
            <div>
              <h2 className={`text-lg font-bold mb-4 ${getCurrentTheme().textPrimary}`}>{t("wishlist")}</h2>
              {wishlistItems.length > 0 ? (
                <ul className="space-y-3">
                  {wishlistItems.map((item) => (
                    <li
                      key={item.id}
                      className={`p-4 rounded-md ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`wish-${item.id}`}
                            checked={item.completed}
                            onCheckedChange={() => toggleWishItem(item.id)}
                          />
                          <Label
                            htmlFor={`wish-${item.id}`}
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              item.completed ? "line-through opacity-50" : getCurrentTheme().textPrimary
                            }`}
                          >
                            {item.text}
                          </Label>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteWishItem(item.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                      {item.description && (
                        <p className={`mt-2 text-sm ${getCurrentTheme().textSecondary}`}>{item.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={getCurrentTheme().textMuted}>Tu lista de deseos está vacía.</p>
              )}

              {/* New Wishlist Item Form */}
              <Card className={`mt-6 ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                <CardHeader>
                  <CardTitle className={getCurrentTheme().textPrimary}>Nuevo Deseo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Quiero..."
                    value={newWishItem}
                    onChange={(e) => setNewWishItem(e.target.value)}
                    className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                  />
                  <Textarea
                    placeholder="Descripción (opcional)..."
                    value={newWishDescription}
                    onChange={(e) => setNewWishDescription(e.target.value)}
                    className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                  />
                  <Button onClick={addWishItem} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar a la Lista
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : activeTab === "notes" ? (
            <div>
              <h2 className={`text-lg font-bold mb-4 ${getCurrentTheme().textPrimary}`}>{t("notes")}</h2>
              {notes.length > 0 ? (
                <ul className="space-y-3">
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className={`p-4 rounded-md ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={`text-md font-bold ${getCurrentTheme().textPrimary}`}>{note.title}</h3>
                        <div className="space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => startEditNote(note)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      <p className={`mt-2 text-sm ${getCurrentTheme().textSecondary}`}>{note.content}</p>
                      <p className={`mt-2 text-xs ${getCurrentTheme().textMuted}`}>
                        {new Date(note.createdAt).toLocaleDateString(language)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={getCurrentTheme().textMuted}>No tienes notas.</p>
              )}

              {/* New Note Form */}
              <Card className={`mt-6 ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                <CardHeader>
                  <CardTitle className={getCurrentTheme().textPrimary}>Nueva Nota</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Título..."
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                  />
                  <Textarea
                    placeholder="Contenido..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                  />
                  <Button onClick={addNote} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Nota
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : activeTab === "pomodoro" ? (
            <Card className={`max-w-sm mx-auto ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
              <CardHeader>
                <CardTitle className={getCurrentTheme().textPrimary}>{t("pomodoro")}</CardTitle>
                <CardDescription className={getCurrentTheme().textSecondary}>
                  {t(pomodoroType === "work" ? "workSession" : "shortBreak")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-4xl font-bold">{formatTime(pomodoroTime)}</div>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setPomodoroActive(!pomodoroActive)}>
                    {pomodoroActive ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        {t("pause")}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {t("start")}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setPomodoroActive(false)
                      setPomodoroTime(pomodoroType === "work" ? 25 * 60 : 5 * 60)
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t("reset")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : activeTab === "achievements" ? (
            <div>
              <h2 className={`text-lg font-bold mb-4 ${getCurrentTheme().textPrimary}`}>{t("achievements")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{achievement.name}</CardTitle>
                      {achievement.unlocked ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs text-gray-500">{achievement.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          {/* Edit Task Modal */}
          <Dialog open={editingTask !== null} onOpenChange={() => setEditingTask(null)}>
            <DialogContent className={`sm:max-w-[425px] ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
              <DialogHeader>
                <DialogTitle className={getCurrentTheme().textPrimary}>Editar Tarea</DialogTitle>
                <DialogDescription className={getCurrentTheme().textSecondary}>
                  Actualiza los detalles de tu tarea.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className={`text-right ${getCurrentTheme().textSecondary}`}>
                    Tarea
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className={`text-right ${getCurrentTheme().textSecondary}`}>
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    value={editTaskDescription}
                    onChange={(e) => setEditTaskDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className={`text-right ${getCurrentTheme().textSecondary}`}>
                    Hora
                  </Label>
                  <Input
                    type="time"
                    id="time"
                    value={editTaskTime}
                    onChange={(e) => setEditTaskTime(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className={`text-right ${getCurrentTheme().textSecondary}`}>
                    Categoría
                  </Label>
                  <Select value={editTaskCategory} onValueChange={setEditTaskCategory}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">{t("work")}</SelectItem>
                      <SelectItem value="personal">{t("personal")}</SelectItem>
                      <SelectItem value="health">{t("health")}</SelectItem>
                      <SelectItem value="learning">{t("learning")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className={`text-right ${getCurrentTheme().textSecondary}`}>
                    Prioridad
                  </Label>
                  <Select value={editTaskPriority} onValueChange={setEditTaskPriority}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">{t("high")}</SelectItem>
                      <SelectItem value="medium">{t("medium")}</SelectItem>
                      <SelectItem value="low">{t("low")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={cancelEditTask}>
                  Cancelar
                </Button>
                <Button type="submit" onClick={saveEditTask}>
                  Guardar Cambios
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Note Modal */}
          <Dialog open={editingNote !== null} onOpenChange={() => setEditingNote(null)}>
            <DialogContent className={`sm:max-w-[425px] ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
              <DialogHeader>
                <DialogTitle className={getCurrentTheme().textPrimary}>Editar Nota</DialogTitle>
                <DialogDescription className={getCurrentTheme().textSecondary}>
                  Actualiza los detalles de tu nota.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className={`text-right ${getCurrentTheme().textSecondary}`}>
                    Título
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    value={editNoteTitle}
                    onChange={(e) => setEditNoteTitle(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className={`text-right ${getCurrentTheme().textSecondary}`}>
                    Contenido
                  </Label>
                  <Textarea
                    id="content"
                    value={editNoteContent}
                    onChange={(e) => setEditNoteContent(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={cancelEditNote}>
                  Cancelar
                </Button>
                <Button type="submit" onClick={saveEditNote}>
                  Guardar Cambios
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Profile Modal */}
          <Dialog open={showProfileModal} onOpenChange={() => setShowProfileModal(false)}>
            <DialogContent className={`sm:max-w-[425px] ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
              <DialogHeader>
                <DialogTitle className={getCurrentTheme().textPrimary}>{t("profile")}</DialogTitle>
                <DialogDescription className={getCurrentTheme().textSecondary}>
                  Administra tu cuenta y preferencias.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className={`text-right ${getCurrentTheme().textSecondary}`}>
                    {t("name")}
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className={`text-right ${getCurrentTheme().textSecondary}`}>
                    {t("email")}
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="language" className={`text-right ${getCurrentTheme().textSecondary}`}>
                    Idioma
                  </Label>
                  <Select value={profileLanguage} onValueChange={setProfileLanguage}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="theme" className={`text-right ${getCurrentTheme().textSecondary}`}>
                    Tema
                  </Label>
                  <Select value={profileTheme} onValueChange={setProfileTheme}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(THEMES.free).map(([key, theme]) => (
                        <SelectItem key={key} value={key}>
                          {theme.name}
                        </SelectItem>
                      ))}
                      {user.isPremium &&
                        Object.entries(THEMES.premium).map(([key, theme]) => (
                          <SelectItem key={key} value={key}>
                            {theme.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={() => setShowProfileModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" onClick={saveProfile}>
                  Guardar Cambios
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Premium Modal */}
          <Dialog open={showPremiumModal} onOpenChange={() => setShowPremiumModal(false)}>
            <DialogContent className={`sm:max-w-[425px] ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
              <DialogHeader>
                <DialogTitle className={getCurrentTheme().textPrimary}>{t("premium")}</DialogTitle>
                <DialogDescription className={getCurrentTheme().textSecondary}>
                  ¡Desbloquea funciones exclusivas!
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className={getCurrentTheme().textPrimary}>
                  Con Premium, obtienes acceso ilimitado a listas de deseos, notas, temas exclusivos y más.
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={() => setShowPremiumModal(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    setShowPremiumModal(false)
                    setCurrentScreen("premium")
                  }}
                >
                  {t("upgradeButton")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Notification Prompt */}
          <Dialog open={showNotificationPrompt} onOpenChange={() => setShowNotificationPrompt(false)}>
            <DialogContent className={`sm:max-w-[425px] ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
              <DialogHeader>
                <DialogTitle className={getCurrentTheme().textPrimary}>{t("notification")}</DialogTitle>
                <DialogDescription className={getCurrentTheme().textSecondary}>
                  {t("notificationPermissionDesc")}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className={getCurrentTheme().textPrimary}>{t("enableNotifications")}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={() => setShowNotificationPrompt(false)}>
                  Cancelar
                </Button>
                <Button type="submit" onClick={requestNotificationPermission}>
                  {t("enableNotifications")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
