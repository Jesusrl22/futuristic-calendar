"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Trash2, Edit2, CheckSquare, Calendar } from "lucide-react"
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
import { TaskDayView } from "@/components/TaskDayView"
import { TaskWeekView } from "@/components/TaskWeekView"
import { TaskMonthView } from "@/components/TaskMonthView"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
      const response = await fetch("/api/tasks", { 
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        }
      })
      console.log("[v0] Tasks response status:", response.status)
      
      if (!response.ok && response.status === 429) {
        console.warn("[v0] Tasks rate limited (429), will retry in 30 seconds")
        // Set a retry timeout instead of immediately failing
        setTimeout(fetchTasks, 30000)
        return
      }
      
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

  const handleQuickTaskCreate = async (title: string, priority: string) => {
    if (!title.trim()) return

    setIsCreating(true)
    try {
      const today = new Date().toISOString()
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          priority,
          completed: false,
          due_date: today,
        }),
      })

      if (response.ok) {
        await fetchTasks()
        toast({ title: "Éxito", description: "Tarea creada para hoy" })
      }
    } catch (error) {
      toast({ title: t("error"), description: "Error creando tarea", variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 h-full overflow-y-auto">
      {/* Header with title and action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
        <div className="space-y-1 w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("tasks")}</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">{t("manage_tasks")}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg shadow-lg w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              {t("newTask")}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md">
            <DialogHeader>
              <DialogTitle>{t("newTask")}</DialogTitle>
              <DialogDescription>{t("add_new_task")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("title")} *</Label>
                <Input
                  id="title"
                  placeholder={`${t("title")}...`}
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">{t("priority")}</Label>
                <select
                  id="priority"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">{t("priority_low")}</option>
                  <option value="medium">{t("priority_medium")}</option>
                  <option value="high">{t("priority_high")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">{t("time")}</Label>
                <Input
                  id="time"
                  placeholder={language === "es" ? "ej: 45 min, 2 h" : "e.g.: 45 min, 2 h"}
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating} className="w-full sm:w-auto">
                {t("cancel")}
              </Button>
              <Button onClick={createTask} disabled={isCreating} className="w-full sm:w-auto">
                {isCreating ? `${t("creating")}...` : t("create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-background border border-border rounded-lg">
          <TabsTrigger value="today" className="gap-2">
            <Calendar className="h-4 w-4" />
            Hoy
          </TabsTrigger>
          <TabsTrigger value="week" className="gap-2">
            <Calendar className="h-4 w-4" />
            Semana
          </TabsTrigger>
          <TabsTrigger value="month" className="gap-2">
            <Calendar className="h-4 w-4" />
            Mes
          </TabsTrigger>
        </TabsList>

        {/* Today View */}
        <TabsContent value="today" className="space-y-4 mt-6">
          <TaskDayView
            tasks={tasks}
            onTaskToggle={toggleTask}
            onTaskDelete={deleteTask}
            onTaskEdit={openEditDialog}
            onTaskCreate={handleQuickTaskCreate}
          />
        </TabsContent>

        {/* Week View */}
        <TabsContent value="week" className="space-y-4 mt-6">
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <h2 className="text-xl font-bold text-foreground">Vista de Semana</h2>
            <p className="text-sm text-muted-foreground">Organiza tus tareas por día</p>
          </div>
          <TaskWeekView
            tasks={tasks}
            onTaskToggle={toggleTask}
            onTaskDelete={deleteTask}
            onTaskEdit={openEditDialog}
          />
        </TabsContent>

        {/* Month View */}
        <TabsContent value="month" className="space-y-4 mt-6">
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <h2 className="text-xl font-bold text-foreground">Vista de Mes</h2>
            <p className="text-sm text-muted-foreground">Visualiza todas tus tareas del mes</p>
          </div>
          <TaskMonthView
            tasks={tasks}
            onTaskClick={openEditDialog}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle>{t("editTask")}</DialogTitle>
            <DialogDescription>{t("update_task_details")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">{t("title")} *</Label>
              <Input
                id="edit-title"
                placeholder={`${t("title")}...`}
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{t("description")}</Label>
              <textarea
                id="edit-description"
                placeholder={`${t("description")}...`}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-priority">{t("priority")}</Label>
              <select
                id="edit-priority"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                value={editForm.priority}
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
              >
                <option value="low">{t("priority_low")}</option>
                <option value="medium">{t("priority_medium")}</option>
                <option value="high">{t("priority_high")}</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isCreating} className="w-full sm:w-auto">
              {t("cancel")}
            </Button>
            <Button onClick={updateTask} disabled={isCreating} className="w-full sm:w-auto">
              {isCreating ? `${t("updating")}...` : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
