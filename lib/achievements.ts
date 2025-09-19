// Achievements System
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "productivity" | "social" | "milestone" | "special"
  difficulty: "easy" | "medium" | "hard" | "legendary"
  points: number
  requirements: {
    type: string
    target: number
    timeframe?: string
  }
  unlocked?: boolean
  unlockedAt?: Date
  progress?: number
}

export const ACHIEVEMENTS: Achievement[] = [
  // Productivity Achievements
  {
    id: "first_task",
    name: "Primer Paso",
    description: "Completa tu primera tarea",
    icon: "✅",
    category: "productivity",
    difficulty: "easy",
    points: 10,
    requirements: {
      type: "tasks_completed",
      target: 1,
    },
  },
  {
    id: "task_master",
    name: "Maestro de Tareas",
    description: "Completa 100 tareas",
    icon: "🏆",
    category: "productivity",
    difficulty: "medium",
    points: 100,
    requirements: {
      type: "tasks_completed",
      target: 100,
    },
  },
  {
    id: "productivity_beast",
    name: "Bestia Productiva",
    description: "Completa 1000 tareas",
    icon: "🦁",
    category: "productivity",
    difficulty: "hard",
    points: 500,
    requirements: {
      type: "tasks_completed",
      target: 1000,
    },
  },
  {
    id: "streak_warrior",
    name: "Guerrero de Rachas",
    description: "Mantén una racha de 30 días completando tareas",
    icon: "🔥",
    category: "productivity",
    difficulty: "hard",
    points: 300,
    requirements: {
      type: "daily_streak",
      target: 30,
    },
  },
  {
    id: "early_bird",
    name: "Madrugador",
    description: "Completa 50 tareas antes de las 8 AM",
    icon: "🌅",
    category: "productivity",
    difficulty: "medium",
    points: 150,
    requirements: {
      type: "early_tasks",
      target: 50,
    },
  },

  // Social Achievements
  {
    id: "note_taker",
    name: "Tomador de Notas",
    description: "Crea 50 notas",
    icon: "📝",
    category: "social",
    difficulty: "easy",
    points: 50,
    requirements: {
      type: "notes_created",
      target: 50,
    },
  },
  {
    id: "ai_enthusiast",
    name: "Entusiasta de IA",
    description: "Usa el asistente IA 100 veces",
    icon: "🤖",
    category: "social",
    difficulty: "medium",
    points: 200,
    requirements: {
      type: "ai_queries",
      target: 100,
    },
  },

  // Milestone Achievements
  {
    id: "week_warrior",
    name: "Guerrero Semanal",
    description: "Usa la app durante 7 días consecutivos",
    icon: "📅",
    category: "milestone",
    difficulty: "easy",
    points: 75,
    requirements: {
      type: "login_streak",
      target: 7,
    },
  },
  {
    id: "month_master",
    name: "Maestro Mensual",
    description: "Usa la app durante 30 días consecutivos",
    icon: "🗓️",
    category: "milestone",
    difficulty: "medium",
    points: 250,
    requirements: {
      type: "login_streak",
      target: 30,
    },
  },
  {
    id: "year_legend",
    name: "Leyenda Anual",
    description: "Usa la app durante 365 días consecutivos",
    icon: "👑",
    category: "milestone",
    difficulty: "legendary",
    points: 1000,
    requirements: {
      type: "login_streak",
      target: 365,
    },
  },

  // Special Achievements
  {
    id: "wishlist_dreamer",
    name: "Soñador de Deseos",
    description: "Agrega 25 elementos a tu lista de deseos",
    icon: "⭐",
    category: "special",
    difficulty: "easy",
    points: 100,
    requirements: {
      type: "wishlist_items",
      target: 25,
    },
  },
  {
    id: "goal_crusher",
    name: "Destructor de Metas",
    description: "Completa 10 elementos de tu lista de deseos",
    icon: "💪",
    category: "special",
    difficulty: "medium",
    points: 300,
    requirements: {
      type: "wishlist_completed",
      target: 10,
    },
  },
  {
    id: "perfectionist",
    name: "Perfeccionista",
    description: "Completa todas las tareas de un día sin fallar ninguna",
    icon: "💎",
    category: "special",
    difficulty: "hard",
    points: 400,
    requirements: {
      type: "perfect_day",
      target: 1,
    },
  },
]

