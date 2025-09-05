"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  Crown,
  Search,
  Trash2,
  CheckCircle,
  Target,
  Trophy,
  Flame,
  Edit,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Lock,
} from "lucide-react"

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

interface Task {
  id: string
  text: string
  description?: string
  completed: boolean
  date: string
  category: "work" | "personal" | "health" | "learning" | "other"
  priority: "low" | "medium" | "high"
  completedAt?: string
  time?: string
  notificationEnabled?: boolean
}

interface UserStats {
  totalTasks: number
  completedTasks: number
  achievements: number
  streak: number
}

// Credenciales de administrador
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "535353-Jrl", // Cambiar de "FutureTask2024!" a "535353-Jrl"
}

export default function AdminPanel() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")

  // Admin state
  const [users, setUsers] = useState<User[]>([])
  const [allTasks, setAllTasks] = useState<Record<string, Task[]>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userStats, setUserStats] = useState<Record<string, UserStats>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showDataManager, setShowDataManager] = useState(false)

  // Form states
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPassword, setFormPassword] = useState("")
  const [formLanguage, setFormLanguage] = useState<"es" | "en" | "de" | "fr" | "it">("es")
  const [formTheme, setFormTheme] = useState("default")
  const [formIsPremium, setFormIsPremium] = useState(false)

  // Verificar autenticación al cargar
  useEffect(() => {
    const savedAuth = localStorage.getItem("futureTask_admin_auth")
    if (savedAuth) {
      const authData = JSON.parse(savedAuth)
      const now = new Date().getTime()
      // Sesión válida por 24 horas
      if (authData.expires > now) {
        setIsAuthenticated(true)
        loadData()
      } else {
        localStorage.removeItem("futureTask_admin_auth")
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleLogin = () => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const authData = {
        authenticated: true,
        expires: new Date().getTime() + 24 * 60 * 60 * 1000, // 24 horas
      }
      localStorage.setItem("futureTask_admin_auth", JSON.stringify(authData))
      setIsAuthenticated(true)
      setAuthError("")
      loadData()
    } else {
      setAuthError("Usuario o contraseña incorrectos")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("futureTask_admin_auth")
    setIsAuthenticated(false)
    setUsername("")
    setPassword("")
  }

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Cargar usuarios
      const savedUsers = localStorage.getItem("futureTask_users") || "[]"
      const parsedUsers = JSON.parse(savedUsers)

      if (parsedUsers.length === 0) {
        // Crear usuarios de ejemplo si no hay ninguno
        const exampleUsers: User[] = [
          {
            id: "1",
            name: "Juan Pérez",
            email: "juan@example.com",
            password: "123456",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            theme: "default",
            language: "es",
            isPremium: true,
            premiumExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            onboardingCompleted: true,
            pomodoroSessions: 25,
          },
          {
            id: "2",
            name: "María García",
            email: "maria@example.com",
            password: "123456",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            theme: "ocean",
            language: "es",
            isPremium: false,
            onboardingCompleted: true,
            pomodoroSessions: 8,
          },
          {
            id: "3",
            name: "John Smith",
            email: "john@example.com",
            password: "123456",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            theme: "forest",
            language: "en",
            isPremium: false,
            onboardingCompleted: false,
            pomodoroSessions: 3,
          },
        ]
        setUsers(exampleUsers)
        localStorage.setItem("futureTask_users", JSON.stringify(exampleUsers))

        // Crear tareas de ejemplo
        exampleUsers.forEach((user) => {
          const exampleTasks = [
            {
              id: `${user.id}_task_1`,
              text: "Revisar emails",
              completed: true,
              date: new Date().toISOString().split("T")[0],
              category: "work" as const,
              priority: "medium" as const,
            },
            {
              id: `${user.id}_task_2`,
              text: "Hacer ejercicio",
              completed: false,
              date: new Date().toISOString().split("T")[0],
              category: "health" as const,
              priority: "high" as const,
            },
          ]
          localStorage.setItem(`futureTask_tasks_${user.id}`, JSON.stringify(exampleTasks))
        })
      } else {
        setUsers(parsedUsers)
      }

      // Cargar todas las tareas
      const tasksData: Record<string, Task[]> = {}
      parsedUsers.forEach((user: User) => {
        const userTasks = localStorage.getItem(`futureTask_tasks_${user.id}`)
        if (userTasks) {
          tasksData[user.id] = JSON.parse(userTasks)
        } else {
          tasksData[user.id] = []
        }
      })
      setAllTasks(tasksData)
    } catch (error) {
      console.error("Error loading data:", error)
      setUsers([])
      setAllTasks({})
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Calcular estadísticas para cada usuario
    const stats: Record<string, UserStats> = {}

    users.forEach((user) => {
      const userTasks = allTasks[user.id] || []
      const completedTasks = userTasks.filter((task: Task) => task.completed)

      // Calcular racha (simplificado)
      const completedDates = [...new Set(completedTasks.map((t: Task) => t.date))].sort()
      let streak = 0
      if (completedDates.length > 0) {
        streak = completedDates.length // Simplificado para el ejemplo
      }

      stats[user.id] = {
        totalTasks: userTasks.length,
        completedTasks: completedTasks.length,
        achievements: Math.floor(completedTasks.length / 5), // 1 logro cada 5 tareas
        streak,
      }
    })

    setUserStats(stats)
  }, [users, allTasks])

  const deleteUser = (userId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.")) {
      return
    }

    const updatedUsers = users.filter((user) => user.id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem("futureTask_users", JSON.stringify(updatedUsers))

    // Delete user-specific data
    localStorage.removeItem(`futureTask_tasks_${userId}`)
    localStorage.removeItem(`futureTask_wishlist_${userId}`)
    localStorage.removeItem(`futureTask_notes_${userId}`)
    localStorage.removeItem(`futureTask_templates_${userId}`)
    localStorage.removeItem(`futureTask_achievements_${userId}`)

    // Update allTasks state
    const newAllTasks = { ...allTasks }
    delete newAllTasks[userId]
    setAllTasks(newAllTasks)

    if (selectedUser?.id === userId) {
      setSelectedUser(null)
    }
  }

  const togglePremium = (userId: string) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          isPremium: !user.isPremium,
          premiumExpiry: !user.isPremium ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        }
      }
      return user
    })
    setUsers(updatedUsers)
    localStorage.setItem("futureTask_users", JSON.stringify(updatedUsers))
    if (selectedUser?.id === userId) {
      setSelectedUser(updatedUsers.find((u) => u.id === userId) || null)
    }
  }

  const startEditUser = (user: User) => {
    setEditingUser(user)
    setFormName(user.name)
    setFormEmail(user.email)
    setFormPassword(user.password)
    setFormLanguage(user.language)
    setFormTheme(user.theme)
    setFormIsPremium(user.isPremium)
  }

  const saveUser = () => {
    if (!formName.trim() || !formEmail.trim()) {
      alert("Nombre y email son obligatorios")
      return
    }

    if (editingUser) {
      // Editar usuario existente
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              name: formName,
              email: formEmail,
              password: formPassword,
              language: formLanguage,
              theme: formTheme,
              isPremium: formIsPremium,
              premiumExpiry: formIsPremium ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
            }
          : user,
      )
      setUsers(updatedUsers)
      localStorage.setItem("futureTask_users", JSON.stringify(updatedUsers))
      setEditingUser(null)
    } else {
      // Crear nuevo usuario
      const newUser: User = {
        id: Date.now().toString(),
        name: formName,
        email: formEmail,
        password: formPassword,
        createdAt: new Date().toISOString(),
        theme: formTheme,
        language: formLanguage,
        isPremium: formIsPremium,
        premiumExpiry: formIsPremium ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        onboardingCompleted: true,
        pomodoroSessions: 0,
      }

      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      localStorage.setItem("futureTask_users", JSON.stringify(updatedUsers))

      // Inicializar datos del usuario
      localStorage.setItem(`futureTask_tasks_${newUser.id}`, JSON.stringify([]))
      localStorage.setItem(`futureTask_wishlist_${newUser.id}`, JSON.stringify([]))
      localStorage.setItem(`futureTask_notes_${newUser.id}`, JSON.stringify([]))

      setAllTasks((prev) => ({ ...prev, [newUser.id]: [] }))
      setShowAddUser(false)
    }

    // Reset form
    setFormName("")
    setFormEmail("")
    setFormPassword("")
    setFormLanguage("es")
    setFormTheme("default")
    setFormIsPremium(false)
  }

  const exportData = () => {
    const data = {
      users,
      tasks: allTasks,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `futuretask-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        if (
          confirm("¿Estás seguro de que quieres importar estos datos? Esto sobrescribirá todos los datos actuales.")
        ) {
          // Importar usuarios
          setUsers(data.users || [])
          localStorage.setItem("futureTask_users", JSON.stringify(data.users || []))

          // Importar tareas
          setAllTasks(data.tasks || {})
          Object.entries(data.tasks || {}).forEach(([userId, tasks]) => {
            localStorage.setItem(`futureTask_tasks_${userId}`, JSON.stringify(tasks))
          })

          alert("Datos importados correctamente")
          loadData()
        }
      } catch (error) {
        alert("Error al importar los datos. Verifica que el archivo sea válido.")
        console.error("Import error:", error)
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = () => {
    if (!confirm("¿ESTÁS SEGURO? Esto eliminará TODOS los datos de la aplicación. Esta acción NO se puede deshacer.")) {
      return
    }

    if (!confirm("ÚLTIMA CONFIRMACIÓN: ¿Realmente quieres eliminar todos los datos?")) {
      return
    }

    // Limpiar localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("futureTask_")) {
        localStorage.removeItem(key)
      }
    })

    // Reset state
    setUsers([])
    setAllTasks({})
    setSelectedUser(null)
    setUserStats({})

    alert("Todos los datos han sido eliminados")
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalUsers = users.length
  const premiumUsers = users.filter((u) => u.isPremium).length
  const activeUsers = users.filter((u) => u.onboardingCompleted).length

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🛠️ Panel de Administración
            </CardTitle>
            <p className="text-gray-300">Acceso restringido - Solo administradores</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                Usuario
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white"
                placeholder="Ingresa tu usuario"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white"
                placeholder="Ingresa tu contraseña"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            {authError && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{authError}</p>
              </div>
            )}
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
            >
              <Lock className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Button>
            <div className="text-center">
              <Button
                onClick={() => (window.location.href = "/")}
                variant="ghost"
                className="text-purple-300 hover:text-white"
              >
                ← Volver a la aplicación
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <div className="text-white text-lg font-semibold">Cargando Panel de Administración...</div>
          <div className="text-gray-300 text-sm">Preparando estadísticas y datos</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🛠️ Panel de Administración
            </h1>
            <p className="text-gray-300">Gestiona usuarios y datos de FutureTask</p>
          </div>
          <div className="flex space-x-2 flex-wrap">
            <Button
              onClick={() => setShowDataManager(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"
            >
              📊 Gestionar Datos
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/30 text-red-300 hover:bg-red-500/20 bg-transparent"
            >
              <Lock className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
            >
              🏠 Volver a la App
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-300">Total Usuarios</p>
                  <p className="text-2xl font-bold text-white">{totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-300">Usuarios Premium</p>
                  <p className="text-2xl font-bold text-white">{premiumUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-300">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-white">{activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-300">Tasa Conversión</p>
                  <p className="text-2xl font-bold text-white">
                    {totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <Card className="lg:col-span-2 bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Lista de Usuarios ({filteredUsers.length})</span>
                </CardTitle>
                <Button
                  onClick={() => setShowAddUser(true)}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Nuevo Usuario
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedUser?.id === user.id
                        ? "bg-purple-500/20 border-purple-400/60"
                        : "bg-black/30 border-purple-500/30 hover:bg-purple-500/10"
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-white">{user.name}</h4>
                          {user.isPremium && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                              Premium
                            </Badge>
                          )}
                          {!user.onboardingCompleted && (
                            <Badge variant="outline" className="text-xs border-orange-400 text-orange-300">
                              Nuevo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-300">{user.email}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-400">
                            📅 {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-400">🌍 {user.language.toUpperCase()}</span>
                          {userStats[user.id] && (
                            <span className="text-xs text-gray-400">✅ {userStats[user.id].completedTasks} tareas</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditUser(user)
                          }}
                          className="text-blue-300 hover:bg-blue-500/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePremium(user.id)
                          }}
                          className="text-yellow-300 hover:bg-yellow-500/20"
                        >
                          <Crown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteUser(user.id)
                          }}
                          className="text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="p-4 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-white">No se encontraron usuarios</p>
                    <p className="text-gray-400">Intenta con otro término de búsqueda</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Details */}
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">
                {selectedUser ? "Detalles del Usuario" : "Selecciona un Usuario"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl font-bold">{selectedUser.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                    <p className="text-gray-300">{selectedUser.email}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">ID:</span>
                      <span className="text-white font-mono text-sm">{selectedUser.id}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Estado:</span>
                      <Badge
                        className={
                          selectedUser.isPremium ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-gray-600"
                        }
                      >
                        {selectedUser.isPremium ? "Premium" : "Gratuito"}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Idioma:</span>
                      <span className="text-white">{selectedUser.language.toUpperCase()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Tema:</span>
                      <span className="text-white capitalize">{selectedUser.theme}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Registro:</span>
                      <span className="text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Onboarding:</span>
                      <Badge className={selectedUser.onboardingCompleted ? "bg-green-600" : "bg-orange-600"}>
                        {selectedUser.onboardingCompleted ? "Completado" : "Pendiente"}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Sesiones Pomodoro:</span>
                      <span className="text-white">{selectedUser.pomodoroSessions}</span>
                    </div>

                    {selectedUser.isPremium && selectedUser.premiumExpiry && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Premium hasta:</span>
                        <span className="text-white">{new Date(selectedUser.premiumExpiry).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {userStats[selectedUser.id] && (
                    <div className="border-t border-purple-500/30 pt-4">
                      <h4 className="text-white font-semibold mb-3">Estadísticas</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Target className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-gray-300">Tareas</span>
                          </div>
                          <p className="text-lg font-bold text-white">{userStats[selectedUser.id].totalTasks}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-gray-300">Completadas</span>
                          </div>
                          <p className="text-lg font-bold text-white">{userStats[selectedUser.id].completedTasks}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs text-gray-300">Logros</span>
                          </div>
                          <p className="text-lg font-bold text-white">{userStats[selectedUser.id].achievements}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="text-xs text-gray-300">Racha</span>
                          </div>
                          <p className="text-lg font-bold text-white">{userStats[selectedUser.id].streak}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={() => startEditUser(selectedUser)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => togglePremium(selectedUser.id)}
                      className={`flex-1 ${
                        selectedUser.isPremium
                          ? "bg-gray-600 hover:bg-gray-700"
                          : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90"
                      }`}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      {selectedUser.isPremium ? "Quitar Premium" : "Dar Premium"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">Selecciona un usuario de la lista para ver sus detalles</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <Dialog
        open={showAddUser || editingUser !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddUser(false)
            setEditingUser(null)
            setFormName("")
            setFormEmail("")
            setFormPassword("")
            setFormLanguage("es")
            setFormTheme("default")
            setFormIsPremium(false)
          }
        }}
      >
        <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300">Nombre</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white"
                placeholder="Nombre del usuario"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <Input
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white"
                placeholder="email@ejemplo.com"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Contraseña</label>
              <Input
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white"
                placeholder="Contraseña"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Idioma</label>
              <Select value={formLanguage} onValueChange={(value) => setFormLanguage(value as any)}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  <SelectItem value="es" className="text-white">
                    Español
                  </SelectItem>
                  <SelectItem value="en" className="text-white">
                    English
                  </SelectItem>
                  <SelectItem value="fr" className="text-white">
                    Français
                  </SelectItem>
                  <SelectItem value="de" className="text-white">
                    Deutsch
                  </SelectItem>
                  <SelectItem value="it" className="text-white">
                    Italiano
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-300">Tema</label>
              <Select value={formTheme} onValueChange={setFormTheme}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  <SelectItem value="default" className="text-white">
                    Futurista
                  </SelectItem>
                  <SelectItem value="light" className="text-white">
                    Claro
                  </SelectItem>
                  <SelectItem value="dark" className="text-white">
                    Oscuro
                  </SelectItem>
                  <SelectItem value="ocean" className="text-white">
                    Océano
                  </SelectItem>
                  <SelectItem value="forest" className="text-white">
                    Bosque
                  </SelectItem>
                  <SelectItem value="neon" className="text-white">
                    Neón
                  </SelectItem>
                  <SelectItem value="galaxy" className="text-white">
                    Galaxia
                  </SelectItem>
                  <SelectItem value="sunset" className="text-white">
                    Atardecer
                  </SelectItem>
                  <SelectItem value="aurora" className="text-white">
                    Aurora
                  </SelectItem>
                  <SelectItem value="cyberpunk" className="text-white">
                    Cyberpunk
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPremium"
                checked={formIsPremium}
                onChange={(e) => setFormIsPremium(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isPremium" className="text-sm text-gray-300">
                Usuario Premium
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddUser(false)
                setEditingUser(null)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={saveUser} className="bg-gradient-to-r from-purple-500 to-cyan-500">
              {editingUser ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Data Manager Modal */}
      <Dialog open={showDataManager} onOpenChange={setShowDataManager}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>📊 Gestión de Datos</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Export/Import */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-300">Backup y Restauración</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={exportData}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Datos
                </Button>
                <div>
                  <input type="file" accept=".json" onChange={importData} className="hidden" id="import-file" />
                  <Button
                    onClick={() => document.getElementById("import-file")?.click()}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Datos
                  </Button>
                </div>
              </div>
            </div>

            {/* Refresh */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-300">Actualización</h3>
              <Button
                onClick={loadData}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recargar Datos
              </Button>
            </div>

            {/* Danger Zone */}
            <div className="space-y-4 border-t border-red-500/30 pt-4">
              <h3 className="text-lg font-semibold text-red-400">⚠️ Zona Peligrosa</h3>
              <p className="text-sm text-gray-300">
                Estas acciones son irreversibles. Asegúrate de hacer un backup antes.
              </p>
              <Button
                onClick={clearAllData}
                className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Todos los Datos
              </Button>
            </div>

            {/* Database Info */}
            <div className="space-y-4 border-t border-purple-500/30 pt-4">
              <h3 className="text-lg font-semibold text-purple-300">📋 Información de la Base de Datos</h3>
              <div className="bg-black/30 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total de usuarios:</span>
                  <span className="text-white">{users.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total de tareas:</span>
                  <span className="text-white">{Object.values(allTasks).flat().length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Claves en localStorage:</span>
                  <span className="text-white">
                    {Object.keys(localStorage).filter((key) => key.startsWith("futureTask_")).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tamaño aproximado:</span>
                  <span className="text-white">
                    {Math.round(JSON.stringify({ users, tasks: allTasks }).length / 1024)} KB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
