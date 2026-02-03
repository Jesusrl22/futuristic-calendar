"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { useRouter } from "next/navigation"

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

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

const timeSlots = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))

export default function CalendarPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [events, setEvents] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Task | null>(null)
  const [days, setDays] = useState<(Date | null)[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [teamTasks, setTeamTasks] = useState<{ [teamId: string]: any[] }>({})

  const [newEvent, setNewEvent] = useState({ title: "", description: "", priority: "medium" as const, category: "personal", time: "10:00" })
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")

  // Fetch calendar events
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/calendar", { cache: "no-store" })
      if (!response.ok) {
        setEvents([])
        return
      }
      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        setEvents([])
        return
      }
      const data = await response.json()
      setEvents(Array.isArray(data.events) ? data.events : [])
    } catch {
      setEvents([])
    }
  }

  // Fetch teams
  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams", { cache: "no-store" })
      if (!response.ok) return
      const data = await response.json()
      setTeams(data.teams || [])
      
      // Fetch tasks for each team
      if (data.teams && data.teams.length > 0) {
        const tasksMap: { [teamId: string]: any[] } = {}
        await Promise.all(
          data.teams.map(async (team: any) => {
            const tasksRes = await fetch(`/api/team-tasks?teamId=${team.id}`)
            if (tasksRes.ok) {
              const tasksData = await tasksRes.json()
              // Filter only tasks with due_date
              tasksMap[team.id] = (tasksData.tasks || []).filter((task: any) => task.due_date)
            }
          })
        )
        setTeamTasks(tasksMap)
      }
    } catch (error) {
      console.log("[v0] Error fetching teams:", error)
    }
  }

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    return events
      .filter((event) => {
        if (!event.due_date) return false
        const eventDate = new Date(event.due_date)
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        )
      })
      .sort((a, b) => (a.due_date || "").localeCompare(b.due_date || ""))
  }

  // Generate calendar days
  useEffect(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const daysArray: (Date | null)[] = []

    for (let i = 0; i < firstDay.getDay(); i++) daysArray.push(null)
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
    }

    setDays(daysArray)
    if (!selectedDate || selectedDate.getMonth() !== currentDate.getMonth()) {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    }
  }, [currentDate])

  useEffect(() => {
    fetchEvents()
    fetchTeams()
  }, [])

  const selectedDateEvents = getEventsForDate(selectedDate)

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) return

    const dueDate = new Date(selectedDate)
    const [hours, minutes] = newEvent.time.split(":")
    dueDate.setHours(parseInt(hours), parseInt(minutes), 0)

    const tempEvent = {
      id: `temp-${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description,
      priority: newEvent.priority,
      category: newEvent.category,
      due_date: dueDate.toISOString(),
      completed: false,
    }

    // Add to local state immediately
    setEvents([...events, tempEvent])
    setNewEvent({ title: "", description: "", priority: "medium", category: "personal", time: "10:00" })
    setIsDialogOpen(false)

    // Try to sync with API if available
    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          priority: newEvent.priority,
          category: newEvent.category,
          due_date: dueDate.toISOString(),
        }),
      })
      
      if (response.ok) {
        console.log("[v0] Event synced with API")
        await fetchEvents() // Refresh events from API
      }
    } catch (error) {
      console.log("[v0] API not available, event saved locally")
    }
  }

  const handleUpdateEvent = async () => {
    if (!editingEvent || !editingEvent.title.trim()) return

    // Update due_date with new time if time field changed
    if (editingEvent.time) {
      const dueDate = new Date(editingEvent.due_date)
      const [hours, minutes] = editingEvent.time.split(":")
      dueDate.setHours(parseInt(hours), parseInt(minutes), 0)
      editingEvent.due_date = dueDate.toISOString()
    }

    // Update local state immediately
    setEvents(events.map((e) => (e.id === editingEvent.id ? editingEvent : e)))
    setIsEditDialogOpen(false)
    setEditingEvent(null)

    // Try to sync with API if available
    try {
      const response = await fetch("/api/calendar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEvent),
      })

      if (response.ok) {
        console.log("[v0] Event updated in API")
        await fetchEvents() // Refresh events from API
      }
    } catch (error) {
      console.log("[v0] API not available, event updated locally")
    }
  }

  const toggleEventCompletion = async (eventId: string, completed: boolean) => {
    try {
      const response = await fetch("/api/calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId, completed: !completed }),
      })

      if (response.ok) {
        setEvents(events.map((e) => (e.id === eventId ? { ...e, completed: !completed } : e)))
      }
    } catch (error) {
      console.error("[v0] Error updating event:", error)
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      const response = await fetch("/api/calendar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId }),
      })

      if (response.ok) {
        setEvents(events.filter((e) => e.id !== eventId))
      }
    } catch (error) {
      console.error("[v0] Error deleting event:", error)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-primary/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center text-white font-bold text-sm">
            ⏱
          </div>
          <h1 className="text-3xl font-bold">FutureTask</h1>
        </div>

        <div className="flex gap-2 md:gap-4 items-center">
          <Button 
            variant={viewMode === "day" ? "outline" : "ghost"}
            className={viewMode === "day" ? "rounded-full border-primary/50 text-primary hover:bg-primary/10" : "text-foreground hover:text-primary"}
            onClick={() => setViewMode("day")}
          >
            Hoy
          </Button>
          <Button 
            variant={viewMode === "week" ? "outline" : "ghost"}
            className={viewMode === "week" ? "rounded-full border-primary/50 text-primary hover:bg-primary/10" : "text-foreground hover:text-primary"}
            onClick={() => setViewMode("week")}
          >
            Semana
          </Button>
          <Button 
            variant={viewMode === "month" ? "outline" : "ghost"}
            className={viewMode === "month" ? "rounded-full border-primary/50 text-primary hover:bg-primary/10" : "text-foreground hover:text-primary"}
            onClick={() => setViewMode("month")}
          >
            Mes
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Mi Calendario</h2>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Mini Calendar */}
          <Card className="glass-card p-5 border-primary/30 neon-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
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
                if (!day) return <div key={`empty-${index}`} className="aspect-square" />

                const isToday =
                  day.getDate() === new Date().getDate() &&
                  day.getMonth() === new Date().getMonth() &&
                  day.getFullYear() === new Date().getFullYear()

                const isSelected = day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth()

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square p-1 rounded-lg border text-xs font-semibold cursor-pointer transition-all hover:scale-110 ${
                      isSelected ? "border-primary bg-primary/20 text-primary font-bold neon-glow" : isToday ? "border-primary/50 bg-primary/10" : "border-border/50 hover:border-primary/50"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Events List */}
          <Card className="glass-card p-5 border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Mi Calendario</h3>
            </div>
            <div className="space-y-3">
              {selectedDateEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-2 hover:bg-primary/10 rounded-lg transition-colors">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                      event.priority === "high" ? "bg-red-500" : event.priority === "medium" ? "bg-yellow-500" : "bg-cyan-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.due_date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs hover:bg-primary/20 text-primary justify-start gap-2 mt-2"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-3 h-3" />
                Añadir Evento
              </Button>
            </div>
          </Card>

          {/* Team Calendars Section */}
          <Card className="glass-card p-5 border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Calendarios de Equipo</h3>
            </div>
            <div className="space-y-3">
              {teams.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sin equipos</p>
              ) : (
                teams.map((team) => {
                  const teamColors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"]
                  const colorIndex = teams.indexOf(team) % teamColors.length
                  
                  return (
                    <div 
                      key={team.id}
                      className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                      onClick={() => router.push(`/app/teams/${team.id}`)}
                    >
                      <div className={`w-2 h-2 rounded-full ${teamColors[colorIndex]}`}></div>
                      <span className="text-xs font-medium text-foreground">{team.name}</span>
                    </div>
                  )
                })
              )}
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {viewMode === "day" && (
            <Card className="glass-card p-6 border-primary/30 neon-glow">
              {/* Date Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/20">
                <h2 className="text-2xl font-bold text-primary">
                  {selectedDate.toLocaleDateString("es-ES", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </h2>
              </div>

              {/* Daily Timeline */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {timeSlots.map((hour) => {
                  const hourEvents = selectedDateEvents.filter((event) => {
                    const eventHour = new Date(event.due_date).getHours()
                    return eventHour === parseInt(hour)
                  })

                  return (
                    <div key={hour} className="relative">
                      <div className="flex items-start gap-4">
                        <div className="text-xs font-mono text-muted-foreground pt-1 w-12 text-right">{hour}:00</div>
                        <div className="relative flex-1">
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent"></div>
                          <div className="space-y-2 ml-4 min-h-12">
                            {hourEvents.map((event) => {
                              const eventTime = new Date(event.due_date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
                              const neonColor =
                                event.priority === "high" ? "border-violet-500/80 bg-violet-500/10" : event.priority === "medium" ? "border-cyan-500/80 bg-cyan-500/10" : "border-green-500/80 bg-green-500/10"

                              return (
                                <Card key={event.id} className={`glass-card p-4 border-l-4 transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer group ${neonColor}`}>
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 flex-1">
                                      <Checkbox checked={event.completed} onCheckedChange={() => toggleEventCompletion(event.id, event.completed)} className="mt-1" />
                                      <div className="flex-1">
                                        <h4 className={`font-semibold text-foreground ${event.completed ? "line-through text-muted-foreground" : ""}`}>{event.title}</h4>
                                        {event.description && <p className="text-xs text-muted-foreground mt-1">{event.description}</p>}
                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                          {event.priority && (
                                            <Badge variant="outline" className={`text-xs ${event.priority === "high" ? "border-red-500 text-red-500" : event.priority === "medium" ? "border-yellow-500 text-yellow-500" : "border-green-500 text-green-500"}`}>
                                              {event.priority === "high" ? "Alta" : event.priority === "medium" ? "Media" : "Baja"}
                                            </Badge>
                                          )}
                                          {event.category && <Badge variant="secondary" className="text-xs">{event.category}</Badge>}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                      <span className="text-sm font-mono text-primary whitespace-nowrap">{eventTime}</span>
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/20" onClick={() => {
                                          const eventDate = new Date(event.due_date)
                                          const hours = String(eventDate.getHours()).padStart(2, "0")
                                          const minutes = String(eventDate.getMinutes()).padStart(2, "0")
                                          setEditingEvent({ ...event, time: `${hours}:${minutes}` })
                                          setIsEditDialogOpen(true)
                                        }}>
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-500/20 hover:text-red-500" onClick={() => deleteEvent(event.id)}>
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {viewMode === "week" && (
            <Card className="glass-card p-6 border-primary/30 neon-glow">
              <h2 className="text-2xl font-bold text-primary mb-6">Semana</h2>
              <div className="grid grid-cols-7 gap-2 max-h-[600px] overflow-y-auto">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date(selectedDate)
                  date.setDate(date.getDate() - date.getDay() + i)
                  const dayEvents = getEventsForDate(date)
                  
                  return (
                    <div key={i} className="border border-primary/30 rounded-lg p-3 min-h-[200px]">
                      <h3 className="font-bold text-sm text-primary mb-3">{date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric" })}</h3>
                      <div className="space-y-2">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div key={event.id} className="text-xs p-2 rounded bg-primary/10 border border-primary/30 hover:bg-primary/20 cursor-pointer transition-colors">
                            <p className="font-semibold truncate">{event.title}</p>
                            <p className="text-muted-foreground">{new Date(event.due_date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                        ))}
                        {dayEvents.length > 3 && <p className="text-xs text-muted-foreground">+{dayEvents.length - 3} más</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {viewMode === "month" && (
            <Card className="glass-card p-6 border-primary/30 neon-glow">
              <h2 className="text-2xl font-bold text-primary mb-6">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
              <div className="grid grid-cols-7 gap-2">
                {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                  <div key={d} className="text-center font-bold text-sm text-primary p-2">{d}</div>
                ))}
                {days.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="aspect-square" />
                  const dayEvents = getEventsForDate(day)
                  
                  return (
                    <div key={day.toISOString()} className="aspect-square border border-primary/30 rounded-lg p-2 hover:bg-primary/10 cursor-pointer transition-colors">
                      <p className="font-bold text-sm text-primary">{day.getDate()}</p>
                      <div className="space-y-0.5 mt-1">
                        {dayEvents.slice(0, 2).map((e) => (
                          <p key={e.id} className="text-xs truncate text-muted-foreground">{e.title}</p>
                        ))}
                        {dayEvents.length > 2 && <p className="text-xs text-primary">+{dayEvents.length - 2}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Nuevo Evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Título del evento" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
            <Textarea placeholder="Descripción (opcional)" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
            <Input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
            <Select value={newEvent.priority} onValueChange={(value: any) => setNewEvent({ ...newEvent, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newEvent.category} onValueChange={(value: any) => setNewEvent({ ...newEvent, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="trabajo">Trabajo</SelectItem>
                <SelectItem value="reunion">Reunión</SelectItem>
                <SelectItem value="proyecto">Proyecto</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleAddEvent} className="flex-1">
                Crear Evento
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      {editingEvent && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle>Editar Evento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Título" value={editingEvent.title} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} />
              <Textarea placeholder="Descripción" value={editingEvent.description || ""} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} />
              <div className="space-y-2">
                <label className="text-sm font-medium">Hora</label>
                <Input 
                  type="time" 
                  value={editingEvent.time || "10:00"} 
                  onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })} 
                />
              </div>
              <Select value={editingEvent.priority} onValueChange={(value: any) => setEditingEvent({ ...editingEvent, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
              <Select value={editingEvent.category} onValueChange={(value: any) => setEditingEvent({ ...editingEvent, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="trabajo">Trabajo</SelectItem>
                  <SelectItem value="reunion">Reunión</SelectItem>
                  <SelectItem value="proyecto">Proyecto</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={handleUpdateEvent} className="flex-1">
                  Guardar
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
