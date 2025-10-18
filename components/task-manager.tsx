"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Plus, Trash2, Edit, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { TaskForm } from "./task-form"

interface Task {
  id: string
  title: string
  description?: string
  due_date?: string
  priority: string
  status: string
  category?: string
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
        },
        {
          id: "2",
          title: "Llamar al cliente",
          priority: "medium",
          status: "pending",
          category: "trabajo",
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
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error("Error loading tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (isDemo) {
      if (editingTask) {
        setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t)))
      } else {
        setTasks([...tasks, { id: Date.now().toString(), ...taskData } as Task])
      }
      setShowForm(false)
      setEditingTask(null)
      return
    }

    try {
      if (editingTask) {
        const { error } = await supabase.from("tasks").update(taskData).eq("id", editingTask.id).eq("user_id", userId)

        if (error) throw error
      } else {
        const { error } = await supabase.from("tasks").insert([{ ...taskData, user_id: userId }])

        if (error) throw error
      }

      await loadTasks()
      setShowForm(false)
      setEditingTask(null)
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (isDemo) {
      setTasks(tasks.filter((t) => t.id !== taskId))
      return
    }

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("user_id", userId)

      if (error) throw error
      await loadTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
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
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <CheckSquare className="h-5 w-5" />
            Mis Tareas
          </CardTitle>
          <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <p>No tienes tareas. ¡Crea una para empezar!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => handleToggleStatus(task)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <h4
                      className={`font-medium text-gray-900 dark:text-white ${
                        task.status === "completed" ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </h4>
                    {task.description && <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>}
                  </div>
                  <Badge
                    variant={
                      task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                    }
                  >
                    {task.priority}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingTask(task)
                        setShowForm(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
