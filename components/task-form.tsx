"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, Tag, Trash2, Save } from "lucide-react"
import { format } from "date-fns"
import type { Task } from "@/lib/hybrid-database"

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  onTaskCreated: (task: any) => void
  editingTask?: Task | null
  onTaskUpdated?: (taskId: string, updates: Partial<Task>) => void
  onTaskDeleted?: (taskId: string) => void
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
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [category, setCategory] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")
  const [completed, setCompleted] = useState(false)
  const [hasTime, setHasTime] = useState(false)

  // Reset form when opening/closing or when editing task changes
  useEffect(() => {
    if (isOpen && editingTask) {
      // Editing existing task
      setTitle(editingTask.title || "")
      setDescription(editingTask.description || "")
      setPriority(editingTask.priority || "medium")
      setCategory(editingTask.category || "")
      setCompleted(editingTask.completed || false)

      if (editingTask.due_date) {
        const date = new Date(editingTask.due_date)
        setDueDate(format(date, "yyyy-MM-dd"))

        if (editingTask.due_date.includes("T")) {
          setHasTime(true)
          setDueTime(format(date, "HH:mm"))
        } else {
          setHasTime(false)
          setDueTime("")
        }
      } else {
        setDueDate("")
        setDueTime("")
        setHasTime(false)
      }
    } else if (isOpen && !editingTask) {
      // Creating new task - use selected date
      setTitle("")
      setDescription("")
      setPriority("medium")
      setCategory("")
      setCompleted(false)
      setDueDate(format(selectedDate, "yyyy-MM-dd"))
      setDueTime("")
      setHasTime(false)
    }
  }, [isOpen, editingTask, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Por favor, ingresa un título para la tarea")
      return
    }

    // Construct the due_date string
    let finalDueDate = dueDate
    if (hasTime && dueTime) {
      finalDueDate = `${dueDate}T${dueTime}:00`
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category: category.trim() || undefined,
      due_date: finalDueDate || undefined,
      completed,
    }

    if (editingTask && onTaskUpdated) {
      onTaskUpdated(editingTask.id, taskData)
    } else {
      onTaskCreated(taskData)
    }
  }

  const handleDelete = () => {
    if (editingTask && onTaskDeleted) {
      if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
        onTaskDeleted(editingTask.id)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {editingTask ? "Editar Tarea" : "Nueva Tarea"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-900 dark:text-white">
              Título *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Revisar emails"
              required
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-900 dark:text-white">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles adicionales..."
              rows={3}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority" className="text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Prioridad
              </Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Baja</SelectItem>
                  <SelectItem value="medium">🟡 Media</SelectItem>
                  <SelectItem value="high">🔴 Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category" className="text-gray-900 dark:text-white">
                Categoría
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej: Trabajo"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha de vencimiento
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="hasTime" checked={hasTime} onCheckedChange={(checked) => setHasTime(checked as boolean)} />
              <Label htmlFor="hasTime" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                Agregar hora específica
              </Label>
            </div>

            {hasTime && (
              <div className="pt-2">
                <Label htmlFor="dueTime" className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Hora
                </Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {editingTask && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={completed}
                onCheckedChange={(checked) => setCompleted(checked as boolean)}
              />
              <Label htmlFor="completed" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                Marcar como completada
              </Label>
            </div>
          )}

          <DialogFooter className="gap-2">
            {editingTask && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              {editingTask ? "Guardar Cambios" : "Crear Tarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
