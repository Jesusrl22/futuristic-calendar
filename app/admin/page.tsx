"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Crown, Users, Database, Settings, ArrowLeft, Sparkles, Calendar } from "lucide-react"
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
  is_pro: boolean
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
  const [editIsPro, setEditIsPro] = useState(false)
  const [editPremiumExpiry, setEditPremiumExpiry] = useState("")

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
        alert("Credenciales de administrador incorrectas")
      }
    } catch (error) {
      console.error("Error logging in:", error)
      alert("Error al iniciar sesión")
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
    setEditIsPro(user.is_pro || false)

    // Set expiry date - if exists, format it for input, otherwise set to 1 year from now
    if (user.premium_expiry) {
      const expiryDate = new Date(user.premium_expiry)
      setEditPremiumExpiry(expiryDate.toISOString().split("T")[0])
    } else {
      const oneYearFromNow = new Date()
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
      setEditPremiumExpiry(oneYearFromNow.toISOString().split("T")[0])
    }
  }

  const handleSaveUser = async () => {
    if (!editingUser) return

    setIsLoading(true)
    try {
      // Calculate expiry date
      let premiumExpiry = undefined
      if (editIsPremium || editIsPro) {
        if (editPremiumExpiry) {
          // Use the selected date
          const selectedDate = new Date(editPremiumExpiry)
          selectedDate.setHours(23, 59, 59, 999) // Set to end of day
          premiumExpiry = selectedDate.toISOString()
        } else {
          // Default to 1 year from now
          const oneYearFromNow = new Date()
          oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
          premiumExpiry = oneYearFromNow.toISOString()
        }
      }

      const updatedUser = await updateUser(editingUser.id, {
        name: editName,
        email: editEmail,
        language: editLanguage,
        theme: editTheme,
        is_premium: editIsPremium,
        is_pro: editIsPro,
        premium_expiry: premiumExpiry,
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

  const getUserPlanBadge = (user: User) => {
    if (user.is_pro) {
      return (
        <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/50">
          <Sparkles className="w-3 h-3 mr-1" />
          Pro
        </Badge>
      )
    } else if (user.is_premium) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/50">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      )
    } else {
      return (
        <Badge variant="secondary" className="bg-gray-500/20 text-gray-200 border-gray-400/50">
          Free
        </Badge>
      )
    }
  }

  const formatExpiryDate = (expiry?: string) => {
    if (!expiry) return "Sin fecha"
    const date = new Date(expiry)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isExpired = (expiry?: string) => {
    if (!expiry) return false
    return new Date(expiry) < new Date()
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminEmail" className="text-gray-200 font-medium">
                Email de Administrador
              </Label>
              <Input
                id="adminEmail"
                type="text"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword" className="text-gray-200 font-medium">
                Contraseña
              </Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                placeholder="••••••••"
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleLogin()}
              />
            </div>
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium"
            >
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
            <Button onClick={goBack} variant="ghost" className="w-full text-gray-200 hover:text-white">
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
            <p className="text-gray-200 text-sm">Gestiona usuarios y configuraciones de FutureTask</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={goBack} variant="ghost" className="text-gray-200 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la App
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="text-gray-200 hover:text-white">
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Usuarios Premium</CardTitle>
              <Crown className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.filter((u) => u.is_premium).length}</div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Usuarios Pro</CardTitle>
              <Sparkles className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.filter((u) => u.is_pro).length}</div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Base de Datos</CardTitle>
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
                        {user.is_pro && <Sparkles className="w-4 h-4 text-purple-400" />}
                        {user.is_premium && !user.is_pro && <Crown className="w-4 h-4 text-yellow-400" />}
                      </h3>
                      <p className="text-sm text-gray-200">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs border-purple-400/50 text-purple-200">
                          {LANGUAGE_OPTIONS.find((l) => l.value === user.language)?.flag}{" "}
                          {LANGUAGE_OPTIONS.find((l) => l.value === user.language)?.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-cyan-400/50 text-cyan-200">
                          {user.theme}
                        </Badge>
                        {user.premium_expiry && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              isExpired(user.premium_expiry)
                                ? "border-red-400/50 text-red-200"
                                : "border-green-400/50 text-green-200"
                            }`}
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatExpiryDate(user.premium_expiry)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getUserPlanBadge(user)}
                    <Button
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-200">No hay usuarios registrados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-black/20 backdrop-blur-xl border-purple-500/20 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-white">Editar Usuario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-200 font-medium">Nombre</Label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-medium">Email</Label>
                  <Input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-medium">Idioma</Label>
                  <Select value={editLanguage} onValueChange={(value) => setEditLanguage(value as any)}>
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} className="text-white hover:bg-purple-500/20">
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
                  <Label className="text-gray-200 font-medium">Tema</Label>
                  <Select value={editTheme} onValueChange={setEditTheme}>
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                      {Object.entries(THEMES.free).map(([key, name]) => (
                        <SelectItem key={key} value={key} className="text-white hover:bg-purple-500/20">
                          {name}
                        </SelectItem>
                      ))}
                      {Object.entries(THEMES.premium).map(([key, name]) => (
                        <SelectItem key={key} value={key} className="text-white hover:bg-purple-500/20">
                          {name} (Premium)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPremium"
                      checked={editIsPremium}
                      onChange={(e) => setEditIsPremium(e.target.checked)}
                      className="rounded border-purple-400/50"
                    />
                    <Label htmlFor="isPremium" className="text-gray-200 flex items-center space-x-2 font-medium">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span>Usuario Premium</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPro"
                      checked={editIsPro}
                      onChange={(e) => setEditIsPro(e.target.checked)}
                      className="rounded border-purple-400/50"
                    />
                    <Label htmlFor="isPro" className="text-gray-200 flex items-center space-x-2 font-medium">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Usuario Pro (incluye IA)</span>
                    </Label>
                  </div>

                  {(editIsPremium || editIsPro) && (
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-medium flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span>Fecha de Expiración</span>
                      </Label>
                      <Input
                        type="date"
                        value={editPremiumExpiry}
                        onChange={(e) => setEditPremiumExpiry(e.target.value)}
                        className="bg-black/30 border-purple-500/30 text-white"
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <p className="text-xs text-gray-400">Deja vacío para establecer 1 año desde hoy</p>
                    </div>
                  )}
                </div>

                {(editIsPremium || editIsPro) && (
                  <div className="text-xs text-gray-400 p-2 bg-purple-500/10 rounded">
                    💡 Al activar Premium/Pro puedes establecer una fecha de expiración personalizada
                  </div>
                )}
              </CardContent>
              <div className="flex justify-end space-x-2 p-6">
                <Button
                  variant="secondary"
                  onClick={() => setEditingUser(null)}
                  className="text-gray-200 bg-gray-600 hover:bg-gray-700"
                >
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
