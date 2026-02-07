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
    // Solo mostrar tareas de hoy, excluir tareas sin fecha o del futuro
    return filteredTasks.filter((task) => {
      if (!task.due_date) return true // Tareas sin fecha se muestran como tareas de hoy
      const taskDate = task.due_date.split("T")[0]
      return taskDate === today // Solo exactamente hoy
    })
  }

  const calculateTotalTime = (taskList: any[]) => {
    let totalMinutes = 0
    taskList.forEach((task) => {
      if (task.description) {
        const match = task.description.match(/(\d+)\s*(min|h|m)/)
        if (match) {
          const value = parseInt(match[1])
          const unit = match[2]
          if (unit === "h") {
            totalMinutes += value * 60
          } else {
            totalMinutes += value
          }
        }
      }
    })
    if (totalMinutes === 0) return "0 min"
    if (totalMinutes < 60) return `${totalMinutes} min`
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`
  }

  const todayTasks = getTodayTasks()

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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
        <Input
          placeholder={`${t("search")} ${t("tasks").toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 sm:pl-10 bg-background/50 border border-border/50 text-sm sm:text-base"
        />
      </div>

      {/* TASKS VIEW */}
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {t("today").toUpperCase()} - {new Date().toLocaleDateString(language === "es" ? "es-ES" : language === "fr" ? "fr-FR" : language === "de" ? "de-DE" : "en-US", { weekday: "long", day: "numeric", month: "long" }).replace(/^\w/, (c) => c.toUpperCase())}
          </h2>
        </div>

        {todayTasks.length === 0 ? (
          <Card className="glass-card p-8 sm:p-12 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">{t("no_tasks_today")}</p>
          </Card>
        ) : (
          <div className="w-full space-y-4">
            <div className="overflow-x-auto rounded-lg border border-border/50 bg-background/30 -mx-4 sm:mx-0">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-primary/10 border-b border-border/50">
                    <th className="px-2 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground border-r border-border/30 w-8 sm:w-12"></th>
                    <th className="px-2 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground border-r border-border/30 min-w-[150px]">
                      {t("task")}
                    </th>
                    <th className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 w-20 sm:w-24">
                      {t("priority")}
                    </th>
                    <th className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 w-20 sm:w-24">
                      {t("time")}
                    </th>
                    <th className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 w-24 sm:w-28">
                      {t("status")}
                    </th>
                    <th className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs font-semibold text-muted-foreground w-12 sm:w-16">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {todayTasks.map((task: any) => (
                    <tr key={task.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-2 sm:px-4 py-3 sm:py-4 border-r border-border/30">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id, task.completed)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 border-r border-border/30">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
                      className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({task.priority === "high" ? t("priority_high") : task.priority === "medium" ? t("priority_medium") : t("priority_low")})
                    </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center border-r border-border/30">
                        {task.priority && (
                          <span
                            className={`inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                              task.priority === "high"
                                ? "bg-red-500/10 text-red-500 border border-red-500/30"
                                : task.priority === "medium"
                                  ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30"
                                  : "bg-green-500/10 text-green-500 border border-green-500/30"
                            }`}
                          >
                            {task.priority === "high" ? t("priority_high") : task.priority === "medium" ? t("priority_medium") : t("priority_low")}
                          </span>
                        )}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center border-r border-border/30 text-xs sm:text-sm font-medium text-foreground">
                        {task.description || "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center border-r border-border/30">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          {task.completed ? (
                            <span className="inline-flex items-center gap-1 text-green-500 text-[10px] sm:text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> {t("completed")}
                            </span>
                          ) : (
                            <span className="text-yellow-500 text-[10px] sm:text-xs font-medium">● {t("pending")}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 sm:h-7 sm:w-7 hover:bg-primary/20"
                            onClick={() => openEditDialog(task)}
                          >
                            <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 sm:h-7 sm:w-7 hover:bg-red-500/20 hover:text-red-500"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-background/40 border border-border/30 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground">{t("time_planned")}: <span className="font-bold text-cyan-400">{calculateTotalTime(todayTasks)}</span></p>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                <span className="font-semibold">{todayTasks.filter(t => t.completed).length} {t("completed_count")}</span>
              </div>
            </div>
            <div className="bg-background/40 border border-border/30 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm">{t("motivational_message")}</p>
            </div>
          </div>
        )}
      </div>

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
