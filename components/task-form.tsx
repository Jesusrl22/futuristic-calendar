"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface TaskFormProps {
  onAddTask: (task: {
    text: string
    description: string
    time: string
    category: string
    priority: string
  }) => void
  theme: any
  t: (key: string) => string
}

export function TaskForm({ onAddTask, theme, t }: TaskFormProps) {
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskTime, setNewTaskTime] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState("personal")
  const [newTaskPriority, setNewTaskPriority] = useState("medium")

  const handleSubmit = () => {
    if (!newTask.trim()) return

    onAddTask({
      text: newTask,
      description: newTaskDescription,
      time: newTaskTime,
      category: newTaskCategory,
      priority: newTaskPriority,
    })

    // Reset form
    setNewTask("")
    setNewTaskDescription("")
    setNewTaskTime("")
  }

  return (
    <div className="space-y-3">
      <Input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder={t("newTask")}
        className={`bg-black/30 border-purple-500/30 ${theme.textPrimary} ${theme.placeholder}`}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
      />

      <Textarea
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
        placeholder={t("description")}
        className={`bg-black/30 border-purple-500/30 ${theme.textPrimary} min-h-[60px] ${theme.placeholder}`}
      />

      <div className="grid grid-cols-2 gap-2">
        <Input
          type="time"
          value={newTaskTime}
          onChange={(e) => setNewTaskTime(e.target.value)}
          placeholder={t("time")}
          className={`bg-black/30 border-purple-500/30 ${theme.textPrimary} ${theme.placeholder}`}
        />
        <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-500 to-cyan-500">
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
          <SelectTrigger className={`bg-black/30 border-purple-500/30 ${theme.textPrimary}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-purple-500/30">
            <SelectItem value="work" className={theme.textPrimary}>
              {t("work")}
            </SelectItem>
            <SelectItem value="personal" className={theme.textPrimary}>
              {t("personal")}
            </SelectItem>
            <SelectItem value="health" className={theme.textPrimary}>
              {t("health")}
            </SelectItem>
            <SelectItem value="learning" className={theme.textPrimary}>
              {t("learning")}
            </SelectItem>
            <SelectItem value="other" className={theme.textPrimary}>
              {t("other")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
          <SelectTrigger className={`bg-black/30 border-purple-500/30 ${theme.textPrimary}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-purple-500/30">
            <SelectItem value="high" className={theme.textPrimary}>
              {t("high")}
            </SelectItem>
            <SelectItem value="medium" className={theme.textPrimary}>
              {t("medium")}
            </SelectItem>
            <SelectItem value="low" className={theme.textPrimary}>
              {t("low")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
