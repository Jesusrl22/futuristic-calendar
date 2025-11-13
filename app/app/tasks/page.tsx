"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
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
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    due_date: "",
  })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

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
        .order("created_at", { ascending: false })

      setTasks(data || [])
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    const supabase = createClient()
    await supabase.from("tasks").update({ completed: !completed }).eq("id", taskId)
    fetchTasks()
  }

  const deleteTask = async (taskId: string) => {
    const supabase = createClient()
    await supabase.from("tasks").delete().eq("id", taskId)
    fetchTasks()
  }

  const createTask = async () => {
    if (!newTask.title.trim()) {
      alert("Please enter a task title")
      return
    }

    setIsCreating(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase.from("tasks").insert({
          user_id: user.id,
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          category: newTask.category || null,
          due_date: newTask.due_date || null,
          completed: false,
        })

        if (error) {
          console.error("Error creating task:", error)
          alert("Failed to create task. Please try again.")
        } else {
          setIsDialogOpen(false)
          setNewTask({
            title: "",
            description: "",
            priority: "medium",
            category: "",
            due_date: "",
          })
          fetchTasks()
        }
      }
    } catch (error) {
      console.error("Error creating task:", error)
      alert("Failed to create task. Please try again.")
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
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Work, Personal, Shopping..."
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  />
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
            {filteredTasks.map((task, index) => (
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
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
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
      </div>
    </div>
  )
}
