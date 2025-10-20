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
} from "lucide-react"
import { Toaster } from "@/components/toaster"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/hooks/useLanguage"

function AppContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, mounted } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("calendar")

  const hasRedirectedRef = useRef(false)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (!mounted) return
    if (hasLoadedRef.current || hasRedirectedRef.current) return
    hasLoadedRef.current = true

    let isMounted = true

    const loadUser = async () => {
      try {
        const isDemo = searchParams?.get("demo") === "true"

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

          if (isMounted) {
            setUser(demoUser)
            setLoading(false)
          }
          return
        }

        console.log("🔍 Checking authentication...")

        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))

        let session
        try {
          const result = (await Promise.race([sessionPromise, timeoutPromise])) as any
          session = result?.data?.session
        } catch (error) {
          console.error("❌ Session check failed:", error)
          if (isMounted && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true
            setLoading(false)
            router.replace("/login")
          }
          return
        }

        if (!session?.user) {
          console.log("❌ No session found, redirecting to login")
          if (isMounted && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true
            setLoading(false)
            router.replace("/login")
          }
          return
        }

        console.log("✅ Session found:", session.user.email)

        try {
          const userDataPromise = supabase.from("users").select("*").eq("id", session.user.id).single()

          const userTimeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("User data timeout")), 5000),
          )

          const { data: userData, error } = (await Promise.race([userDataPromise, userTimeoutPromise])) as any

          if (error && error.code !== "PGRST116") {
            console.error("Error loading user data:", error)
          }

          if (isMounted) {
            if (userData) {
              console.log("✅ User data loaded from database:", userData)

              // Normalizar el plan del usuario
              let userPlan = "free"
              if (userData.is_pro || userData.subscription_tier === "pro") {
                userPlan = "pro"
              } else if (userData.is_premium || userData.subscription_tier === "premium") {
                userPlan = "premium"
              }

              console.log("📊 User plan detected:", userPlan)

              const aiCredits = userPlan === "pro" ? userData.ai_credits || 500 : userData.ai_credits || 0

              setUser({
                ...userData,
                subscription_tier: userPlan,
                plan: userPlan,
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
          if (isMounted) {
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
        if (isMounted && !hasRedirectedRef.current) {
          hasRedirectedRef.current = true
          setLoading(false)
          router.replace("/login")
        }
      }
    }

    loadUser()

    return () => {
      isMounted = false
    }
  }, [router, searchParams, mounted])

  const handleLogout = async () => {
    if (user?.isDemo) {
      router.push("/login")
      return
    }

    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
      router.push("/login")
    }
  }

  const handleUpdateCredits = (newCredits: number) => {
    setUser((prev: any) => ({ ...prev, ai_credits: newCredits }))
  }

  const handleUserUpdate = (updates: any) => {
    setUser((prev: any) => ({ ...prev, ...updates }))
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/20 to-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/20 to-background">
      <div className="lg:hidden bg-card/50 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">FutureTask</h1>
          {user?.isDemo && (
            <span className="px-2 py-1 text-xs font-semibold bg-secondary text-secondary-foreground rounded-full border border-border">
              DEMO
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSelector variant="button" showFlag={true} showName={false} />
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)] lg:h-screen">
        <aside
          className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-card/50 backdrop-blur-sm border-r border-border
          transition-transform duration-300 ease-in-out
          flex flex-col
          lg:top-0 top-[73px]
        `}
        >
          <div className="hidden lg:flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">FutureTask</h1>
            </div>
            <LanguageSelector variant="button" showFlag={true} showName={false} />
          </div>

          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold">
                {user?.full_name?.charAt(0) || user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.full_name || user?.name || t("common.user")}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            {user?.isDemo && (
              <div className="mt-3 p-2 bg-secondary/50 border border-border rounded-md">
                <p className="text-xs text-secondary-foreground flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Modo Demo - Todas las funciones desbloqueadas
                </p>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="capitalize">
                {t("subscription.currentPlan")}: {user?.subscription_tier || user?.plan || t("subscription.free")}
              </span>
              <span>
                {t("ai.credits")}: {user?.ai_credits || 0}
              </span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <button
              onClick={() => {
                setActiveTab("calendar")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "calendar"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="font-medium">{t("nav.calendar")}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("pomodoro")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "pomodoro"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Clock className="h-5 w-5" />
              <span className="font-medium">{t("nav.pomodoro")}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("stats")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "stats"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">{t("nav.stats")}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("wishlist")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "wishlist"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Star className="h-5 w-5" />
              <span className="font-medium">{t("nav.wishlist")}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("notes")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "notes"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">{t("nav.notes")}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("ai")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "ai"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Bot className="h-5 w-5" />
              <span className="font-medium">{t("nav.aiAssistant")}</span>
              {user?.ai_credits > 0 && (
                <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-primary/20 text-primary-foreground rounded-full border border-primary">
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
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">{t("nav.subscription")}</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab("achievements")
                setIsSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "achievements"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Trophy className="h-5 w-5" />
              <span className="font-medium">{t("nav.achievements")}</span>
            </button>
          </nav>

          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {t("nav.settings")}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              {user?.isDemo ? "Salir del Demo" : t("common.logout")}
            </Button>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === "calendar" && <TaskCalendarManager user={user} onUserUpdate={handleUserUpdate} />}
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
              <AIAssistant
                userId={user?.id}
                credits={user?.ai_credits || 0}
                onCreditsUpdate={handleUpdateCredits}
                userPlan={user?.subscription_tier || user?.plan || "free"}
                onUpgrade={() => setActiveTab("subscription")}
              />
            )}
            {activeTab === "subscription" && !user?.isDemo && (
              <SubscriptionManager
                userId={user?.id}
                currentPlan={user?.subscription_tier || user?.plan || "free"}
                billingCycle={user?.billing_cycle || user?.billing || "monthly"}
              />
            )}
            {activeTab === "achievements" && (
              <AchievementsDisplay userId={user?.id} user={user} isDemo={user?.isDemo} />
            )}
          </div>
        </main>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} />

      <Toaster />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/20 to-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AppContent />
    </Suspense>
  )
}