export interface UserAchievement {
  userId: string
  achievementId: string
  unlockedAt: Date
  progress: number
}

export interface UserStats {
  userId: string
  tasksCompleted: number
  notesCreated: number
  aiQueriesUsed: number
  loginStreak: number
  maxLoginStreak: number
  wishlistItems: number
  wishlistCompleted: number
  totalPoints: number
  lastActive: Date
}

export interface AchievementStats {
  totalAchievements: number
  unlockedAchievements: number
  totalPoints: number
  earnedPoints: number
  completionPercentage: number
  recentAchievements: Achievement[]
  nextAchievements: Achievement[]
}

// Check and award achievements
export async function checkAchievements(userId: string, stats: UserStats): Promise<Achievement[]> {
  const newAchievements: Achievement[] = []
  const userAchievements = await getUserAchievements(userId)
  const unlockedIds = userAchievements.map((ua) => ua.achievementId)

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.includes(achievement.id)) {
      continue // Already unlocked
    }

    const progress = calculateAchievementProgress(achievement, stats)
    if (progress >= achievement.requirements.target) {
      // Achievement unlocked!
      await unlockAchievement(userId, achievement.id)
      newAchievements.push({
        ...achievement,
        unlocked: true,
        unlockedAt: new Date(),
        progress: achievement.requirements.target,
      })
    }
  }

  return newAchievements
}

// Check and unlock achievements based on action type
export async function checkAndUnlockAchievements(userId: string, actionType: string): Promise<Achievement[]> {
  try {
    const stats = await getUserStats(userId)
    const userAchievements = await getUserAchievements(userId)
    const unlockedIds = userAchievements.map((ua) => ua.achievementId)
    const newAchievements: Achievement[] = []

    for (const achievement of ACHIEVEMENTS) {
      if (unlockedIds.includes(achievement.id)) {
        continue // Already unlocked
      }

      const progress = calculateAchievementProgress(achievement, stats)
      if (progress >= achievement.requirements.target) {
        // Achievement unlocked!
        await unlockAchievement(userId, achievement.id)
        newAchievements.push({
          ...achievement,
          unlocked: true,
          unlockedAt: new Date(),
          progress: achievement.requirements.target,
        })
      }
    }

    return newAchievements
  } catch (error) {
    console.error("Error checking achievements:", error)
    return []
  }
}

// Calculate achievement progress
function calculateAchievementProgress(achievement: Achievement, stats: UserStats): number {
  switch (achievement.requirements.type) {
    case "tasks_completed":
      return stats.tasksCompleted
    case "notes_created":
      return stats.notesCreated
    case "ai_queries":
      return stats.aiQueriesUsed
    case "login_streak":
    case "daily_streak":
      return stats.loginStreak
    case "wishlist_items":
      return stats.wishlistItems
    case "wishlist_completed":
      return stats.wishlistCompleted
    case "early_tasks":
      // This would need additional tracking
      return 0
    case "perfect_day":
      // This would need additional tracking
      return 0
    default:
      return 0
  }
}

// Get user achievements
export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  try {
    // This would fetch from database
    // For now, return empty array as demo
    return []
  } catch (error) {
    console.error("Error getting user achievements:", error)
    return []
  }
}

// Unlock achievement
export async function unlockAchievement(userId: string, achievementId: string): Promise<void> {
  try {
    // This would update the database
    console.log(`Unlocking achievement ${achievementId} for user ${userId}`)

    // Award points
    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId)
    if (achievement) {
      await awardPoints(userId, achievement.points)
    }
  } catch (error) {
    console.error("Error unlocking achievement:", error)
  }
}

