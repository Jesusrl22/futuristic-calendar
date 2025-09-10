"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarIcon,
  Star,
  Target,
  Flame,
  Crown,
  Check,
  X,
  Globe,
  Database,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Sparkles,
  Bot,
} from "lucide-react"

// Import custom components
import { StatsCards } from "@/components/stats-cards"
import { CalendarWidget } from "@/components/calendar-widget"
import { TaskForm } from "@/components/task-form"
import { NotificationService } from "@/components/notification-service"
import { DatabaseStatus } from "@/components/database-status"
import { WishlistManager } from "@/components/wishlist-manager"
import { NotesManager } from "@/components/notes-manager"
import { SettingsModal } from "@/components/settings-modal"
import { AIAssistant } from "@/components/ai-assistant"
import { useIsMobile } from "@/hooks/use-mobile"

// Import database functions
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
  initializeAdminUser,
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
  is_pro: boolean
  onboarding_completed: boolean
  pomodoro_sessions: number
  work_duration: number
  short_break_duration: number
  long_break_duration: number
  sessions_until_long_break: number
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
    tasksAndCalendar: "Tareas y Calendario",
    wishlist: "Lista de Deseos",
    notes: "Notas",
    pomodoro: "Pomodoro",
    aiAssistant: "Asistente IA",
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
    pro: "Pro",
    free: "Gratuito",
    choosePlan: "Elige tu plan",
    startPremium: "Comenzar Premium",
    startPro: "Comenzar Pro",
    continueFreee: "Continuar gratis",
    monthly: "Mensual",
    yearly: "Anual",
    monthlyPrice: "€1,99/mes",
    yearlyPrice: "€20/año",
    proMonthlyPrice: "€4,99/mes",
    proYearlyPrice: "€50/año",
    yearlyDiscount: "Ahorra €3,88",
    proYearlyDiscount: "Ahorra €9,88",
    billingMonthly: "Facturación mensual",
    billingYearly: "Facturación anual (2 meses gratis)",
    upgradeButton: "Actualizar a Premium",
    upgradeToProButton: "Actualizar a Pro",
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
    currentPassword: "Contraseña Actual",
    confirmPassword: "Confirmar Contraseña",
    changePassword: "Cambiar Contraseña",
    leaveEmptyKeepCurrent: "Dejar vacío para mantener actual",
    databaseStatus: "Estado de la Base de Datos",
    migrateData: "Migrar Datos",
    migrateDataDesc: "Migrar datos locales a Supabase",
    pomodoroSettings: "Configuración Pomodoro",
    workDuration: "Duración de trabajo (minutos)",
    shortBreakDuration: "Descanso corto (minutos)",
    longBreakDuration: "Descanso largo (minutos)",
    sessionsUntilLongBreak: "Sesiones hasta descanso largo",
    presetConfigurations: "Configuraciones predefinidas",
    classic: "Clásico 25/5",
    extended: "Extendido 30/10",
    intensive: "Intensivo 45/15",
    university: "Universitario 50/10",
    applyAndReset: "Aplicar y Reiniciar",
    passwordsDoNotMatch: "Las contraseñas no coinciden",
    passwordChangedSuccessfully: "Contraseña cambiada exitosamente",
    incorrectCurrentPassword: "Contraseña actual incorrecta",
    settingsSaved: "Configuración guardada exitosamente",
    forgotPassword: "¿Olvidaste tu contraseña?",
    loginWithGoogle: "Continuar con Google",
    loginWithGitHub: "Continuar con GitHub",
    loginWithApple: "Continuar con Apple",
    orContinueWith: "O continúa con",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    tasksForDate: "Tareas para",
    noTasksForDate: "No hay tareas para esta fecha",
    addTaskForDate: "Agregar tarea para este día",
    aiPoweredPlanning: "Planificación con IA",
    smartGoalSetting: "Objetivos inteligentes",
    autoTaskCreation: "Creación automática de tareas",
    personalizedScheduling: "Programación personalizada",
    advancedAnalytics: "Análisis avanzado",
    unlimitedAIRequests: "Consultas IA ilimitadas",
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
    tasksAndCalendar: "Tasks & Calendar",
    wishlist: "Wishlist",
    notes: "Notes",
    pomodoro: "Pomodoro",
    aiAssistant: "AI Assistant",
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
    pro: "Pro",
    free: "Free",
    choosePlan: "Choose your plan",
    startPremium: "Start Premium",
    startPro: "Start Pro",
    continueFreee: "Continue free",
    monthly: "Monthly",
    yearly: "Yearly",
    monthlyPrice: "$1.99/month",
    yearlyPrice: "$20/year",
    proMonthlyPrice: "$4.99/month",
    proYearlyPrice: "$50/year",
    yearlyDiscount: "Save $3.88",
    proYearlyDiscount: "Save $9.88",
    billingMonthly: "Monthly billing",
    billingYearly: "Yearly billing (2 months free)",
    upgradeButton: "Upgrade to Premium",
    upgradeToProButton: "Upgrade to Pro",
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
    currentPassword: "Current Password",
    confirmPassword: "Confirm Password",
    changePassword: "Change Password",
    leaveEmptyKeepCurrent: "Leave empty to keep current",
    databaseStatus: "Database Status",
    migrateData: "Migrate Data",
    migrateDataDesc: "Migrate local data to Supabase",
    pomodoroSettings: "Pomodoro Settings",
    workDuration: "Work duration (minutes)",
    shortBreakDuration: "Short break (minutes)",
    longBreakDuration: "Long break (minutes)",
    sessionsUntilLongBreak: "Sessions until long break",
    presetConfigurations: "Preset configurations",
    classic: "Classic 25/5",
    extended: "Extended 30/10",
    intensive: "Intensive 45/15",
    university: "University 50/10",
    applyAndReset: "Apply and Reset",
    passwordsDoNotMatch: "Passwords do not match",
    passwordChangedSuccessfully: "Password changed successfully",
    incorrectCurrentPassword: "Incorrect current password",
    settingsSaved: "Settings saved successfully",
    forgotPassword: "Forgot your password?",
    loginWithGoogle: "Continue with Google",
    loginWithGitHub: "Continue with GitHub",
    loginWithApple: "Continue with Apple",
    orContinueWith: "Or continue with",
    showPassword: "Show password",
    hidePassword: "Hide password",
    tasksForDate: "Tasks for",
    noTasksForDate: "No tasks for this date",
    addTaskForDate: "Add task for this day",
    aiPoweredPlanning: "AI-Powered Planning",
    smartGoalSetting: "Smart Goal Setting",
    autoTaskCreation: "Auto Task Creation",
    personalizedScheduling: "Personalized Scheduling",
    advancedAnalytics: "Advanced Analytics",
    unlimitedAIRequests: "Unlimited AI Requests",
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
    tasksAndCalendar: "Tâches et Calendrier",
    wishlist: "Liste de souhaits",
    notes: "Notes",
    pomodoro: "Pomodoro",
    aiAssistant: "Assistant IA",
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
    premium: "Premium",
    pro: "Pro",
    free: "Gratuit",
    choosePlan: "Choisissez votre plan",
    startPremium: "Commencer Premium",
    startPro: "Commencer Pro",
    continueFreee: "Continuer gratuitement",
    monthly: "Mensuel",
    yearly: "Annuel",
    monthlyPrice: "1,99€/mois",
    yearlyPrice: "20€/an",
    proMonthlyPrice: "4,99€/mois",
    proYearlyPrice: "50€/an",
    yearlyDiscount: "Économisez 3,88€",
    proYearlyDiscount: "Économisez 9,88€",
    billingMonthly: "Facturation mensuelle",
    billingYearly: "Facturation annuelle (2 mois gratuits)",
    upgradeButton: "Passer à Premium",
    upgradeToProButton: "Passer à Pro",
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
    currentPassword: "Mot de passe actuel",
    confirmPassword: "Confirmer le mot de passe",
    changePassword: "Changer le mot de passe",
    leaveEmptyKeepCurrent: "Laisser vide pour conserver l'actuel",
    databaseStatus: "État de la base de données",
    migrateData: "Migrer les données",
    migrateDataDesc: "Migrer les données locales vers Supabase",
    pomodoroSettings: "Paramètres Pomodoro",
    workDuration: "Durée de travail (minutes)",
    shortBreakDuration: "Pause courte (minutes)",
    longBreakDuration: "Pause longue (minutes)",
    sessionsUntilLongBreak: "Sessions jusqu'à la pause longue",
    presetConfigurations: "Configurations prédéfinies",
    classic: "Classique 25/5",
    extended: "Étendu 30/10",
    intensive: "Intensif 45/15",
    university: "Universitaire 50/10",
    applyAndReset: "Appliquer et réinitialiser",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
    passwordChangedSuccessfully: "Mot de passe changé avec succès",
    incorrectCurrentPassword: "Mot de passe actuel incorrect",
    settingsSaved: "Paramètres sauvegardés avec succès",
    forgotPassword: "Mot de passe oublié ?",
    loginWithGoogle: "Continuer avec Google",
    loginWithGitHub: "Continuer avec GitHub",
    loginWithApple: "Continuer avec Apple",
    orContinueWith: "Ou continuer avec",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    tasksForDate: "Tâches pour le",
    noTasksForDate: "Aucune tâche pour cette date",
    addTaskForDate: "Ajouter une tâche pour ce jour",
    aiPoweredPlanning: "Planification IA",
    smartGoalSetting: "Objectifs intelligents",
    autoTaskCreation: "Création automatique de tâches",
    personalizedScheduling: "Programmation personnalisée",
    advancedAnalytics: "Analyses avancées",
    unlimitedAIRequests: "Requêtes IA illimitées",
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
    tasksAndCalendar: "Aufgaben und Kalender",
    wishlist: "Wunschliste",
    notes: "Notizen",
    pomodoro: "Pomodoro",
    aiAssistant: "KI-Assistent",
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
    premium: "Premium",
    pro: "Pro",
    free: "Kostenlos",
    choosePlan: "Wählen Sie Ihren Plan",
    startPremium: "Premium starten",
    startPro: "Pro starten",
    continueFreee: "Kostenlos fortfahren",
    monthly: "Monatlich",
    yearly: "Jährlich",
    monthlyPrice: "1,99€/Monat",
    yearlyPrice: "20€/Jahr",
    proMonthlyPrice: "4,99€/Monat",
    proYearlyPrice: "50€/Jahr",
    yearlyDiscount: "Sparen Sie 3,88€",
    proYearlyDiscount: "Sparen Sie 9,88€",
    billingMonthly: "Monatliche Abrechnung",
    billingYearly: "Jährliche Abrechnung (2 Monate kostenlos)",
    upgradeButton: "Auf Premium upgraden",
    upgradeToProButton: "Auf Pro upgraden",
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
    currentPassword: "Aktuelles Passwort",
    confirmPassword: "Passwort bestätigen",
    changePassword: "Passwort ändern",
    leaveEmptyKeepCurrent: "Leer lassen, um das aktuelle zu behalten",
    databaseStatus: "Datenbankstatus",
    migrateData: "Daten migrieren",
    migrateDataDesc: "Lokale Daten zu Supabase migrieren",
    pomodoroSettings: "Pomodoro-Einstellungen",
    workDuration: "Arbeitsdauer (Minuten)",
    shortBreakDuration: "Kurze Pause (Minuten)",
    longBreakDuration: "Lange Pause (Minuten)",
    sessionsUntilLongBreak: "Sitzungen bis zur langen Pause",
    presetConfigurations: "Vordefinierte Konfigurationen",
    classic: "Klassisch 25/5",
    extended: "Erweitert 30/10",
    intensive: "Intensiv 45/15",
    university: "Universität 50/10",
    applyAndReset: "Anwenden und zurücksetzen",
    passwordsDoNotMatch: "Passwörter stimmen nicht überein",
    passwordChangedSuccessfully: "Passwort erfolgreich geändert",
    incorrectCurrentPassword: "Aktuelles Passwort ist falsch",
    settingsSaved: "Einstellungen erfolgreich gespeichert",
    forgotPassword: "Passwort vergessen?",
    loginWithGoogle: "Mit Google fortfahren",
    loginWithGitHub: "Mit GitHub fortfahren",
    loginWithApple: "Mit Apple fortfahren",
    orContinueWith: "Oder fortfahren mit",
    showPassword: "Passwort anzeigen",
    hidePassword: "Passwort verbergen",
    tasksForDate: "Aufgaben für",
    noTasksForDate: "Keine Aufgaben für dieses Datum",
    addTaskForDate: "Aufgabe für diesen Tag hinzufügen",
    aiPoweredPlanning: "KI-gestützte Planung",
    smartGoalSetting: "Intelligente Zielsetzung",
    autoTaskCreation: "Automatische Aufgabenerstellung",
    personalizedScheduling: "Personalisierte Terminplanung",
    advancedAnalytics: "Erweiterte Analysen",
    unlimitedAIRequests: "Unbegrenzte KI-Anfragen",
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
    tasksAndCalendar: "Attività e Calendario",
    wishlist: "Lista dei desideri",
    notes: "Note",
    pomodoro: "Pomodoro",
    aiAssistant: "Assistente IA",
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
    premium: "Premium",
    pro: "Pro",
    free: "Gratuito",
    choosePlan: "Scegli il tuo piano",
    startPremium: "Inizia Premium",
    startPro: "Inizia Pro",
    continueFreee: "Continua gratis",
    monthly: "Mensile",
    yearly: "Annuale",
    monthlyPrice: "1,99€/mese",
    yearlyPrice: "20€/anno",
    proMonthlyPrice: "4,99€/mese",
    proYearlyPrice: "50€/anno",
    yearlyDiscount: "Risparmia 3,88€",
    proYearlyDiscount: "Risparmia 9,88€",
    billingMonthly: "Fatturazione mensile",
    billingYearly: "Fatturazione annuale (2 mesi gratuiti)",
    upgradeButton: "Passa a Premium",
    upgradeToProButton: "Passa a Pro",
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
    currentPassword: "Password attuale",
    confirmPassword: "Conferma password",
    changePassword: "Cambia password",
    leaveEmptyKeepCurrent: "Lascia vuoto per mantenere quello attuale",
    databaseStatus: "Stato del database",
    migrateData: "Migra dati",
    migrateDataDesc: "Migra i dati locali su Supabase",
    pomodoroSettings: "Impostazioni Pomodoro",
    workDuration: "Durata lavoro (minuti)",
    shortBreakDuration: "Pausa breve (minuti)",
    longBreakDuration: "Pausa lunga (minuti)",
    sessionsUntilLongBreak: "Sessioni fino alla pausa lunga",
    presetConfigurations: "Configurazioni predefinite",
    classic: "Classico 25/5",
    extended: "Esteso 30/10",
    intensive: "Intensivo 45/15",
    university: "Universitario 50/10",
    applyAndReset: "Applica e reimposta",
    passwordsDoNotMatch: "Le password non corrispondono",
    passwordChangedSuccessfully: "Password cambiata con successo",
    incorrectCurrentPassword: "Password attuale errata",
    settingsSaved: "Impostazioni salvate con successo",
    forgotPassword: "Password dimenticata?",
    loginWithGoogle: "Continua con Google",
    loginWithGitHub: "Continua con GitHub",
    loginWithApple: "Continua con Apple",
    orContinueWith: "O continua con",
    showPassword: "Mostra password",
    hidePassword: "Nascondi password",
    tasksForDate: "Attività per",
    noTasksForDate: "Nessuna attività per questa data",
    addTaskForDate: "Aggiungi attività per questo giorno",
    aiPoweredPlanning: "Pianificazione IA",
    smartGoalSetting: "Obiettivi intelligenti",
    autoTaskCreation: "Creazione automatica attività",
    personalizedScheduling: "Programmazione personalizzata",
    advancedAnalytics: "Analisi avanzate",
    unlimitedAIRequests: "Richieste IA illimitate",
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

