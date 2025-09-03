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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Check,
  X,
  Clock,
  Settings,
  LogOut,
  Globe,
  Database,
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
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  getUserNotes,
  createNote,
  updateNote,
  deleteNote,
  migrateLocalStorageToSupabase,
} from "@/lib/database"

import { isSupabaseAvailable } from "@/lib/supabase"

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

interface WishlistItem {
  id: string
  user_id: string
  text: string
  description?: string
  completed: boolean
  created_at: string
  updated_at: string
}

interface Note {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
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
    language: "Idioma",
    selectLanguage: "Selecciona tu idioma",
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
    search: "Buscar",
    all: "Todos",
    pending: "Pendientes",
    addTask: "Agregar Tarea",
    editTask: "Editar Tarea",
    deleteTask: "Eliminar Tarea",
    saveChanges: "Guardar Cambios",
    cancel: "Cancelar",
    getStarted: "Comenzar",
    noAccountRegister: "¿No tienes cuenta? Regístrate",
    hasAccountLogin: "¿Ya tienes cuenta? Inicia sesión",
    settings: "Configuración",
    configuration: "Configuración",
    personalizeAccount: "Personaliza tu cuenta y preferencias",
    theme: "Tema",
    registration: "Registro",
    newPassword: "Nueva Contraseña",
    leaveEmptyKeepCurrent: "Dejar vacío para mantener actual",
    databaseStatus: "Estado de la Base de Datos",
    migrateData: "Migrar Datos",
    migrateDataDesc: "Migrar datos locales a Supabase",
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
    language: "Language",
    selectLanguage: "Select your language",
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
    search: "Search",
    all: "All",
    pending: "Pending",
    addTask: "Add Task",
    editTask: "Edit Task",
    deleteTask: "Delete Task",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    getStarted: "Get Started",
    noAccountRegister: "Don't have an account? Register",
    hasAccountLogin: "Already have an account? Login",
    settings: "Settings",
    configuration: "Configuration",
    personalizeAccount: "Customize your account and preferences",
    theme: "Theme",
    registration: "Registration",
    newPassword: "New Password",
    leaveEmptyKeepCurrent: "Leave empty to keep current",
    databaseStatus: "Database Status",
    migrateData: "Migrate Data",
    migrateDataDesc: "Migrate local data to Supabase",
  },
  fr: {
    appName: "FutureTask",
    appDescription: "Votre calendrier intelligent du futur",
    welcomeTitle: "Bienvenue sur FutureTask !",
    login: "Se connecter",
    register: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    name: "Nom",
    language: "Langue",
    selectLanguage: "Sélectionnez votre langue",
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
    high: "Élevée",
    medium: "Moyenne",
    low: "Faible",
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
    monthlyPrice: "1,99€/mois",
    yearlyPrice: "20€/an",
    yearlyDiscount: "Économisez 3,88€",
    billingMonthly: "Facturation mensuelle",
    billingYearly: "Facturation annuelle (2 mois gratuits)",
    upgradeButton: "Passer à Premium",
    notification: "Notification",
    taskReminder: "Rappel de tâche",
    notificationPermission: "Autoriser les notifications",
    notificationPermissionDesc: "Activez les notifications pour recevoir des rappels de tâches",
    enableNotifications: "Activer les notifications",
    search: "Rechercher",
    all: "Tous",
    pending: "En attente",
    addTask: "Ajouter une tâche",
    editTask: "Modifier la tâche",
    deleteTask: "Supprimer la tâche",
    saveChanges: "Enregistrer les modifications",
    cancel: "Annuler",
    getStarted: "Commencer",
    noAccountRegister: "Pas de compte ? Inscrivez-vous",
    hasAccountLogin: "Déjà un compte ? Connectez-vous",
    settings: "Paramètres",
    configuration: "Configuration",
    personalizeAccount: "Personnalisez votre compte et préférences",
    theme: "Thème",
    registration: "Inscription",
    newPassword: "Nouveau mot de passe",
    leaveEmptyKeepCurrent: "Laisser vide pour conserver l'actuel",
    databaseStatus: "État de la base de données",
    migrateData: "Migrer les données",
    migrateDataDesc: "Migrer les données locales vers Supabase",
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
    language: "Sprache",
    selectLanguage: "Wählen Sie Ihre Sprache",
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
    monthlyPrice: "1,99€/Monat",
    yearlyPrice: "20€/Jahr",
    yearlyDiscount: "Sparen Sie 3,88€",
    billingMonthly: "Monatliche Abrechnung",
    billingYearly: "Jährliche Abrechnung (2 Monate kostenlos)",
    upgradeButton: "Auf Premium upgraden",
    notification: "Benachrichtigung",
    taskReminder: "Aufgabenerinnerung",
    notificationPermission: "Benachrichtigungen erlauben",
    notificationPermissionDesc: "Aktivieren Sie Benachrichtigungen für Aufgabenerinnerungen",
    enableNotifications: "Benachrichtigungen aktivieren",
    search: "Suchen",
    all: "Alle",
    pending: "Ausstehend",
    addTask: "Aufgabe hinzufügen",
    editTask: "Aufgabe bearbeiten",
    deleteTask: "Aufgabe löschen",
    saveChanges: "Änderungen speichern",
    cancel: "Abbrechen",
    getStarted: "Loslegen",
    noAccountRegister: "Kein Konto? Registrieren",
    hasAccountLogin: "Bereits ein Konto? Anmelden",
    settings: "Einstellungen",
    configuration: "Konfiguration",
    personalizeAccount: "Passen Sie Ihr Konto und Ihre Einstellungen an",
    theme: "Design",
    registration: "Registrierung",
    newPassword: "Neues Passwort",
    leaveEmptyKeepCurrent: "Leer lassen, um das aktuelle zu behalten",
    databaseStatus: "Datenbankstatus",
    migrateData: "Daten migrieren",
    migrateDataDesc: "Lokale Daten zu Supabase migrieren",
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
    language: "Lingua",
    selectLanguage: "Seleziona la tua lingua",
    calendar: "Calendario",
    tasks: "Attività",
    wishlist: "Lista dei desideri",
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
    monthlyPrice: "1,99€/mese",
    yearlyPrice: "20€/anno",
    yearlyDiscount: "Risparmia 3,88€",
    billingMonthly: "Fatturazione mensile",
    billingYearly: "Fatturazione annuale (2 mesi gratuiti)",
    upgradeButton: "Passa a Premium",
    notification: "Notifica",
    taskReminder: "Promemoria attività",
    notificationPermission: "Consenti notifiche",
    notificationPermissionDesc: "Attiva le notifiche per ricevere promemoria delle attività",
    enableNotifications: "Attiva notifiche",
    search: "Cerca",
    all: "Tutti",
    pending: "In sospeso",
    addTask: "Aggiungi attività",
    editTask: "Modifica attività",
    deleteTask: "Elimina attività",
    saveChanges: "Salva modifiche",
    cancel: "Annulla",
    getStarted: "Inizia",
    noAccountRegister: "Non hai un account? Registrati",
    hasAccountLogin: "Hai già un account? Accedi",
    settings: "Impostazioni",
    configuration: "Configurazione",
    personalizeAccount: "Personalizza il tuo account e le preferenze",
    theme: "Tema",
    registration: "Registrazione",
    newPassword: "Nuova password",
    leaveEmptyKeepCurrent: "Lascia vuoto per mantenere quello attuale",
    databaseStatus: "Stato del database",
    migrateData: "Migra dati",
    migrateDataDesc: "Migra i dati locali su Supabase",
  },
}

