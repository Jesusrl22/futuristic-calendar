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
import { formatTimeForInput, formatDateTimeForInput } from "@/lib/timezone-utils"

export default function CalendarPage() {
  const { toast } = useToast()
  const { language } = useLanguage()
  const { t } = useTranslation(language)
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
    const currentSeconds = now.getSeconds()

    tasks.forEach((task) => {
      const taskId = task.id
      if (notifiedTasksRef.current.has(taskId)) return

      const taskTime = new Date(task.due_date)
      const taskHours = taskTime.getHours()
      const taskMinutes = taskTime.getMinutes()

      // Notificar cuando la hora y minuto sean exactos (dentro de 60 segundos)
      if (currentHours === taskHours && currentMinutes === taskMinutes && currentSeconds < 60) {
        notifiedTasksRef.current.add(taskId)

        // Browser notification (for desktop)
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

        // Push notification (for mobile background)
        fetch("/api/notifications/send-now", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: t("taskReminder"),
            body: `${task.title} ${t("startsNow")}`,
            taskId: taskId,
          }),
        }).catch((err) => console.error("[v0] Push notification error:", err))
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
          due_date: editingTask.due_date,
          completed: editingTask.completed,
        }),
      })
      if (response.ok) {
        fetchTasks()
        setIsEditDialogOpen(false)
        setEditingTask(null)
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
    const timeValue = formatTimeForInput(new Date(task.due_date))
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
      }, 10000) // Revisar cada 10 segundos

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current)
        }
      }
    }
  }, [notificationEnabled, t])

  return (
    <div className="p-4 md:p-8">
      <div className="transition-all duration-300">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-8">
          <h1 className="hidden md:block text-2xl md:text-4xl font-bold">
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

        <AdsterraBanner
          adKey="dd82d93d86b369641ec4dd731423cb09"
          width={728}
          height={90}
          className="mb-6 hidden md:block"
        />

        <AdsterraMobileBanner
          adKey="5fedd77c571ac1a4c2ea68ca3d2bca98"
          width={320}
          height={50}
          className="mb-6 block md:hidden"
        />

        {!notificationEnabled && (
          <Card className="glass-card p-4 mb-6 border-yellow-500/50">
            <div className="flex items-center justify-between">
              <p className="text-sm">{t("enableNotifications")}</p>
              <Button size="sm" onClick={() => setNotificationEnabled(true)}>
                {t("enable")}
              </Button>
            </div>
          </Card>
        )}

        {notificationEnabled && (
          <Card className="glass-card p-4 mb-6 border-green-500/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm text-green-500">{t("notificationsEnabled")}</p>
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
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div
                key={`${day}-${index}`}
                className="text-center font-semibold text-xs md:text-sm text-muted-foreground p-1 md:p-2"
              >
                <span className="md:hidden">{day}</span>
                <span className="hidden md:inline">
                  {[t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")][index]}
                </span>
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

        <AdsterraNativeBanner
          containerId="container-105a3c31d27607df87969077c87047d4"
          scriptSrc="//pl28151206.effectivegatecpm.com/105a3c31d27607df87969077c87047d4/invoke.js"
          className="mt-6 hidden md:block"
        />

        <AdsterraMobileBanner
          adKey="5fedd77c571ac1a4c2ea68ca3d2bca98"
          width={320}
          height={50}
          className="mt-6 block md:hidden"
        />

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
                  <Label>{t("dueDateTime")}</Label>
                  <Input
                    type="datetime-local"
                    value={editingTask.due_date ? formatDateTimeForInput(new Date(editingTask.due_date)) : ""}
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
