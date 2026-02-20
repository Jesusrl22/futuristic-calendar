"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Task, getTasksForMonth, isToday } from "@/lib/task-utils"

interface TaskMonthViewProps {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
}

export function TaskMonthView({ tasks, onTaskClick }: TaskMonthViewProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const monthTasks = getTasksForMonth(tasks, currentYear, currentMonth)

  // Group tasks by day
  const tasksByDay: Record<number, Task[]> = {}
  monthTasks.forEach((task) => {
    if (task.due_date) {
      const day = new Date(task.due_date).getDate()
      if (!tasksByDay[day]) tasksByDay[day] = []
      tasksByDay[day].push(task)
    }
  })

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const getTaskColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={prevMonth}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <h2 className="text-xl font-bold capitalize text-center flex-1">
          {monthName}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={nextMonth}
          className="gap-1"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sab", "Dom"].map((day) => (
            <div key={day} className="p-3 text-center font-semibold text-sm text-gray-600 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const taskList = day ? tasksByDay[day] || [] : []
            const isCurrentDay = day &&
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear()

            return (
              <div
                key={index}
                className={`min-h-24 p-2 border-r border-b border-gray-200 last:border-r-0 ${
                  isCurrentDay ? "bg-blue-50" : "bg-white hover:bg-gray-50"
                } transition-colors cursor-pointer last-row:border-b-0`}
              >
                {day ? (
                  <div className="h-full flex flex-col">
                    <p
                      className={`text-sm font-semibold mb-1 ${
                        isCurrentDay ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      {day}
                    </p>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      {taskList.slice(0, 3).map((task, taskIndex) => (
                        <div
                          key={task.id}
                          className={`text-xs px-2 py-1 rounded truncate cursor-pointer hover:shadow-md transition-shadow ${getTaskColor(
                            task.priority
                          )}`}
                          onClick={() => onTaskClick?.(task)}
                          title={task.title}
                        >
                          {task.completed && "✓ "}
                          {task.title}
                        </div>
                      ))}
                      {taskList.length > 3 && (
                        <div className="text-xs px-2 py-1 text-gray-500 font-medium">
                          +{taskList.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 h-full rounded" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {monthTasks.length}
            </p>
            <p className="text-sm text-gray-600">Tareas este mes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {monthTasks.filter((t) => t.completed).length}
            </p>
            <p className="text-sm text-gray-600">Completadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">
              {monthTasks.filter((t) => !t.completed).length}
            </p>
            <p className="text-sm text-gray-600">Pendientes</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
