"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Crown, Check, Database, Eye, EyeOff, Sparkles, Bot } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

// Import database functions
import { createUser, getUserByEmail, updateUser, initializeAdminUser } from "@/lib/database"

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
  premium_expiry?: string
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
    billingYearly: "Facturación anual (3 meses gratis)",
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
    monthlyPrice: "€1.99/month",
    yearlyPrice: "€20/year",
    proMonthlyPrice: "€4.99/month",
    proYearlyPrice: "€50/year",
    yearlyDiscount: "Save €3.88",
    proYearlyDiscount: "Save €9.88",
    billingMonthly: "Monthly billing",
    billingYearly: "Yearly billing (3 months free)",
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
}

export default function FutureTaskApp() {
  // Core state
  const [user, setUser] = useState<User | null>(null)
  const [language, setLanguage] = useState<"es" | "en">("es")
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

  // Auth state
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Wishlist and Notes state
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  const t = useCallback(
    (key: string) => {
      return translations[language][key as keyof (typeof translations)[typeof language]] || key
    },
    [language],
  )

  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeAdminUser()
        setCurrentScreen("welcome")
      } catch (error) {
        console.error("Error initializing app:", error)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    if (!isInitialized) {
      initApp()
    }
  }, [isInitialized])

  // Auth handlers
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
        setCurrentScreen(existingUser.onboarding_completed ? "app" : "premium")
      } else {
        const newUser = await createUser({
          name,
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
        setCurrentScreen("premium")
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
      setCurrentScreen("app")
    } catch (error) {
      console.error("Error updating premium status:", error)
      const updatedUserLocal = {
        ...user,
        is_premium: plan === "premium" || plan === "pro",
        is_pro: plan === "pro",
        onboarding_completed: true,
      }
      setUser(updatedUserLocal)
      setCurrentScreen("app")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setTasks([])
    setWishlistItems([])
    setNotes([])
    setCurrentScreen("welcome")
  }

  const getCurrentTheme = () => ({
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
  })

  // Loading state
  if (!isInitialized || isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getCurrentTheme().gradient} flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <div className={`${getCurrentTheme().textPrimary} text-lg font-semibold`}>Cargando FutureTask...</div>
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
          </CardHeader>
          <CardContent className="space-y-4">
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
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

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

  // Premium Screen
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
              {/* Free Plan */}
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

              {/* Premium Plan */}
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
                  <div className={`text-sm ${getCurrentTheme().textMuted}`}>
                    {t("yearlyPrice")} - {t("yearlyDiscount")}
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

              {/* Pro Plan */}
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
                  <div className={`text-sm ${getCurrentTheme().textMuted}`}>
                    {t("proYearlyPrice")} - {t("proYearlyDiscount")}
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
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
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
              <Button variant="ghost" onClick={logout} className={getCurrentTheme().textSecondary}>
                {t("logout")}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center py-20">
            <CalendarIcon className={`w-24 h-24 mx-auto mb-6 ${getCurrentTheme().textMuted}`} />
            <h2 className={`text-2xl font-bold ${getCurrentTheme().textPrimary} mb-4`}>¡Bienvenido a FutureTask!</h2>
            <p className={`${getCurrentTheme().textSecondary} mb-8`}>
              Tu aplicación de productividad está lista. Las funciones completas se están desarrollando.
            </p>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                <h3 className={`font-semibold ${getCurrentTheme().textPrimary} mb-2`}>Estado del Plan</h3>
                <p className={getCurrentTheme().textSecondary}>
                  {user?.is_pro ? "Plan Pro Activo" : user?.is_premium ? "Plan Premium Activo" : "Plan Gratuito"}
                </p>
              </div>
              {isSupabaseAvailable && (
                <div className={`p-4 rounded-lg ${getCurrentTheme().cardBg} ${getCurrentTheme().border}`}>
                  <div className="flex items-center justify-center space-x-2">
                    <Database className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">Conectado a Supabase</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
