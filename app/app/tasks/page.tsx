"use client"

// Task Management Page - Updated Design
// Views: Today (Checkbox | Task | Priority | Time | Status | Actions)
//        Week (7-day calendar grid with task assignments)

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Trash2, Edit, GripVertical, CheckSquare, Calendar, CheckCircle2 } from "lucide-react"
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
  const [viewMode, setViewMode] = useState("today") // "today" or "week"
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [inlineNewTask, setInlineNewTask] = useState("") // For inline row input
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

  // Create task from inline input
  const createTaskFromInline = async (taskTitle: string, dayDate?: string) => {
    if (!taskTitle.trim()) return

    try {
      const dueDate = dayDate ? `2025-01-${dayDate}` : null

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle.trim(),
          description: "",
          priority: "medium",
          category: null,
          due_date: dueDate,
          completed: false,
          status: "todo",
        }),
      })

      if (response.ok) {
        setInlineNewTask("")
        fetchTasks()
        toast({
          title: "Éxito",
          description: "Tarea creada exitosamente",
        })
      }
    } catch (error) {
      console.error("Error creating task from inline:", error)
      toast({
        title: t("error"),
        description: t("failed_create_task"),
        variant: "destructive",
      })
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
    return task.title.toLowerCase().includes(searchQuery.toLowerCase())
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

  const calculateTotalTime = (taskList: any[]) => {
    let totalMinutes = 0
    taskList.forEach((task: any) => {
      if (task.estimated_time) {
        const match = task.estimated_time.match(/(\d+)\s*(min|h)/)
        if (match) {
          const value = parseInt(match[1])
          const unit = match[2]
          totalMinutes += unit === "h" ? value * 60 : value
        }
      }
    })
    
    if (totalMinutes === 0) return "0 min"
    if (totalMinutes < 60) return `${totalMinutes} min`
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`
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

  // Get today's date (YYYY-MM-DD format)
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const date = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${date}`
  }

  // Get tasks for today (tasks with due_date = today)
  const getTodayTasks = () => {
    const today = getTodayDate()
    return filteredTasks.filter((task: any) => task.due_date && task.due_date.startsWith(today))
  }

  // Get tasks for a specific week (Mon-Sun of current week)
  const getWeekDays = () => {
    const today = new Date()
    const first = today.getDate() - today.getDay()
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.setDate(first + i))
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const dateStr = `${year}-${month}-${day}`
      days.push({
        date: dateStr,
        dayName: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()],
      })
    }
    return days
  }

  // Get week tasks: tasks whose due_date falls within this week
  const getWeekTasks = () => {
    const weekDays = getWeekDays()
    const weekDateSet = new Set(weekDays.map((d) => d.date))
    return filteredTasks.filter((task: any) => task.due_date && weekDateSet.has(task.due_date.substring(0, 10)))
  }

  // Get tasks for a specific date
  const getTasksForDate = (dateStr: string) => {
    return filteredTasks.filter((task: any) => task.due_date && task.due_date.startsWith(dateStr))
  }

  // Get today's day name (e.g., "Monday", "Tuesday", etc.)
  const getTodayDayName = () => {
    const today = new Date()
    return today.toLocaleDateString("en-US", { weekday: "long" })
  }

  // Get tasks for a specific day
  const getTasksForDay = (day: string) => {
    return filteredTasks.filter((task: any) => {
      if (!task.due_date) return false
      return task.due_date.substring(8, 10) === day
    })
  }

  // Check if task is assigned to a specific day
  const isTaskForDay = (taskId: string, day: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task || !task.due_date) return false
    return task.due_date.substring(8, 10) === day
  }

  // Toggle task for a specific day (updates due_date)
  const toggleTaskForDay = async (taskId: string, day: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // If task is already for this day, remove it (set to no date)
    // Otherwise, set it to this day
    const isCurrentlyForDay = task.due_date && task.due_date.substring(8, 10) === day

    try {
      const newDueDate = isCurrentlyForDay ? null : `2025-01-${day}`

      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          due_date: newDueDate,
        }),
      })

      if (response.ok) {
        setTasks(
          tasks.map((t) =>
            t.id === taskId ? { ...t, due_date: newDueDate } : t
          )
        )
      }
    } catch (error) {
      console.error("Error updating task date:", error)
    }
  }

  // Add task for a specific day
  const addTaskForDay = (day: string) => {
    setNewTask({ ...newTask, due_date: `2025-01-${day}` })
    setIsDialogOpen(true)
  }

  // Copy task to other days
  const copyTaskToOtherDays = async (task: any, currentDay: string) => {
    const weekDays = getWeekDays()
    const daysToSelect = weekDays.filter(d => d.date !== currentDay)
    
    if (daysToSelect.length === 0) return

    const selectedDays = daysToSelect.map(d => d.date)
    
    for (const day of selectedDays) {
      try {
        const newTaskData = {
          user_id: task.user_id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          category: task.category,
          due_date: `2025-01-${day}`,
          completed: false,
        }

        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTaskData),
        })

        if (response.ok) {
          const createdTask = await response.json()
          setTasks([...tasks, createdTask])
        }
      } catch (error) {
        console.error(`Error copying task to day ${day}:`, error)
      }
    }

    toast({
      title: "Éxito",
      description: `Tarea copiada a ${selectedDays.length} días`,
    })
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

      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold neon-text">{t("myTasks")}</h1>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            {t("newTask")}
          </Button>
        </div>
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

      {/* TABS: HOY vs SEMANA */}
      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="today">{t("today")}</TabsTrigger>
          <TabsTrigger value="week">{t("week")}</TabsTrigger>
        </TabsList>

        {/* HOY VIEW */}
        <TabsContent value="today" className="w-full space-y-6">
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground">{getTodayDayName()}</h2>
            <p className="text-sm text-muted-foreground">{t("day")} {getTodayDate()}</p>
          </div>

          {getTodayTasks().length === 0 ? (
            <Card className="glass-card p-12 text-center">
              <p className="text-muted-foreground">{t("noTasksFound")}</p>
            </Card>
          ) : (
            <>
              <div className="w-full overflow-x-auto rounded-lg border border-border/50 bg-background/30">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary/10 border-b border-border/50">
                      <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 w-12">
                        ✔
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground border-r border-border/30 min-w-[200px]">
                        {t("task")}
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 min-w-[100px]">
                        {t("priority")}
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 min-w-[80px]">
                        {t("time")}
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 min-w-[80px]">
                        {t("status")}
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground min-w-[60px]">
                        {t("actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {getTodayTasks().map((task: any) => (
                      <tr key={task.id} className="hover:bg-primary/5 transition-colors">
                        {/* Checkbox Column */}
                        <td className="px-4 py-4 text-center border-r border-border/30">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id, task.completed)}
                            className="mx-auto"
                          />
                        </td>

                        {/* Task Name Column */}
                        <td className="px-4 py-4 border-r border-border/30">
                          <span className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                            {task.title}
                          </span>
                        </td>

                        {/* Priority Column */}
                        <td className="px-4 py-4 text-center border-r border-border/30">
                          {task.priority && (
                            <span className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full border ${getPriorityBgColor(task.priority)}`}>
                              {t(task.priority)}
                            </span>
                          )}
                        </td>

                        {/* Time Column (due_time) */}
                        <td className="px-4 py-4 text-center border-r border-border/30">
                          <span className="text-xs text-muted-foreground">
                            {task.estimated_time ? `${task.estimated_time}` : "-"}
                          </span>
                        </td>

                        {/* Status Column */}
                        <td className="px-4 py-4 text-center border-r border-border/30">
                          {task.completed ? (
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Completada
                            </span>
                          ) : task.progress ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full transition-all" 
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{task.progress}%</span>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                              Pendiente
                            </span>
                          )}
                        </td>

                        {/* Delete Action Column */}
                        <td className="px-4 py-4 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-destructive hover:bg-destructive/10 inline-flex"
                            onClick={() => deleteTask(task.id)}
                            title={t("delete")}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {/* Inline Add New Task Row */}
                    <tr className="bg-primary/5 border-t-2 border-primary/30">
                      <td className="px-4 py-3 text-center border-r border-border/30">
                        <span className="text-xs text-muted-foreground">+</span>
                      </td>
                      <td className="px-4 py-3 border-r border-border/30">
                        <Input
                          placeholder="Nueva tarea..."
                          value={inlineNewTask}
                          onChange={(e) => setInlineNewTask(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              createTaskFromInline(inlineNewTask, getTodayDate())
                            }
                          }}
                          className="text-sm h-8"
                        />
                      </td>
                      <td className="px-4 py-3 text-center border-r border-border/30">-</td>
                      <td className="px-4 py-3 text-center border-r border-border/30">-</td>
                      <td className="px-4 py-3 text-center border-r border-border/30">-</td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => createTaskFromInline(inlineNewTask, getTodayDate())}
                          className="h-7 text-xs hover:bg-primary/10"
                          disabled={!inlineNewTask.trim()}
                        >
                          +
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Today Summary */}
              {getTodayTasks().length > 0 && (
                <div className="mt-6 bg-background/40 border border-border/30 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Completadas:</span>
                    <span className="text-lg font-bold text-primary">
                      {getTodayTasks().filter((t: any) => t.completed).length} / {getTodayTasks().length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Tiempo total planificado:</span>
                    <span className="text-lg font-bold text-primary">
                      {calculateTotalTime(getTodayTasks())}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">
                      ¡Sigue así! 🔥 Tienes todo bajo control.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* SEMANA (WEEK) VIEW */}
        <TabsContent value="week" className="w-full space-y-6">
          {getWeekTasks().length === 0 ? (
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
                        {t("task")}
                      </th>
                      {getWeekDays().map((day) => (
                        <th
                          key={day.date}
                          className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground border-r border-border/30 min-w-[90px]"
                        >
                          <div className="font-medium">{day.dayName}</div>
                          <div className="text-xs text-muted-foreground">{day.date}</div>
                        </th>
                      ))}
                      <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground min-w-[80px]">
                        {t("actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {getWeekTasks().map((task: any) => (
                      <tr key={task.id} className="hover:bg-primary/5 transition-colors">
                        {/* Task Name Column */}
                        <td className="px-4 py-4 border-r border-border/30">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id, task.completed)}
                            />
                            <span
                              className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                            >
                              {task.title}
                            </span>
                          </div>
                        </td>

                        {/* Show which day this task is assigned to */}
                        {getWeekDays().map((day) => {
                          const isAssignedToDay = task.due_date && task.due_date.startsWith(day.date)
                          return (
                            <td
                              key={day.date}
                              className="px-4 py-4 text-center border-r border-border/30"
                            >
                              {isAssignedToDay ? (
                                <div className="flex items-center justify-center gap-1">
                                  <CheckCircle2 className="w-4 h-4 text-primary" />
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">-</span>
                              )}
                            </td>
                          )
                        })}

                        {/* Actions Column */}
                        <td className="px-4 py-4 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-destructive hover:bg-destructive/10 inline-flex"
                            onClick={() => deleteTask(task.id)}
                            title={t("delete")}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {/* Inline Add New Task Row */}
                    <tr className="bg-primary/5 border-t-2 border-primary/30">
                      <td className="px-4 py-3 border-r border-border/30">
                        <Input
                          placeholder="Nueva tarea..."
                          value={inlineNewTask}
                          onChange={(e) => setInlineNewTask(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              createTaskFromInline(inlineNewTask)
                            }
                          }}
                          className="text-sm h-8"
                        />
                      </td>
                      {getWeekDays().map((day) => (
                        <td key={day.date} className="px-4 py-3 text-center border-r border-border/30">
                          <span className="text-xs text-muted-foreground">-</span>
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => createTaskFromInline(inlineNewTask)}
                          className="h-7 text-xs hover:bg-primary/10"
                          disabled={!inlineNewTask.trim()}
                        >
                          +
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Section */}
              {getWeekTasks().length > 0 && (
                <div className="mt-6 bg-background/40 border border-border/30 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{t("totalCompleted")}:</span>
                    <span className="text-lg font-bold text-primary">
                      {getWeekTasks().filter((t: any) => t.completed).length} / {getWeekTasks().length}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-border/30 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Objetivo de la semana</span>
                    <span className="text-xs font-semibold text-primary">5x {t("week")}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Task Dialogs */}
      {/* Create Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("createTask")}</DialogTitle>
            <DialogDescription>{t("add_new_task")}</DialogDescription>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>
              {t("cancel")}
            </Button>
            <Button onClick={createTask} disabled={isCreating || !newTask.title.trim()}>
              {isCreating ? t("creating") : t("create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
