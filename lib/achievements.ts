export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "basic" | "premium" | "pro"
  type: "wishlist_complete" | "task_complete" | "upgrade_premium" | "upgrade_pro" | "daily_login" | "ai_usage"
  target: number
  points: number
  unlocked: boolean
  progress: number
  unlockedAt?: string
}

export interface UserAchievement {
  userId: string
  achievementId: string
  progress: number
  unlocked: boolean
  unlockedAt?: string
}

// In-memory storage for user achievements
const userAchievements: UserAchievement[] = []

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Basic achievements (available to all users)
  {
    id: "first_wishlist",
    name: "Primera Meta",
    description: "Completa tu primera meta de la lista de deseos",
    icon: "🎯",
    category: "basic",
    type: "wishlist_complete",
    target: 1,
    points: 10,
    unlocked: false,
    progress: 0,
  },
  {
    id: "wishlist_master",
    name: "Maestro de Metas",
    description: "Completa 5 metas de tu lista de deseos",
    icon: "🏆",
    category: "basic",
    type: "wishlist_complete",
    target: 5,
    points: 50,
    unlocked: false,
    progress: 0,
  },
  {
    id: "dream_achiever",
    name: "Realizador de Sueños",
    description: "Completa 10 metas de tu lista de deseos",
    icon: "⭐",
    category: "basic",
    type: "wishlist_complete",
    target: 10,
    points: 100,
    unlocked: false,
    progress: 0,
  },
  {
    id: "first_task",
    name: "Primer Paso",
    description: "Completa tu primera tarea",
    icon: "✅",
    category: "basic",
    type: "task_complete",
    target: 1,
    points: 5,
    unlocked: false,
    progress: 0,
  },
  {
    id: "productive_day",
    name: "Día Productivo",
    description: "Completa 5 tareas en un día",
    icon: "🚀",
    category: "basic",
    type: "task_complete",
    target: 5,
    points: 25,
    unlocked: false,
    progress: 0,
  },
  {
    id: "task_master",
    name: "Maestro de Tareas",
    description: "Completa 50 tareas en total",
    icon: "🎖️",
    category: "basic",
    type: "task_complete",
    target: 50,
    points: 200,
    unlocked: false,
    progress: 0,
  },
  {
    id: "early_bird",
    name: "Madrugador",
    description: "Inicia sesión antes de las 7:00 AM",
    icon: "🌅",
    category: "basic",
    type: "daily_login",
    target: 1,
    points: 15,
    unlocked: false,
    progress: 0,
  },
  {
    id: "night_owl",
    name: "Búho Nocturno",
    description: "Completa una tarea después de las 10:00 PM",
    icon: "🦉",
    category: "basic",
    type: "task_complete",
    target: 1,
    points: 15,
    unlocked: false,
    progress: 0,
  },

  // Premium achievements
  {
    id: "premium_welcome",
    name: "Bienvenido Premium",
    description: "Actualiza tu cuenta a Premium",
    icon: "👑",
    category: "premium",
    type: "upgrade_premium",
    target: 1,
    points: 100,
    unlocked: false,
    progress: 0,
  },
  {
    id: "note_taker",
    name: "Tomador de Notas",
    description: "Crea tu primera nota",
    icon: "📝",
    category: "premium",
    type: "task_complete",
    target: 1,
    points: 20,
    unlocked: false,
    progress: 0,
  },
  {
    id: "organized_mind",
    name: "Mente Organizada",
    description: "Crea 10 notas",
    icon: "🧠",
    category: "premium",
    type: "task_complete",
    target: 10,
    points: 75,
    unlocked: false,
    progress: 0,
  },
  {
    id: "goal_setter",
    name: "Establecedor de Metas",
    description: "Agrega 3 metas a tu lista de deseos",
    icon: "🎯",
    category: "premium",
    type: "wishlist_complete",
    target: 3,
    points: 30,
    unlocked: false,
    progress: 0,
  },
  {
    id: "persistent",
    name: "Persistente",
    description: "Usa la aplicación durante 7 días consecutivos",
    icon: "💪",
    category: "premium",
    type: "daily_login",
    target: 7,
    points: 150,
    unlocked: false,
    progress: 0,
  },
  {
    id: "dedicated",
    name: "Dedicado",
    description: "Usa la aplicación durante 30 días consecutivos",
    icon: "🔥",
    category: "premium",
    type: "daily_login",
    target: 30,
    points: 500,
    unlocked: false,
    progress: 0,
  },

  // Pro achievements
  {
    id: "pro_welcome",
    name: "Bienvenido Pro",
    description: "Actualiza tu cuenta a Pro",
    icon: "✨",
    category: "pro",
    type: "upgrade_pro",
    target: 1,
    points: 200,
    unlocked: false,
    progress: 0,
  },
  {
    id: "ai_explorer",
    name: "Explorador IA",
    description: "Usa el asistente IA por primera vez",
    icon: "🤖",
    category: "pro",
    type: "ai_usage",
    target: 1,
    points: 50,
    unlocked: false,
    progress: 0,
  },
  {
    id: "ai_enthusiast",
    name: "Entusiasta IA",
    description: "Usa el asistente IA 10 veces",
    icon: "🧠",
    category: "pro",
    type: "ai_usage",
    target: 10,
    points: 150,
    unlocked: false,
    progress: 0,
  },
  {
    id: "ai_master",
    name: "Maestro IA",
    description: "Usa el asistente IA 50 veces",
    icon: "🎓",
    category: "pro",
    type: "ai_usage",
    target: 50,
    points: 500,
    unlocked: false,
    progress: 0,
  },
  {
    id: "efficiency_expert",
    name: "Experto en Eficiencia",
    description: "Completa 100 tareas usando IA",
    icon: "⚡",
    category: "pro",
    type: "task_complete",
    target: 100,
    points: 750,
    unlocked: false,
    progress: 0,
  },
  {
    id: "future_visionary",
    name: "Visionario del Futuro",
    description: "Usa todas las funciones Pro durante una semana",
    icon: "🔮",
    category: "pro",
    type: "daily_login",
    target: 7,
    points: 1000,
    unlocked: false,
    progress: 0,
  },
]

