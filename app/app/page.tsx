"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TaskManager } from "@/components/task-manager"
import { CalendarWidget } from "@/components/calendar-widget"
import { NotesManager } from "@/components/notes-manager"
import { WishlistManager } from "@/components/wishlist-manager"
import { AiAssistant } from "@/components/ai-assistant"
import { AchievementsBadgeViewer } from "@/components/achievements-badge-viewer"
import { AchievementNotification } from "@/components/achievement-notification"
import { AiCreditsDisplay } from "@/components/ai-credits-display"
import { AiCreditsPurchase } from "@/components/ai-credits-purchase"
import { SettingsModal } from "@/components/settings-modal"
import { NotificationService } from "@/components/notification-service"
import { StatsCards } from "@/components/stats-cards"
import { SubscriptionModal } from "@/components/subscription-modal"
import { useTheme } from "@/hooks/useTheme"
import { LanguageProvider, useLanguage } from "@/hooks/useLanguage"
import { LanguageSelector } from "@/components/language-selector"
import {
  Calendar,
  FileText,
  Heart,
  Brain,
  Trophy,
  Settings,
  LogOut,
  Crown,
  Star,
  BarChart3,
  ArrowLeft,
  CreditCard,
} from "lucide-react"
import { loginUser, registerUser, logoutUser, updateUserSubscription } from "@/lib/hybrid-database"
import { checkAndUnlockAchievements } from "@/lib/achievements"
import { getUserAICredits, addCreditsToUser } from "@/lib/ai-credits"

