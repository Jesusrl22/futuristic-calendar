"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Trash2, Edit } from "@/components/icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [userTimezone, setUserTimezone] = useState<string>("UTC")
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    due_date: "",
    due_time: "",
  })
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    due_date: "",
    due_time: "",
  })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchTasks()
    const savedTimezone = localStorage.getItem("timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone
    setUserTimezone(savedTimezone)
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      const data = await response.json()
      if (data.tasks) {
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, completed: !completed }),
      })
      fetchTasks()
    } catch (error) {
      console.error("Error toggling task:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      })
      fetchTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const createTask = async () => {
    if (!newTask.title.trim()) {
      alert("Please enter a task title")
      return
    }

    setIsCreating(true)
    try {
      let dueDate = null
      if (newTask.due_date) {
        dueDate = new Date(newTask.due_date)
        if (newTask.due_time) {
          const [hours, minutes] = newTask.due_time.split(":")
          dueDate.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)
        } else {
          dueDate.setHours(23, 59, 59, 999)
        }
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          category: newTask.category || null,
          due_date: dueDate ? dueDate.toISOString() : null,
          completed: false,
          status: "todo",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to create task")
      } else {
        setIsDialogOpen(false)
        setNewTask({
          title: "",
          description: "",
          priority: "medium",
          category: "",
          due_date: "",
          due_time: "",
        })
        fetchTasks()
      }
    } catch (error) {
      console.error("Error creating task:", error)
      alert("Failed to create task. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const openEditDialog = (task: any) => {
    setEditingTask(task)
    const dueDate = task.due_date ? new Date(task.due_date) : null
    setEditForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      category: task.category || "",
      due_date: dueDate ? dueDate.toISOString().split("T")[0] : "",
      due_time: dueDate
        ? `${String(dueDate.getHours()).padStart(2, "0")}:${String(dueDate.getMinutes()).padStart(2, "0")}`
        : "",
    })
    setIsEditDialogOpen(true)
  }

  const updateTask = async () => {
    if (!editForm.title.trim()) {
      alert("Please enter a task title")
      return
    }

    setIsCreating(true)
    try {
      let dueDate = null
      if (editForm.due_date) {
        dueDate = new Date(editForm.due_date)
        if (editForm.due_time) {
          const [hours, minutes] = editForm.due_time.split(":")
          dueDate.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)
        } else {
          dueDate.setHours(23, 59, 59, 999)
        }
      }

      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTask.id,
          title: editForm.title,
          description: editForm.description,
          priority: editForm.priority,
          category: editForm.category || null,
          due_date: dueDate ? dueDate.toISOString() : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to update task")
      } else {
        setIsEditDialogOpen(false)
        setEditingTask(null)
        fetchTasks()
      }
    } catch (error) {
      console.error("Error updating task:", error)
      alert("Failed to update task. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed)
    return matchesSearch && matchesFilter
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const formatTaskDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString(undefined, { timeZone: userTimezone })
    const timeStr = date.toLocaleTimeString(undefined, { 
      timeZone: userTimezone,
      hour: "2-digit", 
      minute: "2-digit",
      hour12: false 
    })
    return `${dateStr} ${timeStr}`
  }

  return (
    <div className="p-8">
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-primary neon-text">Tasks</span>
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="neon-glow-hover">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task to your list. Fill in the details below.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Task title..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Task description..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_time">Due Time</Label>
                    <Input
                      id="due_time"
                      type="time"
                      value={newTask.due_time}
                      onChange={(e) => setNewTask({ ...newTask, due_time: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>
                  Cancel
                </Button>
                <Button onClick={createTask} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="glass-card p-6 neon-glow mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>
          </div>
        </Card>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id}>
                <Card className="glass-card p-4 neon-glow-hover transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id, task.completed)} />
                    <div className="flex-1">
                      <h3 className={`font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </h3>
                      {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        {task.priority && (
                          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                        )}
                        {task.category && <span className="text-xs text-muted-foreground">{task.category}</span>}
                        {task.due_date && (
                          <span className="text-xs text-muted-foreground">
                            Due: {formatTaskDateTime(task.due_date)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(task)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <Card className="glass-card p-12 text-center">
                <p className="text-muted-foreground">No tasks found</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update the task details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  placeholder="Task title..."
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Task description..."
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={editForm.priority}
                    onValueChange={(value) => setEditForm({ ...editForm, priority: value })}
                  >
                    <SelectTrigger id="edit-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editForm.category}
                    onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-due_date">Due Date</Label>
                  <Input
                    id="edit-due_date"
                    type="date"
                    value={editForm.due_date}
                    onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-due_time">Due Time</Label>
                  <Input
                    id="edit-due_time"
                    type="time"
                    value={editForm.due_time}
                    onChange={(e) => setEditForm({ ...editForm, due_time: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isCreating}>
                Cancel
              </Button>
              <Button onClick={updateTask} disabled={isCreating}>
                {isCreating ? "Updating..." : "Update Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
