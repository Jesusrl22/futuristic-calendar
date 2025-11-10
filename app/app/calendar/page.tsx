"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { ChevronLeft, ChevronRight, Plus } from "@/components/icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "personal",
    time: "",
  })

  useEffect(() => {
    fetchTasks()
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission)
        })
      }
    }
  }, [currentDate])

  const fetchTasks = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: true })

      setTasks(data || [])
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.due_date) return false
      const taskDate = new Date(task.due_date)
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const scheduleNotification = (task: any) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const taskDate = new Date(task.due_date)
      const now = new Date()
      const timeUntilTask = taskDate.getTime() - now.getTime()

      if (timeUntilTask > 0) {
        setTimeout(() => {
          new Notification(task.title, {
            body: task.description || "Task is due now!",
            icon: "/favicon.ico",
            tag: task.id,
          })
        }, timeUntilTask)
      }
    }
  }

  const handleCreateTask = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user && selectedDate) {
      const dueDate = new Date(selectedDate)
      if (newTask.time) {
        const [hours, minutes] = newTask.time.split(":")
        dueDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      }

      const { data: insertedTasks } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          category: newTask.category,
          due_date: dueDate.toISOString(),
          completed: false,
        })
        .select()

      console.log("[v0] Task created:", insertedTasks)

      if (insertedTasks && insertedTasks.length > 0) {
        scheduleNotification(insertedTasks[0])
      }

      setNewTask({ title: "", description: "", priority: "medium", category: "personal", time: "" })
      setIsDialogOpen(false)
      fetchTasks()
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    const supabase = createClient()
    await supabase.from("tasks").update({ completed: !completed }).eq("id", taskId)
    fetchTasks()
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  return (
    <div className="p-4 md:p-8">
      <div className="transition-all duration-300">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="text-primary neon-text">Calendar</span>
          </h1>
          <Button
            className="neon-glow-hover w-full md:w-auto"
            onClick={() => {
              setSelectedDate(new Date())
              setIsDialogOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {notificationPermission === "default" && (
          <Card className="glass-card p-4 mb-6 border-yellow-500/50">
            <div className="flex items-center justify-between">
              <p className="text-sm">Enable notifications to get reminders for your tasks</p>
              <Button
                size="sm"
                onClick={() => {
                  Notification.requestPermission().then((permission) => {
                    setNotificationPermission(permission)
                  })
                }}
              >
                Enable
              </Button>
            </div>
          </Card>
        )}

        <Card className="glass-card p-4 md:p-6 neon-glow">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl md:text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold text-xs md:text-sm text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }

              const dayTasks = getTasksForDate(day)
              const isToday =
                day.getDate() === new Date().getDate() &&
                day.getMonth() === new Date().getMonth() &&
                day.getFullYear() === new Date().getFullYear()

              return (
                <div
                  key={day.toISOString()}
                  className={`aspect-square p-1 md:p-2 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                    isToday
                      ? "border-primary bg-primary/10 neon-glow"
                      : "border-border/50 hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                  onClick={() => {
                    setSelectedDate(day)
                    if (dayTasks.length > 0) {
                      setIsViewDialogOpen(true)
                    } else {
                      setIsDialogOpen(true)
                    }
                  }}
                >
                  <div className="text-xs md:text-sm font-semibold mb-1">{day.getDate()}</div>
                  {dayTasks.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-[10px] md:text-xs text-muted-foreground">+{dayTasks.length - 3}</div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="glass-card max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                  className="bg-secondary/50"
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  className="bg-secondary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={newTask.category}
                    onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreateTask} className="w-full neon-glow-hover">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="glass-card max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>
                  Tasks for{" "}
                  {selectedDate?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </DialogTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-3">
              {selectedDateTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tasks for this day</p>
              ) : (
                selectedDateTasks.map((task) => (
                  <Card key={task.id} className="glass-card p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id, task.completed)} />
                      <div className="flex-1">
                        <h3 className={`font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h3>
                        {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={
                              task.priority === "high"
                                ? "border-red-500 text-red-500"
                                : task.priority === "medium"
                                  ? "border-yellow-500 text-yellow-500"
                                  : "border-green-500 text-green-500"
                            }
                          >
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">{task.category}</Badge>
                          {task.due_date && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(task.due_date).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
