"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, Clock, AlertCircle, Calendar, Target, Trash2, Edit, Search, Plus } from "lucide-react"
import { format, isToday, isPast } from "date-fns"
import { es } from "date-fns/locale"
import { hybridDb, type Task } from "@/lib/hybrid-database"

interface TaskManagerProps {
  userId: string
  tasks: Task[]
  onTasksChange: () => void
  onUpgrade: () => void
  onTaskEdit?: (task: Task) => void
  compact?: boolean
  hideAddButton?: boolean
  hideStats?: boolean
}

export function TaskManager({
  userId,
  tasks,
  onTasksChange,
  onUpgrade,
  onTaskEdit,
  compact = false,
  hideAddButton = false,
  hideStats = false,
}: TaskManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all")
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "created">("dueDate")

  // Get unique categories from tasks
  const categories = Array.from(new Set(tasks.map((task) => task.category).filter(Boolean)))

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "completed" && task.completed) ||
        (filterStatus === "pending" && !task.completed)

      const matchesPriority = filterPriority === "all" || task.priority === filterPriority

      const matchesCategory = filterCategory === "all" || task.category === filterCategory

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const handleToggleComplete = useCallback(
    async (taskId: string) => {
      try {
        const task = tasks.find((t) => t.id === taskId)
        if (task) {
          await hybridDb.updateTask(taskId, { completed: !task.completed })
          onTasksChange()
        }
      } catch (error) {
        console.error("Error updating task:", error)
      }
    },
    [tasks, onTasksChange],
  )

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
        try {
          await hybridDb.deleteTask(taskId)
          onTasksChange()
        } catch (error) {
          console.error("Error deleting task:", error)
        }
      }
    },
    [onTasksChange],
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      work: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      personal: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      health: "bg-green-500/20 text-green-300 border-green-500/30",
      education: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      finance: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      social: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      travel: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      other: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }

  const getTaskStatus = (task: Task) => {
    if (task.completed) return { text: "Completada", color: "text-green-400" }
    if (!task.dueDate) return { text: "Sin fecha", color: "text-gray-400" }

    const dueDate = new Date(task.dueDate)
    if (isPast(dueDate) && !isToday(dueDate)) return { text: "Vencida", color: "text-red-400" }
    if (isToday(dueDate)) return { text: "Hoy", color: "text-yellow-400" }
    return { text: "Pendiente", color: "text-blue-400" }
  }

  const stats = {
    total: filteredAndSortedTasks.length,
    completed: filteredAndSortedTasks.filter((t) => t.completed).length,
    pending: filteredAndSortedTasks.filter((t) => !t.completed).length,
    overdue: filteredAndSortedTasks.filter(
      (t) => !t.completed && t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)),
    ).length,
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats - Only show if not compact and not hideStats */}
      {!compact && !hideStats && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Gestor de Tareas</h2>
            </div>
            {!hideAddButton && (
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Tarea
              </Button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-sm text-gray-400">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.pending}</p>
                    <p className="text-sm text-gray-400">Pendientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.completed}</p>
                    <p className="text-sm text-gray-400">Completadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.overdue}</p>
                    <p className="text-sm text-gray-400">Vencidas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar tareas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">
                      Todas
                    </SelectItem>
                    <SelectItem value="pending" className="text-white hover:bg-slate-700">
                      Pendientes
                    </SelectItem>
                    <SelectItem value="completed" className="text-white hover:bg-slate-700">
                      Completadas
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">
                      Todas
                    </SelectItem>
                    <SelectItem value="high" className="text-white hover:bg-slate-700">
                      Alta
                    </SelectItem>
                    <SelectItem value="medium" className="text-white hover:bg-slate-700">
                      Media
                    </SelectItem>
                    <SelectItem value="low" className="text-white hover:bg-slate-700">
                      Baja
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">
                      Todas
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="dueDate" className="text-white hover:bg-slate-700">
                      Fecha
                    </SelectItem>
                    <SelectItem value="priority" className="text-white hover:bg-slate-700">
                      Prioridad
                    </SelectItem>
                    <SelectItem value="created" className="text-white hover:bg-slate-700">
                      Creación
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredAndSortedTasks.length === 0 ? (
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-8 text-center">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No hay tareas que coincidan con los filtros</p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedTasks.map((task) => {
            const status = getTaskStatus(task)
            return (
              <Card
                key={task.id}
                className="bg-slate-800/50 border-purple-500/20 hover:bg-slate-800/70 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                      className="mt-1"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-medium text-white ${task.completed ? "line-through opacity-60" : ""}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p
                              className={`text-sm mt-1 ${task.completed ? "line-through opacity-60" : "text-gray-300"}`}
                            >
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center space-x-2 mt-2 flex-wrap gap-1">
                            <Badge className={`text-xs border ${getPriorityColor(task.priority)}`}>
                              {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                            </Badge>
                            {task.category && (
                              <Badge className={`text-xs border ${getCategoryColor(task.category)}`}>
                                {task.category}
                              </Badge>
                            )}
                            <Badge variant="outline" className={`text-xs border-gray-500 ${status.color}`}>
                              {status.text}
                            </Badge>
                            {task.dueDate && (
                              <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: es })}
                              </Badge>
                            )}
                            {task.estimatedTime && (
                              <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {task.estimatedTime}min
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {onTaskEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onTaskEdit(task)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
