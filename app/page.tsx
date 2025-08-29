"use client"

import type React from "react"

import { useState, useEffect, createContext } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Trophy,
  CalendarIcon,
  CheckCircle,
  Star,
  Target,
  Award,
  Zap,
  Settings,
  Download,
  Flame,
  CalendarDays,
  Clock,
  Sparkles,
  Crown,
  Rocket,
  Circle,
  ArrowUp,
  ChevronRight,
  Check,
  X,
  Gem,
  ArrowRight,
  Heart,
  StickyNote,
  Timer,
  BookTemplate as FileTemplate,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Edit,
} from "lucide-react"

// Language Context
const LanguageContext = createContext<{
  language: "es" | "en" | "de" | "fr" | "it"
  setLanguage: (lang: "es" | "en" | "de" | "fr" | "it") => void
  t: (key: string) => string
}>({
  language: "es",
  setLanguage: () => {},
  t: () => "",
})

const translations = {
  es: {
    // App Name
    appName: "FutureTask",
    appDescription: "Tu calendario inteligente del futuro",

    // Welcome
    welcomeTitle: "¡Bienvenido a FutureTask!",
    welcomeDesc: "Tu calendario inteligente del futuro te ayudará a ser más productivo que nunca.",
    organizeTasks: "Organiza tus tareas",
    organizeDesc: "Crea tareas con categorías, prioridades y descripciones detalladas.",
    unlockAchievements: "Desbloquea logros",
    achievementsDesc: "Completa desafíos y gana insignias épicas mientras mejoras tu productividad.",
    maintainStreaks: "Mantén rachas",
    streaksDesc: "Construye hábitos duraderos completando tareas día tras día.",

    // Auth
    login: "Iniciar Sesión",
    register: "Registrarse",
    email: "Email",
    password: "Contraseña",
    name: "Nombre",

    // Premium
    choosePlan: "Elige tu plan",
    unlockPotential: "Desbloquea todo el potencial de FutureTask",
    free: "Gratuito",
    premium: "Premium",
    recommended: "Recomendado",
    continueFreee: "Continuar gratis",
    startPremium: "Comenzar Premium",
    monthly: "Mensual",
    yearly: "Anual",
    monthlyPrice: "€1.99",
    yearlyPrice: "€20",
    yearlyDiscount: "(ahorra 17%)",

    // Navigation
    calendar: "Calendario",
    tasks: "Tareas",
    wishlist: "Lista de Deseos",
    notes: "Notas",
    pomodoro: "Pomodoro",
    templates: "Plantillas",

    // Tasks
    newTask: "Nueva tarea...",
    description: "Descripción (opcional)...",
    completedToday: "Completadas Hoy",
    totalToday: "Total Hoy",
    streak: "Racha",
    achievements: "Logros",
    progressToday: "Progreso Hoy",
    editTask: "Editar Tarea",
    saveTask: "Guardar",
    cancelEdit: "Cancelar",

    // Categories
    work: "Trabajo",
    personal: "Personal",
    health: "Salud",
    learning: "Aprendizaje",
    other: "Otros",

    // Priority
    high: "Alta",
    medium: "Media",
    low: "Baja",

    // Profile
    profile: "Perfil",
    updateProfile: "Actualizar Perfil",
    export: "Exportar",
    logout: "Cerrar Sesión",
    theme: "Tema",
    language: "Idioma",

    // Wishlist
    newWish: "Nuevo deseo...",
    wishDescription: "¿Por qué es importante?",
    addWish: "Añadir Deseo",

    // Notes
    newNote: "Nueva nota...",
    noteContent: "Contenido de la nota...",
    addNote: "Añadir Nota",

    // Pomodoro
    workSession: "Sesión de Trabajo",
    shortBreak: "Descanso Corto",
    longBreak: "Descanso Largo",
    start: "Iniciar",
    pause: "Pausar",
    reset: "Reiniciar",
    sessionsUsed: "Sesiones usadas",

    // Templates
    createTemplate: "Crear Plantilla",
    templateName: "Nombre de la plantilla...",
    templateTasks: "Tareas (una por línea)...",
    useTemplate: "Usar Plantilla",

    // Themes
    defaultTheme: "Por Defecto",
    oceanTheme: "Océano",
    forestTheme: "Bosque",
    sunsetTheme: "Atardecer",
    galaxyTheme: "Galaxia",
    cyberpunkTheme: "Cyberpunk",
    royalTheme: "Real",
    neonTheme: "Neón",
  },
  en: {
    // App Name
    appName: "FutureTask",
    appDescription: "Your intelligent calendar of the future",

    // Welcome
    welcomeTitle: "Welcome to FutureTask!",
    welcomeDesc: "Your intelligent calendar of the future will help you be more productive than ever.",
    organizeTasks: "Organize your tasks",
    organizeDesc: "Create tasks with categories, priorities and detailed descriptions.",
    unlockAchievements: "Unlock achievements",
    achievementsDesc: "Complete challenges and earn epic badges while improving your productivity.",
    maintainStreaks: "Maintain streaks",
    streaksDesc: "Build lasting habits by completing tasks day after day.",

    // Auth
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    name: "Name",

    // Premium
    choosePlan: "Choose your plan",
    unlockPotential: "Unlock FutureTask's full potential",
    free: "Free",
    premium: "Premium",
    recommended: "Recommended",
    continueFreee: "Continue free",
    startPremium: "Start Premium",
    monthly: "Monthly",
    yearly: "Yearly",
    monthlyPrice: "$1.99",
    yearlyPrice: "$20",
    yearlyDiscount: "(save 17%)",

    // Navigation
    calendar: "Calendar",
    tasks: "Tasks",
    wishlist: "Wishlist",
    notes: "Notes",
    pomodoro: "Pomodoro",
    templates: "Templates",

    // Tasks
    newTask: "New task...",
    description: "Description (optional)...",
    completedToday: "Completed Today",
    totalToday: "Total Today",
    streak: "Streak",
    achievements: "Achievements",
    progressToday: "Progress Today",
    editTask: "Edit Task",
    saveTask: "Save",
    cancelEdit: "Cancel",

    // Categories
    work: "Work",
    personal: "Personal",
    health: "Health",
    learning: "Learning",
    other: "Other",

    // Priority
    high: "High",
    medium: "Medium",
    low: "Low",

    // Profile
    profile: "Profile",
    updateProfile: "Update Profile",
    export: "Export",
    logout: "Logout",
    theme: "Theme",
    language: "Language",

    // Wishlist
    newWish: "New wish...",
    wishDescription: "Why is it important?",
    addWish: "Add Wish",

    // Notes
    newNote: "New note...",
    noteContent: "Note content...",
    addNote: "Add Note",

    // Pomodoro
    workSession: "Work Session",
    shortBreak: "Short Break",
    longBreak: "Long Break",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    sessionsUsed: "Sessions used",

    // Templates
    createTemplate: "Create Template",
    templateName: "Template name...",
    templateTasks: "Tasks (one per line)...",
    useTemplate: "Use Template",

    // Themes
    defaultTheme: "Default",
    oceanTheme: "Ocean",
    forestTheme: "Forest",
    sunsetTheme: "Sunset",
    galaxyTheme: "Galaxy",
    cyberpunkTheme: "Cyberpunk",
    royalTheme: "Royal",
    neonTheme: "Neon",
  },
  de: {
    // App Name
    appName: "FutureTask",
    appDescription: "Ihr intelligenter Kalender der Zukunft",

    // Welcome
    welcomeTitle: "Willkommen bei FutureTask!",
    welcomeDesc: "Ihr intelligenter Kalender der Zukunft wird Ihnen helfen, produktiver als je zuvor zu sein.",
    organizeTasks: "Organisieren Sie Ihre Aufgaben",
    organizeDesc: "Erstellen Sie Aufgaben mit Kategorien, Prioritäten und detaillierten Beschreibungen.",
    unlockAchievements: "Erfolge freischalten",
    achievementsDesc: "Meistern Sie Herausforderungen und verdienen Sie epische Abzeichen.",
    maintainStreaks: "Serien beibehalten",
    streaksDesc: "Bauen Sie dauerhafte Gewohnheiten auf, indem Sie täglich Aufgaben erledigen.",

    // Auth
    login: "Anmelden",
    register: "Registrieren",
    email: "E-Mail",
    password: "Passwort",
    name: "Name",

    // Premium
    choosePlan: "Wählen Sie Ihren Plan",
    unlockPotential: "Entfesseln Sie das volle Potenzial von FutureTask",
    free: "Kostenlos",
    premium: "Premium",
    recommended: "Empfohlen",
    continueFreee: "Kostenlos fortfahren",
    startPremium: "Premium starten",
    monthly: "Monatlich",
    yearly: "Jährlich",
    monthlyPrice: "€1,99",
    yearlyPrice: "€20",
    yearlyDiscount: "(17% sparen)",

    // Navigation
    calendar: "Kalender",
    tasks: "Aufgaben",
    wishlist: "Wunschliste",
    notes: "Notizen",
    pomodoro: "Pomodoro",
    templates: "Vorlagen",

    // Tasks
    newTask: "Neue Aufgabe...",
    description: "Beschreibung (optional)...",
    completedToday: "Heute erledigt",
    totalToday: "Gesamt heute",
    streak: "Serie",
    achievements: "Erfolge",
    progressToday: "Fortschritt heute",
    editTask: "Aufgabe bearbeiten",
    saveTask: "Speichern",
    cancelEdit: "Abbrechen",

    // Categories
    work: "Arbeit",
    personal: "Persönlich",
    health: "Gesundheit",
    learning: "Lernen",
    other: "Andere",

    // Priority
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig",

    // Profile
    profile: "Profil",
    updateProfile: "Profil aktualisieren",
    export: "Exportieren",
    logout: "Abmelden",
    theme: "Thema",
    language: "Sprache",

    // Wishlist
    newWish: "Neuer Wunsch...",
    wishDescription: "Warum ist es wichtig?",
    addWish: "Wunsch hinzufügen",

    // Notes
    newNote: "Neue Notiz...",
    noteContent: "Notizinhalt...",
    addNote: "Notiz hinzufügen",

    // Pomodoro
    workSession: "Arbeitssitzung",
    shortBreak: "Kurze Pause",
    longBreak: "Lange Pause",
    start: "Starten",
    pause: "Pausieren",
    reset: "Zurücksetzen",
    sessionsUsed: "Sitzungen verwendet",

    // Templates
    createTemplate: "Vorlage erstellen",
    templateName: "Vorlagenname...",
    templateTasks: "Aufgaben (eine pro Zeile)...",
    useTemplate: "Vorlage verwenden",

    // Themes
    defaultTheme: "Standard",
    oceanTheme: "Ozean",
    forestTheme: "Wald",
    sunsetTheme: "Sonnenuntergang",
    galaxyTheme: "Galaxie",
    cyberpunkTheme: "Cyberpunk",
    royalTheme: "Königlich",
    neonTheme: "Neon",
  },
  fr: {
    // App Name
    appName: "FutureTask",
    appDescription: "Votre calendrier intelligent du futur",

    // Welcome
    welcomeTitle: "Bienvenue sur FutureTask !",
    welcomeDesc: "Votre calendrier intelligent du futur vous aidera à être plus productif que jamais.",
    organizeTasks: "Organisez vos tâches",
    organizeDesc: "Créez des tâches avec des catégories, priorités et descriptions détaillées.",
    unlockAchievements: "Débloquez des succès",
    achievementsDesc: "Relevez des défis et gagnez des badges épiques tout en améliorant votre productivité.",
    maintainStreaks: "Maintenez vos séries",
    streaksDesc: "Construisez des habitudes durables en accomplissant des tâches jour après jour.",

    // Auth
    login: "Se connecter",
    register: "S'inscrire",
    email: "E-mail",
    password: "Mot de passe",
    name: "Nom",

    // Premium
    choosePlan: "Choisissez votre plan",
    unlockPotential: "Débloquez tout le potentiel de FutureTask",
    free: "Gratuit",
    premium: "Premium",
    recommended: "Recommandé",
    continueFreee: "Continuer gratuitement",
    startPremium: "Commencer Premium",
    monthly: "Mensuel",
    yearly: "Annuel",
    monthlyPrice: "€1,99",
    yearlyPrice: "€20",
    yearlyDiscount: "(économisez 17%)",

    // Navigation
    calendar: "Calendrier",
    tasks: "Tâches",
    wishlist: "Liste de souhaits",
    notes: "Notes",
    pomodoro: "Pomodoro",
    templates: "Modèles",

    // Tasks
    newTask: "Nouvelle tâche...",
    description: "Description (optionnelle)...",
    completedToday: "Terminées aujourd'hui",
    totalToday: "Total aujourd'hui",
    streak: "Série",
    achievements: "Succès",
    progressToday: "Progrès aujourd'hui",
    editTask: "Modifier la tâche",
    saveTask: "Enregistrer",
    cancelEdit: "Annuler",

    // Categories
    work: "Travail",
    personal: "Personnel",
    health: "Santé",
    learning: "Apprentissage",
    other: "Autre",

    // Priority
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",

    // Profile
    profile: "Profil",
    updateProfile: "Mettre à jour le profil",
    export: "Exporter",
    logout: "Se déconnecter",
    theme: "Thème",
    language: "Langue",

    // Wishlist
    newWish: "Nouveau souhait...",
    wishDescription: "Pourquoi est-ce important ?",
    addWish: "Ajouter un souhait",

    // Notes
    newNote: "Nouvelle note...",
    noteContent: "Contenu de la note...",
    addNote: "Ajouter une note",

    // Pomodoro
    workSession: "Session de travail",
    shortBreak: "Pause courte",
    longBreak: "Pause longue",
    start: "Démarrer",
    pause: "Pause",
    reset: "Réinitialiser",
    sessionsUsed: "Sessions utilisées",

    // Templates
    createTemplate: "Créer un modèle",
    templateName: "Nom du modèle...",
    templateTasks: "Tâches (une par ligne)...",
    useTemplate: "Utiliser le modèle",

    // Themes
    defaultTheme: "Par défaut",
    oceanTheme: "Océan",
    forestTheme: "Forêt",
    sunsetTheme: "Coucher de soleil",
    galaxyTheme: "Galaxie",
    cyberpunkTheme: "Cyberpunk",
    royalTheme: "Royal",
    neonTheme: "Néon",
  },
  it: {
    // App Name
    appName: "FutureTask",
    appDescription: "Il tuo calendario intelligente del futuro",

    // Welcome
    welcomeTitle: "Benvenuto su FutureTask!",
    welcomeDesc: "Il tuo calendario intelligente del futuro ti aiuterà ad essere più produttivo che mai.",
    organizeTasks: "Organizza i tuoi compiti",
    organizeDesc: "Crea compiti con categorie, priorità e descrizioni dettagliate.",
    unlockAchievements: "Sblocca i risultati",
    achievementsDesc: "Completa le sfide e guadagna badge epici mentre migliori la tua produttività.",
    maintainStreaks: "Mantieni le serie",
    streaksDesc: "Costruisci abitudini durature completando compiti giorno dopo giorno.",

    // Auth
    login: "Accedi",
    register: "Registrati",
    email: "Email",
    password: "Password",
    name: "Nome",

    // Premium
    choosePlan: "Scegli il tuo piano",
    unlockPotential: "Sblocca tutto il potenziale di FutureTask",
    free: "Gratuito",
    premium: "Premium",
    recommended: "Consigliato",
    continueFreee: "Continua gratis",
    startPremium: "Inizia Premium",
    monthly: "Mensile",
    yearly: "Annuale",
    monthlyPrice: "€1,99",
    yearlyPrice: "€20",
    yearlyDiscount: "(risparmia 17%)",

    // Navigation
    calendar: "Calendario",
    tasks: "Compiti",
    wishlist: "Lista dei desideri",
    notes: "Note",
    pomodoro: "Pomodoro",
    templates: "Modelli",

    // Tasks
    newTask: "Nuovo compito...",
    description: "Descrizione (opzionale)...",
    completedToday: "Completati oggi",
    totalToday: "Totale oggi",
    streak: "Serie",
    achievements: "Risultati",
    progressToday: "Progresso oggi",
    editTask: "Modifica compito",
    saveTask: "Salva",
    cancelEdit: "Annulla",

    // Categories
    work: "Lavoro",
    personal: "Personale",
    health: "Salute",
    learning: "Apprendimento",
    other: "Altro",

    // Priority
    high: "Alta",
    medium: "Media",
    low: "Bassa",

    // Profile
    profile: "Profilo",
    updateProfile: "Aggiorna profilo",
    export: "Esporta",
    logout: "Disconnetti",
    theme: "Tema",
    language: "Lingua",

    // Wishlist
    newWish: "Nuovo desiderio...",
    wishDescription: "Perché è importante?",
    addWish: "Aggiungi desiderio",

    // Notes
    newNote: "Nuova nota...",
    noteContent: "Contenuto della nota...",
    addNote: "Aggiungi nota",

    // Pomodoro
    workSession: "Sessione di lavoro",
    shortBreak: "Pausa breve",
    longBreak: "Pausa lunga",
    start: "Inizia",
    pause: "Pausa",
    reset: "Reimposta",
    sessionsUsed: "Sessioni utilizzate",

    // Templates
    createTemplate: "Crea modello",
    templateName: "Nome del modello...",
    templateTasks: "Compiti (uno per riga)...",
    useTemplate: "Usa modello",

    // Themes
    defaultTheme: "Predefinito",
    oceanTheme: "Oceano",
    forestTheme: "Foresta",
    sunsetTheme: "Tramonto",
    galaxyTheme: "Galassia",
    cyberpunkTheme: "Cyberpunk",
    royalTheme: "Reale",
    neonTheme: "Neon",
  },
}

