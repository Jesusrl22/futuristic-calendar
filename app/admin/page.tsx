"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Crown,
  Star,
  User,
  Edit,
  DollarSign,
  Brain,
  Save,
  ArrowLeft,
  Shield,
  Clock,
  Infinity,
} from "lucide-react"

interface AdminUser {
  id: string
  name: string
  email: string
  subscription_plan: string
  subscription_status: string
  subscription_expires_at?: string
  is_lifetime?: boolean
  ai_credits: number
  created_at: string
  last_login?: string
  pomodoro_work_duration: number
  pomodoro_break_duration: number
  pomodoro_long_break_duration: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Sample admin data
  const sampleUsers: AdminUser[] = [
    {
      id: "1",
      name: "Demo User",
      email: "demo@futuretask.com",
      subscription_plan: "free",
      subscription_status: "active",
      ai_credits: 0,
      created_at: "2024-01-15T10:00:00Z",
      last_login: "2024-01-20T14:30:00Z",
      pomodoro_work_duration: 25,
      pomodoro_break_duration: 5,
      pomodoro_long_break_duration: 15,
    },
    {
      id: "2",
      name: "Premium User",
      email: "premium@futuretask.com",
      subscription_plan: "premium",
      subscription_status: "active",
      subscription_expires_at: "2024-12-31T23:59:59Z",
      ai_credits: 0,
      created_at: "2024-01-10T09:00:00Z",
      last_login: "2024-01-20T16:45:00Z",
      pomodoro_work_duration: 30,
      pomodoro_break_duration: 10,
      pomodoro_long_break_duration: 20,
    },
    {
      id: "3",
      name: "Pro User",
      email: "pro@futuretask.com",
      subscription_plan: "pro",
      subscription_status: "active",
      subscription_expires_at: "2024-12-31T23:59:59Z",
      ai_credits: 450,
      created_at: "2024-01-05T08:00:00Z",
      last_login: "2024-01-20T18:20:00Z",
      pomodoro_work_duration: 45,
      pomodoro_break_duration: 15,
      pomodoro_long_break_duration: 30,
    },
    {
      id: "4",
      name: "Lifetime Pro",
      email: "lifetime@futuretask.com",
      subscription_plan: "pro",
      subscription_status: "active",
      is_lifetime: true,
      ai_credits: 1000,
      created_at: "2023-12-01T12:00:00Z",
      last_login: "2024-01-20T20:10:00Z",
      pomodoro_work_duration: 25,
      pomodoro_break_duration: 5,
      pomodoro_long_break_duration: 15,
    },
  ]

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Load from localStorage or use sample data
        const savedUsers = localStorage.getItem("admin_users")
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers))
        } else {
          setUsers(sampleUsers)
          localStorage.setItem("admin_users", JSON.stringify(sampleUsers))
        }
      } catch (error) {
        console.error("Error loading users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  const saveUsers = (updatedUsers: AdminUser[]) => {
    setUsers(updatedUsers)
    localStorage.setItem("admin_users", JSON.stringify(updatedUsers))
  }

  const handleEditUser = (user: AdminUser) => {
    setEditingUser({ ...user })
    setIsEditDialogOpen(true)
  }

  const handleSaveUser = () => {
    if (!editingUser) return

    const updatedUsers = users.map((user) => (user.id === editingUser.id ? editingUser : user))
    saveUsers(updatedUsers)
    setIsEditDialogOpen(false)
    setEditingUser(null)
  }

  const handleUserFieldChange = (field: string, value: any) => {
    if (!editingUser) return
    setEditingUser({ ...editingUser, [field]: value })
  }

  const getPlanBadge = (plan: string, isLifetime?: boolean) => {
    if (isLifetime) {
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Infinity className="h-3 w-3 mr-1" />
          LIFETIME
        </Badge>
      )
    }

    switch (plan) {
      case "pro":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <Crown className="h-3 w-3 mr-1" />
            PRO
          </Badge>
        )
      case "premium":
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            PREMIUM
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <User className="h-3 w-3 mr-1" />
            FREE
          </Badge>
        )
    }
  }

  const getStats = () => {
    const totalUsers = users.length
    const freeUsers = users.filter((u) => u.subscription_plan === "free").length
    const premiumUsers = users.filter((u) => u.subscription_plan === "premium").length
    const proUsers = users.filter((u) => u.subscription_plan === "pro").length
    const lifetimeUsers = users.filter((u) => u.is_lifetime).length

    const monthlyRevenue = premiumUsers * 1.99 + proUsers * 4.99 - lifetimeUsers * 4.99 // Lifetime users don't contribute to monthly revenue

    return {
      totalUsers,
      freeUsers,
      premiumUsers,
      proUsers,
      lifetimeUsers,
      monthlyRevenue: monthlyRevenue.toFixed(2),
    }
  }

  const stats = getStats()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/app")}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver a App
              </Button>
              <Shield className="h-6 w-6 text-red-500" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Panel de Administración</h1>
            </div>
            <Badge variant="destructive" className="bg-red-500">
              ADMIN
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Usuarios</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Ingresos Mensuales</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">€{stats.monthlyRevenue}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Usuarios Premium</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.premiumUsers}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Usuarios Pro</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.proUsers}</p>
                    </div>
                    <Crown className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plan Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Planes</CardTitle>
                <CardDescription>Distribución de usuarios por tipo de suscripción</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>Gratuito</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-500 h-2 rounded-full"
                          style={{ width: `${(stats.freeUsers / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{stats.freeUsers}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Premium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${(stats.premiumUsers / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{stats.premiumUsers}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-purple-500" />
                      <span>Pro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(stats.proUsers / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{stats.proUsers}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Infinity className="h-4 w-4 text-pink-500" />
                      <span>Vitalicio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full"
                          style={{ width: `${(stats.lifetimeUsers / stats.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{stats.lifetimeUsers}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra las cuentas y suscripciones de los usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Créditos IA</TableHead>
                      <TableHead>Último Login</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getPlanBadge(user.subscription_plan, user.is_lifetime)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.subscription_status === "active" ? "default" : "secondary"}
                            className={
                              user.subscription_status === "active"
                                ? "bg-green-500 text-white"
                                : "bg-gray-500 text-white"
                            }
                          >
                            {user.subscription_status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Brain className="h-4 w-4 text-purple-500" />
                            {user.ai_credits}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.last_login ? new Date(user.last_login).toLocaleDateString("es-ES") : "Nunca"}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>Modifica la información y suscripción del usuario</DialogDescription>
            </DialogHeader>

            {editingUser && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información Básica</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={editingUser.name}
                        onChange={(e) => handleUserFieldChange("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => handleUserFieldChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Suscripción</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="premium"
                        checked={editingUser.subscription_plan === "premium"}
                        onCheckedChange={(checked) =>
                          handleUserFieldChange("subscription_plan", checked ? "premium" : "free")
                        }
                      />
                      <Label htmlFor="premium" className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Premium
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pro"
                        checked={editingUser.subscription_plan === "pro"}
                        onCheckedChange={(checked) =>
                          handleUserFieldChange("subscription_plan", checked ? "pro" : "free")
                        }
                      />
                      <Label htmlFor="pro" className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-purple-500" />
                        Pro
                      </Label>
                    </div>
                  </div>

                  {/* Lifetime Toggle */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="lifetime"
                      checked={editingUser.is_lifetime || false}
                      onCheckedChange={(checked) => handleUserFieldChange("is_lifetime", checked)}
                    />
                    <Label htmlFor="lifetime" className="flex items-center gap-2">
                      <Infinity className="h-4 w-4 text-pink-500" />
                      Suscripción Vitalicia
                    </Label>
                  </div>

                  {/* Expiration Date */}
                  {!editingUser.is_lifetime && editingUser.subscription_plan !== "free" && (
                    <div>
                      <Label htmlFor="expires_at" className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Fecha de Expiración
                      </Label>
                      <Input
                        id="expires_at"
                        type="datetime-local"
                        value={
                          editingUser.subscription_expires_at
                            ? new Date(editingUser.subscription_expires_at).toISOString().slice(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          handleUserFieldChange(
                            "subscription_expires_at",
                            e.target.value ? new Date(e.target.value).toISOString() : undefined,
                          )
                        }
                      />
                    </div>
                  )}
                </div>

                {/* AI Credits */}
                {editingUser.subscription_plan === "pro" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Créditos IA</h3>
                    <div>
                      <Label htmlFor="ai_credits">Créditos Disponibles</Label>
                      <Input
                        id="ai_credits"
                        type="number"
                        min="0"
                        value={editingUser.ai_credits}
                        onChange={(e) => handleUserFieldChange("ai_credits", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                )}

                {/* Pomodoro Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configuración Pomodoro</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="work_duration">Trabajo (min)</Label>
                      <Input
                        id="work_duration"
                        type="number"
                        min="1"
                        max="60"
                        value={editingUser.pomodoro_work_duration}
                        onChange={(e) =>
                          handleUserFieldChange("pomodoro_work_duration", Number.parseInt(e.target.value) || 25)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="break_duration">Descanso (min)</Label>
                      <Input
                        id="break_duration"
                        type="number"
                        min="1"
                        max="30"
                        value={editingUser.pomodoro_break_duration}
                        onChange={(e) =>
                          handleUserFieldChange("pomodoro_break_duration", Number.parseInt(e.target.value) || 5)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="long_break_duration">Descanso Largo (min)</Label>
                      <Input
                        id="long_break_duration"
                        type="number"
                        min="1"
                        max="60"
                        value={editingUser.pomodoro_long_break_duration}
                        onChange={(e) =>
                          handleUserFieldChange("pomodoro_long_break_duration", Number.parseInt(e.target.value) || 15)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleSaveUser} className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
