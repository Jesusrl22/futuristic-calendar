import { startOfDay, isSameDay, startOfWeek, addDays } from "date-fns"
import type { Task as ImportedTask } from "@/types"

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  dueDate: string
  createdAt: string
  pomodoroSessions: number
  estimatedTime?: number
  date: Date
  reminder?: Date
  tags?: string[]
  subtasks?: SubTask[]
  recurring?: "daily" | "weekly" | "monthly"
}

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Stats {
  totalTasks: number
  completedTasks: number
  todayTasks: number
  weekTasks: number
  pomodoroSessions: number
  focusTime: number
  streak: number
  productivity: number
}

export function calculateStats(tasks: ImportedTask[], pomodoroTime: number) {
  const today = startOfDay(new Date())
  const weekStart = startOfWeek(today)
  const weekEnd = addDays(weekStart, 6)

  const todayTasks = tasks.filter((task) => isSameDay(task.date, today))
  const weekTasks = tasks.filter((task) => task.date >= weekStart && task.date <= weekEnd)
  const completedTasks = tasks.filter((task) => task.completed)
  const completedTodayTasks = todayTasks.filter((task) => task.completed)

  const totalPomodoroSessions = tasks.reduce((sum, task) => sum + task.pomodoroSessions, 0)
  const focusTime = totalPomodoroSessions * pomodoroTime

  // Calculate productivity percentage
  const productivity = todayTasks.length > 0 ? Math.round((completedTodayTasks.length / todayTasks.length) * 100) : 0

  // Simple streak calculation (would need more complex logic for real streak)
  const streak = completedTodayTasks.length > 0 ? 1 : 0

  return {
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    todayTasks: todayTasks.length,
    weekTasks: weekTasks.length,
    pomodoroSessions: totalPomodoroSessions,
    focusTime,
    streak,
    productivity,
  }
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function groupBy<T, K extends keyof any>(array: T[], key: (item: T) => K): Record<K, T[]> {
  return array.reduce(
    (groups, item) => {
      const group = key(item)
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    },
    {} as Record<K, T[]>,
  )
}

export function sortBy<T>(array: T[], key: keyof T, direction: "asc" | "desc" = "asc"): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) return direction === "asc" ? -1 : 1
    if (aVal > bVal) return direction === "asc" ? 1 : -1
    return 0
  })
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function parseJSON<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

export function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj)
  } catch {
    return "{}"
  }
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function isEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => delete result[key])
  return result
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}
