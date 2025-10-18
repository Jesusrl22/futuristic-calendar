"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CalendarWidget } from "@/components/calendar-widget"
import { TaskForm } from "@/components/task-form"
import { hybridDb, type Task, type User } from "@/lib/hybrid-database"

interface TaskCalendarManagerProps {
  user: User
  onUserUpdate: (updates: Partial<User>) => void
}

export function TaskCalendarManager({ user, onUserUpdate }: TaskCalendarManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleCloseForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  const loadTasks = useCallback(async () => {
    if (!user?.id) {
      console.log("❌ No user ID available for loading tasks")
      setIsLoading(false)
      return
    }

    try {
      console.log("📋 Loading tasks for user:", user.id)
      setIsLoading(true)
      const userTasks = await hybridDb.getTasks(user.id)
      console.log("✅ Tasks loaded:", userTasks.length)
      setTasks(userTasks || [])
    } catch (error) {
      console.error("❌ Error loading tasks:", error)
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  const handleTasksChange = useCallback(() => {
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    console.log("🔄 TaskCalendarManager mounted with user:", user?.id)
    loadTasks()
  }, [loadTasks])

  if (!user) {
    console.log("❌ No user provided to TaskCalendarManager")
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Usuario no encontrado</p>
        </div>
      </div>
    )
  }

  const handleCreateTask = async (taskData: any) => {
    if (!user?.id) return

    try {
      console.log("➕ Creating new task...", taskData)
      const newTask = await hybridDb.createTask(user.id, taskData)
      console.log("✅ Task created:", newTask.id)
      setTasks((prev) => [newTask, ...(prev || [])])
      setShowTaskForm(false)
    } catch (error) {
      console.error("❌ Error creating task:", error)
      alert("Error al crear la tarea. Por favor, inténtalo de nuevo.")
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      console.log("✏️ Updating task:", taskId, updates)
      const updatedTask = await hybridDb.updateTask(taskId, updates)
      console.log("✅ Task updated")
      setTasks((prev) => (prev || []).map((task) => (task.id === taskId ? updatedTask : task)))
      setEditingTask(null)
      setShowTaskForm(false)
    } catch (error) {
      console.error("❌ Error updating task:", error)
      alert("Error al actualizar la tarea. Por favor, inténtalo de nuevo.")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      console.log("🗑️ Deleting task:", taskId)
      await hybridDb.deleteTask(taskId)
      console.log("✅ Task deleted")
      setTasks((prev) => (prev || []).filter((task) => task.id !== taskId))
      setEditingTask(null)
      setShowTaskForm(false)
    } catch (error) {
      console.error("❌ Error deleting task:", error)
      alert("Error al eliminar la tarea. Por favor, inténtalo de nuevo.")
    }
  }

  const handleTaskClick = (task: Task) => {
    console.log("👆 Task clicked:", task.id)
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleNewTask = () => {
    console.log("➕ Creating new task")
    setEditingTask(null)
    setShowTaskForm(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tareas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tareas & Calendario</h2>
          <p className="text-muted-foreground text-sm">Organiza y gestiona tus tareas diarias</p>
        </div>
        <Button onClick={handleNewTask} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      <CalendarWidget
        tasks={tasks}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onTaskClick={handleTaskClick}
      />

      <TaskForm
        isOpen={showTaskForm}
        onClose={handleCloseForm}
        selectedDate={selectedDate}
        onTaskCreated={handleCreateTask}
        editingTask={editingTask}
        onTaskUpdated={handleUpdateTask}
        onTaskDeleted={handleDeleteTask}
      />
    </div>
  )
}
