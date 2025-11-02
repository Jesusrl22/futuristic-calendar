"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { TaskCalendarManager } from "@/components/task-calendar-manager"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { StatsCards } from "@/components/stats-cards"
import { WishlistManager } from "@/components/wishlist-manager"
import { NotesManager } from "@/components/notes-manager"
import { AIAssistant } from "@/components/ai-assistant"
import { SettingsModal } from "@/components/settings-modal"
import { SubscriptionManager } from "@/components/subscription-manager"
import { AchievementsDisplay } from "@/components/achievements-display"
import { Button } from "@/components/ui/button"
import {
  Calendar,
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
  Zap,
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

  const isCheckingRef = useRef(false)

  useEffect(() => {
    if (isCheckingRef.current) return
    isCheckingRef.current = true

    const checkAuth = async () => {
      try {
        const isDemo = searchParams?.get("demo") === "true"

        if (isDemo) {
          console.log("🎯 Modo Demo activado")
          const demoUser = {
            id: "demo-user",
            email: "demo@futuretask.app",
            full_name: "Usuario Demo",
            name: "Usuario Demo",
            subscription_tier: "pro",
            plan: "pro",
            ai_credits: 500,
            isDemo: true,
          }
          setUser(demoUser)
          setLoading(false)
          return
        }

        console.log("🔍 Verificando autenticación...")

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("❌ Error de sesión:", sessionError)
          router.replace("/login")
          return
        }

        if (!session?.user) {
          console.log("❌ No hay sesión, redirigiendo a login")
          router.replace("/login")
          return
        }

        console.log("✅ Sesión encontrada:", session.user.email)

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (userError && userError.code !== "PGRST116") {
          console.error("Error cargando datos de usuario:", userError)
        }

        if (userData) {
          console.log("✅ Datos de usuario cargados - Plan:", userData.subscription_tier || userData.plan)
          setUser({
            ...userData,
            plan: userData.subscription_tier || userData.plan || "free",
          })
        } else {
          const newUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Usuario",
            full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Usuario",
            subscription_tier: "free",
            plan: "free",
            ai_credits: 0,
          }

          const { error: insertError } = await supabase.from("users").insert([newUser])

          if (insertError) {
            console.error("Error creando usuario:", insertError)
          }

          setUser(newUser)
        }

        setLoading(false)
      } catch (err) {
        console.error("❌ Error verificando autenticación:", err)
        router.replace("/login")
      }
    }

    checkAuth()
  }, [router, searchParams])

  const handleLogout = async () => {
    try {
      if (user?.isDemo) {
        router.push("/login")
        return
      }

      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error cerrando sesión:", error)
      router.push("/login")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-primary/50" />
          </div>
          <p className="text-lg font-semibold text-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userPlan = user?.subscription_tier || user?.plan || "free"
  console.log("🎯 App Page - User Plan:", userPlan)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden glass-card p-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-xl shadow-lg">
            <Calendar className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">FutureTask</h1>
          {user?.isDemo && (
            <span className="px-3 py-1 text-xs font-bold bg-accent text-accent-foreground rounded-full shadow-lg">
              DEMO
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSelector variant="button" showFlag={true} showName={false} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-accent"
          >
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
          w-72 sidebar-glass
          transition-transform duration-300 ease-in-out
          flex flex-col
          lg:top-0 top-[73px] shadow-2xl
        `}
        >
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <Calendar className="h-7 w-7 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">FutureTask</h1>
            </div>
            <LanguageSelector variant="button" showFlag={true} showName={false} />
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-xl">
                {user?.full_name?.charAt(0) || user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {user?.full_name || user?.name || "Usuario"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            {user?.isDemo && (
              <div className="p-3 bg-accent/20 border border-accent rounded-xl backdrop-blur-sm">
                <p className="text-xs font-semibold text-accent-foreground flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Modo Demo - Todas las funciones
                </p>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between p-3 bg-muted rounded-xl backdrop-blur-sm border border-border">
              <span className="text-xs font-semibold text-muted-foreground capitalize">Plan: {userPlan}</span>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-xs font-bold text-primary">{user?.ai_credits || 0}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
              { id: "calendar", icon: Calendar, label: t("nav.calendar") },
              { id: "pomodoro", icon: Clock, label: t("nav.pomodoro") },
              { id: "stats", icon: BarChart3, label: t("nav.stats") },
              { id: "wishlist", icon: Star, label: t("nav.wishlist") },
              { id: "notes", icon: FileText, label: t("nav.notes") },
              { id: "ai", icon: Bot, label: t("nav.aiAssistant"), credits: user?.ai_credits },
              ...(user?.isDemo ? [] : [{ id: "subscription", icon: CreditCard, label: t("nav.subscription") }]),
              { id: "achievements", icon: Trophy, label: t("nav.achievements") },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-102"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-semibold">{item.label}</span>
                {item.credits !== undefined && item.credits > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-accent text-accent-foreground rounded-full">
                    {item.credits}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-accent hover:text-accent-foreground"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {t("nav.settings")}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              {user?.isDemo ? "Salir del Demo" : t("auth.logout")}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-fade-in">
              {activeTab === "calendar" && (
                <TaskCalendarManager user={user} onUserUpdate={(updates) => setUser({ ...user, ...updates })} />
              )}
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
              {activeTab === "wishlist" && (
                <WishlistManager userId={user?.id} userPlan={userPlan} onUpgrade={() => setActiveTab("subscription")} />
              )}
              {activeTab === "notes" && (
                <NotesManager userId={user?.id} userPlan={userPlan} onUpgrade={() => setActiveTab("subscription")} />
              )}
              {activeTab === "ai" && (
                <AIAssistant
                  userId={user?.id}
                  credits={user?.ai_credits || 0}
                  onCreditsUpdate={(newCredits) => setUser({ ...user, ai_credits: newCredits })}
                  userPlan={userPlan}
                  onUpgrade={() => setActiveTab("subscription")}
                />
              )}
              {activeTab === "subscription" && !user?.isDemo && (
                <SubscriptionManager
                  userId={user?.id}
                  currentPlan={userPlan}
                  billingCycle={user?.billing_cycle || "monthly"}
                />
              )}
              {activeTab === "achievements" && (
                <AchievementsDisplay userId={user?.id} user={user} isDemo={user?.isDemo} />
              )}
            </div>
          </div>
        </main>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} />
      <Toaster />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AppContent />
    </Suspense>
  )
}
