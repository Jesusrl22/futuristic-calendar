"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Heart,
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

// Types
interface Task {
  id: string
  text: string
  description?: string
  completed: boolean
  date: string
  time?: string
  category: "work" | "personal" | "health" | "learning" | "other"
  priority: "low" | "medium" | "high"
  completedAt?: string
  notificationEnabled?: boolean
}

interface User {
  id: string
  name: string
  email: string
  language: "es" | "en" | "fr" | "de" | "it"
  theme: string
  isPremium: boolean
  onboardingCompleted: boolean
  pomodoroSessions: number
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
  const [showPremiumModal, setShowPremiumModal] = useState(false)
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

  // En el useEffect de notificaciones (línea ~200 aproximadamente), reemplazar todo el bloque con:

  // Request notification permission and check status
  useEffect(() => {
    console.log("Checking notification support and permissions...")

    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return
    }

    console.log("Current permission:", Notification.permission)
    setNotificationPermission(Notification.permission)

    // Show prompt if permission is default and user is logged in
    if (user && currentScreen === "app") {
      console.log("User logged in, checking if should show prompt...")

      if (Notification.permission === "default") {
        console.log("Permission is default, showing prompt in 3 seconds...")
        const timer = setTimeout(() => {
          console.log("Showing notification prompt now")
          setShowNotificationPrompt(true)
        }, 3000)

        return () => {
          console.log("Clearing notification timer")
          clearTimeout(timer)
        }
      } else {
        console.log("Permission already granted or denied:", Notification.permission)
      }
    } else {
      console.log("User not logged in or not in app screen")
    }
  }, [user, currentScreen])

  // También actualizar la función requestNotificationPermission (línea ~230 aproximadamente):

  // Request notification permission function
  const requestNotificationPermission = async () => {
    console.log("requestNotificationPermission called")

    if (!("Notification" in window)) {
      console.log("Browser doesn't support notifications")
      alert("Este navegador no soporta notificaciones")
      setShowNotificationPrompt(false)
      return
    }

    try {
      console.log("Current permission before request:", Notification.permission)

      // For older browsers, use the callback version
      let permission
      if (Notification.requestPermission.length) {
        permission = await new Promise((resolve) => {
          Notification.requestPermission(resolve)
        })
      } else {
        permission = await Notification.requestPermission()
      }

      console.log("Permission result:", permission)
      setNotificationPermission(permission)
      setShowNotificationPrompt(false)

      if (permission === "granted") {
        console.log("Permission granted, showing test notification")
        try {
          const notification = new Notification("¡Notificaciones activadas! 🎉", {
            body: "Ahora recibirás recordatorios de tus tareas",
            icon: "/favicon-32x32.png",
            tag: "permission-granted",
            requireInteraction: false,
          })

          notification.onclick = () => {
            console.log("Test notification clicked")
            window.focus()
            notification.close()
          }

          // Auto close after 5 seconds
          setTimeout(() => {
            notification.close()
          }, 5000)
        } catch (notifError) {
          console.error("Error showing test notification:", notifError)
        }
      } else if (permission === "denied") {
        console.log("Permission denied")
        alert(
          "Has denegado las notificaciones. Puedes activarlas desde la configuración del navegador (icono de candado en la barra de direcciones).",
        )
      } else {
        console.log("Permission default/dismissed")
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      setShowNotificationPrompt(false)
      alert("Error al solicitar permisos de notificación: " + error.message)
    }
  }

  // Initialize app - runs only once
  useEffect(() => {
    if (isInitialized) return

    const initializeApp = () => {
      try {
        const savedUser = localStorage.getItem("futureTask_user")
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
          setLanguage(parsedUser.language || "es")

          // Load user tasks
          const savedTasks = localStorage.getItem(`futureTask_tasks_${parsedUser.id}`)
          if (savedTasks) {
            setTasks(JSON.parse(savedTasks))
          }

          // Load wishlist and notes
          if (parsedUser) {
            const savedWishlist = localStorage.getItem(`futureTask_wishlist_${parsedUser.id}`)
            if (savedWishlist) {
              setWishlistItems(JSON.parse(savedWishlist))
            }

            const savedNotes = localStorage.getItem(`futureTask_notes_${parsedUser.id}`)
            if (savedNotes) {
              setNotes(JSON.parse(savedNotes))
            }
          }

          setCurrentScreen(parsedUser.onboardingCompleted ? "app" : "welcome")
        }
      } catch (error) {
        console.error("Error initializing app:", error)
      } finally {
        setIsInitialized(true)
      }
    }

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
  const handleAuth = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: authMode === "register" ? name : email.split("@")[0],
      email,
      language,
      theme: "default",
      isPremium: false,
      onboardingCompleted: false,
      pomodoroSessions: 0,
    }

    setUser(newUser)
    localStorage.setItem("futureTask_user", JSON.stringify(newUser))
    setCurrentScreen(authMode === "register" ? "premium" : "app")

    // Reset form
    setEmail("")
    setPassword("")
    setName("")
  }

  const handlePremiumChoice = (isPremium: boolean) => {
    if (!user) return

    const updatedUser = { ...user, isPremium, onboardingCompleted: true }
    setUser(updatedUser)
    localStorage.setItem("futureTask_user", JSON.stringify(updatedUser))
    setCurrentScreen("app")
  }

  const addTask = () => {
    if (!newTask.trim() || !user) return

    const task: Task = {
      id: `${user.id}_${Date.now()}`,
      text: newTask,
      description: newTaskDescription,
      time: newTaskTime,
      completed: false,
      date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
      category: newTaskCategory,
      priority: newTaskPriority,
      notificationEnabled: !!newTaskTime && notificationPermission === "granted",
    }

    setTasks((prev) => [...prev, task])
    setNewTask("")
    setNewTaskDescription("")
    setNewTaskTime("")
  }

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task,
      ),
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
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

  const saveProfile = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      name: profileName,
      email: profileEmail,
      language: profileLanguage,
      theme: profileTheme,
    }

    setUser(updatedUser)
    setLanguage(profileLanguage)
    localStorage.setItem("futureTask_user", JSON.stringify(updatedUser))
    setShowProfileModal(false)
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
                {isMobile && (
                  <Button
                    onClick={() => setSidebarOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Global Search */}
            <div className="p-4 relative">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-purple-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Buscar tareas..."
                  className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} ${getCurrentTheme().placeholder} focus:border-purple-400 text-sm`}
                />
                {searchTerm && (
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setShowGlobalSearch(false)
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Search Results */}
              {showGlobalSearch && (
                <Card className="absolute top-full left-4 right-4 z-50 mt-2 bg-black/90 backdrop-blur-xl border-purple-500/30 shadow-2xl max-h-60 overflow-y-auto">
                  <CardContent className="p-3">
                    {getGlobalSearchResults().length > 0 ? (
                      <>
                        <h4 className={`text-xs font-semibold ${getCurrentTheme().textAccent} mb-2`}>
                          📋 Resultados ({getGlobalSearchResults().length})
                        </h4>
                        {getGlobalSearchResults().map((task) => (
                          <div
                            key={task.id}
                            onClick={() => navigateToTaskDate(task.date)}
                            className={`p-2 rounded-lg border cursor-pointer transition-all hover:bg-purple-500/10 mb-2 ${
                              task.completed
                                ? "bg-green-900/20 border-green-500/30 opacity-70"
                                : "bg-black/30 border-purple-500/30"
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <span
                                className={`text-sm font-semibold ${task.completed ? `line-through ${getCurrentTheme().textMuted}` : getCurrentTheme().textPrimary}`}
                              >
                                {task.text}
                              </span>
                              {task.completed && <Badge className="bg-green-500/20 text-green-300 text-xs">✓</Badge>}
                            </div>
                            <div className="flex items-center space-x-1">
                              <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                                📅{" "}
                                {new Date(task.date).toLocaleDateString("es-ES", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </Badge>
                              {task.time && (
                                <Badge className="bg-purple-500/20 text-purple-300 text-xs">🕐 {task.time}</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className={`text-sm ${getCurrentTheme().textPrimary}`}>No se encontraron tareas</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Stats Cards */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Card className={`${getCurrentTheme().cardBg} backdrop-blur-xl ${getCurrentTheme().border}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <div>
                        <p className={`text-xs ${getCurrentTheme().textSecondary}`}>{t("completedToday")}</p>
                        <p className={`text-lg font-bold ${getCurrentTheme().textPrimary}`}>
                          {getCompletedTasks().length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${getCurrentTheme().cardBg} backdrop-blur-xl ${getCurrentTheme().border}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className={`text-xs ${getCurrentTheme().textSecondary}`}>{t("totalToday")}</p>
                        <p className={`text-lg font-bold ${getCurrentTheme().textPrimary}`}>{getTodayTasks().length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className={`${getCurrentTheme().cardBg} backdrop-blur-xl ${getCurrentTheme().border}`}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${getCurrentTheme().textSecondary}`}>{t("progressToday")}</span>
                    <span className={`text-sm font-bold ${getCurrentTheme().textPrimary}`}>
                      {Math.round(getTodayProgress())}%
                    </span>
                  </div>
                  <Progress value={getTodayProgress()} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Notification Status Indicator - agregar después de los stats cards */}
            {user && (
              <div className="px-4 pb-2">
                <Card className={`${getCurrentTheme().cardBg} backdrop-blur-xl ${getCurrentTheme().border}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell
                          className={`w-4 h-4 ${notificationPermission === "granted" ? "text-green-400" : "text-gray-400"}`}
                        />
                        <span className={`text-xs ${getCurrentTheme().textSecondary}`}>Notificaciones</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            notificationPermission === "granted"
                              ? "bg-green-400"
                              : notificationPermission === "denied"
                                ? "bg-red-400"
                                : "bg-yellow-400"
                          }`}
                        />
                        <span className={`text-xs ${getCurrentTheme().textPrimary}`}>
                          {notificationPermission === "granted"
                            ? "Activas"
                            : notificationPermission === "denied"
                              ? "Denegadas"
                              : "Pendientes"}
                        </span>
                      </div>
                    </div>
                    {notificationPermission !== "granted" && (
                      <Button
                        onClick={() => setShowNotificationPrompt(true)}
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 border-purple-500/30 text-purple-300 bg-transparent text-xs"
                      >
                        Activar notificaciones
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Manual notification test button - agregar después del indicador de notificaciones */}
            {user && (
              <div className="px-4 pb-2">
                <Button
                  onClick={() => {
                    console.log("Manual notification test button clicked")
                    if (Notification.permission === "default") {
                      console.log("Showing notification prompt manually")
                      setShowNotificationPrompt(true)
                    } else if (Notification.permission === "granted") {
                      console.log("Testing notification manually")
                      try {
                        const notification = new Notification("🧪 Notificación de prueba", {
                          body: "¡Las notificaciones están funcionando correctamente!",
                          icon: "/favicon-32x32.png",
                          tag: "manual-test",
                        })
                        setTimeout(() => notification.close(), 5000)
                      } catch (error) {
                        console.error("Error showing manual test notification:", error)
                        alert("Error mostrando notificación: " + error.message)
                      }
                    } else {
                      alert("Las notificaciones están bloqueadas. Actívalas desde la configuración del navegador.")
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-500/30 text-blue-300 bg-transparent text-xs"
                >
                  <Bell className="w-3 h-3 mr-1" />
                  {Notification.permission === "default"
                    ? "Activar notificaciones"
                    : Notification.permission === "granted"
                      ? "Probar notificación"
                      : "Notificaciones bloqueadas"}
                </Button>
              </div>
            )}

            {/* Navigation */}
            <div className="p-4">
              <div className="space-y-2">
                <Button
                  onClick={() => handleTabChange("tasks")}
                  variant={activeTab === "tasks" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "tasks"
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                      : "text-gray-300 hover:text-white hover:bg-purple-500/20"
                  }`}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {t("tasks")}
                </Button>
                <Button
                  onClick={() => handleTabChange("pomodoro")}
                  variant={activeTab === "pomodoro" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "pomodoro"
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                      : "text-gray-300 hover:text-white hover:bg-purple-500/20"
                  }`}
                >
                  <Timer className="w-4 h-4 mr-2" />
                  {t("pomodoro")}
                </Button>
                <Button
                  onClick={() => handleTabChange("wishlist")}
                  variant={activeTab === "wishlist" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "wishlist"
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                      : "text-gray-300 hover:text-white hover:bg-purple-500/20"
                  }`}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {t("wishlist")}
                  {!user.isPremium && <Crown className="w-3 h-3 ml-auto text-yellow-400" />}
                </Button>
                <Button
                  onClick={() => handleTabChange("notes")}
                  variant={activeTab === "notes" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === "notes"
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                      : "text-gray-300 hover:text-white hover:bg-purple-500/20"
                  }`}
                >
                  <StickyNote className="w-4 h-4 mr-2" />
                  {t("notes")}
                  {!user.isPremium && <Crown className="w-3 h-3 ml-auto text-yellow-400" />}
                </Button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 mt-auto border-t border-purple-500/20">
              <div className="space-y-2">
                {!user.isPremium && (
                  <Button
                    onClick={() => setShowPremiumModal(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-sm"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Premium
                  </Button>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-purple-500/30 text-purple-300 bg-transparent text-sm"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      {t("achievements")} ({achievements.filter((a) => a.unlocked).length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`bg-black/90 backdrop-blur-xl border-purple-500/30 text-white`}>
                    <DialogHeader>
                      <DialogTitle>Tus {t("achievements")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${
                            achievement.unlocked ? "bg-purple-500/20" : "bg-gray-800/30"
                          }`}
                        >
                          <div className={`p-2 rounded-full ${achievement.unlocked ? "bg-purple-500" : "bg-gray-700"}`}>
                            {achievement.icon}
                          </div>
                          <div>
                            <span className="font-semibold text-sm">{achievement.name}</span>
                            <p className="text-xs text-gray-300">{achievement.description}</p>
                          </div>
                          {achievement.unlocked && <Badge className="bg-green-500 text-xs">Desbloqueado</Badge>}
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={openProfileModal}
                  variant="outline"
                  className="w-full border-purple-500/30 text-purple-300 bg-transparent text-sm"
                >
                  {t("profile")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar for Mobile */}
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {t("appName")}
                </h1>
              </div>
              <Button
                onClick={openProfileModal}
                variant="outline"
                size="sm"
                className="border-purple-500/30 text-purple-300 bg-transparent"
              >
                {t("profile")}
              </Button>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 space-y-6">
              {/* Calendar and Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <Card className={`${getCurrentTheme().cardBg} backdrop-blur-xl ${getCurrentTheme().border}`}>
                  <CardHeader className="pb-3">
                    <CardTitle
                      className={`${getCurrentTheme().textPrimary} flex items-center space-x-2 text-base md:text-lg`}
                    >
                      <CalendarIcon className="w-4 h-4 md:w-5 md:h-5" />
                      <span>{t("calendar")}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="scale-75 md:scale-90 origin-top">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="rounded-md border-0 w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tab Content */}
                <Card className={`${getCurrentTheme().cardBg} backdrop-blur-xl ${getCurrentTheme().border}`}>
                  <CardContent className="p-0">
                    {/* Tasks Tab */}
                    {activeTab === "tasks" && (
                      <div className="p-4 md:p-6 space-y-4">
                        <div className="space-y-2">
                          <h3 className={`text-lg font-semibold ${getCurrentTheme().textPrimary}`}>
                            {t("tasks")} -{" "}
                            {selectedDate.toLocaleDateString("es-ES", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </h3>
                          <Progress value={getTodayProgress()} className="h-2" />
                          <p className={`text-sm ${getCurrentTheme().textSecondary}`}>
                            {getCompletedTasks().length} de {getTodayTasks().length} completadas
                          </p>
                        </div>

                        {/* Filters */}
                        <div className="space-y-3 p-3 bg-black/20 rounded-lg border border-purple-500/20">
                          <h4 className={`text-sm font-semibold ${getCurrentTheme().textPrimary}`}>⚙️ Filtros</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <Select value={taskFilter} onValueChange={(value) => setTaskFilter(value as any)}>
                              <SelectTrigger
                                className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} text-xs`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-purple-500/30">
                                <SelectItem value="all" className={getCurrentTheme().textPrimary}>
                                  Todas
                                </SelectItem>
                                <SelectItem value="pending" className={getCurrentTheme().textPrimary}>
                                  Pendientes
                                </SelectItem>
                                <SelectItem value="completed" className={getCurrentTheme().textPrimary}>
                                  Completadas
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as any)}>
                              <SelectTrigger
                                className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} text-xs`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-purple-500/30">
                                <SelectItem value="all" className={getCurrentTheme().textPrimary}>
                                  Todas
                                </SelectItem>
                                <SelectItem value="work" className={getCurrentTheme().textPrimary}>
                                  {t("work")}
                                </SelectItem>
                                <SelectItem value="personal" className={getCurrentTheme().textPrimary}>
                                  {t("personal")}
                                </SelectItem>
                                <SelectItem value="health" className={getCurrentTheme().textPrimary}>
                                  {t("health")}
                                </SelectItem>
                                <SelectItem value="learning" className={getCurrentTheme().textPrimary}>
                                  {t("learning")}
                                </SelectItem>
                                <SelectItem value="other" className={getCurrentTheme().textPrimary}>
                                  {t("other")}
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as any)}>
                              <SelectTrigger
                                className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} text-xs`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-purple-500/30">
                                <SelectItem value="all" className={getCurrentTheme().textPrimary}>
                                  Todas
                                </SelectItem>
                                <SelectItem value="high" className={getCurrentTheme().textPrimary}>
                                  {t("high")}
                                </SelectItem>
                                <SelectItem value="medium" className={getCurrentTheme().textPrimary}>
                                  {t("medium")}
                                </SelectItem>
                                <SelectItem value="low" className={getCurrentTheme().textPrimary}>
                                  {t("low")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Add Task Form */}
                        <div className="space-y-3">
                          <Input
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder={t("newTask")}
                            className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} ${getCurrentTheme().placeholder}`}
                            onKeyPress={(e) => e.key === "Enter" && addTask()}
                          />

                          <Textarea
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            placeholder={t("description")}
                            className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} min-h-[60px] ${getCurrentTheme().placeholder}`}
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="time"
                              value={newTaskTime}
                              onChange={(e) => setNewTaskTime(e.target.value)}
                              placeholder={t("time")}
                              className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} ${getCurrentTheme().placeholder}`}
                            />
                            <Button onClick={addTask} className="bg-gradient-to-r from-purple-500 to-cyan-500">
                              <Plus className="w-4 h-4 mr-2" />
                              Agregar
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Select
                              value={newTaskCategory}
                              onValueChange={(value) => setNewTaskCategory(value as Task["category"])}
                            >
                              <SelectTrigger
                                className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-purple-500/30">
                                <SelectItem value="work" className={getCurrentTheme().textPrimary}>
                                  {t("work")}
                                </SelectItem>
                                <SelectItem value="personal" className={getCurrentTheme().textPrimary}>
                                  {t("personal")}
                                </SelectItem>
                                <SelectItem value="health" className={getCurrentTheme().textPrimary}>
                                  {t("health")}
                                </SelectItem>
                                <SelectItem value="learning" className={getCurrentTheme().textPrimary}>
                                  {t("learning")}
                                </SelectItem>
                                <SelectItem value="other" className={getCurrentTheme().textPrimary}>
                                  {t("other")}
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Select
                              value={newTaskPriority}
                              onValueChange={(value) => setNewTaskPriority(value as Task["priority"])}
                            >
                              <SelectTrigger
                                className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-purple-500/30">
                                <SelectItem value="high" className={getCurrentTheme().textPrimary}>
                                  {t("high")}
                                </SelectItem>
                                <SelectItem value="medium" className={getCurrentTheme().textPrimary}>
                                  {t("medium")}
                                </SelectItem>
                                <SelectItem value="low" className={getCurrentTheme().textPrimary}>
                                  {t("low")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Tasks List */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {getFilteredTasks().map((task) => (
                            <div
                              key={task.id}
                              className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
                                task.completed
                                  ? "bg-green-900/20 border-green-500/30 line-through opacity-60"
                                  : "bg-black/30 border-purple-500/30"
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <Checkbox
                                  checked={task.completed}
                                  onCheckedChange={() => toggleTask(task.id)}
                                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500 data-[state=checked]:border-green-400 border-2 border-purple-500/30 rounded-md transition-all duration-200 hover:border-purple-400"
                                />
                                <div className="flex-1">
                                  {editingTask === task.id ? (
                                    <div className="space-y-2">
                                      <Input
                                        value={editTaskText}
                                        onChange={(e) => setEditTaskText(e.target.value)}
                                        className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                                      />
                                      <Textarea
                                        value={editTaskDescription}
                                        onChange={(e) => setEditTaskDescription(e.target.value)}
                                        className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} min-h-[60px]`}
                                      />
                                      <Input
                                        type="time"
                                        value={editTaskTime}
                                        onChange={(e) => setEditTaskTime(e.target.value)}
                                        className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                                      />
                                      <div className="flex space-x-2">
                                        <Button onClick={saveEditTask} size="sm" className="bg-green-500">
                                          Guardar
                                        </Button>
                                        <Button onClick={cancelEditTask} size="sm" variant="outline">
                                          Cancelar
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="flex items-center space-x-2 flex-wrap">
                                        <span className={`font-semibold ${getCurrentTheme().textPrimary}`}>
                                          {task.text}
                                        </span>
                                        <Badge className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>
                                          {t(task.priority)}
                                        </Badge>
                                        {task.time && (
                                          <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {task.time}
                                          </Badge>
                                        )}
                                        {task.notificationEnabled && (
                                          <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                                            <Bell className="w-3 h-3" />
                                          </Badge>
                                        )}
                                      </div>
                                      {task.description && (
                                        <p className={`text-sm ${getCurrentTheme().textSecondary}`}>
                                          {task.description}
                                        </p>
                                      )}
                                      <Badge className={`text-xs ${CATEGORY_COLORS[task.category]}`}>
                                        {t(task.category)}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                {!task.completed && editingTask !== task.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEditTask(task)}
                                    className="text-blue-300 hover:bg-blue-500/20"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteTask(task.id)}
                                  className="text-red-300 hover:bg-red-500/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          {getFilteredTasks().length === 0 && getTodayTasks().length > 0 && (
                            <div className="p-4 rounded-lg border border-purple-500/30 text-center">
                              <p className={`${getCurrentTheme().textPrimary} font-semibold`}>
                                No hay tareas que coincidan con los filtros
                              </p>
                              <p className={`${getCurrentTheme().textSecondary}`}>Intenta cambiar los filtros</p>
                            </div>
                          )}

                          {getTodayTasks().length === 0 && (
                            <div className="p-4 rounded-lg border border-purple-500/30 text-center">
                              <p className={`${getCurrentTheme().textPrimary} font-semibold`}>
                                No hay tareas para este día
                              </p>
                              <p className={`${getCurrentTheme().textSecondary}`}>¡Agrega una nueva tarea arriba!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pomodoro Tab */}
                    {activeTab === "pomodoro" && (
                      <div className="p-4 md:p-6 space-y-4">
                        <div className="text-center space-y-6">
                          <h3 className={`text-lg font-semibold ${getCurrentTheme().textPrimary}`}>{t("pomodoro")}</h3>

                          <div
                            className={`text-4xl md:text-6xl font-bold ${getCurrentTheme().textPrimary} tabular-nums`}
                          >
                            {formatTime(pomodoroTime)}
                          </div>

                          <div className="flex justify-center space-x-2">
                            <Badge className={pomodoroType === "work" ? "bg-purple-500" : "bg-gray-500"}>
                              {t("workSession")}
                            </Badge>
                            <Badge className={pomodoroType === "shortBreak" ? "bg-green-500" : "bg-gray-500"}>
                              {t("shortBreak")}
                            </Badge>
                          </div>

                          <div className="flex justify-center space-x-4">
                            <Button
                              onClick={() => setPomodoroActive(!pomodoroActive)}
                              className="bg-gradient-to-r from-purple-500 to-cyan-500"
                            >
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
                              variant="outline"
                              className="border-purple-500/30"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              {t("reset")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Wishlist Tab */}
                    {activeTab === "wishlist" && user.isPremium && (
                      <div className="p-4 md:p-6 space-y-4">
                        <div className="space-y-2">
                          <h3
                            className={`text-lg font-semibold ${getCurrentTheme().textPrimary} flex items-center space-x-2`}
                          >
                            <Heart className="w-5 h-5 text-pink-400" />
                            <span>{t("wishlist")}</span>
                          </h3>
                          <p className={`text-sm ${getCurrentTheme().textSecondary}`}>
                            Guarda tus deseos y metas para el futuro
                          </p>
                        </div>

                        {/* Add Wish Form */}
                        <div className="space-y-3">
                          <Input
                            value={newWishItem}
                            onChange={(e) => setNewWishItem(e.target.value)}
                            placeholder="Nuevo deseo..."
                            className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} ${getCurrentTheme().placeholder}`}
                            onKeyPress={(e) => e.key === "Enter" && addWishItem()}
                          />

                          <Textarea
                            value={newWishDescription}
                            onChange={(e) => setNewWishDescription(e.target.value)}
                            placeholder="Descripción del deseo (opcional)..."
                            className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} min-h-[60px] ${getCurrentTheme().placeholder}`}
                          />

                          <Button onClick={addWishItem} className="w-full bg-gradient-to-r from-pink-500 to-purple-500">
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Deseo
                          </Button>
                        </div>

                        {/* Wishlist Items */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {wishlistItems.map((item) => (
                            <div
                              key={item.id}
                              className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
                                item.completed
                                  ? "bg-green-900/20 border-green-500/30 line-through opacity-60"
                                  : "bg-black/30 border-pink-500/30"
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <Checkbox
                                  checked={item.completed}
                                  onCheckedChange={() => toggleWishItem(item.id)}
                                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-purple-500 data-[state=checked]:border-pink-400 border-2 border-pink-500/30 rounded-md transition-all duration-200 hover:border-pink-400"
                                />
                                <div className="flex-1">
                                  <div className="space-y-1">
                                    <span className={`font-semibold ${getCurrentTheme().textPrimary}`}>
                                      {item.text}
                                    </span>
                                    {item.description && (
                                      <p className={`text-sm ${getCurrentTheme().textSecondary}`}>{item.description}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteWishItem(item.id)}
                                className="text-red-300 hover:bg-red-500/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}

                          {wishlistItems.length === 0 && (
                            <div className="p-4 rounded-lg border border-pink-500/30 text-center">
                              <Heart className="w-12 h-12 mx-auto mb-3 text-pink-400" />
                              <p className={`${getCurrentTheme().textPrimary} font-semibold`}>No tienes deseos aún</p>
                              <p className={`${getCurrentTheme().textSecondary}`}>¡Agrega tu primer deseo arriba!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes Tab */}
                    {activeTab === "notes" && user.isPremium && (
                      <div className="p-4 md:p-6 space-y-4">
                        <div className="space-y-2">
                          <h3
                            className={`text-lg font-semibold ${getCurrentTheme().textPrimary} flex items-center space-x-2`}
                          >
                            <StickyNote className="w-5 h-5 text-yellow-400" />
                            <span>{t("notes")}</span>
                          </h3>
                          <p className={`text-sm ${getCurrentTheme().textSecondary}`}>
                            Toma notas y guarda ideas importantes
                          </p>
                        </div>

                        {/* Add Note Form */}
                        <div className="space-y-3">
                          <Input
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            placeholder="Título de la nota..."
                            className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} ${getCurrentTheme().placeholder}`}
                          />

                          <Textarea
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            placeholder="Contenido de la nota..."
                            className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} min-h-[100px] ${getCurrentTheme().placeholder}`}
                          />

                          <Button onClick={addNote} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500">
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Nota
                          </Button>
                        </div>

                        {/* Notes List */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {notes.map((note) => (
                            <div
                              key={note.id}
                              className="p-3 rounded-lg border bg-black/30 border-yellow-500/30 transition-all"
                            >
                              {editingNote === note.id ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editNoteTitle}
                                    onChange={(e) => setEditNoteTitle(e.target.value)}
                                    className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
                                  />
                                  <Textarea
                                    value={editNoteContent}
                                    onChange={(e) => setEditNoteContent(e.target.value)}
                                    className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} min-h-[100px]`}
                                  />
                                  <div className="flex space-x-2">
                                    <Button onClick={saveEditNote} size="sm" className="bg-green-500">
                                      Guardar
                                    </Button>
                                    <Button onClick={cancelEditNote} size="sm" variant="outline">
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className={`font-semibold ${getCurrentTheme().textPrimary}`}>{note.title}</h4>
                                      <p className={`text-sm ${getCurrentTheme().textSecondary} mt-1`}>
                                        {note.content}
                                      </p>
                                      <p className={`text-xs ${getCurrentTheme().textMuted} mt-2`}>
                                        {new Date(note.createdAt).toLocaleDateString("es-ES", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                    <div className="flex space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => startEditNote(note)}
                                        className="text-blue-300 hover:bg-blue-500/20"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteNote(note.id)}
                                        className="text-red-300 hover:bg-red-500/20"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          {notes.length === 0 && (
                            <div className="p-4 rounded-lg border border-yellow-500/30 text-center">
                              <StickyNote className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
                              <p className={`${getCurrentTheme().textPrimary} font-semibold`}>No tienes notas aún</p>
                              <p className={`${getCurrentTheme().textSecondary}`}>¡Crea tu primera nota arriba!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Premium Required Message */}
                    {(activeTab === "wishlist" || activeTab === "notes") && !user.isPremium && (
                      <div className="p-4 md:p-6">
                        <div className="text-center py-8">
                          <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                          <p className={`${getCurrentTheme().textPrimary} font-semibold mb-2`}>Función Premium</p>
                          <p className={`${getCurrentTheme().textSecondary} mb-4`}>
                            Actualiza a Premium para acceder a esta función
                          </p>
                          <Button
                            onClick={() => setShowPremiumModal(true)}
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
                          >
                            <Crown className="w-4 h-4 mr-2" />
                            Actualizar a Premium
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Google AdSense Space */}
              <div className="w-full">
                <Card className={`${getCurrentTheme().cardBg} backdrop-blur-xl ${getCurrentTheme().border}`}>
                  <CardContent className="p-4">
                    <div className="text-center py-8 border-2 border-dashed border-purple-500/30 rounded-lg">
                      <div className={`${getCurrentTheme().textMuted} text-sm`}>
                        📢 Espacio reservado para Google AdSense
                      </div>
                      <div className={`${getCurrentTheme().textMuted} text-xs mt-1`}>728x90 - Leaderboard Banner</div>
                      {/* Aquí irá el código de Google AdSense */}
                      <div className="mt-4 text-xs text-gray-500">
                        {/* 
                        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXX"
                                crossorigin="anonymous"></script>
                        <ins className="adsbygoogle"
                             style={{display:"block"}}
                             data-ad-client="ca-pub-XXXXXXXXX"
                             data-ad-slot="XXXXXXXXX"
                             data-ad-format="auto"
                             data-full-width-responsive="true"></ins>
                        <script>
                             (adsbygoogle = window.adsbygoogle || []).push({});
                        </script>
                        */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Permission Prompt */}
      {showNotificationPrompt && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Card className="bg-black/90 backdrop-blur-xl border-purple-500/30 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Bell className="w-5 h-5 text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">{t("notificationPermission")}</h4>
                  <p className="text-gray-300 text-xs mt-1">{t("notificationPermissionDesc")}</p>
                  <div className="flex space-x-2 mt-3">
                    <Button
                      onClick={requestNotificationPermission}
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-xs"
                    >
                      {t("enableNotifications")}
                    </Button>
                    <Button
                      onClick={() => setShowNotificationPrompt(false)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 text-xs"
                    >
                      Ahora no
                    </Button>
                  </div>
                  {/* Test notification button */}
                  {notificationPermission === "granted" && (
                    <Button
                      onClick={() => {
                        try {
                          const notification = new Notification("🧪 Notificación de prueba", {
                            body: "¡Las notificaciones están funcionando correctamente!",
                            icon: "/favicon-32x32.png",
                            tag: "test-notification",
                          })
                          setTimeout(() => notification.close(), 5000)
                        } catch (error) {
                          console.error("Error showing test notification:", error)
                        }
                      }}
                      size="sm"
                      variant="outline"
                      className="border-green-600 text-green-300 text-xs mt-2 w-full"
                    >
                      Probar notificación
                    </Button>
                  )}
                </div>
                <Button
                  onClick={() => setShowNotificationPrompt(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Premium Modal */}
      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent className={`bg-black/90 backdrop-blur-xl border-purple-500/30 text-white max-w-sm md:max-w-2xl`}>
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🚀 Actualizar a Premium
            </DialogTitle>
            <DialogDescription className={getCurrentTheme().textSecondary}>
              Desbloquea todas las funcionalidades de FutureTask
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center space-x-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                <span className="text-sm md:text-base">Tareas ilimitadas</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                <span className="text-sm md:text-base">Lista de deseos</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                <span className="text-sm md:text-base">Notas ilimitadas</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                <span className="text-sm md:text-base">Todos los temas</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                <span className="text-sm md:text-base">Notificaciones</span>
              </div>
            </div>
            <Button
              onClick={() => {
                const updatedUser = { ...user, isPremium: true }
                setUser(updatedUser)
                localStorage.setItem("futureTask_user", JSON.stringify(updatedUser))
                setShowPremiumModal(false)
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
            >
              <Crown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              {t("upgradeButton")} - {billingType === "monthly" ? getPricing().monthly.full : getPricing().yearly.full}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className={`bg-black/90 backdrop-blur-xl border-purple-500/30 text-white max-w-sm md:max-w-lg`}>
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ⚙️ Configuración del Perfil
            </DialogTitle>
            <DialogDescription className={getCurrentTheme().textSecondary}>
              Actualiza tu información personal y preferencias
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name" className={getCurrentTheme().textSecondary}>
                Nombre
              </Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email" className={getCurrentTheme().textSecondary}>
                Email
              </Label>
              <Input
                id="profile-email"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-password" className={getCurrentTheme().textSecondary}>
                Nueva Contraseña (opcional)
              </Label>
              <Input
                id="profile-password"
                type="password"
                value={profilePassword}
                onChange={(e) => setProfilePassword(e.target.value)}
                placeholder="Dejar vacío para mantener actual"
                className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary} ${getCurrentTheme().placeholder}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-language" className={getCurrentTheme().textSecondary}>
                Idioma
              </Label>
              <Select
                value={profileLanguage}
                onValueChange={(value) => setProfileLanguage(value as "es" | "en" | "fr" | "de" | "it")}
              >
                <SelectTrigger className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  <SelectItem value="es" className={getCurrentTheme().textPrimary}>
                    🇪🇸 Español
                  </SelectItem>
                  <SelectItem value="en" className={getCurrentTheme().textPrimary}>
                    🇺🇸 English
                  </SelectItem>
                  <SelectItem value="fr" className={getCurrentTheme().textPrimary}>
                    🇫🇷 Français
                  </SelectItem>
                  <SelectItem value="de" className={getCurrentTheme().textPrimary}>
                    🇩🇪 Deutsch
                  </SelectItem>
                  <SelectItem value="it" className={getCurrentTheme().textPrimary}>
                    🇮🇹 Italiano
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-theme" className={getCurrentTheme().textSecondary}>
                Tema
              </Label>
              <Select value={profileTheme} onValueChange={setProfileTheme}>
                <SelectTrigger className={`bg-black/30 border-purple-500/30 ${getCurrentTheme().textPrimary}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  <div className={`px-2 py-1 text-xs ${getCurrentTheme().textMuted} font-semibold`}>GRATUITOS</div>
                  {Object.entries(THEMES.free).map(([key, theme]) => (
                    <SelectItem key={key} value={key} className={getCurrentTheme().textPrimary}>
                      {theme.name}
                    </SelectItem>
                  ))}
                  {user?.isPremium && (
                    <>
                      <div className={`px-2 py-1 text-xs text-yellow-400 font-semibold`}>PREMIUM ⭐</div>
                      {Object.entries(THEMES.premium).map(([key, theme]) => (
                        <SelectItem key={key} value={key} className={getCurrentTheme().textPrimary}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 pt-4">
              <Button
                onClick={saveProfile}
                className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
              >
                Guardar Cambios
              </Button>
              <Button onClick={logout} variant="outline" className="border-red-500/30 text-red-300 bg-transparent">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
