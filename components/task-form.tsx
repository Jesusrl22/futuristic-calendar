"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Bell, Tag, Plus, Edit, Trash2, X } from "lucide-react"
import { format } from "date-fns"

interface Task {
  id: string
  userId: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  estimatedTime?: number
  actualTime?: number
}

interface TaskFormProps {
  selectedDate: Date
  onTaskCreated: (taskData: any) => void
  editingTask?: Task | null
  onTaskUpdated?: (taskId: string, updates: Partial<Task>) => void
  onTaskDeleted?: (taskId: string) => void
  onCancelEdit?: () => void
}

const categories = [
  { value: "work", label: "Trabajo", color: "bg-blue-500", icon: "💼" },
  { value: "personal", label: "Personal", color: "bg-green-500", icon: "🏠" },
  { value: "health", label: "Salud", color: "bg-red-500", icon: "❤️" },
  { value: "education", label: "Educación", color: "bg-purple-500", icon: "📚" },
  { value: "finance", label: "Finanzas", color: "bg-yellow-500", icon: "💰" },
  { value: "social", label: "Social", color: "bg-pink-500", icon: "👥" },
  { value: "travel", label: "Viajes", color: "bg-indigo-500", icon: "✈️" },
  { value: "other", label: "Otros", color: "bg-gray-500", icon: "📝" },
]

const priorities = [
  { value: "low", label: "Baja", color: "bg-green-500" },
  { value: "medium", label: "Media", color: "bg-yellow-500" },
  { value: "high", label: "Alta", color: "bg-red-500" },
]

export function TaskForm({
  selectedDate,
  onTaskCreated,
  editingTask,
  onTaskUpdated,
  onTaskDeleted,
  onCancelEdit,
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: selectedDate,
    time: "",
    category: "personal",
    priority: "medium" as "low" | "medium" | "high",
    notifications: false,
    estimatedTime: 30,
  })

  // Update form when editing task changes
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || "",
        date: editingTask.dueDate ? new Date(editingTask.dueDate) : selectedDate,
        time: editingTask.dueDate ? new Date(editingTask.dueDate).toTimeString().slice(0, 5) : "",
        category: editingTask.category || "personal",
        priority: editingTask.priority,
        notifications: false, // Reset notifications for editing
        estimatedTime: editingTask.estimatedTime || 30,
      })
    } else {
      // Reset form when not editing
      setFormData({
        title: "",
        description: "",
        date: selectedDate,
        time: "",
        category: "personal",
        priority: "medium",
        notifications: false,
        estimatedTime: 30,
      })
    }
  }, [editingTask, selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const taskData = {
      title: formData.title,
      description: formData.description,
      date: formData.date.toISOString().split("T")[0],
      time: formData.time || undefined,
      category: formData.category,
      priority: formData.priority,
      notifications: formData.notifications,
      estimatedTime: formData.estimatedTime,
    }

    try {
      if (editingTask && onTaskUpdated) {
        // Update existing task
        await onTaskUpdated(editingTask.id, {
          title: formData.title,
          description: formData.description,
          dueDate: formData.date.toISOString(),
          category: formData.category,
          priority: formData.priority,
          estimatedTime: formData.estimatedTime,
        })
      } else {
        // Create new task
        await onTaskCreated(taskData)
      }

      // Reset form only if not editing
      if (!editingTask) {
        setFormData({
          title: "",
          description: "",
          date: selectedDate,
          time: "",
          category: "personal",
          priority: "medium",
          notifications: false,
          estimatedTime: 30,
        })
      }
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  const handleDelete = async () => {
    if (editingTask && onTaskDeleted && window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      await onTaskDeleted(editingTask.id)
    }
  }

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit()
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date })
    }
  }

  const selectedCategory = categories.find((cat) => cat.value === formData.category)
  const selectedPriority = priorities.find((pri) => pri.value === formData.priority)

  return (
    <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            {editingTask ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            <span>{editingTask ? "Editar Tarea" : "Nueva Tarea"}</span>
          </div>
          {editingTask && (
            <Button variant="ghost" size="sm" onClick={handleCancel} className="text-white hover:bg-white/10">
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Título de la Tarea *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="¿Qué necesitas hacer?"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Añade más detalles sobre esta tarea..."
              rows={3}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label className="text-white">Fecha *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={formData.date} onSelect={handleDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white">
                Hora
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="pl-10 bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
          </div>

          {/* Category and Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label className="text-white">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue>
                    {selectedCategory && (
                      <div className="flex items-center space-x-2">
                        <span>{selectedCategory.icon}</span>
                        <span>{selectedCategory.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Selection */}
            <div className="space-y-2">
              <Label className="text-white">Prioridad *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue>
                    {selectedPriority && (
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${selectedPriority.color}`}></div>
                        <span>{selectedPriority.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${priority.color}`}></div>
                        <span>{priority.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="space-y-2">
            <Label htmlFor="estimatedTime" className="text-white">
              Tiempo Estimado (minutos)
            </Label>
            <Input
              id="estimatedTime"
              type="number"
              min="5"
              max="480"
              step="5"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({ ...formData, estimatedTime: Number.parseInt(e.target.value) || 30 })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          {/* Notifications Toggle */}
          {formData.time && !editingTask && (
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-white/60" />
                <div>
                  <Label htmlFor="notifications" className="text-sm font-medium text-white">
                    Activar Notificaciones
                  </Label>
                  <p className="text-xs text-white/60">Recibe un recordatorio 15 minutos antes</p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={formData.notifications}
                onCheckedChange={(checked) => setFormData({ ...formData, notifications: checked })}
              />
            </div>
          )}

          {/* Task Preview */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center space-x-2 text-white">
              <Tag className="h-4 w-4" />
              <span>Vista Previa de la Tarea</span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">Título:</span>
                <span className="text-white/80">{formData.title || "Tarea sin título"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">Fecha:</span>
                <span className="text-white/80">{format(formData.date, "PPP")}</span>
                {formData.time && (
                  <>
                    <span className="font-medium text-white">Hora:</span>
                    <span className="text-white/80">{formData.time}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">Categoría:</span>
                <Badge className={`${selectedCategory?.color} text-white text-xs`}>
                  {selectedCategory?.icon} {selectedCategory?.label}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">Prioridad:</span>
                <Badge className={`${selectedPriority?.color} text-white text-xs`}>{selectedPriority?.label}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">Tiempo estimado:</span>
                <span className="text-white/80">{formData.estimatedTime} minutos</span>
              </div>
              {formData.notifications && !editingTask && (
                <div className="flex items-center space-x-2">
                  <Bell className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">Notificaciones activadas</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              {editingTask ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {editingTask ? "Actualizar Tarea" : "Crear Tarea"}
            </Button>
            {editingTask && (
              <>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
