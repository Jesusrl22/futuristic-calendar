"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarIcon, Clock, Bell, Tag, Plus, Edit, Trash2 } from "lucide-react"
import { format, isValid, parseISO } from "date-fns"
import { es } from "date-fns/locale"

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
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  onTaskCreated: (taskData: any) => void
  editingTask?: Task | null
  onTaskUpdated?: (taskId: string, updates: Partial<Task>) => void
  onTaskDeleted?: (taskId: string) => void
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

// Helper function to safely parse dates
const safeParseDate = (dateString: string | undefined | null): Date | null => {
  if (!dateString) return null

  try {
    // Try parsing as ISO string first
    const parsed = parseISO(dateString)
    if (isValid(parsed)) return parsed

    // Try creating a new Date object
    const date = new Date(dateString)
    if (isValid(date)) return date

    return null
  } catch (error) {
    console.warn("Invalid date string:", dateString, error)
    return null
  }
}

export function TaskForm({
  isOpen,
  onClose,
  selectedDate,
  onTaskCreated,
  editingTask,
  onTaskUpdated,
  onTaskDeleted,
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: selectedDate,
    time: "",
    category: "personal",
    priority: "medium" as "low" | "medium" | "high",
    notifications: false,
    estimatedTime: "",
  })

  // Validate selectedDate
  const validSelectedDate = isValid(selectedDate) ? selectedDate : new Date()

  // Update form when editing task changes or selectedDate changes
  useEffect(() => {
    if (editingTask) {
      const taskDate = editingTask.dueDate ? safeParseDate(editingTask.dueDate) : validSelectedDate
      const validDate = taskDate && isValid(taskDate) ? taskDate : validSelectedDate

      let timeString = ""
      if (editingTask.dueDate) {
        const parsedDate = safeParseDate(editingTask.dueDate)
        if (parsedDate && isValid(parsedDate)) {
          try {
            timeString = format(parsedDate, "HH:mm")
          } catch (error) {
            console.warn("Error formatting time:", error)
            timeString = ""
          }
        }
      }

      setFormData({
        title: editingTask.title,
        description: editingTask.description || "",
        date: validDate,
        time: timeString,
        category: editingTask.category || "personal",
        priority: editingTask.priority,
        notifications: false,
        estimatedTime: editingTask.estimatedTime ? editingTask.estimatedTime.toString() : "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        date: validSelectedDate,
        time: "",
        category: "personal",
        priority: "medium",
        notifications: false,
        estimatedTime: "",
      })
    }
  }, [editingTask, validSelectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    if (!formData.title.trim()) {
      alert("El título es requerido")
      return
    }

    // Create a valid date object
    let dueDate = new Date(formData.date)

    // Ensure we have a valid date
    if (!isValid(dueDate)) {
      dueDate = new Date()
    }

    if (formData.time) {
      try {
        const [hours, minutes] = formData.time.split(":")
        const hoursNum = Number.parseInt(hours, 10)
        const minutesNum = Number.parseInt(minutes, 10)

        if (!isNaN(hoursNum) && !isNaN(minutesNum)) {
          dueDate.setHours(hoursNum, minutesNum, 0, 0)
        } else {
          dueDate.setHours(0, 0, 0, 0)
        }
      } catch (error) {
        console.warn("Error parsing time:", error)
        dueDate.setHours(0, 0, 0, 0)
      }
    } else {
      dueDate.setHours(0, 0, 0, 0)
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date.toISOString().split("T")[0],
      time: formData.time || undefined,
      category: formData.category,
      priority: formData.priority,
      notifications: formData.notifications,
      estimatedTime: formData.estimatedTime ? Number.parseInt(formData.estimatedTime, 10) : undefined,
      dueDate: dueDate.toISOString(),
    }

    try {
      if (editingTask && onTaskUpdated) {
        await onTaskUpdated(editingTask.id, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          dueDate: dueDate.toISOString(),
          category: formData.category,
          priority: formData.priority,
          estimatedTime: formData.estimatedTime ? Number.parseInt(formData.estimatedTime, 10) : undefined,
        })
      } else {
        await onTaskCreated(taskData)
      }

      onClose()
    } catch (error) {
      console.error("Error saving task:", error)
      alert("Error al guardar la tarea. Por favor, inténtalo de nuevo.")
    }
  }

  const handleDelete = async () => {
    if (editingTask && onTaskDeleted && window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        await onTaskDeleted(editingTask.id)
        onClose()
      } catch (error) {
        console.error("Error deleting task:", error)
        alert("Error al eliminar la tarea. Por favor, inténtalo de nuevo.")
      }
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isValid(date)) {
      setFormData({ ...formData, date })
    }
  }

  const selectedCategory = categories.find((cat) => cat.value === formData.category)
  const selectedPriority = priorities.find((pri) => pri.value === formData.priority)

  // Safe format function for preview
  const safeFormatDate = (date: Date, formatString: string, options?: any): string => {
    try {
      if (!date || !isValid(date)) return "Fecha inválida"
      return format(date, formatString, options)
    } catch (error) {
      console.warn("Error formatting date:", error)
      return "Fecha inválida"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {editingTask ? <Edit className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-green-600" />}
              <span>{editingTask ? "Editar Tarea" : "Nueva Tarea"}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título de la Tarea *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="¿Qué necesitas hacer?"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Añade más detalles sobre esta tarea..."
              rows={3}
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date && isValid(formData.date)
                      ? safeFormatDate(formData.date, "PPP", { locale: es })
                      : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateSelect}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora (opcional)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Category and Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label>Prioridad *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
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
            <Label htmlFor="estimatedTime">Tiempo Estimado (opcional, en minutos)</Label>
            <Input
              id="estimatedTime"
              type="number"
              min="5"
              max="480"
              step="5"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
              placeholder="Ej: 30, 60, 120..."
            />
            <p className="text-xs text-gray-500">Deja vacío si no quieres especificar un tiempo estimado</p>
          </div>

          {/* Notifications Toggle */}
          {formData.time && !editingTask && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-500" />
                <div>
                  <Label htmlFor="notifications" className="text-sm font-medium">
                    Activar Notificaciones
                  </Label>
                  <p className="text-xs text-gray-500">Recibe un recordatorio 15 minutos antes</p>
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
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Vista Previa de la Tarea</span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Título:</span>
                <span className="text-gray-700">{formData.title || "Tarea sin título"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Fecha:</span>
                <span className="text-gray-700">
                  {formData.date && isValid(formData.date)
                    ? safeFormatDate(formData.date, "PPP", { locale: es })
                    : "Fecha inválida"}
                </span>
                {formData.time && (
                  <>
                    <span className="font-medium">Hora:</span>
                    <span className="text-gray-700">{formData.time}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Categoría:</span>
                <Badge className={`${selectedCategory?.color} text-white text-xs`}>
                  {selectedCategory?.icon} {selectedCategory?.label}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Prioridad:</span>
                <Badge className={`${selectedPriority?.color} text-white text-xs`}>{selectedPriority?.label}</Badge>
              </div>
              {formData.estimatedTime && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Tiempo estimado:</span>
                  <span className="text-gray-700">{formData.estimatedTime} minutos</span>
                </div>
              )}
              {formData.notifications && !editingTask && (
                <div className="flex items-center space-x-2">
                  <Bell className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">Notificaciones activadas</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1">
              {editingTask ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {editingTask ? "Actualizar Tarea" : "Crear Tarea"}
            </Button>
            {editingTask && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
