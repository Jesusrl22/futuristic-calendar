"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Settings,
  Plus,
  Search,
  Zap,
  Edit3,
  Trash2,
  MoreHorizontal,
  Menu,
  Check,
  AlertCircle,
  Crown,
  LogOut,
  Copy,
  Briefcase,
  User,
  Heart,
  BookOpen,
  Dumbbell,
  Users,
  Palette,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { WelcomeScreen } from "@/components/welcome-screen"
import { PricingSection } from "@/components/pricing-section"
import { WeeklyView } from "@/components/weekly-view"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { format, parse, startOfWeek, getDay, addDays, subDays, startOfDay, isSameDay } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"

const locales = {
  es: es,
  en: enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  dueDate: string
  createdAt: string
  pomodoroSessions: number
  estimatedTime?: number
  date: Date
  reminder?: Date
  tags?: string[]
  subtasks?: SubTask[]
  recurring?: "daily" | "weekly" | "monthly"
}

interface SubTask {
  id: string
  title: string
  completed: boolean
}

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: Task
}

interface UserPreferences {
  theme: "light" | "dark" | "system"
  language: "en" | "es"
  notifications: boolean
  soundEnabled: boolean
  pomodoroTime: number
  shortBreakTime: number
  longBreakTime: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  longBreakInterval: number
  dailyGoal: number
  weeklyGoal: number
  backgroundGradient: string
  isPremium: boolean
  premiumExpiry?: Date
}

const defaultPreferences: UserPreferences = {
  theme: "system",
  language: "en",
  notifications: true,
  soundEnabled: true,
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  dailyGoal: 8,
  weeklyGoal: 40,
  backgroundGradient: "from-purple-400 via-pink-500 to-red-500",
  isPremium: false,
}

const backgroundGradients = [
  "from-purple-400 via-pink-500 to-red-500",
  "from-blue-400 via-purple-500 to-pink-500",
  "from-green-400 via-blue-500 to-purple-500",
  "from-yellow-400 via-orange-500 to-red-500",
  "from-pink-400 via-red-500 to-yellow-500",
  "from-indigo-400 via-purple-500 to-pink-500",
  "from-teal-400 via-blue-500 to-purple-500",
  "from-orange-400 via-pink-500 to-purple-500",
]

const taskCategories = [
  { id: "work", name: "Work", icon: Briefcase, color: "bg-blue-500" },
  { id: "personal", name: "Personal", icon: User, color: "bg-green-500" },
  { id: "health", name: "Health", icon: Heart, color: "bg-red-500" },
  { id: "learning", name: "Learning", icon: BookOpen, color: "bg-purple-500" },
  { id: "fitness", name: "Fitness", icon: Dumbbell, color: "bg-orange-500" },
  { id: "social", name: "Social", icon: Users, color: "bg-pink-500" },
  { id: "creative", name: "Creative", icon: Palette, color: "bg-yellow-500" },
  { id: "home", name: "Home", icon: Home, color: "bg-indigo-500" },
]

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
}

