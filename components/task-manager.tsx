"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Calendar, Clock, Flag } from "lucide-react"

interface Task {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
  date: string
  time?: string
  category: string
}

interface TaskManagerProps {
  theme: any
  t: (key: string) => string
}

export function TaskManager({ theme, t }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      text: "Revisar emails matutinos",
      completed: true,
      priority: "medium",
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      category: "trabajo",
    },
    {
      id: "2",
      text: "Reunión de equipo semanal",
      completed: false,
      priority: "high",
      date: new Date().toISOString().split("T")[0],
      time: "10:30",
      category: "trabajo",
    },
    {
      id: "3",
      text: "Hacer ejercicio",
      completed: false,
      priority: "medium",
      date: new Date().toISOString().split("T")[0],
      time: "18:00",
      category: "personal",
    },
    {
      id: "4",
      text: "Preparar presentación",
      completed: false,
      priority: "high",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      time: "14:00",
      category: "trabajo",
    },
  ])

  const [newTask, setNewTask] = useState({
    text: "",
    priority: "medium" as "low" | "medium" | "high",
    date: new Date().toISOString().split("T")[0],
    time: "",
    category: "personal",
  })

  const [filter, setFilter] = useState<"all" | "today" | "pending" | "completed">("all")

  const addTask = () => {
    if (!newTask.text.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.text,
      completed: false,
      priority: newTask.priority,
      date: newTask.date,
      time: newTask.time || undefined,
      category: newTask.category,
    }

    setTasks([...tasks, task])
    setNewTask({
      text: "",
      priority: "medium",
      date: new Date().toISOString().split("T")[0],
      time: "",
      category: "personal",
    })
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const getFilteredTasks = () => {
    const today = new Date().toISOString().split("T")[0]

    switch (filter) {
      case "today":
        return tasks.filter((task) => task.date === today)
      case "pending":
        return tasks.filter((task) => !task.completed)
      case "completed":
        return tasks.filter((task) => task.completed)
      default:
        return tasks
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "trabajo":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "personal":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "salud":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Formulario para nueva tarea */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
            <Plus className="h-5 w-5 text-purple-400" />
            Agregar Nueva Tarea
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-text" className={theme.textSecondary}>
                Descripción de la tarea
              </Label>
              <Input
                id="task-text"
                value={newTask.text}
                onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                placeholder="¿Qué necesitas hacer?"
                className={theme.inputBg}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-priority" className={theme.textSecondary}>
                Prioridad
              </Label>
              <Select
                value={newTask.priority}
                onValueChange={(value: "low" | "medium" | "high") => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger className={theme.inputBg}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-date" className={theme.textSecondary}>
                Fecha
              </Label>
              <Input
                id="task-date"
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                className={theme.inputBg}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-time" className={theme.textSecondary}>
                Hora (opcional)
              </Label>
              <Input
                id="task-time"
                type="time"
                value={newTask.time}
                onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                className={theme.inputBg}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-category" className={theme.textSecondary}>
                Categoría
              </Label>
              <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                <SelectTrigger className={theme.inputBg}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="trabajo">Trabajo</SelectItem>
                  <SelectItem value="salud">Salud</SelectItem>
                  <SelectItem value="estudio">Estudio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={addTask} className={`${theme.buttonPrimary} w-full md:w-auto`}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Tarea
          </Button>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Todas" },
              { key: "today", label: "Hoy" },
              { key: "pending", label: "Pendientes" },
              { key: "completed", label: "Completadas" },
            ].map((filterOption) => (
              <Button
                key={filterOption.key}
                variant={filter === filterOption.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption.key as any)}
                className={filter === filterOption.key ? theme.buttonPrimary : theme.buttonSecondary}
              >
                {filterOption.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de tareas */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
            <Calendar className="h-5 w-5 text-purple-400" />
            Mis Tareas ({getFilteredTasks().length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getFilteredTasks().length === 0 ? (
            <div className="text-center py-8">
              <p className={theme.textMuted}>No hay tareas para mostrar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getFilteredTasks().map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    task.completed
                      ? "bg-green-500/5 border-green-500/20"
                      : "bg-slate-800/50 border-slate-700 hover:border-purple-500/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-1" />

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p
                          className={`font-medium ${
                            task.completed ? `line-through ${theme.textMuted}` : theme.textPrimary
                          }`}
                        >
                          {task.text}
                        </p>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          <Flag className="h-3 w-3 mr-1" />
                          {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                        </Badge>

                        <Badge className={getCategoryColor(task.category)}>{task.category}</Badge>

                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.date).toLocaleDateString("es-ES")}
                        </div>

                        {task.time && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="h-3 w-3" />
                            {task.time}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-400">{tasks.length}</div>
            <div className="text-sm text-slate-400">Total</div>
          </CardContent>
        </Card>

        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-400">{tasks.filter((t) => t.completed).length}</div>
            <div className="text-sm text-slate-400">Completadas</div>
          </CardContent>
        </Card>

        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-yellow-400">{tasks.filter((t) => !t.completed).length}</div>
            <div className="text-sm text-slate-400">Pendientes</div>
          </CardContent>
        </Card>

        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0}%
            </div>
            <div className="text-sm text-slate-400">Progreso</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
