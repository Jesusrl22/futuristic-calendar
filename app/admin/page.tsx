"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getAllUsers, type User } from "@/lib/database"
import { Users, Crown, Sparkles, DollarSign, Edit, Save, X, Shield, Clock, Zap } from "lucide-react"

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState<Partial<User>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers()
      setUsers(allUsers)
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      is_premium: user.is_premium,
      is_pro: user.is_pro,
      ai_credits: user.ai_credits || 0,
      ai_credits_used: user.ai_credits_used || 0,
      work_duration: user.work_duration,
      short_break_duration: user.short_break_duration,
      long_break_duration: user.long_break_duration,
      sessions_until_long_break: user.sessions_until_long_break,
    })
  }

  const handleSaveUser = async () => {
    if (!editingUser) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: editingUser.id,
          updates: editForm,
        }),
      })

      if (response.ok) {
        await loadUsers() // Reload users to get updated data
        setEditingUser(null)
        setEditForm({})
      } else {
        console.error("Failed to update user")
      }
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const stats = {
    totalUsers: users.length,
    premiumUsers: users.filter((u) => u.is_premium).length,
    proUsers: users.filter((u) => u.is_pro).length,
    totalRevenue: users.filter((u) => u.is_premium).length * 1.99 + users.filter((u) => u.is_pro).length * 4.99,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <div className="text-white text-xl">Cargando panel de administración...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-red-400" />
            <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
          </div>
          <p className="text-slate-300">Gestiona usuarios y configuraciones del sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Usuarios Premium</CardTitle>
              <Crown className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.premiumUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Usuarios Pro</CardTitle>
              <Sparkles className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.proUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Ingresos Mensuales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">€{stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Usuarios
            </CardTitle>
            <CardDescription className="text-slate-300">
              Administra las cuentas y suscripciones de los usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-600"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{user.name}</h3>
                        {user.email === "admin@futuretask.com" && (
                          <Badge variant="secondary" className="bg-red-600 text-white">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {user.is_pro && (
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Pro
                          </Badge>
                        )}
                        {user.is_premium && !user.is_pro && (
                          <Badge variant="secondary" className="bg-yellow-600 text-white">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{user.email}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span>Registrado: {new Date(user.created_at).toLocaleDateString()}</span>
                        {user.is_pro && (
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Créditos IA: {user.ai_credits || 0}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Edit className="h-5 w-5" />
                          Editar Usuario: {editingUser?.name}
                        </DialogTitle>
                      </DialogHeader>

                      {editingUser && (
                        <div className="space-y-6">
                          {/* Basic Info */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Información Básica
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name" className="text-slate-300">
                                  Nombre
                                </Label>
                                <Input
                                  id="name"
                                  value={editForm.name || ""}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="bg-slate-700 border-slate-600 text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor="email" className="text-slate-300">
                                  Email
                                </Label>
                                <Input
                                  id="email"
                                  value={editForm.email || ""}
                                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                  className="bg-slate-700 border-slate-600 text-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Subscription */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                              <Crown className="h-4 w-4" />
                              Suscripción
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="premium" className="text-slate-300">
                                  Premium
                                </Label>
                                <Switch
                                  id="premium"
                                  checked={editForm.is_premium || false}
                                  onCheckedChange={(checked) => setEditForm({ ...editForm, is_premium: checked })}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="pro" className="text-slate-300">
                                  Pro
                                </Label>
                                <Switch
                                  id="pro"
                                  checked={editForm.is_pro || false}
                                  onCheckedChange={(checked) => setEditForm({ ...editForm, is_pro: checked })}
                                />
                              </div>
                            </div>
                          </div>

                          {/* AI Credits */}
                          {editForm.is_pro && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                Créditos IA
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="ai_credits" className="text-slate-300">
                                    Créditos Disponibles
                                  </Label>
                                  <Input
                                    id="ai_credits"
                                    type="number"
                                    value={editForm.ai_credits || 0}
                                    onChange={(e) =>
                                      setEditForm({ ...editForm, ai_credits: Number.parseInt(e.target.value) || 0 })
                                    }
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="ai_credits_used" className="text-slate-300">
                                    Créditos Usados
                                  </Label>
                                  <Input
                                    id="ai_credits_used"
                                    type="number"
                                    value={editForm.ai_credits_used || 0}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        ai_credits_used: Number.parseInt(e.target.value) || 0,
                                      })
                                    }
                                    className="bg-slate-700 border-slate-600 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Pomodoro Settings */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Configuración Pomodoro
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="work_duration" className="text-slate-300">
                                  Duración Trabajo (min)
                                </Label>
                                <Input
                                  id="work_duration"
                                  type="number"
                                  value={editForm.work_duration || 25}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, work_duration: Number.parseInt(e.target.value) || 25 })
                                  }
                                  className="bg-slate-700 border-slate-600 text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor="short_break_duration" className="text-slate-300">
                                  Descanso Corto (min)
                                </Label>
                                <Input
                                  id="short_break_duration"
                                  type="number"
                                  value={editForm.short_break_duration || 5}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      short_break_duration: Number.parseInt(e.target.value) || 5,
                                    })
                                  }
                                  className="bg-slate-700 border-slate-600 text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor="long_break_duration" className="text-slate-300">
                                  Descanso Largo (min)
                                </Label>
                                <Input
                                  id="long_break_duration"
                                  type="number"
                                  value={editForm.long_break_duration || 15}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      long_break_duration: Number.parseInt(e.target.value) || 15,
                                    })
                                  }
                                  className="bg-slate-700 border-slate-600 text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor="sessions_until_long_break" className="text-slate-300">
                                  Sesiones hasta descanso largo
                                </Label>
                                <Input
                                  id="sessions_until_long_break"
                                  type="number"
                                  value={editForm.sessions_until_long_break || 4}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      sessions_until_long_break: Number.parseInt(e.target.value) || 4,
                                    })
                                  }
                                  className="bg-slate-700 border-slate-600 text-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-600">
                            <Button
                              variant="outline"
                              onClick={() => setEditingUser(null)}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                            <Button
                              onClick={handleSaveUser}
                              disabled={isSaving}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              {isSaving ? (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  Guardando...
                                </div>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-1" />
                                  Guardar Cambios
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
