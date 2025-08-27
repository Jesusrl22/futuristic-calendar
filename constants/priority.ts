export type Priority = "low" | "medium" | "high" | "urgent"

export interface PriorityConfig {
  id: Priority
  name: string
  color: string
  value: number
  icon: string
}

export const PRIORITIES: Record<Priority, PriorityConfig> = {
  low: {
    id: "low",
    name: "Low",
    color: "#10b981", // green-500
    value: 1,
    icon: "📋",
  },
  medium: {
    id: "medium",
    name: "Medium",
    color: "#f59e0b", // amber-500
    value: 2,
    icon: "⚡",
  },
  high: {
    id: "high",
    name: "High",
    color: "#ef4444", // red-500
    value: 3,
    icon: "🔥",
  },
  urgent: {
    id: "urgent",
    name: "Urgent",
    color: "#dc2626", // red-600
    value: 4,
    icon: "🚨",
  },
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
  urgent: "bg-red-100 text-red-900 border-red-300",
}

export const getPriorityById = (id: string): PriorityConfig | undefined => {
  return PRIORITIES[id as Priority]
}

export const getPriorityByValue = (value: number): PriorityConfig | undefined => {
  return Object.values(PRIORITIES).find((priority) => priority.value === value)
}

export const getDefaultPriority = (): PriorityConfig => {
  return PRIORITIES.medium
}

export const POMODORO_DEFAULTS = {
  focusTime: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsUntilLongBreak: 4,
}
