"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { es } from "date-fns/locale"

interface Task {
  id: string
  title: string
  completed: boolean
  priority: "low" | "medium" | "high"
  date: Date
  category: string
}

interface CalendarWidgetProps {
  tasks: Task[]
  onDateSelect?: (date: Date) => void
  onTaskClick?: (task: Task) => void
  selectedDate?: Date
}

export function CalendarWidget({ tasks = [], onDateSelect, onTaskClick, selectedDate }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewDate, setViewDate] = useState(new Date())

  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    if (!date) return []
    return tasks.filter((task) => task.date && isSameDay(new Date(task.date), date))
  }

  // Navigate months
  const previousMonth = () => {
    setViewDate(subMonths(viewDate, 1))
  }

  const nextMonth = () => {
    setViewDate(addMonths(viewDate, 1))
  }

  const handleDateClick = (date: Date) => {
    setCurrentDate(date)
    onDateSelect?.(date)
  }

  const Day = ({ date, ...props }: { date: Date } & React.HTMLAttributes<HTMLDivElement>) => {
    if (!date) return <div {...props}>{props.children}</div>

    const dayTasks = getTasksForDate(date)
    const isSelected = selectedDate ? isSameDay(date, selectedDate) : isSameDay(date, currentDate)
    const isCurrentMonth = isSameMonth(date, viewDate)
    const isToday = isSameDay(date, new Date())

    return (
      <div
        {...props}
        onClick={() => handleDateClick(date)}
        className={`
          min-h-[80px] p-2 border border-white/10 cursor-pointer transition-all duration-200
          ${isSelected ? "bg-blue-500/20 border-blue-500/50" : "hover:bg-white/5"}
          ${!isCurrentMonth ? "opacity-50" : ""}
          ${isToday ? "ring-2 ring-blue-400/50" : ""}
        `}
      >
        <div className="flex justify-between items-start mb-1">
          <span className={`text-sm font-medium ${isToday ? "text-blue-400" : "text-white"}`}>{format(date, "d")}</span>
          {dayTasks.length > 0 && (
            <Badge variant="secondary" className="text-xs px-1 py-0 h-4 bg-purple-500/20 text-purple-300">
              {dayTasks.length}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          {dayTasks.slice(0, 2).map((task) => (
            <div
              key={task.id}
              onClick={(e) => {
                e.stopPropagation()
                onTaskClick?.(task)
              }}
              className={`
                text-xs p-1 rounded truncate cursor-pointer transition-colors
                ${task.priority === "high" ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : ""}
                ${task.priority === "medium" ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30" : ""}
                ${task.priority === "low" ? "bg-green-500/20 text-green-300 hover:bg-green-500/30" : ""}
                ${task.completed ? "opacity-60 line-through" : ""}
              `}
            >
              {task.title}
            </div>
          ))}
          {dayTasks.length > 2 && <div className="text-xs text-slate-400">+{dayTasks.length - 2} más</div>}
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Calendario
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={previousMonth} className="text-white hover:bg-white/10">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-white font-medium min-w-[120px] text-center">
              {format(viewDate, "MMMM yyyy", { locale: es })}
            </span>
            <Button variant="ghost" size="sm" onClick={nextMonth} className="text-white hover:bg-white/10">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((date, index) => (
            <Day key={index} date={date} />
          ))}
        </div>

        {/* Selected date info */}
        {selectedDate && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-white font-medium mb-2">{format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}</h4>
            <div className="space-y-2">
              {getTasksForDate(selectedDate).map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className={`
                    p-2 rounded cursor-pointer transition-colors
                    ${task.priority === "high" ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : ""}
                    ${task.priority === "medium" ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30" : ""}
                    ${task.priority === "low" ? "bg-green-500/20 text-green-300 hover:bg-green-500/30" : ""}
                    ${task.completed ? "opacity-60" : ""}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${task.completed ? "line-through" : ""}`}>{task.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                  </div>
                </div>
              ))}
              {getTasksForDate(selectedDate).length === 0 && (
                <p className="text-slate-400 text-sm">No hay tareas para este día</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
