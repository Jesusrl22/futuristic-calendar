export interface Achievement {
  id: string
  userId: string
  type: string
  title: string
  description: string
  unlockedAt: string
  progress?: number
  maxProgress?: number
  icon?: string
  category?: string
  rarity?: "common" | "rare" | "epic" | "legendary" | "uncommon"
  points?: number
}

export interface AchievementRule {
  id: string
  type: string
  title: string
  description: string
  icon: string
  category: string
  rarity: "common" | "rare" | "epic" | "legendary" | "uncommon"
  points: number
  condition: (userId: string, data?: any) => Promise<boolean>
  maxProgress?: number
  getProgress?: (userId: string) => Promise<number>
}

// Achievement rules and definitions
export const ACHIEVEMENT_RULES: AchievementRule[] = [
  // Task-related achievements
  {
    id: "first_task",
    type: "task_created",
    title: "Primera Tarea",
    description: "Completa tu primera tarea",
    icon: "🎯",
    category: "Tareas",
    rarity: "common",
    points: 10,
    condition: async (userId: string) => {
      // This would check if user has created at least one task
      return true // Simplified for demo
    },
  },
  {
    id: "task_master",
    type: "tasks_completed",
    title: "Maestro de Tareas",
    description: "Completa 10 tareas",
    icon: "🏆",
    category: "Tareas",
    rarity: "rare",
    points: 50,
    maxProgress: 10,
    condition: async (userId: string) => {
      // This would check if user has completed 10 tasks
      return false // Simplified for demo
    },
    getProgress: async (userId: string) => {
      // This would return current number of completed tasks
      return 4 // Simplified for demo
    },
  },

  // Login-related achievements
  {
    id: "welcome",
    type: "login",
    title: "¡Bienvenido!",
    description: "Inicia sesión por primera vez",
    icon: "👋",
    category: "General",
    rarity: "common",
    points: 5,
    condition: async (userId: string) => {
      return true // Always unlock on first login
    },
  },
  {
    id: "loyal_user",
    type: "login_streak",
    title: "Usuario Leal",
    description: "Inicia sesión 7 días consecutivos",
    icon: "🔥",
    category: "General",
    rarity: "epic",
    points: 100,
    maxProgress: 7,
    condition: async (userId: string) => {
      return false // Simplified for demo
    },
    getProgress: async (userId: string) => {
      return 3 // Simplified for demo
    },
  },

  // Subscription-related achievements
  {
    id: "premium_user",
    type: "subscription_upgrade",
    title: "Usuario Premium",
    description: "Actualiza a un plan premium",
    icon: "⭐",
    category: "Suscripción",
    rarity: "rare",
    points: 75,
    condition: async (userId: string) => {
      return true // Unlock when upgrading to premium
    },
  },
  {
    id: "pro_user",
    type: "subscription_upgrade",
    title: "Usuario Pro",
    description: "Actualiza al plan Pro",
    icon: "👑",
    category: "Suscripción",
    rarity: "epic",
    points: 150,
    condition: async (userId: string) => {
      return true // Unlock when upgrading to pro
    },
  },

  // AI-related achievements
  {
    id: "ai_explorer",
    type: "ai_usage",
    title: "Explorador IA",
    description: "Usa el asistente IA por primera vez",
    icon: "🤖",
    category: "IA",
    rarity: "common",
    points: 25,
    condition: async (userId: string) => {
      return true // Unlock on first AI usage
    },
  },
  {
    id: "ai_power_user",
    type: "credits_purchase",
    title: "Usuario Avanzado IA",
    description: "Compra créditos IA",
    icon: "🧠",
    category: "IA",
    rarity: "rare",
    points: 100,
    condition: async (userId: string) => {
      return true // Unlock when purchasing AI credits
    },
  },

  // Productivity achievements
  {
    id: "productive_day",
    type: "daily_productivity",
    title: "Día Productivo",
    description: "Completa 10 tareas en un día",
    icon: "🚀",
    category: "Productividad",
    rarity: "common",
    points: 30,
    condition: async (userId: string) => {
      return false // Simplified for demo
    },
  },
  {
    id: "productivity_master",
    type: "weekly_productivity",
    title: "Maestro de Productividad",
    description: "Mantén una racha de productividad de 30 días",
    icon: "🏅",
    category: "Productividad",
    rarity: "legendary",
    points: 500,
    maxProgress: 30,
    condition: async (userId: string) => {
      return false // Simplified for demo
    },
    getProgress: async (userId: string) => {
      return 12 // Simplified for demo
    },
  },
  {
    id: "early_bird",
    type: "task_completed_before_8am",
    title: "Madrugador",
    description: "Completa una tarea antes de las 8 AM",
    icon: "🌅",
    category: "Productividad",
    rarity: "uncommon",
    points: 25,
    condition: async (userId: string) => {
      return false // Simplified for demo
    },
  },
  {
    id: "streak_week",
    type: "weekly_streak",
    title: "Racha Semanal",
    description: "Mantén una racha de 7 días",
    icon: "🔥",
    category: "General",
    rarity: "epic",
    points: 100,
    maxProgress: 7,
    condition: async (userId: string) => {
      return false // Simplified for demo
    },
    getProgress: async (userId: string) => {
      return 3 // Simplified for demo
    },
  },
]

