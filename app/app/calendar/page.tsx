"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from "@/components/icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/hooks/useTranslation" // Fixed import - useTranslation is in hooks/useTranslation, not lib/translations
import { useLanguage } from "@/contexts/language-context"
import { AdsterraBanner } from "@/components/adsterra-banner"
import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { AdsterraMobileBanner } from "@/components/adsterra-mobile-banner"
import { useToast } from "@/components/ui/use-toast"
import type { Task } from "@/types/task"

export default function CalendarPage() {
  const { toast } = useToast()
  const { language } = useLanguage()
  const { t } = useTranslation(language)
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily") // View mode
  const [userPlan, setUserPlan] = useState<"free" | "pro" | "premium">("free") // User plan for calendars
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(false)
  const tasksRef = useRef<Task[]>([])
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const notifiedTasksRef = useRef<Set<string>>(new Set())

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "personal",
    time: "",
  })

  useEffect(() => {
    fetchTasks()
    setNotificationEnabled(Notification.permission === "granted")
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks", {
        cache: "no-store",
      })
      const data = await response.json()
      if (data.tasks) {
        setTasks(data.tasks)
        tasksRef.current = data.tasks
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.due_date) return false
      const taskDate = new Date(task.due_date)
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const checkNotifications = () => {
    if (!notificationEnabled) return

    const now = new Date()
    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()

    tasks.forEach((task) => {
      const taskId = task.id
      if (notifiedTasksRef.current.has(taskId)) return

      const taskTime = new Date(task.due_date)
      const taskHours = taskTime.getHours()
      const taskMinutes = taskTime.getMinutes()

      // Notificar cuando la hora y minuto sean exactos
      if (currentHours === taskHours && currentMinutes === taskMinutes) {
        notifiedTasksRef.current.add(taskId)

        // Browser notification - works on desktop and mobile
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(t("taskReminder"), {
            body: `${task.title} ${t("startsNow")}`,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: `task-${taskId}`,
            requireInteraction: true,
            vibrate: [200, 100, 200],
          })
        }
      }
    })
  }

  const handleCreateTask = async () => {
    if (!selectedDate || !newTask.title.trim()) {
      toast({
        title: t("error"),
        description: t("enterTaskTitle"),
        variant: "destructive",
      })
      return
    }

    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
    const day = String(selectedDate.getDate()).padStart(2, "0")

    let dueDate: string
    if (newTask.time) {
      const [hours, minutes] = newTask.time.split(":")
      dueDate = new Date(
        year,
        selectedDate.getMonth(),
        selectedDate.getDate(),
        Number.parseInt(hours),
        Number.parseInt(minutes),
      ).toISOString()
    } else {
      dueDate = new Date(year, selectedDate.getMonth(), selectedDate.getDate(), 23, 59).toISOString()
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          category: newTask.category,
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
        setNewTask({ title: "", description: "", priority: "medium", category: "personal", time: "" })
        setIsDialogOpen(false)
        await fetchTasks()
        setTimeout(() => checkNotifications(), 500)
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_create_task") + ". " + t("please_try_again"),
        variant: "destructive",
      })
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

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm(t("deleteConfirm"))) {
      return
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast({
          title: t("error"),
          description: data.error || t("failed_delete_task"),
          variant: "destructive",
        })
      } else {
        setIsViewDialogOpen(false)
        setIsEditDialogOpen(false)
        fetchTasks()
        // Keep the selected date and the view stays on the day's tasks
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: t("error"),
        description: t("failed_delete_task") + ". " + t("please_try_again"),
        variant: "destructive",
      })
    }
  }

  const handleUpdateTask = async () => {
    if (!editingTask || !editingTask.title.trim()) {
      toast({
        title: t("error"),
        description: t("enterTaskTitle"),
        variant: "destructive",
      })
      return
    }

    try {
      let dueDate: string
      if (editingTask.time) {
        const dueDateTime = new Date(editingTask.due_date)
        const [hours, minutes] = editingTask.time.split(":")
        dueDateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)
        dueDate = dueDateTime.toISOString()
      } else {
        dueDate = editingTask.due_date
      }

      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingTask.id,
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          category: editingTask.category,
          due_date: dueDate,
          completed: editingTask.completed,
        }),
      })
      if (response.ok) {
        fetchTasks()
        setIsEditDialogOpen(false)
        setEditingTask(null)
        notifiedTasksRef.current.delete(editingTask.id)
        setTimeout(() => checkNotifications(), 500)
      } else {
        toast({
          title: t("error"),
          description: t("failed_update_task"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failed_update_task") + ". " + t("please_try_again"),
        variant: "destructive",
      })
    }
  }

  const handleEditTask = (task: Task) => {
    const taskDate = new Date(task.due_date)
    const hours = String(taskDate.getHours()).padStart(2, "0")
    const minutes = String(taskDate.getMinutes()).padStart(2, "0")
    const timeValue = `${hours}:${minutes}`
    setEditingTask({ ...task, time: timeValue })
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    t("january"),
    t("february"),
    t("march"),
    t("april"),
    t("may"),
    t("june"),
    t("july"),
    t("august"),
    t("september"),
    t("october"),
    t("november"),
    t("december"),
  ]

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  useEffect(() => {
    if (notificationEnabled) {
      checkIntervalRef.current = setInterval(() => {
        checkNotifications()
      }, 5000)

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current)
        }
      }
    }
  }, [notificationEnabled, tasks, t])

  return (
    <div className="p-4 md:p-8">
      <div className="transition-all duration-300">
        {/* Header with Title and View Mode Buttons */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">TimeFrame</h1>
            <p className="text-muted-foreground">{t("myCalendar")}</p>
            <p className="text-xs text-muted-foreground mt-1">Information designed for accurate insights</p>
          </div>
          
          {/* View Mode Buttons */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "daily" ? "default" : "outline"}
              onClick={() => setViewMode("daily")}
              className={viewMode === "daily" ? "bg-primary" : ""}
            >
              Daily
            </Button>
            <Button
              variant={viewMode === "weekly" ? "default" : "outline"}
              onClick={() => setViewMode("weekly")}
              className={viewMode === "weekly" ? "bg-primary" : ""}
            >
              Weekly
            </Button>
            <Button
              variant={viewMode === "monthly" ? "default" : "outline"}
              onClick={() => setViewMode("monthly")}
              className={viewMode === "monthly" ? "bg-primary" : ""}
            >
              Monthly
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar: Mini Calendar + My Calendar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mini Calendar */}
            <Card className="glass-card p-4 neon-glow">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-lg font-bold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-1">
                    {day}
                  </div>
                ))}
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="aspect-square" />
                  }

                  const dayTasks = getTasksForDate(day)
                  const isToday =
                    day.getDate() === new Date().getDate() &&
                    day.getMonth() === new Date().getMonth() &&
                    day.getFullYear() === new Date().getFullYear()

                  return (
                    <div
                      key={day.toISOString()}
                      className={`aspect-square p-1 rounded-lg border text-xs font-semibold cursor-pointer transition-all hover:scale-105 ${
                        isToday ? "border-primary bg-primary/20 text-primary font-bold" : "border-border/50 hover:bg-secondary/50"
                      }`}
                      onClick={() => {
                        setSelectedDate(day)
                        setViewMode("daily")
                      }}
                    >
                      {day.getDate()}
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* My Calendar Section */}
            <Card className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">{t("myCalendar")}</h3>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded cursor-pointer">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id, task.completed)}
                      className="h-4 w-4"
                    />
                    <span className={`text-xs ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.title.substring(0, 20)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Other Calendar - Only for Pro/Premium */}
            {(userPlan === "pro" || userPlan === "premium") && (
              <Card className="glass-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Team Calendars</h3>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">No team calendars yet</p>
                </div>
              </Card>
            )}
          </div>

          {/* Right Content: Calendar View */}
          <div className="lg:col-span-3">
            {viewMode === "daily" && (
              <Card className="glass-card p-6 neon-glow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </h2>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t("addTask")}
                  </Button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {selectedDateTasks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t("noTasksForDay")}</p>
                  ) : (
                    selectedDateTasks.map((task) => (
                      <Card key={task.id} className="glass-card p-4 hover:bg-primary/5">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id, task.completed)}
                          />
                          <div className="flex-1">
                            <h3 className={`font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {task.due_date &&
                                (() => {
                                  const isoString = task.due_date
                                  const match = isoString.match(/T(\d{2}):(\d{2})/)
                                  if (match) {
                                    return (
                                      <span className="text-xs bg-primary/20 px-2 py-1 rounded">
                                        {match[1]}:{match[2]}
                                      </span>
                                    )
                                  }
                                  return null
                                })()}
                              <Badge
                                variant="outline"
                                className={
                                  task.priority === "high"
                                    ? "border-red-500 text-red-500"
                                    : task.priority === "medium"
                                      ? "border-yellow-500 text-yellow-500"
                                      : "border-green-500 text-green-500"
                                }
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                handleEditTask(task)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:bg-red-500/10"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            )}

            {viewMode === "weekly" && (
              <Card className="glass-card p-6 neon-glow">
                <h2 className="text-2xl font-bold mb-6">Weekly View</h2>
                <p className="text-muted-foreground">Weekly view coming soon...</p>
              </Card>
            )}

            {viewMode === "monthly" && (
              <Card className="glass-card p-6 neon-glow">
                <div className="grid grid-cols-7 gap-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div key={`${day}-${index}`} className="text-center font-semibold text-xs text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                  {days.map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} className="aspect-square" />
                    }

                    const dayTasks = getTasksForDate(day)
                    const isToday =
                      day.getDate() === new Date().getDate() &&
                      day.getMonth() === new Date().getMonth() &&
                      day.getFullYear() === new Date().getFullYear()

                    return (
                      <div
                        key={day.toISOString()}
                        className={`aspect-square p-2 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                          isToday ? "border-primary bg-primary/10 neon-glow" : "border-border/50 hover:bg-secondary/50"
                        }`}
                        onClick={() => {
                          setSelectedDate(day)
                          setViewMode("daily")
                        }}
                      >
                        <div className="text-xs font-semibold mb-1">{day.getDate()}</div>
                        {dayTasks.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {dayTasks.slice(0, 2).map((task, idx) => (
                              <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  task.priority === "high"
                                    ? "bg-red-500"
                                    : task.priority === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                              />
                            ))}
                            {dayTasks.length > 2 && (
                              <span className="text-[10px] text-muted-foreground">+{dayTasks.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="glass-card max-w-md">
            <DialogHeader>
              <DialogTitle>{t("createNewTask")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t("title")}</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder={t("title")}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <Label>{t("description")}</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder={t("description")}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <Label>{t("time")}</Label>
                <Input
                  type="time"
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("priority")}</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t("low")}</SelectItem>
                      <SelectItem value="medium">{t("medium")}</SelectItem>
                      <SelectItem value="high">{t("high")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t("category")}</Label>
                  <Select
                    value={newTask.category}
                    onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
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
              <Button onClick={handleCreateTask} className="w-full neon-glow-hover">
                {t("createTask")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="glass-card max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>
                  {t("tasksFor")}{" "}
                  {selectedDate?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </DialogTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t("addTask")}
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-3">
              {selectedDateTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t("noTasksForDay")}</p>
              ) : (
                selectedDateTasks.map((task) => (
                  <Card key={task.id} className="glass-card p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id, task.completed)} />
                      <div className="flex-1">
                        <h3 className={`font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h3>
                        {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={
                              task.priority === "high"
                                ? "border-red-500 text-red-500"
                                : task.priority === "medium"
                                  ? "border-yellow-500 text-yellow-500"
                                  : "border-green-500 text-green-500"
                            }
                          >
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">{task.category}</Badge>
                          {task.due_date &&
                            (() => {
                              const isoString = task.due_date
                              const match = isoString.match(/T(\d{2}):(\d{2})/)
                              if (match) {
                                return (
                                  <span className="text-xs text-muted-foreground">
                                    {match[1]}:{match[2]}
                                  </span>
                                )
                              }
                              return null
                            })()}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            handleEditTask(task)
                            setIsViewDialogOpen(false)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass-card max-w-md">
            <DialogHeader>
              <DialogTitle>{t("editTask")}</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4">
                <div>
                  <Label>{t("title")}</Label>
                  <Input
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    placeholder={t("title")}
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <Label>{t("description")}</Label>
                  <Textarea
                    value={editingTask.description || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    placeholder={t("description")}
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <Label>{t("time")}</Label>
                  <Input
                    type="time"
                    value={editingTask.time || ""}
                    onChange={(e) => setEditingTask({ ...editingTask, time: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <Label>{t("preview")}</Label>
                  <div className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded">
                    {editingTask.time ||
                      new Date(editingTask.due_date).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("priority")}</Label>
                    <Select
                      value={editingTask.priority}
                      onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}
                    >
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t("low")}</SelectItem>
                        <SelectItem value="medium">{t("medium")}</SelectItem>
                        <SelectItem value="high">{t("high")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("category")}</Label>
                    <Select
                      value={editingTask.category}
                      onValueChange={(value) => setEditingTask({ ...editingTask, category: value })}
                    >
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
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
                <div className="flex gap-2">
                  <Button onClick={handleUpdateTask} className="flex-1 neon-glow-hover">
                    {t("updateTask")}
                  </Button>
                  <Button onClick={() => handleDeleteTask(editingTask.id)} variant="destructive" className="flex-1">
                    {t("deleteTask")}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