// Helper functions for localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === "undefined") return null
      return localStorage.getItem(key)
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window === "undefined") return
      localStorage.setItem(key, value)
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window === "undefined") return
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  },
}

export default function FutureTaskApp() {
  // Core state
  const [user, setUser] = useState<User | null>(null)
  const [language, setLanguage] = useState<"es" | "en" | "fr" | "de" | "it">("es")
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "auth" | "premium" | "app">("welcome")
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useIsMobile()

  // App state
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState<"tasksAndCalendar" | "tasks" | "pomodoro" | "wishlist" | "notes" | "ai">(
    isMobile ? "tasksAndCalendar" : "tasksAndCalendar",
  )
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS)

  // Notification state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)

  // Auth state
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Pomodoro state
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [pomodoroType, setPomodoroType] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [pomodoroSessions, setPomodoroSessions] = useState(0)

  // Modals
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false)

  // Wishlist and Notes state
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  // Edit task state
  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTaskText, setEditTaskText] = useState("")
  const [editTaskDescription, setEditTaskDescription] = useState("")
  const [editTaskTime, setEditTaskTime] = useState("")
  const [editTaskCategory, setEditTaskCategory] = useState<Task["category"]>("personal")
  const [editTaskPriority, setEditTaskPriority] = useState<Task["priority"]>("medium")

  const t = useCallback(
    (key: string) => {
      return translations[language][key as keyof (typeof translations)[typeof language]] || key
    },
    [language],
  )

  // Set default tab based on screen size
  useEffect(() => {
    if (currentScreen === "app") {
      setActiveTab(isMobile ? "tasksAndCalendar" : "tasksAndCalendar")
    }
  }, [isMobile, currentScreen])

  // Load saved language on init
  useEffect(() => {
    const savedLanguage = safeLocalStorage.getItem("futureTask_language")
    if (savedLanguage && ["es", "en", "fr", "de", "it"].includes(savedLanguage)) {
      setLanguage(savedLanguage as "es" | "en" | "fr" | "de" | "it")
    }
  }, [])

  // Save language when it changes
  useEffect(() => {
    safeLocalStorage.setItem("futureTask_language", language)
  }, [language])

  // Load user Pomodoro settings
  useEffect(() => {
    if (user) {
      setPomodoroTime((user.work_duration || 25) * 60)
    }
  }, [user])

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
      const permission = await Notification.requestPermission()
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

  // Función mejorada para cargar datos del usuario
  const loadUserData = async (userId: string) => {
    try {
      console.log("🔄 Loading user data for:", userId)

      const [userTasks, userWishlist, userNotes] = await Promise.all([
        getUserTasks(userId).catch((error) => {
          console.error("Error loading tasks:", error)
          return []
        }),
        getUserWishlist(userId).catch((error) => {
          console.error("Error loading wishlist:", error)
          return []
        }),
        getUserNotes(userId).catch((error) => {
          console.error("Error loading notes:", error)
          return []
        }),
      ])

      console.log("✅ User data loaded:", {
        tasks: userTasks.length,
        wishlist: userWishlist.length,
        notes: userNotes.length,
      })

      setTasks(userTasks)
      setWishlistItems(userWishlist)
      setNotes(userNotes)

      return { userTasks, userWishlist, userNotes }
    } catch (error) {
      console.error("❌ Error loading user data:", error)
      return { userTasks: [], userWishlist: [], userNotes: [] }
    }
  }

  // Initialize app - runs only once - MEJORADA
  const initializeApp = async () => {
    try {
      console.log("🚀 Initializing FutureTask app...")
      setIsLoading(true)

      // Initialize admin user first
      await initializeAdminUser()

      // Verificar si hay un usuario guardado
      const savedUserData = safeLocalStorage.getItem("futureTask_user")
      const savedUserSession = safeLocalStorage.getItem("futureTask_user_session")

      if (savedUserData && savedUserSession) {
        try {
          const parsedUser = JSON.parse(savedUserData)
          const sessionData = JSON.parse(savedUserSession)

          console.log("👤 Found saved user:", parsedUser.email)

          // Verificar que el usuario aún existe en la base de datos
          const userExists = await verifyUserExists(parsedUser.email, sessionData.password)

          if (!userExists) {
            console.log("👤 Saved user no longer exists, clearing localStorage")
            safeLocalStorage.removeItem("futureTask_user")
            safeLocalStorage.removeItem("futureTask_user_session")
            setCurrentScreen("welcome")
            return
          }

          console.log("✅ User verified, loading data...")
          setUser(userExists)
          setLanguage(userExists.language || "es")

          // Cargar datos del usuario
          await loadUserData(userExists.id)

          // Check if we should show migration prompt
          if (isSupabaseAvailable) {
            const hasLocalData =
              safeLocalStorage.getItem(`futureTask_tasks_${userExists.id}`) ||
              safeLocalStorage.getItem(`futureTask_wishlist_${userExists.id}`) ||
              safeLocalStorage.getItem(`futureTask_notes_${userExists.id}`)

            if (hasLocalData) {
              setShowMigrationPrompt(true)
            }
          }

          setCurrentScreen(userExists.onboarding_completed ? "app" : "welcome")
        } catch (parseError) {
          console.error("❌ Error parsing saved user data:", parseError)
          safeLocalStorage.removeItem("futureTask_user")
          safeLocalStorage.removeItem("futureTask_user_session")
          setCurrentScreen("welcome")
        }
      } else {
        console.log("👤 No saved user found")
        setCurrentScreen("welcome")
      }
    } catch (error) {
      console.error("❌ Error initializing app:", error)
      setCurrentScreen("welcome")
    } finally {
      setIsLoading(false)
      setIsInitialized(true)
    }
  }

  // Función para guardar usuario de forma segura
  const saveUserSession = (user: User, password: string) => {
    try {
      safeLocalStorage.setItem("futureTask_user", JSON.stringify(user))
      safeLocalStorage.setItem("futureTask_user_session", JSON.stringify({ password, timestamp: Date.now() }))
      console.log("✅ User session saved")
    } catch (error) {
      console.error("❌ Error saving user session:", error)
    }
  }

  // Función para login con proveedores sociales (simulada por ahora)
  const handleSocialLogin = async (provider: "google" | "github" | "apple") => {
    try {
      setIsLoading(true)

      // Simular login social - en producción esto sería con OAuth real
      alert(
        `🚧 Login con ${provider} estará disponible próximamente.\n\nPor ahora puedes usar:\n📧 Email: admin\n🔑 Contraseña: 535353-Jrl`,
      )
    } catch (error) {
      console.error(`Error with ${provider} login:`, error)
      alert(`Error al iniciar sesión con ${provider}. Intenta de nuevo.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para recuperar contraseña (simulada por ahora)
  const handleForgotPassword = () => {
    alert(
      "🚧 La recuperación de contraseña estará disponible próximamente.\n\nPor ahora puedes usar:\n📧 Email: admin\n🔑 Contraseña: 535353-Jrl",
    )
  }

  // Agregar después de la función initializeApp, antes de useEffect:

  const syncUserChanges = useCallback(async () => {
    if (!user || !isSupabaseAvailable) return

    try {
      const savedSession = safeLocalStorage.getItem("futureTask_user_session")
      if (!savedSession) return

      const sessionData = JSON.parse(savedSession)

      // Verificar si hay cambios en el usuario desde el admin
      const updatedUser = await getUserByEmail(user.email, sessionData.password)
      if (
        updatedUser &&
        (updatedUser.is_premium !== user.is_premium ||
          updatedUser.is_pro !== user.is_pro ||
          updatedUser.name !== user.name ||
          updatedUser.theme !== user.theme ||
          updatedUser.language !== user.language)
      ) {
        console.log("🔄 Sincronizando cambios del usuario desde admin...")
        setUser(updatedUser)
        setLanguage(updatedUser.language)
        saveUserSession(updatedUser, sessionData.password)

        // Mostrar notificación si cambió el estado premium/pro
        if (updatedUser.is_pro !== user.is_pro) {
          if (updatedUser.is_pro) {
            alert("🎉 ¡Tu cuenta ha sido actualizada a Pro! Ahora tienes acceso a la IA y todas las funciones.")
          } else {
            alert("ℹ️ Tu cuenta Pro ha expirado. La IA y algunas funciones estarán limitadas.")
          }
        } else if (updatedUser.is_premium !== user.is_premium) {
          if (updatedUser.is_premium) {
            alert("🎉 ¡Tu cuenta ha sido actualizada a Premium! Ahora tienes acceso a más funciones.")
          } else {
            alert("ℹ️ Tu cuenta Premium ha expirado. Algunas funciones estarán limitadas.")
          }
        }
      }
    } catch (error) {
      console.error("Error syncing user changes:", error)
    }
  }, [user, isSupabaseAvailable])

  // Initialize app - runs only once
  useEffect(() => {
    if (isInitialized) return

    const timer = setTimeout(initializeApp, 100)
    return () => clearTimeout(timer)
  }, [isInitialized])

  // Agregar useEffect para sincronización periódica después del useEffect de inicialización:

  useEffect(() => {
    if (currentScreen !== "app" || !user) return

    // Sincronizar cambios cada 30 segundos
    const interval = setInterval(syncUserChanges, 30000)

    // Sincronizar cuando la ventana recupera el foco
    const handleFocus = () => syncUserChanges()
    window.addEventListener("focus", handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
    }
  }, [currentScreen, user, syncUserChanges])

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
        if ((pomodoroSessions + 1) % (user?.sessions_until_long_break || 4) === 0) {
          setPomodoroType("longBreak")
          setPomodoroTime((user?.long_break_duration || 15) * 60)
        } else {
          setPomodoroType("shortBreak")
          setPomodoroTime((user?.short_break_duration || 5) * 60)
        }
      } else {
        setPomodoroType("work")
        setPomodoroTime((user?.work_duration || 25) * 60)
      }

      // Show notification if permission granted
      if (notificationPermission === "granted") {
        try {
          new Notification(`🍅 ${pomodoroType === "work" ? "¡Descanso!" : "¡A trabajar!"}`, {
            body:
              pomodoroType === "work"
                ? `Sesión completada. Tiempo de ${(pomodoroSessions + 1) % (user?.sessions_until_long_break || 4) === 0 ? "descanso largo" : "descanso corto"}.`
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
    user?.work_duration,
    user?.short_break_duration,
    user?.long_break_duration,
    user?.sessions_until_long_break,
    notificationPermission,
  ])

  const resetPomodoro = () => {
    setPomodoroActive(false)
    setPomodoroType("work")
    setPomodoroTime((user?.work_duration || 25) * 60)
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
        return t("longBreak")
      default:
        return t("workSession")
    }
  }

  const getTotalDuration = () => {
    switch (pomodoroType) {
      case "work":
        return (user?.work_duration || 25) * 60
      case "shortBreak":
        return (user?.short_break_duration || 5) * 60
      case "longBreak":
        return (user?.long_break_duration || 15) * 60
      default:
        return (user?.work_duration || 25) * 60
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

  const getCompletedTasks = () => getTodayTasks().filter((task) => task.completed)
  const getTodayProgress = () => {
    const todayTasks = getTodayTasks()
    if (todayTasks.length === 0) return 0
    return (getCompletedTasks().length / todayTasks.length) * 100
  }

  // Event handlers - MEJORADOS
  const handleAuth = async () => {
    try {
      setIsLoading(true)

      if (authMode === "login") {
        const existingUser = await getUserByEmail(email, password)
        if (!existingUser) {
          alert("Usuario o contraseña incorrectos.")
          return
        }

        setUser(existingUser)
        saveUserSession(existingUser, password)

        // Cargar datos del usuario
        await loadUserData(existingUser.id)

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
            is_pro: false,
            onboarding_completed: false,
            pomodoro_sessions: 0,
            work_duration: 25,
            short_break_duration: 5,
            long_break_duration: 15,
            sessions_until_long_break: 4,
          })

          setUser(newUser)
          saveUserSession(newUser, password)
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
    } finally {
      setIsLoading(false)
    }
  }

  const handlePremiumChoice = async (plan: "free" | "premium" | "pro") => {
    if (!user) return

    try {
      setIsLoading(true)

      const updatedUser = await updateUser(user.id, {
        is_premium: plan === "premium" || plan === "pro",
        is_pro: plan === "pro",
        onboarding_completed: true,
      })

      setUser(updatedUser)
      const savedSession = safeLocalStorage.getItem("futureTask_user_session")
      if (savedSession) {
        const sessionData = JSON.parse(savedSession)
        saveUserSession(updatedUser, sessionData.password)
      }

      setCurrentScreen("app")
    } catch (error) {
      console.error("Error updating premium status:", error)

      // Fallback: update user locally if database update fails
      const updatedUserLocal = {
        ...user,
        is_premium: plan === "premium" || plan === "pro",
        is_pro: plan === "pro",
        onboarding_completed: true,
      }

      setUser(updatedUserLocal)
      const savedSession = safeLocalStorage.getItem("futureTask_user_session")
      if (savedSession) {
        const sessionData = JSON.parse(savedSession)
        saveUserSession(updatedUserLocal, sessionData.password)
      }

      setCurrentScreen("app")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTask = async (taskData: {
    text: string
    description: string
    time: string
    category: string
    priority: string
  }) => {
    if (!user) return

    try {
      const newTaskData = {
        user_id: user.id,
        text: taskData.text,
        description: taskData.description || null,
        time: taskData.time || null,
        completed: false,
        date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
        category: taskData.category as Task["category"],
        priority: taskData.priority as Task["priority"],
        notification_enabled: !!taskData.time && notificationPermission === "granted",
      }

      const newTaskFromDB = await createTask(newTaskData)
      setTasks((prev) => [...prev, newTaskFromDB])
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

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id)
    setEditTaskText(task.text)
    setEditTaskDescription(task.description || "")
    setEditTaskTime(task.time || "")
    setEditTaskCategory(task.category)
    setEditTaskPriority(task.priority)
    setShowEditTaskModal(true)
  }

  const handleSaveEditTask = async () => {
    if (!editingTaskId) return

    try {
      const updatedTask = await updateTask(editingTaskId, {
        text: editTaskText,
        description: editTaskDescription || null,
        time: editTaskTime || null,
        category: editTaskCategory,
        priority: editTaskPriority,
      })

      setTasks((prev) => prev.map((t) => (t.id === editingTaskId ? updatedTask : t)))
      setShowEditTaskModal(false)
      setEditingTaskId(null)
    } catch (error) {
      console.error("Error updating task:", error)
      alert("Error al actualizar tarea. Intenta de nuevo.")
    }
  }

  // Wishlist handlers
  const handleAddWishlistItem = async (text: string, description: string) => {
    if (!user) return

    try {
      const newItem = await createWishlistItem({
        user_id: user.id,
        text,
        description: description || undefined,
        completed: false,
      })

      setWishlistItems((prev) => [...prev, newItem])
    } catch (error) {
      console.error("Error adding wishlist item:", error)
      alert("Error al agregar objetivo. Intenta de nuevo.")
    }
  }

  const handleToggleWishlistItem = async (itemId: string) => {
    try {
      const item = wishlistItems.find((i) => i.id === itemId)
      if (!item) return

      const updatedItem = await updateWishlistItem(itemId, {
        completed: !item.completed,
      })

      setWishlistItems((prev) => prev.map((i) => (i.id === itemId ? updatedItem : i)))
    } catch (error) {
      console.error("Error toggling wishlist item:", error)
      alert("Error al actualizar objetivo. Intenta de nuevo.")
    }
  }

  const handleUpdateWishlistItem = async (itemId: string, text: string, description: string) => {
    try {
      const updatedItem = await updateWishlistItem(itemId, {
        text,
        description: description || undefined,
      })

      setWishlistItems((prev) => prev.map((i) => (i.id === itemId ? updatedItem : i)))
    } catch (error) {
      console.error("Error updating wishlist item:", error)
      alert("Error al actualizar objetivo. Intenta de nuevo.")
    }
  }

  const handleDeleteWishlistItem = async (itemId: string) => {
    try {
      await deleteWishlistItem(itemId)
      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error("Error deleting wishlist item:", error)
      alert("Error al eliminar objetivo. Intenta de nuevo.")
    }
  }

  // Notes handlers
  const handleAddNote = async (title: string, content: string) => {
    if (!user) return

    try {
      const newNote = await createNote({
        user_id: user.id,
        title,
        content,
      })

      setNotes((prev) => [...prev, newNote])
    } catch (error) {
      console.error("Error adding note:", error)
      alert("Error al agregar nota. Intenta de nuevo.")
    }
  }

  const handleUpdateNote = async (noteId: string, title: string, content: string) => {
    try {
      const updatedNote = await updateNote(noteId, {
        title,
        content,
      })

      setNotes((prev) => prev.map((n) => (n.id === noteId ? updatedNote : n)))
    } catch (error) {
      console.error("Error updating note:", error)
      alert("Error al actualizar nota. Intenta de nuevo.")
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId)
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
    } catch (error) {
      console.error("Error deleting note:", error)
      alert("Error al eliminar nota. Intenta de nuevo.")
    }
  }

  const handleUpdateUser = async (updates: Partial<User>) => {
    if (!user) return

    try {
      const updatedUser = await updateUser(user.id, updates)
      setUser(updatedUser)
      setLanguage(updatedUser.language)

      const savedSession = safeLocalStorage.getItem("futureTask_user_session")
      if (savedSession) {
        const sessionData = JSON.parse(savedSession)
        saveUserSession(updatedUser, sessionData.password)
      }

      alert(t("settingsSaved"))
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Error al actualizar configuración. Intenta de nuevo.")
    }
  }

  // AI Assistant handlers
  const handleAIRequest = async (request: string) => {
    if (!user?.is_pro) return

    // Simular respuesta de IA y crear plan automáticamente
    const aiResponse = await simulateAIResponse(request)

    // Crear tareas, wishlist items, etc. basado en la respuesta de IA
    if (aiResponse.tasks) {
      for (const task of aiResponse.tasks) {
        await handleAddTask(task)
      }
    }

    if (aiResponse.wishlistItems) {
      for (const item of aiResponse.wishlistItems) {
        await handleAddWishlistItem(item.text, item.description)
      }
    }

    if (aiResponse.notes) {
      for (const note of aiResponse.notes) {
        await handleAddNote(note.title, note.content)
      }
    }

    return aiResponse
  }

  // Simular respuesta de IA
  const simulateAIResponse = async (request: string) => {
    // Simular delay de IA
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const lowerRequest = request.toLowerCase()

    if (lowerRequest.includes("inglés") || lowerRequest.includes("english")) {
      return {
        response:
          "¡Perfecto! He creado un plan completo para aprender inglés. Incluye tareas diarias, objetivos semanales y recursos de estudio. Todo está programado en tu calendario con sesiones de Pomodoro optimizadas.",
        tasks: [
          {
            text: "Estudiar vocabulario básico (30 palabras)",
            description: "Usar flashcards o app como Anki",
            time: "09:00",
            category: "learning",
            priority: "high",
          },
          {
            text: "Practicar pronunciación (15 min)",
            description: "Usar apps como Forvo o repetir después de videos",
            time: "10:00",
            category: "learning",
            priority: "medium",
          },
          {
            text: "Ver video en inglés con subtítulos",
            description: "YouTube, Netflix o TED Talks",
            time: "20:00",
            category: "learning",
            priority: "medium",
          },
        ],
        wishlistItems: [
          {
            text: "Alcanzar nivel B1 en inglés",
            description: "Objetivo para los próximos 6 meses",
          },
          {
            text: "Hacer examen TOEFL",
            description: "Certificación oficial de inglés",
          },
          {
            text: "Leer un libro completo en inglés",
            description: "Empezar con libros juveniles",
          },
        ],
        notes: [
          {
            title: "Plan de Estudio de Inglés",
            content:
              "Semana 1-2: Vocabulario básico (500 palabras)\nSemana 3-4: Gramática fundamental\nSemana 5-6: Conversación básica\nSemana 7-8: Comprensión auditiva\n\nRecursos recomendados:\n- Duolingo (15 min/día)\n- BBC Learning English\n- English Grammar in Use\n- Podcasts: ESL Pod, 6 Minute English",
          },
        ],
      }
    }

    if (lowerRequest.includes("ejercicio") || lowerRequest.includes("fitness") || lowerRequest.includes("gym")) {
      return {
        response:
          "¡Excelente! He diseñado un plan de ejercicios personalizado. Incluye rutinas para principiantes, objetivos de fitness y un cronograma semanal con recordatorios.",
        tasks: [
          {
            text: "Rutina de cardio (30 min)",
            description: "Caminar, correr o bicicleta",
            time: "07:00",
            category: "health",
            priority: "high",
          },
          {
            text: "Ejercicios de fuerza (45 min)",
            description: "Pesas o ejercicios corporales",
            time: "18:00",
            category: "health",
            priority: "high",
          },
          {
            text: "Estiramientos y yoga (20 min)",
            description: "Relajación y flexibilidad",
            time: "21:00",
            category: "health",
            priority: "medium",
          },
        ],
        wishlistItems: [
          {
            text: "Perder 5kg en 3 meses",
            description: "Objetivo de peso saludable",
          },
          {
            text: "Correr 5km sin parar",
            description: "Objetivo de resistencia cardiovascular",
          },
          {
            text: "Hacer 50 flexiones seguidas",
            description: "Objetivo de fuerza",
          },
        ],
        notes: [
          {
            title: "Plan de Ejercicios",
            content:
              "Lunes: Cardio + Core\nMartes: Fuerza (tren superior)\nMiércoles: Descanso activo (yoga)\nJueves: Fuerza (tren inferior)\nViernes: Cardio + Flexibilidad\nSábado: Actividad libre\nDomingo: Descanso\n\nTips:\n- Hidratarse bien\n- Dormir 7-8 horas\n- Calentar antes de ejercitarse\n- Progresar gradualmente",
          },
        ],
      }
    }

    // Respuesta genérica
    return {
      response: `He analizado tu solicitud: "${request}". He creado un plan personalizado con tareas, objetivos y notas para ayudarte a alcanzar tu meta. Todo está organizado en tu calendario con recordatorios y sesiones de Pomodoro optimizadas.`,
      tasks: [
        {
          text: `Investigar sobre: ${request}`,
          description: "Buscar información y recursos relevantes",
          time: "10:00",
          category: "learning",
          priority: "medium",
        },
        {
          text: `Planificar estrategia para: ${request}`,
          description: "Definir pasos específicos y cronograma",
          time: "15:00",
          category: "personal",
          priority: "high",
        },
      ],
      wishlistItems: [
        {
          text: `Dominar: ${request}`,
          description: "Objetivo principal a largo plazo",
        },
      ],
      notes: [
        {
          title: `Plan para: ${request}`,
          content: `Objetivo: ${request}\n\nPasos sugeridos:\n1. Investigación inicial\n2. Definir metas específicas\n3. Crear cronograma\n4. Buscar recursos\n5. Comenzar práctica\n6. Evaluar progreso\n\nRecursos a explorar:\n- Libros especializados\n- Cursos online\n- Comunidades y foros\n- Mentores o expertos`,
        },
      ],
    }
  }

  const logout = () => {
    setUser(null)
    setTasks([])
    setWishlistItems([])
    setNotes([])
    setCurrentScreen("welcome")
    safeLocalStorage.removeItem("futureTask_user")
    safeLocalStorage.removeItem("futureTask_user_session")
  }

  const getCurrentTheme = () => {
    if (!user) return THEMES.free.default

    const allThemes = { ...THEMES.free, ...THEMES.premium }
    return allThemes[user.theme as keyof typeof allThemes] || THEMES.free.default
  }

  // Loading state
  if (!isInitialized || isLoading) {
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
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
                className={`w-full ${getCurrentTheme().buttonSecondary} flex items-center justify-center space-x-2`}
              >
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs">G</span>
                </div>
                <span>{t("loginWithGoogle")}</span>
              </Button>

              <Button
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading}
                className={`w-full ${getCurrentTheme().buttonSecondary} flex items-center justify-center space-x-2`}
              >
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">⚡</span>
                </div>
                <span>{t("loginWithGitHub")}</span>
              </Button>

              <Button
                onClick={() => handleSocialLogin("apple")}
                disabled={isLoading}
                className={`w-full ${getCurrentTheme().buttonSecondary} flex items-center justify-center space-x-2`}
              >
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🍎</span>
                </div>
                <span>{t("loginWithApple")}</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className={`w-full border-t ${getCurrentTheme().border}`} />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`bg-transparent px-2 ${getCurrentTheme().textMuted}`}>{t("orContinueWith")}</span>
              </div>
            </div>

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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${getCurrentTheme().inputBg} pr-10`}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent ${getCurrentTheme().textMuted}`}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {authMode === "login" && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={handleForgotPassword}
                  className={`text-sm ${getCurrentTheme().textAccent} hover:underline`}
                >
                  {t("forgotPassword")}
                </Button>
              </div>
            )}

            <Button onClick={handleAuth} disabled={isLoading} className={`w-full ${getCurrentTheme().buttonPrimary}`}>
              {isLoading ? "Cargando..." : authMode === "login" ? t("login") : t("register")}
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

  // Premium Screen - ACTUALIZADA CON PLAN PRO
  if (currentScreen === "premium") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().gradient} flex items-center justify-center p-4`}
      >
        <Card className={`w-full max-w-6xl ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {t("choosePlan")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Plan Gratuito */}
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
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>
                        Pomodoro clásico 25/5
                      </span>
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
                      <span className={`text-sm md:text-base ${getCurrentTheme().textMuted}`}>Asistente IA</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePremiumChoice("free")}
                    disabled={isLoading}
                    className={`w-full ${getCurrentTheme().buttonSecondary}`}
                  >
                    {isLoading ? "Cargando..." : t("continueFreee")}
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Premium */}
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
                        Pomodoro personalizable
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>
                        Todos los temas premium
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <X className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textMuted}`}>Asistente IA</span>
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
                    onClick={() => handlePremiumChoice("premium")}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm md:text-lg py-2 md:py-3"
                  >
                    <Crown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {isLoading ? "Cargando..." : `${t("startPremium")} - ${t("monthlyPrice")}`}
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Pro */}
              <Card
                className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border} relative ring-2 ring-purple-500/50`}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    RECOMENDADO
                  </span>
                </div>
                <CardHeader>
                  <CardTitle
                    className={`text-lg md:text-xl ${getCurrentTheme().textPrimary} flex items-center space-x-2`}
                  >
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                    <span>{t("pro")}</span>
                  </CardTitle>
                  <div className={`text-2xl md:text-3xl font-bold ${getCurrentTheme().textPrimary}`}>
                    {t("proMonthlyPrice")}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>Todo de Premium +</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>
                        {t("aiPoweredPlanning")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Bot className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>
                        {t("smartGoalSetting")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Target className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>
                        {t("autoTaskCreation")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>
                        {t("personalizedScheduling")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                      <span className={`text-sm md:text-base ${getCurrentTheme().textPrimary}`}>
                        {t("unlimitedAIRequests")}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePremiumChoice("pro")}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm md:text-lg py-2 md:py-3 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {isLoading ? "Cargando..." : `${t("startPro")} - ${t("proMonthlyPrice")}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main App Screen
  if (currentScreen === "app") {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().gradient}`}>
        {/* Notification Service */}
        <NotificationService tasks={tasks} user={user} t={t} />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          user={user!}
          onUpdateUser={handleUpdateUser}
          theme={getCurrentTheme()}
          t={t}
        />

        {/* Premium Modal - NUEVA FUNCIONALIDAD */}
        {showPremiumModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className={`w-full max-w-4xl ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {user?.is_premium ? "Actualizar a Pro" : "Actualizar Plan"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {!user?.is_premium && (
                    <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      <CardHeader>
                        <CardTitle className={`${getCurrentTheme().textPrimary} flex items-center space-x-2`}>
                          <Crown className="w-5 h-5 text-yellow-400" />
                          <span>{t("premium")}</span>
                        </CardTitle>
                        <div className={`text-2xl font-bold ${getCurrentTheme().textPrimary}`}>{t("monthlyPrice")}</div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className={`text-sm ${getCurrentTheme().textPrimary}`}>Tareas ilimitadas</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className={`text-sm ${getCurrentTheme().textPrimary}`}>Lista de deseos</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className={`text-sm ${getCurrentTheme().textPrimary}`}>Notas ilimitadas</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className={`text-sm ${getCurrentTheme().textPrimary}`}>Temas premium</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            handlePremiumChoice("premium")
                            setShowPremiumModal(false)
                          }}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          {isLoading ? "Cargando..." : `${t("startPremium")} - ${t("monthlyPrice")}`}
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border} ring-2 ring-purple-500/50`}>
                    <CardHeader>
                      <CardTitle className={`${getCurrentTheme().textPrimary} flex items-center space-x-2`}>
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <span>{t("pro")}</span>
                      </CardTitle>
                      <div className={`text-2xl font-bold ${getCurrentTheme().textPrimary}`}>
                        {t("proMonthlyPrice")}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className={`text-sm ${getCurrentTheme().textPrimary}`}>Todo de Premium +</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span className={`text-sm ${getCurrentTheme().textPrimary}`}>{t("aiPoweredPlanning")}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Bot className="w-4 h-4 text-purple-400" />
                          <span className={`text-sm ${getCurrentTheme().textPrimary}`}>{t("smartGoalSetting")}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Target className="w-4 h-4 text-purple-400" />
                          <span className={`text-sm ${getCurrentTheme().textPrimary}`}>{t("autoTaskCreation")}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Star className="w-4 h-4 text-purple-400" />
                          <span className={`text-sm ${getCurrentTheme().textPrimary}`}>{t("unlimitedAIRequests")}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          handlePremiumChoice("pro")
                          setShowPremiumModal(false)
                        }}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isLoading ? "Cargando..." : `${t("startPro")} - ${t("proMonthlyPrice")}`}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-center mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setShowPremiumModal(false)}
                    className={getCurrentTheme().textSecondary}
                  >
                    Cerrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Task Modal */}
        {showEditTaskModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className={`w-full max-w-md ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
              <CardHeader>
                <CardTitle className={getCurrentTheme().textPrimary}>{t("editTask")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className={getCurrentTheme().textSecondary}>Tarea</Label>
                  <Input
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    className={getCurrentTheme().inputBg}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={getCurrentTheme().textSecondary}>Descripción</Label>
                  <Input
                    value={editTaskDescription}
                    onChange={(e) => setEditTaskDescription(e.target.value)}
                    className={getCurrentTheme().inputBg}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={getCurrentTheme().textSecondary}>Hora</Label>
                  <Input
                    type="time"
                    value={editTaskTime}
                    onChange={(e) => setEditTaskTime(e.target.value)}
                    className={getCurrentTheme().inputBg}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className={getCurrentTheme().textSecondary}>Categoría</Label>
                    <Select value={editTaskCategory} onValueChange={(value) => setEditTaskCategory(value as any)}>
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
                  </div>
                  <div className="space-y-2">
                    <Label className={getCurrentTheme().textSecondary}>Prioridad</Label>
                    <Select value={editTaskPriority} onValueChange={(value) => setEditTaskPriority(value as any)}>
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
                </div>
              </CardContent>
              <div className="flex justify-end space-x-2 p-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowEditTaskModal(false)}
                  className={getCurrentTheme().textSecondary}
                >
                  {t("cancel")}
                </Button>
                <Button onClick={handleSaveEditTask} className={getCurrentTheme().buttonPrimary}>
                  {t("saveChanges")}
                </Button>
              </div>
            </Card>
          </div>
        )}

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
                    {user?.name} {user?.is_pro && <Sparkles className="inline w-3 h-3 text-purple-400 ml-1" />}
                    {user?.is_premium && !user?.is_pro && <Crown className="inline w-3 h-3 text-yellow-400 ml-1" />}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {!user?.is_pro && !user?.is_premium && (
                    <Button
                      size="sm"
                      onClick={() => setShowPremiumModal(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Pro
                    </Button>
                  )}
                  {!user?.is_pro && user?.is_premium && (
                    <Button
                      size="sm"
                      onClick={() => setShowPremiumModal(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Upgrade Pro
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettingsModal(true)}
                    className={getCurrentTheme().textSecondary}
                  >
                    ⚙️
                  </Button>
                  <Button variant="ghost" size="sm" onClick={logout} className={getCurrentTheme().textSecondary}>
                    🚪
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <div className="sticky top-16 z-30 bg-black/20 backdrop-blur-xl border-b border-purple-500/20">
                <TabsList
                  className={`grid w-full ${user?.is_pro ? "grid-cols-5" : user?.is_premium ? "grid-cols-4" : "grid-cols-2"} h-12 bg-transparent`}
                >
                  <TabsTrigger value="tasksAndCalendar" className="text-xs">
                    📅 {t("tasksAndCalendar")}
                  </TabsTrigger>
                  <TabsTrigger value="pomodoro" className="text-xs">
                    🍅 {t("pomodoro")}
                  </TabsTrigger>
                  {user?.is_premium && (
                    <TabsTrigger value="wishlist" className="text-xs">
                      ⭐ {t("wishlist")}
                    </TabsTrigger>
                  )}
                  {user?.is_premium && (
                    <TabsTrigger value="notes" className="text-xs">
                      📝 {t("notes")}
                    </TabsTrigger>
                  )}
                  {user?.is_pro && (
                    <TabsTrigger value="ai" className="text-xs">
                      🤖 {t("aiAssistant")}
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              {/* Mobile Content */}
              <div className="p-4 pb-20">
                <TabsContent value="tasksAndCalendar">
                  <div className="space-y-4">
                    {/* Quick Stats */}
                    <StatsCards
                      completedTasks={getCompletedTasks().length}
                      totalTasks={getTodayTasks().length}
                      progress={getTodayProgress()}
                      streak={3}
                      theme={getCurrentTheme()}
                      t={t}
                      isMobile
                    />

                    {/* Calendar Widget */}
                    <CalendarWidget
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      theme={getCurrentTheme()}
                      t={t}
                    />

                    {/* Task Form */}
                    <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      <CardHeader>
                        <CardTitle className={`${getCurrentTheme().textPrimary} text-lg`}>
                          {t("addTaskForDate")} - {selectedDate.toLocaleDateString()}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <TaskForm onAddTask={handleAddTask} theme={getCurrentTheme()} t={t} />
                      </CardContent>
                    </Card>

                    {/* Tasks List for Selected Date */}
                    <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      <CardHeader>
                        <CardTitle className={`${getCurrentTheme().textPrimary} text-lg`}>
                          {t("tasksForDate")} {selectedDate.toLocaleDateString()}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {getTodayTasks()
                            .sort((a, b) => {
                              if (a.time && b.time) {
                                return a.time.localeCompare(b.time)
                              }
                              if (a.time && !b.time) return -1
                              if (!a.time && b.time) return 1
                              return 0
                            })
                            .map((task) => (
                              <div
                                key={task.id}
                                className={`p-3 rounded-lg border ${getCurrentTheme().border} ${task.completed ? "opacity-60" : ""}`}
                              >
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
                                      {task.description && (
                                        <p className={`text-xs ${getCurrentTheme().textMuted} mt-1`}>
                                          {task.description}
                                        </p>
                                      )}
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
                                      onClick={() => handleEditTask(task)}
                                      className={getCurrentTheme().textSecondary}
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteTaskHandler(task.id)}
                                      className="text-red-400"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}

                          {getTodayTasks().length === 0 && (
                            <div className="text-center py-8">
                              <Target className={`w-12 h-12 mx-auto mb-4 ${getCurrentTheme().textMuted}`} />
                              <p className={getCurrentTheme().textPrimary}>{t("noTasksForDate")}</p>
                              <p className={getCurrentTheme().textSecondary}>{t("addTaskForDate")}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="pomodoro">
                  <div className="space-y-4">
                    <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                      <CardHeader>
                        <CardTitle className={getCurrentTheme().textPrimary}>🍅 {t("pomodoro")}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center space-y-6">
                        <div>
                          <div className={`text-6xl font-bold ${getCurrentTheme().textPrimary} mb-2`}>
                            {formatTime(pomodoroTime)}
                          </div>
                          <p className={getCurrentTheme().textSecondary}>{getCurrentPomodoroLabel()}</p>
                          <p className={`text-xs ${getCurrentTheme().textMuted} mt-1`}>
                            Sesión {pomodoroSessions + 1} •{" "}
                            {(user?.sessions_until_long_break || 4) -
                              (pomodoroSessions % (user?.sessions_until_long_break || 4))}{" "}
                            hasta descanso largo
                          </p>
                        </div>
                        <div className="flex justify-center space-x-4">
                          <Button
                            onClick={() => setPomodoroActive(!pomodoroActive)}
                            className={getCurrentTheme().buttonPrimary}
                          >
                            {pomodoroActive ? t("pause") : t("start")}
                          </Button>
                          <Button
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
                </TabsContent>

                <TabsContent value="wishlist">
                  <div className="space-y-4">
                    <WishlistManager
                      items={wishlistItems}
                      onAddItem={handleAddWishlistItem}
                      onToggleItem={handleToggleWishlistItem}
                      onUpdateItem={handleUpdateWishlistItem}
                      onDeleteItem={handleDeleteWishlistItem}
                      theme={getCurrentTheme()}
                      t={t}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="notes">
                  <div className="space-y-4">
                    <NotesManager
                      notes={notes}
                      onAddNote={handleAddNote}
                      onUpdateNote={handleUpdateNote}
                      onDeleteNote={handleDeleteNote}
                      theme={getCurrentTheme()}
                      t={t}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="ai">
                  <div className="space-y-4">
                    <AIAssistant onAIRequest={handleAIRequest} theme={getCurrentTheme()} t={t} user={user!} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
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
                  Hola, {user?.name} {user?.is_pro && <Sparkles className="inline w-4 h-4 text-purple-400 ml-1" />}
                  {user?.is_premium && !user?.is_pro && <Crown className="inline w-4 h-4 text-yellow-400 ml-1" />}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {!user?.is_pro && !user?.is_premium && (
                  <Button
                    onClick={() => setShowPremiumModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t("upgradeToProButton")}
                  </Button>
                )}
                {!user?.is_pro && user?.is_premium && (
                  <Button
                    onClick={() => setShowPremiumModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade a Pro
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => setShowSettingsModal(true)}
                  className={getCurrentTheme().textSecondary}
                >
                  {t("settings")}
                </Button>
                <Button variant="ghost" onClick={logout} className={getCurrentTheme().textSecondary}>
                  {t("logout")}
                </Button>
              </div>
            </div>

            {/* Desktop Stats */}
            <StatsCards
              completedTasks={getCompletedTasks().length}
              totalTasks={getTodayTasks().length}
              progress={getTodayProgress()}
              streak={3}
              theme={getCurrentTheme()}
              t={t}
            />

            {/* Desktop Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Tasks (3/4 width) */}
              <div className="lg:col-span-3 space-y-6">
                {/* Task Form */}
                <Card className={`${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                  <CardHeader>
                    <CardTitle className={getCurrentTheme().textPrimary}>{t("addTask")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TaskForm onAddTask={handleAddTask} theme={getCurrentTheme()} t={t} />
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
                      {getTodayTasks()
                        .sort((a, b) => {
                          if (a.time && b.time) {
                            return a.time.localeCompare(b.time)
                          }
                          if (a.time && !b.time) return -1
                          if (!a.time && b.time) return 1
                          return 0
                        })
                        .map((task) => (
                          <div
                            key={task.id}
                            className={`p-3 rounded-lg border ${getCurrentTheme().border} ${task.completed ? "opacity-60" : ""}`}
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
                                  {task.description && (
                                    <p className={`text-sm ${getCurrentTheme().textMuted}`}>{task.description}</p>
                                  )}
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
                                  onClick={() => handleEditTask(task)}
                                  className={getCurrentTheme().textSecondary}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
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

                      {getTodayTasks().length === 0 && (
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
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
                  <TabsList
                    className={`grid w-full ${user?.is_pro ? "grid-cols-5" : user?.is_premium ? "grid-cols-4" : "grid-cols-2"}`}
                  >
                    <TabsTrigger value="tasksAndCalendar">📅</TabsTrigger>
                    <TabsTrigger value="pomodoro">🍅</TabsTrigger>
                    {user?.is_premium && <TabsTrigger value="wishlist">⭐</TabsTrigger>}
                    {user?.is_premium && <TabsTrigger value="notes">📝</TabsTrigger>}
                    {user?.is_pro && <TabsTrigger value="ai">🤖</TabsTrigger>}
                  </TabsList>

                  <TabsContent value="tasksAndCalendar" className="mt-4">
                    <CalendarWidget
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      theme={getCurrentTheme()}
                      t={t}
                    />
                  </TabsContent>

                  <TabsContent value="pomodoro" className="mt-4">
                    <Card className={`${getCurrentTheme().cardBg} backdrop-blur-xl ${getCurrentTheme().border}`}>
                      <CardHeader>
                        <CardTitle className={getCurrentTheme().textPrimary}>🍅 {t("pomodoro")}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <div>
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
                              width: `${((getTotalDuration() - pomodoroTime) / getTotalDuration()) * 100}%`,
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
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {user?.is_premium && (
                    <TabsContent value="wishlist" className="mt-4">
                      <WishlistManager
                        items={wishlistItems}
                        onAddItem={handleAddWishlistItem}
                        onToggleItem={handleToggleWishlistItem}
                        onUpdateItem={handleUpdateWishlistItem}
                        onDeleteItem={handleDeleteWishlistItem}
                        theme={getCurrentTheme()}
                        t={t}
                      />
                    </TabsContent>
                  )}

                  {user?.is_premium && (
                    <TabsContent value="notes" className="mt-4">
                      <NotesManager
                        notes={notes}
                        onAddNote={handleAddNote}
                        onUpdateNote={handleUpdateNote}
                        onDeleteNote={handleDeleteNote}
                        theme={getCurrentTheme()}
                        t={t}
                      />
                    </TabsContent>
                  )}

                  {user?.is_pro && (
                    <TabsContent value="ai" className="mt-4">
                      <AIAssistant onAIRequest={handleAIRequest} theme={getCurrentTheme()} t={t} user={user!} />
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            </div>
          </div>
        )}

        {/* Database Status in Desktop Footer */}
        {!isMobile && (
          <div className="fixed bottom-4 right-4 z-40">
            <DatabaseStatus className="w-80" />
          </div>
        )}
      </div>
    )
  }

  return null // This should never be reached
}