// Temas corregidos con colores apropiados
const THEMES = {
  free: {
    default: {
      name: "Futurista (Predeterminado)",
      gradient: "from-slate-900 via-purple-900 to-slate-900",
      cardBg: "bg-black/20 backdrop-blur-xl",
      border: "border-purple-500/20",
      textPrimary: "text-white",
      textSecondary: "text-gray-300",
      textMuted: "text-gray-400",
      textAccent: "text-purple-300",
      placeholder: "placeholder:text-gray-400",
      buttonPrimary: "bg-gradient-to-r from-purple-500 to-cyan-500 text-white",
      buttonSecondary: "bg-white/10 text-white border-white/20",
      inputBg: "bg-black/30 border-purple-500/30 text-white",
    },
    light: {
      name: "Claro",
      gradient: "from-gray-100 via-white to-gray-100",
      cardBg: "bg-white/80 backdrop-blur-xl",
      border: "border-gray-300/50",
      textPrimary: "text-gray-900",
      textSecondary: "text-gray-700",
      textMuted: "text-gray-500",
      textAccent: "text-purple-600",
      placeholder: "placeholder:text-gray-400",
      buttonPrimary: "bg-gradient-to-r from-purple-500 to-cyan-500 text-white",
      buttonSecondary: "bg-gray-100 text-gray-900 border-gray-300",
      inputBg: "bg-white border-gray-300 text-gray-900",
    },
    dark: {
      name: "Oscuro",
      gradient: "from-gray-900 via-black to-gray-900",
      cardBg: "bg-gray-800/80 backdrop-blur-xl",
      border: "border-gray-600/30",
      textPrimary: "text-gray-100",
      textSecondary: "text-gray-300",
      textMuted: "text-gray-400",
      textAccent: "text-gray-200",
      placeholder: "placeholder:text-gray-500",
      buttonPrimary: "bg-gradient-to-r from-purple-500 to-cyan-500 text-white",
      buttonSecondary: "bg-gray-700 text-gray-100 border-gray-600",
      inputBg: "bg-gray-700 border-gray-600 text-gray-100",
    },
    ocean: {
      name: "Océano",
      gradient: "from-blue-900 via-cyan-900 to-blue-900",
      cardBg: "bg-blue-900/20 backdrop-blur-xl",
      border: "border-cyan-500/20",
      textPrimary: "text-cyan-100",
      textSecondary: "text-cyan-200",
      textMuted: "text-cyan-300",
      textAccent: "text-cyan-300",
      placeholder: "placeholder:text-cyan-400",
      buttonPrimary: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
      buttonSecondary: "bg-cyan-900/30 text-cyan-100 border-cyan-500/30",
      inputBg: "bg-blue-900/30 border-cyan-500/30 text-cyan-100",
    },
    forest: {
      name: "Bosque",
      gradient: "from-green-900 via-emerald-900 to-green-900",
      cardBg: "bg-green-900/20 backdrop-blur-xl",
      border: "border-emerald-500/20",
      textPrimary: "text-emerald-100",
      textSecondary: "text-emerald-200",
      textMuted: "text-emerald-300",
      textAccent: "text-emerald-300",
      placeholder: "placeholder:text-emerald-400",
      buttonPrimary: "bg-gradient-to-r from-emerald-500 to-green-500 text-white",
      buttonSecondary: "bg-green-900/30 text-emerald-100 border-emerald-500/30",
      inputBg: "bg-green-900/30 border-emerald-500/30 text-emerald-100",
    },
  },
  premium: {
    neon: {
      name: "Neón",
      gradient: "from-pink-900 via-purple-900 to-cyan-900",
      cardBg: "bg-black/30 backdrop-blur-xl",
      border: "border-pink-500/30",
      textPrimary: "text-pink-100",
      textSecondary: "text-pink-200",
      textMuted: "text-pink-300",
      textAccent: "text-pink-300",
      placeholder: "placeholder:text-pink-400",
      buttonPrimary: "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
      buttonSecondary: "bg-pink-900/30 text-pink-100 border-pink-500/30",
      inputBg: "bg-black/30 border-pink-500/30 text-pink-100",
    },
    galaxy: {
      name: "Galaxia",
      gradient: "from-indigo-900 via-purple-900 to-pink-900",
      cardBg: "bg-black/40 backdrop-blur-xl",
      border: "border-indigo-500/30",
      textPrimary: "text-indigo-100",
      textSecondary: "text-indigo-200",
      textMuted: "text-indigo-300",
      textAccent: "text-indigo-300",
      placeholder: "placeholder:text-indigo-400",
      buttonPrimary: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white",
      buttonSecondary: "bg-indigo-900/30 text-indigo-100 border-indigo-500/30",
      inputBg: "bg-black/40 border-indigo-500/30 text-indigo-100",
    },
    sunset: {
      name: "Atardecer",
      gradient: "from-orange-900 via-red-900 to-pink-900",
      cardBg: "bg-orange-900/20 backdrop-blur-xl",
      border: "border-orange-500/30",
      textPrimary: "text-orange-100",
      textSecondary: "text-orange-200",
      textMuted: "text-orange-300",
      textAccent: "text-orange-300",
      placeholder: "placeholder:text-orange-400",
      buttonPrimary: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
      buttonSecondary: "bg-orange-900/30 text-orange-100 border-orange-500/30",
      inputBg: "bg-orange-900/20 border-orange-500/30 text-orange-100",
    },
    aurora: {
      name: "Aurora",
      gradient: "from-green-900 via-blue-900 to-purple-900",
      cardBg: "bg-green-900/20 backdrop-blur-xl",
      border: "border-green-400/30",
      textPrimary: "text-green-100",
      textSecondary: "text-green-200",
      textMuted: "text-green-300",
      textAccent: "text-green-300",
      placeholder: "placeholder:text-green-400",
      buttonPrimary: "bg-gradient-to-r from-green-400 to-blue-500 text-white",
      buttonSecondary: "bg-green-900/30 text-green-100 border-green-400/30",
      inputBg: "bg-green-900/20 border-green-400/30 text-green-100",
    },
    cyberpunk: {
      name: "Cyberpunk",
      gradient: "from-yellow-900 via-pink-900 to-cyan-900",
      cardBg: "bg-black/50 backdrop-blur-xl",
      border: "border-yellow-500/30",
      textPrimary: "text-yellow-100",
      textSecondary: "text-yellow-200",
      textMuted: "text-yellow-300",
      textAccent: "text-yellow-300",
      placeholder: "placeholder:text-yellow-400",
      buttonPrimary: "bg-gradient-to-r from-yellow-500 to-pink-500 text-black",
      buttonSecondary: "bg-yellow-900/30 text-yellow-100 border-yellow-500/30",
      inputBg: "bg-black/50 border-yellow-500/30 text-yellow-100",
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

const LANGUAGE_OPTIONS = [
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "it", label: "Italiano", flag: "🇮🇹" },
]

export default function FutureTaskApp() {
  // Core state
  const [user, setUser] = useState<User | null>(null)
  const [language, setLanguage] = useState<"es" | "en" | "fr" | "de" | "it">("es")
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "auth" | "premium" | "app">("welcome")
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
  const [showSettingsModal, setShowSettingsModal] = useState(false)
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
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [newWishItem, setNewWishItem] = useState("")
  const [newWishDescription, setNewWishDescription] = useState("")
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editNoteTitle, setEditNoteTitle] = useState("")
  const [editNoteContent, setEditNoteContent] = useState("")
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Migration state
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false)

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

  // Load saved language on init
  useEffect(() => {
    const savedLanguage = localStorage.getItem("futureTask_language")
    if (savedLanguage && ["es", "en", "fr", "de", "it"].includes(savedLanguage)) {
      setLanguage(savedLanguage as "es" | "en" | "fr" | "de" | "it")
    }
  }, [])

  // Save language when it changes
  useEffect(() => {
    localStorage.setItem("futureTask_language", language)
  }, [language])

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

  // Request notification permission function
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

        // Cargar datos del usuario desde Supabase/localStorage
        const [userTasks, userWishlist, userNotes] = await Promise.all([
          getUserTasks(userExists.id),
          getUserWishlist(userExists.id),
          getUserNotes(userExists.id),
        ])

        setTasks(userTasks)
        setWishlistItems(userWishlist)
        setNotes(userNotes)

        // Check if we should show migration prompt
        if (isSupabaseAvailable) {
          const hasLocalData =
            localStorage.getItem(`futureTask_tasks_${userExists.id}`) ||
            localStorage.getItem(`futureTask_wishlist_${userExists.id}`) ||
            localStorage.getItem(`futureTask_notes_${userExists.id}`)

          if (hasLocalData && userTasks.length === 0 && userWishlist.length === 0 && userNotes.length === 0) {
            setShowMigrationPrompt(true)
          }
        }

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

  // Check for task notifications
  useEffect(() => {
    if (!user || !("Notification" in window)) return

    const checkNotifications = () => {
      if (notificationPermission !== "granted") return

      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

      tasks.forEach((task) => {
        if (!task.completed && task.date === today && task.time === currentTime && task.notification_enabled) {
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

            setTimeout(() => {
              notification.close()
            }, 10000)
          } catch (error) {
            console.error("Error showing task notification:", error)
          }
        }
      })
    }

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

      if (pomodoroType === "work") {
        setPomodoroType("shortBreak")
        setPomodoroTime(5 * 60)
      } else {
        setPomodoroType("work")
        setPomodoroTime(25 * 60)
      }
    }
    return () => clearInterval(interval)
  }, [pomodoroActive, pomodoroTime, pomodoroType])

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

  const getFilteredTasks = () => {
    let filtered = getTodayTasks()

    if (taskFilter === "completed") {
      filtered = filtered.filter((task) => task.completed)
    } else if (taskFilter === "pending") {
      filtered = filtered.filter((task) => !task.completed)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((task) => task.category === categoryFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

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
  const addWishItem = async () => {
    if (!newWishItem.trim() || !user) return

    try {
      const itemData = {
        user_id: user.id,
        text: newWishItem,
        description: newWishDescription || undefined,
        completed: false,
      }

      const newItem = await createWishlistItem(itemData)
      setWishlistItems((prev) => [...prev, newItem])
      setNewWishItem("")
      setNewWishDescription("")
    } catch (error) {
      console.error("Error adding wishlist item:", error)
      alert("Error al agregar elemento a la lista de deseos")
    }
  }

  const toggleWishItem = async (itemId: string) => {
    try {
      const item = wishlistItems.find((i) => i.id === itemId)
      if (!item) return

      const updatedItem = await updateWishlistItem(itemId, {
        completed: !item.completed,
      })

      setWishlistItems((prev) => prev.map((i) => (i.id === itemId ? updatedItem : i)))
    } catch (error) {
      console.error("Error toggling wishlist item:", error)
      alert("Error al actualizar elemento de la lista de deseos")
    }
  }

  const deleteWishItem = async (itemId: string) => {
    try {
      await deleteWishlistItem(itemId)
      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error("Error deleting wishlist item:", error)
      alert("Error al eliminar elemento de la lista de deseos")
    }
  }

  // Notes functions
  const addNote = async () => {
    if (!newNoteTitle.trim() || !user) return

    try {
      const noteData = {
        user_id: user.id,
        title: newNoteTitle,
        content: newNoteContent,
      }

      const newNoteFromDB = await createNote(noteData)
      setNotes((prev) => [...prev, newNoteFromDB])
      setNewNoteTitle("")
      setNewNoteContent("")
    } catch (error) {
      console.error("Error adding note:", error)
      alert("Error al agregar nota")
    }
  }

  const startEditNote = (note: Note) => {
    setEditingNote(note.id)
    setEditNoteTitle(note.title)
    setEditNoteContent(note.content)
  }

  const saveEditNote = async () => {
    if (!editNoteTitle.trim() || !editingNote) return

    try {
      const updatedNote = await updateNote(editingNote, {
        title: editNoteTitle,
        content: editNoteContent,
      })

      setNotes((prev) => prev.map((note) => (note.id === editingNote ? updatedNote : note)))

      setEditingNote(null)
      setEditNoteTitle("")
      setEditNoteContent("")
    } catch (error) {
      console.error("Error updating note:", error)
      alert("Error al actualizar nota")
    }
  }

  const cancelEditNote = () => {
    setEditingNote(null)
    setEditNoteTitle("")
    setEditNoteContent("")
  }

  const deleteNoteHandler = async (noteId: string) => {
    try {
      await deleteNote(noteId)
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
    } catch (error) {
      console.error("Error deleting note:", error)
      alert("Error al eliminar nota")
    }
  }

  // Event handlers
  const handleAuth = async () => {
    try {
      if (authMode === "login") {
        const existingUser = await getUserByEmail(email, password)
        if (!existingUser) {
          alert("Usuario o contraseña incorrectos.")
          return
        }

        setUser(existingUser)
        localStorage.setItem("futureTask_user", JSON.stringify(existingUser))
        setCurrentScreen(existingUser.onboarding_completed ? "app" : "premium")
      } else {
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

  const logout = () => {
    setUser(null)
    setTasks([])
    setWishlistItems([])
    setNotes([])
    setCurrentScreen("welcome")
    localStorage.removeItem("futureTask_user")
  }

  const getCurrentTheme = () => {
    if (!user) return THEMES.free.default

    const allThemes = { ...THEMES.free, ...THEMES.premium }
    return allThemes[user.theme as keyof typeof allThemes] || THEMES.free.default
  }

  const updateSettings = async () => {
    if (!user) return

    try {
      const updatedUser = await updateUser(user.id, {
        name: profileName,
        email: profileEmail,
        password: profilePassword || user.password,
        language: profileLanguage,
        theme: profileTheme,
      })

      setUser(updatedUser)
      localStorage.setItem("futureTask_user", JSON.stringify(updatedUser))
      setLanguage(profileLanguage)
      setShowSettingsModal(false)
      alert(t("saveChanges"))
    } catch (error) {
      console.error("Error updating settings:", error)
      alert("Error al actualizar la configuración")
    }
  }

  const openSettings = () => {
    setProfileName(user?.name || "")
    setProfileEmail(user?.email || "")
    setProfilePassword("")
    setProfileLanguage(user?.language || "es")
    setProfileTheme(user?.theme || "default")
    setShowSettingsModal(true)
  }

  const handleMigration = async () => {
    if (!user) return

    try {
      setShowMigrationPrompt(false)
      const success = await migrateLocalStorageToSupabase(user.id)

      if (success) {
        // Reload data after migration
        const [userTasks, userWishlist, userNotes] = await Promise.all([
          getUserTasks(user.id),
          getUserWishlist(user.id),
          getUserNotes(user.id),
        ])

        setTasks(userTasks)
        setWishlistItems(userWishlist)
        setNotes(userNotes)

        alert("¡Migración completada exitosamente! Tus datos ahora están sincronizados en la nube.")
      } else {
        alert("Error durante la migración. Intenta de nuevo más tarde.")
      }
    } catch (error) {
      console.error("Migration error:", error)
      alert("Error durante la migración. Intenta de nuevo más tarde.")
    }
  }

  // Loading state
  if (!isInitialized) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().gradient} flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <div className={`${getCurrentTheme().textPrimary} text-lg font-semibold`}>Cargando FutureTask...</div>
          <div className={`${getCurrentTheme().textSecondary} text-sm`}>
            {isSupabaseAvailable ? "Conectando con Supabase..." : "Preparando tu experiencia"}
          </div>
        </div>
      </div>
    )
  }

  // Welcome Screen
  if (currentScreen === "welcome") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().gradient} flex items-center justify-center p-4`}
      >
        <Card className={`w-full max-w-md ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {t("appName")}
            </CardTitle>
            <CardDescription className={getCurrentTheme().textSecondary}>{t("appDescription")}</CardDescription>
            {isSupabaseAvailable && (
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Database className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400">Conectado a Supabase</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Language Selector */}
            <div className="space-y-2">
              <Label className={`${getCurrentTheme().textSecondary} flex items-center space-x-2`}>
                <Globe className="w-4 h-4" />
                <span>{t("selectLanguage")}</span>
              </Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                <SelectTrigger className={getCurrentTheme().inputBg}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className={getCurrentTheme().textPrimary}>
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setCurrentScreen("auth")} className={`w-full ${getCurrentTheme().buttonPrimary}`}>
              {t("getStarted")}
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
        <Card className={`w-full max-w-md ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {authMode === "login" ? t("login") : t("register")}
            </CardTitle>
            {isSupabaseAvailable && (
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Database className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400">Usando Supabase</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Language Selector */}
            <div className="space-y-2">
              <Label className={`${getCurrentTheme().textSecondary} flex items-center space-x-2`}>
                <Globe className="w-4 h-4" />
                <span>{t("language")}</span>
              </Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                <SelectTrigger className={getCurrentTheme().inputBg}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className={getCurrentTheme().textPrimary}>
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {authMode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name" className={getCurrentTheme().textSecondary}>
                  {t("name")}
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={getCurrentTheme().inputBg}
                  placeholder={t("name")}
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
                className={getCurrentTheme().inputBg}
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
                className={getCurrentTheme().inputBg}
                placeholder="••••••••"
              />
            </div>
            <Button onClick={handleAuth} className={`w-full ${getCurrentTheme().buttonPrimary}`}>
              {authMode === "login" ? t("login") : t("register")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              className={`w-full ${getCurrentTheme().textAccent}`}
            >
              {authMode === "login" ? t("noAccountRegister") : t("hasAccountLogin")}
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
        <Card className={`w-full max-w-4xl ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {t("choosePlan")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                <CardHeader>
                  <CardTitle className={`text-lg md:text-xl ${getCurrentTheme().textPrimary}`}>{t("free")}</CardTitle>
                  <div className={`text-2xl md:text-3xl font-bold ${getCurrentTheme().textPrimary}`}>
                    €0
                    <span className={`text-sm md:text-lg font-normal ${getCurrentTheme().textMuted}`}>/mes</span>
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
                  </div>
                  <Button
                    onClick={() => handlePremiumChoice(false)}
                    className={`w-full ${getCurrentTheme().buttonSecondary}`}
                  >
                    {t("continueFreee")}
                  </Button>
                </CardContent>
              </Card>

              <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border} relative`}>
                <CardHeader>
                  <CardTitle
                    className={`text-lg md:text-xl ${getCurrentTheme().textPrimary} flex items-center space-x-2`}
                  >
                    <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                    <span>{t("premium")}</span>
                  </CardTitle>
                  <div className={`text-2xl md:text-3xl font-bold ${getCurrentTheme().textPrimary}`}>
                    {t("monthlyPrice")}
                  </div>
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
                    {isSupabaseAvailable && (
                      <div className="flex items-center space-x-3">
                        <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                        <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>
                          Sincronización en la nube
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => handlePremiumChoice(true)}
                    className={`w-full ${getCurrentTheme().buttonPrimary} text-sm md:text-lg py-2 md:py-3`}
                  >
                    <Crown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {t("startPremium")} - {t("monthlyPrice")}
                  </Button>
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
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="flex flex-col h-screen">
          {/* Mobile Header */}
          <div className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border} border-b p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {t("appName")}
                  </h1>
                  <p className={`text-xs ${getCurrentTheme().textSecondary}`}>Hola, {user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {user.is_premium && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs">Premium</Badge>
                )}
                {isSupabaseAvailable && <Database className="w-4 h-4 text-green-400" />}
                <Button variant="ghost" size="icon" onClick={openSettings}>
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border} m-4 grid grid-cols-4`}>
                <TabsTrigger value="tasks" className="text-xs">
                  <CheckCircle className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="pomodoro" className="text-xs">
                  <Timer className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="text-xs">
                  <Star className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="achievements" className="text-xs">
                  <Trophy className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <TabsContent value="tasks" className="mt-0">
                  <div className="space-y-4">
                    {/* Calendar Widget Mobile */}
                    <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className={`text-lg ${getCurrentTheme().textPrimary} flex items-center space-x-2`}>
                          <CalendarIcon className="w-5 h-5" />
                          <span>{t("calendar")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="scale-90 origin-top">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => date && setSelectedDate(date)}
                            className="rounded-md border-none shadow-none w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Stats Cards Mobile */}
                    <div className="grid grid-cols-2 gap-3">
                      <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
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

                      <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-blue-400" />
                            <div>
                              <p className={`text-xs ${getCurrentTheme().textSecondary}`}>{t("totalToday")}</p>
                              <p className={`text-lg font-bold ${getCurrentTheme().textPrimary}`}>
                                {getTodayTasks().length}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Selected Date Display */}
                    <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      <CardContent className="p-3">
                        <h3 className={`font-semibold ${getCurrentTheme().textPrimary} text-center`}>
                          Tareas para{" "}
                          {selectedDate.toLocaleDateString(language, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </h3>
                      </CardContent>
                    </Card>

                    {/* Task List */}
                    <div className="space-y-3">
                      {getFilteredTasks().length > 0 ? (
                        getFilteredTasks().map((task) => (
                          <Card key={task.id} className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                            <CardContent className="p-3">
                              <div className="flex items-start space-x-3">
                                <Checkbox
                                  id={`task-${task.id}`}
                                  checked={task.completed}
                                  onCheckedChange={() => toggleTask(task.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1 min-w-0">
                                  <Label
                                    htmlFor={`task-${task.id}`}
                                    className={`text-sm font-medium block ${
                                      task.completed
                                        ? `line-through ${getCurrentTheme().textMuted}`
                                        : getCurrentTheme().textPrimary
                                    }`}
                                  >
                                    {task.text}
                                  </Label>
                                  {task.description && (
                                    <p className={`text-xs mt-1 ${getCurrentTheme().textSecondary}`}>
                                      {task.description}
                                    </p>
                                  )}
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge className={CATEGORY_COLORS[task.category]} size="sm">
                                      {t(task.category)}
                                    </Badge>
                                    {task.priority && (
                                      <Badge className={PRIORITY_COLORS[task.priority]} size="sm">
                                        {task.priority}
                                      </Badge>
                                    )}
                                    {task.time && (
                                      <Badge variant="outline" size="sm">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {task.time}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <Button variant="ghost" size="icon" onClick={() => deleteTaskHandler(task.id)}>
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                          <CardContent className="p-6 text-center">
                            <CheckCircle className={`w-12 h-12 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                            <p className={getCurrentTheme().textMuted}>No hay tareas para este día.</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Add Task Form */}
                    <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className={`text-lg ${getCurrentTheme().textPrimary}`}>{t("newTask")}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Input
                          type="text"
                          placeholder={t("newTask")}
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          className={getCurrentTheme().inputBg}
                        />
                        <Textarea
                          placeholder={t("description")}
                          value={newTaskDescription}
                          onChange={(e) => setNewTaskDescription(e.target.value)}
                          className={`${getCurrentTheme().inputBg} min-h-[60px]`}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="time"
                            placeholder={t("time")}
                            value={newTaskTime}
                            onChange={(e) => setNewTaskTime(e.target.value)}
                            className={getCurrentTheme().inputBg}
                          />
                          <Button onClick={addTask} className={getCurrentTheme().buttonPrimary}>
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                            <SelectTrigger className={getCurrentTheme().inputBg}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
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

                          <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                            <SelectTrigger className={getCurrentTheme().inputBg}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
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
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="pomodoro" className="mt-0">
                  <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                    <CardHeader className="text-center">
                      <CardTitle className={getCurrentTheme().textPrimary}>{t("pomodoro")}</CardTitle>
                      <CardDescription className={getCurrentTheme().textSecondary}>
                        {t(pomodoroType === "work" ? "workSession" : "shortBreak")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                      <div className={`text-6xl font-bold ${getCurrentTheme().textPrimary}`}>
                        {formatTime(pomodoroTime)}
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Button
                          onClick={() => setPomodoroActive(!pomodoroActive)}
                          className={getCurrentTheme().buttonPrimary}
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
                          className={getCurrentTheme().buttonSecondary}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          {t("reset")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="wishlist" className="mt-0">
                  <div className="max-w-2xl mx-auto">
                    <h2 className={`text-2xl font-bold mb-6 ${getCurrentTheme().textPrimary}`}>{t("wishlist")}</h2>
                    {!user.is_premium ? (
                      <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                        <CardContent className="p-8 text-center">
                          <Crown className={`w-16 h-16 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                          <h3 className={`text-lg font-semibold mb-2 ${getCurrentTheme().textPrimary}`}>
                            Función Premium
                          </h3>
                          <p className={`mb-4 ${getCurrentTheme().textMuted}`}>
                            Actualiza a Premium para acceder a tu lista de deseos
                          </p>
                          <Button onClick={() => setShowPremiumModal(true)} className={getCurrentTheme().buttonPrimary}>
                            {t("upgradeButton")}
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-6">
                        {/* Add Wishlist Item Form */}
                        <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                          <CardHeader>
                            <CardTitle className={getCurrentTheme().textPrimary}>Agregar Deseo</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Input
                              type="text"
                              placeholder="¿Qué deseas lograr?"
                              value={newWishItem}
                              onChange={(e) => setNewWishItem(e.target.value)}
                              className={getCurrentTheme().inputBg}
                            />
                            <Textarea
                              placeholder="Descripción (opcional)..."
                              value={newWishDescription}
                              onChange={(e) => setNewWishDescription(e.target.value)}
                              className={getCurrentTheme().inputBg}
                            />
                            <Button onClick={addWishItem} className={`w-full ${getCurrentTheme().buttonPrimary}`}>
                              <Plus className="w-4 h-4 mr-2" />
                              Agregar a Lista de Deseos
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Wishlist Items */}
                        <div className="space-y-4">
                          {wishlistItems.length > 0 ? (
                            wishlistItems.map((item) => (
                              <Card key={item.id} className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                                <CardContent className="p-4">
                                  <div className="flex items-start space-x-3">
                                    <Checkbox
                                      id={`wish-${item.id}`}
                                      checked={item.completed}
                                      onCheckedChange={() => toggleWishItem(item.id)}
                                      className="mt-1"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <Label
                                        htmlFor={`wish-${item.id}`}
                                        className={`text-sm font-medium block ${
                                          item.completed
                                            ? `line-through ${getCurrentTheme().textMuted}`
                                            : getCurrentTheme().textPrimary
                                        }`}
                                      >
                                        {item.text}
                                      </Label>
                                      {item.description && (
                                        <p className={`text-xs mt-1 ${getCurrentTheme().textSecondary}`}>
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => deleteWishItem(item.id)}>
                                      <Trash2 className="w-4 h-4 text-red-400" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                              <CardContent className="p-8 text-center">
                                <Star className={`w-16 h-16 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                                <p className={getCurrentTheme().textMuted}>Tu lista de deseos está vacía.</p>
                                <p className={`text-sm mt-2 ${getCurrentTheme().textSecondary}`}>
                                  Agrega tus metas y sueños para el futuro.
                                </p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <div className="max-w-2xl mx-auto">
                    <h2 className={`text-2xl font-bold mb-6 ${getCurrentTheme().textPrimary}`}>{t("notes")}</h2>
                    {!user.is_premium ? (
                      <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                        <CardContent className="p-8 text-center">
                          <StickyNote className={`w-16 h-16 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                          <h3 className={`text-lg font-semibold mb-2 ${getCurrentTheme().textPrimary}`}>
                            Función Premium
                          </h3>
                          <p className={`mb-4 ${getCurrentTheme().textMuted}`}>
                            Actualiza a Premium para acceder a tus notas
                          </p>
                          <Button onClick={() => setShowPremiumModal(true)} className={getCurrentTheme().buttonPrimary}>
                            {t("upgradeButton")}
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-6">
                        {/* Add Note Form */}
                        <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                          <CardHeader>
                            <CardTitle className={getCurrentTheme().textPrimary}>Nueva Nota</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Input
                              type="text"
                              placeholder="Título de la nota..."
                              value={newNoteTitle}
                              onChange={(e) => setNewNoteTitle(e.target.value)}
                              className={getCurrentTheme().inputBg}
                            />
                            <Textarea
                              placeholder="Contenido de la nota..."
                              value={newNoteContent}
                              onChange={(e) => setNewNoteContent(e.target.value)}
                              className={`${getCurrentTheme().inputBg} min-h-[120px]`}
                            />
                            <Button onClick={addNote} className={`w-full ${getCurrentTheme().buttonPrimary}`}>
                              <Plus className="w-4 h-4 mr-2" />
                              Crear Nota
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Notes List */}
                        <div className="space-y-4">
                          {notes.length > 0 ? (
                            notes.map((note) => (
                              <Card key={note.id} className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                                <CardContent className="p-4">
                                  {editingNote === note.id ? (
                                    <div className="space-y-3">
                                      <Input
                                        value={editNoteTitle}
                                        onChange={(e) => setEditNoteTitle(e.target.value)}
                                        className={getCurrentTheme().inputBg}
                                      />
                                      <Textarea
                                        value={editNoteContent}
                                        onChange={(e) => setEditNoteContent(e.target.value)}
                                        className={`${getCurrentTheme().inputBg} min-h-[100px]`}
                                      />
                                      <div className="flex space-x-2">
                                        <Button
                                          onClick={saveEditNote}
                                          size="sm"
                                          className={getCurrentTheme().buttonPrimary}
                                        >
                                          <Check className="w-4 h-4 mr-1" />
                                          Guardar
                                        </Button>
                                        <Button onClick={cancelEditNote} size="sm" variant="outline">
                                          <X className="w-4 h-4 mr-1" />
                                          Cancelar
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <div className="flex items-start justify-between mb-2">
                                        <h3 className={`font-semibold ${getCurrentTheme().textPrimary}`}>
                                          {note.title}
                                        </h3>
                                        <div className="flex space-x-1">
                                          <Button variant="ghost" size="icon" onClick={() => startEditNote(note)}>
                                            <Settings className="w-4 h-4 text-blue-400" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteNoteHandler(note.id)}
                                          >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                          </Button>
                                        </div>
                                      </div>
                                      <p className={`text-sm ${getCurrentTheme().textSecondary} whitespace-pre-wrap`}>
                                        {note.content}
                                      </p>
                                      <p className={`text-xs mt-2 ${getCurrentTheme().textMuted}`}>
                                        {new Date(note.created_at).toLocaleDateString(language)}
                                      </p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                              <CardContent className="p-8 text-center">
                                <StickyNote className={`w-16 h-16 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                                <p className={getCurrentTheme().textMuted}>No tienes notas.</p>
                                <p className={`text-sm mt-2 ${getCurrentTheme().textSecondary}`}>
                                  Crea tu primera nota para guardar ideas importantes.
                                </p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="achievements" className="mt-0">
                  <div className="space-y-4">
                    <h2 className={`text-lg font-bold ${getCurrentTheme().textPrimary}`}>{t("achievements")}</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {achievements.map((achievement) => (
                        <Card
                          key={achievement.id}
                          className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                {achievement.unlocked ? (
                                  <CheckCircle className="w-8 h-8 text-green-500" />
                                ) : (
                                  <Clock className="w-8 h-8 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className={`font-semibold ${getCurrentTheme().textPrimary}`}>{achievement.name}</h3>
                                <p className={`text-sm ${getCurrentTheme().textSecondary}`}>
                                  {achievement.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      ) : (
        /* Desktop Layout */
        <div className="flex h-screen">
          {/* Desktop Sidebar */}
          <div
            className={`w-80 xl:w-96 ${getCurrentTheme().cardBg} ${getCurrentTheme().border} border-r overflow-y-auto`}
          >
            {/* Header */}
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {t("appName")}
                      </h1>
                      {user.is_premium && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs">
                          Premium
                        </Badge>
                      )}
                      {isSupabaseAvailable && (
                        <Database className="w-4 h-4 text-green-400" title="Conectado a Supabase" />
                      )}
                    </div>
                    <p className={`text-sm ${getCurrentTheme().textSecondary}`}>Hola, {user.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={openSettings}>
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-6 space-y-2">
              <Button
                variant={activeTab === "tasks" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "tasks" ? getCurrentTheme().buttonPrimary : getCurrentTheme().textSecondary}`}
                onClick={() => setActiveTab("tasks")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t("tasks")}
              </Button>
              <Button
                variant={activeTab === "pomodoro" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "pomodoro" ? getCurrentTheme().buttonPrimary : getCurrentTheme().textSecondary}`}
                onClick={() => setActiveTab("pomodoro")}
              >
                <Timer className="w-4 h-4 mr-2" />
                {t("pomodoro")}
              </Button>
              <Button
                variant={activeTab === "wishlist" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "wishlist" ? getCurrentTheme().buttonPrimary : getCurrentTheme().textSecondary}`}
                onClick={() => {
                  if (!user.is_premium) {
                    setShowPremiumModal(true)
                    return
                  }
                  setActiveTab("wishlist")
                }}
              >
                <Star className="w-4 h-4 mr-2" />
                {t("wishlist")}
                {!user.is_premium && <Crown className="w-3 h-3 ml-auto text-yellow-400" />}
              </Button>
              <Button
                variant={activeTab === "notes" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "notes" ? getCurrentTheme().buttonPrimary : getCurrentTheme().textSecondary}`}
                onClick={() => {
                  if (!user.is_premium) {
                    setShowPremiumModal(true)
                    return
                  }
                  setActiveTab("notes")
                }}
              >
                <StickyNote className="w-4 h-4 mr-2" />
                {t("notes")}
                {!user.is_premium && <Crown className="w-3 h-3 ml-auto text-yellow-400" />}
              </Button>
              <Button
                variant={activeTab === "achievements" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "achievements" ? getCurrentTheme().buttonPrimary : getCurrentTheme().textSecondary}`}
                onClick={() => setActiveTab("achievements")}
              >
                <Trophy className="w-4 h-4 mr-2" />
                {t("achievements")}
              </Button>
              <Button
                onClick={logout}
                variant="ghost"
                className={`w-full justify-start ${getCurrentTheme().textSecondary} hover:text-red-400`}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t("logout")}
              </Button>
            </nav>
          </div>

          {/* Desktop Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "tasks" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Calendar Section */}
                  <div className="xl:col-span-1">
                    <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      <CardHeader>
                        <CardTitle className={`${getCurrentTheme().textPrimary} flex items-center space-x-2`}>
                          <CalendarIcon className="w-5 h-5" />
                          <span>{t("calendar")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          className="rounded-md border-none shadow-none w-full"
                        />
                      </CardContent>
                    </Card>

                    {/* Stats Cards Desktop */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <div>
                              <p className={`text-sm ${getCurrentTheme().textSecondary}`}>{t("completedToday")}</p>
                              <p className={`text-xl font-bold ${getCurrentTheme().textPrimary}`}>
                                {getCompletedTasks().length}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Target className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className={`text-sm ${getCurrentTheme().textSecondary}`}>{t("totalToday")}</p>
                              <p className={`text-xl font-bold ${getCurrentTheme().textPrimary}`}>
                                {getTodayTasks().length}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Flame className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className={`text-sm ${getCurrentTheme().textSecondary}`}>{t("streak")}</p>
                              <p className={`text-xl font-bold ${getCurrentTheme().textPrimary}`}>3 días</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-purple-400" />
                            <div>
                              <p className={`text-sm ${getCurrentTheme().textSecondary}`}>{t("progressToday")}</p>
                              <p className={`text-xl font-bold ${getCurrentTheme().textPrimary}`}>
                                {Math.round(getTodayProgress())}%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Tasks Section */}
                  <div className="xl:col-span-2 space-y-6">
                    {/* Date and Filters */}
                    <div className="flex items-center justify-between">
                      <h2 className={`text-2xl font-bold ${getCurrentTheme().textPrimary}`}>
                        Tareas - {selectedDate.toLocaleDateString(language)}
                      </h2>
                      <div className="flex space-x-2">
                        <Select value={taskFilter} onValueChange={setTaskFilter}>
                          <SelectTrigger className={`w-32 ${getCurrentTheme().inputBg}`}>
                            <SelectValue placeholder="Filtrar" />
                          </SelectTrigger>
                          <SelectContent className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                            <SelectItem value="all" className={getCurrentTheme().textPrimary}>
                              {t("all")}
                            </SelectItem>
                            <SelectItem value="completed" className={getCurrentTheme().textPrimary}>
                              {t("completedToday")}
                            </SelectItem>
                            <SelectItem value="pending" className={getCurrentTheme().textPrimary}>
                              {t("pending")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Task List */}
                      <div className="space-y-4">
                        <h3 className={`text-lg font-semibold ${getCurrentTheme().textPrimary}`}>Lista de Tareas</h3>
                        {getFilteredTasks().length > 0 ? (
                          getFilteredTasks().map((task) => (
                            <Card key={task.id} className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <Checkbox
                                    id={`task-${task.id}`}
                                    checked={task.completed}
                                    onCheckedChange={() => toggleTask(task.id)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <Label
                                      htmlFor={`task-${task.id}`}
                                      className={`text-sm font-medium block ${
                                        task.completed
                                          ? `line-through ${getCurrentTheme().textMuted}`
                                          : getCurrentTheme().textPrimary
                                      }`}
                                    >
                                      {task.text}
                                    </Label>
                                    {task.description && (
                                      <p className={`text-xs mt-1 ${getCurrentTheme().textSecondary}`}>
                                        {task.description}
                                      </p>
                                    )}
                                    <div className="flex items-center space-x-2 mt-2">
                                      <Badge className={CATEGORY_COLORS[task.category]} size="sm">
                                        {t(task.category)}
                                      </Badge>
                                      {task.priority && (
                                        <Badge className={PRIORITY_COLORS[task.priority]} size="sm">
                                          {task.priority}
                                        </Badge>
                                      )}
                                      {task.time && (
                                        <Badge variant="outline" size="sm">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {task.time}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="icon" onClick={() => deleteTaskHandler(task.id)}>
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                            <CardContent className="p-8 text-center">
                              <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                              <p className={getCurrentTheme().textMuted}>No hay tareas para este día.</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {/* Add Task Form */}
                      <div>
                        <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                          <CardHeader>
                            <CardTitle className={getCurrentTheme().textPrimary}>{t("newTask")}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Input
                              type="text"
                              placeholder={t("newTask")}
                              value={newTask}
                              onChange={(e) => setNewTask(e.target.value)}
                              className={getCurrentTheme().inputBg}
                            />
                            <Textarea
                              placeholder={t("description")}
                              value={newTaskDescription}
                              onChange={(e) => setNewTaskDescription(e.target.value)}
                              className={getCurrentTheme().inputBg}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                type="time"
                                placeholder={t("time")}
                                value={newTaskTime}
                                onChange={(e) => setNewTaskTime(e.target.value)}
                                className={getCurrentTheme().inputBg}
                              />
                              <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                                <SelectTrigger className={getCurrentTheme().inputBg}>
                                  <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
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
                            </div>
                            <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                              <SelectTrigger className={getCurrentTheme().inputBg}>
                                <SelectValue placeholder="Prioridad" />
                              </SelectTrigger>
                              <SelectContent className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
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
                            <Button onClick={addTask} className={`w-full ${getCurrentTheme().buttonPrimary}`}>
                              <Plus className="w-4 h-4 mr-2" />
                              {t("addTask")}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pomodoro" && (
              <Card className={`max-w-md mx-auto ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                <CardHeader className="text-center">
                  <CardTitle className={getCurrentTheme().textPrimary}>{t("pomodoro")}</CardTitle>
                  <CardDescription className={getCurrentTheme().textSecondary}>
                    {t(pomodoroType === "work" ? "workSession" : "shortBreak")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                  <div className={`text-6xl font-bold ${getCurrentTheme().textPrimary}`}>
                    {formatTime(pomodoroTime)}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => setPomodoroActive(!pomodoroActive)}
                      className={getCurrentTheme().buttonPrimary}
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
                      className={getCurrentTheme().buttonSecondary}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {t("reset")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "wishlist" && (
              <div className="max-w-2xl mx-auto">
                <h2 className={`text-2xl font-bold mb-6 ${getCurrentTheme().textPrimary}`}>{t("wishlist")}</h2>
                {!user.is_premium ? (
                  <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                    <CardContent className="p-8 text-center">
                      <Crown className={`w-16 h-16 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                      <h3 className={`text-lg font-semibold mb-2 ${getCurrentTheme().textPrimary}`}>Función Premium</h3>
                      <p className={`mb-4 ${getCurrentTheme().textMuted}`}>
                        Actualiza a Premium para acceder a tu lista de deseos
                      </p>
                      <Button onClick={() => setShowPremiumModal(true)} className={getCurrentTheme().buttonPrimary}>
                        {t("upgradeButton")}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Add Wishlist Item Form */}
                    <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      <CardHeader>
                        <CardTitle className={getCurrentTheme().textPrimary}>Agregar Deseo</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Input
                          type="text"
                          placeholder="¿Qué deseas lograr?"
                          value={newWishItem}
                          onChange={(e) => setNewWishItem(e.target.value)}
                          className={getCurrentTheme().inputBg}
                        />
                        <Textarea
                          placeholder="Descripción (opcional)..."
                          value={newWishDescription}
                          onChange={(e) => setNewWishDescription(e.target.value)}
                          className={getCurrentTheme().inputBg}
                        />
                        <Button onClick={addWishItem} className={`w-full ${getCurrentTheme().buttonPrimary}`}>
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar a Lista de Deseos
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Wishlist Items */}
                    <div className="space-y-4">
                      {wishlistItems.length > 0 ? (
                        wishlistItems.map((item) => (
                          <Card key={item.id} className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <Checkbox
                                  id={`wish-${item.id}`}
                                  checked={item.completed}
                                  onCheckedChange={() => toggleWishItem(item.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1 min-w-0">
                                  <Label
                                    htmlFor={`wish-${item.id}`}
                                    className={`text-sm font-medium block ${
                                      item.completed
                                        ? `line-through ${getCurrentTheme().textMuted}`
                                        : getCurrentTheme().textPrimary
                                    }`}
                                  >
                                    {item.text}
                                  </Label>
                                  {item.description && (
                                    <p className={`text-xs mt-1 ${getCurrentTheme().textSecondary}`}>
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => deleteWishItem(item.id)}>
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                          <CardContent className="p-8 text-center">
                            <Star className={`w-16 h-16 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                            <p className={getCurrentTheme().textMuted}>Tu lista de deseos está vacía.</p>
                            <p className={`text-sm mt-2 ${getCurrentTheme().textSecondary}`}>
                              Agrega tus metas y sueños para el futuro.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "notes" && (
              <div className="max-w-2xl mx-auto">
                <h2 className={`text-2xl font-bold mb-6 ${getCurrentTheme().textPrimary}`}>{t("notes")}</h2>
                {!user.is_premium ? (
                  <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                    <CardContent className="p-8 text-center">
                      <StickyNote className={`w-16 h-16 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                      <h3 className={`text-lg font-semibold mb-2 ${getCurrentTheme().textPrimary}`}>Función Premium</h3>
                      <p className={`mb-4 ${getCurrentTheme().textMuted}`}>
                        Actualiza a Premium para acceder a tus notas
                      </p>
                      <Button onClick={() => setShowPremiumModal(true)} className={getCurrentTheme().buttonPrimary}>
                        {t("upgradeButton")}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Add Note Form */}
                    <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      <CardHeader>
                        <CardTitle className={getCurrentTheme().textPrimary}>Nueva Nota</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Input
                          type="text"
                          placeholder="Título de la nota..."
                          value={newNoteTitle}
                          onChange={(e) => setNewNoteTitle(e.target.value)}
                          className={getCurrentTheme().inputBg}
                        />
                        <Textarea
                          placeholder="Contenido de la nota..."
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          className={`${getCurrentTheme().inputBg} min-h-[120px]`}
                        />
                        <Button onClick={addNote} className={`w-full ${getCurrentTheme().buttonPrimary}`}>
                          <Plus className="w-4 h-4 mr-2" />
                          Crear Nota
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Notes List */}
                    <div className="space-y-4">
                      {notes.length > 0 ? (
                        notes.map((note) => (
                          <Card key={note.id} className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                            <CardContent className="p-4">
                              {editingNote === note.id ? (
                                <div className="space-y-3">
                                  <Input
                                    value={editNoteTitle}
                                    onChange={(e) => setEditNoteTitle(e.target.value)}
                                    className={getCurrentTheme().inputBg}
                                  />
                                  <Textarea
                                    value={editNoteContent}
                                    onChange={(e) => setEditNoteContent(e.target.value)}
                                    className={`${getCurrentTheme().inputBg} min-h-[100px]`}
                                  />
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={saveEditNote}
                                      size="sm"
                                      className={getCurrentTheme().buttonPrimary}
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Guardar
                                    </Button>
                                    <Button onClick={cancelEditNote} size="sm" variant="outline">
                                      <X className="w-4 h-4 mr-1" />
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-start justify-between mb-2">
                                    <h3 className={`font-semibold ${getCurrentTheme().textPrimary}`}>{note.title}</h3>
                                    <div className="flex space-x-1">
                                      <Button variant="ghost" size="icon" onClick={() => startEditNote(note)}>
                                        <Settings className="w-4 h-4 text-blue-400" />
                                      </Button>
                                      <Button variant="ghost" size="icon" onClick={() => deleteNoteHandler(note.id)}>
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className={`text-sm ${getCurrentTheme().textSecondary} whitespace-pre-wrap`}>
                                    {note.content}
                                  </p>
                                  <p className={`text-xs mt-2 ${getCurrentTheme().textMuted}`}>
                                    {new Date(note.created_at).toLocaleDateString(language)}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                          <CardContent className="p-8 text-center">
                            <StickyNote className={`w-16 h-16 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                            <p className={getCurrentTheme().textMuted}>No tienes notas.</p>
                            <p className={`text-sm mt-2 ${getCurrentTheme().textSecondary}`}>
                              Crea tu primera nota para guardar ideas importantes.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="max-w-4xl mx-auto">
                <h2 className={`text-2xl font-bold mb-6 ${getCurrentTheme().textPrimary}`}>{t("achievements")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {achievement.unlocked ? (
                              <CheckCircle className="w-8 h-8 text-green-500" />
                            ) : (
                              <Clock className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold ${getCurrentTheme().textPrimary}`}>{achievement.name}</h3>
                            <p className={`text-sm ${getCurrentTheme().textSecondary}`}>{achievement.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notification Permission Prompt */}
      {showNotificationPrompt && (
        <div className="fixed top-4 right-4 z-50">
          <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border} w-80`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${getCurrentTheme().textPrimary}`}>{t("notificationPermission")}</h4>
                  <p className={`text-sm mt-1 ${getCurrentTheme().textSecondary}`}>{t("notificationPermissionDesc")}</p>
                  <div className="flex space-x-2 mt-3">
                    <Button
                      onClick={requestNotificationPermission}
                      size="sm"
                      className={getCurrentTheme().buttonPrimary}
                    >
                      {t("enableNotifications")}
                    </Button>
                    <Button
                      onClick={() => setShowNotificationPrompt(false)}
                      size="sm"
                      variant="outline"
                      className={getCurrentTheme().buttonSecondary}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Migration Prompt */}
      {showMigrationPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className={`w-full max-w-md ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
            <CardHeader>
              <CardTitle className={`${getCurrentTheme().textPrimary} flex items-center space-x-2`}>
                <Database className="w-5 h-5 text-green-400" />
                <span>{t("migrateData")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className={getCurrentTheme().textSecondary}>
                Hemos detectado que tienes datos locales. ¿Te gustaría migrarlos a Supabase para sincronización en la
                nube?
              </p>
              <div className="flex space-x-2">
                <Button onClick={handleMigration} className={`flex-1 ${getCurrentTheme().buttonPrimary}`}>
                  <Database className="w-4 h-4 mr-2" />
                  Migrar Datos
                </Button>
                <Button
                  onClick={() => setShowMigrationPrompt(false)}
                  variant="outline"
                  className={`flex-1 ${getCurrentTheme().buttonSecondary}`}
                >
                  Más Tarde
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className={`sm:max-w-[425px] ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
          <DialogHeader>
            <DialogTitle className={getCurrentTheme().textPrimary}>{t("profile")}</DialogTitle>
            <DialogDescription className={getCurrentTheme().textSecondary}>
              Administra tu cuenta y preferencias.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <h3 className={`text-lg font-semibold ${getCurrentTheme().textPrimary}`}>{user.name}</h3>
              <p className={getCurrentTheme().textSecondary}>{user.email}</p>
              {user.is_premium && (
                <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white mt-2">Premium</Badge>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={getCurrentTheme().textSecondary}>{t("theme")}:</span>
                <span className={`${getCurrentTheme().textPrimary} capitalize`}>{getCurrentTheme().name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={getCurrentTheme().textSecondary}>{t("language")}:</span>
                <span className={getCurrentTheme().textPrimary}>
                  {LANGUAGE_OPTIONS.find((lang) => lang.value === language)?.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={getCurrentTheme().textSecondary}>{t("registration")}:</span>
                <span className={getCurrentTheme().textPrimary}>
                  {new Date(user.created_at).toLocaleDateString(language)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={getCurrentTheme().textSecondary}>{t("databaseStatus")}:</span>
                <div className="flex items-center space-x-2">
                  {isSupabaseAvailable ? (
                    <>
                      <Database className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">Supabase</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">Local</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowProfileModal(false)}
              className={getCurrentTheme().buttonSecondary}
            >
              {t("cancel")}
            </Button>
            <Button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white">
              <LogOut className="w-4 h-4 mr-2" />
              {t("logout")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Premium Modal */}
      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent className={`sm:max-w-[425px] ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
          <DialogHeader>
            <DialogTitle className={getCurrentTheme().textPrimary}>
              <Crown className="w-5 h-5 inline mr-2 text-yellow-400" />
              {t("premium")}
            </DialogTitle>
            <DialogDescription className={getCurrentTheme().textSecondary}>
              ¡Desbloquea funciones exclusivas!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className={getCurrentTheme().textPrimary}>Tareas ilimitadas</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className={getCurrentTheme().textPrimary}>Lista de deseos</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className={getCurrentTheme().textPrimary}>Notas ilimitadas</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className={getCurrentTheme().textPrimary}>Todos los temas premium</span>
              </div>
              {isSupabaseAvailable && (
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className={getCurrentTheme().textPrimary}>Sincronización en la nube</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowPremiumModal(false)}
              className={getCurrentTheme().buttonSecondary}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              onClick={() => {
                setShowPremiumModal(false)
                setCurrentScreen("premium")
              }}
              className={getCurrentTheme().buttonPrimary}
            >
              <Crown className="w-4 h-4 mr-2" />
              {t("upgradeButton")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className={`sm:max-w-[500px] ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
          <DialogHeader>
            <DialogTitle className={getCurrentTheme().textPrimary}>
              <Settings className="w-5 h-5 inline mr-2" />
              {t("configuration")}
            </DialogTitle>
            <DialogDescription className={getCurrentTheme().textSecondary}>{t("personalizeAccount")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-name" className={getCurrentTheme().textSecondary}>
                  {t("name")}
                </Label>
                <Input
                  id="settings-name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className={getCurrentTheme().inputBg}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-email" className={getCurrentTheme().textSecondary}>
                  {t("email")}
                </Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className={getCurrentTheme().inputBg}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-password" className={getCurrentTheme().textSecondary}>
                  {t("newPassword")}
                </Label>
                <Input
                  id="settings-password"
                  type="password"
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  className={getCurrentTheme().inputBg}
                  placeholder={t("leaveEmptyKeepCurrent")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-language" className={getCurrentTheme().textSecondary}>
                  {t("language")}
                </Label>
                <Select value={profileLanguage} onValueChange={setProfileLanguage}>
                  <SelectTrigger className={getCurrentTheme().inputBg}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className={getCurrentTheme().textPrimary}>
                        <span className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-theme" className={getCurrentTheme().textSecondary}>
                  {t("theme")}
                </Label>
                <Select value={profileTheme} onValueChange={setProfileTheme}>
                  <SelectTrigger className={getCurrentTheme().inputBg}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                    <SelectItem value="default" className={getCurrentTheme().textPrimary}>
                      Futurista
                    </SelectItem>
                    <SelectItem value="light" className={getCurrentTheme().textPrimary}>
                      Claro
                    </SelectItem>
                    <SelectItem value="dark" className={getCurrentTheme().textPrimary}>
                      Oscuro
                    </SelectItem>
                    <SelectItem value="ocean" className={getCurrentTheme().textPrimary}>
                      Océano
                    </SelectItem>
                    <SelectItem value="forest" className={getCurrentTheme().textPrimary}>
                      Bosque
                    </SelectItem>
                    {user?.is_premium && (
                      <>
                        <SelectItem value="neon" className={getCurrentTheme().textPrimary}>
                          Neón (Premium)
                        </SelectItem>
                        <SelectItem value="galaxy" className={getCurrentTheme().textPrimary}>
                          Galaxia (Premium)
                        </SelectItem>
                        <SelectItem value="sunset" className={getCurrentTheme().textPrimary}>
                          Atardecer (Premium)
                        </SelectItem>
                        <SelectItem value="aurora" className={getCurrentTheme().textPrimary}>
                          Aurora (Premium)
                        </SelectItem>
                        <SelectItem value="cyberpunk" className={getCurrentTheme().textPrimary}>
                          Cyberpunk (Premium)
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowSettingsModal(false)}
              className={getCurrentTheme().buttonSecondary}
            >
              {t("cancel")}
            </Button>
            <Button onClick={updateSettings} className={getCurrentTheme().buttonPrimary}>
              <Settings className="w-4 h-4 mr-2" />
              {t("saveChanges")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
