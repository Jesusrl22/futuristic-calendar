"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from "@/components/icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useTranslation, type Language } from "@/lib/translations"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "personal",
    time: "",
  })
  const tasksRef = useRef<any[]>([])
  const [lang, setLang] = useState<Language>("en")
  const { t } = useTranslation(lang)

  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  useEffect(() => {
    fetchTasks()

    const loadLanguage = async () => {
      try {
        const response = await fetch("/api/settings")
        const data = await response.json()
        if (data.profile?.language) {
          setLang(data.profile.language)
        } else {
          const savedLang = localStorage.getItem("language") as Language | null
          if (savedLang) {
            setLang(savedLang)
          }
        }
      } catch (error) {
        const savedLang = localStorage.getItem("language") as Language | null
        if (savedLang) {
          setLang(savedLang)
        }
      }
    }
    loadLanguage()

    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
    }

    const cleanupOldNotifications = () => {
      const oneHourAgo = Date.now() - 60 * 60 * 1000
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("notified-")) {
          const timestamp = localStorage.getItem(key + "-time")
          if (timestamp && Number.parseInt(timestamp) < oneHourAgo) {
            localStorage.removeItem(key)
            localStorage.removeItem(key + "-time")
          }
        }
      })
    }
    cleanupOldNotifications()

    const notificationInterval = setInterval(() => {
      checkNotifications(tasksRef.current)
    }, 10000)

    return () => {
      clearInterval(notificationInterval)
    }
  }, [])

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks", {
        cache: "no-store",
      })
      const data = await response.json()
      if (data.tasks) {
        setTasks(data.tasks)
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

  const checkNotifications = (tasksToCheck: any[]) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      console.log("[v0] Notifications not available or not granted")
      return
    }

    const now = new Date()
    const nowTime = now.getTime()

    console.log(`[v0] 🔍 Checking ${tasksToCheck.length} tasks for notifications at ${now.toLocaleTimeString()}`)

    tasksToCheck.forEach((task) => {
      if (task.completed || !task.due_date) {
        return
      }

      let taskDate: Date
      const isoMatch = task.due_date.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
      if (isoMatch) {
        const [, year, month, day, hours, minutes] = isoMatch
        taskDate = new Date(
          Number.parseInt(year),
          Number.parseInt(month) - 1,
          Number.parseInt(day),
          Number.parseInt(hours),
          Number.parseInt(minutes),
          0,
        )
      } else {
        taskDate = new Date(task.due_date)
      }

      const taskTime = taskDate.getTime()
      const timeUntilTask = taskTime - nowTime
      const secondsUntilTask = Math.floor(timeUntilTask / 1000)
      const minutesUntilTask = Math.floor(secondsUntilTask / 60)

      console.log(`[v0] 📋 Task: "${task.title}"`)
      console.log(`[v0]    Due: ${taskDate.toLocaleString()}`)
      console.log(
        `[v0]    Time until: ${minutesUntilTask} min ${secondsUntilTask % 60} sec (${secondsUntilTask}s total)`,
      )

      if (secondsUntilTask >= -30 && secondsUntilTask <= 30) {
        const notificationKey = `notified-${task.id}`
        const alreadyNotified = localStorage.getItem(notificationKey)

        if (!alreadyNotified) {
          console.log(`[v0] 🔔 SENDING NOTIFICATION for "${task.title}"`)
          try {
            new Notification(`🔔 ${task.title}`, {
              body: task.description || "Your task is due now!",
              icon: "/favicon.ico",
              tag: `${task.id}-due`,
              requireInteraction: true,
            })
            localStorage.setItem(notificationKey, "true")
            localStorage.setItem(notificationKey + "-time", Date.now().toString())
            console.log(`[v0] ✅ Notification sent successfully`)
          } catch (error) {
            console.error("[v0] ❌ Failed to show notification:", error)
          }
        } else {
          console.log(`[v0] ⏭️ Already notified for this task`)
        }
      }
    })
  }

  const handleCreateTask = async () => {
    if (!selectedDate || !newTask.title.trim()) {
      alert(t("enterTaskTitle"))
      return
    }

    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
    const day = String(selectedDate.getDate()).padStart(2, "0")

    let dueDate: string
    if (newTask.time) {
      const [hours, minutes] = newTask.time.split(":")
      dueDate = `${year}-${month}-${day}T${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`
    } else {
      dueDate = `${year}-${month}-${day}T23:59:59`
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
        alert(data.error || "Failed to create task")
      } else {
        setNewTask({ title: "", description: "", priority: "medium", category: "personal", time: "" })
        setIsDialogOpen(false)
        await fetchTasks()
        setTimeout(() => checkNotifications(tasksRef.current), 500)
      }
    } catch (error) {
      console.error("Error creating task:", error)
      alert("Failed to create task. Please try again.")
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
        alert(data.error || "Failed to delete task")
      } else {
        setIsViewDialogOpen(false)
        setIsEditDialogOpen(false)
        fetchTasks()
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      alert("Failed to delete task. Please try again.")
    }
  }

  const handleUpdateTask = async () => {
    if (!editingTask || !editingTask.title.trim()) {
      alert(t("enterTaskTitle"))
      return
    }

    const taskId = editingTask.id
    localStorage.removeItem(`notified-${taskId}`)
    localStorage.removeItem(`notified-${taskId}-time`)

    let dueDate: string
    if (editingTask.due_date.includes("T")) {
      const match = editingTask.due_date.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
      if (match) {
        const [, year, month, day, hours, minutes] = match
        dueDate = `${year}-${month}-${day}T${hours}:${minutes}:00`
      } else {
        dueDate = editingTask.due_date
      }
    } else {
      dueDate = editingTask.due_date
    }

    try {
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
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const updateTask = async (id: string, updates: any) => {
    try {
      if (updates.due_date) {
        localStorage.removeItem(`notified-${id}`)
        localStorage.removeItem(`notified-${id}-time`)
        console.log(`[v0] Cleared notification flag for task ${id} due to time change`)
      }

      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...updates }),
      })
      if (response.ok) {
        fetchTasks()
        setIsEditDialogOpen(false)
        setEditingTask(null)
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  return (
    <div className="p-4 md:p-8">
      <div className="transition-all duration-300">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold hidden md:block">
            <span className="text-primary neon-text">{t("calendar")}</span>
          </h1>
          <Button
            className="neon-glow-hover w-full md:w-auto"
            onClick={() => {
              setSelectedDate(new Date())
              setIsDialogOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("addTask")}
          </Button>
        </div>

        {notificationPermission === "default" && (
          <Card className="glass-card p-4 mb-6 border-yellow-500/50">
            <div className="flex items-center justify-between">
              <p className="text-sm">{t("enableNotifications")}</p>
              <Button size="sm" onClick={requestNotificationPermission}>
                {t("enable")}
              </Button>
            </div>
          </Card>
        )}

        {notificationPermission === "granted" && (
          <Card className="glass-card p-4 mb-6 border-green-500/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm text-green-500">{t("notificationsEnabled")}</p>
            </div>
          </Card>
        )}

        {notificationPermission === "denied" && (
          <Card className="glass-card p-4 mb-6 border-red-500/50">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-red-500">{t("notificationsBlocked")}</p>
              <p className="text-xs text-muted-foreground">{t("notificationsInstructions")}</p>
            </div>
          </Card>
        )}

        <Card className="glass-card p-4 md:p-6 neon-glow">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl md:text-2xl font-bold">
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

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold text-xs md:text-sm text-muted-foreground p-2">
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
                  className={`aspect-square p-1 md:p-2 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                    isToday
                      ? "border-primary bg-primary/10 neon-glow"
                      : "border-border/50 hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                  onClick={() => {
                    setSelectedDate(day)
                    if (dayTasks.length > 0) {
                      setIsViewDialogOpen(true)
                    } else {
                      setIsDialogOpen(true)
                    }
                  }}
                >
                  <div className="text-xs md:text-sm font-semibold mb-1">{day.getDate()}</div>
                  {dayTasks.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-[10px] md:text-xs text-muted-foreground">+{dayTasks.length - 3}</div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

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
                            setEditingTask(task)
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
                  <Label>{t("dueDateTime")}</Label>
                  <Input
                    type="datetime-local"
                    value={editingTask.due_date ? editingTask.due_date.slice(0, 16) : ""}
                    onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                    className="bg-secondary/50"
                  />
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
                  <Button variant="destructive" onClick={() => handleDeleteTask(editingTask.id)} className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("delete")}
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
