export type Language = "en" | "es" | "fr" | "de" | "it"

export type Priority = "low" | "medium" | "high" | "urgent"

export type Category = "work" | "personal" | "health" | "learning" | "shopping" | "other"

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  date: string
  priority: Priority
  category: Category
  estimatedTime?: number
  actualTime?: number
  tags: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
  subtasks?: SubTask[]
  recurring?: RecurringConfig
  reminders?: Reminder[]
  attachments?: Attachment[]
}

export interface SubTask {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export interface RecurringConfig {
  type: "daily" | "weekly" | "monthly" | "yearly"
  interval: number
  endDate?: string
  daysOfWeek?: number[]
}

export interface Reminder {
  id: string
  time: string
  type: "notification" | "email" | "sms"
  sent: boolean
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface UserPreferences {
  selectedTheme: string
  backgroundGradient: string
  isPremium: boolean
  userName: string
  language: Language
  notifications: boolean
  soundEnabled: boolean
  pomodoroTime: number
  shortBreakTime: number
  longBreakTime: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  dailyGoal: number
  weeklyGoal: number
  showWeekends: boolean
  startWeekOnMonday: boolean
  timeFormat: "12h" | "24h"
  dateFormat: string
  timezone: string
  emailNotifications?: boolean
  pushNotifications?: boolean
  weeklyReports?: boolean
  monthlyReports?: boolean
  taskReminders?: boolean
  achievementNotifications?: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  type: "task" | "streak" | "time" | "special"
  requirement: number
  progress: number
  unlocked: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
}

export interface Stats {
  dailyStreak: number
  totalTasksCompleted: number
  totalTimeSpent: number
  todayTasks: number
  weekTasks: number
  pomodoroSessions: number
  focusTime: number
  streak: number
  averageTasksPerDay?: number
  mostProductiveHour?: number
  favoriteCategory?: Category
  completionRate?: number
  weeklyStats?: WeeklyStats[]
  monthlyStats?: MonthlyStats[]
}

export interface WeeklyStats {
  week: string
  tasksCompleted: number
  timeSpent: number
  streak: number
}

export interface MonthlyStats {
  month: string
  tasksCompleted: number
  timeSpent: number
  averageDaily: number
}

export interface TaskTemplate {
  id: string
  name: string
  description: string
  category: Category
  priority: Priority
  estimatedTime: number
  subtasks: string[]
  tags: string[]
  isDefault: boolean
}

export interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  progress: number
  tasks: string[]
  category: Category
  priority: Priority
  completed: boolean
  createdAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  createdAt: string
  updatedAt: string
  pinned: boolean
  archived: boolean
}

export interface WishlistItem {
  id: string
  title: string
  description: string
  priority: Priority
  category: string
  estimatedCost?: number
  targetDate?: string
  completed: boolean
  createdAt: string
}

export interface PomodoroSession {
  id: string
  taskId?: string
  startTime: string
  endTime?: string
  duration: number
  type: "work" | "shortBreak" | "longBreak"
  completed: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  allDay: boolean
  category: Category
  color: string
  recurring?: RecurringConfig
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isAuthenticated: boolean
  isPremium: boolean
  hasSeenPlanSelection: boolean
  subscriptionEndDate?: string
  createdAt: string
}

export interface Theme {
  id: string
  name: string
  gradient: string
  primary: string
  secondary: string
  accent: string
  isPremium: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface SearchFilters {
  query: string
  category?: Category
  priority?: Priority
  completed?: boolean
  dateRange?: {
    start: string
    end: string
  }
  tags?: string[]
}

export interface ExportData {
  tasks: Task[]
  preferences: UserPreferences
  achievements: Achievement[]
  stats: Stats
  notes?: Note[]
  goals?: Goal[]
  wishlist?: WishlistItem[]
  exportedAt: string
  version: string
}
