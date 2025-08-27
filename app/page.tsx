"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Trophy,
  CalendarIcon,
  CheckCircle,
  Star,
  Target,
  Award,
  Zap,
  Settings,
  Download,
  Flame,
  CalendarDays,
  Clock,
  Sparkles,
  Crown,
  Rocket,
  Circle,
  ArrowUp,
} from "lucide-react"

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

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  unlockedAt?: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

const DEFAULT_ACHIEVEMENTS = [
  {
    id: "first-task",
    name: "Primer Paso",
    description: "Completa tu primera tarea",
    icon: <Star className="w-5 h-5" />,
    rarity: "common" as const,
  },
  {
    id: "streak-3",
    name: "Constancia",
    description: "Completa tareas 3 días seguidos",
    icon: <Zap className="w-5 h-5" />,
    rarity: "common" as const,
  },
  {
    id: "streak-7",
    name: "Semana Perfecta",
    description: "Completa tareas 7 días seguidos",
    icon: <CalendarDays className="w-5 h-5" />,
    rarity: "rare" as const,
  },
  {
    id: "streak-30",
    name: "Maestro del Tiempo",
    description: "Completa tareas 30 días seguidos",
    icon: <Crown className="w-5 h-5" />,
    rarity: "legendary" as const,
  },
  {
    id: "task-master",
    name: "Conquistador",
    description: "Completa 50 tareas en total",
    icon: <Target className="w-5 h-5" />,
    rarity: "rare" as const,
  },
  {
    id: "perfectionist",
    name: "Perfeccionista",
    description: "Completa todas las tareas de un día",
    icon: <Award className="w-5 h-5" />,
    rarity: "common" as const,
  },
  {
    id: "productive",
    name: "Súper Productivo",
    description: "Completa 10 tareas en un solo día",
    icon: <Rocket className="w-5 h-5" />,
    rarity: "epic" as const,
  },
  {
    id: "early-bird",
    name: "Madrugador",
    description: "Completa 5 tareas antes de las 9 AM",
    icon: <Clock className="w-5 h-5" />,
    rarity: "rare" as const,
  },
  {
    id: "diverse",
    name: "Versátil",
    description: "Completa tareas en todas las categorías",
    icon: <Sparkles className="w-5 h-5" />,
    rarity: "epic" as const,
  },
  {
    id: "dedicated",
    name: "Dedicado",
    description: "Usa la app durante 14 días diferentes",
    icon: <Flame className="w-5 h-5" />,
    rarity: "rare" as const,
  },
] satisfies Omit<Achievement, "unlocked" | "unlockedAt">[]

const CATEGORY_COLORS = {
  work: "bg-blue-500/20 border-blue-500/30 text-blue-300",
  personal: "bg-green-500/20 border-green-500/30 text-green-300",
  health: "bg-red-500/20 border-red-500/30 text-red-300",
  learning: "bg-purple-500/20 border-purple-500/30 text-purple-300",
  other: "bg-gray-500/20 border-gray-500/30 text-gray-300",
}

const PRIORITY_COLORS = {
  low: "text-gray-400",
  medium: "text-yellow-400",
  high: "text-red-400",
}

const RARITY_COLORS = {
  common: "from-gray-500 to-gray-600",
  rare: "from-blue-500 to-blue-600",
  epic: "from-purple-500 to-purple-600",
  legendary: "from-yellow-500 to-orange-500",
}

