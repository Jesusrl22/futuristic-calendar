"use client"

import type React from "react"

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
  const [taskText, setTaskText] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskTime, setTaskTime] = useState("")
  const [taskCategory, setTaskCategory] = useState("personal")
  const [taskPriority, setTaskPriority] = useState("medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskText.trim()) return

    onAddTask({
      text: taskText,
      description: taskDescription,
      time: taskTime,
      category: taskCategory,
      priority: taskPriority,
    })

    // Reset form
    setTaskText("")
    setTaskDescription("")
    setTaskTime("")
    setTaskCategory("personal")
    setTaskPriority("medium")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder={t("newTask")}
          className={`bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400`}
        />
        <Textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder={t("description")}
          className={`bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400 min-h-[60px] resize-none`}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Input
          type="time"
          value={taskTime}
          onChange={(e) => setTaskTime(e.target.value)}
          className={`bg-black/30 border-purple-500/30 text-white`}
        />

        <Select value={taskCategory} onValueChange={setTaskCategory}>
          <SelectTrigger className={`bg-black/30 border-purple-500/30 text-white`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={`bg-black/90 border-purple-500/20`}>
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

        <Select value={taskPriority} onValueChange={setTaskPriority}>
          <SelectTrigger className={`bg-black/30 border-purple-500/30 text-white`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={`bg-black/90 border-purple-500/20`}>
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

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t("addTask")}
      </Button>
    </form>
  )
}
