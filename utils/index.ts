import { startOfWeek, addDays, startOfDay, isSameDay } from "date-fns"
import type { Task } from "@/types"

export const calculateStats = (taskList: Task[], pomodoroTime = 25) => {
  const today = startOfDay(new Date())
  const weekStart = startOfWeek(today)
  const weekEnd = addDays(weekStart, 6)

  const todayTasks = taskList.filter((task) => isSameDay(task.date, today))
  const weekTasks = taskList.filter((task) => task.date >= weekStart && task.date <= weekEnd)
  const completedTasks = taskList.filter((task) => task.completed)
  const totalPomodoros = taskList.reduce((sum, task) => sum + task.pomodoroSessions, 0)

  const productivity = taskList.length > 0 ? Math.round((completedTasks.length / taskList.length) * 100) : 0

  return {
    totalTasks: taskList.length,
    completedTasks: completedTasks.length,
    todayTasks: todayTasks.length,
    weekTasks: weekTasks.length,
    pomodoroSessions: totalPomodoros,
    focusTime: totalPomodoros * pomodoroTime,
    streak: 5, // This would be calculated based on consecutive days
    productivity,
  }
}
