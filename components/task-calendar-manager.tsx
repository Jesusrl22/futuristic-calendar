"use client"

import { useState, useEffect, useCallback } from "react"
import { CalendarWidget } from "@/components/calendar-widget"
import { TaskForm } from "@/components/task-form"
import { hybridDb, type Task, type User } from "@/lib/hybrid-database"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

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
      toast({
        title: "Error",
        description: "No se pudieron cargar las tareas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, toast])

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

      await loadTasks()

      toast({
        title: "✅ Tarea creada",
        description: "La tarea se ha guardado correctamente",
      })

      setShowTaskForm(false)
    } catch (error) {
      console.error("❌ Error creating task:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la tarea",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      console.log("✏️ Updating task:", taskId, updates)
      const updatedTask = await hybridDb.updateTask(taskId, updates)
      console.log("✅ Task updated")

      await loadTasks()

      toast({
        title: "✅ Tarea actualizada",
        description: "Los cambios se han guardado correctamente",
      })

      setEditingTask(null)
      setShowTaskForm(false)
    } catch (error) {
      console.error("❌ Error updating task:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la tarea",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      console.log("🗑️ Deleting task:", taskId)
      await hybridDb.deleteTask(taskId)
      console.log("✅ Task deleted")

      await loadTasks()

      toast({
        title: "✅ Tarea eliminada",
        description: "La tarea se ha eliminado correctamente",
      })

      setEditingTask(null)
      setShowTaskForm(false)
    } catch (error) {
      console.error("❌ Error deleting task:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la tarea",
        variant: "destructive",
      })
    }
  }

  const handleTaskClick = (task: Task) => {
    console.log("👆 Task clicked:", task.id)
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleNewTask = () => {
    console.log("➕ Creating new task for date:", selectedDate)
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
      <CalendarWidget
        tasks={tasks}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        onTaskClick={handleTaskClick}
        onNewTask={handleNewTask}
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
