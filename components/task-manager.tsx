"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, Plus, Check, Trash2, Edit, Clock, AlertCircle } from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed"
  due_date?: string
  created_at: string
  updated_at: string
}

interface TaskManagerProps {
  theme: any
  t: (key: string) => string
}

export function TaskManager({ theme, t }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Revisar emails",
      description: "Responder emails importantes del día",
      priority: "medium",
      status: "completed",
      due_date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Reunión de equipo",
      description: "Reunión semanal con el equipo de desarrollo",
      priority: "high",
      status: "pending",
      due_date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Actualizar documentación",
      description: "Actualizar la documentación del proyecto",
      priority: "low",
      status: "in_progress",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ])

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    due_date: "",
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    due_date: "",
  })

  const handleAddTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      status: "pending",
      due_date: newTask.due_date || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setTasks((prev) => [...prev, task])
    setNewTask({ title: "", description: "", priority: "medium", due_date: "" })
    setShowAddForm(false)
  }

  const handleUpdateTaskStatus = (id: string, status: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status, updated_at: new Date().toISOString() } : task)),
    )
  }

  const handleEditTask = (task: Task) => {
    setEditingId(task.id)
    setEditingTask({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      due_date: task.due_date || "",
    })
  }

  const handleSaveEdit = () => {
    if (!editingId || !editingTask.title.trim()) return

    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingId
          ? {
              ...task,
              title: editingTask.title.trim(),
              description: editingTask.description.trim(),
              priority: editingTask.priority,
              due_date: editingTask.due_date || undefined,
              updated_at: new Date().toISOString(),
            }
          : task,
      ),
    )

    setEditingId(null)
    setEditingTask({ title: "", description: "", priority: "medium", due_date: "" })
  }

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "pending":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const isOverdue = (due_date?: string) => {
    if (!due_date) return false
    return new Date(due_date) < new Date()
  }

  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const totalTasks = tasks.length
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{totalTasks}</div>
            <div className="text-sm text-slate-400">Total Tareas</div>
          </CardContent>
        </Card>
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
            <div className="text-sm text-slate-400">Completadas</div>
          </CardContent>
        </Card>
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {tasks.filter((t) => t.status === "in_progress").length}
            </div>
            <div className="text-sm text-slate-400">En Progreso</div>
          </CardContent>
        </Card>
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{Math.round(completionPercentage)}%</div>
            <div className="text-sm text-slate-400">Completado</div>
          </CardContent>
        </Card>
      </div>

      {/* Task Manager */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
                <CheckSquare className="h-5 w-5 text-blue-400" />
                Gestor de Tareas
              </CardTitle>
              <CardDescription className={theme.textSecondary}>Organiza y gestiona tus tareas diarias</CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} className={theme.buttonPrimary} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Task Form */}
          {showAddForm && (
            <Card className="bg-slate-900/50 border-slate-600">
              <CardContent className="p-4 space-y-4">
                <Input
                  placeholder="Título de la tarea"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className={theme.inputBg}
                />
                <Textarea
                  placeholder="Descripción (opcional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className={theme.inputBg}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: Task["priority"]) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger className={theme.inputBg}>
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className={theme.inputBg}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddTask} className={theme.buttonPrimary} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddForm(false)
                      setNewTask({ title: "", description: "", priority: "medium", due_date: "" })
                    }}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Task List */}
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-blue-400 mx-auto mb-4 opacity-50" />
                <p className={theme.textSecondary}>No tienes tareas creadas</p>
                <p className="text-sm text-slate-500 mt-2">Agrega tu primera tarea para comenzar a organizarte</p>
              </div>
            ) : (
              tasks.map((task) => (
                <Card
                  key={task.id}
                  className={`
                    transition-all duration-200 hover:scale-[1.02]
                    ${
                      task.status === "completed"
                        ? "bg-green-500/10 border-green-500/30 shadow-lg shadow-green-500/10"
                        : isOverdue(task.due_date)
                          ? "bg-red-500/10 border-red-500/30"
                          : "bg-slate-800/50 border-slate-600 hover:border-slate-500"
                    }
                  `}
                >
                  <CardContent className="p-4">
                    {editingId === task.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editingTask.title}
                          onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                          className={theme.inputBg}
                        />
                        <Textarea
                          value={editingTask.description}
                          onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                          className={theme.inputBg}
                          rows={2}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Select
                            value={editingTask.priority}
                            onValueChange={(value: Task["priority"]) =>
                              setEditingTask({ ...editingTask, priority: value })
                            }
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
                          <Input
                            type="date"
                            value={editingTask.due_date}
                            onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                            className={theme.inputBg}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveEdit} size="sm" className={theme.buttonPrimary}>
                            Guardar
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingId(null)
                              setEditingTask({ title: "", description: "", priority: "medium", due_date: "" })
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() =>
                              handleUpdateTaskStatus(task.id, task.status === "completed" ? "pending" : "completed")
                            }
                            className={`
                              mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
                              transition-all duration-200
                              ${
                                task.status === "completed"
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-slate-400 hover:border-green-400"
                              }
                            `}
                          >
                            {task.status === "completed" && <Check className="h-3 w-3" />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className={`
                                font-medium transition-all duration-200
                                ${task.status === "completed" ? "line-through text-slate-400" : theme.textPrimary}
                              `}
                              >
                                {task.title}
                              </h3>
                              {isOverdue(task.due_date) && task.status !== "completed" && (
                                <AlertCircle className="h-4 w-4 text-red-400" />
                              )}
                            </div>
                            {task.description && (
                              <p
                                className={`
                                text-sm mt-1 transition-all duration-200
                                ${task.status === "completed" ? "line-through text-slate-500" : theme.textSecondary}
                              `}
                              >
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                                {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                              </Badge>
                              <Badge variant="secondary" className={getStatusColor(task.status)}>
                                {task.status === "completed"
                                  ? "Completada"
                                  : task.status === "in_progress"
                                    ? "En progreso"
                                    : "Pendiente"}
                              </Badge>
                              {task.due_date && (
                                <Badge
                                  variant="secondary"
                                  className={`
                                    ${
                                      isOverdue(task.due_date) && task.status !== "completed"
                                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                                        : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                                    }
                                  `}
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(task.due_date).toLocaleDateString()}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-3">
                          {task.status !== "completed" && (
                            <Button
                              onClick={() =>
                                handleUpdateTaskStatus(
                                  task.id,
                                  task.status === "in_progress" ? "pending" : "in_progress",
                                )
                              }
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            onClick={() => handleEditTask(task)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteTask(task.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
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
