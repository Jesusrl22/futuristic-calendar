"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Edit, Trash2, Plus, Search } from "lucide-react"
import { format } from "date-fns"

interface Task {
  id: string
  text: string
  description?: string | null
  category: "work" | "personal" | "health" | "learning" | "other"
  priority: "low" | "medium" | "high"
  date: string
  time?: string | null
  completed: boolean
  notification_enabled?: boolean
}

interface TaskFormProps {
  tasks: Task[]
  onCreateTask: (taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
  currentLanguage: string
}

const translations = {
  es: {
    addTask: "Agregar Tarea",
    taskTitle: "Título de la tarea",
    description: "Descripción",
    category: "Categoría",
    priority: "Prioridad",
    date: "Fecha",
    time: "Hora",
    work: "Trabajo",
    personal: "Personal",
    health: "Salud",
    learning: "Aprendizaje",
    other: "Otro",
    low: "Baja",
    medium: "Media",
    high: "Alta",
    search: "Buscar tareas...",
    all: "Todas",
    completed: "Completadas",
    pending: "Pendientes",
  },
  en: {
    addTask: "Add Task",
    taskTitle: "Task title",
    description: "Description",
    category: "Category",
    priority: "Priority",
    date: "Date",
    time: "Time",
    work: "Work",
    personal: "Personal",
    health: "Health",
    learning: "Learning",
    other: "Other",
    low: "Low",
    medium: "Medium",
    high: "High",
    search: "Search tasks...",
    all: "All",
    completed: "Completed",
    pending: "Pending",
  },
}

export function TaskForm({ tasks, onCreateTask, onUpdateTask, onDeleteTask, currentLanguage }: TaskFormProps) {
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskTime, setNewTaskTime] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState<Task["category"]>("personal")
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("medium")
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")

  const t = translations[currentLanguage as keyof typeof translations] || translations.es

  const handleSubmit = () => {
    if (!newTask.trim()) return

    onCreateTask({
      text: newTask,
      description: newTaskDescription,
      time: newTaskTime,
      category: newTaskCategory,
      priority: newTaskPriority,
      date: format(new Date(), "yyyy-MM-dd"),
      completed: false,
      notification_enabled: false,
    })

    // Reset form
    setNewTask("")
    setNewTaskDescription("")
    setNewTaskTime("")
    setNewTaskCategory("personal")
    setNewTaskPriority("medium")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter =
      filter === "all" || (filter === "completed" && task.completed) || (filter === "pending" && !task.completed)

    return matchesSearch && matchesFilter
  })

  const getPriorityColor = (priority: Task["priority"]) => {
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

  const getCategoryIcon = (category: Task["category"]) => {
    switch (category) {
      case "work":
        return "💼"
      case "personal":
        return "👤"
      case "health":
        return "🏥"
      case "learning":
        return "📚"
      case "other":
        return "📝"
      default:
        return "📝"
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Task Form */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>{t.addTask}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Tarea</Label>
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder={t.taskTitle}
              className="bg-white/10 border-white/20 text-white"
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Descripción (opcional)</Label>
            <Textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder={t.description}
              className="bg-white/10 border-white/20 text-white min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Hora (opcional)</Label>
              <Input
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Categoría</Label>
              <Select value={newTaskCategory} onValueChange={(value) => setNewTaskCategory(value as Task["category"])}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  <SelectItem value="work" className="text-white">
                    {t.work}
                  </SelectItem>
                  <SelectItem value="personal" className="text-white">
                    {t.personal}
                  </SelectItem>
                  <SelectItem value="health" className="text-white">
                    {t.health}
                  </SelectItem>
                  <SelectItem value="learning" className="text-white">
                    {t.learning}
                  </SelectItem>
                  <SelectItem value="other" className="text-white">
                    {t.other}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Prioridad</Label>
              <Select value={newTaskPriority} onValueChange={(value) => setNewTaskPriority(value as Task["priority"])}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  <SelectItem value="high" className="text-white">
                    {t.high}
                  </SelectItem>
                  <SelectItem value="medium" className="text-white">
                    {t.medium}
                  </SelectItem>
                  <SelectItem value="low" className="text-white">
                    {t.low}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
          >
            {t.addTask}
          </Button>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Mis Tareas</CardTitle>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white"
              />
            </div>
            <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
              <SelectTrigger className="w-full sm:w-40 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="all" className="text-white">
                  {t.all}
                </SelectItem>
                <SelectItem value="pending" className="text-white">
                  {t.pending}
                </SelectItem>
                <SelectItem value="completed" className="text-white">
                  {t.completed}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUpdateTask(task.id, { completed: !task.completed })}
                    className="text-white hover:bg-white/10 p-1"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">{getCategoryIcon(task.category)}</span>
                      <p
                        className={`font-medium ${task.completed ? "line-through opacity-60 text-gray-400" : "text-white"}`}
                      >
                        {task.text}
                      </p>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{t[task.priority]}</Badge>
                    </div>

                    {task.description && <p className="text-sm text-gray-400 mb-1">{task.description}</p>}

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>📅 {task.date}</span>
                      {task.time && <span>🕐 {task.time}</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Edit functionality would go here
                        console.log("Edit task:", task.id)
                      }}
                      className="text-gray-400 hover:text-white hover:bg-white/10 p-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTask(task.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-400 text-lg">No hay tareas</p>
                <p className="text-gray-500 text-sm">
                  {searchTerm || filter !== "all"
                    ? "No se encontraron tareas con los filtros aplicados"
                    : "Agrega tu primera tarea para comenzar"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
