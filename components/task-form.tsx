"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface TaskFormProps {
  onAddTask: (task: {
    text: string
    description?: string
    completed: boolean
    date: string
    category: "work" | "personal" | "health" | "learning" | "other"
    priority: "low" | "medium" | "high"
    time?: string
    notificationEnabled?: boolean
  }) => void
  onEditTask?: (
    taskId: string,
    updates: {
      text: string
      description?: string
      date: string
      category: "work" | "personal" | "health" | "learning" | "other"
      priority: "low" | "medium" | "high"
      time?: string
      notificationEnabled?: boolean
    },
  ) => void
  editingTask?: {
    id: string
    text: string
    description?: string
    date: string
    category: "work" | "personal" | "health" | "learning" | "other"
    priority: "low" | "medium" | "high"
    time?: string
  } | null
  translations: (key: string) => string
}

function TaskForm({ onAddTask, onEditTask, editingTask, translations: t }: TaskFormProps) {
  const [open, setOpen] = useState(false)
  const [taskText, setTaskText] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split("T")[0])
  const [taskTime, setTaskTime] = useState("")
  const [taskCategory, setTaskCategory] = useState<"work" | "personal" | "health" | "learning" | "other">("personal")
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium")

  useEffect(() => {
    if (editingTask) {
      setTaskText(editingTask.text)
      setTaskDescription(editingTask.description || "")
      setTaskDate(editingTask.date)
      setTaskTime(editingTask.time || "")
      setTaskCategory(editingTask.category)
      setTaskPriority(editingTask.priority)
      setOpen(true)
    }
  }, [editingTask])

  const handleSubmit = () => {
    if (!taskText.trim()) return

    if (editingTask && onEditTask) {
      onEditTask(editingTask.id, {
        text: taskText,
        description: taskDescription || undefined,
        date: taskDate,
        category: taskCategory,
        priority: taskPriority,
        time: taskTime || undefined,
        notificationEnabled: !!taskTime,
      })
    } else {
      onAddTask({
        text: taskText,
        description: taskDescription || undefined,
        completed: false,
        date: taskDate,
        category: taskCategory,
        priority: taskPriority,
        time: taskTime || undefined,
        notificationEnabled: !!taskTime,
      })
    }

    // Reset form
    setTaskText("")
    setTaskDescription("")
    setTaskDate(new Date().toISOString().split("T")[0])
    setTaskTime("")
    setTaskCategory("personal")
    setTaskPriority("medium")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          {t("addTask")}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle>{editingTask ? t("edit") : t("addTask")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="taskText">{t("taskTitle")}</Label>
            <Input
              id="taskText"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white"
              placeholder={t("taskTitle")}
            />
          </div>

          <div>
            <Label htmlFor="taskDescription">{t("taskDescription")}</Label>
            <Textarea
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white"
              placeholder={t("taskDescription")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taskDate">{t("date")}</Label>
              <Input
                id="taskDate"
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white"
              />
            </div>

            <div>
              <Label htmlFor="taskTime">{t("time")}</Label>
              <Input
                id="taskTime"
                type="time"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
                className="bg-black/30 border-purple-500/30 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("category")}</Label>
              <Select value={taskCategory} onValueChange={setTaskCategory}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  <SelectItem value="work" className="text-white">
                    {t("work")}
                  </SelectItem>
                  <SelectItem value="personal" className="text-white">
                    {t("personal")}
                  </SelectItem>
                  <SelectItem value="health" className="text-white">
                    {t("health")}
                  </SelectItem>
                  <SelectItem value="learning" className="text-white">
                    {t("learning")}
                  </SelectItem>
                  <SelectItem value="other" className="text-white">
                    {t("other")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t("priority")}</Label>
              <Select value={taskPriority} onValueChange={setTaskPriority}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  <SelectItem value="high" className="text-white">
                    {t("high")}
                  </SelectItem>
                  <SelectItem value="medium" className="text-white">
                    {t("medium")}
                  </SelectItem>
                  <SelectItem value="low" className="text-white">
                    {t("low")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-500 to-cyan-500">
              {editingTask ? t("update") : t("save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { TaskForm }
export { TaskForm as default }
