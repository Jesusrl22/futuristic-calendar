"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { CalendarWidget } from "@/components/calendar-widget"
import { TaskManager } from "@/components/task-manager"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { StatsCards } from "@/components/stats-cards"
import { WishlistManager } from "@/components/wishlist-manager"
import { NotesManager } from "@/components/notes-manager"
import { AiAssistant } from "@/components/ai-assistant"
import { SettingsModal } from "@/components/settings-modal"
import { SubscriptionManager } from "@/components/subscription-manager"
import { AchievementsDisplay } from "@/components/achievements-display"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  CheckSquare,
  Clock,
  BarChart3,
  Star,
  FileText,
  Settings,
  Menu,
  X,
  Loader2,
  CreditCard,
  Trophy,
  Sparkles,
  Bot,
} from "lucide-react"
import { Toaster } from "@/components/toaster"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/hooks/useLanguage"

function AppContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("calendar")

  // Prevent infinite loops
  const hasRedirectedRef = useRef(false)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (hasLoadedRef.current || hasRedirectedRef.current) return
    hasLoadedRef.current = true

    let mounted = true

    const loadUser = async () => {
      try {
        const isDemo = searchParams?.get("demo") === "true"

        // Si es modo demo, crear usuario demo
        if (isDemo) {
          console.log("🎯 Demo mode activated")
          const demoUser = {
            id: "demo-user",
            email: "demo@futuretask.app",
            full_name: "Usuario Demo",
            name: "Usuario Demo",
            subscription_tier: "pro",
            plan: "pro",
            billing_cycle: "monthly",
            ai_credits: 500,
            theme_preference: "light",
            pomodoro_work_duration: 25,
            pomodoro_break_duration: 5,
            pomodoro_long_break_duration: 15,
            pomodoro_sessions_until_long_break: 4,
            isDemo: true,
          }

          if (mounted) {
            setUser(demoUser)
            setLoading(false)
          }
          return
        }

        // Si NO es modo demo, verificar autenticación real
        console.log("🔍 Checking authentication...")

        // Verificar sesión con timeout
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))

        let session
        try {
          const result = (await Promise.race([sessionPromise, timeoutPromise])) as any
          session = result?.data?.session
        } catch (error) {
          console.error("❌ Session check failed:", error)
          if (mounted && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true
            setLoading(false)
            router.replace("/login")
          }
          return
        }

        // Si no hay sesión, redirigir a login
        if (!session?.user) {
          console.log("❌ No session found, redirecting to login")
          if (mounted && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true
            setLoading(false)
            router.replace("/login")
          }
          return
        }

        console.log("✅ Session found:", session.user.email)

        // Cargar datos del usuario desde la base de datos
        try {
          const userDataPromise = supabase.from("users").select("*").eq("id", session.user.id).single()

          const userTimeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("User data timeout")), 5000),
          )

          const { data: userData, error } = (await Promise.race([userDataPromise, userTimeoutPromise])) as any

          if (error && error.code !== "PGRST116") {
            console.error("Error loading user data:", error)
          }

          if (mounted) {
            if (userData) {
              console.log("✅ User data loaded from database")
              // Free y Premium = 0 créditos por defecto, Pro = 500 o los que tenga guardados
              const aiCredits =
                userData.subscription_tier === "free" || userData.subscription_tier === "premium"
                  ? userData.ai_credits || 0
                  : userData.ai_credits || 500
              setUser({
                ...userData,
                ai_credits: aiCredits,
              })
            } else {
              console.log("⚠️ No user data in database, using session data")
              setUser({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Usuario",
                name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Usuario",
                subscription_tier: "free",
                plan: "free",
                billing_cycle: "monthly",
                ai_credits: 0,
                theme_preference: "light",
                pomodoro_work_duration: 25,
                pomodoro_break_duration: 5,
                pomodoro_long_break_duration: 15,
                pomodoro_sessions_until_long_break: 4,
              })
            }
            setLoading(false)
          }
        } catch (userError) {
          console.error("Failed to load user data:", userError)
          if (mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Usuario",
              name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Usuario",
              subscription_tier: "free",
              plan: "free",
              billing_cycle: "monthly",
              ai_credits: 0,
              theme_preference: "light",
              pomodoro_work_duration: 25,
              pomodoro_break_duration: 5,
              pomodoro_long_break_duration: 15,
              pomodoro_sessions_until_long_break: 4,
            })
            setLoading(false)
          }
        }
      } catch (error) {
        console.error("Error loading app:", error)
        if (mounted && !hasRedirectedRef.current) {
          hasRedirectedRef.current = true
          setLoading(false)
          router.replace("/login")
        }
      }
    }

    loadUser()

    return () => {
      mounted = false
    }
  }, [router, searchParams])

  const handleLogout = async () => {
    if (user?.isDemo) {
      router.push("/")
      return
    }

    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
      router.push("/")
    }
  }

  const handleUpdateCredits = (newCredits: number) => {
    setUser((prev: any) => ({ ...prev, ai_credits: newCredits }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">FutureTask</h1>
          {user?.isDemo && (
            <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">DEMO</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)] lg:h-screen">
        {/* Sidebar */}
        <aside
          className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transition-transform duration-300 ease-in-out
          flex flex-col
          lg:top-0 top-[73px]
        `}
        >
          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FutureTask</h1>
            </div>
            <LanguageSelector />
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {user?.full_name?.charAt(0) || user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.full_name || user?.name || t("common.user")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            {user?.isDemo && (
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-xs text-yellow-800 dark:text-yellow-200 flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Modo Demo - Todas las funciones desbloqueadas
                </p>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span className="capitalize">Plan: {user?.subscription_tier || user?.plan || "free"}</span>
              <span>Créditos IA: {user?.ai_credits || 0}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <button
              onClick={() => {
                setActiveTab("calendar")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "calendar"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Calendario</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("tasks")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "tasks"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <CheckSquare className="h-5 w-5" />
              <span className="font-medium">Tareas</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("pomodoro")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "pomodoro"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Clock className="h-5 w-5" />
              <span className="font-medium">Pomodoro</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("stats")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "stats"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Estadísticas</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("wishlist")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "wishlist"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Star className="h-5 w-5" />
              <span className="font-medium">Lista de Deseos</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("notes")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "notes"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Notas</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("ai")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "ai"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Bot className="h-5 w-5" />
              <span className="font-medium">Asistente IA</span>
              {user?.ai_credits > 0 && (
                <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                  {user.ai_credits}
                </span>
              )}
            </button>

            {!user?.isDemo && (
              <button
                onClick={() => {
                  setActiveTab("subscription")
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "subscription"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Suscripción</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab("achievements")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "achievements"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Logros</span>
            </button>
          </nav>

          {/* Settings & Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
              onClick={handleLogout}
            >
              {user?.isDemo ? "Salir del Demo" : "Cerrar Sesión"}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === "calendar" && <CalendarWidget userId={user?.id} isDemo={user?.isDemo} />}
            {activeTab === "tasks" && <TaskManager userId={user?.id} isDemo={user?.isDemo} />}
            {activeTab === "pomodoro" && (
              <PomodoroTimer
                userId={user?.id}
                workDuration={user?.pomodoro_work_duration || 25}
                breakDuration={user?.pomodoro_break_duration || 5}
                longBreakDuration={user?.pomodoro_long_break_duration || 15}
                sessionsUntilLongBreak={user?.pomodoro_sessions_until_long_break || 4}
                isDemo={user?.isDemo}
              />
            )}
            {activeTab === "stats" && <StatsCards userId={user?.id} isDemo={user?.isDemo} />}
            {activeTab === "wishlist" && <WishlistManager userId={user?.id} isDemo={user?.isDemo} />}
            {activeTab === "notes" && <NotesManager userId={user?.id} isDemo={user?.isDemo} />}
            {activeTab === "ai" && (
              <AiAssistant
                userId={user?.id}
                credits={user?.ai_credits || 0}
                onCreditsUpdate={handleUpdateCredits}
                userPlan={user?.subscription_tier || user?.plan || "free"}
              />
            )}
            {activeTab === "subscription" && !user?.isDemo && (
              <SubscriptionManager
                userId={user?.id}
                currentPlan={user?.subscription_tier || user?.plan || "free"}
                billingCycle={user?.billing_cycle || user?.billing || "monthly"}
              />
            )}
            {activeTab === "achievements" && <AchievementsDisplay userId={user?.id} isDemo={user?.isDemo} />}
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} />

      {/* Toast Notifications */}
      <Toaster />

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <AppContent />
    </Suspense>
  )
}
