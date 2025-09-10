"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"

interface TaskFormProps {
  onAddTask: (task: any) => void
  onClose: () => void
  theme: any
  t: (key: string) => string
  selectedDate: Date
}

export function TaskForm({ onAddTask, onClose, theme, t, selectedDate }: TaskFormProps) {
  const [text, setText] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState("")
  const [category, setCategory] = useState<"work" | "personal" | "health" | "learning" | "other">("personal")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    const task = {
      text: text.trim(),
      description: description.trim() || null,
      time: time || null,
      category,
      priority,
      completed: false,
      date: selectedDate.toISOString().split("T")[0],
      notification_enabled: false,
    }

    onAddTask(task)
    setText("")
    setDescription("")
    setTime("")
    setCategory("personal")
    setPriority("medium")
    onClose()
  }

  return (
    <Card className={`${theme.cardBg} ${theme.border}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={theme.textPrimary}>{t("addTask")}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-text" className={theme.textSecondary}>
              Tarea
            </Label>
            <Input
              id="task-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("newTask")}
              className={theme.inputBg}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description" className={theme.textSecondary}>
              Descripción
            </Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("description")}
              className={theme.inputBg}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-time" className={theme.textSecondary}>
                Hora
              </Label>
              <Input
                id="task-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={theme.inputBg}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-priority" className={theme.textSecondary}>
                Prioridad
              </Label>
              <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                <SelectTrigger className={theme.inputBg}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("low")}</SelectItem>
                  <SelectItem value="medium">{t("medium")}</SelectItem>
                  <SelectItem value="high">{t("high")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-category" className={theme.textSecondary}>
              Categoría
            </Label>
            <Select
              value={category}
              onValueChange={(value: "work" | "personal" | "health" | "learning" | "other") => setCategory(value)}
            >
              <SelectTrigger className={theme.inputBg}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">{t("work")}</SelectItem>
                <SelectItem value="personal">{t("personal")}</SelectItem>
                <SelectItem value="health">{t("health")}</SelectItem>
                <SelectItem value="learning">{t("learning")}</SelectItem>
                <SelectItem value="other">{t("other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" className={`flex-1 ${theme.buttonPrimary}`}>
              <Plus className="h-4 w-4 mr-2" />
              {t("addTask")}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose} className={theme.textMuted}>
              {t("cancel")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