interface Task {
  id: string
  text: string
  description?: string
  completed: boolean
  date: string
  category: "work" | "personal" | "health" | "learning" | "other"
  priority: "low" | "medium" | "high"
  completedAt?: string
}

interface Wish {
  id: string
  text: string
  description?: string
  completed: boolean
  createdAt: string
}

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface Template {
  id: string
  name: string
  tasks: string[]
  createdAt: string
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  unlockedAt?: string
  rarity: "common" | "rare" | "epic" | "legendary"
  premium?: boolean
}

interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
  theme: string
  language: "es" | "en" | "de" | "fr" | "it"
  isPremium: boolean
  premiumExpiry?: string
  onboardingCompleted: boolean
  pomodoroSessions: number
}

const DEFAULT_ACHIEVEMENTS = [
  {
    id: "first-task",
    name: "Primer Paso",
    description: "Completa tu primera tarea",
    icon: <Star className="w-5 h-5" />,
    rarity: "common" as const,
  },
  {
    id: "streak-3",
    name: "Constancia",
    description: "Completa tareas 3 días seguidos",
    icon: <Zap className="w-5 h-5" />,
    rarity: "common" as const,
  },
  {
    id: "streak-7",
    name: "Semana Perfecta",
    description: "Completa tareas 7 días seguidos",
    icon: <CalendarDays className="w-5 h-5" />,
    rarity: "rare" as const,
  },
  {
    id: "streak-30",
    name: "Maestro del Tiempo",
    description: "Completa tareas 30 días seguidos",
    icon: <Crown className="w-5 h-5" />,
    rarity: "legendary" as const,
    premium: true,
  },
  {
    id: "task-master",
    name: "Conquistador",
    description: "Completa 50 tareas en total",
    icon: <Target className="w-5 h-5" />,
    rarity: "rare" as const,
  },
  {
    id: "perfectionist",
    name: "Perfeccionista",
    description: "Completa todas las tareas de un día",
    icon: <Award className="w-5 h-5" />,
    rarity: "common" as const,
  },
  {
    id: "productive",
    name: "Súper Productivo",
    description: "Completa 10 tareas en un solo día",
    icon: <Rocket className="w-5 h-5" />,
    rarity: "epic" as const,
    premium: true,
  },
  {
    id: "early-bird",
    name: "Madrugador",
    description: "Completa 5 tareas antes de las 9 AM",
    icon: <Clock className="w-5 h-5" />,
    rarity: "rare" as const,
    premium: true,
  },
  {
    id: "diverse",
    name: "Versátil",
    description: "Completa tareas en todas las categorías",
    icon: <Sparkles className="w-5 h-5" />,
    rarity: "epic" as const,
    premium: true,
  },
  {
    id: "dedicated",
    name: "Dedicado",
    description: "Usa la app durante 14 días diferentes",
    icon: <Flame className="w-5 h-5" />,
    rarity: "rare" as const,
  },
] satisfies Omit<Achievement, "unlocked" | "unlockedAt">[]

