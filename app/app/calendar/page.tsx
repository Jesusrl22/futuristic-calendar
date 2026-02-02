"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Bell, User, Link, CheckCircle2 } from "lucide-react"
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
  const [events, setEvents] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Task | null>(null)
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(false)
  const eventsRef = useRef<Task[]>([])
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const notifiedEventsRef = useRef<Set<string>>(new Set())

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "personal",
    time: "",
  })

  useEffect(() => {
    fetchEvents()
    setNotificationEnabled(Notification.permission === "granted")
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/calendar", {
        cache: "no-store",
      })
      const data = await response.json()
      if (data.events) {
        setEvents(data.events)
        eventsRef.current = data.events
      }
    } catch (error) {
      console.error("Error fetching calendar events:", error)
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

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      if (!event.due_date) return false
      const eventDate = new Date(event.due_date)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const checkNotifications = () => {
    if (!notificationEnabled) return

    const now = new Date()
    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()

    events.forEach((event) => {
      const eventId = event.id
      if (notifiedEventsRef.current.has(eventId)) return

      const eventTime = new Date(event.due_date)
      const eventHours = eventTime.getHours()
      const eventMinutes = eventTime.getMinutes()

      // Notificar cuando la hora y minuto sean exactos
      if (currentHours === eventHours && currentMinutes === eventMinutes) {
        notifiedEventsRef.current.add(eventId)

        // Browser notification - works on desktop and mobile
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(t("taskReminder"), {
            body: `${event.title} ${t("startsNow")}`,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: `task-${eventId}`,
            requireInteraction: true,
            vibrate: [200, 100, 200],
          })
        }
      }
    })
  }

  const handleCreateTask = async () => {
    if (!selectedDate || !newEvent.title.trim()) {
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
    if (newEvent.time) {
      const [hours, minutes] = newEvent.time.split(":")
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
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
      title: newEvent.title,
      description: newEvent.description,
      priority: newEvent.priority,
      category: newEvent.category,
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
        setNewEvent({ title: "", description: "", priority: "medium", category: "personal", time: "" })
        setIsDialogOpen(false)
        await fetchEvents()
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
      await fetch("/api/calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, completed: !completed }),
      })
      fetchEvents()
    } catch (error) {
      console.error("Error toggling task:", error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm(t("deleteConfirm"))) {
      return
    }

    try {
      const response = await fetch("/api/calendar", {
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
        fetchEvents()
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
    if (!editingEvent || !editingEvent.title.trim()) {
      toast({
        title: t("error"),
        description: t("enterTaskTitle"),
        variant: "destructive",
      })
      return
    }

    try {
      let dueDate: string
    if (editingEvent.time) {
      const dueDateTime = new Date(editingEvent.due_date)
      const [hours, minutes] = editingEvent.time.split(":")
        dueDateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)
        dueDate = dueDateTime.toISOString()
      } else {
        dueDate = editingEvent.due_date
      }

      const response = await fetch("/api/calendar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        id: editingEvent.id,
        title: editingEvent.title,
        description: editingEvent.description,
        priority: editingEvent.priority,
        category: editingEvent.category,
          due_date: dueDate,
          completed: editingEvent.completed,
        }),
      })
      if (response.ok) {
        fetchEvents()
        setIsEditDialogOpen(false)
        setEditingEvent(null)
        notifiedEventsRef.current.delete(editingEvent.id)
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
    setEditingEvent({ ...task, time: timeValue })
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

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

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
  }, [notificationEnabled, events, t])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="transition-all duration-300">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-primary/30">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center">
                <span className="text-white font-bold text-sm">⏱</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">TimeFrame</h1>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex gap-2 md:gap-4 items-center">
            <Button
              variant={viewMode === "daily" ? "default" : "outline"}
              onClick={() => setViewMode("daily")}
              className={`rounded-full transition-all ${
                viewMode === "daily" 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50" 
                  : "hover:border-primary/50"
              }`}
            >
              Hoy
            </Button>
            <Button
              variant={viewMode === "weekly" ? "default" : "outline"}
              onClick={() => setViewMode("weekly")}
              className={`transition-all ${
                viewMode === "weekly" 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50" 
                  : "hover:text-primary/80"
              }`}
            >
              Semana
            </Button>
            <Button
              variant={viewMode === "monthly" ? "default" : "outline"}
              onClick={() => setViewMode("monthly")}
              className={`transition-all ${
                viewMode === "monthly" 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50" 
                  : "hover:text-primary/80"
              }`}
            >
              Mes
            </Button>
            <Button
              variant="outline"
              className="transition-all hover:text-primary/80"
            >
              Todas
            </Button>
            <Button size="icon" variant="ghost" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full border border-primary/50 hover:bg-primary/10">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar: Mini Calendar + My Calendar + Team Calendars */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mini Calendar */}
            <Card className="glass-card p-5 border-primary/30 neon-glow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/20"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/20"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-1">
                    {day}
                  </div>
                ))}
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="aspect-square" />
                  }

                  const dayEvents = getEventsForDate(day)
                  const isToday =
                    day.getDate() === new Date().getDate() &&
                    day.getMonth() === new Date().getMonth() &&
                    day.getFullYear() === new Date().getFullYear()

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => {
                        setSelectedDate(day)
                        setViewMode("daily")
                      }}
                      className={`aspect-square p-1 rounded-lg border text-xs font-semibold cursor-pointer transition-all hover:scale-110 ${
                        isToday 
                          ? "border-primary bg-primary/20 text-primary font-bold neon-glow" 
                          : "border-border/50 hover:border-primary/50 hover:bg-primary/10 text-foreground"
                      }`}
                    >
                      {day.getDate()}
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* My Calendar Section */}
            <Card className="glass-card p-5 border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">{t("myCalendar")}</h3>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-primary/20">
                    <Link className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-primary/20">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {events.slice(0, 3).map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-center gap-3 p-2 hover:bg-primary/10 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      event.priority === "high" ? "bg-red-500" :
                      event.priority === "medium" ? "bg-yellow-500" :
                      "bg-green-500"
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {event.title.substring(0, 20)}
                      </p>
                      {event.due_date && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.due_date).toLocaleDateString("es-ES", { 
                            weekday: "short", 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs hover:bg-primary/20 text-primary gap-2"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="w-3 h-3" />
                  Añadir Evento
                </Button>
              </div>
            </Card>

            {/* Team Calendars - Only for Pro/Premium */}
            {(userPlan === "pro" || userPlan === "premium") && (
              <Card className="glass-card p-5 border-primary/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Otro Calendario</h3>
                  <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-primary/20">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Sin calendarios de equipo</p>
                </div>
              </Card>
            )}
          </div>

          {/* Right Content: Calendar View */}
          <div className="lg:col-span-3">
            {viewMode === "daily" && (
              <Card className="glass-card p-6 border-primary/30 neon-glow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedDate 
                        ? selectedDate.toLocaleDateString("es-ES", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
                        : new Date().toLocaleDateString("es-ES", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
                      }
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedDateEvents.length} {selectedDateEvents.length === 1 ? "evento" : "eventos"} programado{selectedDateEvents.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="gap-2 shadow-lg shadow-primary/30"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir Evento
                  </Button>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {selectedDateEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-muted-foreground mb-4">Sin eventos programados</p>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Crear primer evento
                      </Button>
                    </div>
                  ) : (
                    selectedDateEvents.map((event) => {
                      const eventTime = event.due_date ? new Date(event.due_date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "-"
                      const priorityColor = event.priority === "high" ? "border-red-500/50 bg-red-500/10" 
                        : event.priority === "medium" ? "border-yellow-500/50 bg-yellow-500/10"
                        : "border-green-500/50 bg-green-500/10"
                      
                      return (
                        <Card 
                          key={event.id} 
                          className={`glass-card p-4 border-l-4 transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer ${priorityColor}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="pt-1">
                              <Checkbox
                                checked={event.completed}
                                onCheckedChange={() => toggleTask(event.id, event.completed)}
                                className="h-5 w-5"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h3 className={`font-semibold text-foreground ${event.completed ? "line-through text-muted-foreground" : ""}`}>
                                    {event.title}
                                  </h3>
                                  {event.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                                  )}
                                </div>
                                <span className="text-sm font-mono text-primary whitespace-nowrap">{eventTime}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-3 flex-wrap">
                                {event.priority && (
                                  <Badge 
                                    variant="outline"
                                    className={`text-xs ${
                                      event.priority === "high" ? "border-red-500 text-red-500" :
                                      event.priority === "medium" ? "border-yellow-500 text-yellow-500" :
                                      "border-green-500 text-green-500"
                                    }`}
                                  >
                                    {event.priority === "high" ? "Alta" : event.priority === "medium" ? "Media" : "Baja"}
                                  </Badge>
                                )}
                                {event.category && (
                                  <Badge variant="secondary" className="text-xs">
                                    {event.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary/20"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingEvent(event)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-red-500/20 hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteTask(event.id)
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )
                    })
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
                  {["L", "M", "X", "J", "V", "S", "D"].map((day, index) => (
                    <div key={`${day}-${index}`} className="text-center font-semibold text-xs text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                  {days.map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} className="aspect-square" />
                    }

                    const dayEvents = getEventsForDate(day)
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
                        {dayEvents.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {dayEvents.slice(0, 2).map((event, idx) => (
                              <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  event.priority === "high"
                                    ? "bg-red-500"
                                    : event.priority === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                              />
                            ))}
                            {dayEvents.length > 2 && (
                              <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 2}</span>
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
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder={t("title")}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <Label>{t("description")}</Label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder={t("description")}
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <Label>{t("time")}</Label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("priority")}</Label>
                  <Select
                    value={newEvent.priority}
                    onValueChange={(value) => setNewEvent({ ...newEvent, priority: value })}
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
                    value={newEvent.category}
                    onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
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
              {selectedDateEvents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t("noTasksForDay")}</p>
              ) : (
                selectedDateEvents.map((task) => (
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
            {editingEvent && (
              <div className="space-y-4">
                <div>
                  <Label>{t("title")}</Label>
                  <Input
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    placeholder={t("title")}
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <Label>{t("description")}</Label>
                  <Textarea
                    value={editingEvent.description || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    placeholder={t("description")}
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <Label>{t("time")}</Label>
                  <Input
                    type="time"
                    value={editingEvent.time || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <Label>{t("preview")}</Label>
                  <div className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded">
                    {editingEvent.time ||
                      new Date(editingEvent.due_date).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("priority")}</Label>
                    <Select
                      value={editingEvent.priority}
                      onValueChange={(value) => setEditingEvent({ ...editingEvent, priority: value })}
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
                      value={editingEvent.category}
                      onValueChange={(value) => setEditingEvent({ ...editingEvent, category: value })}
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
                  <Button onClick={() => handleDeleteTask(editingEvent.id)} variant="destructive" className="flex-1">
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
