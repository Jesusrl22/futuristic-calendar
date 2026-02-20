"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Edit2, Calendar, AlertCircle } from "lucide-react"
import { Task, getTodayTasks, sortTasks, getOverdueTasks, isToday } from "@/lib/task-utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface TaskDayViewProps {
  tasks: Task[]
  onTaskToggle: (taskId: string, completed: boolean) => void
  onTaskDelete: (taskId: string) => void
  onTaskEdit: (task: Task) => void
  onTaskCreate: (title: string, priority: string) => void
}

export function TaskDayView({
  tasks,
  onTaskToggle,
  onTaskDelete,
  onTaskEdit,
  onTaskCreate,
}: TaskDayViewProps) {
  const [quickAddTitle, setQuickAddTitle] = useState("")
  const [quickAddPriority, setQuickAddPriority] = useState("medium")
  const [isAddingQuick, setIsAddingQuick] = useState(false)

  const todayTasks = sortTasks(getTodayTasks(tasks))
  const overdueTasks = sortTasks(getOverdueTasks(tasks))
  const activeTasks = todayTasks.filter((t) => !t.completed)
  const completedTasks = todayTasks.filter((t) => t.completed)

  const handleQuickAdd = async () => {
    if (!quickAddTitle.trim()) return

    setIsAddingQuick(true)
    try {
      await onTaskCreate(quickAddTitle, quickAddPriority)
      setQuickAddTitle("")
      setQuickAddPriority("medium")
    } finally {
      setIsAddingQuick(false)
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-500 bg-gray-50 border-gray-200"
    }
  }

  const getPriorityBadge = (priority?: string) => {
    const labels: Record<string, string> = {
      high: "Alta",
      medium: "Media",
      low: "Baja",
    }
    return labels[priority || "medium"] || "Media"
  }

  return (
    <div className="space-y-6">
      {/* Overdue Warning */}
      {overdueTasks.length > 0 && (
        <Card className="border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Tareas Vencidas</h3>
              <p className="text-sm text-red-700">
                Tienes {overdueTasks.length} tarea(s) vencida(s)
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Add Task */}
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Añade una tarea para hoy..."
            value={quickAddTitle}
            onChange={(e) => setQuickAddTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleQuickAdd()
              }
            }}
            className="bg-white"
          />
          <select
            value={quickAddPriority}
            onChange={(e) => setQuickAddPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
          >
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
          <Button
            onClick={handleQuickAdd}
            disabled={isAddingQuick || !quickAddTitle.trim()}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Añadir
          </Button>
        </div>
      </Card>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Tareas Hoy ({activeTasks.length})
          </h3>
          <div className="space-y-2">
            {activeTasks.map((task) => (
              <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => onTaskToggle(task.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {getPriorityBadge(task.priority)}
                      </span>
                      {task.category && (
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          {task.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTaskEdit(task)}
                      className="gap-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTaskDelete(task.id)}
                      className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-gray-600 flex items-center gap-2">
            ✓ Completadas ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <Card
                key={task.id}
                className="p-4 bg-gray-50 opacity-70 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => onTaskToggle(task.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-500 line-through">{task.title}</h4>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTaskDelete(task.id)}
                    className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {todayTasks.length === 0 && (
        <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-gray-400 mb-3">
            <Calendar className="h-12 w-12 mx-auto opacity-50" />
          </div>
          <h3 className="font-semibold text-gray-600 mb-1">No hay tareas para hoy</h3>
          <p className="text-gray-500 text-sm">¡Usa el campo de arriba para crear una!</p>
        </Card>
      )}
    </div>
  )
}