const THEMES = {
  // Free themes
  default: {
    name: "defaultTheme",
    premium: false,
    background: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    backgroundLight: "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50",
    card: "bg-black/20 backdrop-blur-xl border-purple-500/20",
    cardLight: "bg-white/90 backdrop-blur-xl border-purple-200/50",
    accent: "from-purple-500 to-cyan-500",
    text: "text-white",
    textLight: "text-gray-900",
    mutedText: "text-gray-300",
    mutedTextLight: "text-gray-600",
  },
  ocean: {
    name: "oceanTheme",
    premium: false,
    background: "bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900",
    backgroundLight: "bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50",
    card: "bg-black/20 backdrop-blur-xl border-blue-500/20",
    cardLight: "bg-white/90 backdrop-blur-xl border-blue-200/50",
    accent: "from-blue-500 to-teal-500",
    text: "text-white",
    textLight: "text-gray-900",
    mutedText: "text-blue-100",
    mutedTextLight: "text-blue-700",
  },
  forest: {
    name: "forestTheme",
    premium: false,
    background: "bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900",
    backgroundLight: "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50",
    card: "bg-black/20 backdrop-blur-xl border-green-500/20",
    cardLight: "bg-white/90 backdrop-blur-xl border-green-200/50",
    accent: "from-green-500 to-emerald-500",
    text: "text-white",
    textLight: "text-gray-900",
    mutedText: "text-green-100",
    mutedTextLight: "text-green-700",
  },
  sunset: {
    name: "sunsetTheme",
    premium: false,
    background: "bg-gradient-to-br from-slate-900 via-orange-900 to-red-900",
    backgroundLight: "bg-gradient-to-br from-orange-50 via-red-50 to-pink-50",
    card: "bg-black/20 backdrop-blur-xl border-orange-500/20",
    cardLight: "bg-white/90 backdrop-blur-xl border-orange-200/50",
    accent: "from-orange-500 to-red-500",
    text: "text-white",
    textLight: "text-gray-900",
    mutedText: "text-orange-100",
    mutedTextLight: "text-orange-700",
  },
  // Premium themes
  galaxy: {
    name: "galaxyTheme",
    premium: true,
    background: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900",
    backgroundLight: "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50",
    card: "bg-black/30 backdrop-blur-xl border-indigo-500/30",
    cardLight: "bg-white/95 backdrop-blur-xl border-indigo-200/50",
    accent: "from-indigo-500 to-pink-500",
    text: "text-white",
    textLight: "text-gray-900",
    mutedText: "text-indigo-100",
    mutedTextLight: "text-indigo-700",
  },
  cyberpunk: {
    name: "cyberpunkTheme",
    premium: true,
    background: "bg-gradient-to-br from-black via-cyan-900 to-purple-900",
    backgroundLight: "bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50",
    card: "bg-black/40 backdrop-blur-xl border-cyan-500/30",
    cardLight: "bg-white/95 backdrop-blur-xl border-cyan-200/50",
    accent: "from-cyan-400 to-purple-500",
    text: "text-cyan-100",
    textLight: "text-gray-900",
    mutedText: "text-cyan-200",
    mutedTextLight: "text-cyan-700",
  },
  royal: {
    name: "royalTheme",
    premium: true,
    background: "bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900",
    backgroundLight: "bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50",
    card: "bg-black/30 backdrop-blur-xl border-purple-500/30",
    cardLight: "bg-white/95 backdrop-blur-xl border-purple-200/50",
    accent: "from-purple-600 to-blue-600",
    text: "text-white",
    textLight: "text-gray-900",
    mutedText: "text-purple-100",
    mutedTextLight: "text-purple-700",
  },
  neon: {
    name: "neonTheme",
    premium: true,
    background: "bg-gradient-to-br from-black via-green-900 to-cyan-900",
    backgroundLight: "bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50",
    card: "bg-black/40 backdrop-blur-xl border-green-500/30",
    cardLight: "bg-white/95 backdrop-blur-xl border-green-200/50",
    accent: "from-green-400 to-cyan-400",
    text: "text-green-100",
    textLight: "text-gray-900",
    mutedText: "text-green-200",
    mutedTextLight: "text-green-700",
  },
}

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

const RARITY_COLORS = {
  common: "from-gray-500 to-gray-600",
  rare: "from-blue-500 to-blue-600",
  epic: "from-purple-500 to-purple-600",
  legendary: "from-yellow-500 to-orange-500",
}

