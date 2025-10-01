"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, List, LayoutGrid, Search, Filter, Plus, Target } from "lucide-react"
import { TaskManager } from "@/components/task-manager"
import { CalendarWidget } from "@/components/calendar-widget"
import { TaskForm } from "@/components/task-form"
import { hybridDb, type Task, type User } from "@/lib/hybrid-database"

interface TaskCalendarManagerProps {
  user: User
  onUserUpdate: (updates: Partial<User>) => void
}

export function TaskCalendarManager({ user, onUserUpdate }: TaskCalendarManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<"calendar" | "list">("calendar")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all")
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  // Handle close form
  const handleCloseForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  // Load tasks function - memoized to prevent infinite loops
  const loadTasks = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      const userTasks = await hybridDb.getTasks(user.id)
      setTasks(userTasks || [])
    } catch (error) {
      console.error("Error loading tasks:", error)
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  // Handle tasks change for TaskManager - memoized
  const handleTasksChange = useCallback(() => {
    loadTasks()
  }, [loadTasks])

  // Load tasks on mount and user change
  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  // Early return if user is not provided
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-400">Usuario no encontrado</p>
        </div>
      </div>
    )
  }

  // Filter tasks
  const filteredTasks = (tasks || []).filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed)

    const matchesPriority = filterPriority === "all" || task.priority === filterPriority

    const matchesCategory = filterCategory === "all" || task.category === filterCategory

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  // Get unique categories
  const categories = Array.from(new Set((tasks || []).map((task) => task.category).filter(Boolean)))

  // Handle task creation
  const handleCreateTask = async (taskData: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user?.id) return

    try {
      const newTask = await hybridDb.createTask(user.id, taskData)
      setTasks((prev) => [newTask, ...(prev || [])])
      setShowTaskForm(false)
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  // Handle task update
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await hybridDb.updateTask(taskId, updates)
      setTasks((prev) => (prev || []).map((task) => (task.id === taskId ? updatedTask : task)))
      setEditingTask(null)
      setShowTaskForm(false)
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    try {
      await hybridDb.deleteTask(taskId)
      setTasks((prev) => (prev || []).filter((task) => task.id !== taskId))
      setEditingTask(null)
      setShowTaskForm(false)
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  // Handle task click from calendar
  const handleTaskClick = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  // Handle new task button
  const handleNewTask = () => {
    setEditingTask(null)
    setShowTaskForm(true)
  }

  // Calculate stats
  const stats = {
    total: (tasks || []).length,
    completed: (tasks || []).filter((t) => t.completed).length,
    pending: (tasks || []).filter((t) => !t.completed).length,
    overdue: (tasks || []).filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando tareas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Tareas & Calendario</h2>
            <p className="text-gray-400 text-sm">Organiza y gestiona tus tareas diarias</p>
          </div>
        </div>
        <Button onClick={handleNewTask} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      {/* Stats - Solo mostrar en vista de calendario */}
      {currentView === "calendar" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Tareas</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <LayoutGrid className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Completadas</p>
                  <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs font-bold">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-yellow-400 text-xs font-bold">⏳</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Vencidas</p>
                  <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 text-xs font-bold">!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Selector */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardContent className="p-4">
          <Tabs value={currentView} onValueChange={(value: any) => setCurrentView(value)}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger
                value="calendar"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Calendario</span>
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
              />
            </div>

            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">
                  Todas
                </SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-slate-700">
                  Pendientes
                </SelectItem>
                <SelectItem value="completed" className="text-white hover:bg-slate-700">
                  Completadas
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">
                  Todas
                </SelectItem>
                <SelectItem value="high" className="text-white hover:bg-slate-700">
                  Alta
                </SelectItem>
                <SelectItem value="medium" className="text-white hover:bg-slate-700">
                  Media
                </SelectItem>
                <SelectItem value="low" className="text-white hover:bg-slate-700">
                  Baja
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">
                  Todas
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active filters */}
          {(searchTerm || filterStatus !== "all" || filterPriority !== "all" || filterCategory !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="gap-1 bg-purple-500/20 text-purple-300 border-purple-500/30">
                  <Search className="w-3 h-3" />
                  {searchTerm}
                </Badge>
              )}
              {filterStatus !== "all" && (
                <Badge variant="secondary" className="gap-1 bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <Filter className="w-3 h-3" />
                  {filterStatus}
                </Badge>
              )}
              {filterPriority !== "all" && (
                <Badge variant="secondary" className="gap-1 bg-green-500/20 text-green-300 border-green-500/30">
                  <Target className="w-3 h-3" />
                  {filterPriority}
                </Badge>
              )}
              {filterCategory !== "all" && (
                <Badge variant="secondary" className="gap-1 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  <Filter className="w-3 h-3" />
                  {filterCategory}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content based on view */}
      {currentView === "calendar" && (
        <CalendarWidget
          tasks={filteredTasks}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onTaskClick={handleTaskClick}
        />
      )}

      {currentView === "list" && (
        <TaskManager
          userId={user.id}
          tasks={filteredTasks}
          onTasksChange={handleTasksChange}
          onUpgrade={() => {}}
          onTaskEdit={handleTaskClick}
          compact={false}
          hideAddButton={true}
          hideStats={true}
        />
      )}

      {/* Task Form Modal */}
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
