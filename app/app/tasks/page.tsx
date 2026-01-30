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

  // Get tasks for a specific day
  const getTasksForDay = (day: string) => {
    return filteredTasks.filter((task: any) => {
      if (!task.due_date) return false
      return task.due_date.substring(8, 10) === day // Compare day of month
    })
  }

  // Add task for a specific day
  const addTaskForDay = (day: string) => {
    const weekDays = getWeekDays()
    const selectedDay = weekDays.find(d => d.date === day)
    if (selectedDay) {
      setNewTask({ ...newTask, due_date: `2025-01-${day}` })
      setIsDialogOpen(true)
    }
  }

  // Copy task to other days
  const copyTaskToOtherDays = async (task: any, currentDay: string) => {
    const weekDays = getWeekDays()
    const daysToSelect = weekDays.filter(d => d.date !== currentDay)
    
    if (daysToSelect.length === 0) return

    // Create copies for selected days
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

      {/* WEEKLY PLANNER BY DAY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getWeekDays().map((day) => (
          <div key={day.date} className="border border-border/50 rounded-lg bg-background/30 overflow-hidden">
            {/* Day Header */}
            <div className="bg-primary/10 border-b border-border/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{day.dayName}</h2>
                  <p className="text-sm text-muted-foreground">{t("day")} {day.date}</p>
                </div>
                <span className="text-2xl font-bold text-primary">{getTasksForDay(day.date).length}</span>
              </div>
            </div>

            {/* Tasks for this day */}
            <div className="divide-y divide-border/30 max-h-96 overflow-y-auto">
              {getTasksForDay(day.date).length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-sm text-muted-foreground">{t("noTasksFound")}</p>
                </div>
              ) : (
                getTasksForDay(day.date).map((task: any) => (
                  <div key={task.id} className="px-6 py-4 hover:bg-primary/5 transition-colors">
                    <div className="space-y-3">
                      {/* Task Header with Checkbox */}
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id, task.completed)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-medium break-words ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Task metadata */}
                      <div className="flex flex-wrap gap-2 ml-6">
                        {task.category && (
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                            {t(task.category)}
                          </span>
                        )}
                        {task.priority === "high" && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                            ⚠ {t("priority_high")}
                          </span>
                        )}
                        {task.priority === "medium" && (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            {t("priority_medium")}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs hover:bg-primary/10"
                          onClick={() => openEditDialog(task)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          {t("edit")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs hover:bg-primary/10"
                          onClick={() => copyTaskToOtherDays(task, day.date)}
                        >
                          📋 {t("copy")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          {t("delete")}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add task button for this day */}
            <button
              onClick={() => addTaskForDay(day.date)}
              className="w-full px-6 py-3 text-sm text-primary hover:bg-primary/10 transition-colors border-t border-border/30 font-medium"
            >
              + {t("addTask")}
            </button>
          </div>
        ))}
      </div>

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
