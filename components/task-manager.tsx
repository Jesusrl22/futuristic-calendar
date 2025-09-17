"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Calendar, Clock, Flag } from "lucide-react"
import type { Task } from "@/lib/database"
import { formatDate, getPriorityColor, getPriorityLabel, isToday, isTomorrow, isOverdue } from "@/lib/utils"

interface TaskManagerProps {
  tasks: Task[]
  onTaskCreate: (task: Omit<Task, "id" | "userId" | "createdAt">) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskDelete: (taskId: string) => void
  onTaskComplete: (taskId: string) => void
}

export default function TaskManager({
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTaskComplete,
}: TaskManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "created">("dueDate")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    category: "",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      category: "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const taskData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      category: formData.category || "General",
      completed: false,
    }

    if (editingTask) {
      onTaskUpdate(editingTask.id, taskData)
      setEditingTask(null)
    } else {
      onTaskCreate(taskData)
      setShowCreateDialog(false)
    }

    resetForm()
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
      category: task.category,
    })
  }

  const getFilteredTasks = () => {
    let filtered = tasks

    switch (filter) {
      case "pending":
        filtered = tasks.filter((t) => !t.completed)
        break
      case "completed":
        filtered = tasks.filter((t) => t.completed)
        break
      default:
        filtered = tasks
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.getTime() - b.dueDate.getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "created":
          return b.createdAt.getTime() - a.createdAt.getTime()
        default:
          return 0
      }
    })
  }

  const getTaskDateInfo = (task: Task) => {
    if (!task.dueDate) return null

    if (isOverdue(task.dueDate) && !task.completed) {
      return { label: "Vencida", color: "text-red-600 bg-red-100" }
    }
    if (isToday(task.dueDate)) {
      return { label: "Hoy", color: "text-blue-600 bg-blue-100" }
    }
    if (isTomorrow(task.dueDate)) {
      return { label: "Mañana", color: "text-green-600 bg-green-100" }
    }

    return { label: formatDate(task.dueDate), color: "text-gray-600 bg-gray-100" }
  }

  const filteredTasks = getFilteredTasks()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestor de Tareas</h2>
          <p className="text-gray-600 dark:text-gray-300">Organiza y completa tus tareas de manera eficiente</p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Tarea</DialogTitle>
              <DialogDescription>Agrega una nueva tarea a tu lista de pendientes</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título de la tarea"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción detallada (opcional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dueDate">Fecha límite</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Trabajo, Personal, Estudio..."
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Tarea</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            Todas ({tasks.length})
          </Button>
          <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
            Pendientes ({tasks.filter((t) => !t.completed).length})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completadas ({tasks.filter((t) => t.completed).length})
          </Button>
        </div>

        <Select value={sortBy} onValueChange={(value: "dueDate" | "priority" | "created") => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Fecha límite</SelectItem>
            <SelectItem value="priority">Prioridad</SelectItem>
            <SelectItem value="created">Fecha creación</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay tareas</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {filter === "all"
                  ? "Crea tu primera tarea para comenzar"
                  : filter === "pending"
                    ? "No tienes tareas pendientes"
                    : "No has completado ninguna tarea aún"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const dateInfo = getTaskDateInfo(task)

            return (
              <Card key={task.id} className={`transition-all ${task.completed ? "opacity-75" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => onTaskComplete(task.id)}
                        className="mt-1"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p
                            className={`text-sm mt-1 ${task.completed ? "line-through text-gray-400" : "text-gray-600 dark:text-gray-300"}`}
                          >
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            <Flag className="h-3 w-3 mr-1" />
                            {getPriorityLabel(task.priority)}
                          </Badge>

                          {task.category && <Badge variant="outline">{task.category}</Badge>}

                          {dateInfo && (
                            <Badge className={dateInfo.color}>
                              <Calendar className="h-3 w-3 mr-1" />
                              {dateInfo.label}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onTaskDelete(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Edit Dialog */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Tarea</DialogTitle>
              <DialogDescription>Modifica los detalles de tu tarea</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Título</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título de la tarea"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-description">Descripción</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción detallada (opcional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-priority">Prioridad</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-dueDate">Fecha límite</Label>
                    <Input
                      id="edit-dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-category">Categoría</Label>
                  <Input
                    id="edit-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Trabajo, Personal, Estudio..."
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
