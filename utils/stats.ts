import type { Task, Stats } from "@/types"
import { startOfWeek, endOfWeek, isSameDay, startOfDay } from "date-fns"

export function calculateStats(tasks: Task[]): Stats {
  const today = startOfDay(new Date())
  const weekStart = startOfWeek(today)
  const weekEnd = endOfWeek(today)

  const todayTasks = tasks.filter((task) => isSameDay(task.date, today))
  const weekTasks = tasks.filter((task) => task.date >= weekStart && task.date <= weekEnd)
  const completedTasks = tasks.filter((task) => task.completed)
  const totalPomodoros = tasks.reduce((sum, task) => sum + task.pomodoroSessions, 0)

  const productivity = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  return {
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    todayTasks: todayTasks.length,
    weekTasks: weekTasks.length,
    pomodoroSessions: totalPomodoros,
    focusTime: totalPomodoros * 25, // Assuming 25 minutes per session
    streak: 5, // This would be calculated based on consecutive days
    productivity,
  }
}

export function getTasksByCategory(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce(
    (acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = []
      }
      acc[task.category].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )
}

export function getTasksByPriority(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce(
    (acc, task) => {
      if (!acc[task.priority]) {
        acc[task.priority] = []
      }
      acc[task.priority].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )
}
