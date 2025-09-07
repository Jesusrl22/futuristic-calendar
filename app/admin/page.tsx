"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Crown,
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Activity,
  Shield,
  UserCheck,
  CheckCircle2,
  RefreshCw,
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import {
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
  getTasks,
  getWishlistItems,
  getNotes,
  getAchievements,
  syncLocalToSupabase,
  syncSupabaseToLocal,
  type User,
  type Task,
  type WishlistItem,
  type Note,
  type Achievement,
} from "@/lib/database"
import { DatabaseStatus } from "@/components/database-status"

// Admin stats interface
interface AdminStats {
  totalUsers: number
  premiumUsers: number
  totalTasks: number
  completedTasks: number
  totalNotes: number
  totalWishlistItems: number
  totalAchievements: number
}

export default function AdminPanel() {
  // State
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    premiumUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalNotes: 0,
    totalWishlistItems: 0,
    totalAchievements: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userTasks, setUserTasks] = useState<Task[]>([])
  const [userNotes, setUserNotes] = useState<Note[]>([])
  const [userWishlist, setUserWishlist] = useState<WishlistItem[]>([])
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([])
  const [isSyncing, setIsSyncing] = useState(false)

  // Load admin data
  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    setIsLoading(true)
    try {
      // Load all users
      const allUsers = await getAllUsers()
      setUsers(allUsers)

      // Calculate stats
      let totalTasks = 0
      let completedTasks = 0
      let totalNotes = 0
      let totalWishlistItems = 0
      let totalAchievements = 0

      for (const user of allUsers) {
        const [tasks, notes, wishlist, achievements] = await Promise.all([
          getTasks(user.id),
          getNotes(user.id),
          getWishlistItems(user.id),
          getAchievements(user.id),
        ])

        totalTasks += tasks.length
        completedTasks += tasks.filter((task) => task.completed).length
        totalNotes += notes.length
        totalWishlistItems += wishlist.length
        totalAchievements += achievements.length
      }

      setStats({
        totalUsers: allUsers.length,
        premiumUsers: allUsers.filter((user) => user.is_premium).length,
        totalTasks,
        completedTasks,
        totalNotes,
        totalWishlistItems,
        totalAchievements,
      })
    } catch (error) {
      console.error("Failed to load admin data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load user details
  const loadUserDetails = async (user: User) => {
    setSelectedUser(user)
    try {
      const [tasks, notes, wishlist, achievements] = await Promise.all([
        getTasks(user.id),
        getNotes(user.id),
        getWishlistItems(user.id),
        getAchievements(user.id),
      ])

      setUserTasks(tasks)
      setUserNotes(notes)
      setUserWishlist(wishlist)
      setUserAchievements(achievements)
    } catch (error) {
      console.error("Failed to load user details:", error)
    }
  }

  // User management functions
  const handleCreateUser = async (userData: Omit<User, "id" | "created_at" | "updated_at">) => {
    try {
      await createUser(userData)
      await loadAdminData()
      setShowUserForm(false)

      // Sync to Supabase
      try {
        await syncLocalToSupabase("admin")
      } catch (error) {
        console.log("Sync failed, user created locally")
      }
    } catch (error) {
      console.error("Failed to create user:", error)
    }
  }

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      await updateUser(userId, updates)
      await loadAdminData()

      // If we're updating the selected user, reload their details
      if (selectedUser && selectedUser.id === userId) {
        const updatedUser = users.find((u) => u.id === userId)
        if (updatedUser) {
          await loadUserDetails(updatedUser)
        }
      }

      setEditingUser(null)
      setShowUserForm(false)

      // Sync to Supabase
      try {
        await syncLocalToSupabase(userId)
      } catch (error) {
        console.log("Sync failed, user updated locally")
      }
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await deleteUser(userId)
        await loadAdminData()

        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(null)
        }

        // Sync to Supabase
        try {
          await syncLocalToSupabase("admin")
        } catch (error) {
          console.log("Sync failed, user deleted locally")
        }
      } catch (error) {
        console.error("Failed to delete user:", error)
      }
    }
  }

  const handleTogglePremium = async (user: User) => {
    const updates: Partial<User> = {
      is_premium: !user.is_premium,
    }

    // If granting premium, set expiry date to 1 year from now
    if (!user.is_premium) {
      const expiryDate = new Date()
      expiryDate.setFullYear(expiryDate.getFullYear() + 1)
      updates.premium_expiry = expiryDate.toISOString()
    } else {
      updates.premium_expiry = undefined
    }

    await handleUpdateUser(user.id, updates)
  }

  // Sync functions
  const handleSyncAll = async () => {
    setIsSyncing(true)
    try {
      for (const user of users) {
        await syncLocalToSupabase(user.id)
        await syncSupabaseToLocal(user.id)
      }
      await loadAdminData()
      console.log("✅ All data synced successfully")
    } catch (error) {
      console.error("❌ Sync failed:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-white text-xl">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
                <p className="text-sm text-gray-300">Gestión de usuarios y sistema</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={handleSyncAll}
                disabled={isSyncing}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                {isSyncing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isSyncing ? "Sincronizando..." : "Sincronizar Todo"}
              </Button>

              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Volver a la App
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Stats */}
          <div className="col-span-3 space-y-6">
            {/* Database Status */}
            <DatabaseStatus />

            {/* Stats Cards */}
            <div className="space-y-4">
              <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Usuarios</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                  <div className="text-sm text-gray-400">{stats.premiumUsers} Premium</div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Tareas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalTasks}</div>
                  <div className="text-sm text-gray-400">{stats.completedTasks} Completadas</div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>Contenido</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Notas:</span>
                    <span className="text-white">{stats.totalNotes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Deseos:</span>
                    <span className="text-white">{stats.totalWishlistItems}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Logros:</span>
                    <span className="text-white">{stats.totalAchievements}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - Users List */}
          <div className="col-span-6">
            <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Gestión de Usuarios</span>
                  </CardTitle>
                  <Button
                    onClick={() => setShowUserForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Usuario
                  </Button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedUser?.id === user.id
                          ? "bg-purple-500/20 border-purple-500/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                      onClick={() => loadUserDetails(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="text-white font-medium">{user.name}</p>
                              {user.is_premium && <Crown className="h-4 w-4 text-yellow-400" />}
                            </div>
                            <p className="text-sm text-gray-400">{user.email}</p>
                            <p className="text-xs text-gray-500">
                              Registrado: {format(parseISO(user.created_at), "PP", { locale: es })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={user.is_premium ? "default" : "secondary"}
                            className={user.is_premium ? "bg-gradient-to-r from-yellow-500 to-orange-500" : ""}
                          >
                            {user.is_premium ? "Premium" : "Gratuito"}
                          </Badge>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingUser(user)
                              setShowUserForm(true)
                            }}
                            className="text-white hover:bg-white/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTogglePremium(user)
                            }}
                            className={`${
                              user.is_premium
                                ? "text-yellow-400 hover:bg-yellow-500/10"
                                : "text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            <Crown className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteUser(user.id)
                            }}
                            className="text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No se encontraron usuarios</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - User Details */}
          <div className="col-span-3">
            {selectedUser ? (
              <div className="space-y-6">
                {/* User Info */}
                <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Detalles del Usuario</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-xl font-bold">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-white font-medium">{selectedUser.name}</h3>
                      <p className="text-sm text-gray-400">{selectedUser.email}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estado:</span>
                        <Badge
                          variant={selectedUser.is_premium ? "default" : "secondary"}
                          className={selectedUser.is_premium ? "bg-gradient-to-r from-yellow-500 to-orange-500" : ""}
                        >
                          {selectedUser.is_premium ? "Premium" : "Gratuito"}
                        </Badge>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Idioma:</span>
                        <span className="text-white">{selectedUser.language.toUpperCase()}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Tema:</span>
                        <span className="text-white capitalize">{selectedUser.theme}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Pomodoros:</span>
                        <span className="text-white">{selectedUser.pomodoro_sessions}</span>
                      </div>

                      {selectedUser.is_premium && selectedUser.premium_expiry && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Premium hasta:</span>
                          <span className="text-white text-xs">
                            {format(parseISO(selectedUser.premium_expiry), "PP", { locale: es })}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* User Stats */}
                <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Estadísticas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tareas:</span>
                      <span className="text-white">{userTasks.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Completadas:</span>
                      <span className="text-green-400">{userTasks.filter((task) => task.completed).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Notas:</span>
                      <span className="text-white">{userNotes.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Deseos:</span>
                      <span className="text-white">{userWishlist.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Logros:</span>
                      <span className="text-yellow-400">{userAchievements.length}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Acciones</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() => handleTogglePremium(selectedUser)}
                      className={`w-full ${
                        selectedUser.is_premium
                          ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:opacity-90"
                          : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90"
                      }`}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      {selectedUser.is_premium ? "Quitar Premium" : "Dar Premium"}
                    </Button>

                    <Button
                      onClick={() => {
                        setEditingUser(selectedUser)
                        setShowUserForm(true)
                      }}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Usuario
                    </Button>

                    <Button
                      onClick={() => handleDeleteUser(selectedUser.id)}
                      variant="outline"
                      className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar Usuario
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
                <CardContent className="p-8 text-center">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Selecciona un usuario</p>
                  <p className="text-sm text-gray-500">para ver sus detalles</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* User Form Dialog */}
      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
          </DialogHeader>
          <UserFormContent
            user={editingUser}
            onSubmit={(userData) => {
              if (editingUser) {
                handleUpdateUser(editingUser.id, userData)
              } else {
                handleCreateUser(userData)
              }
            }}
            onCancel={() => {
              setShowUserForm(false)
              setEditingUser(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// User Form Component
function UserFormContent({
  user,
  onSubmit,
  onCancel,
}: {
  user?: User | null
  onSubmit: (data: Omit<User, "id" | "created_at" | "updated_at">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: user?.password || "",
    language: user?.language || ("es" as User["language"]),
    theme: user?.theme || "default",
    is_premium: user?.is_premium || false,
    premium_expiry: user?.premium_expiry || "",
    onboarding_completed: user?.onboarding_completed || true,
    pomodoro_sessions: user?.pomodoro_sessions || 0,
    work_duration: user?.work_duration || 25,
    short_break_duration: user?.short_break_duration || 5,
    long_break_duration: user?.long_break_duration || 15,
    sessions_until_long_break: user?.sessions_until_long_break || 4,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
          required={!user}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="language">Idioma</Label>
          <Select
            value={formData.language}
            onValueChange={(value) => setFormData({ ...formData, language: value as User["language"] })}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20">
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="it">Italiano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="theme">Tema</Label>
          <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20">
              <SelectItem value="default">Predeterminado</SelectItem>
              <SelectItem value="ocean">Océano</SelectItem>
              <SelectItem value="forest">Bosque</SelectItem>
              <SelectItem value="sunset">Atardecer</SelectItem>
              <SelectItem value="rose">Rosa</SelectItem>
              <SelectItem value="gold">Oro</SelectItem>
              <SelectItem value="lavender">Lavanda</SelectItem>
              <SelectItem value="mint">Menta</SelectItem>
              <SelectItem value="cosmic">Cósmico</SelectItem>
              <SelectItem value="fire">Fuego</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="premium"
          checked={formData.is_premium}
          onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="premium">Usuario Premium</Label>
      </div>

      {formData.is_premium && (
        <div>
          <Label htmlFor="premium_expiry">Fecha de expiración Premium</Label>
          <Input
            id="premium_expiry"
            type="datetime-local"
            value={formData.premium_expiry ? formData.premium_expiry.slice(0, 16) : ""}
            onChange={(e) =>
              setFormData({ ...formData, premium_expiry: e.target.value ? new Date(e.target.value).toISOString() : "" })
            }
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label htmlFor="work_duration">Trabajo (min)</Label>
          <Input
            id="work_duration"
            type="number"
            min="1"
            max="60"
            value={formData.work_duration}
            onChange={(e) => setFormData({ ...formData, work_duration: Number.parseInt(e.target.value) || 25 })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <Label htmlFor="short_break_duration">Descanso (min)</Label>
          <Input
            id="short_break_duration"
            type="number"
            min="1"
            max="30"
            value={formData.short_break_duration}
            onChange={(e) => setFormData({ ...formData, short_break_duration: Number.parseInt(e.target.value) || 5 })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <Label htmlFor="long_break_duration">Descanso largo (min)</Label>
          <Input
            id="long_break_duration"
            type="number"
            min="1"
            max="60"
            value={formData.long_break_duration}
            onChange={(e) => setFormData({ ...formData, long_break_duration: Number.parseInt(e.target.value) || 15 })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <Label htmlFor="sessions_until_long_break">Sesiones</Label>
          <Input
            id="sessions_until_long_break"
            type="number"
            min="2"
            max="10"
            value={formData.sessions_until_long_break}
            onChange={(e) =>
              setFormData({ ...formData, sessions_until_long_break: Number.parseInt(e.target.value) || 4 })
            }
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          Cancelar
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
          {user ? "Actualizar" : "Crear"} Usuario
        </Button>
      </div>
    </form>
  )
}