export default function FutureTaskApp() {
  const [currentView, setCurrentView] = useState("agenda")
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showWelcome, setShowWelcome] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [showCompleted, setShowCompleted] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPomodoro, setShowPomodoro] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium")
  const [taskCategory, setTaskCategory] = useState("work")
  const [taskDate, setTaskDate] = useState(new Date())
  const [taskTime, setTaskTime] = useState("09:00")
  const [taskTags, setTaskTags] = useState("")
  const [taskEstimatedTime, setTaskEstimatedTime] = useState(30)
  const [taskRecurring, setTaskRecurring] = useState<"none" | "daily" | "weekly" | "monthly">("none")
  const [taskReminder, setTaskReminder] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    todayTasks: 0,
    weekTasks: 0,
    pomodoroSessions: 0,
    focusTime: 0,
    streak: 0,
  })

  // Initialize sample data
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: "1",
        title: "Completar proyecto de React",
        description: "Finalizar la aplicación de calendario con todas las funcionalidades",
        completed: false,
        priority: "high",
        category: "work",
        dueDate: "2024-01-15",
        createdAt: "2024-01-10",
        pomodoroSessions: 3,
        date: new Date(),
        tags: ["react", "proyecto"],
        subtasks: [],
      },
      {
        id: "2",
        title: "Ejercicio matutino",
        description: "30 minutos de cardio y estiramientos",
        completed: true,
        priority: "medium",
        category: "health",
        dueDate: "2024-01-12",
        createdAt: "2024-01-12",
        pomodoroSessions: 1,
        date: new Date(),
        tags: ["salud", "ejercicio"],
        subtasks: [],
      },
    ]

    setTasks(sampleTasks)
    calculateStats(sampleTasks)
  }, [])

  const calculateStats = (taskList: Task[]) => {
    const today = startOfDay(new Date())
    const weekStart = startOfWeek(today)
    const weekEnd = addDays(weekStart, 6)

    const todayTasks = taskList.filter((task) => isSameDay(task.date, today))
    const weekTasks = taskList.filter((task) => task.date >= weekStart && task.date <= weekEnd)
    const completedTasks = taskList.filter((task) => task.completed)

    setStats({
      totalTasks: taskList.length,
      completedTasks: completedTasks.length,
      todayTasks: todayTasks.length,
      weekTasks: weekTasks.length,
      pomodoroSessions: 0,
      focusTime: 0,
      streak: 0,
    })
  }

  const createTask = () => {
    if (!taskTitle.trim()) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskTitle,
      description: taskDescription,
      date: new Date(taskDate.toDateString() + " " + taskTime),
      completed: false,
      priority: taskPriority,
      category: taskCategory,
      estimatedTime: taskEstimatedTime,
      tags: taskTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      subtasks: [],
      recurring: taskRecurring !== "none" ? taskRecurring : undefined,
      reminder: taskReminder ? subDays(new Date(taskDate.toDateString() + " " + taskTime), 1) : undefined,
      createdAt: new Date().toISOString(),
      pomodoroSessions: 0,
      dueDate: taskDate.toISOString().split("T")[0],
    }

    const updatedTasks = [newTask, ...tasks]
    setTasks(updatedTasks)
    calculateStats(updatedTasks)
    resetTaskForm()
    setShowTaskDialog(false)

    toast.success("Task created successfully!")
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    setTasks(updatedTasks)
    calculateStats(updatedTasks)

    if (updates.completed) {
      toast.success("Task completed!")
    }
  }

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    calculateStats(updatedTasks)
    toast.success("Task deleted successfully!")
  }

  const resetTaskForm = () => {
    setTaskTitle("")
    setTaskDescription("")
    setTaskPriority("medium")
    setTaskCategory("work")
    setTaskDate(new Date())
    setTaskTime("09:00")
    setTaskTags("")
    setTaskEstimatedTime(30)
    setTaskRecurring("none")
    setTaskReminder(false)
    setEditingTask(null)
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || task.category === filterCategory
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesCompleted = showCompleted || !task.completed

    return matchesSearch && matchesCategory && matchesPriority && matchesCompleted
  })

  const calendarEvents: CalendarEvent[] = filteredTasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: task.date,
    end: addDays(task.date, 0),
    resource: task,
  }))

  const todayTasks = tasks.filter((task) => isSameDay(task.date, new Date()))

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />
  }

  if (showPricing) {
    return (
      <PricingSection
        onBack={() => setShowPricing(false)}
        onUpgrade={(plan) => {
          const newPreferences = {
            ...preferences,
            isPremium: true,
            premiumExpiry: new Date(Date.now() + (plan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000),
          }
          setPreferences(newPreferences)
          setShowPricing(false)
          toast.success("Welcome to Premium!")
        }}
      />
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${preferences.backgroundGradient} transition-all duration-500`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      {/* Ad Placeholder for Free Users */}
      {!preferences.isPremium && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 text-center text-sm">
          <span className="mr-2">🚀 Upgrade to Premium for an ad-free experience!</span>
          <Button size="sm" variant="secondary" onClick={() => setShowPricing(true)} className="ml-2">
            Upgrade Now
          </Button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-white hover:bg-white/20"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">FutureTask</h1>
                {preferences.isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 w-64"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPomodoro(true)}
                className="text-white hover:bg-white/20"
              >
                <Clock className="h-4 w-4 mr-2" />
                Pomodoro
              </Button>

              <Button
                onClick={() => setShowTaskDialog(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowPricing(true)}>
                    <Crown className="h-4 w-4 mr-2" />
                    {preferences.isPremium ? "Manage Premium" : "Upgrade to Premium"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowTaskDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowPomodoro(true)}>
                    <Clock className="h-4 w-4 mr-2" />
                    Pomodoro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar for mobile */}
      <Dialog open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white/10 backdrop-blur-md border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Dashboard</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-white">{stats.todayTasks}</div>
                  <div className="text-sm text-white/60">Today's Tasks</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-white">{stats.completedTasks}</div>
                  <div className="text-sm text-white/60">Completed</div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Tasks */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Today's Tasks</h3>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {todayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg border border-white/20"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateTask(task.id, { completed: !task.completed })}
                        className="p-0 h-auto text-white hover:bg-white/20"
                      >
                        {task.completed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4 border border-white/40 rounded" />
                        )}
                      </Button>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm text-white ${task.completed ? "line-through opacity-60" : ""}`}>
                          {task.title}
                        </div>
                        <div className="text-xs text-white/60">{format(task.date, "HH:mm")}</div>
                      </div>
                      <Badge className={`${priorityColors[task.priority]} text-xs`}>{task.priority}</Badge>
                    </div>
                  ))}
                  {todayTasks.length === 0 && <div className="text-center text-white/60 py-8">No tasks for today</div>}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* View Selector */}
          <div className="mb-6">
            <Tabs value={currentView} onValueChange={setCurrentView}>
              <TabsList className="bg-white/10 border-white/20">
                <TabsTrigger value="month" className="text-white data-[state=active]:bg-white/20">
                  Month
                </TabsTrigger>
                <TabsTrigger value="week" className="text-white data-[state=active]:bg-white/20">
                  Week
                </TabsTrigger>
                <TabsTrigger value="day" className="text-white data-[state=active]:bg-white/20">
                  Day
                </TabsTrigger>
                <TabsTrigger value="agenda" className="text-white data-[state=active]:bg-white/20">
                  Agenda
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Calendar */}
          {currentView === "week" ? (
            <WeeklyView
              tasks={filteredTasks}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onTaskClick={(task) => {
                setEditingTask(task)
                setShowTaskDialog(true)
              }}
              onTaskComplete={(taskId) => {
                const task = tasks.find((t) => t.id === taskId)
                if (task) {
                  updateTask(taskId, { completed: !task.completed })
                }
              }}
            />
          ) : currentView === "agenda" ? (
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No tasks found</h3>
                    <p className="text-white/60 mb-4">
                      {searchQuery || filterCategory !== "all" || filterPriority !== "all"
                        ? "Try adjusting your filters or search query."
                        : "Create your first task to get started."}
                    </p>
                    <Button
                      onClick={() => setShowTaskDialog(true)}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map((task) => {
                  const category = taskCategories.find((c) => c.id === task.category)
                  const CategoryIcon = category?.icon || Briefcase

                  return (
                    <Card
                      key={task.id}
                      className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateTask(task.id, { completed: !task.completed })}
                            className="p-0 h-auto text-white hover:bg-white/20 mt-1"
                          >
                            {task.completed ? (
                              <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 border-2 border-white/40 rounded-full" />
                            )}
                          </Button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3
                                className={`text-lg font-semibold text-white ${task.completed ? "line-through opacity-60" : ""}`}
                              >
                                {task.title}
                              </h3>
                              <Badge className={`${priorityColors[task.priority]} text-xs`}>{task.priority}</Badge>
                              {task.priority === "high" && <AlertCircle className="h-4 w-4 text-red-400" />}
                            </div>

                            {task.description && (
                              <p className={`text-white/70 mb-2 ${task.completed ? "line-through opacity-60" : ""}`}>
                                {task.description}
                              </p>
                            )}

                            <div className="flex items-center space-x-4 text-sm text-white/60">
                              <div className="flex items-center space-x-1">
                                <CategoryIcon className="h-4 w-4" />
                                <span>{category?.name || task.category}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{format(task.date, "MMM d, yyyy HH:mm")}</span>
                              </div>
                              {task.estimatedTime && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{task.estimatedTime}m</span>
                                </div>
                              )}
                            </div>

                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {task.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs bg-white/10 text-white/80">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingTask(task)
                                  setShowTaskDialog(true)
                                }}
                              >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  const newTask = { ...task, id: crypto.randomUUID(), title: `${task.title} (Copy)` }
                                  const updatedTasks = [newTask, ...tasks]
                                  setTasks(updatedTasks)
                                  calculateStats(updatedTasks)
                                }}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          ) : (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div style={{ height: "600px" }}>
                  <BigCalendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    view={currentView as any}
                    onView={setCurrentView as any}
                    date={selectedDate}
                    onNavigate={setSelectedDate}
                    onSelectEvent={(event) => {
                      setEditingTask(event.resource)
                      setShowTaskDialog(true)
                    }}
                    eventPropGetter={(event) => ({
                      style: {
                        backgroundColor: event.resource.completed ? "#10b981" : "#8b5cf6",
                        borderColor: event.resource.completed ? "#059669" : "#7c3aed",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                      },
                    })}
                    className="text-white"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-[600px] bg-white/10 backdrop-blur-md border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter task description..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-category">Category</Label>
                <Select value={taskCategory} onValueChange={setTaskCategory}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskCategories.map((category) => {
                      const Icon = category.icon
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={taskPriority}
                  onValueChange={(value: "low" | "medium" | "high") => setTaskPriority(value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(taskDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={taskDate}
                      onSelect={(date) => date && setTaskDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="task-time">Time</Label>
                <Input
                  id="task-time"
                  type="time"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetTaskForm()
                  setShowTaskDialog(false)
                }}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button
                onClick={createTask}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[600px] bg-white/10 backdrop-blur-md border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications</Label>
                <p className="text-sm text-white/60">Receive task reminders and updates</p>
              </div>
              <Switch
                checked={preferences.notifications}
                onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Sound Effects</Label>
                <p className="text-sm text-white/60">Play sounds for task completion and notifications</p>
              </div>
              <Switch
                checked={preferences.soundEnabled}
                onCheckedChange={(checked) => setPreferences({ ...preferences, soundEnabled: checked })}
              />
            </div>

            <div>
              <Label>Language</Label>
              <Select
                value={preferences.language}
                onValueChange={(value: "en" | "es") => setPreferences({ ...preferences, language: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pomodoro Timer Dialog */}
      <Dialog open={showPomodoro} onOpenChange={setShowPomodoro}>
        <DialogContent className="sm:max-w-[400px] bg-white/10 backdrop-blur-md border-white/20 text-white">
          <PomodoroTimer
            preferences={preferences}
            onClose={() => setShowPomodoro(false)}
            onComplete={(sessionType) => {
              toast.success(sessionType === "focus" ? "Focus session complete!" : "Break time!")
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
