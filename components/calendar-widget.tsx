"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle, Circle, CalendarIcon, Edit } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  isValid,
  parseISO,
} from "date-fns"
import { es } from "date-fns/locale"
import type { Task } from "@/lib/hybrid-database"

interface CalendarWidgetProps {
  tasks: Task[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onTaskClick?: (task: Task) => void
  onTaskUpdate?: () => void
  user?: any
}

// Helper function to safely parse dates
const safeParseDate = (dateString: string | undefined | null): Date | null => {
  if (!dateString) return null

  try {
    // Try parsing as ISO string first
    const parsed = parseISO(dateString)
    if (isValid(parsed)) return parsed

    // Try creating a new Date object
    const date = new Date(dateString)
    if (isValid(date)) return date

    return null
  } catch (error) {
    console.warn("Invalid date string:", dateString, error)
    return null
  }
}

// Helper function to safely format dates
const safeFormatDate = (date: Date | string | null | undefined, formatString: string, options?: any): string => {
  if (!date) return ""

  try {
    const dateObj = typeof date === "string" ? safeParseDate(date) : date
    if (!dateObj || !isValid(dateObj)) return ""

    return format(dateObj, formatString, options)
  } catch (error) {
    console.warn("Error formatting date:", date, error)
    return ""
  }
}

export function CalendarWidget({
  tasks = [],
  selectedDate = new Date(),
  onDateSelect,
  onTaskClick,
  onTaskUpdate,
  user,
}: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)

  // Validate selectedDate
  const validSelectedDate = isValid(selectedDate) ? selectedDate : new Date()
  const validCurrentMonth = isValid(currentMonth) ? currentMonth : new Date()

