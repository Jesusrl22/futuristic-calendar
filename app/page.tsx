"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Star, Target, Flame, Crown, Check, X, Globe, Database } from "lucide-react"

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
    longBreak: "Descanso Largo",
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
    longBreak: "Long Break",
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
    longBreak: "Pause longue",
    premium: "Gratuit",
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
    longBreak: "Lange Pause",
    premium: "Kostenlos",
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
    longBreak: "Pausa lunga",
    premium: "Gratuito",
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
  const [activeTab, setActiveTab] = useState("calendar")
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
  const [pomodoroType, setPomodoroType] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [pomodoroSessions, setPomodoroSessions] = useState(0)

  // Premium Pomodoro Configuration
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4)
  const [showPomodoroSettings, setShowPomodoroSettings] = useState(false)

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
        setPomodoroSessions((prev) => prev + 1)

        // Check if it's time for a long break
        if ((pomodoroSessions + 1) % sessionsUntilLongBreak === 0) {
          setPomodoroType("longBreak")
          setPomodoroTime(longBreakDuration * 60)
        } else {
          setPomodoroType("shortBreak")
          setPomodoroTime(shortBreakDuration * 60)
        }
      } else {
        setPomodoroType("work")
        setPomodoroTime(workDuration * 60)
      }

      // Show notification if permission granted
      if (notificationPermission === "granted") {
        try {
          new Notification(`🍅 ${pomodoroType === "work" ? "¡Descanso!" : "¡A trabajar!"}`, {
            body:
              pomodoroType === "work"
                ? `Sesión completada. Tiempo de ${(pomodoroSessions + 1) % sessionsUntilLongBreak === 0 ? "descanso largo" : "descanso corto"}.`
                : "Descanso terminado. ¡Hora de trabajar!",
            icon: "/favicon-32x32.png",
          })
        } catch (error) {
          console.error("Error showing pomodoro notification:", error)
        }
      }
    }
    return () => clearInterval(interval)
  }, [
    pomodoroActive,
    pomodoroTime,
    pomodoroType,
    pomodoroSessions,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsUntilLongBreak,
    notificationPermission,
  ])

  const resetPomodoro = () => {
    setPomodoroActive(false)
    setPomodoroType("work")
    setPomodoroTime(workDuration * 60)
  }

  const resetPomodoroSession = () => {
    setPomodoroSessions(0)
    resetPomodoro()
  }

  const getCurrentPomodoroLabel = () => {
    switch (pomodoroType) {
      case "work":
        return t("workSession")
      case "shortBreak":
        return t("shortBreak")
      case "longBreak":
        return "Descanso Largo"
      default:
        return t("workSession")
    }
  }

  const getTotalDuration = () => {
    switch (pomodoroType) {
      case "work":
        return workDuration * 60
      case "shortBreak":
        return shortBreakDuration * 60
      case "longBreak":
        return longBreakDuration * 60
      default:
        return workDuration * 60
    }
  }

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

      // Fallback: update user locally if database update fails
      const updatedUserLocal = {
        ...user,
        is_premium: isPremium,
        onboarding_completed: true,
      }

      setUser(updatedUserLocal)
      localStorage.setItem("futureTask_user", JSON.stringify(updatedUserLocal))
      setCurrentScreen("app")
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

      // Fallback: update user locally if database update fails
      const updatedUserLocal = {
        ...user,
        name: profileName,
        email: profileEmail,
        password: profilePassword || user.password,
        language: profileLanguage,
        theme: profileTheme,
      }

      setUser(updatedUserLocal)
      localStorage.setItem("futureTask_user", JSON.stringify(updatedUserLocal))
      setLanguage(profileLanguage)
      setShowSettingsModal(false)
      alert(t("saveChanges"))
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
                    onClick={() => {
                      setShowPremiumModal(false)
                      handlePremiumChoice(true)
                    }}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm md:text-lg py-2 md:py-3"
                  >
                    <Crown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {t("startPremium")} - {t("monthlyPrice")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Migration Modal */}
        {showMigrationPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className={`w-full max-w-md ${getCurrentTheme().cardBg} ${getCurrentTheme().border} m-4`}>
              <CardHeader>
                <CardTitle className={getCurrentTheme().textPrimary}>{t("migrateData")}</CardTitle>
                <CardDescription className={getCurrentTheme().textSecondary}>{t("migrateDataDesc")}</CardDescription>
              </CardHeader>
              <div className="flex justify-end space-x-2 p-6">
                <Button type="button" variant="secondary" onClick={() => setShowMigrationPrompt(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit" onClick={handleMigration}>
                  {t("migrateData")}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    )
  }

  // Main App Screen
  if (currentScreen === "app") {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().gradient}`}>
        {/* Notification Permission Prompt */}
        {showNotificationPrompt && (
          <div className="fixed top-4 right-4 z-50">
            <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border} max-w-sm`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🔔</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${getCurrentTheme().textPrimary}`}>{t("notificationPermission")}</h4>
                    <p className={`text-sm ${getCurrentTheme().textSecondary} mt-1`}>
                      {t("notificationPermissionDesc")}
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        onClick={requestNotificationPermission}
                        className={getCurrentTheme().buttonPrimary}
                      >
                        {t("enableNotifications")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowNotificationPrompt(false)}
                        className={getCurrentTheme().textSecondary}
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

        {/* Mobile Layout */}
        {isMobile ? (
          <div className="min-h-screen">
            {/* Mobile Header */}
            <div className="sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {t("appName")}
                  </h1>
                  <p className={`${getCurrentTheme().textSecondary} text-sm`}>
                    {user?.name} {user?.is_premium && <Crown className="inline w-3 h-3 text-yellow-400 ml-1" />}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {!user?.is_premium && (
                    <Button
                      size="sm"
                      onClick={() => setShowPremiumModal(true)}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={openSettings} className={getCurrentTheme().textSecondary}>
                    ⚙️
                  </Button>
                  <Button variant="ghost" size="sm" onClick={logout} className={getCurrentTheme().textSecondary}>
                    🚪
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className="sticky top-16 z-30 bg-black/20 backdrop-blur-xl border-b border-purple-500/20">
              <div className="flex overflow-x-auto">
                {["tasks", "calendar", "pomodoro", user?.is_premium && "wishlist", user?.is_premium && "notes"]
                  .filter(Boolean)
                  .map((tab) => (
                    <Button
                      key={tab}
                      variant="ghost"
                      onClick={() => setActiveTab(tab)}
                      className={`flex-shrink-0 px-4 py-3 text-sm ${
                        activeTab === tab
                          ? `${getCurrentTheme().textPrimary} border-b-2 border-purple-400`
                          : getCurrentTheme().textSecondary
                      }`}
                    >
                      {tab === "tasks" && "📋"}
                      {tab === "calendar" && "📅"}
                      {tab === "pomodoro" && "🍅"}
                      {tab === "wishlist" && "⭐"}
                      {tab === "notes" && "📝"}
                      <span className="ml-1">{t(tab)}</span>
                    </Button>
                  ))}
              </div>
            </div>

            {/* Mobile Content */}
            <div className="p-4 pb-20">
              {/* Tasks Tab */}
              {activeTab === "tasks" && (
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
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
                    <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <div>
                            <p className={`text-xs ${getCurrentTheme().textSecondary}`}>{t("completedToday")}</p>
                            <p className={`text-lg font-bold ${getCurrentTheme().textPrimary}`}>
                              {getCompletedTasks().length}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Task Form */}
                  <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                    <CardContent className="p-4 space-y-3">
                      <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder={t("newTask")}
                        className={getCurrentTheme().inputBg}
                        onKeyPress={(e) => e.key === "Enter" && addTask()}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="time"
                          value={newTaskTime}
                          onChange={(e) => setNewTaskTime(e.target.value)}
                          className={getCurrentTheme().inputBg}
                        />
                        <Button onClick={addTask} className={getCurrentTheme().buttonPrimary}>
                          ➕
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

                  {/* Tasks List */}
                  <div className="space-y-3">
                    {getFilteredTasks().map((task) => (
                      <Card
                        key={task.id}
                        className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border} ${task.completed ? "opacity-60" : ""}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTask(task.id)}
                                className={task.completed ? "text-green-400" : getCurrentTheme().textSecondary}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <div className="flex-1">
                                <p
                                  className={`${getCurrentTheme().textPrimary} ${task.completed ? "line-through" : ""}`}
                                >
                                  {task.text}
                                </p>
                                {task.time && (
                                  <p className={`text-xs ${getCurrentTheme().textSecondary}`}>⏰ {task.time}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className={`text-xs px-2 py-1 rounded ${CATEGORY_COLORS[task.category]}`}>
                                {t(task.category)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTaskHandler(task.id)}
                                className="text-red-400"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {getFilteredTasks().length === 0 && (
                      <div className="text-center py-8">
                        <Target className={`w-12 h-12 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                        <p className={getCurrentTheme().textPrimary}>No hay tareas para hoy</p>
                        <p className={getCurrentTheme().textSecondary}>¡Agrega tu primera tarea!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Calendar Tab */}
              {activeTab === "calendar" && (
                <div className="space-y-4">
                  <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                    <CardHeader>
                      <CardTitle className={getCurrentTheme().textPrimary}>📅 {t("calendar")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <Button
                            variant="ghost"
                            onClick={() => setSelectedDate(new Date())}
                            className={getCurrentTheme().textSecondary}
                          >
                            Hoy: {new Date().toLocaleDateString()}
                          </Button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                            <div key={day} className={`p-2 text-xs font-semibold ${getCurrentTheme().textSecondary}`}>
                              {day}
                            </div>
                          ))}
                          {Array.from({ length: 35 }, (_, i) => {
                            const date = new Date()
                            date.setDate(date.getDate() - date.getDay() + i)
                            const isToday = date.toDateString() === new Date().toDateString()
                            const isSelected = date.toDateString() === selectedDate.toDateString()
                            const tasksForDate = getTasksForDate(date)

                            return (
                              <Button
                                key={i}
                                variant="ghost"
                                onClick={() => setSelectedDate(date)}
                                className={`p-2 h-10 text-xs ${
                                  isSelected
                                    ? "bg-purple-500 text-white"
                                    : isToday
                                      ? "bg-purple-500/20 text-purple-300"
                                      : getCurrentTheme().textSecondary
                                }`}
                              >
                                <div>
                                  <div>{date.getDate()}</div>
                                  {tasksForDate.length > 0 && (
                                    <div className="w-1 h-1 bg-cyan-400 rounded-full mx-auto mt-1"></div>
                                  )}
                                </div>
                              </Button>
                            )
                          })}
                        </div>
                        <div className="text-center">
                          <p className={`text-sm ${getCurrentTheme().textSecondary}`}>
                            Fecha seleccionada: {selectedDate.toLocaleDateString()}
                          </p>
                          <p className={`text-xs ${getCurrentTheme().textMuted}`}>
                            {getTodayTasks().length} tareas para este día
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Pomodoro Tab */}
              {activeTab === "pomodoro" && (
                <div className="space-y-4">
                  <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className={getCurrentTheme().textPrimary}>🍅 {t("pomodoro")}</CardTitle>
                      {user?.is_premium && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPomodoroSettings(true)}
                          className={getCurrentTheme().textSecondary}
                        >
                          ⚙️
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                      <div>
                        <div className={`text-6xl font-bold ${getCurrentTheme().textPrimary} mb-2`}>
                          {formatTime(pomodoroTime)}
                        </div>
                        <p className={getCurrentTheme().textSecondary}>{getCurrentPomodoroLabel()}</p>
                        <p className={`text-xs ${getCurrentTheme().textMuted} mt-1`}>
                          Sesión {pomodoroSessions + 1} •{" "}
                          {sessionsUntilLongBreak - (pomodoroSessions % sessionsUntilLongBreak)} hasta descanso largo
                        </p>
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Button
                          onClick={() => setPomodoroActive(!pomodoroActive)}
                          className={getCurrentTheme().buttonPrimary}
                        >
                          {pomodoroActive ? t("pause") : t("start")}
                        </Button>
                        <Button onClick={resetPomodoro} variant="outline" className={getCurrentTheme().buttonSecondary}>
                          {t("reset")}
                        </Button>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${((getTotalDuration() - pomodoroTime) / getTotalDuration()) * 100}%`,
                          }}
                        ></div>
                      </div>
                      {!user?.is_premium && (
                        <div
                          className={`text-xs ${getCurrentTheme().textMuted} text-center p-2 border border-yellow-500/20 rounded`}
                        >
                          💎 Premium: Configura duraciones personalizadas (30/10, 45/15, etc.)
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && user?.is_premium && (
                <div className="space-y-4">
                  <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                    <CardHeader>
                      <CardTitle className={getCurrentTheme().textPrimary}>⭐ {t("wishlist")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          value={newWishItem}
                          onChange={(e) => setNewWishItem(e.target.value)}
                          placeholder="Nuevo deseo..."
                          className={getCurrentTheme().inputBg}
                          onKeyPress={(e) => e.key === "Enter" && addWishItem()}
                        />
                        <Input
                          value={newWishDescription}
                          onChange={(e) => setNewWishDescription(e.target.value)}
                          placeholder="Descripción (opcional)..."
                          className={getCurrentTheme().inputBg}
                        />
                        <Button onClick={addWishItem} className={`w-full ${getCurrentTheme().buttonPrimary}`}>
                          Agregar Deseo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    {wishlistItems.map((item) => (
                      <Card
                        key={item.id}
                        className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border} ${item.completed ? "opacity-60" : ""}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleWishItem(item.id)}
                                className={item.completed ? "text-green-400" : getCurrentTheme().textSecondary}
                              >
                                <Star className="w-4 h-4" />
                              </Button>
                              <div className="flex-1">
                                <p
                                  className={`${getCurrentTheme().textPrimary} ${item.completed ? "line-through" : ""}`}
                                >
                                  {item.text}
                                </p>
                                {item.description && (
                                  <p className={`text-xs ${getCurrentTheme().textSecondary}`}>{item.description}</p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteWishItem(item.id)}
                              className="text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {wishlistItems.length === 0 && (
                      <div className="text-center py-8">
                        <Star className={`w-12 h-12 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                        <p className={getCurrentTheme().textPrimary}>No tienes deseos aún</p>
                        <p className={getCurrentTheme().textSecondary}>¡Agrega tu primer deseo!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === "notes" && user?.is_premium && (
                <div className="space-y-4">
                  <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                    <CardHeader>
                      <CardTitle className={getCurrentTheme().textPrimary}>📝 {t("notes")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          value={newNoteTitle}
                          onChange={(e) => setNewNoteTitle(e.target.value)}
                          placeholder="Título de la nota..."
                          className={getCurrentTheme().inputBg}
                        />
                        <textarea
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          placeholder="Contenido de la nota..."
                          className={`w-full p-3 rounded-md ${getCurrentTheme().inputBg} min-h-[100px] resize-none`}
                        />
                        <Button onClick={addNote} className={`w-full ${getCurrentTheme().buttonPrimary}`}>
                          Agregar Nota
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    {notes.map((note) => (
                      <Card key={note.id} className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                        <CardContent className="p-3">
                          {editingNote === note.id ? (
                            <div className="space-y-2">
                              <Input
                                value={editNoteTitle}
                                onChange={(e) => setEditNoteTitle(e.target.value)}
                                className={getCurrentTheme().inputBg}
                              />
                              <textarea
                                value={editNoteContent}
                                onChange={(e) => setEditNoteContent(e.target.value)}
                                className={`w-full p-2 rounded ${getCurrentTheme().inputBg} min-h-[80px] resize-none`}
                              />
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={saveEditNote} className={getCurrentTheme().buttonPrimary}>
                                  Guardar
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEditNote}>
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className={`font-semibold ${getCurrentTheme().textPrimary}`}>{note.title}</h4>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEditNote(note)}
                                    className={getCurrentTheme().textSecondary}
                                  >
                                    ✏️
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteNoteHandler(note.id)}
                                    className="text-red-400"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className={`text-sm ${getCurrentTheme().textSecondary} whitespace-pre-wrap`}>
                                {note.content}
                              </p>
                              <p className={`text-xs ${getCurrentTheme().textMuted} mt-2`}>
                                {new Date(note.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    {notes.length === 0 && (
                      <div className="text-center py-8">
                        <div className={`text-4xl mb-4`}>📝</div>
                        <p className={getCurrentTheme().textPrimary}>No tienes notas aún</p>
                        <p className={getCurrentTheme().textSecondary}>¡Agrega tu primera nota!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="container mx-auto p-6 space-y-6">
            {/* Desktop Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {t("appName")}
                </h1>
                <p className={`${getCurrentTheme().textSecondary} text-sm`}>
                  Hola, {user?.name} {user?.is_premium && <Crown className="inline w-4 h-4 text-yellow-400 ml-1" />}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {!user?.is_premium && (
                  <Button
                    onClick={() => setShowPremiumModal(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    {t("upgradeButton")}
                  </Button>
                )}
                <Button variant="ghost" onClick={openSettings} className={getCurrentTheme().textSecondary}>
                  {t("settings")}
                </Button>
                <Button variant="ghost" onClick={logout} className={getCurrentTheme().textSecondary}>
                  {t("logout")}
                </Button>
              </div>
            </div>

            {/* Desktop Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className={`text-sm ${getCurrentTheme().textSecondary}`}>{t("totalToday")}</p>
                      <p className={`text-xl font-bold ${getCurrentTheme().textPrimary}`}>{getTodayTasks().length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-400" />
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
                    <Flame className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className={`text-sm ${getCurrentTheme().textSecondary}`}>{t("streak")}</p>
                      <p className={`text-xl font-bold ${getCurrentTheme().textPrimary}`}>3</p>
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

            {/* Desktop Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Tasks (3/4 width) */}
              <div className="lg:col-span-3 space-y-6">
                {/* Task Form */}
                <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                  <CardHeader>
                    <CardTitle className={getCurrentTheme().textPrimary}>{t("addTask")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder={t("newTask")}
                      className={getCurrentTheme().inputBg}
                      onKeyPress={(e) => e.key === "Enter" && addTask()}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        type="time"
                        value={newTaskTime}
                        onChange={(e) => setNewTaskTime(e.target.value)}
                        className={getCurrentTheme().inputBg}
                      />
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
                    <Button onClick={addTask} className={`w-full ${getCurrentTheme().buttonPrimary}`}>
                      {t("addTask")}
                    </Button>
                  </CardContent>
                </Card>

                {/* Tasks List */}
                <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                  <CardHeader>
                    <CardTitle className={getCurrentTheme().textPrimary}>
                      {t("tasks")} - {selectedDate.toLocaleDateString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getFilteredTasks().map((task) => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg border ${getCurrentTheme().border} ${
                            task.completed ? "opacity-60" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTask(task.id)}
                                className={task.completed ? "text-green-400" : getCurrentTheme().textSecondary}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <div>
                                <p
                                  className={`${getCurrentTheme().textPrimary} ${task.completed ? "line-through" : ""}`}
                                >
                                  {task.text}
                                </p>
                                {task.time && (
                                  <p className={`text-sm ${getCurrentTheme().textSecondary}`}>⏰ {task.time}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded ${CATEGORY_COLORS[task.category]}`}>
                                {t(task.category)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTaskHandler(task.id)}
                                className="text-red-400 hover:bg-red-500/20"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {getFilteredTasks().length === 0 && (
                        <div className="text-center py-8">
                          <Target className={`w-12 h-12 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                          <p className={getCurrentTheme().textPrimary}>No hay tareas para hoy</p>
                          <p className={getCurrentTheme().textSecondary}>¡Agrega tu primera tarea!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Tabbed Interface (1/4 width) */}
              <div className="lg:col-span-1">
                <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border} h-fit`}>
                  <CardHeader className="pb-2">
                    <div className="flex space-x-1 bg-black/20 rounded-lg p-1">
                      <Button
                        variant={activeTab === "calendar" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("calendar")}
                        className={`flex-1 text-xs ${
                          activeTab === "calendar" ? getCurrentTheme().buttonPrimary : getCurrentTheme().textSecondary
                        }`}
                      >
                        📅
                      </Button>
                      <Button
                        variant={activeTab === "pomodoro" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("pomodoro")}
                        className={`flex-1 text-xs ${
                          activeTab === "pomodoro" ? getCurrentTheme().buttonPrimary : getCurrentTheme().textSecondary
                        }`}
                      >
                        🍅
                      </Button>
                      {user?.is_premium && (
                        <>
                          <Button
                            variant={activeTab === "wishlist" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setActiveTab("wishlist")}
                            className={`flex-1 text-xs ${
                              activeTab === "wishlist"
                                ? getCurrentTheme().buttonPrimary
                                : getCurrentTheme().textSecondary
                            }`}
                          >
                            ⭐
                          </Button>
                          <Button
                            variant={activeTab === "notes" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setActiveTab("notes")}
                            className={`flex-1 text-xs ${
                              activeTab === "notes" ? getCurrentTheme().buttonPrimary : getCurrentTheme().textSecondary
                            }`}
                          >
                            📝
                          </Button>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    {/* Calendar Tab */}
                    {activeTab === "calendar" && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className={`font-semibold ${getCurrentTheme().textPrimary} mb-2`}>📅 {t("calendar")}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDate(new Date())}
                            className={getCurrentTheme().textSecondary}
                          >
                            Hoy: {new Date().toLocaleDateString()}
                          </Button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {["D", "L", "M", "X", "J", "V", "S"].map((day) => (
                            <div key={day} className={`p-1 text-xs font-semibold ${getCurrentTheme().textSecondary}`}>
                              {day}
                            </div>
                          ))}
                          {Array.from({ length: 35 }, (_, i) => {
                            const date = new Date()
                            date.setDate(date.getDate() - date.getDay() + i)
                            const isToday = date.toDateString() === new Date().toDateString()
                            const isSelected = date.toDateString() === selectedDate.toDateString()
                            const tasksForDate = getTasksForDate(date)

                            return (
                              <Button
                                key={i}
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedDate(date)}
                                className={`p-1 h-8 text-xs ${
                                  isSelected
                                    ? "bg-purple-500 text-white"
                                    : isToday
                                      ? "bg-purple-500/20 text-purple-300"
                                      : getCurrentTheme().textSecondary
                                }`}
                              >
                                <div>
                                  <div>{date.getDate()}</div>
                                  {tasksForDate.length > 0 && (
                                    <div className="w-1 h-1 bg-cyan-400 rounded-full mx-auto"></div>
                                  )}
                                </div>
                              </Button>
                            )
                          })}
                        </div>
                        <div className="text-center">
                          <p className={`text-xs ${getCurrentTheme().textSecondary}`}>
                            {selectedDate.toLocaleDateString()}
                          </p>
                          <p className={`text-xs ${getCurrentTheme().textMuted}`}>{getTodayTasks().length} tareas</p>
                        </div>
                      </div>
                    )}

                    {/* Pomodoro Tab */}
                    {activeTab === "pomodoro" && (
                      <div className="space-y-4">
                        <div className="text-center flex items-center justify-between">
                          <h3 className={`font-semibold ${getCurrentTheme().textPrimary}`}>🍅 {t("pomodoro")}</h3>
                          {user?.is_premium && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowPomodoroSettings(true)}
                              className={`${getCurrentTheme().textSecondary} p-1`}
                            >
                              ⚙️
                            </Button>
                          )}
                        </div>
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${getCurrentTheme().textPrimary} mb-2`}>
                            {formatTime(pomodoroTime)}
                          </div>
                          <p className={`text-sm ${getCurrentTheme().textSecondary} mb-1`}>
                            {getCurrentPomodoroLabel()}
                          </p>
                          <p className={`text-xs ${getCurrentTheme().textMuted}`}>Sesión {pomodoroSessions + 1}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            onClick={() => setPomodoroActive(!pomodoroActive)}
                            className={getCurrentTheme().buttonPrimary}
                          >
                            {pomodoroActive ? t("pause") : t("start")}
                          </Button>
                          <Button
                            size="sm"
                            onClick={resetPomodoro}
                            variant="outline"
                            className={getCurrentTheme().buttonSecondary}
                          >
                            {t("reset")}
                          </Button>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                            style={{
                              width: `${(((pomodoroType === "work" ? 25 * 60 : 5 * 60) - pomodoroTime) / (pomodoroType === "work" ? 25 * 60 : 5 * 60)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        {!user?.is_premium && (
                          <div
                            className={`text-xs ${getCurrentTheme().textMuted} text-center p-2 border border-yellow-500/20 rounded`}
                          >
                            💎 Premium: Duraciones personalizadas
                          </div>
                        )}
                      </div>
                    )}

                    {/* Wishlist Tab - Premium Only */}
                    {activeTab === "wishlist" && user?.is_premium && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className={`font-semibold ${getCurrentTheme().textPrimary} mb-4`}>⭐ {t("wishlist")}</h3>
                        </div>
                        <div className="space-y-2">
                          <Input
                            value={newWishItem}
                            onChange={(e) => setNewWishItem(e.target.value)}
                            placeholder="Nuevo deseo..."
                            className={getCurrentTheme().inputBg}
                            onKeyPress={(e) => e.key === "Enter" && addWishItem()}
                          />
                          <Button
                            onClick={addWishItem}
                            size="sm"
                            className={`w-full ${getCurrentTheme().buttonPrimary}`}
                          >
                            Agregar
                          </Button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {wishlistItems.map((item) => (
                            <div
                              key={item.id}
                              className={`flex items-center justify-between p-2 rounded text-sm ${getCurrentTheme().border} border`}
                            >
                              <div className="flex items-center space-x-2 flex-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleWishItem(item.id)}
                                  className={`p-1 ${item.completed ? "text-green-400" : getCurrentTheme().textSecondary}`}
                                >
                                  <Star className="w-3 h-3" />
                                </Button>
                                <span
                                  className={`text-xs ${getCurrentTheme().textPrimary} ${item.completed ? "line-through" : ""} truncate`}
                                >
                                  {item.text}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteWishItem(item.id)}
                                className="text-red-400 p-1"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          {wishlistItems.length === 0 && (
                            <p className={`text-xs ${getCurrentTheme().textSecondary} text-center py-4`}>
                              No hay deseos aún
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes Tab - Premium Only */}
                    {activeTab === "notes" && user?.is_premium && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className={`font-semibold ${getCurrentTheme().textPrimary} mb-4`}>📝 {t("notes")}</h3>
                        </div>
                        <div className="space-y-2">
                          <Input
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            placeholder="Título..."
                            className={getCurrentTheme().inputBg}
                          />
                          <textarea
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            placeholder="Contenido..."
                            className={`w-full p-2 rounded ${getCurrentTheme().inputBg} text-xs min-h-[60px] resize-none`}
                          />
                          <Button onClick={addNote} size="sm" className={`w-full ${getCurrentTheme().buttonPrimary}`}>
                            Agregar
                          </Button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {notes.map((note) => (
                            <div key={note.id} className={`p-2 rounded border text-sm ${getCurrentTheme().border}`}>
                              <div className="flex items-center justify-between mb-1">
                                <h5 className={`text-xs font-semibold ${getCurrentTheme().textPrimary} truncate`}>
                                  {note.title}
                                </h5>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNoteHandler(note.id)}
                                  className="text-red-400 p-1"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className={`text-xs ${getCurrentTheme().textSecondary} line-clamp-3`}>
                                {note.content}
                              </p>
                            </div>
                          ))}
                          {notes.length === 0 && (
                            <p className={`text-xs ${getCurrentTheme().textSecondary} text-center py-4`}>
                              No hay notas aún
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Premium Modal */}
        {showPremiumModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className={`w-full max-w-2xl ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  <Crown className="inline w-6 h-6 mr-2" />
                  {t("upgradeButton")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className={`text-lg font-semibold ${getCurrentTheme().textPrimary}`}>
                      Características Premium:
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className={getCurrentTheme().textPrimary}>Tareas ilimitadas</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className={getCurrentTheme().textPrimary}>Lista de deseos</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className={getCurrentTheme().textPrimary}>Notas ilimitadas</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className={getCurrentTheme().textPrimary}>Temas premium</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className={getCurrentTheme().textPrimary}>Sincronización en la nube</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-y-4">
                    <div>
                      <div className={`text-3xl font-bold ${getCurrentTheme().textPrimary}`}>{t("monthlyPrice")}</div>
                      <p className={getCurrentTheme().textSecondary}>Facturación mensual</p>
                    </div>
                    <Button
                      onClick={() => {
                        setShowPremiumModal(false)
                        handlePremiumChoice(true)
                      }}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-lg py-3"
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      {t("startPremium")}
                    </Button>
                    <p className={`text-xs ${getCurrentTheme().textMuted}`}>
                      * Esta es una demo. No se procesará ningún pago real.
                    </p>
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-end p-6">
                <Button variant="ghost" onClick={() => setShowPremiumModal(false)}>
                  {t("cancel")}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className={`w-full max-w-md ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
              <CardHeader>
                <CardTitle className={getCurrentTheme().textPrimary}>{t("settings")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className={getCurrentTheme().textSecondary}>{t("name")}</Label>
                  <Input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className={getCurrentTheme().inputBg}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={getCurrentTheme().textSecondary}>{t("email")}</Label>
                  <Input
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className={getCurrentTheme().inputBg}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={getCurrentTheme().textSecondary}>{t("language")}</Label>
                  <Select value={profileLanguage} onValueChange={setProfileLanguage}>
                    <SelectTrigger className={getCurrentTheme().inputBg}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} className={getCurrentTheme().textPrimary}>
                          {lang.flag} {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={getCurrentTheme().textSecondary}>{t("theme")}</Label>
                  <Select value={profileTheme} onValueChange={setProfileTheme}>
                    <SelectTrigger className={getCurrentTheme().inputBg}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      {Object.entries(THEMES.free).map(([key, theme]) => (
                        <SelectItem key={key} value={key} className={getCurrentTheme().textPrimary}>
                          {theme.name}
                        </SelectItem>
                      ))}
                      {user?.is_premium &&
                        Object.entries(THEMES.premium).map(([key, theme]) => (
                          <SelectItem key={key} value={key} className={getCurrentTheme().textPrimary}>
                            <Crown className="inline w-3 h-3 mr-1" />
                            {theme.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {isSupabaseAvailable && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-green-400" />
                      <span className={`text-sm ${getCurrentTheme().textPrimary}`}>
                        {t("databaseStatus")}: Conectado a Supabase
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
              <div className="flex justify-end space-x-2 p-6">
                <Button variant="secondary" onClick={() => setShowSettingsModal(false)}>
                  {t("cancel")}
                </Button>
                <Button onClick={updateSettings} className={getCurrentTheme().buttonPrimary}>
                  {t("saveChanges")}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Pomodoro Settings Modal - Premium Only */}
        {showPomodoroSettings && user?.is_premium && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className={`w-full max-w-md ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
              <CardHeader>
                <CardTitle className={getCurrentTheme().textPrimary}>
                  <Crown className="inline w-4 h-4 mr-2 text-yellow-400" />
                  Configuración Pomodoro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className={getCurrentTheme().textSecondary}>Duración de trabajo (minutos)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="120"
                    value={workDuration}
                    onChange={(e) => setWorkDuration(Number(e.target.value))}
                    className={getCurrentTheme().inputBg}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={getCurrentTheme().textSecondary}>Descanso corto (minutos)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={shortBreakDuration}
                    onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                    className={getCurrentTheme().inputBg}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={getCurrentTheme().textSecondary}>Descanso largo (minutos)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="120"
                    value={longBreakDuration}
                    onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                    className={getCurrentTheme().inputBg}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={getCurrentTheme().textSecondary}>Sesiones hasta descanso largo</Label>
                  <Input
                    type="number"
                    min="2"
                    max="10"
                    value={sessionsUntilLongBreak}
                    onChange={(e) => setSessionsUntilLongBreak(Number(e.target.value))}
                    className={getCurrentTheme().inputBg}
                  />
                </div>

                {/* Preset Configurations */}
                <div className="space-y-2">
                  <Label className={getCurrentTheme().textSecondary}>Configuraciones predefinidas</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setWorkDuration(25)
                        setShortBreakDuration(5)
                        setLongBreakDuration(15)
                        setSessionsUntilLongBreak(4)
                      }}
                      className={getCurrentTheme().buttonSecondary}
                    >
                      Clásico 25/5
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setWorkDuration(30)
                        setShortBreakDuration(10)
                        setLongBreakDuration(20)
                        setSessionsUntilLongBreak(4)
                      }}
                      className={getCurrentTheme().buttonSecondary}
                    >
                      Extendido 30/10
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setWorkDuration(45)
                        setShortBreakDuration(15)
                        setLongBreakDuration(30)
                        setSessionsUntilLongBreak(3)
                      }}
                      className={getCurrentTheme().buttonSecondary}
                    >
                      Intensivo 45/15
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setWorkDuration(50)
                        setShortBreakDuration(10)
                        setLongBreakDuration(25)
                        setSessionsUntilLongBreak(4)
                      }}
                      className={getCurrentTheme().buttonSecondary}
                    >
                      Universitario 50/10
                    </Button>
                  </div>
                </div>

                <div className={`p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg`}>
                  <p className={`text-sm ${getCurrentTheme().textPrimary}`}>
                    Vista previa: {workDuration}min trabajo → {shortBreakDuration}min descanso
                  </p>
                  <p className={`text-xs ${getCurrentTheme().textMuted}`}>
                    Descanso largo de {longBreakDuration}min cada {sessionsUntilLongBreak} sesiones
                  </p>
                </div>
              </CardContent>
              <div className="flex justify-end space-x-2 p-6">
                <Button variant="secondary" onClick={() => setShowPomodoroSettings(false)}>
                  {t("cancel")}
                </Button>
                <Button
                  onClick={() => {
                    resetPomodoroSession()
                    setShowPomodoroSettings(false)
                  }}
                  className={getCurrentTheme().buttonPrimary}
                >
                  Aplicar y Reiniciar
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    )
  }

  // Fallback - should never reach here
  return (
    <div className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().gradient} flex items-center justify-center`}>
      <div className="text-center">
        <h1 className={`text-2xl font-bold ${getCurrentTheme().textPrimary}`}>FutureTask</h1>
        <p className={getCurrentTheme().textSecondary}>Loading...</p>
      </div>
    </div>
  )
}
