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

export interface Achievement {
  id: string
  title: { en: string; es: string }
  description: { en: string; es: string }
  icon: string
  unlocked: boolean
  unlockedAt?: Date
  rarity: "common" | "rare" | "epic" | "legendary"
  category: "tasks" | "streaks" | "pomodoro" | "special"
  progress?: number
  maxProgress?: number
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  language: "en" | "es"
  notifications: boolean
  soundEnabled: boolean
  pomodoroTime: number
  shortBreakTime: number
  longBreakTime: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  longBreakInterval: number
  dailyGoal: number
  weeklyGoal: number
  backgroundGradient: string
  isPremium: boolean
  premiumExpiry?: Date
  selectedTheme: string
  userName: string
  userGoals: string[]
  hasSelectedPlan?: boolean
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  avatar: string
  verified: boolean
}

export interface AppUser {
  id: string
  email: string
  name: string
  isAuthenticated: boolean
}

export type AppState = "landing" | "auth" | "plan-selection" | "welcome" | "app" | "pricing"
export type Language = "en" | "es"
