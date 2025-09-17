"use client"

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
import { AchievementsDisplay } from "@/components/achievements-display"
import { AchievementNotification } from "@/components/achievement-notification"
import { AiCreditsDisplay } from "@/components/ai-credits-display"
import { AiCreditsPurchase } from "@/components/ai-credits-purchase"
import { SettingsModal } from "@/components/settings-modal"
import { DatabaseStatus } from "@/components/database-status"
import { NotificationService } from "@/components/notification-service"
import { StatsCards } from "@/components/stats-cards"
import { useTheme } from "@/hooks/useTheme"
import {
  Calendar,
  CheckSquare,
  FileText,
  Heart,
  Brain,
  Trophy,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Crown,
  Star,
  BarChart3,
  CreditCard,
} from "lucide-react"
import { getUser, loginUser, registerUser, logoutUser, updateUserSubscription } from "@/lib/hybrid-database"
import { getUserAchievements, checkAndUnlockAchievements } from "@/lib/achievements"
import { getUserAICredits, addCreditsToUser } from "@/lib/ai-credits"

export default function FuturisticCalendar() {
  // Theme management
  const { theme, resolvedTheme, setTheme, themeConfig, mounted } = useTheme()

  // User state
  const [user, setUser] = useState(null)
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
  const [showCreditsPurchase, setShowCreditsPurchase] = useState(false)
  const [achievements, setAchievements] = useState([])
  const [newAchievement, setNewAchievement] = useState(null)
  const [aiCredits, setAiCredits] = useState(0)

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem("currentUser")
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          const fullUser = await getUser(userData.id)
          if (fullUser) {
            setUser(fullUser)
            await loadUserData(fullUser.id)
          }
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (mounted) {
      loadUser()
    }
  }, [mounted])

  // Load user-specific data
  const loadUserData = async (userId) => {
    try {
      const [userAchievements, credits] = await Promise.all([getUserAchievements(userId), getUserAICredits(userId)])

      setAchievements(userAchievements)
      setAiCredits(credits)
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  // Handle login
  const handleLogin = async (e) => {
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
  const handleRegister = async (e) => {
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
      setError("Error al registrarse")
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
  const handleSubscriptionUpgrade = async (plan, billing) => {
    if (!user) return

    try {
      const updatedUser = await updateUserSubscription(user.id, plan, billing)
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

  // Handle AI credits purchase
  const handleCreditsPurchase = async (packageId, credits, price) => {
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

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  // Get user plan info
  const getUserPlanInfo = () => {
    if (!user) return { plan: "free", isPremium: false, isPro: false }

    const isPremium = user.subscription_plan === "premium"
    const isPro = user.subscription_plan === "pro"

    return {
      plan: user.subscription_plan || "free",
      isPremium,
      isPro,
      isActive: user.subscription_status === "active",
    }
  }

  const planInfo = getUserPlanInfo()

  // Show loading screen
  if (!mounted || isLoading) {
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
    <div className={`min-h-screen ${themeConfig.bg} transition-colors duration-200`}>
      {/* Header */}
      <header className={`${themeConfig.cardBg} ${themeConfig.border} border-b sticky top-0 z-50 backdrop-blur-sm`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-purple-500" />
              <h1 className={`text-xl font-bold ${themeConfig.textPrimary}`}>FutureTask</h1>
              <DatabaseStatus />
            </div>

            <div className="flex items-center gap-4">
              {/* AI Credits Display */}
              {planInfo.isPro && (
                <AiCreditsDisplay credits={aiCredits} onPurchaseCredits={() => setShowCreditsPurchase(true)} />
              )}

              {/* User Plan Badge */}
              <Badge
                variant={planInfo.isPro ? "default" : planInfo.isPremium ? "secondary" : "outline"}
                className={`flex items-center gap-1 ${
                  planInfo.isPro
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : planInfo.isPremium
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                      : "text-gray-600"
                }`}
              >
                {planInfo.isPro ? (
                  <Crown className="h-3 w-3" />
                ) : planInfo.isPremium ? (
                  <Star className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                {planInfo.plan.toUpperCase()}
              </Badge>

              {/* Theme Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <Button
                  variant={theme === "light" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleThemeChange("light")}
                  className="h-8 w-8 p-0"
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleThemeChange("dark")}
                  className="h-8 w-8 p-0"
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleThemeChange("system")}
                  className="h-8 w-8 p-0"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAchievements(true)}
                  className="flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  <Badge variant="secondary">{achievements.length}</Badge>
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
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Tareas</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendario</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Notas</span>
            </TabsTrigger>
            {planInfo.isPremium && (
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
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Plan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6">
              <StatsCards user={user} theme={themeConfig} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TaskManager userId={user.id} theme={themeConfig} />
                <CalendarWidget userId={user.id} theme={themeConfig} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManager userId={user.id} theme={themeConfig} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarWidget userId={user.id} theme={themeConfig} />
          </TabsContent>

          <TabsContent value="notes">
            <NotesManager userId={user.id} theme={themeConfig} />
          </TabsContent>

          {planInfo.isPremium && (
            <TabsContent value="wishlist">
              <WishlistManager userId={user.id} theme={themeConfig} />
            </TabsContent>
          )}

          {planInfo.isPro && (
            <TabsContent value="ai">
              <AiAssistant userId={user.id} credits={aiCredits} onCreditsUpdate={setAiCredits} theme={themeConfig} />
            </TabsContent>
          )}

          <TabsContent value="subscription">
            <div className="space-y-6">
              <Card className={`${themeConfig.cardBg} ${themeConfig.border}`}>
                <CardHeader>
                  <CardTitle className={themeConfig.textPrimary}>Tu Plan Actual</CardTitle>
                  <CardDescription>Gestiona tu suscripción y funcionalidades</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-lg font-semibold ${themeConfig.textPrimary}`}>
                        Plan {planInfo.plan.charAt(0).toUpperCase() + planInfo.plan.slice(1)}
                      </h3>
                      <p className={themeConfig.textSecondary}>
                        {planInfo.plan === "free" && "Funcionalidades básicas"}
                        {planInfo.plan === "premium" && "Funcionalidades avanzadas + Wishlist"}
                        {planInfo.plan === "pro" && "Todas las funcionalidades + IA"}
                      </p>
                    </div>
                    <Badge
                      variant={planInfo.isActive ? "default" : "secondary"}
                      className={planInfo.isPro ? "bg-gradient-to-r from-purple-500 to-blue-500" : ""}
                    >
                      {planInfo.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>

                  {planInfo.plan === "free" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          onClick={() => handleSubscriptionUpgrade("premium", "monthly")}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Actualizar a Premium
                        </Button>
                        <Button
                          onClick={() => handleSubscriptionUpgrade("pro", "monthly")}
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        >
                          <Crown className="h-4 w-4 mr-2" />
                          Actualizar a Pro
                        </Button>
                      </div>
                    </div>
                  )}

                  {planInfo.isPro && (
                    <div className="space-y-4">
                      <AiCreditsDisplay
                        credits={aiCredits}
                        onPurchaseCredits={() => setShowCreditsPurchase(true)}
                        showDetails={true}
                        theme={themeConfig}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals and Overlays */}
      {showSettings && (
        <SettingsModal user={user} onClose={() => setShowSettings(false)} onUserUpdate={setUser} theme={themeConfig} />
      )}

      {showAchievements && (
        <AchievementsDisplay
          achievements={achievements}
          onClose={() => setShowAchievements(false)}
          theme={themeConfig}
        />
      )}

      {showCreditsPurchase && planInfo.isPro && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`${themeConfig.cardBg} rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${themeConfig.textPrimary}`}>Comprar Créditos IA</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowCreditsPurchase(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <AiCreditsPurchase
                userId={user.id}
                currentCredits={aiCredits}
                onPurchase={handleCreditsPurchase}
                theme={themeConfig}
              />
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
