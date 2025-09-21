"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X, Plus, Clock, Bell } from "lucide-react"

interface TaskFormProps {
  onAddTask: (task: any) => void
  onClose: () => void
  selectedDate: Date
}

export function TaskForm({ onAddTask, onClose, selectedDate }: TaskFormProps) {
  const [formData, setFormData] = useState({
    text: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    category: "personal",
    date: selectedDate.toISOString().split("T")[0],
    time: "",
    notification_enabled: false,
  })

  const categories = [
    { value: "personal", label: "Personal" },
    { value: "trabajo", label: "Trabajo" },
    { value: "salud", label: "Salud" },
    { value: "educacion", label: "Educación" },
    { value: "finanzas", label: "Finanzas" },
    { value: "hogar", label: "Hogar" },
    { value: "social", label: "Social" },
    { value: "otros", label: "Otros" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.text.trim()) return

    const newTask = {
      ...formData,
      completed: false,
      created_at: new Date().toISOString(),
      notification_enabled: formData.time ? formData.notification_enabled : false,
    }

    onAddTask(newTask)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-purple-500" />
              Nueva Tarea
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Para el {selectedDate.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="text" className="text-slate-700 dark:text-slate-300">
                Título *
              </Label>
              <Input
                id="text"
                placeholder="¿Qué necesitas hacer?"
                value={formData.text}
                onChange={(e) => handleInputChange("text", e.target.value)}
                className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">
                Descripción
              </Label>
              <Textarea
                id="description"
                placeholder="Detalles adicionales (opcional)"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                rows={3}
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-700 dark:text-slate-300">
                  Categoría
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-slate-700 dark:text-slate-300">
                  Prioridad
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "low" | "medium" | "high") => handleInputChange("priority", value)}
                >
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Baja
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Media
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Alta
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-slate-700 dark:text-slate-300">
                  Fecha
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Hora
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>
            </div>

            {/* Notification Toggle */}
            {formData.time && (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <div>
                    <Label className="text-slate-700 dark:text-slate-300">Notificación</Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Recibir recordatorio a las {formData.time}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.notification_enabled}
                  onCheckedChange={(checked) => handleInputChange("notification_enabled", checked)}
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Crear Tarea
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
