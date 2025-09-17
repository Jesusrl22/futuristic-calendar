import { createClient } from "@/lib/supabase"

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "basic" | "premium" | "pro"
  points: number
  condition: (user: any) => boolean
  unlocked?: boolean
  unlockedAt?: Date
}

export const ACHIEVEMENTS: Achievement[] = [
  // Basic Achievements
  {
    id: "first_task",
    title: "Primera Tarea",
    description: "Completa tu primera tarea",
    icon: "✅",
    category: "basic",
    points: 10,
    condition: (user) => user.tasksCompleted >= 1,
  },
  {
    id: "task_master",
    title: "Maestro de Tareas",
    description: "Completa 10 tareas",
    icon: "🏆",
    category: "basic",
    points: 50,
    condition: (user) => user.tasksCompleted >= 10,
  },
  {
    id: "week_warrior",
    title: "Guerrero Semanal",
    description: "Completa tareas durante 7 días consecutivos",
    icon: "⚔️",
    category: "basic",
    points: 100,
    condition: (user) => user.streakDays >= 7,
  },
  {
    id: "early_bird",
    title: "Madrugador",
    description: "Completa una tarea antes de las 8 AM",
    icon: "🌅",
    category: "basic",
    points: 25,
    condition: (user) => user.earlyTasksCompleted >= 1,
  },
  {
    id: "night_owl",
    title: "Búho Nocturno",
    description: "Completa una tarea después de las 10 PM",
    icon: "🦉",
    category: "basic",
    points: 25,
    condition: (user) => user.lateTasksCompleted >= 1,
  },
  {
    id: "organizer",
    title: "Organizador",
    description: "Crea 5 categorías diferentes",
    icon: "📁",
    category: "basic",
    points: 30,
    condition: (user) => user.categoriesCreated >= 5,
  },

  // Premium Achievements
  {
    id: "premium_user",
    title: "Usuario Premium",
    description: "Actualiza a Premium",
    icon: "💎",
    category: "premium",
    points: 200,
    condition: (user) => user.plan === "premium" || user.plan === "pro",
  },
  {
    id: "wishlist_master",
    title: "Maestro de Deseos",
    description: "Agrega 10 elementos a tu wishlist",
    icon: "⭐",
    category: "premium",
    points: 75,
    condition: (user) => user.wishlistItems >= 10,
  },
  {
    id: "note_taker",
    title: "Tomador de Notas",
    description: "Crea 20 notas",
    icon: "📝",
    category: "premium",
    points: 60,
    condition: (user) => user.notesCreated >= 20,
  },
  {
    id: "calendar_pro",
    title: "Pro del Calendario",
    description: "Programa 50 eventos",
    icon: "📅",
    category: "premium",
    points: 100,
    condition: (user) => user.eventsCreated >= 50,
  },
  {
    id: "productivity_king",
    title: "Rey de la Productividad",
    description: "Completa 100 tareas",
    icon: "👑",
    category: "premium",
    points: 300,
    condition: (user) => user.tasksCompleted >= 100,
  },
  {
    id: "month_champion",
    title: "Campeón del Mes",
    description: "Mantén una racha de 30 días",
    icon: "🏅",
    category: "premium",
    points: 500,
    condition: (user) => user.streakDays >= 30,
  },

  // Pro Achievements
  {
    id: "pro_user",
    title: "Usuario Pro",
    description: "Actualiza a Pro",
    icon: "🚀",
    category: "pro",
    points: 500,
    condition: (user) => user.plan === "pro",
  },
  {
    id: "ai_enthusiast",
    title: "Entusiasta de IA",
    description: "Usa el asistente IA 50 veces",
    icon: "🤖",
    category: "pro",
    points: 200,
    condition: (user) => user.aiQueriesUsed >= 50,
  },
  {
    id: "ai_master",
    title: "Maestro de IA",
    description: "Usa el asistente IA 200 veces",
    icon: "🧠",
    category: "pro",
    points: 750,
    condition: (user) => user.aiQueriesUsed >= 200,
  },
  {
    id: "credit_collector",
    title: "Coleccionista de Créditos",
    description: "Compra tu primer paquete de créditos IA",
    icon: "💳",
    category: "pro",
    points: 100,
    condition: (user) => user.creditsPurchased > 0,
  },
  {
    id: "power_user",
    title: "Usuario Avanzado",
    description: "Usa todas las funciones Pro",
    icon: "⚡",
    category: "pro",
    points: 1000,
    condition: (user) => user.aiQueriesUsed >= 10 && user.wishlistItems >= 5 && user.notesCreated >= 10,
  },
  {
    id: "legend",
    title: "Leyenda",
    description: "Completa 500 tareas y mantén una racha de 100 días",
    icon: "🌟",
    category: "pro",
    points: 2000,
    condition: (user) => user.tasksCompleted >= 500 && user.streakDays >= 100,
  },
]

export async function getUserAchievements(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("user_achievements").select("*").eq("user_id", userId)

  if (error) {
    console.error("Error fetching user achievements:", error)
    return []
  }

  return data || []
}