// Achievement definitions
export const ACHIEVEMENTS = [
  {
    id: "first_task",
    name: "Primera Tarea",
    description: "Completa tu primera tarea",
    icon: "🎯",
    rarity: "common",
    points: 10,
  },
  {
    id: "task_master",
    name: "Maestro de Tareas",
    description: "Completa 10 tareas",
    icon: "🏆",
    rarity: "rare",
    points: 50,
  },
  {
    id: "early_bird",
    name: "Madrugador",
    description: "Completa una tarea antes de las 8 AM",
    icon: "🌅",
    rarity: "uncommon",
    points: 25,
  },
  {
    id: "streak_week",
    name: "Racha Semanal",
    description: "Mantén una racha de 7 días",
    icon: "🔥",
    rarity: "epic",
    points: 100,
  },
]

// Get user achievements
export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  const achievements = JSON.parse(localStorage.getItem(`achievements_${userId}`) || "[]")
  return achievements
}

// Check and unlock achievements
export async function checkAndUnlockAchievements(
  userId: string,
  triggerType: string,
  data?: any,
): Promise<Achievement[]> {
  const unlockedAchievements: Achievement[] = []
  const existingAchievements = await getUserAchievements(userId)
  const existingIds = existingAchievements.map((a) => a.id)

  for (const rule of ACHIEVEMENT_RULES) {
    // Skip if already unlocked
    if (existingIds.includes(rule.id)) continue

    // Skip if trigger type doesn't match
    if (rule.type !== triggerType && triggerType !== "check_all") continue

    try {
      const shouldUnlock = await rule.condition(userId, data)
      if (shouldUnlock) {
        const newAchievement: Achievement = {
          id: rule.id,
          userId,
          type: rule.type,
          title: rule.title,
          description: rule.description,
          unlockedAt: new Date().toISOString(),
          icon: rule.icon,
          category: rule.category,
          rarity: rule.rarity,
          points: rule.points,
        }

        // Add progress if applicable
        if (rule.maxProgress && rule.getProgress) {
          newAchievement.progress = await rule.getProgress(userId)
          newAchievement.maxProgress = rule.maxProgress
        }

        // Store achievement
        const updatedAchievements = [...existingAchievements, newAchievement]
        localStorage.setItem(`achievements_${userId}`, JSON.stringify(updatedAchievements))
        unlockedAchievements.push(newAchievement)
      }
    } catch (error) {
      console.error(`Error checking achievement ${rule.id}:`, error)
    }
  }

  return unlockedAchievements
}

// Alias for compatibility
export const checkAndAwardAchievements = checkAndUnlockAchievements

// Get achievement statistics
export function getAchievementStats(achievements: Achievement[]) {
  const totalPoints = achievements.reduce((sum, achievement) => sum + (achievement.points || 0), 0)
  const byCategory = achievements.reduce(
    (acc, achievement) => {
      const category = achievement.category || "General"
      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const byRarity = achievements.reduce(
    (acc, achievement) => {
      const rarity = achievement.rarity || "common"
      acc[rarity] = (acc[rarity] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    total: achievements.length,
    totalPoints,
    byCategory,
    byRarity,
    completionRate: Math.round((achievements.length / ACHIEVEMENT_RULES.length) * 100),
  }
}

// Get user level based on points
export function getUserLevel(totalPoints: number): { level: number; pointsToNext: number; title: string } {
  const levels = [
    { level: 1, points: 0, title: "Novato" },
    { level: 2, points: 100, title: "Principiante" },
    { level: 3, points: 250, title: "Intermedio" },
    { level: 4, points: 500, title: "Avanzado" },
    { level: 5, points: 1000, title: "Experto" },
    { level: 6, points: 2000, title: "Maestro" },
    { level: 7, points: 4000, title: "Leyenda" },
  ]

  let currentLevel = levels[0]
  let nextLevel = levels[1]

  for (let i = 0; i < levels.length - 1; i++) {
    if (totalPoints >= levels[i].points && totalPoints < levels[i + 1].points) {
      currentLevel = levels[i]
      nextLevel = levels[i + 1]
      break
    } else if (totalPoints >= levels[levels.length - 1].points) {
      currentLevel = levels[levels.length - 1]
      nextLevel = levels[levels.length - 1] // Max level
      break
    }
  }

  const pointsToNext = nextLevel.points - totalPoints

  return {
    level: currentLevel.level,
    pointsToNext: Math.max(0, pointsToNext),
    title: currentLevel.title,
  }
}

// Create sample achievements for demo users
export async function createSampleAchievements(userId: string): Promise<void> {
  const sampleAchievements: Achievement[] = [
    {
      id: "welcome",
      userId,
      type: "login",
      title: "¡Bienvenido!",
      description: "Inicia sesión por primera vez",
      unlockedAt: new Date().toISOString(),
      icon: "👋",
      category: "General",
      rarity: "common",
      points: 5,
    },
    {
      id: "first_task",
      userId,
      type: "task_created",
      title: "Primera Tarea",
      description: "Completa tu primera tarea",
      unlockedAt: new Date().toISOString(),
      icon: "🎯",
      category: "Tareas",
      rarity: "common",
      points: 10,
    },
  ]

  localStorage.setItem(`achievements_${userId}`, JSON.stringify(sampleAchievements))
}

export default {
  getUserAchievements,
  checkAndUnlockAchievements,
  checkAndAwardAchievements,
  getAchievementStats,
  getUserLevel,
  createSampleAchievements,
  ACHIEVEMENT_RULES,
  ACHIEVEMENTS,
}
