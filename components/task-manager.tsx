"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Calendar, Tag, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/hooks/useLanguage"

interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  priority: "low" | "medium" | "high"
  due_date: string | null
  category: string | null
  tags: string[] | null
  created_at: string
}

interface TaskManagerProps {
  userId: string | undefined
  isDemo?: boolean
}

export function TaskManager({ userId, isDemo = false }: TaskManagerProps) {
  const { t, isLoading: langLoading } = useLanguage()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    due_date: "",
    category: "",
    tags: "",
  })
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  useEffect(() => {
    if (langLoading) return
    if (userId) {
      loadTasks()
    }
  }, [userId, langLoading])

  const loadTasks = async () => {
    try {
      setLoading(true)

      if (isDemo) {
        const demoTasks: Task[] = [
          {
            id: "1",
            title: t("tasks.demoTask1") || "Completar presentación",
            description: t("tasks.demoTask1Desc") || "Preparar slides para la reunión del lunes",
            completed: false,
            priority: "high",
            due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            category: t("tasks.work") || "Trabajo",
            tags: ["importante", "urgente"],
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: t("tasks.demoTask2") || "Revisar correos",
            description: null,
            completed: true,
            priority: "medium",
            due_date: null,
            category: t("tasks.work") || "Trabajo",
            tags: ["rutina"],
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "3",
            title: t("tasks.demoTask3") || "Comprar víveres",
            description: t("tasks.demoTask3Desc") || "Leche, pan, frutas y verduras",
            completed: false,
            priority: "low",
            due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            category: t("tasks.personal") || "Personal",
            tags: ["compras"],
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
        ]
        setTasks(demoTasks)
        setLoading(false)
        return
      }

      const response = await fetch("/api/tasks")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }

      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error("Error loading tasks:", error)
      toast({
        title: t("tasks.errorLoading") || "Error al cargar tareas",
        description: t("tasks.errorLoadingDesc") || "No se pudieron cargar las tareas. Intenta de nuevo.",
        variant: "destructive",
      })
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: t("tasks.errorTitle") || "Error",
        description: t("tasks.titleRequired") || "El título es requerido",
        variant: "destructive",
      })
      return
    }

    try {
      if (isDemo) {
        const demoTask: Task = {
          id: Date.now().toString(),
          title: newTask.title,
          description: newTask.description || null,
          completed: false,
          priority: newTask.priority,
          due_date: newTask.due_date || null,
          category: newTask.category || null,
          tags: newTask.tags ? newTask.tags.split(",").map((t) => t.trim()) : null,
          created_at: new Date().toISOString(),
        }
        setTasks([demoTask, ...tasks])
        setNewTask({
          title: "",
          description: "",
          priority: "medium",
          due_date: "",
          category: "",
          tags: "",
        })
        toast({
          title: t("tasks.taskAdded") || "Tarea agregada",
          description: t("tasks.taskAddedDesc") || "La tarea se ha agregado correctamente",
        })
        return
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description || null,
          priority: newTask.priority,
          due_date: newTask.due_date || null,
          category: newTask.category || null,
          tags: newTask.tags ? newTask.tags.split(",").map((t) => t.trim()) : [],
        }),
      })

      if (!response.ok) throw new Error("Failed to add task")

      const data = await response.json()
      setTasks([data.task, ...tasks])
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        category: "",
        tags: "",
      })

      toast({
        title: t("tasks.taskAdded") || "Tarea agregada",
        description: t("tasks.taskAddedDesc") || "La tarea se ha agregado correctamente",
      })
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: t("tasks.error") || "Error",
        description: t("tasks.errorAddingTask") || "No se pudo agregar la tarea",
        variant: "destructive",
      })
    }
  }

  const toggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      if (isDemo) {
        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)))
        return
      }

      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          completed: !task.completed,
        }),
      })

      if (!response.ok) throw new Error("Failed to update task")

      const data = await response.json()
      setTasks(tasks.map((t) => (t.id === taskId ? data.task : t)))
    } catch (error) {
      console.error("Error toggling task:", error)
      toast({
        title: t("tasks.error") || "Error",
        description: t("tasks.errorUpdatingTask") || "No se pudo actualizar la tarea",
        variant: "destructive",
      })
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      if (isDemo) {
        setTasks(tasks.filter((t) => t.id !== taskId))
        toast({
          title: t("tasks.taskDeleted") || "Tarea eliminada",
          description: t("tasks.taskDeletedDesc") || "La tarea se ha eliminado correctamente",
        })
        return
      }

      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete task")

      setTasks(tasks.filter((t) => t.id !== taskId))
      toast({
        title: t("tasks.taskDeleted") || "Tarea eliminada",
        description: t("tasks.taskDeletedDesc") || "La tarea se ha eliminado correctamente",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: t("tasks.error") || "Error",
        description: t("tasks.errorDeletingTask") || "No se pudo eliminar la tarea",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  if (langLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t("tasks.addNewTask") || "Agregar Nueva Tarea"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder={t("tasks.taskTitle") || "Título de la tarea"}
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                addTask()
              }
            }}
          />
          <Textarea
            placeholder={t("tasks.taskDescription") || "Descripción (opcional)"}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={newTask.priority}
              onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("tasks.priority") || "Prioridad"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t("tasks.low") || "Baja"}</SelectItem>
                <SelectItem value="medium">{t("tasks.medium") || "Media"}</SelectItem>
                <SelectItem value="high">{t("tasks.high") || "Alta"}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              className="dark:bg-gray-800"
            />
            <Input
              placeholder={t("tasks.category") || "Categoría"}
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            />
          </div>
          <Input
            placeholder={t("tasks.tags") || "Etiquetas (separadas por coma)"}
            value={newTask.tags}
            onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
          />
          <Button onClick={addTask} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {t("tasks.addTask") || "Agregar Tarea"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("tasks.myTasks") || "Mis Tareas"}</CardTitle>
            <div className="flex gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                {t("tasks.all") || "Todas"}
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
              >
                {t("tasks.active") || "Activas"}
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
              >
                {t("tasks.completed") || "Completadas"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <p>{t("tasks.noTasks") || "No hay tareas"}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                >
                  <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-medium ${
                        task.completed ? "line-through text-gray-500" : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority === "high"
                          ? t("tasks.high") || "Alta"
                          : task.priority === "medium"
                            ? t("tasks.medium") || "Media"
                            : t("tasks.low") || "Baja"}
                      </Badge>
                      {task.category && <Badge variant="outline">{task.category}</Badge>}
                      {task.due_date && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.due_date).toLocaleDateString()}
                        </Badge>
                      )}
                      {task.tags &&
                        task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
