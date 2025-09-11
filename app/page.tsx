"use client"

import { useEffect } from "react"
import { useState } from "react"
import type React from "react"
import { NotificationService } from "@/components/notification-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SettingsModal } from "@/components/settings-modal"
import { DatabaseStatus } from "@/components/database-status"
import { AiAssistant } from "@/components/ai-assistant"
import { AICreditsDisplay } from "@/components/ai-credits-display"
import { getUserByEmail, createUser, updateUser, initializeAdminUser, type User } from "@/lib/database"
import {
  Calendar,
  CheckSquare,
  Heart,
  StickyNote,
  Settings,
  LogOut,
  Crown,
  Sparkles,
  UserIcon,
  Shield,
} from "lucide-react"

export default function FutureTaskApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("calendar")
  const [showSettings, setShowSettings] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" })
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeAdminUser()
        console.log("✅ Admin user initialized")
      } catch (error) {
        console.error("❌ Error initializing admin user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = await getUserByEmail(loginForm.email)
      if (user && user.password === loginForm.password) {
        setCurrentUser(user)
        setLoginForm({ email: "", password: "" })
      } else {
        alert("Credenciales incorrectas")
      }
    } catch (error) {
      console.error("Error during login:", error)
      alert("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const existingUser = await getUserByEmail(registerForm.email)
      if (existingUser) {
        alert("El usuario ya existe")
        return
      }

      const newUser = await createUser({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        language: "es",
        theme: "dark",
        is_premium: false,
        is_pro: false,
        onboarding_completed: false,
        pomodoro_sessions: 0,
        work_duration: 25,
        short_break_duration: 5,
        long_break_duration: 15,
        sessions_until_long_break: 4,
      })

      setCurrentUser(newUser)
      setRegisterForm({ name: "", email: "", password: "" })
    } catch (error) {
      console.error("Error during registration:", error)
      alert("Error al registrarse")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActiveTab("calendar")
  }

  const handleUserUpdate = async (updates: Partial<User>) => {
    if (!currentUser) return

    try {
      const updatedUser = await updateUser(currentUser.id, updates)
      if (updatedUser) {
        setCurrentUser(updatedUser)
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const upgradeToPremium = () => {
    if (currentUser) {
      handleUserUpdate({
        is_premium: true,
        premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }
  }

  const upgradeToPro = () => {
    if (currentUser) {
      handleUserUpdate({
        is_premium: true,
        is_pro: true,
        premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        ai_credits: 1000,
        ai_credits_used: 0,
        ai_total_cost_eur: 0,
      })
    }
  }

  const handleAIRequest = async (request: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      response: `Esta es una respuesta simulada para: "${request}". Las funciones de IA completas requieren configuración de OpenAI.`,
      tasks: [],
      wishlistItems: [],
      notes: [],
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando FutureTask...</div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Calendar className="h-8 w-8 text-purple-400" />
              FutureTask
            </CardTitle>
            <CardDescription className="text-slate-300">Tu calendario inteligente del futuro</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger value="login" className="text-white">
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white">
                  Registrarse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-white">
                      Contraseña
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                    {isLoading ? "Iniciando..." : "Iniciar Sesión"}
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-slate-300 mb-2">Cuentas de prueba:</p>
                  <div className="space-y-1 text-xs text-slate-400">
                    <div>Admin: admin@futuretask.com / 535353-Jrl</div>
                    <div>Demo: demo@futuretask.com / demo123</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Nombre
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password" className="text-white">
                      Contraseña
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                    {isLoading ? "Registrando..." : "Registrarse"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  const theme = {
    gradient: "from-slate-900 via-purple-900 to-slate-900",
    cardBg: "bg-slate-800/50 backdrop-blur-sm",
    border: "border-slate-700",
    textPrimary: "text-white",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-400",
    buttonPrimary: "bg-purple-600 hover:bg-purple-700",
    buttonSecondary: "bg-slate-700 hover:bg-slate-600",
    inputBg: "bg-slate-700 border-slate-600 text-white",
  }

  const t = (key: string) => key

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <NotificationService>
        <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">FutureTask</h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-slate-300" />
                  <span className="text-white font-medium">{currentUser.name}</span>
                  {currentUser.email === "admin@futuretask.com" && (
                    <Badge variant="secondary" className="bg-red-600 text-white">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                  {currentUser.is_pro && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                  {currentUser.is_premium && !currentUser.is_pro && (
                    <Badge variant="secondary" className="bg-yellow-600 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>

                {currentUser.is_pro && <AICreditsDisplay userId={currentUser.id} theme={theme} />}

                {!currentUser.is_premium && (
                  <Button onClick={upgradeToPremium} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    <Crown className="h-4 w-4 mr-1" />
                    Premium €1.99/mes
                  </Button>
                )}
                {!currentUser.is_pro && (
                  <Button onClick={upgradeToPro} size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Pro €4.99/mes
                  </Button>
                )}

                <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)} className="text-slate-300">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-300">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 backdrop-blur-sm">
              <TabsTrigger value="calendar" className="text-white data-[state=active]:bg-purple-600">
                <Calendar className="h-4 w-4 mr-2" />
                Calendario
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-white data-[state=active]:bg-purple-600">
                <CheckSquare className="h-4 w-4 mr-2" />
                Tareas
              </TabsTrigger>
              {currentUser.is_premium && (
                <TabsTrigger value="wishlist" className="text-white data-[state=active]:bg-purple-600">
                  <Heart className="h-4 w-4 mr-2" />
                  Objetivos
                </TabsTrigger>
              )}
              {currentUser.is_premium && (
                <TabsTrigger value="notes" className="text-white data-[state=active]:bg-purple-600">
                  <StickyNote className="h-4 w-4 mr-2" />
                  Notas
                </TabsTrigger>
              )}
              {currentUser.is_pro && (
                <TabsTrigger
                  value="ai"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  IA Assistant
                </TabsTrigger>
              )}
            </TabsList>

            <div className="mt-6">
              <TabsContent value="calendar">
                <Card className={`${theme.cardBg} ${theme.border}`}>
                  <CardHeader>
                    <CardTitle className={theme.textPrimary}>Calendario</CardTitle>
                    <CardDescription className={theme.textSecondary}>Gestiona tus tareas y eventos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className={theme.textSecondary}>
                      Funcionalidad del calendario en desarrollo. Próximamente disponible.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks">
                <Card className={`${theme.cardBg} ${theme.border}`}>
                  <CardHeader>
                    <CardTitle className={theme.textPrimary}>Gestión de Tareas</CardTitle>
                    <CardDescription className={theme.textSecondary}>
                      Organiza y completa tus tareas diarias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className={theme.textSecondary}>Sistema de tareas en desarrollo. Próximamente disponible.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {currentUser.is_premium && (
                <TabsContent value="wishlist">
                  <Card className={`${theme.cardBg} ${theme.border}`}>
                    <CardHeader>
                      <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
                        <Heart className="h-5 w-5 text-pink-400" />
                        Lista de Objetivos
                      </CardTitle>
                      <CardDescription className={theme.textSecondary}>Define y alcanza tus metas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className={theme.textSecondary}>
                        Sistema de objetivos disponible para usuarios Premium. En desarrollo.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {currentUser.is_premium && (
                <TabsContent value="notes">
                  <Card className={`${theme.cardBg} ${theme.border}`}>
                    <CardHeader>
                      <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
                        <StickyNote className="h-5 w-5 text-blue-400" />
                        Notas
                      </CardTitle>
                      <CardDescription className={theme.textSecondary}>Guarda tus ideas y pensamientos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className={theme.textSecondary}>
                        Sistema de notas disponible para usuarios Premium. En desarrollo.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {currentUser.is_pro && (
                <TabsContent value="ai">
                  <AiAssistant onAIRequest={handleAIRequest} theme={theme} t={t} user={currentUser} />
                </TabsContent>
              )}
            </div>
          </Tabs>

          <div className="mt-8">
            <DatabaseStatus theme={theme} />
          </div>
        </main>

        {showSettings && <SettingsModal user={currentUser} onUpdateUser={handleUserUpdate} theme={theme} t={t} />}
      </NotificationService>
    </div>
  )
}
