"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock, Target } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

interface Task {
  id: string
  text: string
  description?: string
  completed: boolean
  priority: "high" | "medium" | "low"
  category: string
  date: string
  time?: string
  notification_enabled?: boolean
  created_at: string
}

interface CalendarWidgetProps {
  userId: string
}

export function CalendarWidget({ userId }: CalendarWidgetProps) {
  const { resolvedTheme } = useTheme()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true)
      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Load from localStorage
        const savedTasks = localStorage.getItem(`tasks_${userId}`)
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks))
        } else {
          // Create sample tasks for demo
          const sampleTasks: Task[] = [
            {
              id: "1",
              text: "Reunión con el equipo",
              description: "Revisar el progreso del proyecto y planificar próximos pasos",
              completed: false,
              priority: "high",
              category: "trabajo",
              date: new Date().toISOString().split("T")[0],
              time: "09:00",
              notification_enabled: true,
              created_at: new Date().toISOString(),
            },
            {
              id: "2",
              text: "Revisar propuesta de proyecto",
              completed: true,
              priority: "medium",
              category: "trabajo",
              date: new Date().toISOString().split("T")[0],
              time: "14:30",
              notification_enabled: false,
              created_at: new Date().toISOString(),
            },
            {
              id: "3",
              text: "Ejercicio matutino",
              completed: false,
              priority: "low",
              category: "salud",
              date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
              time: "07:00",
              notification_enabled: true,
              created_at: new Date().toISOString(),
            },
            {
              id: "4",
              text: "Llamar al dentista",
              completed: false,
              priority: "medium",
              category: "salud",
              date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
              time: "10:00",
              notification_enabled: true,
              created_at: new Date().toISOString(),
            },
            {
              id: "5",
              text: "Preparar presentación",
              completed: false,
              priority: "high",
              category: "trabajo",
              date: new Date(Date.now() + 259200000).toISOString().split("T")[0],
              time: "16:00",
              notification_enabled: true,
              created_at: new Date().toISOString(),
            },
          ]
          setTasks(sampleTasks)
          localStorage.setItem(`tasks_${userId}`, JSON.stringify(sampleTasks))
        }
      } catch (error) {
        console.error("Error loading tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [userId])

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks))
    setTasks(updatedTasks)
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getTasksForDate = (date: string) => {
    return tasks.filter((task) => task.date === date)
  }

  const getSelectedDateTasks = () => {
    const dateStr = selectedDate.toISOString().split("T")[0]
    return getTasksForDate(dateStr)
  }

  const getTaskStats = () => {
    const selectedTasks = getSelectedDateTasks()
    const completed = selectedTasks.filter((task) => task.completed).length
    const total = selectedTasks.length
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, progress }
  }

  const getCategoryInfo = (category: string) => {
    const categories: Record<string, { label: string; color: string }> = {
      personal: { label: "Personal", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      trabajo: { label: "Trabajo", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      salud: { label: "Salud", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
      educacion: { label: "Educación", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
      finanzas: { label: "Finanzas", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      hogar: { label: "Hogar", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
      social: { label: "Social", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
      otros: { label: "Otros", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
    }
    return categories[category] || categories.otros
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const today = new Date()
  const stats = getTaskStats()

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Calendario
              </CardTitle>
              <CardDescription>Organiza tu tiempo y tareas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Calendar className="h-5 w-5 text-purple-500" />
              Calendario
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Organiza tu tiempo y tareas
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {stats.total > 0 && (
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span>{stats.progress}% completado</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }).map((_, index) => (
            <div key={`empty-${index}`} className="p-2 h-10"></div>
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const dayTasks = getTasksForDate(dateString)
            const isToday =
              today.getDate() === day &&
              today.getMonth() === currentDate.getMonth() &&
              today.getFullYear() === currentDate.getFullYear()
            const isSelected =
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === currentDate.getMonth() &&
              selectedDate.getFullYear() === currentDate.getFullYear()

            return (
              <div
                key={day}
                className={`p-2 h-10 text-center text-sm border rounded cursor-pointer transition-colors
                  ${
                    isToday
                      ? "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-100 font-semibold"
                      : isSelected
                        ? "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100 font-medium"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }
                  ${dayTasks.length > 0 ? "relative" : ""}
                `}
                onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
              >
                <span className="text-slate-900 dark:text-white">{day}</span>
                {dayTasks.length > 0 && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full"></div>
                )}
              </div>
            )
          })}
        </div>

        {/* Selected Date Info */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-slate-900 dark:text-white">
              {selectedDate.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h4>
            {stats.total > 0 && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Target className="h-4 w-4" />
                {stats.progress}%
              </div>
            )}
          </div>

          {getSelectedDateTasks().length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">No hay tareas programadas para este día</p>
            </div>
          ) : (
            <div className="space-y-2">
              {getSelectedDateTasks().map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600"
                >
                  <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        task.completed
                          ? "line-through text-slate-500 dark:text-slate-400"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {task.text}
                    </p>
                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{task.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {task.time && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {task.time}
                      </div>
                    )}
                    <Badge variant="secondary" className={`text-xs ${getCategoryInfo(task.category).color}`}>
                      {getCategoryInfo(task.category).label}
                    </Badge>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {stats.total > 0 && (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Progreso del día</span>
                <span>
                  {stats.completed}/{stats.total} completadas
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