export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  const userAchievementData = userAchievements.filter((ua) => ua.userId === userId)

  return ACHIEVEMENTS.map((achievement) => {
    const userProgress = userAchievementData.find((ua) => ua.achievementId === achievement.id)
    return {
      ...achievement,
      progress: userProgress?.progress || 0,
      unlocked: userProgress?.unlocked || false,
      unlockedAt: userProgress?.unlockedAt,
    }
  })
}

export async function checkAndAwardAchievements(
  userId: string,
  type: Achievement["type"],
  increment = 1,
): Promise<Achievement[]> {
  console.log(`🏆 Checking achievements for user ${userId}, type: ${type}, increment: ${increment}`)

  const relevantAchievements = ACHIEVEMENTS.filter((a) => a.type === type)
  const newlyUnlocked: Achievement[] = []

  for (const achievement of relevantAchievements) {
    let userAchievement = userAchievements.find((ua) => ua.userId === userId && ua.achievementId === achievement.id)

    if (!userAchievement) {
      userAchievement = {
        userId,
        achievementId: achievement.id,
        progress: 0,
        unlocked: false,
      }
      userAchievements.push(userAchievement)
    }

    if (!userAchievement.unlocked) {
      userAchievement.progress = Math.min(userAchievement.progress + increment, achievement.target)

      if (userAchievement.progress >= achievement.target) {
        userAchievement.unlocked = true
        userAchievement.unlockedAt = new Date().toISOString()

        const unlockedAchievement = {
          ...achievement,
          progress: userAchievement.progress,
          unlocked: true,
          unlockedAt: userAchievement.unlockedAt,
        }

        newlyUnlocked.push(unlockedAchievement)
        console.log(`🎉 Achievement unlocked: ${achievement.name}`)
      }
    }
  }

  return newlyUnlocked
}

export async function getAchievementStats(userId: string): Promise<{
  total: number
  unlocked: number
  points: number
  categories: { [key: string]: { total: number; unlocked: number } }
}> {
  const achievements = await getUserAchievements(userId)
  const unlocked = achievements.filter((a) => a.unlocked)
  const points = unlocked.reduce((sum, a) => sum + a.points, 0)

  const categories = {
    basic: { total: 0, unlocked: 0 },
    premium: { total: 0, unlocked: 0 },
    pro: { total: 0, unlocked: 0 },
  }

  achievements.forEach((a) => {
    categories[a.category].total++
    if (a.unlocked) {
      categories[a.category].unlocked++
    }
  })

  return {
    total: achievements.length,
    unlocked: unlocked.length,
    points,
    categories,
  }
}