export default function FutureTaskApp() {
  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
    password: string
    createdAt: string
    theme: "dark" | "light"
  } | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState<Task["category"]>("personal")
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("medium")
  const [achievements, setAchievements] = useState<Achievement[]>(
    DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false })),
  )
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [showCompleted, setShowCompleted] = useState(true)

  // Auth states
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  // Profile states
  const [showProfile, setShowProfile] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    const savedUser = localStorage.getItem("futureTask_user")
    const savedTasks = localStorage.getItem("futureTask_tasks")
    const savedAchievements = localStorage.getItem("futureTask_achievements")

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setNewEmail(parsedUser.email)
    }
    if (savedTasks) setTasks(JSON.parse(savedTasks))

    if (savedAchievements) {
      const parsed: { id: string; unlocked: boolean; unlockedAt?: string }[] = JSON.parse(savedAchievements)

      setAchievements(
        DEFAULT_ACHIEVEMENTS.map((base) => {
          const saved = parsed.find((s) => s.id === base.id)
          return {
            ...base,
            unlocked: saved?.unlocked ?? false,
            unlockedAt: saved?.unlockedAt,
          }
        }),
      )
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("futureTask_user", JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem("futureTask_tasks", JSON.stringify(tasks))
    checkAchievements()
  }, [tasks])

  useEffect(() => {
    const serializable = achievements.map(({ id, unlocked, unlockedAt }) => ({
      id,
      unlocked,
      unlockedAt,
    }))
    localStorage.setItem("futureTask_achievements", JSON.stringify(serializable))
  }, [achievements])

  const handleAuth = () => {
    if (authMode === "register") {
      const newUser: {
        id: string
        name: string
        email: string
        password: string
        createdAt: string
        theme: "dark" | "light"
      } = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
        theme: "dark",
      }
      setUser(newUser)
    } else {
      // Simple login simulation
      const newUser: {
        id: string
        name: string
        email: string
        password: string
        createdAt: string
        theme: "dark" | "light"
      } = {
        id: "user1",
        name: email.split("@")[0],
        email,
        password,
        createdAt: new Date().toISOString(),
        theme: "dark",
      }
      setUser(newUser)
    }
    setEmail("")
    setPassword("")
    setName("")
  }

  const updateProfile = () => {
    if (!user) return

    if (newPassword && newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    const updatedUser = {
      ...user,
      email: newEmail,
      ...(newPassword && { password: newPassword }),
    }

    setUser(updatedUser)
    setNewPassword("")
    setConfirmPassword("")
    setShowProfile(false)
    alert("Perfil actualizado correctamente")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("futureTask_user")
  }

  const addTask = () => {
    if (!newTask.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      description: newTaskDescription,
      completed: false,
      date: selectedDate.toISOString().split("T")[0],
      category: newTaskCategory,
      priority: newTaskPriority,
    }

    setTasks([...tasks, task])
    setNewTask("")
    setNewTaskDescription("")
  }

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task,
      ),
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const getStreak = () => {
    const sortedDates = [...new Set(tasks.filter((t) => t.completed).map((t) => t.date))].sort()
    if (sortedDates.length === 0) return 0

    let streak = 1
    let currentStreak = 1

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1])
      const currentDate = new Date(sortedDates[i])
      const diffTime = currentDate.getTime() - prevDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)

      if (diffDays === 1) {
        currentStreak++
        streak = Math.max(streak, currentStreak)
      } else {
        currentStreak = 1
      }
    }

    return streak
  }

  const getActiveDays = () => {
    return new Set(tasks.map((t) => t.date)).size
  }

  const checkAchievements = () => {
    const completedTasks = tasks.filter((task) => task.completed)
    const totalCompleted = completedTasks.length
    const streak = getStreak()
    const activeDays = getActiveDays()
    const categories = new Set(completedTasks.map((t) => t.category))
    const earlyTasks = completedTasks.filter((t) => {
      if (!t.completedAt) return false
      const hour = new Date(t.completedAt).getHours()
      return hour < 9
    }).length

    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.unlocked) return achievement

        switch (achievement.id) {
          case "first-task":
            if (totalCompleted >= 1) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "streak-3":
            if (streak >= 3) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "streak-7":
            if (streak >= 7) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "streak-30":
            if (streak >= 30) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "task-master":
            if (totalCompleted >= 50) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "perfectionist":
            const todayTasks = tasks.filter((task) => task.date === selectedDate.toISOString().split("T")[0])
            if (todayTasks.length > 0 && todayTasks.every((task) => task.completed)) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "productive":
            const tasksByDate = tasks.reduce(
              (acc, task) => {
                if (task.completed) {
                  acc[task.date] = (acc[task.date] || 0) + 1
                }
                return acc
              },
              {} as Record<string, number>,
            )
            if (Object.values(tasksByDate).some((count) => count >= 10)) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "early-bird":
            if (earlyTasks >= 5) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "diverse":
            if (categories.size >= 5) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
          case "dedicated":
            if (activeDays >= 14) {
              return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
            }
            break
        }
        return achievement
      }),
    )
  }

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    let dateTasks = tasks.filter((task) => task.date === dateStr)

    if (filterCategory !== "all") {
      dateTasks = dateTasks.filter((task) => task.category === filterCategory)
    }

    if (!showCompleted) {
      dateTasks = dateTasks.filter((task) => !task.completed)
    }

    return dateTasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const getTodayTasks = () => getTasksForDate(selectedDate)
  const getCompletedTasks = () => getTodayTasks().filter((task) => task.completed)
  const getTodayProgress = () => {
    const todayTasks = getTodayTasks()
    if (todayTasks.length === 0) return 0
    return (getCompletedTasks().length / todayTasks.length) * 100
  }

  const getDateWithTasks = () => {
    const datesWithTasks = new Set(tasks.map((task) => task.date))
    return Array.from(datesWithTasks).map((date) => new Date(date))
  }

  const exportData = () => {
    const data = {
      user,
      tasks,
      achievements: achievements.filter((a) => a.unlocked),
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `futuretask-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getPriorityIcon = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return <ArrowUp className="w-4 h-4" />
      case "medium":
        return <Circle className="w-4 h-4" />
      case "low":
        return <Circle className="w-4 h-4" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

        <Card className="w-full max-w-md bg-black/20 backdrop-blur-xl border-purple-500/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              FutureTask
            </CardTitle>
            <CardDescription className="text-gray-300">Tu calendario inteligente del futuro</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 bg-purple-900/20">
                <TabsTrigger value="login" className="data-[state=active]:bg-purple-500/30">
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-purple-500/30">
                  Registrarse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                    placeholder="tu@email.com"
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
                    className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                <Button
                  onClick={handleAuth}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold"
                >
                  Iniciar Sesión
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email-register"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register" className="text-gray-300">
                    Contraseña
                  </Label>
                  <Input
                    id="password-register"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                <Button
                  onClick={handleAuth}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold"
                >
                  Registrarse
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                FutureTask
              </h1>
              <p className="text-gray-400">Bienvenido, {user.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-black/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Logros ({achievements.filter((a) => a.unlocked).length})
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Tus Logros
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">Desbloquea logros completando tareas</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-4 max-h-96 overflow-y-auto">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                        achievement.unlocked
                          ? `bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]}/20 border-purple-500/30`
                          : "bg-gray-800/30 border-gray-700/30"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          achievement.unlocked ? `bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]}` : "bg-gray-700"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${achievement.unlocked ? "text-white" : "text-gray-500"}`}>
                            {achievement.name}
                          </span>
                          <Badge className={`text-xs bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]} text-white`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className={`text-sm ${achievement.unlocked ? "text-gray-300" : "text-gray-600"}`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">Desbloqueado</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showProfile} onOpenChange={setShowProfile}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-black/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Perfil
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Mi Perfil
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">Actualiza tu información personal</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name" className="text-gray-300">
                      Nombre
                    </Label>
                    <Input
                      id="profile-name"
                      value={user.name}
                      disabled
                      className="bg-black/30 border-purple-500/30 text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-email" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-password" className="text-gray-300">
                      Nueva Contraseña (opcional)
                    </Label>
                    <Input
                      id="profile-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                      placeholder="••••••••"
                    />
                  </div>
                  {newPassword && (
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-300">
                        Confirmar Contraseña
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                        placeholder="••••••••"
                      />
                    </div>
                  )}
                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={updateProfile}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                    >
                      Actualizar Perfil
                    </Button>
                    <Button
                      onClick={exportData}
                      variant="outline"
                      className="bg-black/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={logout}
              variant="outline"
              className="bg-black/20 border-red-500/30 text-red-300 hover:bg-red-500/20"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Completadas Hoy</p>
                  <p className="text-xl font-bold text-white">{getCompletedTasks().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Hoy</p>
                  <p className="text-xl font-bold text-white">{getTodayTasks().length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-400">Racha</p>
                  <p className="text-xl font-bold text-white">{getStreak()} días</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Logros</p>
                  <p className="text-xl font-bold text-white">{achievements.filter((a) => a.unlocked).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Progreso Hoy</p>
                  <p className="text-xl font-bold text-white">{Math.round(getTodayProgress())}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5" />
                <span>Calendario</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-0"
                modifiers={{
                  hasTasks: getDateWithTasks(),
                }}
                modifiersStyles={{
                  hasTasks: {
                    backgroundColor: "rgba(168, 85, 247, 0.3)",
                    color: "white",
                    fontWeight: "bold",
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">
                Tareas -{" "}
                {selectedDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
              <div className="space-y-2">
                <Progress value={getTodayProgress()} className="h-2" />
                <p className="text-sm text-gray-400">
                  {getCompletedTasks().length} de {getTodayTasks().length} completadas
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2 pt-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-32 bg-black/30 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-500/30">
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="work">Trabajo</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="health">Salud</SelectItem>
                    <SelectItem value="learning">Aprendizaje</SelectItem>
                    <SelectItem value="other">Otros</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showCompleted}
                    onCheckedChange={setShowCompleted}
                    className="data-[state=checked]:bg-purple-500"
                  />
                  <Label className="text-sm text-gray-400">Completadas</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Task Form */}
              <div className="space-y-3">
                <Input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Nueva tarea..."
                  className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400"
                  onKeyPress={(e) => e.key === "Enter" && addTask()}
                />

                <Textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Descripción (opcional)..."
                  className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400 min-h-[60px]"
                />

                <div className="flex space-x-2">
                  <Select
                    value={newTaskCategory}
                    onValueChange={(value) => setNewTaskCategory(value as Task["category"])}
                  >
                    <SelectTrigger className="flex-1 bg-black/30 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-purple-500/30">
                      <SelectItem value="work">Trabajo</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="health">Salud</SelectItem>
                      <SelectItem value="learning">Aprendizaje</SelectItem>
                      <SelectItem value="other">Otros</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={newTaskPriority}
                    onValueChange={(value) => setNewTaskPriority(value as Task["priority"])}
                  >
                    <SelectTrigger className="flex-1 bg-black/30 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-purple-500/30">
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={addTask}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {getTodayTasks().map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border transition-all ${
                      task.completed
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-gray-800/30 border-gray-700/30 hover:border-purple-500/30"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="border-purple-500/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-cyan-500 mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-medium ${task.completed ? "text-gray-400 line-through" : "text-white"}`}
                          >
                            {task.text}
                          </span>
                          <div className={`p-1 rounded ${PRIORITY_COLORS[task.priority]}`}>
                            {getPriorityIcon(task.priority)}
                          </div>
                        </div>
                        {task.description && (
                          <p className={`text-sm ${task.completed ? "text-gray-500" : "text-gray-400"}`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${CATEGORY_COLORS[task.category]}`}>{task.category}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}

                {getTodayTasks().length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay tareas para este día</p>
                    <p className="text-sm">¡Agrega una nueva tarea arriba!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