function FuturisticCalendarContent() {
  // Theme and language management
  const { theme, resolvedTheme, setTheme, themeConfig, mounted } = useTheme()
  const { language, t } = useLanguage()

  // User state
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginMode, setIsLoginMode] = useState(true)

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  // App states
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showSettings, setShowSettings] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showCreditsPurchase, setShowCreditsPurchase] = useState(false)
  const [achievements, setAchievements] = useState<any[]>([])
  const [newAchievement, setNewAchievement] = useState<any>(null)
  const [aiCredits, setAiCredits] = useState(0)

  // Sample achievements data
  const sampleAchievements = [
    {
      id: "1",
      name: "Primer Paso",
      description: "Completa tu primera tarea",
      icon: "🎯",
      category: "basic",
      points: 10,
      unlocked: true,
      progress: 1,
      target: 1,
      unlockedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Productivo",
      description: "Completa 10 tareas",
      icon: "⚡",
      category: "basic",
      points: 25,
      unlocked: false,
      progress: 3,
      target: 10,
    },
    {
      id: "3",
      name: "Organizador Premium",
      description: "Crea 5 notas",
      icon: "📝",
      category: "premium",
      points: 20,
      unlocked: false,
      progress: 0,
      target: 5,
    },
    {
      id: "4",
      name: "Maestro IA",
      description: "Usa el asistente IA 50 veces",
      icon: "🤖",
      category: "pro",
      points: 50,
      unlocked: false,
      progress: 0,
      target: 50,
    },
  ]

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem("currentUser")
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          await loadUserData(userData.id)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Only load after component is mounted
    if (mounted) {
      loadUser()
    } else {
      // If not mounted yet, just stop loading
      setIsLoading(false)
    }
  }, [mounted])

  // Load user-specific data
  const loadUserData = async (userId: string) => {
    try {
      const [userAchievements, credits] = await Promise.all([
        Promise.resolve(sampleAchievements), // Using sample data
        getUserAICredits(userId),
      ])

      setAchievements(userAchievements)
      setAiCredits(credits)
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const loggedInUser = await loginUser(email, password)
      if (loggedInUser) {
        setUser(loggedInUser)
        localStorage.setItem("currentUser", JSON.stringify(loggedInUser))
        await loadUserData(loggedInUser.id)

        // Check for achievements after login
        const unlockedAchievements = await checkAndUnlockAchievements(loggedInUser.id, "login")
        if (unlockedAchievements.length > 0) {
          setNewAchievement(unlockedAchievements[0])
        }
      } else {
        setError("Credenciales inválidas")
      }
    } catch (error) {
      setError("Error al iniciar sesión")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const newUser = await registerUser(email, password, name)
      if (newUser) {
        setUser(newUser)
        localStorage.setItem("currentUser", JSON.stringify(newUser))
        await loadUserData(newUser.id)

        // Check for achievements after registration
        const unlockedAchievements = await checkAndUnlockAchievements(newUser.id, "register")
        if (unlockedAchievements.length > 0) {
          setNewAchievement(unlockedAchievements[0])
        }
      } else {
        setError("Error al crear la cuenta")
      }
    } catch (error) {
      setError("Error en el registro")
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutUser()
      setUser(null)
      setAchievements([])
      setAiCredits(0)
      localStorage.removeItem("currentUser")
      setActiveTab("dashboard")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Handle subscription upgrade
  const handleSubscriptionUpgrade = async (planId: string, billing?: string) => {
    if (!user) return

    try {
      // Map plan IDs to simple names for the database
      let planName = "free"
      if (planId.includes("premium")) planName = "premium"
      if (planId.includes("pro")) planName = "pro"

      const updatedUser = await updateUserSubscription(user.id, planName, "active")
      if (updatedUser) {
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))

        // Check for achievements after subscription upgrade
        const unlockedAchievements = await checkAndUnlockAchievements(user.id, "subscription_upgrade")
        if (unlockedAchievements.length > 0) {
          setNewAchievement(unlockedAchievements[0])
        }
      }
    } catch (error) {
      console.error("Subscription upgrade error:", error)
    }
  }

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!user) return

    try {
      const updatedUser = await updateUserSubscription(user.id, "free", "canceled")
      if (updatedUser) {
        setUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error("Subscription cancellation error:", error)
    }
  }

  // Handle AI credits purchase
  const handleCreditsPurchase = async (packageId: string, credits: number, price: number) => {
    if (!user) return

    try {
      // In a real app, this would integrate with PayPal
      // For demo purposes, we'll just add the credits
      const success = await addCreditsToUser(user.id, credits)
      if (success) {
        setAiCredits((prev) => prev + credits)
        setShowCreditsPurchase(false)

        // Check for achievements after purchase
        const unlockedAchievements = await checkAndUnlockAchievements(user.id, "credits_purchase")
        if (unlockedAchievements.length > 0) {
          setNewAchievement(unlockedAchievements[0])
        }
      }
    } catch (error) {
      console.error("Credits purchase error:", error)
    }
  }

  // Handle user update
  const handleUserUpdate = (updates: any) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setShowSettings(false)
    }
  }

  // Get user plan info
  const getUserPlanInfo = () => {
    if (!user) return { plan: "free", isFree: true, isPremium: false, isPro: false }

    const plan = user.subscription_plan || "free"
    const isFree = plan === "free"
    const isPremium = plan.includes("premium")
    const isPro = plan.includes("pro")

    return {
      plan,
      isFree,
      isPremium,
      isPro,
      isActive: user.subscription_status === "active" || plan === "free",
    }
  }

  const planInfo = getUserPlanInfo()

  // Show loading screen only if actually loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white">Cargando FutureTask...</p>
        </div>
      </div>
    )
  }

  // Show login/register form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/")}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>

              {/* Language Selector */}
              <LanguageSelector variant="compact" />
            </div>
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Calendar className="h-6 w-6 text-purple-400" />
              FutureTask
            </CardTitle>
            <CardDescription className="text-slate-300">
              {isLoginMode ? "Inicia sesión en tu cuenta" : "Crea tu cuenta gratuita"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-4">
              {!isLoginMode && (
                <div>
                  <Label htmlFor="name" className="text-slate-200">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-slate-200">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              {error && <div className="text-red-400 text-sm text-center">{error}</div>}

              {/* Demo Users Info */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-slate-300 text-sm mb-2">Usuarios de prueba:</p>
                <div className="space-y-1 text-xs">
                  <div className="text-slate-400">Gratuito: demo@futuretask.com / demo123</div>
                  <div className="text-slate-400">Premium: premium@futuretask.com / premium123</div>
                  <div className="text-slate-400">Pro: pro@futuretask.com / pro123</div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "Cargando..." : isLoginMode ? "Iniciar Sesión" : "Registrarse"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                {isLoginMode ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main application interface
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-200`}
    >
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/")}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Landing
              </Button>
              <Calendar className="h-6 w-6 text-purple-500" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">FutureTask</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* AI Credits Display */}
              {planInfo.isPro && (
                <AiCreditsDisplay credits={aiCredits} onPurchaseCredits={() => setShowCreditsPurchase(true)} />
              )}

              {/* Language Selector */}
              <LanguageSelector variant="compact" />

              {/* Subscription Button */}
              <Button
                variant="outline"
                onClick={() => setShowSubscriptionModal(true)}
                className="flex items-center gap-2 bg-transparent"
              >
                <CreditCard className="h-4 w-4" />
                <Badge
                  className={`${
                    planInfo.isPro
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : planInfo.isPremium
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                        : "bg-gray-500 text-white"
                  } border-none`}
                >
                  {planInfo.isPro && <Crown className="h-3 w-3 mr-1" />}
                  {planInfo.isPremium && <Star className="h-3 w-3 mr-1" />}
                  {planInfo.plan.toUpperCase()}
                </Badge>
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAchievements(true)}
                  className="flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  <Badge variant="secondary">{achievements.filter((a) => a.unlocked).length}</Badge>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Notas</span>
            </TabsTrigger>
            {(planInfo.isPremium || planInfo.isPro) && (
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Wishlist</span>
              </TabsTrigger>
            )}
            {planInfo.isPro && (
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">IA</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6">
              <StatsCards user={user} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TaskManager userId={user.id} />
                <CalendarWidget userId={user.id} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <NotesManager userId={user.id} isPremium={planInfo.isPremium || planInfo.isPro} />
          </TabsContent>

          {(planInfo.isPremium || planInfo.isPro) && (
            <TabsContent value="wishlist">
              <WishlistManager userId={user.id} />
            </TabsContent>
          )}

          {!planInfo.isPro && (
            <TabsContent value="ai">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="text-center py-12">
                  <Brain className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Asistente IA Pro</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Potencia tu productividad con nuestro asistente de inteligencia artificial
                  </p>
                  <Button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Actualizar a Pro
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {planInfo.isPro && (
            <TabsContent value="ai">
              <AiAssistant userId={user.id} credits={aiCredits} onCreditsUpdate={setAiCredits} />
            </TabsContent>
          )}

          {!planInfo.isPremium && !planInfo.isPro && (
            <TabsContent value="wishlist">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent className="text-center py-12">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Lista de Deseos Premium</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Organiza tus deseos y metas con nuestra lista de deseos avanzada
                  </p>
                  <Button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Actualizar a Premium
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Modals and Overlays */}
      {showSettings && <SettingsModal user={user} onUpdateUser={handleUserUpdate} t={t} />}

      {showAchievements && (
        <AchievementsBadgeViewer
          achievements={achievements}
          onClose={() => setShowAchievements(false)}
          userPlan={planInfo.plan}
        />
      )}

      {showSubscriptionModal && (
        <SubscriptionModal
          currentPlan={planInfo.plan}
          onPlanChange={handleSubscriptionUpgrade}
          onCancelSubscription={handleCancelSubscription}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}

      {showCreditsPurchase && planInfo.isPro && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Comprar Créditos IA</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowCreditsPurchase(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <AiCreditsPurchase userId={user.id} currentCredits={aiCredits} onPurchase={handleCreditsPurchase} />
            </div>
          </div>
        </div>
      )}

      {/* Achievement Notification */}
      {newAchievement && (
        <AchievementNotification achievement={newAchievement} onClose={() => setNewAchievement(null)} />
      )}

      {/* Notification Service */}
      <NotificationService userId={user.id} />
    </div>
  )
}

export default function FuturisticCalendar() {
  return (
    <LanguageProvider>
      <FuturisticCalendarContent />
    </LanguageProvider>
  )
}
