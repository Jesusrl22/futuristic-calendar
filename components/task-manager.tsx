"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckSquare, Plus, Calendar, Clock, AlertCircle, Trash2, Edit } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  completed: boolean
  dueDate?: string
  createdAt: string
}

interface TaskManagerProps {
  theme: {
    cardBg: string
    border: string
    textPrimary: string
    textSecondary: string
    textMuted: string
    buttonPrimary: string
    buttonSecondary: string
    inputBg: string
  }
  t: (key: string) => string
}

export function TaskManager({ theme, t }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Revisar emails matutinos",
      description: "Responder emails importantes y organizar bandeja de entrada",
      priority: "high",
      completed: true,
      dueDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Reunión de equipo",
      description: "Discutir progreso del proyecto y próximos pasos",
      priority: "high",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Actualizar documentación",
      description: "Revisar y actualizar la documentación del proyecto",
      priority: "medium",
      completed: false,
      dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Planificar fin de semana",
      description: "Organizar actividades para el fin de semana",
      priority: "low",
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  })

  const handleAddTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      completed: false,
      dueDate: newTask.dueDate || undefined,
      createdAt: new Date().toISOString(),
    }

    setTasks([task, ...tasks])
    setNewTask({ title: "", description: "", priority: "medium", dueDate: "" })
    setShowAddForm(false)
  }

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || "",
    })
    setShowAddForm(true)
  }

  const handleUpdateTask = () => {
    if (!editingTask || !newTask.title.trim()) return

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: newTask.title,
              description: newTask.description,
              priority: newTask.priority,
              dueDate: newTask.dueDate || undefined,
            }
          : task,
      ),
    )

    setEditingTask(null)
    setNewTask({ title: "", description: "", priority: "medium", dueDate: "" })
    setShowAddForm(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-600"
      case "medium":
        return "bg-yellow-600"
      case "low":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Media"
      case "low":
        return "Baja"
      default:
        return "Media"
    }
  }

  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-400">{completedTasks.length}</div>
                <div className="text-sm text-slate-400">Completadas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-yellow-400">{pendingTasks.length}</div>
                <div className="text-sm text-slate-400">Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {pendingTasks.filter((task) => task.priority === "high").length}
                </div>
                <div className="text-sm text-slate-400">Alta prioridad</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botón agregar tarea */}
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>Gestión de Tareas</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} className={theme.buttonPrimary}>
          <Plus className="h-4 w-4 mr-2" />
          {showAddForm ? "Cancelar" : "Nueva Tarea"}
        </Button>
      </div>

      {/* Formulario agregar/editar tarea */}
      {showAddForm && (
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardHeader>
            <CardTitle className={theme.textPrimary}>{editingTask ? "Editar Tarea" : "Nueva Tarea"}</CardTitle>
            <CardDescription className={theme.textSecondary}>
              {editingTask ? "Modifica los detalles de la tarea" : "Agrega una nueva tarea a tu lista"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className={theme.textPrimary}>
                Título
              </Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Título de la tarea"
                className={theme.inputBg}
              />
            </div>

            <div>
              <Label htmlFor="description" className={theme.textPrimary}>
                Descripción
              </Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Descripción detallada de la tarea"
                className={theme.inputBg}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority" className={theme.textPrimary}>
                  Prioridad
                </Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: "low" | "medium" | "high") => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger className={theme.inputBg}>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dueDate" className={theme.textPrimary}>
                  Fecha límite
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className={theme.inputBg}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={editingTask ? handleUpdateTask : handleAddTask} className={theme.buttonPrimary}>
                {editingTask ? "Actualizar" : "Agregar"} Tarea
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingTask(null)
                  setNewTask({ title: "", description: "", priority: "medium", dueDate: "" })
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de tareas */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <Card className={`${theme.cardBg} ${theme.border}`}>
            <CardContent className="p-8 text-center">
              <CheckSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>No hay tareas</h3>
              <p className={theme.textSecondary}>Agrega tu primera tarea para comenzar a organizarte</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card
              key={task.id}
              className={`${theme.cardBg} ${theme.border} transition-all duration-200 hover:shadow-lg`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${task.completed ? "line-through text-slate-400" : theme.textPrimary}`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p
                            className={`text-sm mt-1 ${task.completed ? "line-through text-slate-500" : theme.textSecondary}`}
                          >
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-3">
                          <Badge variant="secondary" className={`${getPriorityColor(task.priority)} text-white`}>
                            {getPriorityText(task.priority)}
                          </Badge>

                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-sm text-slate-400">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString("es-ES")}
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Clock className="h-3 w-3" />
                            {new Date(task.createdAt).toLocaleDateString("es-ES")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
