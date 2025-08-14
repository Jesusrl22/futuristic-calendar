"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Check, Clock, AlertCircle } from "lucide-react"
import type { Task } from "@/types"

interface WeeklyViewProps {
  tasks: Task[]
  selectedDate: Date
  onDateChange: (date: Date) => void
  onTaskClick: (task: Task) => void
  onTaskComplete: (taskId: string) => void
}

export function WeeklyView({ tasks, selectedDate, onDateChange, onTaskClick, onTaskComplete }: WeeklyViewProps) {
  const weekStart = startOfWeek(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = addDays(selectedDate, direction === "prev" ? -7 : 7)
    onDateChange(newDate)
  }

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => isSameDay(task.date, date))
  }

  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek("prev")}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold text-white">
            {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek("next")}
            className="text-white hover:bg-white/20"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={() => onDateChange(new Date())}
          className="bg-white/20 hover:bg-white/30 text-white border-white/20"
        >
          Today
        </Button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayTasks = getTasksForDay(day)
          const completedTasks = dayTasks.filter((task) => task.completed).length
          const totalTasks = dayTasks.length
          const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

          return (
            <Card
              key={index}
              className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all min-h-[300px] ${
                isToday(day) ? "ring-2 ring-white/40" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <div className="text-sm text-white/60 font-medium">{format(day, "EEE")}</div>
                  <div
                    className={`text-2xl font-bold ${
                      isToday(day) ? "text-white" : "text-white/80"
                    } ${isSameDay(day, selectedDate) ? "bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mx-auto" : ""}`}
                  >
                    {format(day, "d")}
                  </div>
                  {totalTasks > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-white/60">
                        {completedTasks}/{totalTasks} completed
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                        <div
                          className="bg-green-400 h-1 rounded-full transition-all"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {dayTasks.slice(0, 4).map((task) => (
                    <div key={task.id} onClick={() => onTaskClick(task)} className="cursor-pointer group">
                      <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all">
                        <CardContent className="p-2">
                          <div className="flex items-start space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onTaskComplete(task.id)
                              }}
                              className="p-0 h-auto text-white hover:bg-white/20 mt-0.5"
                            >
                              {task.completed ? (
                                <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="h-2.5 w-2.5 text-white" />
                                </div>
                              ) : (
                                <div className="h-4 w-4 border border-white/40 rounded-full" />
                              )}
                            </Button>
                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-xs font-medium text-white truncate ${
                                  task.completed ? "line-through opacity-60" : ""
                                }`}
                              >
                                {task.title}
                              </div>
                              <div className="flex items-center space-x-1 mt-1">
                                <Badge className={`${priorityColors[task.priority]} text-xs px-1 py-0`}>
                                  {task.priority}
                                </Badge>
                                {task.priority === "high" && <AlertCircle className="h-3 w-3 text-red-400" />}
                                {task.estimatedTime && (
                                  <div className="flex items-center text-white/60">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span className="text-xs">{task.estimatedTime}m</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}

                  {dayTasks.length > 4 && (
                    <div className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDateChange(day)}
                        className="text-white/60 hover:text-white hover:bg-white/20 text-xs"
                      >
                        +{dayTasks.length - 4} more
                      </Button>
                    </div>
                  )}

                  {dayTasks.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-white/40 text-xs">No tasks</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDateChange(day)}
                        className="text-white/60 hover:text-white hover:bg-white/20 mt-2"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add task
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
