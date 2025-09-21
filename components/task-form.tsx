"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Bell, Tag, Plus, X } from "lucide-react"
import { format } from "date-fns"

interface Task {
  id: string
  title: string
  description: string
  date: string
  time?: string
  category: string
  completed: boolean
  notifications: boolean
}

interface TaskFormProps {
  selectedDate: Date
  onTaskCreated: () => void
}

const categories = [
  { value: "work", label: "Work", color: "bg-blue-500", icon: "💼" },
  { value: "personal", label: "Personal", color: "bg-green-500", icon: "🏠" },
  { value: "health", label: "Health", color: "bg-red-500", icon: "❤️" },
  { value: "education", label: "Education", color: "bg-purple-500", icon: "📚" },
  { value: "finance", label: "Finance", color: "bg-yellow-500", icon: "💰" },
  { value: "social", label: "Social", color: "bg-pink-500", icon: "👥" },
  { value: "travel", label: "Travel", color: "bg-indigo-500", icon: "✈️" },
  { value: "other", label: "Other", color: "bg-gray-500", icon: "📝" },
]

export function TaskForm({ selectedDate, onTaskCreated }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: selectedDate,
    time: "",
    category: "personal",
    notifications: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const taskData = {
      ...formData,
      date: formData.date.toISOString().split("T")[0],
      time: formData.time || undefined,
    }

    try {
      // Here you would typically save to your database
      console.log("Creating task:", taskData)

      // Reset form
      setFormData({
        title: "",
        description: "",
        date: selectedDate,
        time: "",
        category: "personal",
        notifications: false,
      })

      setIsOpen(false)
      onTaskCreated()
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date })
    }
  }

  const selectedCategory = categories.find((cat) => cat.value === formData.category)

  if (!isOpen) {
    return (
      <Card>
        <CardContent className="p-6">
          <Button onClick={() => setIsOpen(true)} className="w-full" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create New Task
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Task</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What needs to be done?"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details about this task..."
              rows={3}
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={formData.date} onSelect={handleDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue>
                  {selectedCategory && (
                    <div className="flex items-center space-x-2">
                      <span>{selectedCategory.icon}</span>
                      <span>{selectedCategory.label}</span>
                      <Badge className={`${selectedCategory.color} text-white text-xs`}>{selectedCategory.label}</Badge>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notifications Toggle */}
          {formData.time && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="notifications" className="text-sm font-medium">
                    Enable Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">Get reminded 15 minutes before the scheduled time</p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={formData.notifications}
                onCheckedChange={(checked) => setFormData({ ...formData, notifications: checked })}
              />
            </div>
          )}

          {/* Task Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2 flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Task Preview</span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Title:</span>
                <span>{formData.title || "Untitled Task"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Date:</span>
                <span>{format(formData.date, "PPP")}</span>
                {formData.time && (
                  <>
                    <span className="font-medium">Time:</span>
                    <span>{formData.time}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Category:</span>
                <Badge className={`${selectedCategory?.color} text-white text-xs`}>
                  {selectedCategory?.icon} {selectedCategory?.label}
                </Badge>
              </div>
              {formData.notifications && (
                <div className="flex items-center space-x-2">
                  <Bell className="h-3 w-3" />
                  <span className="text-xs text-muted-foreground">Notifications enabled</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button type="submit" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
