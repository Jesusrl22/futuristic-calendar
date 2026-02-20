"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"
import { Task, getTasksForWeek, getDayNameES, formatDateShort } from "@/lib/task-utils"

interface TaskWeekViewProps {
  tasks: Task[]
  onTaskToggle: (taskId: string, completed: boolean) => void
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: Task) => void
}

export function TaskWeekView({
  tasks,
  onTaskToggle,
  onTaskDelete,
  onTaskEdit,
}: TaskWeekViewProps) {
  const weekTasks = getTasksForWeek(tasks, new Date())
  
  // Group by day of week
  const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  const dayTasks: Record<string, Task[]> = {}

  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - date.getDay() + 1 + i)
    const dayKey = date.toISOString().split("T")[0]
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    dayTasks[dayKey] = weekTasks.filter((task) => {
      if (!task.due_date) return false
      const taskDate = new Date(task.due_date)
      return taskDate >= dayStart && taskDate <= dayEnd
    })
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-500 bg-gray-50"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {dayNames.map((dayName, index) => {
        const date = new Date()
        date.setDate(date.getDate() - date.getDay() + 1 + index)
        const dayKey = date.toISOString().split("T")[0]
        const tasksForDay = dayTasks[dayKey] || []
        const isToday = new Date().toISOString().split("T")[0] === dayKey

        return (
          <Card
            key={dayKey}
            className={`p-4 ${
              isToday
                ? "border-2 border-blue-500 bg-blue-50"
                : "border border-gray-200"
            }`}
          >
            <div className="mb-4">
              <h3 className={`font-bold text-lg ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                {dayName}
              </h3>
              <p className={`text-sm ${isToday ? "text-blue-500" : "text-gray-600"}`}>
                {formatDateShort(date)}
              </p>
            </div>

            <div className="space-y-2">
              {tasksForDay.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Sin tareas</p>
              ) : (
                tasksForDay.map((task) => (
                  <div
                    key={task.id}
                    className={`p-2 rounded border text-sm ${getPriorityColor(
                      task.priority
                    )} hover:shadow-md transition-shadow group`}
                  >
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) =>
                          onTaskToggle(task.id, checked as boolean)
                        }
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium break-words ${
                            task.completed ? "line-through opacity-60" : ""
                          }`}
                        >
                          {task.title}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onTaskEdit(task)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onTaskDelete(task.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {tasksForDay.length > 0 && (
              <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                {tasksForDay.filter((t) => !t.completed).length} pendientes,{" "}
                {tasksForDay.filter((t) => t.completed).length} completadas
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
