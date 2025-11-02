"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Circle,
  CalendarIcon,
  Edit,
  Plus,
} from "lucide-react"
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
  onNewTask?: () => void
  user?: any
}

const safeParseDate = (dateString: string | undefined | null): Date | null => {
  if (!dateString) return null

  try {
    const parsed = parseISO(dateString)
    if (isValid(parsed)) return parsed

    const date = new Date(dateString)
    if (isValid(date)) return date

    return null
  } catch (error) {
    console.warn("Invalid date string:", dateString, error)
    return null
  }
}

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
  onNewTask,
  user,
}: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)

  const validSelectedDate = isValid(selectedDate) ? selectedDate : new Date()
  const validCurrentMonth = isValid(currentMonth) ? currentMonth : new Date()

  const monthStart = startOfMonth(validCurrentMonth)
  const monthEnd = endOfMonth(validCurrentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getTasksForDate = (date: Date) => {
    if (!tasks || !Array.isArray(tasks) || !isValid(date)) return []

    return tasks.filter((task) => {
      if (!task.due_date) return false

      const taskDate = safeParseDate(task.due_date)
      if (!taskDate) return false

      return isSameDay(taskDate, date)
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/30"
      case "medium":
        return "bg-accent/10 text-accent-foreground border-accent/30"
      case "low":
        return "bg-primary/10 text-primary border-primary/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getSelectedTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20"
      case "medium":
        return "bg-accent/10 text-accent-foreground border-accent/30 hover:bg-accent/20"
      case "low":
        return "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
      default:
        return "bg-muted/10 text-muted-foreground border-border hover:bg-muted/20"
    }
  }

  const getTaskIcon = (task: Task) => {
    if (task.completed) {
      return <CheckCircle className="w-4 h-4 text-green-400" />
    }

    if (task.due_date) {
      const taskDate = safeParseDate(task.due_date)
      if (taskDate && taskDate < new Date() && !task.completed) {
        return <AlertCircle className="w-4 h-4 text-red-400" />
      }
      if (task.due_date.includes("T")) {
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
      <Card className="bg-card border-border backdrop-blur-sm">
        <CardHeader className="border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {safeFormatDate(validCurrentMonth, "MMMM yyyy", { locale: es }) || "Calendario"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Gestiona tus tareas</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onNewTask}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Tarea
              </Button>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  className="h-9 w-9 p-0 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date())}
                  className="h-9 px-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground text-xs font-medium"
                >
                  Hoy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  className="h-9 w-9 p-0 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 bg-card">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day, index) => (
              <div
                key={day}
                className={`p-2 text-center text-xs font-semibold ${
                  index === 0 || index === 6 ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayTasks = getTasksForDate(day)
              const isSelected = isSameDay(day, validSelectedDate)
              const isTodayDate = isToday(day)
              const isCurrentMonth = isSameMonth(day, validCurrentMonth)

              return (
                <div
                  key={day.toISOString()}
                  className={`
                    min-h-[100px] p-2 cursor-pointer transition-all duration-200 rounded-lg border
                    ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                        : isTodayDate
                          ? "bg-accent text-accent-foreground border-primary/50 shadow-md"
                          : "bg-card/50 hover:bg-accent/30 border-border/50"
                    }
                    ${!isCurrentMonth ? "opacity-40" : ""}
                  `}
                  onClick={() => onDateSelect?.(day)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-semibold ${
                        isSelected
                          ? "text-primary-foreground"
                          : isTodayDate
                            ? "text-primary font-bold"
                            : "text-foreground"
                      }`}
                    >
                      {safeFormatDate(day, "d") || "?"}
                    </span>
                    {dayTasks.length > 0 && (
                      <Badge
                        variant="secondary"
                        className={`text-xs px-1.5 py-0.5 border-0 ${
                          isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/20 text-primary"
                        }`}
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
                        {task.due_date && task.due_date.includes("T") && (
                          <div className="text-xs opacity-75 mt-1">{safeFormatDate(task.due_date, "HH:mm") || ""}</div>
                        )}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-center py-1 bg-muted/50 text-muted-foreground rounded font-medium">
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
        <Card className="bg-card border-border backdrop-blur-sm">
          <CardHeader className="border-b border-border bg-card/50">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <span>
                  Tareas para {safeFormatDate(validSelectedDate, "d 'de' MMMM", { locale: es }) || "fecha seleccionada"}
                </span>
                <p className="text-sm text-muted-foreground font-normal">Haz clic en una tarea para editarla</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 bg-card">
            {selectedDateTasks.map((task) => (
              <div
                key={task.id}
                className={`
                  p-4 border border-border rounded-lg cursor-pointer transition-all duration-200 group
                  ${getSelectedTaskPriorityColor(task.priority)}
                  ${task.completed ? "opacity-70" : "hover:shadow-md"}
                `}
                onClick={() => onTaskClick?.(task)}
              >
                <div className="flex items-center gap-3 mb-2">
                  {getTaskIcon(task)}
                  <span className={`font-semibold text-base text-foreground ${task.completed ? "line-through" : ""}`}>
                    {task.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium px-2 py-1 ${
                      task.priority === "high"
                        ? "bg-destructive/10 text-destructive border-destructive/30"
                        : task.priority === "medium"
                          ? "bg-accent/10 text-accent-foreground border-accent/30"
                          : "bg-primary/10 text-primary border-primary/30"
                    }`}
                  >
                    {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                  </Badge>
                  <Edit className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                </div>

                {task.description && <p className="text-sm text-muted-foreground mb-3 pl-7">{task.description}</p>}

                <div className="flex items-center gap-3 text-sm pl-7">
                  {task.due_date && task.due_date.includes("T") && (
                    <span className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded font-medium border border-primary/30">
                      <Clock className="w-3 h-3" />
                      {safeFormatDate(task.due_date, "HH:mm") || ""}
                    </span>
                  )}
                  {task.category && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-1 bg-muted text-muted-foreground border border-border"
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