export default function FutureTaskApp() {
  const [language, setLanguage] = useState<"es" | "en" | "de" | "fr" | "it">("es")
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [wishes, setWishes] = useState<Wish[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState("tasks")

  // Control de tabs premium
  const handleTabChange = (value: string) => {
    if ((value === "wishlist" || value === "notes") && !user?.isPremium) {
      setShowPremiumModal(true)
      return
    }
    setActiveTab(value)
  }

  // Task states
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState<Task["category"]>("personal")
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("medium")

  // Edit task states
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editTaskText, setEditTaskText] = useState("")
  const [editTaskDescription, setEditTaskDescription] = useState("")
  const [editTaskCategory, setEditTaskCategory] = useState<Task["category"]>("personal")
  const [editTaskPriority, setEditTaskPriority] = useState<Task["priority"]>("medium")

  // Wish states
  const [newWish, setNewWish] = useState("")
  const [newWishDescription, setNewWishDescription] = useState("")

  // Note states
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNote, setEditingNote] = useState<string | null>(null)

  // Template states
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateTasks, setNewTemplateTasks] = useState("")

  // Pomodoro states
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25 minutes
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [pomodoroType, setPomodoroType] = useState<"work" | "shortBreak" | "longBreak">("work")

  const [achievements, setAchievements] = useState<Achievement[]>(
    DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false })),
  )
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [showCompleted, setShowCompleted] = useState(true)

  // App states
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "auth" | "premium" | "app">("welcome")
  const [onboardingStep, setOnboardingStep] = useState(0)

  // Auth states
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  // Profile states
  const [showProfile, setShowProfile] = useState(false)
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Premium modal state
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [premiumPlan, setPremiumPlan] = useState<"monthly" | "yearly">("monthly")

  const t = (key: string) => translations[language][key as keyof (typeof translations)[typeof language]] || key

  // Get current theme
  const currentTheme = THEMES[user?.theme as keyof typeof THEMES] || THEMES.default
  const isLightMode = user?.theme?.includes("light") || false

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1)
      }, 1000)
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false)
      // Increment session count for free users
      if (user && !user.isPremium) {
        const updatedUser = { ...user, pomodoroSessions: user.pomodoroSessions + 1 }
        setUser(updatedUser)
      }
      // Auto switch to break or work
      if (pomodoroType === "work") {
        setPomodoroType("shortBreak")
        setPomodoroTime(5 * 60) // 5 minutes break
      } else {
        setPomodoroType("work")
        setPomodoroTime(25 * 60) // 25 minutes work
      }
    }
    return () => clearInterval(interval)
  }, [pomodoroActive, pomodoroTime, pomodoroType, user])

  useEffect(() => {
    const savedUser = localStorage.getItem("futureTask_user")
    const savedTasks = localStorage.getItem("futureTask_tasks")
    const savedWishes = localStorage.getItem("futureTask_wishes")
    const savedNotes = localStorage.getItem("futureTask_notes")
    const savedTemplates = localStorage.getItem("futureTask_templates")
    const savedAchievements = localStorage.getItem("futureTask_achievements")

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      // Add pomodoroSessions if not present (for backward compatibility)
      if (!parsedUser.pomodoroSessions) {
        parsedUser.pomodoroSessions = 0
      }
      setUser(parsedUser)
      setNewName(parsedUser.name)
      setNewEmail(parsedUser.email)
      setLanguage(parsedUser.language || "es")

      if (parsedUser.onboardingCompleted) {
        setCurrentScreen("app")
      } else {
        setCurrentScreen("welcome")
      }
    }
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedWishes) setWishes(JSON.parse(savedWishes))
    if (savedNotes) setNotes(JSON.parse(savedNotes))
    if (savedTemplates) setTemplates(JSON.parse(savedTemplates))

    if (savedAchievements) {
      const parsed: { id: string; unlocked: boolean; unlockedAt?: string }[] = JSON.parse(savedAchievements)

      setAchievements(
        DEFAULT_ACHIEVEMENTS.map((base) => {
          const saved = parsed.find((s) => s.id === base.id)
          return {
            ...base,
            unlocked: saved?.unlocked ?? false,
            unlockedAt: saved?.unlockedAt,
          }
        }),
      )
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("futureTask_user", JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem("futureTask_tasks", JSON.stringify(tasks))
    checkAchievements()
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("futureTask_wishes", JSON.stringify(wishes))
  }, [wishes])

  useEffect(() => {
    localStorage.setItem("futureTask_notes", JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem("futureTask_templates", JSON.stringify(templates))
  }, [templates])

  useEffect(() => {
    const serializable = achievements.map(({ id, unlocked, unlockedAt }) => ({
      id,
      unlocked,
      unlockedAt,
    }))
    localStorage.setItem("futureTask_achievements", JSON.stringify(serializable))
  }, [achievements])

  const handleAuth = () => {
    if (authMode === "register") {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
        theme: "default",
        language,
        isPremium: false,
        onboardingCompleted: false,
        pomodoroSessions: 0,
      }
      setUser(newUser)
      setCurrentScreen("premium")
    } else {
      // Simple login simulation
      const newUser: User = {
        id: "user1",
        name: email.split("@")[0],
        email,
        password,
        createdAt: new Date().toISOString(),
        theme: "default",
        language,
        isPremium: false,
        onboardingCompleted: true,
        pomodoroSessions: 0,
      }
      setUser(newUser)
      setCurrentScreen("app")
    }
    setEmail("")
    setPassword("")
    setName("")
  }

  const handlePremiumChoice = (isPremium: boolean) => {
    if (!user) return

    const updatedUser = {
      ...user,
      isPremium,
      premiumExpiry: isPremium ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      onboardingCompleted: true,
    }
    setUser(updatedUser)
    setCurrentScreen("app")
  }

  const updateProfile = () => {
    if (!user) return

    if (newPassword && newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    const updatedUser = {
      ...user,
      name: newName,
      email: newEmail,
      language,
      ...(newPassword && { password: newPassword }),
    }

    setUser(updatedUser)
    setNewPassword("")
    setConfirmPassword("")
    setShowProfile(false)
    alert("Perfil actualizado correctamente")
  }

  const changeTheme = (themeName: string) => {
    if (!user) return
    const updatedUser = { ...user, theme: themeName }
    setUser(updatedUser)
  }

  const logout = () => {
    setUser(null)
    setCurrentScreen("welcome")
    localStorage.removeItem("futureTask_user")
  }

  // Task functions
  const addTask = () => {
    if (!newTask.trim()) return

    if (!user?.isPremium && tasks.length >= 10) {
      alert("Los usuarios gratuitos pueden crear máximo 10 tareas. ¡Actualiza a Premium para tareas ilimitadas!")
      return
    }

    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      description: newTaskDescription,
      completed: false,
      date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
      category: newTaskCategory,
      priority: newTaskPriority,
    }

    setTasks([...tasks, task])
    setNewTask("")
    setNewTaskDescription("")
  }

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
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
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  // Edit task functions
  const startEditTask = (task: Task) => {
    setEditingTask(task.id)
    setEditTaskText(task.text)
    setEditTaskDescription(task.description || "")
    setEditTaskCategory(task.category)
    setEditTaskPriority(task.priority)
  }

  const saveEditTask = () => {
    if (!editTaskText.trim() || !editingTask) return

    setTasks(
      tasks.map((task) =>
        task.id === editingTask
          ? {
              ...task,
              text: editTaskText,
              description: editTaskDescription,
              category: editTaskCategory,
              priority: editTaskPriority,
            }
          : task,
      ),
    )

    cancelEditTask()
  }

  const cancelEditTask = () => {
    setEditingTask(null)
    setEditTaskText("")
    setEditTaskDescription("")
    setEditTaskCategory("personal")
    setEditTaskPriority("medium")
  }

  // Wish functions
  const addWish = () => {
    if (!newWish.trim()) return

    const wish: Wish = {
      id: Date.now().toString(),
      text: newWish,
      description: newWishDescription,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setWishes([...wishes, wish])
    setNewWish("")
    setNewWishDescription("")
  }

  const toggleWish = (wishId: string) => {
    setWishes(wishes.map((wish) => (wish.id === wishId ? { ...wish, completed: !wish.completed } : wish)))
  }

  const deleteWish = (wishId: string) => {
    setWishes(wishes.filter((wish) => wish.id !== wishId))
  }

  // Note functions
  const addNote = () => {
    if (!newNoteTitle.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes([...notes, note])
    setNewNoteTitle("")
    setNewNoteContent("")
  }

  const updateNote = (noteId: string, title: string, content: string) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, title, content, updatedAt: new Date().toISOString() } : note,
      ),
    )
    setEditingNote(null)
  }

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
  }

  // Template functions
  const addTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateTasks.trim()) return

    const template: Template = {
      id: Date.now().toString(),
      name: newTemplateName,
      tasks: newTemplateTasks.split("\n").filter((task) => task.trim()),
      createdAt: new Date().toISOString(),
    }

    setTemplates([...templates, template])
    setNewTemplateName("")
    setNewTemplateTasks("")
  }

  const useTemplateHandler = (template: Template) => {
    const newTasks = template.tasks.map((taskText) => ({
      id: Date.now().toString() + Math.random(),
      text: taskText,
      completed: false,
      date: selectedDate.toISOString().split("T")[0],
      category: "personal" as const,
      priority: "medium" as const,
    }))

    setTasks([...tasks, ...newTasks])
    setActiveTab("tasks")
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((template) => template.id !== templateId))
  }

  // Pomodoro functions
  const startPomodoro = () => {
    if (!user?.isPremium && user?.pomodoroSessions >= 10) {
      alert(
        "Los usuarios gratuitos tienen un límite de 10 sesiones de Pomodoro. ¡Actualiza a Premium para sesiones ilimitadas!",
      )
      return
    }
    setPomodoroActive(true)
  }

  const pausePomodoro = () => {
    setPomodoroActive(false)
  }

  const resetPomodoro = () => {
    setPomodoroActive(false)
    if (pomodoroType === "work") {
      setPomodoroTime(25 * 60)
    } else if (pomodoroType === "shortBreak") {
      setPomodoroTime(5 * 60)
    } else {
      setPomodoroTime(15 * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStreak = () => {
    const sortedDates = [...new Set(tasks.filter((t) => t.completed).map((t) => t.date))].sort()
    if (sortedDates.length === 0) return 0

    let streak = 1
    let currentStreak = 1

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1])
      const currentDate = new Date(sortedDates[i])
      const diffTime = currentDate.getTime() - prevDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)

      if (diffDays === 1) {
        currentStreak++
        streak = Math.max(streak, currentStreak)
      } else {
        currentStreak = 1
      }
    }

    return streak
  }

  const getActiveDays = () => {
    return new Set(tasks.map((t) => t.date)).size
  }

  const checkAchievements = () => {
    const completedTasks = tasks.filter((task) => task.completed)
    const totalCompleted = completedTasks.length
    const streak = getStreak()
    const activeDays = getActiveDays()
    const categories = new Set(completedTasks.map((t) => t.category))
    const earlyTasks = completedTasks.filter((t) => {
      if (!t.completedAt) return false
      const hour = new Date(t.completedAt).getHours()
      return hour < 9
    }).length

    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.unlocked) return achievement
        if (achievement.premium && !user?.isPremium) return achievement

        switch (achievement.id) {
          case "first-task":
            if (totalCompleted >= 1) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "streak-3":
            if (streak >= 3) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "streak-7":
            if (streak >= 7) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "streak-30":
            if (streak >= 30) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "task-master":
            if (totalCompleted >= 50) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "perfectionist":
            const todayTasks = tasks.filter(
              (task) =>
                task.date ===
                `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
            )
            if (todayTasks.length > 0 && todayTasks.every((task) => task.completed)) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "productive":
            const tasksByDate = tasks.reduce(
              (acc, task) => {
                if (task.completed) {
                  acc[task.date] = (acc[task.date] || 0) + 1
                }
                return acc
              },
              {} as Record<string, number>,
            )
            if (Object.values(tasksByDate).some((count) => count >= 10)) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "early-bird":
            if (earlyTasks >= 5) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "diverse":
            if (categories.size >= 5) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "dedicated":
            if (activeDays >= 14) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
        }
        return achievement
      }),
    )
  }

  const getTasksForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    let dateTasks = tasks.filter((task) => task.date === dateStr)

    if (filterCategory !== "all") {
      dateTasks = dateTasks.filter((task) => task.category === filterCategory)
    }

    if (!showCompleted) {
      dateTasks = dateTasks.filter((task) => !task.completed)
    }

    return dateTasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const getTodayTasks = () => getTasksForDate(selectedDate)
  const getCompletedTasks = () => getTodayTasks().filter((task) => task.completed)
  const getTodayProgress = () => {
    const todayTasks = getTodayTasks()
    if (todayTasks.length === 0) return 0
    return (getCompletedTasks().length / todayTasks.length) * 100
  }

  const getDateWithTasks = () => {
    const datesWithTasks = new Set(tasks.map((task) => task.date))
    return Array.from(datesWithTasks).map((date) => new Date(date))
  }

  const exportData = () => {
    const data = {
      user,
      tasks,
      wishes,
      notes,
      templates,
      achievements: achievements.filter((a) => a.unlocked),
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `futuretask-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getPriorityIcon = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return <ArrowUp className="w-4 h-4" />
      case "medium":
        return <Circle className="w-4 h-4" />
      case "low":
        return <Circle className="w-4 h-4" />
    }
  }

  const onboardingSteps = [
    {
      title: t("welcomeTitle"),
      description: t("welcomeDesc"),
      icon: <CalendarIcon className="w-16 h-16" />,
    },
    {
      title: t("organizeTasks"),
      description: t("organizeDesc"),
      icon: <Target className="w-16 h-16" />,
    },
    {
      title: t("unlockAchievements"),
      description: t("achievementsDesc"),
      icon: <Trophy className="w-16 h-16" />,
    },
    {
      title: t("maintainStreaks"),
      description: t("streaksDesc"),
      icon: <Flame className="w-16 h-16" />,
    },
  ]

  const themeClasses = isLightMode ? currentTheme.backgroundLight : currentTheme.background
  const cardClasses = isLightMode ? currentTheme.cardLight : currentTheme.card
  const textClasses = isLightMode ? currentTheme.textLight : currentTheme.text
  const mutedTextClasses = isLightMode ? currentTheme.mutedTextLight : currentTheme.mutedText

  const upgradeToPremium = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      isPremium: true,
      premiumExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }
    setUser(updatedUser)
    setShowPremiumModal(false)
    alert("¡Bienvenido a Premium! Ahora tienes acceso a todas las funcionalidades.")
  }

  const toggleLightMode = (themeName: string) => {
    if (!user) return
    const newTheme = themeName.includes("light") ? themeName.replace("light", "") : themeName + "light"
    const updatedUser = { ...user, theme: newTheme }
    setUser(updatedUser)
  }

  // Welcome Screen
  if (currentScreen === "welcome") {
    return (
      <LanguageContext.Provider value={{ language, setLanguage, t }}>
        <div className={`min-h-screen ${themeClasses} flex items-center justify-center p-4`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

          <Card className={`w-full max-w-2xl ${cardClasses} shadow-2xl`}>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-6">
                  <img src="/logo.png" alt="FutureTask" className="w-12 h-12 rounded-full" />
                </div>

                <div className="space-y-4">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {onboardingSteps[onboardingStep].title}
                  </h1>
                  <p className={`text-lg ${mutedTextClasses} max-w-md mx-auto`}>
                    {onboardingSteps[onboardingStep].description}
                  </p>
                </div>

                <div className="flex justify-center space-x-2 py-4">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === onboardingStep
                          ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6">
                  <div className="flex items-center space-x-2">
                    <Select value={language} onValueChange={(value) => setLanguage(value as typeof language)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                        <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setOnboardingStep(Math.max(0, onboardingStep - 1))}
                      disabled={onboardingStep === 0}
                      className={`${isLightMode ? "border-purple-200" : "border-purple-500/30"}`}
                    >
                      Anterior
                    </Button>

                    {onboardingStep < onboardingSteps.length - 1 ? (
                      <Button
                        onClick={() => setOnboardingStep(onboardingStep + 1)}
                        className={`bg-gradient-to-r ${currentTheme.accent} hover:opacity-90`}
                      >
                        Siguiente
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentScreen("auth")}
                        className={`bg-gradient-to-r ${currentTheme.accent} hover:opacity-90`}
                      >
                        Comenzar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </LanguageContext.Provider>
    )
  }

  // Auth Screen
  if (currentScreen === "auth") {
    return (
      <LanguageContext.Provider value={{ language, setLanguage, t }}>
        <div className={`min-h-screen ${themeClasses} flex items-center justify-center p-4`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

          <Card className={`w-full max-w-md ${cardClasses} shadow-2xl`}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <img src="/logo.png" alt="FutureTask" className="w-10 h-10 rounded-full" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {t("appName")}
              </CardTitle>
              <CardDescription className={mutedTextClasses}>{t("appDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "register")}>
                <TabsList className={`grid w-full grid-cols-2 ${isLightMode ? "bg-purple-100" : "bg-purple-900/20"}`}>
                  <TabsTrigger value="login" className="data-[state=active]:bg-purple-500/30">
                    {t("login")}
                  </TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-purple-500/30">
                    {t("register")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className={mutedTextClasses}>
                      {t("email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className={mutedTextClasses}>
                      {t("password")}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button
                    onClick={handleAuth}
                    className={`w-full bg-gradient-to-r ${currentTheme.accent} hover:opacity-90 text-white font-semibold`}
                  >
                    {t("login")}
                  </Button>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className={mutedTextClasses}>
                      {t("name")}
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register" className={mutedTextClasses}>
                      {t("email")}
                    </Label>
                    <Input
                      id="email-register"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register" className={mutedTextClasses}>
                      {t("password")}
                    </Label>
                    <Input
                      id="password-register"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button
                    onClick={handleAuth}
                    className={`w-full bg-gradient-to-r ${currentTheme.accent} hover:opacity-90 text-white font-semibold`}
                  >
                    {t("register")}
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <Button variant="ghost" onClick={() => setCurrentScreen("welcome")} className={mutedTextClasses}>
                  ← Volver al inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </LanguageContext.Provider>
    )
  }

  // Premium Screen
  if (currentScreen === "premium") {
    return (
      <LanguageContext.Provider value={{ language, setLanguage, t }}>
        <div className={`min-h-screen ${themeClasses} flex items-center justify-center p-4`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

          <Card className={`w-full max-w-4xl ${cardClasses} shadow-2xl`}>
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <Gem className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {t("choosePlan")}
              </CardTitle>
              <CardDescription className={`text-lg ${mutedTextClasses}`}>{t("unlockPotential")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <Card
                  className={`${isLightMode ? "bg-gray-50 border-gray-200" : "bg-gray-800/50 border-gray-700"} relative`}
                >
                  <CardHeader>
                    <CardTitle className={`text-xl ${textClasses}`}>{t("free")}</CardTitle>
                    <div className="text-3xl font-bold">
                      <span className={textClasses}>{language === "en" ? "$0" : "€0"}</span>
                      <span className={`text-sm ${mutedTextClasses}`}>/mes</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Hasta 10 tareas</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Logros básicos</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Calendario básico</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Pomodoro (10 sesiones)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Temas básicos</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-red-500" />
                        <span className={mutedTextClasses}>Wishlist</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-red-500" />
                        <span className={mutedTextClasses}>Notas</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-red-500" />
                        <span className={mutedTextClasses}>Plantillas</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-red-500" />
                        <span className={mutedTextClasses}>Temas premium</span>
                      </div>
                    </div>
                    <Button onClick={() => handlePremiumChoice(false)} variant="outline" className="w-full mt-6">
                      {t("continueFreee")}
                    </Button>
                  </CardContent>
                </Card>

                {/* Premium Plan */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/30 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1">
                      {t("recommended")}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className={`text-xl ${textClasses}`}>{t("premium")}</CardTitle>

                    {/* Plan selector */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          variant={premiumPlan === "monthly" ? "default" : "outline"}
                          onClick={() => setPremiumPlan("monthly")}
                          className={premiumPlan === "monthly" ? `bg-gradient-to-r ${currentTheme.accent}` : ""}
                        >
                          {t("monthly")}
                        </Button>
                        <Button
                          variant={premiumPlan === "yearly" ? "default" : "outline"}
                          onClick={() => setPremiumPlan("yearly")}
                          className={premiumPlan === "yearly" ? `bg-gradient-to-r ${currentTheme.accent}` : ""}
                        >
                          {t("yearly")}
                        </Button>
                      </div>

                      <div className="text-center">
                        <div className="text-3xl font-bold">
                          <span className={textClasses}>
                            {premiumPlan === "monthly" ? t("monthlyPrice") : t("yearlyPrice")}
                          </span>
                          <span className={`text-sm ${mutedTextClasses}`}>
                            {premiumPlan === "monthly" ? "/mes" : "/año"}
                          </span>
                        </div>
                        {premiumPlan === "yearly" && (
                          <div className="text-sm text-green-500 font-medium">{t("yearlyDiscount")}</div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Tareas ilimitadas</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Todos los logros</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Wishlist ilimitada</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Notas ilimitadas</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Pomodoro ilimitado</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Plantillas personalizadas</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Todos los temas</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Estadísticas avanzadas</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePremiumChoice(true)}
                      className={`w-full mt-6 bg-gradient-to-r ${currentTheme.accent} hover:opacity-90 text-white`}
                    >
                      {t("startPremium")}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </LanguageContext.Provider>
    )
  }

  // Main App
  if (!user) return null

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={`min-h-screen ${themeClasses} p-4`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${currentTheme.accent} rounded-full flex items-center justify-center`}
              >
                <img src="/logo.png" alt="FutureTask" className="w-8 h-8 rounded-full" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {t("appName")}
                  </h1>
                  {user.isPremium && (
                    <Badge className={`bg-gradient-to-r ${currentTheme.accent} text-white text-xs`}>Premium</Badge>
                  )}
                </div>
                <p className={mutedTextClasses}>Bienvenido, {user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!user.isPremium && (
                <Button
                  onClick={() => setShowPremiumModal(true)}
                  className={`bg-gradient-to-r ${currentTheme.accent} hover:opacity-90 text-white`}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Premium
                </Button>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className={`${isLightMode ? "border-purple-200 text-purple-700" : "border-purple-500/30 text-purple-300"} hover:bg-purple-500/20`}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    {t("achievements")} ({achievements.filter((a) => a.unlocked).length})
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/90 backdrop-blur-xl border-purple-500/30"} ${textClasses} max-w-2xl`}
                >
                  <DialogHeader>
                    <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      Tus {t("achievements")}
                    </DialogTitle>
                    <DialogDescription className={mutedTextClasses}>
                      Desbloquea logros completando tareas
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 mt-4 max-h-96 overflow-y-auto">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                          achievement.unlocked
                            ? `bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]}/20 ${isLightMode ? "border-purple-200" : "border-purple-500/30"}`
                            : `${isLightMode ? "bg-gray-50 border-gray-200" : "bg-gray-800/30 border-gray-700/30"}`
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full ${
                            achievement.unlocked
                              ? `bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]}`
                              : "bg-gray-700"
                          }`}
                        >
                          {achievement.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`font-semibold ${achievement.unlocked ? textClasses : mutedTextClasses}`}>
                              {achievement.name}
                            </span>
                            <Badge
                              className={`text-xs bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]} text-white`}
                            >
                              {achievement.rarity}
                            </Badge>
                            {achievement.premium && (
                              <Badge variant="outline" className="text-xs">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm ${achievement.unlocked ? mutedTextClasses : "text-gray-600"}`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.unlocked && (
                          <Badge className={`bg-gradient-to-r ${currentTheme.accent} text-white`}>Desbloqueado</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showProfile} onOpenChange={setShowProfile}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className={`${isLightMode ? "border-purple-200 text-purple-700" : "border-purple-500/30 text-purple-300"} hover:bg-purple-500/20`}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {t("profile")}
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/90 backdrop-blur-xl border-purple-500/30"} ${textClasses} max-w-4xl max-h-[90vh] overflow-y-auto`}
                >
                  <DialogHeader>
                    <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      Mi {t("profile")}
                    </DialogTitle>
                    <DialogDescription className={mutedTextClasses}>
                      Actualiza tu información personal y gestiona tus plantillas de tareas
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="profile" className="mt-4">
                    <TabsList
                      className={`grid w-full ${user.isPremium ? "grid-cols-2" : "grid-cols-1"} ${isLightMode ? "bg-purple-100" : "bg-purple-900/20"}`}
                    >
                      <TabsTrigger value="profile" className="data-[state=active]:bg-purple-500/30">
                        Perfil
                      </TabsTrigger>
                      {user.isPremium && (
                        <TabsTrigger value="templates" className="data-[state=active]:bg-purple-500/30">
                          <FileTemplate className="w-4 h-4 mr-2" />
                          {t("templates")}
                        </TabsTrigger>
                      )}
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="profile-name" className={mutedTextClasses}>
                          {t("name")}
                        </Label>
                        <Input
                          id="profile-name"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-email" className={mutedTextClasses}>
                          {t("email")}
                        </Label>
                        <Input
                          id="profile-email"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-language" className={mutedTextClasses}>
                          {t("language")}
                        </Label>
                        <Select value={language} onValueChange={(value) => setLanguage(value as typeof language)}>
                          <SelectTrigger
                            className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/90 border-purple-500/30"}`}
                          >
                            <SelectItem value="es">🇪🇸 Español</SelectItem>
                            <SelectItem value="en">🇺🇸 English</SelectItem>
                            <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                            <SelectItem value="fr">🇫🇷 Français</SelectItem>
                            <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-theme" className={mutedTextClasses}>
                          {t("theme")}
                        </Label>
                        <div className="space-y-3">
                          <Select value={user.theme.replace("light", "")} onValueChange={changeTheme}>
                            <SelectTrigger
                              className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                              className={`${isLightMode ? "bg-white border-purple-200" : "bg-gray-800 border-purple-500/30"}`}
                            >
                              {Object.entries(THEMES).map(([key, theme]) => (
                                <SelectItem key={key} value={key} disabled={theme.premium && !user.isPremium}>
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded bg-gradient-to-r ${theme.accent}`} />
                                    <span className={isLightMode ? "text-gray-900" : "text-white"}>
                                      {t(theme.name)}
                                    </span>
                                    {theme.premium && !user.isPremium && <Crown className="w-3 h-3 text-yellow-500" />}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={isLightMode}
                              onCheckedChange={() => toggleLightMode(user.theme)}
                              className="data-[state=checked]:bg-purple-500"
                            />
                            <Label className={`text-sm ${mutedTextClasses}`}>Modo claro</Label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-password" className={mutedTextClasses}>
                          Nueva Contraseña (opcional)
                        </Label>
                        <Input
                          id="profile-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                          placeholder="••••••••"
                        />
                      </div>
                      {newPassword && (
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password" className={mutedTextClasses}>
                            Confirmar Contraseña
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                            placeholder="••••••••"
                          />
                        </div>
                      )}
                      <div className="flex space-x-2 pt-4">
                        <Button
                          onClick={updateProfile}
                          className={`flex-1 bg-gradient-to-r ${currentTheme.accent} hover:opacity-90`}
                        >
                          {t("updateProfile")}
                        </Button>
                        {user.isPremium && (
                          <Button
                            onClick={exportData}
                            variant="outline"
                            className={`${isLightMode ? "border-purple-200 text-purple-700" : "border-purple-500/30 text-purple-300"} hover:bg-purple-500/20`}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {t("export")}
                          </Button>
                        )}
                      </div>
                    </TabsContent>

                    {/* Templates Tab in Profile */}
                    {user.isPremium && (
                      <TabsContent value="templates" className="space-y-4 mt-4">
                        <div>
                          <h3 className={`text-lg font-semibold ${textClasses} mb-4`}>{t("templates")}</h3>

                          {/* Create Template Form */}
                          <div className="space-y-3 mb-6">
                            <Input
                              value={newTemplateName}
                              onChange={(e) => setNewTemplateName(e.target.value)}
                              placeholder={t("templateName")}
                              className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                            />
                            <Textarea
                              value={newTemplateTasks}
                              onChange={(e) => setNewTemplateTasks(e.target.value)}
                              placeholder={t("templateTasks")}
                              className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400 min-h-[100px]`}
                            />
                            <Button
                              onClick={addTemplate}
                              className={`w-full bg-gradient-to-r ${currentTheme.accent} hover:opacity-90`}
                            >
                              <FileTemplate className="w-4 h-4 mr-2" />
                              {t("createTemplate")}
                            </Button>
                          </div>

                          {/* Templates List */}
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {templates.map((template) => {
                              const useTemplateHandler = () => {
                                const newTasks = template.tasks.map((taskText) => ({
                                  id: Date.now().toString() + Math.random(),
                                  text: taskText,
                                  completed: false,
                                  date: selectedDate.toISOString().split("T")[0],
                                  category: "personal" as const,
                                  priority: "medium" as const,
                                }))

                                setTasks((prevTasks) => [...prevTasks, ...newTasks])
                                setActiveTab("tasks")
                              }

                              return (
                                <div
                                  key={template.id}
                                  className={`p-3 rounded-lg border ${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"}`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className={`font-semibold ${textClasses}`}>{template.name}</h4>
                                    <div className="flex space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={useTemplateHandler}
                                        className={`${isLightMode ? "text-green-700" : "text-green-300"} hover:bg-green-500/20`}
                                      >
                                        {t("useTemplate")}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteTemplate(template.id)}
                                        className={`${isLightMode ? "text-red-700" : "text-red-300"} hover:bg-red-500/20`}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    {template.tasks.map((task, index) => (
                                      <p key={index} className={`text-sm ${mutedTextClasses}`}>
                                        • {task}
                                      </p>
                                    ))}
                                  </div>
                                  <p className={`text-xs ${mutedTextClasses} mt-2`}>
                                    {new Date(template.createdAt).toLocaleDateString(
                                      language === "es"
                                        ? "es-ES"
                                        : language === "en"
                                          ? "en-US"
                                          : language === "de"
                                            ? "de-DE"
                                            : language === "fr"
                                              ? "fr-FR"
                                              : "it-IT",
                                    )}
                                  </p>
                                </div>
                              )
                            })}

                            {templates.length === 0 && (
                              <div className="p-4 rounded-lg border text-center">
                                <FileTemplate className={`w-12 h-12 mx-auto mb-4 ${mutedTextClasses}`} />
                                <p className={textClasses}>No tienes plantillas aún</p>
                                <p className={mutedTextClasses}>¡Crea tu primera plantilla arriba!</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </DialogContent>
              </Dialog>

              {/* Premium Upgrade Modal */}
              <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
                <DialogContent
                  className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/90 backdrop-blur-xl border-purple-500/30"} ${textClasses} max-w-2xl`}
                >
                  <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent text-center">
                      🚀 Actualizar a Premium
                    </DialogTitle>
                    <DialogDescription className={`${mutedTextClasses} text-center`}>
                      Desbloquea todo el potencial de FutureTask
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    {/* Plan selector */}
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant={premiumPlan === "monthly" ? "default" : "outline"}
                        onClick={() => setPremiumPlan("monthly")}
                        className={premiumPlan === "monthly" ? `bg-gradient-to-r ${currentTheme.accent}` : ""}
                      >
                        {t("monthly")}
                      </Button>
                      <Button
                        variant={premiumPlan === "yearly" ? "default" : "outline"}
                        onClick={() => setPremiumPlan("yearly")}
                        className={premiumPlan === "yearly" ? `bg-gradient-to-r ${currentTheme.accent}` : ""}
                      >
                        {t("yearly")}
                      </Button>
                    </div>

                    {/* Premium features list */}
                    <div className="grid gap-3">
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Tareas ilimitadas</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Pomodoro ilimitado</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Lista de deseos</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Notas ilimitadas</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Plantillas personalizadas</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Temas premium</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Todos los logros</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className={textClasses}>Exportar datos</span>
                      </div>
                    </div>

                    <div className="text-center space-y-4">
                      <div className="text-3xl font-bold">
                        <span className={textClasses}>
                          {premiumPlan === "monthly" ? t("monthlyPrice") : t("yearlyPrice")}
                        </span>
                        <span className={`text-sm ${mutedTextClasses}`}>
                          {premiumPlan === "monthly" ? "/mes" : "/año"}
                        </span>
                      </div>
                      {premiumPlan === "yearly" && (
                        <div className="text-sm text-green-500 font-medium">{t("yearlyDiscount")}</div>
                      )}
                      <Button
                        onClick={upgradeToPremium}
                        className={`w-full bg-gradient-to-r ${currentTheme.accent} hover:opacity-90 text-white text-lg py-3`}
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Actualizar a Premium
                      </Button>
                      <p className={`text-xs ${mutedTextClasses}`}>
                        * Esta es una simulación. En una app real se integraría con un sistema de pagos.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={logout}
                variant="outline"
                className={`${isLightMode ? "border-red-200 text-red-700" : "border-red-500/30 text-red-300"} hover:bg-red-500/20`}
              >
                {t("logout")}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className={cardClasses}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className={`text-sm ${mutedTextClasses}`}>{t("completedToday")}</p>
                    <p className={`text-xl font-bold ${textClasses}`}>{getCompletedTasks().length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={cardClasses}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className={`text-sm ${mutedTextClasses}`}>{t("totalToday")}</p>
                    <p className={`text-xl font-bold ${textClasses}`}>{getTodayTasks().length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={cardClasses}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className={`text-sm ${mutedTextClasses}`}>{t("streak")}</p>
                    <p className={`text-xl font-bold ${textClasses}`}>{getStreak()} días</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={cardClasses}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className={`text-sm ${mutedTextClasses}`}>{t("achievements")}</p>
                    <p className={`text-xl font-bold ${textClasses}`}>
                      {achievements.filter((a) => a.unlocked).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={cardClasses}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className={`text-sm ${mutedTextClasses}`}>{t("progressToday")}</p>
                    <p className={`text-xl font-bold ${textClasses}`}>{Math.round(getTodayProgress())}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <Card className={`lg:col-span-2 ${cardClasses}`}>
              <CardHeader>
                <CardTitle className={`${textClasses} flex items-center space-x-2`}>
                  <CalendarIcon className="w-5 h-5" />
                  <span>{t("calendar")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border-0"
                  modifiers={{
                    hasTasks: getDateWithTasks(),
                  }}
                  modifiersStyles={{
                    hasTasks: {
                      backgroundColor: "rgba(168, 85, 247, 0.3)",
                      color: "white",
                      fontWeight: "bold",
                    },
                  }}
                />
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Card className={`lg:col-span-2 ${cardClasses}`}>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className={`grid w-full grid-cols-4 ${isLightMode ? "bg-purple-100" : "bg-purple-900/20"}`}>
                    <TabsTrigger value="tasks" className="data-[state=active]:bg-purple-500/30">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {t("tasks")}
                    </TabsTrigger>
                    <TabsTrigger value="pomodoro" className="data-[state=active]:bg-purple-500/30">
                      <Timer className="w-4 h-4 mr-2" />
                      {t("pomodoro")}
                    </TabsTrigger>
                    <TabsTrigger value="wishlist" className={`data-[state=active]:bg-purple-500/30`}>
                      <Heart className="w-4 h-4 mr-2" />
                      {t("wishlist")}
                    </TabsTrigger>
                    <TabsTrigger value="notes" className={`data-[state=active]:bg-purple-500/30`}>
                      <StickyNote className="w-4 h-4 mr-2" />
                      {t("notes")}
                    </TabsTrigger>
                  </TabsList>

                  {/* Tasks Tab */}
                  <TabsContent value="tasks" className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className={`text-lg font-semibold ${textClasses}`}>
                        {t("tasks")} -{" "}
                        {selectedDate.toLocaleDateString(
                          language === "es"
                            ? "es-ES"
                            : language === "en"
                              ? "en-US"
                              : language === "de"
                                ? "de-DE"
                                : language === "fr"
                                  ? "fr-FR"
                                  : "it-IT",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </h3>
                      <Progress value={getTodayProgress()} className="h-2" />
                      <p className={`text-sm ${mutedTextClasses}`}>
                        {getCompletedTasks().length} de {getTodayTasks().length} completadas
                      </p>
                      {!user.isPremium && (
                        <p className="text-xs text-orange-400">
                          Límite: {tasks.length}/10 tareas (Actualiza a Premium para ilimitadas)
                        </p>
                      )}
                    </div>

                    {/* Filters - Available for all users */}
                    <div className="flex items-center space-x-2">
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger
                          className={`w-32 ${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          className={`${isLightMode ? "bg-white border-purple-200" : "bg-gray-800 border-purple-500/30"}`}
                        >
                          <SelectItem value="all" className={isLightMode ? "text-gray-900" : "text-white"}>
                            Todas
                          </SelectItem>
                          <SelectItem value="work" className={isLightMode ? "text-gray-900" : "text-white"}>
                            {t("work")}
                          </SelectItem>
                          <SelectItem value="personal" className={isLightMode ? "text-gray-900" : "text-white"}>
                            {t("personal")}
                          </SelectItem>
                          <SelectItem value="health" className={isLightMode ? "text-gray-900" : "text-white"}>
                            {t("health")}
                          </SelectItem>
                          <SelectItem value="learning" className={isLightMode ? "text-gray-900" : "text-white"}>
                            {t("learning")}
                          </SelectItem>
                          <SelectItem value="other" className={isLightMode ? "text-gray-900" : "text-white"}>
                            {t("other")}
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={showCompleted}
                          onCheckedChange={setShowCompleted}
                          className="data-[state=checked]:bg-purple-500"
                        />
                        <Label className={`text-sm ${mutedTextClasses}`}>Completadas</Label>
                      </div>
                    </div>

                    {/* Add Task Form */}
                    <div className="space-y-3">
                      <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder={t("newTask")}
                        className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                        onKeyPress={(e) => e.key === "Enter" && addTask()}
                      />

                      <Textarea
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        placeholder={t("description")}
                        className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400 min-h-[60px]`}
                      />

                      <div className="flex space-x-2">
                        <Select
                          value={newTaskCategory}
                          onValueChange={(value) => setNewTaskCategory(value as Task["category"])}
                        >
                          <SelectTrigger
                            className={`flex-1 ${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            className={`${isLightMode ? "bg-white border-purple-200" : "bg-gray-800 border-purple-500/30"}`}
                          >
                            <SelectItem value="work" className={isLightMode ? "text-gray-900" : "text-white"}>
                              {t("work")}
                            </SelectItem>
                            <SelectItem value="personal" className={isLightMode ? "text-gray-900" : "text-white"}>
                              {t("personal")}
                            </SelectItem>
                            <SelectItem value="health" className={isLightMode ? "text-gray-900" : "text-white"}>
                              {t("health")}
                            </SelectItem>
                            <SelectItem value="learning" className={isLightMode ? "text-gray-900" : "text-white"}>
                              {t("learning")}
                            </SelectItem>
                            <SelectItem value="other" className={isLightMode ? "text-gray-900" : "text-white"}>
                              {t("other")}
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={newTaskPriority}
                          onValueChange={(value) => setNewTaskPriority(value as Task["priority"])}
                        >
                          <SelectTrigger
                            className={`flex-1 ${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            className={`${isLightMode ? "bg-white border-purple-200" : "bg-gray-800 border-purple-500/30"}`}
                          >
                            <SelectItem value="high" className={isLightMode ? "text-gray-900" : "text-white"}>
                              {t("high")}
                            </SelectItem>
                            <SelectItem value="medium" className={isLightMode ? "text-gray-900" : "text-white"}>
                              {t("medium")}
                            </SelectItem>
                            <SelectItem value="low" className={isLightMode ? "text-gray-900" : "text-white"}>
                              {t("low")}
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          onClick={addTask}
                          className={`bg-gradient-to-r ${currentTheme.accent} hover:opacity-90`}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Tasks List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {getTodayTasks().map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
                            task.completed
                              ? `${isLightMode ? "bg-green-50/50 border-green-200" : "bg-green-900/20 border-green-500/30"} line-through opacity-60`
                              : `${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"}`
                          }`}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <Checkbox
                              id={`task-${task.id}`}
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id)}
                              className="peer data-[state=checked]:bg-green-500"
                            />
                            <div className="peer-checked:line-through flex-1">
                              {editingTask === task.id ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editTaskText}
                                    onChange={(e) => setEditTaskText(e.target.value)}
                                    className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses}`}
                                  />
                                  <Textarea
                                    value={editTaskDescription}
                                    onChange={(e) => setEditTaskDescription(e.target.value)}
                                    placeholder={t("description")}
                                    className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400 min-h-[60px]`}
                                  />
                                  <div className="flex space-x-2">
                                    <Select
                                      value={editTaskCategory}
                                      onValueChange={(value) => setEditTaskCategory(value as Task["category"])}
                                    >
                                      <SelectTrigger
                                        className={`flex-1 ${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses}`}
                                      >
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent
                                        className={`${isLightMode ? "bg-white border-purple-200" : "bg-gray-800 border-purple-500/30"}`}
                                      >
                                        <SelectItem
                                          value="work"
                                          className={isLightMode ? "text-gray-900" : "text-white"}
                                        >
                                          {t("work")}
                                        </SelectItem>
                                        <SelectItem
                                          value="personal"
                                          className={isLightMode ? "text-gray-900" : "text-white"}
                                        >
                                          {t("personal")}
                                        </SelectItem>
                                        <SelectItem
                                          value="health"
                                          className={isLightMode ? "text-gray-900" : "text-white"}
                                        >
                                          {t("health")}
                                        </SelectItem>
                                        <SelectItem
                                          value="learning"
                                          className={isLightMode ? "text-gray-900" : "text-white"}
                                        >
                                          {t("learning")}
                                        </SelectItem>
                                        <SelectItem
                                          value="other"
                                          className={isLightMode ? "text-gray-900" : "text-white"}
                                        >
                                          {t("other")}
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>

                                    <Select
                                      value={editTaskPriority}
                                      onValueChange={(value) => setEditTaskPriority(value as Task["priority"])}
                                    >
                                      <SelectTrigger
                                        className={`flex-1 ${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses}`}
                                      >
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent
                                        className={`${isLightMode ? "bg-white border-purple-200" : "bg-gray-800 border-purple-500/30"}`}
                                      >
                                        <SelectItem
                                          value="high"
                                          className={isLightMode ? "text-gray-900" : "text-white"}
                                        >
                                          {t("high")}
                                        </SelectItem>
                                        <SelectItem
                                          value="medium"
                                          className={isLightMode ? "text-gray-900" : "text-white"}
                                        >
                                          {t("medium")}
                                        </SelectItem>
                                        <SelectItem
                                          value="low"
                                          className={isLightMode ? "text-gray-900" : "text-white"}
                                        >
                                          {t("low")}
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={saveEditTask}
                                      size="sm"
                                      className={`bg-gradient-to-r ${currentTheme.accent} hover:opacity-90`}
                                    >
                                      {t("saveTask")}
                                    </Button>
                                    <Button
                                      onClick={cancelEditTask}
                                      size="sm"
                                      variant="outline"
                                      className={`${isLightMode ? "border-gray-200" : "border-gray-600"}`}
                                    >
                                      {t("cancelEdit")}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Label htmlFor={`task-${task.id}`} className={`font-semibold ${textClasses}`}>
                                      {task.text}
                                    </Label>
                                    <Badge
                                      variant="outline"
                                      className={`${PRIORITY_COLORS[task.priority]} border-current`}
                                    >
                                      {getPriorityIcon(task.priority)}
                                      <span className="ml-1">{t(task.priority)}</span>
                                    </Badge>
                                  </div>
                                  {task.description && (
                                    <p className={`text-sm ${mutedTextClasses}`}>{task.description}</p>
                                  )}
                                  <div className="flex items-center space-x-2">
                                    <Badge className={`text-xs ${CATEGORY_COLORS[task.category]}`}>
                                      {t(task.category)}
                                    </Badge>
                                  </div>
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
                                className={`${isLightMode ? "text-blue-700" : "text-blue-300"} hover:bg-blue-500/20`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTask(task.id)}
                              className={`${isLightMode ? "text-red-700" : "text-red-300"} hover:bg-red-500/20`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {getTodayTasks().length === 0 && (
                        <div className="p-4 rounded-lg border text-center">
                          <p className={textClasses}>No hay tareas para este día</p>
                          <p className={mutedTextClasses}>¡Agrega una nueva tarea arriba!</p>
                        </div>
                      )}
                      {!user.isPremium && tasks.length >= 10 && (
                        <div className="p-4 rounded-lg border border-orange-500/30 bg-orange-500/10 text-center">
                          <Crown className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                          <p className={`${textClasses} font-semibold mb-2`}>Límite de tareas alcanzado</p>
                          <p className={`${mutedTextClasses} text-sm mb-4`}>
                            Actualiza a Premium para crear tareas ilimitadas
                          </p>
                          <Button
                            onClick={() => setShowPremiumModal(true)}
                            className={`bg-gradient-to-r ${currentTheme.accent} hover:opacity-90 text-white`}
                          >
                            <Crown className="w-4 h-4 mr-2" />
                            Actualizar a Premium
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Pomodoro Tab */}
                  <TabsContent value="pomodoro" className="p-6 space-y-4">
                    <div className="text-center space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-semibold ${textClasses}`}>{t("pomodoro")}</h3>
                        {!user.isPremium && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${isLightMode ? "border-orange-300 text-orange-700 bg-orange-50" : "border-orange-400/60 text-orange-300 bg-orange-500/10"}`}
                          >
                            {t("sessionsUsed")}: {user.pomodoroSessions}/10
                          </Badge>
                        )}
                      </div>

                      {/* Timer Display */}
                      <div className="space-y-4">
                        <div className={`text-6xl font-bold ${textClasses} tabular-nums`}>
                          {formatTime(pomodoroTime)}
                        </div>

                        <div className="flex justify-center space-x-2">
                          <Badge
                            className={`${pomodoroType === "work" ? `bg-gradient-to-r ${currentTheme.accent}` : "bg-gray-500"} text-white`}
                          >
                            {t("workSession")}
                          </Badge>
                          <Badge
                            className={`${pomodoroType === "shortBreak" ? "bg-gradient-to-r from-green-500 to-blue-500" : "bg-gray-500"} text-white`}
                          >
                            {t("shortBreak")}
                          </Badge>
                          <Badge
                            className={`${pomodoroType === "longBreak" ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gray-500"} text-white`}
                          >
                            {t("longBreak")}
                          </Badge>
                        </div>
                      </div>

                      {/* Timer Controls */}
                      <div className="flex justify-center space-x-4">
                        <Button
                          onClick={pomodoroActive ? pausePomodoro : startPomodoro}
                          className={`bg-gradient-to-r ${currentTheme.accent} hover:opacity-90`}
                          disabled={!user.isPremium && user.pomodoroSessions >= 10}
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
                          onClick={resetPomodoro}
                          variant="outline"
                          className={`${isLightMode ? "border-purple-200" : "border-purple-500/30"}`}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          {t("reset")}
                        </Button>
                      </div>

                      {/* Session Type Selector */}
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant={pomodoroType === "work" ? "default" : "outline"}
                          onClick={() => {
                            setPomodoroType("work")
                            setPomodoroTime(25 * 60)
                            setPomodoroActive(false)
                          }}
                          className={pomodoroType === "work" ? `bg-gradient-to-r ${currentTheme.accent}` : ""}
                        >
                          25min
                        </Button>
                        <Button
                          variant={pomodoroType === "shortBreak" ? "default" : "outline"}
                          onClick={() => {
                            setPomodoroType("shortBreak")
                            setPomodoroTime(5 * 60)
                            setPomodoroActive(false)
                          }}
                          className={pomodoroType === "shortBreak" ? "bg-gradient-to-r from-green-500 to-blue-500" : ""}
                        >
                          5min
                        </Button>
                        <Button
                          variant={pomodoroType === "longBreak" ? "default" : "outline"}
                          onClick={() => {
                            setPomodoroType("longBreak")
                            setPomodoroTime(15 * 60)
                            setPomodoroActive(false)
                          }}
                          className={pomodoroType === "longBreak" ? "bg-gradient-to-r from-orange-500 to-red-500" : ""}
                        >
                          15min
                        </Button>
                      </div>

                      {!user.isPremium && user.pomodoroSessions >= 10 && (
                        <div className="p-4 rounded-lg border border-orange-500/30 bg-orange-500/10">
                          <p className="text-orange-400 text-sm">
                            Has alcanzado el límite de 10 sesiones gratuitas. ¡Actualiza a Premium para sesiones
                            ilimitadas!
                          </p>
                          <Button
                            onClick={() => setShowPremiumModal(true)}
                            className={`bg-gradient-to-r ${currentTheme.accent} hover:opacity-90 text-white mt-4`}
                          >
                            <Crown className="w-4 h-4 mr-2" />
                            Actualizar a Premium
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Wishlist Tab */}
                  {user.isPremium && (
                    <TabsContent value="wishlist" className="p-6 space-y-4">
                      <div>
                        <h3 className={`text-lg font-semibold ${textClasses} mb-4`}>{t("wishlist")}</h3>

                        {/* Add Wish Form */}
                        <div className="space-y-3 mb-6">
                          <Input
                            value={newWish}
                            onChange={(e) => setNewWish(e.target.value)}
                            placeholder={t("newWish")}
                            className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                          />
                          <Textarea
                            value={newWishDescription}
                            onChange={(e) => setNewWishDescription(e.target.value)}
                            placeholder={t("wishDescription")}
                            className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400 min-h-[60px]`}
                          />
                          <Button
                            onClick={addWish}
                            className={`w-full bg-gradient-to-r ${currentTheme.accent} hover:opacity-90`}
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            {t("addWish")}
                          </Button>
                        </div>

                        {/* Wishes List */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {wishes.map((wish) => (
                            <div
                              key={wish.id}
                              className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
                                wish.completed
                                  ? `${isLightMode ? "bg-green-50/50 border-green-200" : "bg-green-900/20 border-green-500/30"} line-through opacity-60`
                                  : `${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"}`
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`wish-${wish.id}`}
                                  checked={wish.completed}
                                  onCheckedChange={() => toggleWish(wish.id)}
                                  className="peer data-[state=checked]:bg-green-500"
                                />
                                <div className="peer-checked:line-through">
                                  <Label htmlFor={`wish-${wish.id}`} className={`font-semibold ${textClasses}`}>
                                    {wish.text}
                                  </Label>
                                  {wish.description && (
                                    <p className={`text-sm ${mutedTextClasses}`}>{wish.description}</p>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteWish(wish.id)}
                                className={`${isLightMode ? "text-red-700" : "text-red-300"} hover:bg-red-500/20`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}

                          {wishes.length === 0 && (
                            <div className="p-4 rounded-lg border text-center">
                              <Heart className={`w-12 h-12 mx-auto mb-4 ${mutedTextClasses}`} />
                              <p className={textClasses}>No tienes deseos aún</p>
                              <p className={mutedTextClasses}>¡Agrega tu primer deseo arriba!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  {/* Notes Tab */}
                  {user.isPremium && (
                    <TabsContent value="notes" className="p-6 space-y-4">
                      <div>
                        <h3 className={`text-lg font-semibold ${textClasses} mb-4`}>{t("notes")}</h3>

                        {/* Add Note Form */}
                        <div className="space-y-3 mb-6">
                          <Input
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            placeholder={t("newNote")}
                            className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400`}
                          />
                          <Textarea
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            placeholder={t("noteContent")}
                            className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} placeholder:text-gray-400 min-h-[100px]`}
                          />
                          <Button
                            onClick={addNote}
                            className={`w-full bg-gradient-to-r ${currentTheme.accent} hover:opacity-90`}
                          >
                            <StickyNote className="w-4 h-4 mr-2" />
                            {t("addNote")}
                          </Button>
                        </div>

                        {/* Notes List */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {notes.map((note) => (
                            <div
                              key={note.id}
                              className={`p-3 rounded-lg border ${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"}`}
                            >
                              {editingNote === note.id ? (
                                <div className="space-y-2">
                                  <Input
                                    defaultValue={note.title}
                                    onBlur={(e) => updateNote(note.id, e.target.value, note.content)}
                                    className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses}`}
                                  />
                                  <Textarea
                                    defaultValue={note.content}
                                    onBlur={(e) => updateNote(note.id, note.title, e.target.value)}
                                    className={`${isLightMode ? "bg-white border-purple-200" : "bg-black/30 border-purple-500/30"} ${textClasses} min-h-[80px]`}
                                  />
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className={`font-semibold ${textClasses}`}>{note.title}</h4>
                                    <div className="flex space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingNote(note.id)}
                                        className={`${isLightMode ? "text-blue-700" : "text-blue-300"} hover:bg-blue-500/20`}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteNote(note.id)}
                                        className={`${isLightMode ? "text-red-700" : "text-red-300"} hover:bg-red-500/20`}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className={`text-sm ${mutedTextClasses} whitespace-pre-wrap`}>{note.content}</p>
                                  <p className={`text-xs ${mutedTextClasses} mt-2`}>
                                    {new Date(note.updatedAt).toLocaleDateString(
                                      language === "es"
                                        ? "es-ES"
                                        : language === "en"
                                          ? "en-US"
                                          : language === "de"
                                            ? "de-DE"
                                            : language === "fr"
                                              ? "fr-FR"
                                              : "it-IT",
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}

                          {notes.length === 0 && (
                            <div className="p-4 rounded-lg border text-center">
                              <StickyNote className={`w-12 h-12 mx-auto mb-4 ${mutedTextClasses}`} />
                              <p className={textClasses}>No tienes notas aún</p>
                              <p className={mutedTextClasses}>¡Agrega tu primera nota arriba!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LanguageContext.Provider>
  )
}