  const monthStart = startOfMonth(validCurrentMonth)
  const monthEnd = endOfMonth(validCurrentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Get tasks for a specific date with proper date validation
  const getTasksForDate = (date: Date) => {
    if (!tasks || !Array.isArray(tasks) || !isValid(date)) return []

    return tasks.filter((task) => {
      if (!task.dueDate) return false

      const taskDate = safeParseDate(task.dueDate)
      if (!taskDate) return false

      return isSameDay(taskDate, date)
    })
  }

  // Get priority color for calendar tasks
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  // Get priority color for selected date tasks
  const getSelectedTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-300 border-red-500/30 hover:bg-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-300 border-green-500/30 hover:bg-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-300 border-gray-500/30 hover:bg-gray-500/20"
    }
  }

  // Get task icon with date validation
  const getTaskIcon = (task: Task) => {
    if (task.completed) {
      return <CheckCircle className="w-4 h-4 text-green-400" />
    }

    if (task.dueDate) {
      const taskDate = safeParseDate(task.dueDate)
      if (taskDate && taskDate < new Date() && !task.completed) {
        return <AlertCircle className="w-4 h-4 text-red-400" />
      }
      if (task.dueDate.includes("T")) {
        return <Clock className="w-4 h-4 text-blue-400" />
      }
    }

    return <Circle className="w-4 h-4 text-gray-400" />
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(validCurrentMonth)
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const selectedDateTasks = getTasksForDate(validSelectedDate)

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader className="border-b border-purple-500/20 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-purple-400" />
              <div>
                <CardTitle className="text-lg font-semibold text-white">
                  {safeFormatDate(validCurrentMonth, "MMMM yyyy", { locale: es }) || "Calendario"}
                </CardTitle>
                <p className="text-sm text-gray-400">Gestiona tus tareas</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="h-8 w-8 p-0 text-gray-400 hover:bg-slate-700 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
                className="h-8 px-3 text-gray-400 hover:bg-slate-700 hover:text-white text-xs font-medium"
              >
                Hoy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="h-8 w-8 p-0 text-gray-400 hover:bg-slate-700 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 bg-slate-900/50">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-px mb-2">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day, index) => (
              <div
                key={day}
                className={`p-2 text-center text-xs font-medium ${
                  index === 0 || index === 6 ? "text-red-400" : "text-gray-400"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-slate-700 rounded-lg overflow-hidden">
            {calendarDays.map((day) => {
              const dayTasks = getTasksForDate(day)
              const isSelected = isSameDay(day, validSelectedDate)
              const isTodayDate = isToday(day)
              const isCurrentMonth = isSameMonth(day, validCurrentMonth)

              return (
                <div
                  key={day.toISOString()}
                  className={`
                    min-h-[100px] p-2 cursor-pointer transition-colors bg-slate-800 hover:bg-slate-700
                    ${isSelected ? "bg-purple-600 ring-2 ring-purple-400 ring-inset" : ""}
                    ${isTodayDate ? "bg-blue-600" : ""}
                    ${!isCurrentMonth ? "bg-slate-900 text-gray-500" : "text-white"}
                  `}
                  onClick={() => onDateSelect?.(day)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isTodayDate ? "text-white font-bold" : ""}`}>
                      {safeFormatDate(day, "d") || "?"}
                    </span>
                    {dayTasks.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5 bg-purple-500/30 text-purple-200 border-0"
                      >
                        {dayTasks.length}
                      </Badge>
                    )}
                  </div>

                  {/* Tasks for this day */}
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className={`
                          text-xs p-1.5 rounded border cursor-pointer transition-all duration-200 group
                          ${getPriorityColor(task.priority)}
                          ${task.completed ? "opacity-60 line-through" : "hover:shadow-sm"}
                        `}
                        onClick={(e) => {
                          e.stopPropagation()
                          onTaskClick?.(task)
                        }}
                      >
                        <div className="flex items-center gap-1">
                          {getTaskIcon(task)}
                          <span className="truncate flex-1 font-medium">{task.title}</span>
                          <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {task.dueDate && task.dueDate.includes("T") && (
                          <div className="text-xs opacity-75 mt-1">{safeFormatDate(task.dueDate, "HH:mm") || ""}</div>
                        )}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-center py-1 bg-slate-700 text-gray-300 rounded">
                        +{dayTasks.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected date tasks */}
      {selectedDateTasks.length > 0 && (
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader className="border-b border-purple-500/20 bg-slate-800/30">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-purple-400" />
              <div>
                <span>
                  Tareas para {safeFormatDate(validSelectedDate, "d 'de' MMMM", { locale: es }) || "fecha seleccionada"}
                </span>
                <p className="text-sm text-gray-400 font-normal">Haz clic en una tarea para editarla</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 bg-slate-900/30">
            {selectedDateTasks.map((task) => (
              <div
                key={task.id}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all duration-200 group
                  ${getSelectedTaskPriorityColor(task.priority)}
                  ${task.completed ? "opacity-70" : "hover:shadow-md"}
                `}
                onClick={() => onTaskClick?.(task)}
              >
                <div className="flex items-center gap-3 mb-2">
                  {getTaskIcon(task)}
                  <span className={`font-semibold text-base ${task.completed ? "line-through" : ""}`}>
                    {task.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium px-2 py-1 ${
                      task.priority === "high"
                        ? "bg-red-500/20 text-red-300 border-red-500/30"
                        : task.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : "bg-green-500/20 text-green-300 border-green-500/30"
                    }`}
                  >
                    {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                  </Badge>
                  <Edit className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                </div>

                {task.description && <p className="text-sm text-gray-300 mb-3 pl-7">{task.description}</p>}

                <div className="flex items-center gap-3 text-sm pl-7">
                  {task.dueDate && task.dueDate.includes("T") && (
                    <span className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-1 rounded font-medium border border-blue-500/30">
                      <Clock className="w-3 h-3" />
                      {safeFormatDate(task.dueDate, "HH:mm") || ""}
                    </span>
                  )}
                  {task.estimatedTime && (
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded font-medium border border-green-500/30">
                      {task.estimatedTime} min
                    </span>
                  )}
                  {task.category && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-1 bg-gray-500/20 text-gray-300 border border-gray-500/30"
                    >
                      {task.category}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
