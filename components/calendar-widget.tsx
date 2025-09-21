"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react"

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

interface CalendarWidgetProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  tasks: Task[]
  onTaskCreate: (taskData: Omit<Task, "id">) => void
}

const categoryColors = {
  work: "bg-blue-500",
  personal: "bg-green-500",
  health: "bg-red-500",
  education: "bg-purple-500",
  finance: "bg-yellow-500",
  social: "bg-pink-500",
  travel: "bg-indigo-500",
  other: "bg-gray-500",
}

export function CalendarWidget({ selectedDate, onDateSelect, tasks, onTaskCreate }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showTaskForm, setShowTaskForm] = useState(false)

  // Get tasks for selected date
  const selectedDateTasks = tasks.filter((task) => task.date === selectedDate.toISOString().split("T")[0])

  // Get tasks for calendar display
  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return tasks.filter((task) => task.date === dateString)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date)
    }
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border"
            components={{
              Day: ({ date, ...props }) => {
                const dayTasks = getTasksForDate(date)
                const hasCompletedTasks = dayTasks.some((task) => task.completed)
                const hasPendingTasks = dayTasks.some((task) => !task.completed)

                return (
                  <div className="relative">
                    <button
                      {...props}
                      className={`
                        w-full h-full p-2 text-sm rounded-md transition-colors
                        ${props.className}
                        ${dayTasks.length > 0 ? "font-semibold" : ""}
                      `}
                    >
                      {date.getDate()}
                      {dayTasks.length > 0 && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          {hasPendingTasks && <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>}
                          {hasCompletedTasks && <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>}
                        </div>
                      )}
                    </button>
                  </div>
                )
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Selected Date Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
            <Button size="sm" onClick={() => setShowTaskForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedDateTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks scheduled for this date</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={() => setShowTaskForm(true)}>
                Create your first task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateTasks
                .sort((a, b) => {
                  if (a.time && b.time) {
                    return a.time.localeCompare(b.time)
                  }
                  if (a.time && !b.time) return -1
                  if (!a.time && b.time) return 1
                  return 0
                })
                .map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border transition-all ${
                      task.completed
                        ? "bg-green-50 border-green-200 opacity-75"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4
                            className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}
                          >
                            {task.title}
                          </h4>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${categoryColors[task.category as keyof typeof categoryColors]} text-white`}
                          >
                            {task.category}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className={`text-sm ${task.completed ? "text-gray-400" : "text-gray-600"} mb-2`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {task.time && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(task.time)}</span>
                            </div>
                          )}
                          {task.notifications && (
                            <Badge variant="outline" className="text-xs">
                              Notifications On
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Simple Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const taskData = {
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    date: selectedDate.toISOString().split("T")[0],
                    time: formData.get("time") as string,
                    category: formData.get("category") as string,
                    completed: false,
                    notifications: formData.get("notifications") === "on",
                  }
                  onTaskCreate(taskData)
                  setShowTaskForm(false)
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    name="title"
                    type="text"
                    required
                    className="w-full p-2 border rounded-md"
                    placeholder="Task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    className="w-full p-2 border rounded-md"
                    rows={2}
                    placeholder="Task description (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input name="time" type="time" className="w-full p-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select name="category" className="w-full p-2 border rounded-md" defaultValue="personal">
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                    <option value="finance">Finance</option>
                    <option value="social">Social</option>
                    <option value="travel">Travel</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input name="notifications" type="checkbox" id="notifications" />
                  <label htmlFor="notifications" className="text-sm">
                    Enable notifications
                  </label>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Create Task
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowTaskForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
