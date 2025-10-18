"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  Users,
  BarChart3,
  Crown,
  Zap,
  Star,
  Edit,
  Trash2,
  Search,
  Filter,
  UserCheck,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"

interface AdminUser {
  id: string
  name: string | null
  email: string
  subscription_tier: "free" | "premium" | "pro"
  subscription_status: "active" | "cancelled" | "expired"
  ai_credits: number
  created_at: string
  last_login?: string
  email_verified: boolean
  is_lifetime: boolean
}

interface AdminStats {
  total_users: number
  active_subscriptions: number
  free_users: number
  premium_users: number
  pro_users: number
  total_tasks: number
  total_notes: number
}

export default function AdminPage() {
  const { dbUser, loading: userLoading } = useUser()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    active_subscriptions: 0,
    free_users: 0,
    premium_users: 0,
    pro_users: 0,
    total_tasks: 0,
    total_notes: 0,
  })
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlan, setFilterPlan] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load admin data
  useEffect(() => {
    const loadAdminData = async () => {
      // Wait for user to load
      if (userLoading) {
        return
      }

      // Check if user is admin
      if (!dbUser) {
        console.log("No user found, redirecting to login")
        router.push("/login")
        return
      }

      console.log("Current user:", dbUser)
      console.log("User subscription tier:", dbUser.subscription_tier)

      // For now, allow any logged in user to access admin (for testing)
      // TODO: Change this back to only 'pro' users later
      // if (dbUser.subscription_tier !== "pro") {
      //   console.log("User is not pro, redirecting to app")
      //   router.push("/app")
      //   return
      // }

      try {
        setError(null)

        // Fetch all users
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false })

        if (usersError) {
          console.error("Error fetching users:", usersError)
          setError("Error al cargar usuarios: " + usersError.message)
          throw usersError
        }

        console.log("Loaded users:", usersData?.length)

        const adminUsers: AdminUser[] =
          usersData?.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            subscription_tier: user.subscription_tier || "free",
            subscription_status: user.subscription_status || "active",
            ai_credits: user.ai_credits || 0,
            created_at: user.created_at,
            last_login: user.last_login,
            email_verified: user.email_verified || false,
            is_lifetime: user.is_lifetime || false,
          })) || []

        setUsers(adminUsers)

        // Calculate stats
        const freeUsers = adminUsers.filter((u) => u.subscription_tier === "free").length
        const premiumUsers = adminUsers.filter((u) => u.subscription_tier === "premium").length
        const proUsers = adminUsers.filter((u) => u.subscription_tier === "pro").length
        const activeSubscriptions = adminUsers.filter((u) => u.subscription_status === "active").length

        // Fetch task count
        const { count: taskCount } = await supabase.from("tasks").select("*", { count: "exact", head: true })

        // Fetch note count
        const { count: noteCount } = await supabase.from("notes").select("*", { count: "exact", head: true })

        console.log("Stats calculated:", {
          total_users: adminUsers.length,
          free_users: freeUsers,
          premium_users: premiumUsers,
          pro_users: proUsers,
          tasks: taskCount,
          notes: noteCount,
        })

        setStats({
          total_users: adminUsers.length,
          active_subscriptions: activeSubscriptions,
          free_users: freeUsers,
          premium_users: premiumUsers,
          pro_users: proUsers,
          total_tasks: taskCount || 0,
          total_notes: noteCount || 0,
        })
      } catch (error) {
        console.error("Error loading admin data:", error)
        setError("Error al cargar datos del panel de administración")
      } finally {
        setIsLoading(false)
      }
    }

    loadAdminData()
  }, [dbUser, userLoading, router])

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedUser) return

    const formData = new FormData(event.currentTarget)

    try {
      const updates = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subscription_tier: formData.get("plan") as string,
        subscription_status: formData.get("status") as string,
        ai_credits: Number.parseInt(formData.get("ai_credits") as string) || 0,
        is_lifetime: formData.get("is_lifetime") === "on",
      }

      const { error } = await supabase.from("users").update(updates).eq("id", selectedUser.id)

      if (error) throw error

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                ...updates,
                subscription_tier: updates.subscription_tier as "free" | "premium" | "pro",
                subscription_status: updates.subscription_status as "active" | "cancelled" | "expired",
              }
            : u,
        ),
      )

      setShowEditModal(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Error al actualizar usuario")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) return

    try {
      const { error } = await supabase.from("users").delete().eq("id", userId)

      if (error) throw error

      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Error al eliminar usuario")
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = filterPlan === "all" || user.subscription_tier === filterPlan
    return matchesSearch && matchesPlan
  })

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "pro":
        return Zap
      case "premium":
        return Crown
      default:
        return Star
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "pro":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "premium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "expired":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="text-lg font-semibold">Cargando panel de administración...</div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
      </div>
    )
  }

  if (!dbUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona usuarios, suscripciones y configuración del sistema</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/app")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la App
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
              <div className="text-xs text-muted-foreground mt-1">
                <div>Free: {stats.free_users}</div>
                <div>Premium: {stats.premium_users}</div>
                <div>Pro: {stats.pro_users}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suscripciones Activas</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active_subscriptions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total_users > 0 ? ((stats.active_subscriptions / stats.total_users) * 100).toFixed(1) : 0}% tasa
                de conversión
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tareas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_tasks}</div>
              <p className="text-xs text-muted-foreground">Creadas por usuarios</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notas</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_notes}</div>
              <p className="text-xs text-muted-foreground">Creadas por usuarios</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Usuarios</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analíticas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los Planes</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Usuario</th>
                        <th className="text-left p-2">Plan</th>
                        <th className="text-left p-2">Estado</th>
                        <th className="text-left p-2">Créditos AI</th>
                        <th className="text-left p-2">Creado</th>
                        <th className="text-left p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const PlanIcon = getPlanIcon(user.subscription_tier)
                        return (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="p-2">
                              <div>
                                <div className="font-medium">{user.name || "Sin nombre"}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge className={getPlanColor(user.subscription_tier)}>
                                <PlanIcon className="h-3 w-3 mr-1" />
                                {user.subscription_tier.toUpperCase()}
                                {user.is_lifetime && " (Vitalicio)"}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <Badge className={getStatusColor(user.subscription_status)}>
                                {user.subscription_status}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <div className="text-sm">{user.ai_credits}</div>
                            </td>
                            <td className="p-2">
                              <div className="text-sm">{new Date(user.created_at).toLocaleDateString()}</div>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Free</span>
                        <span className="text-sm font-medium">{stats.free_users}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gray-500 h-2 rounded-full"
                          style={{
                            width: `${stats.total_users > 0 ? (stats.free_users / stats.total_users) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Premium</span>
                        <span className="text-sm font-medium">{stats.premium_users}</span>
                      </div>
                      <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${stats.total_users > 0 ? (stats.premium_users / stats.total_users) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Pro</span>
                        <span className="text-sm font-medium">{stats.pro_users}</span>
                      </div>
                      <div className="w-full bg-purple-200 dark:bg-purple-900 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${stats.total_users > 0 ? (stats.pro_users / stats.total_users) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actividad del Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Tareas</span>
                      <span className="text-2xl font-bold">{stats.total_tasks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Notas</span>
                      <span className="text-2xl font-bold">{stats.total_notes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Usuarios Activos</span>
                      <span className="text-2xl font-bold">{stats.active_subscriptions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit User Modal */}
        {selectedUser && (
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Usuario: {selectedUser.name || selectedUser.email}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" name="name" defaultValue={selectedUser.name || ""} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={selectedUser.email} required />
                  </div>
                  <div>
                    <Label htmlFor="plan">Plan</Label>
                    <Select name="plan" defaultValue={selectedUser.subscription_tier}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Estado</Label>
                    <Select name="status" defaultValue={selectedUser.subscription_status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                        <SelectItem value="expired">Expirado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ai_credits">Créditos AI</Label>
                    <Input
                      id="ai_credits"
                      name="ai_credits"
                      type="number"
                      defaultValue={selectedUser.ai_credits}
                      min="0"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="is_lifetime"
                      name="is_lifetime"
                      defaultChecked={selectedUser.is_lifetime}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="is_lifetime">Suscripción Vitalicia</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Cambios</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
