"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Plus, Trash2, Edit, Loader2, Calendar, Sparkles } from "lucide-react"
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
          due_date: new Date(Date.now() + 86400000).toISOString(),
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
        {
          id: "3",
          title: "Revisar documentación",
          description: "Actualizar docs del proyecto",
          priority: "low",
          status: "completed",
          category: "desarrollo",
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

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error("Error loading tasks:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las tareas",
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
        toast({ title: "✅ Tarea actualizada", description: "Los cambios se guardaron correctamente" })
      } else {
        const { error } = await supabase.from("tasks").insert([{ ...taskData, user_id: userId }])
        if (error) throw error
        toast({ title: "✅ Tarea creada", description: "La tarea se agregó correctamente" })
      }
      await loadTasks()
      setShowForm(false)
      setEditingTask(null)
    } catch (error) {
      console.error("Error saving task:", error)
      toast({ title: "Error", description: "No se pudo guardar la tarea", variant: "destructive" })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (isDemo) {
      setTasks(tasks.filter((t) => t.id !== taskId))
      toast({ title: "✅ Tarea eliminada", description: "La tarea se eliminó correctamente" })
      return
    }

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("user_id", userId)
      if (error) throw error
      toast({ title: "✅ Tarea eliminada", description: "La tarea se eliminó correctamente" })
      await loadTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({ title: "Error", description: "No se pudo eliminar la tarea", variant: "destructive" })
    }
  }

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed"
    if (isDemo) {
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)))
      return
    }

    try {
      const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", task.id)
      if (error) throw error
      await loadTasks()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
      case "medium":
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
      case "low":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
      default:
        return "bg-gray-200 text-gray-800"
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
    <div className="space-y-6 animate-fade-in">
      <Card className="premium-card glass-card border-0 shadow-2xl">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl gradient-text">Mis Tareas</span>
            </CardTitle>
            <Button onClick={() => setShowForm(true)} size="lg" className="btn-gradient gap-2 shadow-lg">
              <Plus className="h-5 w-5" />
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
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-6 animate-float">
                <Sparkles className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No tienes tareas pendientes</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">¡Perfecto momento para agregar una nueva tarea!</p>
              <Button onClick={() => setShowForm(true)} className="btn-gradient gap-2">
                <Plus className="h-4 w-4" />
                Crear primera tarea
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="group premium-card card-hover glass-card p-5 rounded-xl border-0"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={() => handleToggleStatus(task)}
                        className="h-6 w-6 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4
                          className={`font-bold text-lg ${
                            task.status === "completed"
                              ? "line-through opacity-60 text-gray-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {task.title}
                        </h4>
                        <Badge className={`${getPriorityColor(task.priority)} font-semibold px-3 py-1`}>
                          {task.priority === "high" ? "🔥 Alta" : task.priority === "medium" ? "⚡ Media" : "✅ Baja"}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        {task.due_date && (
                          <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString("es-ES")}
                          </span>
                        )}
                        {task.category && (
                          <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full font-medium">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingTask(task)
                          setShowForm(true)
                        }}
                        className="h-10 w-10 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                        className="h-10 w-10 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
