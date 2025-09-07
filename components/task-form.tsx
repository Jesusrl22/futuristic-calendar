"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TaskFormProps {
  onAddTask: (taskData: {
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
    setNewTaskCategory("personal")
    setNewTaskPriority("medium")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className={theme.textSecondary}>Tarea</Label>
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={t("newTask")}
          className={theme.inputBg}
          onKeyPress={handleKeyPress}
        />
      </div>

      <div className="space-y-2">
        <Label className={theme.textSecondary}>Descripción (opcional)</Label>
        <Textarea
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder={t("description")}
          className={`${theme.inputBg} min-h-[80px] resize-none`}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className={theme.textSecondary}>Hora (opcional)</Label>
          <Input
            type="time"
            value={newTaskTime}
            onChange={(e) => setNewTaskTime(e.target.value)}
            className={theme.inputBg}
          />
        </div>

        <div className="space-y-2">
          <Label className={theme.textSecondary}>Categoría</Label>
          <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
            <SelectTrigger className={theme.inputBg}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={`${theme.cardBg} ${theme.border} backdrop-blur-xl`}>
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
        </div>

        <div className="space-y-2">
          <Label className={theme.textSecondary}>Prioridad</Label>
          <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
            <SelectTrigger className={theme.inputBg}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={`${theme.cardBg} ${theme.border} backdrop-blur-xl`}>
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

      <Button onClick={handleSubmit} className={`w-full ${theme.buttonPrimary}`}>
        {t("addTask")}
      </Button>
    </div>
  )
}
