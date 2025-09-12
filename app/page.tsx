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
import { TaskManager } from "@/components/task-manager"
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
  Plus,
  Clock,
  TrendingUp,
} from "lucide-react"

export default function FutureTaskApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("calendar")
  const [showSettings, setShowSettings] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" })
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [authError, setAuthError] = useState("")

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
    setAuthError("")

    try {
      console.log("🔐 Attempting login for:", loginForm.email)
      const user = await getUserByEmail(loginForm.email)

      if (user) {
        console.log("👤 User found:", user.email)
        if (user.password === loginForm.password) {
          console.log("✅ Password correct, logging in")
          setCurrentUser(user)
          setLoginForm({ email: "", password: "" })
        } else {
          console.log("❌ Password incorrect")
          setAuthError("Contraseña incorrecta")
        }
      } else {
        console.log("❌ User not found")
        setAuthError("Usuario no encontrado")
      }
    } catch (error) {
      console.error("❌ Error during login:", error)
      setAuthError("Error al iniciar sesión. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError("")

    try {
      console.log("📝 Attempting registration for:", registerForm.email)
      const existingUser = await getUserByEmail(registerForm.email)

      if (existingUser) {
        console.log("❌ User already exists")
        setAuthError("El usuario ya existe")
        return
      }

      console.log("✅ Creating new user")
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

      console.log("✅ User created successfully:", newUser.email)
      setCurrentUser(newUser)
      setRegisterForm({ name: "", email: "", password: "" })
    } catch (error) {
      console.error("❌ Error during registration:", error)
      setAuthError("Error al registrarse. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActiveTab("calendar")
    setAuthError("")
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

              {authError && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{authError}</p>
                </div>
              )}

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
                      onChange={(e) => {
                        setLoginForm({ ...loginForm, email: e.target.value })
                        setAuthError("")
                      }}
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
                      onChange={(e) => {
                        setLoginForm({ ...loginForm, password: e.target.value })
                        setAuthError("")
                      }}
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
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setLoginForm({ email: "admin@futuretask.com", password: "535353-Jrl" })}
                      className="block w-full text-left text-xs text-slate-400 hover:text-slate-300 p-1 rounded hover:bg-slate-600/50"
                    >
                      Admin: admin@futuretask.com / 535353-Jrl
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginForm({ email: "demo@futuretask.com", password: "demo123" })}
                      className="block w-full text-left text-xs text-slate-400 hover:text-slate-300 p-1 rounded hover:bg-slate-600/50"
                    >
                      Demo: demo@futuretask.com / demo123
                    </button>
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
                      onChange={(e) => {
                        setRegisterForm({ ...registerForm, name: e.target.value })
                        setAuthError("")
                      }}
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
                      onChange={(e) => {
                        setRegisterForm({ ...registerForm, email: e.target.value })
                        setAuthError("")
                      }}
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
                      onChange={(e) => {
                        setRegisterForm({ ...registerForm, password: e.target.value })
                        setAuthError("")
                      }}
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Calendario principal */}
                  <div className="lg:col-span-2">
                    <Card className={`${theme.cardBg} ${theme.border}`}>
                      <CardHeader>
                        <CardTitle className={`${theme.textPrimary} flex items-center space-x-2`}>
                          <Calendar className="w-5 h-5 text-purple-400" />
                          <span>Calendario</span>
                        </CardTitle>
                        <CardDescription className={theme.textSecondary}>
                          {new Date().toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
                          <div className="grid grid-cols-7 gap-2 mb-4">
                            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                              <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
                                {day}
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 35 }, (_, i) => {
                              const date = new Date()
                              const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
                              const startDate = new Date(firstDay)
                              startDate.setDate(startDate.getDate() - firstDay.getDay())

                              const currentDate = new Date(startDate)
                              currentDate.setDate(startDate.getDate() + i)

                              const isCurrentMonth = currentDate.getMonth() === date.getMonth()
                              const isToday = currentDate.toDateString() === date.toDateString()
                              const hasTasks = Math.random() > 0.7 // Simulación de tareas

                              return (
                                <button
                                  key={i}
                                  className={`
                                    aspect-square p-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${
                                      isCurrentMonth
                                        ? isToday
                                          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                                          : "bg-slate-800 text-white hover:bg-slate-700"
                                        : "text-slate-600 hover:text-slate-400"
                                    }
                                    ${hasTasks && isCurrentMonth ? "ring-2 ring-cyan-400/50" : ""}
                                    hover:scale-105 active:scale-95
                                  `}
                                >
                                  <div className="flex flex-col items-center justify-center h-full">
                                    <span>{currentDate.getDate()}</span>
                                    {hasTasks && isCurrentMonth && (
                                      <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1"></div>
                                    )}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Panel lateral */}
                  <div className="space-y-6">
                    {/* Tareas de hoy */}
                    <Card className={`${theme.cardBg} ${theme.border}`}>
                      <CardHeader>
                        <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
                          <CheckSquare className="w-5 h-5 text-green-400" />
                          <span>Hoy</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { text: "Revisar emails", time: "09:00", completed: true },
                          { text: "Reunión de equipo", time: "10:30", completed: false },
                          { text: "Almuerzo con cliente", time: "13:00", completed: false },
                          { text: "Presentación proyecto", time: "15:00", completed: false },
                        ].map((task, index) => (
                          <div
                            key={index}
                            className={`flex items-center space-x-3 p-2 rounded-lg ${
                              task.completed ? "bg-green-500/10 border border-green-500/20" : "bg-slate-800/50"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${task.completed ? "bg-green-400" : "bg-purple-400"}`}
                            ></div>
                            <div className="flex-1">
                              <p
                                className={`text-sm ${task.completed ? "line-through text-slate-400" : theme.textPrimary}`}
                              >
                                {task.text}
                              </p>
                              <p className="text-xs text-slate-500">{task.time}</p>
                            </div>
                          </div>
                        ))}

                        <Button className={`w-full ${theme.buttonPrimary} mt-4`} size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar tarea
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Próximos eventos */}
                    <Card className={`${theme.cardBg} ${theme.border}`}>
                      <CardHeader>
                        <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span>Próximos</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { text: "Dentista", date: "Mañana", time: "10:00" },
                          { text: "Cumpleaños María", date: "Viernes", time: "Todo el día" },
                          { text: "Viaje a Madrid", date: "Próxima semana", time: "3 días" },
                        ].map((event, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-slate-800/50">
                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                            <div className="flex-1">
                              <p className={`text-sm ${theme.textPrimary}`}>{event.text}</p>
                              <p className="text-xs text-slate-500">
                                {event.date} • {event.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Estadísticas rápidas */}
                    <Card className={`${theme.cardBg} ${theme.border}`}>
                      <CardHeader>
                        <CardTitle className={`${theme.textPrimary} text-lg flex items-center space-x-2`}>
                          <TrendingUp className="w-5 h-5 text-yellow-400" />
                          <span>Resumen</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <div className="text-2xl font-bold text-purple-400">4</div>
                            <div className="text-xs text-slate-400">Tareas hoy</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="text-2xl font-bold text-green-400">75%</div>
                            <div className="text-xs text-slate-400">Completado</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="text-2xl font-bold text-blue-400">12</div>
                            <div className="text-xs text-slate-400">Esta semana</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <div className="text-2xl font-bold text-yellow-400">3</div>
                            <div className="text-xs text-slate-400">Pendientes</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tasks">
                <TaskManager theme={theme} t={t} />
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
