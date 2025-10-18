"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Plus, Trash2, Edit, Loader2, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { TaskForm } from "./task-form"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description?: string
  due_date?: string
  priority: string
  status: string
  category?: string
  user_id: string
  created_at?: string
}

interface TaskManagerProps {
  userId: string
  isDemo?: boolean
}

export function TaskManager({ userId, isDemo }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isDemo) {
      const demoTasks: Task[] = [
        {
          id: "1",
          title: "Completar informe mensual",
          description: "Revisar y completar el informe de productividad",
          priority: "high",
          status: "pending",
          category: "trabajo",
          user_id: userId,
        },
        {
          id: "2",
          title: "Llamar al cliente",
          description: "Seguimiento del proyecto actual",
          priority: "medium",
          status: "pending",
          category: "trabajo",
          user_id: userId,
        },
      ]
      setTasks(demoTasks)
      setLoading(false)
      return
    }

    loadTasks()
  }, [userId, isDemo])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading tasks:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las tareas",
          variant: "destructive",
        })
        return
      }

      setTasks(data || [])
    } catch (error) {
      console.error("Error loading tasks:", error)
      toast({
        title: "Error",
        description: "Error inesperado al cargar las tareas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (isDemo) {
      if (editingTask) {
        setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t)))
      } else {
        const newTask: Task = {
          id: Date.now().toString(),
          title: taskData.title || "",
          description: taskData.description,
          due_date: taskData.due_date,
          priority: taskData.priority || "medium",
          status: taskData.status || "pending",
          category: taskData.category,
          user_id: userId,
          created_at: new Date().toISOString(),
        }
        setTasks([newTask, ...tasks])
      }
      setShowForm(false)
      setEditingTask(null)
      toast({
        title: "✅ Éxito",
        description: editingTask ? "Tarea actualizada" : "Tarea creada correctamente",
      })
      return
    }

    try {
      if (editingTask) {
        const { error } = await supabase.from("tasks").update(taskData).eq("id", editingTask.id).eq("user_id", userId)

        if (error) throw error

        toast({
          title: "✅ Tarea actualizada",
          description: "Los cambios se guardaron correctamente",
        })
      } else {
        const { data, error } = await supabase
          .from("tasks")
          .insert([
            {
              ...taskData,
              user_id: userId,
              created_at: new Date().toISOString(),
            },
          ])
          .select()

        if (error) throw error

        toast({
          title: "✅ Tarea creada",
          description: "La tarea se agregó correctamente",
        })
      }

      await loadTasks()
      setShowForm(false)
      setEditingTask(null)
    } catch (error) {
      console.error("Error saving task:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la tarea",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (isDemo) {
      setTasks(tasks.filter((t) => t.id !== taskId))
      toast({
        title: "✅ Tarea eliminada",
        description: "La tarea se eliminó correctamente",
      })
      return
    }

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("user_id", userId)

      if (error) throw error

      toast({
        title: "✅ Tarea eliminada",
        description: "La tarea se eliminó correctamente",
      })

      await loadTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la tarea",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed"

    if (isDemo) {
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)))
      return
    }

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", task.id)
        .eq("user_id", userId)

      if (error) throw error
      await loadTasks()
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la tarea",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  if (showForm) {
    return (
      <TaskForm
        task={editingTask}
        onSave={handleSaveTask}
        onCancel={() => {
          setShowForm(false)
          setEditingTask(null)
        }}
      />
    )
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Mis Tareas
          </CardTitle>
          <Button
            onClick={() => setShowForm(true)}
            size="sm"
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <CheckSquare className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No tienes tareas pendientes</p>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="border-gray-300 dark:border-gray-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear primera tarea
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => handleToggleStatus(task)}
                    className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4
                      className={`font-semibold text-base text-gray-900 dark:text-white ${
                        task.status === "completed" ? "line-through opacity-60" : ""
                      }`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                      </Badge>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{task.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    {task.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.due_date).toLocaleDateString("es-ES")}
                      </span>
                    )}
                    {task.category && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">{task.category}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingTask(task)
                      setShowForm(true)
                    }}
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
