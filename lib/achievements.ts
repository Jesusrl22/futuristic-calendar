export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  condition: (stats: UserStats) => boolean
  progress?: (stats: UserStats) => { current: number; total: number }
  unlockedAt?: Date
}

export interface UserStats {
  tasksCompleted: number
  pomodoroSessions: number
  totalFocusTime: number // in minutes
  streakDays: number
  notesCreated: number
  wishlistItems: number
  loginDays: number
  perfectDays: number // days with all planned tasks completed
  earlyBird: number // tasks completed before 9 AM
  nightOwl: number // tasks completed after 10 PM
  weekendWarrior: number // weekend tasks completed
}

export const achievements: Achievement[] = [
  {
    id: "first-task",
    name: "Getting Started",
    description: "Complete your first task",
    icon: "🎯",
    rarity: "common",
    condition: (stats) => stats.tasksCompleted >= 1,
  },
  {
    id: "task-master",
    name: "Task Master",
    description: "Complete 100 tasks",
    icon: "🏆",
    rarity: "rare",
    condition: (stats) => stats.tasksCompleted >= 100,
    progress: (stats) => ({ current: Math.min(stats.tasksCompleted, 100), total: 100 }),
  },
  {
    id: "productivity-legend",
    name: "Productivity Legend",
    description: "Complete 1000 tasks",
    icon: "👑",
    rarity: "legendary",
    condition: (stats) => stats.tasksCompleted >= 1000,
    progress: (stats) => ({ current: Math.min(stats.tasksCompleted, 1000), total: 1000 }),
  },
  {
    id: "pomodoro-starter",
    name: "Focus Beginner",
    description: "Complete your first Pomodoro session",
    icon: "🍅",
    rarity: "common",
    condition: (stats) => stats.pomodoroSessions >= 1,
  },
  {
    id: "focus-master",
    name: "Focus Master",
    description: "Complete 50 Pomodoro sessions",
    icon: "🧠",
    rarity: "epic",
    condition: (stats) => stats.pomodoroSessions >= 50,
    progress: (stats) => ({ current: Math.min(stats.pomodoroSessions, 50), total: 50 }),
  },
  {
    id: "time-warrior",
    name: "Time Warrior",
    description: "Accumulate 25 hours of focus time",
    icon: "⏰",
    rarity: "rare",
    condition: (stats) => stats.totalFocusTime >= 1500, // 25 hours in minutes
    progress: (stats) => ({ current: Math.min(stats.totalFocusTime, 1500), total: 1500 }),
  },
  {
    id: "streak-starter",
    name: "Consistency Starter",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    rarity: "common",
    condition: (stats) => stats.streakDays >= 7,
    progress: (stats) => ({ current: Math.min(stats.streakDays, 7), total: 7 }),
  },
  {
    id: "streak-legend",
    name: "Consistency Legend",
    description: "Maintain a 30-day streak",
    icon: "🌟",
    rarity: "legendary",
    condition: (stats) => stats.streakDays >= 30,
    progress: (stats) => ({ current: Math.min(stats.streakDays, 30), total: 30 }),
  },
  {
    id: "note-taker",
    name: "Note Taker",
    description: "Create 25 notes",
    icon: "📝",
    rarity: "common",
    condition: (stats) => stats.notesCreated >= 25,
    progress: (stats) => ({ current: Math.min(stats.notesCreated, 25), total: 25 }),
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Complete 10 tasks before 9 AM",
    icon: "🌅",
    rarity: "rare",
    condition: (stats) => stats.earlyBird >= 10,
    progress: (stats) => ({ current: Math.min(stats.earlyBird, 10), total: 10 }),
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Have 5 perfect days (all planned tasks completed)",
    icon: "💎",
    rarity: "epic",
    condition: (stats) => stats.perfectDays >= 5,
    progress: (stats) => ({ current: Math.min(stats.perfectDays, 5), total: 5 }),
  },
]

export function getUserStats(): UserStats {
  if (typeof window === "undefined") {
    return {
      tasksCompleted: 0,
      pomodoroSessions: 0,
      totalFocusTime: 0,
      streakDays: 0,
      notesCreated: 0,
      wishlistItems: 0,
      loginDays: 0,
      perfectDays: 0,
      earlyBird: 0,
      nightOwl: 0,
      weekendWarrior: 0,
    }
  }

  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
  const completedTasks = tasks.filter((task: any) => task.completed)
  const pomodoroStats = JSON.parse(localStorage.getItem("pomodoroStats") || "{}")
  const notes = JSON.parse(localStorage.getItem("notes") || "[]")
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
  const streakData = JSON.parse(localStorage.getItem("streakData") || "{}")

  // Calculate early bird tasks (completed before 9 AM)
  const earlyBirdTasks = completedTasks.filter((task: any) => {
    if (task.completedAt) {
      const completedTime = new Date(task.completedAt)
      return completedTime.getHours() < 9
    }
    return false
  })

  // Calculate perfect days
  const tasksByDate: { [key: string]: any[] } = {}
  tasks.forEach((task: any) => {
    const date = new Date(task.createdAt || Date.now()).toDateString()
    if (!tasksByDate[date]) tasksByDate[date] = []
    tasksByDate[date].push(task)
  })

  let perfectDays = 0
  Object.values(tasksByDate).forEach((dayTasks) => {
    const allCompleted = dayTasks.every((task) => task.completed)
    if (allCompleted && dayTasks.length > 0) perfectDays++
  })

  return {
    tasksCompleted: completedTasks.length,
    pomodoroSessions: pomodoroStats.sessionsCompleted || 0,
    totalFocusTime: pomodoroStats.totalFocusTime || 0,
    streakDays: streakData.currentStreak || 0,
    notesCreated: notes.length,
    wishlistItems: wishlist.length,
    loginDays: streakData.loginDays || 0,
    perfectDays,
    earlyBird: earlyBirdTasks.length,
    nightOwl: 0, // Can be calculated similarly
    weekendWarrior: 0, // Can be calculated similarly
  }
}

export function getAchievements(): Achievement[] {
  return achievements
}

export function getUserAchievements(): Achievement[] {
  if (typeof window === "undefined") return []

  const unlockedAchievements = JSON.parse(localStorage.getItem("unlockedAchievements") || "[]")
  const stats = getUserStats()

  return achievements
    .map((achievement) => {
      const unlocked = unlockedAchievements.find((ua: any) => ua.id === achievement.id)
      return {
        ...achievement,
        unlockedAt: unlocked ? new Date(unlocked.unlockedAt) : undefined,
      }
    })
    .filter((achievement) => achievement.unlockedAt || achievement.condition(stats))
}

export function checkAndUnlockAchievements(): Achievement[] {
  if (typeof window === "undefined") return []

  const stats = getUserStats()
  const unlockedAchievements = JSON.parse(localStorage.getItem("unlockedAchievements") || "[]")
  const newlyUnlocked: Achievement[] = []

  achievements.forEach((achievement) => {
    const alreadyUnlocked = unlockedAchievements.some((ua: any) => ua.id === achievement.id)

    if (!alreadyUnlocked && achievement.condition(stats)) {
      const unlockedAchievement = {
        ...achievement,
        unlockedAt: new Date(),
      }

      unlockedAchievements.push({
        id: achievement.id,
        unlockedAt: new Date().toISOString(),
      })

      newlyUnlocked.push(unlockedAchievement)
    }
  })

  if (newlyUnlocked.length > 0) {
    localStorage.setItem("unlockedAchievements", JSON.stringify(unlockedAchievements))
  }

  return newlyUnlocked
}
