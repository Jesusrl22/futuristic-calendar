"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Trash2, Edit, CheckSquare, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/hooks/useTranslation"
import { useLanguage } from "@/contexts/language-context"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("today")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const { toast } = useToast()
  const supabase = createClient()

  const [newTask, setNewTask] = useState({
    title: "",
    priority: "medium",
    time: "",
  })

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      console.log("[v0] Fetching tasks...")
      const response = await fetch("/api/tasks", { cache: "no-store" })
      console.log("[v0] Tasks response status:", response.status)
      
      if (!response.ok) {
        console.log("[v0] Tasks response error:", response.status)
        return
      }
      
      const data = await response.json()
      console.log("[v0] Tasks data received:", data)
      if (data.tasks) {
        setTasks(data.tasks)
      }
    } catch (error: any) {
      console.error("[v0] Error fetching tasks:", error.message)
    }
  }

  const createTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: t("error"),
        description: "Por favor ingresa un título",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      console.log("[v0] Creating task with data:", newTask)
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.time,
          priority: newTask.priority,
          completed: false,
        }),
      })

      console.log("[v0] Create task response status:", response.status)
      
      if (response.ok) {
        console.log("[v0] Task created successfully, refreshing list...")
        setIsDialogOpen(false)
        setNewTask({ title: "", priority: "medium", time: "" })
        await fetchTasks()
        toast({ title: "Éxito", description: "Tarea creada" })
      } else {
        const error = await response.json().catch(() => ({}))
        console.log("[v0] Create task error:", error)
        toast({ title: t("error"), description: "Error creando tarea", variant: "destructive" })
      }
    } catch (error: any) {
      console.error("[v0] Exception creating task:", error.message)
      toast({ title: t("error"), description: "Error creando tarea", variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await fetch(`/api/tasks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      })
      fetchTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, completed: !completed }),
      })
      fetchTasks()
    } catch (error) {
      console.error("Error toggling task:", error)
    }
  }

  const openEditDialog = (task: any) => {
    setEditingTask(task)
    setEditForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
    })
    setIsEditDialogOpen(true)
  }

  const updateTask = async () => {
    if (!editForm.title.trim()) return

    setIsCreating(true)
    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTask.id,
          title: editForm.title,
          description: editForm.description,
          priority: editForm.priority,
        }),
      })

      if (response.ok) {
        setIsEditDialogOpen(false)
        await fetchTasks()
        toast({ title: "Éxito", description: "Tarea actualizada" })
      }
    } catch (error) {
      toast({ title: t("error"), description: "Error actualizando tarea", variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTodayTasks = () => {
    const today = new Date().toISOString().split("T")[0]
    return filteredTasks.filter((task) => !task.due_date || task.due_date.startsWith(today))
  }


  const todayTasks = getTodayTasks()

  return (
    <div className="w-full px-6 py-6 space-y-6 h-full overflow-y-auto">
      {/* Header with title and action */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <CheckSquare className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Tareas</h1>
          </div>
          <p className="text-sm text-muted-foreground">manage.tasks</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Tarea</DialogTitle>
              <DialogDescription>Crea una nueva tarea</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Título..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <select
                  id="priority"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Tiempo estimado</Label>
                <Input
                  id="time"
                  placeholder="ej: 45 min, 2 h, 1:30 h"
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>
                Cancelar
              </Button>
              <Button onClick={createTask} disabled={isCreating}>
                {isCreating ? "Creando..." : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Buscar tareas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/50 border border-border/50"
        />
      </div>

      {/* TASKS VIEW */}
      <div className="space-y-6">
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground">
            HOY - {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }).replace(/^\w/, (c) => c.toUpperCase())}
          </h2>
        </div>

        {todayTasks.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <p className="text-muted-foreground">No hay tareas para hoy</p>
          </Card>
            ) : (
              <div className="w-full space-y-4">
                <div className="overflow-x-auto rounded-lg border border-border/50 bg-background/30">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-primary/10 border-b border-border/50">
                        <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground border-r border-border/30 w-12"></th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground border-r border-border/30 flex-1">
                          Tarea
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 w-24">
                          Prioridad
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 w-24">
                          Tiempo
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 w-28">
                          Estado
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground w-16">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {todayTasks.map((task: any) => (
                        <tr key={task.id} className="hover:bg-primary/5 transition-colors">
                          <td className="px-4 py-4 border-r border-border/30">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id, task.completed)}
                            />
                          </td>
                          <td className="px-4 py-4 border-r border-border/30">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                  task.priority === "high"
                                    ? "bg-red-500"
                                    : task.priority === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                              />
                              <span className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {task.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center border-r border-border/30">
                            {task.priority && (
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  task.priority === "high"
                                    ? "bg-red-500/10 text-red-500 border border-red-500/30"
                                    : task.priority === "medium"
                                      ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30"
                                      : "bg-green-500/10 text-green-500 border border-green-500/30"
                                }`}
                              >
                                {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center border-r border-border/30 text-sm font-medium text-foreground">
                            {task.description || "-"}
                          </td>
                          <td className="px-4 py-4 text-center border-r border-border/30">
                            <div className="flex items-center justify-center gap-2">
                              {task.completed ? (
                                <span className="inline-flex items-center gap-1 text-green-500 text-xs font-medium">
                                  <CheckCircle2 className="w-4 h-4" /> Completada
                                </span>
                              ) : (
                                <span className="text-yellow-500 text-xs font-medium">● Pendiente</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:bg-primary/20"
                                onClick={() => openEditDialog(task)}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:bg-red-500/20 hover:text-red-500"
                                onClick={() => deleteTask(task.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-background/40 border border-border/30 rounded-lg p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tiempo total planificado: <span className="font-bold text-cyan-400">2 h 15 min</span></p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold">{todayTasks.filter(t => t.completed).length} min completadas</span>
                  </div>
                </div>
                <div className="bg-background/40 border border-border/30 rounded-lg p-4 flex items-center justify-between">
                  <p className="text-sm">¡Comienza bien el día y completa tus tareas! 🚀</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
            <DialogDescription>Actualiza los detalles de la tarea</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título *</Label>
              <Input
                id="edit-title"
                placeholder="Título..."
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-priority">Prioridad</Label>
              <select
                id="edit-priority"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                value={editForm.priority}
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isCreating}>
              Cancelar
            </Button>
            <Button onClick={updateTask} disabled={isCreating}>
              {isCreating ? "Actualizando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