// Award points to user
export async function awardPoints(userId: string, points: number): Promise<void> {
  try {
    // This would update user's total points in database
    console.log(`Awarding ${points} points to user ${userId}`)
  } catch (error) {
    console.error("Error awarding points:", error)
  }
}

// Get user stats
export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    // This would fetch from database
    // For now, return default stats
    return {
      userId,
      tasksCompleted: 0,
      notesCreated: 0,
      aiQueriesUsed: 0,
      loginStreak: 1,
      maxLoginStreak: 1,
      wishlistItems: 0,
      wishlistCompleted: 0,
      totalPoints: 0,
      lastActive: new Date(),
    }
  } catch (error) {
    console.error("Error getting user stats:", error)
    return {
      userId,
      tasksCompleted: 0,
      notesCreated: 0,
      aiQueriesUsed: 0,
      loginStreak: 0,
      maxLoginStreak: 0,
      wishlistItems: 0,
      wishlistCompleted: 0,
      totalPoints: 0,
      lastActive: new Date(),
    }
  }
}

// Update user stats
export async function updateUserStats(userId: string, updates: Partial<UserStats>): Promise<void> {
  try {
    // This would update the database
    console.log(`Updating stats for user ${userId}:`, updates)
  } catch (error) {
    console.error("Error updating user stats:", error)
  }
}

// Get achievements by category
export function getAchievementsByCategory(category: Achievement["category"]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category)
}

// Get achievements by difficulty
export function getAchievementsByDifficulty(difficulty: Achievement["difficulty"]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.difficulty === difficulty)
}

// Calculate total possible points
export function getTotalPossiblePoints(): number {
  return ACHIEVEMENTS.reduce((total, achievement) => total + achievement.points, 0)
}

// Get user achievement progress
export async function getUserAchievementProgress(userId: string): Promise<(Achievement & { progress: number })[]> {
  try {
    const stats = await getUserStats(userId)
    const userAchievements = await getUserAchievements(userId)
    const unlockedIds = userAchievements.map((ua) => ua.achievementId)

    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: unlockedIds.includes(achievement.id),
      progress: calculateAchievementProgress(achievement, stats),
    }))
  } catch (error) {
    console.error("Error getting user achievement progress:", error)
    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: false,
      progress: 0,
    }))
  }
}

// Get achievement statistics for a user
export async function getAchievementStats(userId: string): Promise<AchievementStats> {
  try {
    const userAchievements = await getUserAchievements(userId)
    const userProgress = await getUserAchievementProgress(userId)

    const totalAchievements = ACHIEVEMENTS.length
    const unlockedAchievements = userAchievements.length
    const totalPoints = getTotalPossiblePoints()
    const earnedPoints = userAchievements.reduce((total, ua) => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === ua.achievementId)
      return total + (achievement?.points || 0)
    }, 0)

    const completionPercentage = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0

    // Get recent achievements (last 5)
    const recentAchievements = userAchievements
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
      .slice(0, 5)
      .map((ua) => ACHIEVEMENTS.find((a) => a.id === ua.achievementId))
      .filter(Boolean) as Achievement[]

    // Get next achievements (closest to completion)
    const nextAchievements = userProgress
      .filter((a) => !a.unlocked && a.progress > 0)
      .sort((a, b) => b.progress / b.requirements.target - a.progress / a.requirements.target)
      .slice(0, 3)

    return {
      totalAchievements,
      unlockedAchievements,
      totalPoints,
      earnedPoints,
      completionPercentage,
      recentAchievements,
      nextAchievements,
    }
  } catch (error) {
    console.error("Error getting achievement stats:", error)
    return {
      totalAchievements: ACHIEVEMENTS.length,
      unlockedAchievements: 0,
      totalPoints: getTotalPossiblePoints(),
      earnedPoints: 0,
      completionPercentage: 0,
      recentAchievements: [],
      nextAchievements: [],
    }
  }
}

// Check and award achievements (alias for compatibility)
export const checkAndAwardAchievements = checkAndUnlockAchievements
