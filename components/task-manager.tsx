"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Calendar, Clock, CheckCircle2 } from "lucide-react"

interface Task {
  id: string
  text: string
  description?: string
  completed: boolean
  date: string
  time?: string
  category: string
  priority: "low" | "medium" | "high"
  notification_enabled?: boolean
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
      text: "Completar proyecto de calendario",
      description: "Finalizar todas las funcionalidades del calendario futurista",
      completed: false,
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      category: "work",
      priority: "high",
      notification_enabled: true,
    },
    {
      id: "2",
      text: "Revisar documentación",
      completed: true,
      date: new Date().toISOString().split("T")[0],
      category: "work",
      priority: "medium",
    },
    {
      id: "3",
      text: "Llamar al dentista",
      completed: false,
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      time: "14:00",
      category: "personal",
      priority: "low",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState("all")
  const [newTask, setNewTask] = useState({
    text: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    category: "personal",
    priority: "medium" as "low" | "medium" | "high",
    notification_enabled: false,
  })

  const handleCreateTask = () => {
    if (!newTask.text.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.text,
      description: newTask.description,
      completed: false,
      date: newTask.date,
      time: newTask.time,
      category: newTask.category,
      priority: newTask.priority,
      notification_enabled: newTask.notification_enabled,
    }

    setTasks([...tasks, task])
    setNewTask({
      text: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      time: "",
      category: "personal",
      priority: "medium",
      notification_enabled: false,
    })
    setShowForm(false)
  }

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const filteredTasks = tasks.filter((task) => {
    const today = new Date().toISOString().split("T")[0]
    switch (filter) {
      case "today":
        return task.date === today
      case "pending":
        return !task.completed
      case "completed":
        return task.completed
      default:
        return true
    }
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "personal":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "health":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "education":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "low":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    today: tasks.filter((t) => t.date === new Date().toISOString().split("T")[0]).length,
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.total}</div>
            <div className="text-sm text-slate-400">Total</div>
          </CardContent>
        </Card>
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
            <div className="text-sm text-slate-400">Completadas</div>
          </CardContent>
        </Card>
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-slate-400">Pendientes</div>
          </CardContent>
        </Card>
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.today}</div>
            <div className="text-sm text-slate-400">Hoy</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Gestión de Tareas
            </CardTitle>
            <Button onClick={() => setShowForm(!showForm)} className={theme.buttonPrimary}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? theme.buttonPrimary : theme.buttonSecondary}
            >
              Todas ({stats.total})
            </Button>
            <Button
              variant={filter === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("today")}
              className={filter === "today" ? theme.buttonPrimary : theme.buttonSecondary}
            >
              Hoy ({stats.today})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
              className={filter === "pending" ? theme.buttonPrimary : theme.buttonSecondary}
            >
              Pendientes ({stats.pending})
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
              className={filter === "completed" ? theme.buttonPrimary : theme.buttonSecondary}
            >
              Completadas ({stats.completed})
            </Button>
          </div>

          {/* Formulario de nueva tarea */}
          {showForm && (
            <Card className="mb-6 bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-white">Nueva Tarea</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="task-text" className="text-white">
                    Título *
                  </Label>
                  <Input
                    id="task-text"
                    value={newTask.text}
                    onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                    placeholder="¿Qué necesitas hacer?"
                    className={theme.inputBg}
                  />
                </div>

                <div>
                  <Label htmlFor="task-description" className="text-white">
                    Descripción
                  </Label>
                  <Textarea
                    id="task-description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Detalles adicionales..."
                    className={theme.inputBg}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="task-date" className="text-white">
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
                  <div>
                    <Label htmlFor="task-time" className="text-white">
                      Hora
                    </Label>
                    <Input
                      id="task-time"
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                      className={theme.inputBg}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Categoría</Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                    >
                      <SelectTrigger className={theme.inputBg}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="work">Trabajo</SelectItem>
                        <SelectItem value="health">Salud</SelectItem>
                        <SelectItem value="education">Educación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Prioridad</Label>
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
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifications"
                    checked={newTask.notification_enabled}
                    onCheckedChange={(checked) => setNewTask({ ...newTask, notification_enabled: !!checked })}
                  />
                  <Label htmlFor="notifications" className="text-white">
                    Habilitar notificaciones
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateTask} className={theme.buttonPrimary}>
                    Crear Tarea
                  </Button>
                  <Button onClick={() => setShowForm(false)} variant="outline" className={theme.buttonSecondary}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de tareas */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay tareas para mostrar</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id} className={`${theme.cardBg} ${theme.border} ${task.completed ? "opacity-75" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3
                            className={`font-medium ${task.completed ? "line-through text-slate-400" : theme.textPrimary}`}
                          >
                            {task.text}
                          </h3>
                          <Button
                            onClick={() => handleDeleteTask(task.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {task.description && (
                          <p
                            className={`text-sm mb-2 ${task.completed ? "line-through text-slate-500" : theme.textSecondary}`}
                          >
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getCategoryColor(task.category)}>
                            {task.category === "work" && "Trabajo"}
                            {task.category === "personal" && "Personal"}
                            {task.category === "health" && "Salud"}
                            {task.category === "education" && "Educación"}
                          </Badge>

                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === "high" && "Alta"}
                            {task.priority === "medium" && "Media"}
                            {task.priority === "low" && "Baja"}
                          </Badge>

                          <div className="flex items-center text-xs text-slate-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(task.date).toLocaleDateString("es-ES")}
                          </div>

                          {task.time && (
                            <div className="flex items-center text-xs text-slate-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.time}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
