"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Crown, Search, Trash2, Eye, CheckCircle, Target, Trophy, Flame } from "lucide-react"

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
}

interface UserStats {
  totalTasks: number
  completedTasks: number
  achievements: number
  streak: number
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userStats, setUserStats] = useState<Record<string, UserStats>>({})

  useEffect(() => {
    // Cargar usuarios del localStorage
    const savedUsers = localStorage.getItem("futureTask_users") || "[]"

    try {
      const parsedUsers = JSON.parse(savedUsers)

      // Si no hay usuarios guardados, crear algunos de ejemplo
      if (parsedUsers.length === 0) {
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

        // Create example tasks for users
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

      // Load all user tasks for statistics
      const allTasks: Task[] = []
      parsedUsers.forEach((user: User) => {
        const userTasks = localStorage.getItem(`futureTask_tasks_${user.id}`)
        if (userTasks) {
          allTasks.push(...JSON.parse(userTasks))
        }
      })
      setTasks(allTasks)
    } catch (error) {
      console.error("Error loading data:", error)
      setUsers([])
      setTasks([])
    }
  }, [])

  useEffect(() => {
    // Calcular estadísticas para cada usuario
    const stats: Record<string, UserStats> = {}

    users.forEach((user) => {
      const userTasksData = localStorage.getItem(`futureTask_tasks_${user.id}`)
      const userTasks = userTasksData ? JSON.parse(userTasksData) : []
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
  }, [users])

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem("futureTask_users", JSON.stringify(updatedUsers))

    // Delete user-specific data
    localStorage.removeItem(`futureTask_tasks_${userId}`)
    localStorage.removeItem(`futureTask_wishes_${userId}`)
    localStorage.removeItem(`futureTask_notes_${userId}`)
    localStorage.removeItem(`futureTask_templates_${userId}`)
    localStorage.removeItem(`futureTask_achievements_${userId}`)

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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalUsers = users.length
  const premiumUsers = users.filter((u) => u.isPremium).length
  const activeUsers = users.filter((u) => u.onboardingCompleted).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Panel de Administración
            </h1>
            <p className="text-gray-300">Gestiona usuarios y estadísticas de FutureTask</p>
          </div>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
          >
            Volver a la App
          </Button>
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
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Lista de Usuarios</span>
              </CardTitle>
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
                            setSelectedUser(user)
                          }}
                          className="text-blue-300 hover:bg-blue-500/20"
                        >
                          <Eye className="w-4 h-4" />
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
                            if (confirm(`¿Eliminar usuario ${user.name}?`)) {
                              deleteUser(user.id)
                            }
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
    </div>
  )
}