export async function checkAndAwardAchievements(userId: string, userStats: any) {
  const supabase = createClient()
  const userAchievements = await getUserAchievements(userId)
  const unlockedAchievementIds = userAchievements.map((a) => a.achievement_id)
  const newAchievements = []

  for (const achievement of ACHIEVEMENTS) {
    if (!unlockedAchievementIds.includes(achievement.id) && achievement.condition(userStats)) {
      // Award the achievement
      const { error } = await supabase.from("user_achievements").insert({
        user_id: userId,
        achievement_id: achievement.id,
        unlocked_at: new Date().toISOString(),
      })

      if (!error) {
        newAchievements.push(achievement)
      }
    }
  }

  return newAchievements
}

export async function updateUserStatsAndCheckAchievements(userId: string, statUpdates: any) {
  const supabase = createClient()

  // Get current user stats
  const { data: currentUser } = await supabase.from("users").select("*").eq("id", userId).single()

  if (!currentUser) return []

  // Update user stats
  const updatedStats = { ...currentUser, ...statUpdates }

  await supabase.from("users").update(statUpdates).eq("id", userId)

  // Check for new achievements
  return await checkAndAwardAchievements(userId, updatedStats)
}

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id)
}

export function getAchievementsByCategory(category: "basic" | "premium" | "pro"): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.category === category)
}

export function calculateTotalPoints(achievements: Achievement[]): number {
  return achievements.reduce((total, achievement) => total + achievement.points, 0)
}

export function getAchievementProgress(user: any, achievement: Achievement): number {
  // This is a simplified progress calculation
  // You might want to implement more sophisticated progress tracking
  if (achievement.condition(user)) {
    return 100
  }

  // Basic progress estimation based on achievement type
  switch (achievement.id) {
    case "task_master":
      return Math.min((user.tasksCompleted / 10) * 100, 100)
    case "week_warrior":
      return Math.min((user.streakDays / 7) * 100, 100)
    case "wishlist_master":
      return Math.min((user.wishlistItems / 10) * 100, 100)
    case "note_taker":
      return Math.min((user.notesCreated / 20) * 100, 100)
    case "calendar_pro":
      return Math.min((user.eventsCreated / 50) * 100, 100)
    case "productivity_king":
      return Math.min((user.tasksCompleted / 100) * 100, 100)
    case "month_champion":
      return Math.min((user.streakDays / 30) * 100, 100)
    case "ai_enthusiast":
      return Math.min((user.aiQueriesUsed / 50) * 100, 100)
    case "ai_master":
      return Math.min((user.aiQueriesUsed / 200) * 100, 100)
    case "legend":
      const taskProgress = Math.min((user.tasksCompleted / 500) * 50, 50)
      const streakProgress = Math.min((user.streakDays / 100) * 50, 50)
      return taskProgress + streakProgress
    default:
      return user.tasksCompleted >= 1 ? 100 : 0
  }
}

export async function getAchievementStats(userId: string) {
  // This function provides statistics about achievements
  const userAchievements = await getUserAchievements(userId)
  const unlockedAchievementIds = userAchievements.map((a) => a.achievement_id)

  const basicAchievements = ACHIEVEMENTS.filter((a) => a.category === "basic")
  const premiumAchievements = ACHIEVEMENTS.filter((a) => a.category === "premium")
  const proAchievements = ACHIEVEMENTS.filter((a) => a.category === "pro")

  const unlockedBasic = basicAchievements.filter((a) => unlockedAchievementIds.includes(a.id))
  const unlockedPremium = premiumAchievements.filter((a) => unlockedAchievementIds.includes(a.id))
  const unlockedPro = proAchievements.filter((a) => unlockedAchievementIds.includes(a.id))

  const totalPoints = calculateTotalPoints(ACHIEVEMENTS)
  const unlockedPoints = calculateTotalPoints([...unlockedBasic, ...unlockedPremium, ...unlockedPro])

  return {
    total: ACHIEVEMENTS.length,
    unlocked: userAchievements.length,
    basic: basicAchievements.length,
    premium: premiumAchievements.length,
    pro: proAchievements.length,
    totalPoints,
    unlockedPoints,
    categories: {
      basic: {
        total: basicAchievements.length,
        unlocked: unlockedBasic.length,
        points: calculateTotalPoints(unlockedBasic),
        totalPoints: calculateTotalPoints(basicAchievements),
      },
      premium: {
        total: premiumAchievements.length,
        unlocked: unlockedPremium.length,
        points: calculateTotalPoints(unlockedPremium),
        totalPoints: calculateTotalPoints(premiumAchievements),
      },
      pro: {
        total: proAchievements.length,
        unlocked: unlockedPro.length,
        points: calculateTotalPoints(unlockedPro),
        totalPoints: calculateTotalPoints(proAchievements),
      },
    },
  }
}

// Alias for backward compatibility
export const checkAndUnlockAchievements = checkAndAwardAchievements
