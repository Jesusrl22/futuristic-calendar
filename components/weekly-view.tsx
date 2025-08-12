"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns"
import { es } from "date-fns/locale"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  dueDate: string
  createdAt: string
  pomodoroSessions: number
}

interface WeeklyViewProps {
  tasks: Task[]
  onBack: () => void
}

export function WeeklyView({ tasks, onBack }: WeeklyViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const goToToday = () => {
    setCurrentWeek(new Date())
  }

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => {
      const taskDate = parseISO(task.dueDate)
      return isSameDay(taskDate, day)
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "trabajo":
        return "💼"
      case "personal":
        return "👤"
      case "salud":
        return "🏃"
      case "estudio":
        return "📚"
      default:
        return "📝"
    }
  }

  const isToday = (day: Date) => {
    return isSameDay(day, new Date())
  }

  const getWeekStats = () => {
    const weekTasks = tasks.filter((task) => {
      const taskDate = parseISO(task.dueDate)
      return taskDate >= weekStart && taskDate <= weekEnd
    })

    const completed = weekTasks.filter((task) => task.completed).length
    const total = weekTasks.length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, completionRate }
  }

  const stats = getWeekStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vista Semanal</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {format(weekStart, "d MMM", { locale: es })} - {format(weekEnd, "d MMM yyyy", { locale: es })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoy
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tareas esta semana</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completadas</p>
                <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-500 font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Progreso</p>
                <p className="text-2xl font-bold text-purple-500">{stats.completionRate}%</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-500 font-bold">%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayTasks = getTasksForDay(day)
          const isSelected = selectedDay && isSameDay(day, selectedDay)

          return (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isToday(day)
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : isSelected
                    ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={() => setSelectedDay(isSelected ? null : day)}
            >
              <CardHeader className="pb-2">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {format(day, "EEE", { locale: es })}
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      isToday(day) ? "text-blue-600" : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-2">
                  {dayTasks.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-400">Sin tareas</p>
                    </div>
                  ) : (
                    <>
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className={`p-2 rounded-lg border text-xs ${
                            task.completed ? "bg-gray-100 text-gray-500 line-through" : "bg-white dark:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <span>{getCategoryIcon(task.category)}</span>
                            <span className="font-medium truncate">{task.title}</span>
                          </div>
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`} variant="outline">
                            {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                          </Badge>
                        </div>
                      ))}

                      {dayTasks.length > 3 && (
                        <div className="text-center py-1">
                          <span className="text-xs text-gray-500">+{dayTasks.length - 3} más</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tareas para {format(selectedDay, "EEEE, d MMMM yyyy", { locale: es })}</span>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Tarea
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTasksForDay(selectedDay).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No hay tareas programadas para este día</p>
                  <Button className="mt-4" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primera Tarea
                  </Button>
                </div>
              ) : (
                getTasksForDay(selectedDay).map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      task.completed
                        ? "bg-gray-50 dark:bg-gray-800 opacity-75"
                        : "bg-white dark:bg-gray-800 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">{getCategoryIcon(task.category)}</span>
                          <h3
                            className={`font-medium ${
                              task.completed ? "line-through text-gray-500" : "text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            {task.title}
                          </h3>
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 ml-8">{task.description}</p>
                        )}

                        <div className="flex items-center space-x-3 ml-8">
                          <Badge className={getPriorityColor(task.priority)} variant="outline">
                            {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                          </Badge>

                          <div className="text-sm text-gray-500">{task.category}</div>

                          {task.pomodoroSessions > 0 && (
                            <div className="text-sm text-gray-500">🍅 {task.pomodoroSessions} pomodoros</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          Editar
                        </Button>
                        <Button size="sm" variant={task.completed ? "outline" : "default"}>
                          {task.completed ? "Desmarcar" : "Completar"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
