"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskForm } from "@/components/task-form"
import { Plus, Search, CheckSquare, Clock, AlertCircle, Calendar, Target, Trash2, Edit } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  dueDate: string | null
  createdAt: string
  userId: string
}

interface TaskManagerProps {
  userId: string
  onUpgrade: () => void
  compact?: boolean
}

export function TaskManager({ userId, onUpgrade, compact = false }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all")
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${userId}`)
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error("Error loading tasks:", error)
      }
    }
  }, [userId])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks))
  }, [tasks, userId])

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt" | "userId">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId,
    }
    setTasks((prev) => [newTask, ...prev])
    setShowForm(false)
  }

  const handleEditTask = (taskData: Omit<Task, "id" | "createdAt" | "userId">) => {
    if (editingTask) {
      setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task)))
      setEditingTask(null)
      setShowForm(false)
    }
  }

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      trabajo: "bg-blue-500",
      personal: "bg-purple-500",
      salud: "bg-green-500",
      educacion: "bg-orange-500",
      hogar: "bg-pink-500",
      otros: "bg-gray-500",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500"
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed)
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesCategory = filterCategory === "all" || task.category === filterCategory

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length,
  }

  const categories = [...new Set(tasks.map((t) => t.category))]

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completadas</div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="space-y-2">
          {filteredTasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Checkbox checked={task.completed} onCheckedChange={() => handleToggleComplete(task.id)} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${task.completed ? "line-through text-gray-500" : ""}`}>
                  {task.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>{task.priority}</Badge>
                  <Badge className={`${getCategoryColor(task.category)} text-white text-xs`}>{task.category}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={() => setShowForm(true)} className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </Button>

        {/* Task Form Modal */}
        {showForm && (
          <TaskForm
            isOpen={showForm}
            onClose={() => {
              setShowForm(false)
              setEditingTask(null)
            }}
            onSubmit={editingTask ? handleEditTask : handleAddTask}
            initialData={editingTask}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckSquare className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Gestor de Tareas</h2>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.overdue}</p>
                <p className="text-sm text-gray-600">Vencidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay tareas que coincidan con los filtros</p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
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
                        <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p
                            className={`text-sm mt-1 ${
                              task.completed ? "line-through text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={`${getPriorityColor(task.priority)} text-white`}>{task.priority}</Badge>
                          <Badge className={`${getCategoryColor(task.category)} text-white`}>{task.category}</Badge>
                          {task.dueDate && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTask(task)
                            setShowForm(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          initialData={editingTask}
        />
      )}
    </div>
  )
}
