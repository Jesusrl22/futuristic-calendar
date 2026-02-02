"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Bell, User, MoreVertical } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  category: string
  due_date: string
  completed: boolean
  time?: string
}

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = String(i).padStart(2, "0")
  return `${hour}:00`
})

export default function CalendarPage() {
  const { t } = useTranslation()
  const [events, setEvents] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Task | null>(null)
  const [userPlan, setUserPlan] = useState("pro")
  const [days, setDays] = useState<(Date | null)[]>([])

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    category: "personal",
    time: "10:00",
  })

  // Calculate month days for mini calendar
  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const calendarDays: (Date | null)[] = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(new Date(year, month, i))
    }
    setDays(calendarDays)
  }, [currentDate])

  // Fetch events from calendar API
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/calendar", { 
        cache: "no-store"
      })
      
      // If endpoint doesn't exist (404) or isn't successful
      if (!response.ok) {
        console.log("[v0] Calendar API endpoint not available (status: " + response.status + "), using empty events")
        setEvents([])
        return
      }
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        console.log("[v0] Calendar API returned non-JSON response, using empty events")
        setEvents([])
        return
      }
      
      const data = await response.json()
      setEvents(Array.isArray(data.events) ? data.events : [])
    } catch (error) {
      console.log("[v0] Calendar API not available, showing empty calendar")
      setEvents([])
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      if (!event.due_date) return false
      const eventDate = new Date(event.due_date)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    }).sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"))
  }

  const selectedDateEvents = getEventsForDate(selectedDate)

  // Create event
  const handleCreateEvent = async () => {
    if (!newEvent.title.trim()) return

    try {
      const dueDate = new Date(selectedDate)
      if (newEvent.time) {
        const [hours, minutes] = newEvent.time.split(":").map(Number)
        dueDate.setHours(hours, minutes)
      }

      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          priority: newEvent.priority,
          category: newEvent.category,
          due_date: dueDate.toISOString(),
          completed: false,
        }),
      })

      if (response.ok) {
        setNewEvent({ title: "", description: "", priority: "medium", category: "personal", time: "10:00" })
        setIsDialogOpen(false)
        await fetchEvents()
      }
    } catch (error) {
      console.error("Error creating event:", error)
    }
  }

  // Toggle event completion
  const toggleEventCompletion = async (eventId: string, completed: boolean) => {
    try {
      const response = await fetch("/api/calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId, completed: !completed }),
      })
      
      if (response.ok) {
        // Update local state optimistically
        setEvents(events.map(e => e.id === eventId ? { ...e, completed: !completed } : e))
      }
    } catch (error) {
      console.error("[v0] Error updating event:", error)
    }
  }

  // Delete event
  const deleteEvent = async (eventId: string) => {
    try {
      const response = await fetch("/api/calendar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId }),
      })
      
      if (response.ok) {
        // Update local state optimistically
        setEvents(events.filter(e => e.id !== eventId))
      }
    } catch (error) {
      console.error("[v0] Error deleting event:", error)
    }
  }

  const getEventColor = (priority: string) => {
    if (priority === "high") return "border-l-red-500"
    if (priority === "medium") return "border-l-yellow-500"
    return "border-l-green-500"
  }

  const getPriorityBadgeColor = (priority: string) => {
    if (priority === "high") return "border-red-500/50 bg-red-500/10 text-red-400"
    if (priority === "medium") return "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
    return "border-green-500/50 bg-green-500/10 text-green-400"
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-primary/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-r from-cyan-400 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">⏱</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">FutureTask</h1>
          </div>

          <div className="flex gap-2 md:gap-4 items-center">
            <Button
              variant={viewMode === "daily" ? "default" : "outline"}
              onClick={() => setViewMode("daily")}
              className={`rounded-full transition-all ${
                viewMode === "daily"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                  : ""
              }`}
            >
              Hoy
            </Button>
            <Button
              variant={viewMode === "weekly" ? "default" : "outline"}
              onClick={() => setViewMode("weekly")}
            >
              Semana
            </Button>
            <Button
              variant={viewMode === "monthly" ? "default" : "outline"}
              onClick={() => setViewMode("monthly")}
            >
              Mes
            </Button>
            <Button variant="outline">Todas</Button>
            <Button size="icon" variant="ghost" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full border border-primary/30 hover:bg-primary/10"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Mini Calendar */}
          <Card className="glass-card p-5 border-primary/20 neon-glow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 hover:bg-primary/20"
                  onClick={() =>
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
                  }
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 hover:bg-primary/20"
                  onClick={() =>
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
                  }
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-muted-foreground p-1">
                  {d}
                </div>
              ))}
              {days.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="aspect-square" />

                const isToday =
                  day.getDate() === new Date().getDate() &&
                  day.getMonth() === new Date().getMonth() &&
                  day.getFullYear() === new Date().getFullYear()

                const isSelected =
                  day.getDate() === selectedDate.getDate() &&
                  day.getMonth() === selectedDate.getMonth() &&
                  day.getFullYear() === selectedDate.getFullYear()

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square p-1 rounded text-xs font-semibold transition-all ${
                      isSelected
                        ? "border border-cyan-400 bg-cyan-500/20 text-cyan-300 neon-glow font-bold"
                        : isToday
                          ? "border border-primary bg-primary/10"
                          : "border border-border/30 hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* My Calendar Events */}
          <Card className="glass-card p-5 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">Mi Calendario</h3>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 hover:bg-primary/20"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-2.5 hover:bg-primary/10 rounded cursor-pointer transition-colors"
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${
                      event.priority === "high"
                        ? "bg-cyan-400"
                        : event.priority === "medium"
                          ? "bg-yellow-400"
                          : "bg-green-400"
                    }`}
                  ></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{event.title}</p>
                    {event.due_date && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(event.due_date).toLocaleDateString("es-ES", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-primary hover:bg-primary/20 gap-1 justify-center"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-3 h-3" />
                Añadir Evento
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Calendar View */}
        <div className="lg:col-span-3">
          {viewMode === "daily" && (
            <Card className="glass-card p-6 border-primary/20">
              {/* Daily View Header */}
              <div className="flex items-start justify-between mb-6 pb-4 border-b border-primary/10">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-cyan-300 text-balance">
                    {selectedDate.toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedDateEvents.length} evento{selectedDateEvents.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-primary/20"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Timeline View */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {selectedDateEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-muted-foreground mb-4">Sin eventos programados</p>
                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      className="gap-2 shadow-lg shadow-primary/30"
                    >
                      <Plus className="w-4 h-4" />
                      Crear evento
                    </Button>
                  </div>
                ) : (
                  selectedDateEvents.map((event) => {
                    const eventTime = event.time || new Date(event.due_date).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })

                    return (
                      <div
                        key={event.id}
                        className={`group glass-card border-l-4 p-4 transition-all hover:shadow-lg hover:shadow-primary/30 cursor-pointer neon-glow ${getEventColor(
                          event.priority
                        )}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="pt-1">
                            <Checkbox
                              checked={event.completed}
                              onCheckedChange={() =>
                                toggleEventCompletion(event.id, event.completed)
                              }
                              className="h-5 w-5"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline justify-between gap-3 mb-2">
                              <h3
                                className={`font-semibold ${
                                  event.completed ? "line-through text-muted-foreground" : ""
                                }`}
                              >
                                {event.title}
                              </h3>
                              <span className="text-sm font-mono text-primary whitespace-nowrap">
                                {eventTime}
                              </span>
                            </div>

                            {event.description && (
                              <p className="text-xs text-muted-foreground mb-3">{event.description}</p>
                            )}

                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant="outline"
                                className={`text-xs ${getPriorityBadgeColor(event.priority)}`}
                              >
                                {event.priority === "high"
                                  ? "Alta"
                                  : event.priority === "medium"
                                    ? "Media"
                                    : "Baja"}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {event.category}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-primary/20"
                              onClick={() => {
                                setEditingEvent(event)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-red-500/20 hover:text-red-500"
                              onClick={() => deleteEvent(event.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}

                {/* Add Event Button */}
                {selectedDateEvents.length > 0 && (
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full py-3 border border-dashed border-primary/30 rounded hover:border-primary/60 hover:bg-primary/5 transition-colors text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir Evento
                  </button>
                )}
              </div>
            </Card>
          )}

          {viewMode === "weekly" && (
            <Card className="glass-card p-6 border-primary/20">
              <h2 className="text-xl font-bold mb-4">Vista Semanal - Próximamente</h2>
              <p className="text-muted-foreground">La vista semanal estará disponible pronto</p>
            </Card>
          )}

          {viewMode === "monthly" && (
            <Card className="glass-card p-6 border-primary/20">
              <h2 className="text-xl font-bold mb-4">Vista Mensual - Próximamente</h2>
              <p className="text-muted-foreground">La vista mensual estará disponible pronto</p>
            </Card>
          )}
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-primary/20">
          <DialogHeader>
            <DialogTitle>Crear Evento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Título</label>
              <Input
                placeholder="Nombre del evento"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="bg-background/50 border-primary/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Descripción</label>
              <Textarea
                placeholder="Detalles del evento"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="bg-background/50 border-primary/20 resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Hora</label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="bg-background/50 border-primary/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Prioridad</label>
                <Select value={newEvent.priority} onValueChange={(value: any) => setNewEvent({ ...newEvent, priority: value })}>
                  <SelectTrigger className="bg-background/50 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Categoría</label>
              <Select value={newEvent.category} onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}>
                <SelectTrigger className="bg-background/50 border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="trabajo">Trabajo</SelectItem>
                  <SelectItem value="educacion">Educación</SelectItem>
                  <SelectItem value="salud">Salud</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateEvent} className="shadow-lg shadow-primary/30">
                Crear Evento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
