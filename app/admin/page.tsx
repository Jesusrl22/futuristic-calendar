"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Crown, Users, Database, Settings, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// Import database functions
import { getUserByEmail, updateUser, getAllUsers } from "@/lib/database"
import { isSupabaseAvailable } from "@/lib/supabase"

interface User {
  id: string
  name: string
  email: string
  language: "es" | "en" | "fr" | "de" | "it"
  theme: string
  is_premium: boolean
  premium_expiry?: string
  onboarding_completed: boolean
  pomodoro_sessions: number
  work_duration: number
  short_break_duration: number
  long_break_duration: number
  sessions_until_long_break: number
  created_at: string
  updated_at: string
}

const THEMES = {
  free: {
    default: "Futurista (Predeterminado)",
    light: "Claro",
    dark: "Oscuro",
    ocean: "Océano",
    forest: "Bosque",
  },
  premium: {
    neon: "Neón",
    galaxy: "Galaxia",
    sunset: "Atardecer",
    aurora: "Aurora",
    cyberpunk: "Cyberpunk",
  },
}

const LANGUAGE_OPTIONS = [
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "it", label: "Italiano", flag: "🇮🇹" },
]

export default function AdminPanel() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form states for editing user
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editLanguage, setEditLanguage] = useState<"es" | "en" | "fr" | "de" | "it">("es")
  const [editTheme, setEditTheme] = useState("default")
  const [editIsPremium, setEditIsPremium] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("futureTask_admin_auth")
    if (savedAuth === "true") {
      setIsAuthenticated(true)
      loadUsers()
    }
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      // Intentar con las credenciales correctas del admin
      const admin = await getUserByEmail("admin", "535353-Jrl")

      if (admin && (adminEmail === "admin" || adminEmail === "Administrator") && adminPassword === "535353-Jrl") {
        setIsAuthenticated(true)
        localStorage.setItem("futureTask_admin_auth", "true")
        await loadUsers()
        setAdminEmail("")
        setAdminPassword("")
      } else {
        alert("Credenciales de administrador incorrectas. Usa: admin / 535353-Jrl")
      }
    } catch (error) {
      console.error("Error logging in:", error)
      alert("Error al iniciar sesión. Credenciales: admin / 535353-Jrl")
    } finally {
      setIsLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers()
      // Filtrar el usuario admin
      const regularUsers = allUsers.filter((u: User) => u.email !== "admin")
      setUsers(regularUsers)
    } catch (error) {
      console.error("Error loading users:", error)
      // Fallback a localStorage si hay error
      try {
        const localUsers = JSON.parse(localStorage.getItem("futureTask_users") || "[]")
        setUsers(localUsers.filter((u: User) => u.email !== "admin"))
      } catch (localError) {
        console.error("Error loading from localStorage:", localError)
        setUsers([])
      }
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditLanguage(user.language)
    setEditTheme(user.theme)
    setEditIsPremium(user.is_premium)
  }

  const handleSaveUser = async () => {
    if (!editingUser) return

    setIsLoading(true)
    try {
      const updatedUser = await updateUser(editingUser.id, {
        name: editName,
        email: editEmail,
        language: editLanguage,
        theme: editTheme,
        is_premium: editIsPremium,
        premium_expiry: editIsPremium ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      })

      // Update local state
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updatedUser : u)))

      setEditingUser(null)
      alert("Usuario actualizado exitosamente")
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Error al actualizar usuario")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("futureTask_admin_auth")
    setUsers([])
    setEditingUser(null)
  }

  const goBack = () => {
    router.push("/")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Panel de Administración
            </CardTitle>
            <div className="text-sm text-gray-400 mt-2 p-2 bg-yellow-900/20 rounded border border-yellow-500/20">
              <p>
                <strong>Credenciales:</strong>
              </p>
              <p>
                Usuario: <code className="bg-black/30 px-1 rounded">admin</code>
              </p>
              <p>
                Contraseña: <code className="bg-black/30 px-1 rounded">535353-Jrl</code>
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminEmail" className="text-gray-300">
                Email de Administrador
              </Label>
              <Input
                id="adminEmail"
                type="text"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white"
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword" className="text-gray-300">
                Contraseña
              </Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white"
                placeholder="535353-Jrl"
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleLogin()}
              />
            </div>
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
            >
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
            <Button onClick={goBack} variant="ghost" className="w-full text-gray-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la App
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Panel de Administración
            </h1>
            <p className="text-gray-300 text-sm">Gestiona usuarios y configuraciones de FutureTask</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={goBack} variant="ghost" className="text-gray-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la App
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="text-gray-300">
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Usuarios Premium</CardTitle>
              <Crown className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.filter((u) => u.is_premium).length}</div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Base de Datos</CardTitle>
              <Database className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-white">
                {isSupabaseAvailable ? "Supabase Conectado" : "Solo localStorage"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Usuarios Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-purple-500/20 bg-black/10"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-white flex items-center space-x-2">
                        <span>{user.name}</span>
                        {user.is_premium && <Crown className="w-4 h-4 text-yellow-400" />}
                      </h3>
                      <p className="text-sm text-gray-300">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {LANGUAGE_OPTIONS.find((l) => l.value === user.language)?.flag}{" "}
                          {LANGUAGE_OPTIONS.find((l) => l.value === user.language)?.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {user.theme}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.is_premium ? "default" : "secondary"}>
                      {user.is_premium ? "Premium" : "Free"}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">No hay usuarios registrados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-black/20 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Editar Usuario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Nombre</Label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Email</Label>
                  <Input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Idioma</Label>
                  <Select value={editLanguage} onValueChange={(value) => setEditLanguage(value as any)}>
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} className="text-white">
                          <span className="flex items-center space-x-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Tema</Label>
                  <Select value={editTheme} onValueChange={setEditTheme}>
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                      {Object.entries(THEMES.free).map(([key, name]) => (
                        <SelectItem key={key} value={key} className="text-white">
                          {name}
                        </SelectItem>
                      ))}
                      {Object.entries(THEMES.premium).map(([key, name]) => (
                        <SelectItem key={key} value={key} className="text-white">
                          {name} (Premium)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPremium"
                    checked={editIsPremium}
                    onChange={(e) => setEditIsPremium(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isPremium" className="text-gray-300 flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span>Usuario Premium</span>
                  </Label>
                </div>
              </CardContent>
              <div className="flex justify-end space-x-2 p-6">
                <Button variant="secondary" onClick={() => setEditingUser(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveUser}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                >
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
