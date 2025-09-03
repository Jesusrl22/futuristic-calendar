"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, CalendarIcon, Edit } from "lucide-react"

interface Task {
  id: string
  text: string
  description?: string
  completed: boolean
  date: string
  category: "work" | "personal" | "health" | "learning" | "other"
  priority: "low" | "medium" | "high"
  time?: string
}

interface CalendarWidgetProps {
  tasks: Task[]
  onTaskToggle: (taskId: string) => void
  onEditTask?: (task: Task) => void
  currentUser: any
  translations: (key: string) => string
}

const CATEGORY_COLORS = {
  work: "bg-blue-500/20 border-blue-400/60 text-blue-200",
  personal: "bg-green-500/20 border-green-400/60 text-green-200",
  health: "bg-red-500/20 border-red-400/60 text-red-200",
  learning: "bg-purple-500/20 border-purple-400/60 text-purple-200",
  other: "bg-gray-500/20 border-gray-400/60 text-gray-200",
}

const PRIORITY_COLORS = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-red-400",
}

export function CalendarWidget({ tasks, onTaskToggle, onEditTask, currentUser, translations: t }: CalendarWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const getTasksForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    return tasks.filter((task) => task.date === dateStr)
  }

  const selectedDateTasks = getTasksForDate(selectedDate)

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>{t("calendar")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border-none shadow-none w-full"
          />
        </CardContent>
      </Card>

      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">
            {t("tasks")} - {selectedDate.toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border transition-all ${
                    task.completed ? "bg-green-500/10 border-green-500/30" : "bg-black/30 border-purple-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTaskToggle(task.id)}
                        className={`p-1 ${task.completed ? "text-green-400" : "text-gray-400"}`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </Button>
                      <div className="flex-1">
                        <h4
                          className={`font-semibold ${task.completed ? "text-green-300 line-through" : "text-white"}`}
                        >
                          {task.text}
                        </h4>
                        {task.description && <p className="text-sm text-gray-400">{task.description}</p>}
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={CATEGORY_COLORS[task.category]} size="sm">
                            {t(task.category)}
                          </Badge>
                          <Badge className={PRIORITY_COLORS[task.priority]} size="sm">
                            {t(task.priority)}
                          </Badge>
                          {task.time && (
                            <Badge variant="outline" size="sm">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.time}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {onEditTask && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditTask(task)}
                        className="text-blue-300 hover:bg-blue-500/20 ml-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-white">No hay tareas para este día</p>
                <p className="text-gray-400">¡Agrega una tarea para comenzar!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Exportación adicional para compatibilidad
export { CalendarWidget as default }
