"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Calendar, Clock, Check, Plus } from "lucide-react"
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  date: Date
  estimatedTime?: number
}

interface WeeklyViewProps {
  tasks: Task[]
  selectedDate: Date
  onDateChange: (date: Date) => void
  onTaskClick: (task: Task) => void
  onTaskComplete: (taskId: string) => void
}

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
}

export function WeeklyView({ tasks, selectedDate, onDateChange, onTaskClick, onTaskComplete }: WeeklyViewProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(selectedDate))

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => isSameDay(task.date, date))
  }

  const goToPreviousWeek = () => {
    const newWeek = subWeeks(currentWeek, 1)
    setCurrentWeek(newWeek)
    onDateChange(newWeek)
  }

  const goToNextWeek = () => {
    const newWeek = addWeeks(currentWeek, 1)
    setCurrentWeek(newWeek)
    onDateChange(newWeek)
  }

  const goToToday = () => {
    const today = new Date()
    const weekStart = startOfWeek(today)
    setCurrentWeek(weekStart)
    onDateChange(today)
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={goToPreviousWeek} className="text-white hover:bg-white/20">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-white">{format(currentWeek, "MMMM yyyy")}</h2>
            <Button variant="ghost" size="sm" onClick={goToNextWeek} className="text-white hover:bg-white/20">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Today
          </Button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayTasks = getTasksForDay(day)
            const isToday = isSameDay(day, new Date())
            const isSelected = isSameDay(day, selectedDate)

            return (
              <div key={index} className="space-y-2">
                {/* Day Header */}
                <div
                  className={`text-center p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : isToday
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                  onClick={() => onDateChange(day)}
                >
                  <div className="text-xs font-medium">{format(day, "EEE")}</div>
                  <div className="text-lg font-bold">{format(day, "d")}</div>
                  {dayTasks.length > 0 && (
                    <div className="text-xs mt-1">
                      {dayTasks.filter((t) => t.completed).length}/{dayTasks.length}
                    </div>
                  )}
                </div>

                {/* Tasks for the day */}
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {dayTasks.map((task) => (
                      <Card
                        key={task.id}
                        className={`bg-white/10 border-white/20 cursor-pointer hover:bg-white/20 transition-colors ${
                          task.completed ? "opacity-60" : ""
                        }`}
                        onClick={() => onTaskClick(task)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onTaskComplete(task.id)
                              }}
                              className="p-0 h-auto text-white hover:bg-white/20"
                            >
                              {task.completed ? (
                                <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              ) : (
                                <div className="h-4 w-4 border-2 border-white/40 rounded-full" />
                              )}
                            </Button>
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`text-sm font-medium text-white truncate ${
                                  task.completed ? "line-through" : ""
                                }`}
                              >
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-xs text-white/60 truncate mt-1">{task.description}</p>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge className={`${priorityColors[task.priority]} text-xs`}>{task.priority}</Badge>
                                {task.estimatedTime && (
                                  <div className="flex items-center text-xs text-white/60">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {task.estimatedTime}m
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Add task button for empty days */}
                    {dayTasks.length === 0 && (
                      <Button
                        variant="ghost"
                        className="w-full h-12 border-2 border-dashed border-white/20 text-white/60 hover:bg-white/10 hover:text-white/80"
                        onClick={() => onDateChange(day)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add task
                      </Button>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
