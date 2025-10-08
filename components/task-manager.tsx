"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Calendar, Filter, Search } from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { useLanguage } from "@/hooks/useLanguage"

interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "done"
  dueDate?: string
  category?: string
  completed: boolean
  createdAt: string
}

interface TaskManagerProps {
  tasks?: Task[]
  onTasksChange?: (tasks: Task[]) => void
}

export function TaskManager({ tasks: propTasks, onTasksChange }: TaskManagerProps) {
  const { user } = useUser()
  const { t } = useLanguage()
  const [tasks, setTasks] = useState<Task[]>(propTasks || [])
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useState<"all" | "todo" | "in-progress" | "done">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(!propTasks)

  // Load tasks if not provided as prop
  useEffect(() => {
    if (!propTasks && user?.id) {
      loadTasks()
    }
  }, [user?.id, propTasks])

  const loadTasks = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const response = await fetch(`/api/tasks?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error("Error loading tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTask.trim() || !user?.id) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      priority: "medium",
      status: "todo",
      completed: false,
      createdAt: new Date().toISOString(),
    }

    const updatedTasks = [...tasks, task]
    setTasks(updatedTasks)
    setNewTask("")

    if (onTasksChange) {
      onTasksChange(updatedTasks)
    }

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, task }),
      })
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  const toggleTask = async (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed: !task.completed,
            status: !task.completed ? "done" : "todo",
          }
        : task,
    )

    setTasks(updatedTasks)

    if (onTasksChange) {
      onTasksChange(updatedTasks)
    }

    try {
      const task = updatedTasks.find((t) => t.id === taskId)
      if (task && user?.id) {
        await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, task }),
        })
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)

    if (onTasksChange) {
      onTasksChange(updatedTasks)
    }

    try {
      if (user?.id) {
        await fetch("/api/tasks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, taskId }),
        })
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Cargando tareas...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Calendar className="w-5 h-5 text-purple-400" />
          {t("tasks.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar tareas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400"
            />
          </div>
          <Button variant="outline" size="icon" className="border-purple-500/30 hover:bg-purple-500/10 bg-transparent">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Add Task */}
        <div className="flex gap-2">
          <Input
            placeholder="Nueva tarea..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400"
          />
          <Button
            onClick={addTask}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Tasks Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="todo">Pendientes</TabsTrigger>
            <TabsTrigger value="in-progress">En Progreso</TabsTrigger>
            <TabsTrigger value="done">Completadas</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-2 mt-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchQuery ? "No se encontraron tareas" : "No hay tareas"}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="border-purple-500/50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-white ${task.completed ? "line-through opacity-50" : ""}`}>
                      {task.title}
                    </div>
                    {task.description && <div className="text-sm text-gray-400 truncate">{task.description}</div>}
                  </div>
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-purple-500/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{tasks.filter((t) => t.status === "todo").length}</div>
            <div className="text-xs text-gray-400">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {tasks.filter((t) => t.status === "in-progress").length}
            </div>
            <div className="text-xs text-gray-400">En Progreso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{tasks.filter((t) => t.status === "done").length}</div>
            <div className="text-xs text-gray-400">Completadas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
