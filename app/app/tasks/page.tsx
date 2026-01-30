"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Trash2, Edit, GripVertical, CheckSquare, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/hooks/useTranslation"
import { StreaksWidget } from "@/components/streaks-widget"
import { SectionHeader } from "@/components/section-header"
import { useLanguage } from "@/contexts/language-context"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [userTimezone, setUserTimezone] = useState<string>("UTC")
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    due_date: "",
    due_time: "",
  })
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    due_date: "",
    due_time: "",
  })
  const [isCreating, setIsCreating] = useState(false)
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const { toast } = useToast()
  const supabase = createClient()

  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [dragOverTask, setDragOverTask] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
    fetchTimezone()
  }, [])

  const fetchTimezone = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        if (data.profile?.timezone) {
          setUserTimezone(data.profile.timezone)
        } else {
          const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
          setUserTimezone(detectedTimezone)
        }
      } else {
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        setUserTimezone(detectedTimezone)
      }
    } catch (error) {
      console.error("Error fetching timezone:", error)
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      setUserTimezone(detectedTimezone)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      const data = await response.json()
      if (data.tasks) {
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
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

  const createTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: t("error"),
        description: t("enterTaskTitle"),
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      let dueDate = null
      if (newTask.due_date) {
        const [year, month, day] = newTask.due_date.split("-")
        if (newTask.due_time) {
          const [hours, minutes] = newTask.due_time.split(":")
          const localDate = new Date(
            Number.parseInt(year),
            Number.parseInt(month) - 1,
            Number.parseInt(day),
            Number.parseInt(hours),
            Number.parseInt(minutes),
            0,
          )
          dueDate = localDate.toISOString()
        } else {
          const localDate = new Date(
            Number.parseInt(year),
            Number.parseInt(month) - 1,
            Number.parseInt(day),
            23,
            59,
            59,
          )
          dueDate = localDate.toISOString()
        }
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          category: newTask.category || null,
          due_date: dueDate,
          completed: false,
          status: "todo",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: t("error"),
          description: data.error || t("failed_create_task"),
          variant: "destructive",
        })
      } else {
        setIsDialogOpen(false)
        setNewTask({
          title: "",
          description: "",
          priority: "medium",
          category: "",
          due_date: "",
          due_time: "",
        })
        fetchTasks()
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_create_task") + ". " + t("please_try_again"),
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const openEditDialog = (task: any) => {
    setEditingTask(task)
    let dueDate = ""
    let dueTime = ""

    if (task.due_date) {
      const isoString = task.due_date
      dueDate = isoString.slice(0, 10) // YYYY-MM-DD
      dueTime = isoString.slice(11, 16) // HH:MM
    }

    setEditForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      category: task.category || "",
      due_date: dueDate,
      due_time: dueTime,
    })
    setIsEditDialogOpen(true)
  }

  const updateTask = async () => {
    if (!editForm.title.trim()) {
      toast({
        title: t("error"),
        description: t("enterTaskTitle"),
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      let dueDate = null
      if (editForm.due_date) {
        const [year, month, day] = editForm.due_date.split("-")
        if (editForm.due_time) {
          const [hours, minutes] = editForm.due_time.split(":")
          const localDate = new Date(
            Number.parseInt(year),
            Number.parseInt(month) - 1,
            Number.parseInt(day),
            Number.parseInt(hours),
            Number.parseInt(minutes),
            0,
          )
          dueDate = localDate.toISOString()
        } else {
          const localDate = new Date(
            Number.parseInt(year),
            Number.parseInt(month) - 1,
            Number.parseInt(day),
            23,
            59,
            59,
          )
          dueDate = localDate.toISOString()
        }
      }

      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTask.id,
          title: editForm.title,
          description: editForm.description,
          priority: editForm.priority,
          category: editForm.category || null,
          due_date: dueDate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: t("error"),
          description: data.error || t("failed_update_task"),
          variant: "destructive",
        })
      } else {
        setIsEditDialogOpen(false)
        setEditingTask(null)
        fetchTasks()
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_update_task") + ". " + t("please_try_again"),
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed)
    return matchesSearch && matchesFilter
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 border-red-500/30"
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/30"
      case "low":
        return "bg-green-500/10 border-green-500/30"
      default:
        return "bg-muted/10 border-muted/30"
    }
  }

  // Get week days for the planner
  const getWeekDays = () => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      
      const dayName = date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase()
      const dayNum = String(date.getDate()).padStart(2, "0")
      
      return {
        date: dayNum,
        dayName,
        fullDate: date.toISOString().split("T")[0],
      }
    })
  }

  // Check if task is scheduled for a specific day
  const isTaskScheduledForDay = (taskId: string, day: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task || !task.scheduled_days) return false
    return task.scheduled_days.includes(day)
  }

  // Toggle task for a specific day
  const toggleTaskForDay = async (taskId: string, day: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const scheduledDays = task.scheduled_days || []
    const updated = scheduledDays.includes(day)
      ? scheduledDays.filter((d: string) => d !== day)
      : [...scheduledDays, day]

    try {
      const response = await fetch(`/api/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          scheduled_days: updated,
        }),
      })

      if (response.ok) {
        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, scheduled_days: updated } : t)))
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  // Get completed count
  const getCompletedCount = () => {
    return filteredTasks.filter((t: any) => t.completed).length
  }

  const formatTaskDateTime = (dateString: string) => {
    // Parse ISO string directly to avoid timezone conversion issues
    const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
    if (isoMatch) {
      const [, year, month, day, hours, minutes] = isoMatch
      return `${day}/${month}/${year} ${hours}:${minutes}`
    }

    // Fallback: if format is different, parse manually to avoid timezone conversion
    const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      const [, year, month, day] = match
      return `${day}/${month}/${year}`
    }

    return dateString
  }

  const handleDragStart = (e: React.DragEvent, taskId: string, isCompleted: boolean) => {
    if (isCompleted) {
      e.preventDefault()
      return
    }
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, taskId: string, isCompleted: boolean) => {
    e.preventDefault()
    if (isCompleted || !draggedTask) return
    setDragOverTask(taskId)
  }

  const handleDragLeave = () => {
    setDragOverTask(null)
  }

  const handleDrop = async (e: React.DragEvent, dropTaskId: string, isCompleted: boolean) => {
    e.preventDefault()
    if (!draggedTask || draggedTask === dropTaskId || isCompleted) {
      setDraggedTask(null)
      setDragOverTask(null)
      return
    }

    // Reorder tasks locally
    const draggedIndex = filteredTasks.findIndex((t) => t.id === draggedTask)
    const dropIndex = filteredTasks.findIndex((t) => t.id === dropTaskId)

    const newTasks = [...tasks]
    const draggedTaskData = newTasks.find((t) => t.id === draggedTask)
    const dropTaskData = newTasks.find((t) => t.id === dropTaskId)

    if (draggedTaskData && dropTaskData) {
      const draggedOriginalIndex = newTasks.indexOf(draggedTaskData)
      const dropOriginalIndex = newTasks.indexOf(dropTaskData)

      newTasks.splice(draggedOriginalIndex, 1)
      const newDropIndex = newTasks.indexOf(dropTaskData)
      newTasks.splice(newDropIndex + (draggedIndex > dropIndex ? 0 : 1), 0, draggedTaskData)

      setTasks(newTasks)

      try {
        const incompleteTasks = newTasks.filter((t) => !t.completed)
        const taskOrders = incompleteTasks.map((task, index) => ({
          id: task.id,
          order: index,
        }))

        await fetch("/api/tasks/reorder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskOrders }),
        })
      } catch (error) {
        console.error("Failed to save task order:", error)
        toast({
          title: t("error"),
          description: "Failed to save task order",
          variant: "destructive",
        })
      }
    }

    setDraggedTask(null)
    setDragOverTask(null)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverTask(null)
  }

  const addTaskToCalendar = async (task: any) => {
    if (!task.due_date) {
      toast({
        title: t("info"),
        description: "Por favor establece una fecha de vencimiento para la tarea",
        variant: "default",
      })
      return
    }

    try {
      toast({
        title: "Éxito",
        description: `Tarea "${task.title}" agregada al calendario`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: "No se pudo agregar la tarea al calendario",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      <SectionHeader
        title={t("tasks")}
        subtitle={t("manage_tasks")}
        icon={CheckSquare}
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg shadow-primary/30 w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                {t("newTask")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("createNewTask")}</DialogTitle>
                <DialogDescription>
                  {t("add")} {t("newTask").toLowerCase()} {t("tasks").toLowerCase()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("title")} *</Label>
                  <Input
                    id="title"
                    placeholder={t("title") + "..."}
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t("description")}</Label>
                  <Textarea
                    id="description"
                    placeholder={t("description") + "..."}
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">{t("priority")}</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t("low")}</SelectItem>
                        <SelectItem value="medium">{t("medium")}</SelectItem>
                        <SelectItem value="high">{t("high")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{t("category")}</Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder={t("category")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">{t("personal")}</SelectItem>
                        <SelectItem value="work">{t("work")}</SelectItem>
                        <SelectItem value="study">{t("study")}</SelectItem>
                        <SelectItem value="health">{t("health")}</SelectItem>
                        <SelectItem value="finance">{t("finance")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due_date">{t("dueDate")}</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_time">{t("dueTime")}</Label>
                    <Input
                      id="due_time"
                      type="time"
                      value={newTask.due_time}
                      onChange={(e) => setNewTask({ ...newTask, due_time: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>
                  {t("cancel")}
                </Button>
                <Button onClick={createTask} disabled={isCreating}>
                  {isCreating ? t("creating") : t("createTask")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder={t("searchTasks")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="today">{t("today")}</TabsTrigger>
          <TabsTrigger value="week">{t("week")}</TabsTrigger>
          <TabsTrigger value="month">{t("month")}</TabsTrigger>
          <TabsTrigger value="all">{t("allTasks")}</TabsTrigger>
        </TabsList>

        {/* WEEK VIEW */}
        <TabsContent value="week" className="w-full">
          <div className="space-y-6">
            {filteredTasks.length === 0 ? (
              <Card className="glass-card p-12 text-center">
                <p className="text-muted-foreground">{t("noTasksFound")}</p>
              </Card>
            ) : (
              <>
                <div className="w-full overflow-x-auto rounded-lg border border-border/50 bg-background/30">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-primary/10 border-b border-border/50">
                        <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground border-r border-border/30 min-w-[220px]">
                          {t("task")} / {t("activity")}
                        </th>
                        {getWeekDays().map((day) => (
                          <th key={day.date} className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 min-w-[100px]">
                            <div className="text-xs font-medium">{day.dayName}</div>
                            <div className="text-xs text-muted-foreground">{day.date}</div>
                          </th>
                        ))}
                        <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground min-w-[150px]">
                          {t("notes")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {filteredTasks.map((task: any) => (
                        <tr key={task.id} className="hover:bg-primary/5 transition-colors">
                          {/* Task Name */}
                          <td className="px-4 py-4 border-r border-border/30">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={task.completed}
                                  onCheckedChange={() => toggleTask(task.id, task.completed)}
                                />
                                <span className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                  {task.title}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 ml-6">
                                {task.category && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                                    {t(task.category)}
                                  </span>
                                )}
                                {task.priority === "high" && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold flex items-center gap-1">
                                    <span>⚠</span> {t("priority_high")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Days of week with checkboxes */}
                          {getWeekDays().map((day) => (
                            <td key={day.date} className="px-4 py-4 text-center border-r border-border/30">
                              <Checkbox
                                checked={isTaskScheduledForDay(task.id, day.date)}
                                onCheckedChange={() => toggleTaskForDay(task.id, day.date)}
                                className="mx-auto"
                              />
                            </td>
                          ))}

                          {/* Notes/Additional Info */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground truncate">
                                {task.description || task.due_date ? formatTaskDateTime(task.due_date) : ""}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:bg-primary/10"
                                onClick={() => openEditDialog(task)}
                                title={t("edit")}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:text-destructive hover:bg-destructive/10"
                                onClick={() => deleteTask(task.id)}
                                title={t("delete")}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Section */}
                <div className="bg-background/40 border border-border/30 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{t("totalCompleted")}:</span>
                    <span className="text-lg font-bold text-primary">{getCompletedCount()} / {filteredTasks.length} {t("days")}</span>
                  </div>
                  <div className="pt-4 border-t border-border/30 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">¡Sigue así! 🚀</span>
                    <span className="text-xs font-semibold text-primary">{t("weeklyGoal")}: 5x {t("week")}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* OTHER VIEWS */}
        <TabsContent value={filter} className="w-full">
          {filteredTasks.length === 0 ? (
            <Card className="glass-card p-12 text-center">
              <p className="text-muted-foreground">{t("noTasksFound")}</p>
            </Card>
          ) : (
            <div className="w-full overflow-x-auto rounded-lg border border-border/50 bg-background/30">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary/10 border-b border-border/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-12 border-r border-border/30">
                      <CheckSquare className="h-4 w-4" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground border-r border-border/30 min-w-[250px]">
                      {t("title")}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 min-w-[120px]">
                      {t("category")}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 min-w-[100px]">
                      {t("priority")}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 min-w-[140px]">
                      {t("dueDate")}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground w-32">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredTasks.map((task: any) => (
                    <tr
                      key={task.id}
                      className={`hover:bg-primary/5 transition-colors`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3 text-center border-r border-border/30">
                        <div className="flex items-center justify-center gap-2">
                          {!task.completed && (
                            <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
                          )}
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id, task.completed)}
                          />
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-4 py-3 border-r border-border/30">
                        <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : "text-foreground font-medium"}`}>
                          {task.title}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-center border-r border-border/30">
                        {task.category && (
                          <span className="inline-flex text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                            {t(task.category)}
                          </span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3 text-center border-r border-border/30">
                        {task.priority && (
                          <span className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(task.priority)} ${getPriorityBgColor(task.priority)} border`}>
                            {t(task.priority)}
                          </span>
                        )}
                      </td>

                      {/* Due Date */}
                      <td className="px-4 py-3 text-center border-r border-border/30">
                        {task.due_date && (
                          <span className="text-xs text-muted-foreground">
                            {formatTaskDateTime(task.due_date)}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                            onClick={() => addTaskToCalendar(task)}
                            title={t("calendar")}
                          >
                            <Calendar className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10"
                            onClick={() => openEditDialog(task)}
                            title={t("edit")}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteTask(task.id)}
                            title={t("delete")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editTask")}</DialogTitle>
            <DialogDescription>{t("update_task_details")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">{t("title")} *</Label>
              <Input
                id="edit-title"
                placeholder={t("title") + "..."}
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{t("description")}</Label>
              <Textarea
                id="edit-description"
                placeholder={t("description") + "..."}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-priority">{t("priority")}</Label>
                <Select value={editForm.priority} onValueChange={(value) => setEditForm({ ...editForm, priority: value })}>
                  <SelectTrigger id="edit-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t("low")}</SelectItem>
                    <SelectItem value="medium">{t("medium")}</SelectItem>
                    <SelectItem value="high">{t("high")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">{t("category")}</Label>
                <Select value={editForm.category} onValueChange={(value) => setEditForm({ ...editForm, category: value })}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder={t("category")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">{t("personal")}</SelectItem>
                    <SelectItem value="work">{t("work")}</SelectItem>
                    <SelectItem value="study">{t("study")}</SelectItem>
                    <SelectItem value="health">{t("health")}</SelectItem>
                    <SelectItem value="finance">{t("finance")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-due_date">{t("dueDate")}</Label>
                <Input
                  id="edit-due_date"
                  type="date"
                  value={editForm.due_date}
                  onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-due_time">{t("dueTime")}</Label>
                <Input
                  id="edit-due_time"
                  type="time"
                  value={editForm.due_time}
                  onChange={(e) => setEditForm({ ...editForm, due_time: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isCreating}>
              {t("cancel")}
            </Button>
            <Button onClick={updateTask} disabled={isCreating}>
              {isCreating ? t("updating") : t("updateTask")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
