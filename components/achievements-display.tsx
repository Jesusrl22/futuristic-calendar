"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Star,
  Crown,
  Sparkles,
  Lock,
  CheckCircle,
  Calendar,
  CheckSquare,
  Zap,
  Clock,
  BookOpen,
  Heart,
} from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: "basic" | "premium" | "pro"
  points: number
  unlocked: boolean
  progress: number
  target: number
  unlockedAt?: string
}

interface User {
  id: string
  name: string
  email: string
  plan: "free" | "premium" | "pro"
  [key: string]: any
}

interface AchievementsDisplayProps {
  userId: string
  user?: User | null
  theme?: {
    cardBg: string
    border: string
    textPrimary: string
    textSecondary: string
    textMuted: string
  }
  t?: (key: string) => string
}

export function AchievementsDisplay({ userId, user, theme, t }: AchievementsDisplayProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [stats, setStats] = useState({
    total: 0,
    unlocked: 0,
    points: 0,
    categories: {
      basic: { total: 0, unlocked: 0 },
      premium: { total: 0, unlocked: 0 },
      pro: { total: 0, unlocked: 0 },
    },
  })
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Default theme with modern gradient design
  const defaultTheme = {
    cardBg: "bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm",
    border: "border-slate-700/50",
    textPrimary: "text-white",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-400",
  }

  const currentTheme = theme || defaultTheme
  const translate = t || ((key: string) => key)

  // Check user plan - handle both is_premium/is_pro and plan properties
  const isPremium = user?.is_premium || user?.plan === "premium" || user?.plan === "pro"
  const isPro = user?.is_pro || user?.plan === "pro"

  // Mock achievements data with proper React components
  const mockAchievements: Achievement[] = [
    {
      id: "first-task",
      name: "Primera Tarea",
      description: "Completa tu primera tarea",
      icon: CheckSquare,
      category: "basic",
      points: 10,
      unlocked: true,
      progress: 1,
      target: 1,
      unlockedAt: new Date().toISOString(),
    },
    {
      id: "task-master",
      name: "Maestro de Tareas",
      description: "Completa 10 tareas",
      icon: Trophy,
      category: "basic",
      points: 50,
      unlocked: false,
      progress: 3,
      target: 10,
    },
    {
      id: "premium-user",
      name: "Usuario Premium",
      description: "Actualiza a Premium",
      icon: Crown,
      category: "premium",
      points: 100,
      unlocked: isPremium,
      progress: isPremium ? 1 : 0,
      target: 1,
      unlockedAt: isPremium ? new Date().toISOString() : undefined,
    },
    {
      id: "pro-user",
      name: "Usuario Pro",
      description: "Actualiza a Pro",
      icon: Sparkles,
      category: "pro",
      points: 200,
      unlocked: isPro,
      progress: isPro ? 1 : 0,
      target: 1,
      unlockedAt: isPro ? new Date().toISOString() : undefined,
    },
    {
      id: "note-taker",
      name: "Tomador de Notas",
      description: "Crea 5 notas",
      icon: BookOpen,
      category: "premium",
      points: 30,
      unlocked: false,
      progress: 0,
      target: 5,
    },
    {
      id: "ai-explorer",
      name: "Explorador IA",
      description: "Usa el asistente IA 10 veces",
      icon: Zap,
      category: "pro",
      points: 75,
      unlocked: false,
      progress: 0,
      target: 10,
    },
    {
      id: "calendar-user",
      name: "Usuario del Calendario",
      description: "Usa el calendario por primera vez",
      icon: Calendar,
      category: "basic",
      points: 15,
      unlocked: false,
      progress: 0,
      target: 1,
    },
    {
      id: "time-master",
      name: "Maestro del Tiempo",
      description: "Usa el pomodoro 5 veces",
      icon: Clock,
      category: "basic",
      points: 25,
      unlocked: false,
      progress: 0,
      target: 5,
    },
    {
      id: "wishlist-dreamer",
      name: "Soñador de Deseos",
      description: "Agrega 10 elementos a tu wishlist",
      icon: Heart,
      category: "premium",
      points: 40,
      unlocked: false,
      progress: 0,
      target: 10,
    },
  ]

  useEffect(() => {
    // Simulate loading achievements
    const loadAchievements = async () => {
      try {
        // Load from localStorage or use mock data
        const savedAchievements = localStorage.getItem(`achievements_${userId}`)
        let userAchievements = mockAchievements

        if (savedAchievements) {
          const parsed = JSON.parse(savedAchievements)
          // Map saved achievements to use proper icons
          userAchievements = parsed.map((savedAchievement: any) => {
            const mockAchievement = mockAchievements.find((a) => a.id === savedAchievement.id)
            return {
              ...savedAchievement,
              icon: mockAchievement?.icon || CheckSquare,
            }
          })
        } else {
          localStorage.setItem(
            `achievements_${userId}`,
            JSON.stringify(mockAchievements.map(({ icon, ...rest }) => rest)),
          )
        }

        setAchievements(userAchievements)

        // Calculate stats
        const totalAchievements = userAchievements.length
        const unlockedAchievements = userAchievements.filter((a) => a.unlocked).length
        const totalPoints = userAchievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0)

        const categoryStats = {
          basic: {
            total: userAchievements.filter((a) => a.category === "basic").length,
            unlocked: userAchievements.filter((a) => a.category === "basic" && a.unlocked).length,
          },
          premium: {
            total: userAchievements.filter((a) => a.category === "premium").length,
            unlocked: userAchievements.filter((a) => a.category === "premium" && a.unlocked).length,
          },
          pro: {
            total: userAchievements.filter((a) => a.category === "pro").length,
            unlocked: userAchievements.filter((a) => a.category === "pro" && a.unlocked).length,
          },
        }

        setStats({
          total: totalAchievements,
          unlocked: unlockedAchievements,
          points: totalPoints,
          categories: categoryStats,
        })
      } catch (error) {
        console.error("Error loading achievements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      loadAchievements()
    }
  }, [userId, isPremium, isPro])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basic":
        return <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
      case "premium":
        return <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
      case "pro":
        return <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
      default:
        return <Star className="h-3 w-3 sm:h-4 sm:w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basic":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20"
      case "premium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "pro":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20"
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20"
    }
  }

  const filterAchievements = (achievements: Achievement[]) => {
    switch (activeTab) {
      case "unlocked":
        return achievements.filter((a) => a.unlocked)
      case "locked":
        return achievements.filter((a) => !a.unlocked)
      case "basic":
        return achievements.filter((a) => a.category === "basic")
      case "premium":
        return achievements.filter((a) => a.category === "premium")
      case "pro":
        return achievements.filter((a) => a.category === "pro")
      default:
        return achievements
    }
  }

  if (isLoading) {
    return (
      <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </CardContent>
      </Card>
    )
  }

  if (!userId) {
    return (
      <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
        <CardContent className="flex items-center justify-center py-12">
          <p className={currentTheme.textMuted}>Usuario no encontrado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Overview - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card
          className={`${currentTheme.cardBg} ${currentTheme.border} shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-400">{stats.unlocked}</div>
            <div className={`text-xs sm:text-sm ${currentTheme.textMuted}`}>Desbloqueados</div>
          </CardContent>
        </Card>
        <Card
          className={`${currentTheme.cardBg} ${currentTheme.border} shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.points}</div>
            <div className={`text-xs sm:text-sm ${currentTheme.textMuted}`}>Puntos</div>
          </CardContent>
        </Card>
        <Card
          className={`${currentTheme.cardBg} ${currentTheme.border} shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-400">
              {stats.total > 0 ? Math.round((stats.unlocked / stats.total) * 100) : 0}%
            </div>
            <div className={`text-xs sm:text-sm ${currentTheme.textMuted}`}>Progreso</div>
          </CardContent>
        </Card>
        <Card
          className={`${currentTheme.cardBg} ${currentTheme.border} shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-400">{stats.total}</div>
            <div className={`text-xs sm:text-sm ${currentTheme.textMuted}`}>Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Progress */}
      <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className={`${currentTheme.textPrimary} flex items-center gap-2 text-lg sm:text-xl`}>
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
            Progreso por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base`}>Básicos</span>
              </div>
              <span className={`text-xs sm:text-sm ${currentTheme.textMuted}`}>
                {stats.categories.basic.unlocked}/{stats.categories.basic.total}
              </span>
            </div>
            <Progress
              value={
                stats.categories.basic.total > 0
                  ? (stats.categories.basic.unlocked / stats.categories.basic.total) * 100
                  : 0
              }
              className="h-2"
            />
          </div>

          {isPremium && (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                  <span className={`${currentTheme.textPrimary} text-sm sm:text-base`}>Premium</span>
                </div>
                <span className={`text-xs sm:text-sm ${currentTheme.textMuted}`}>
                  {stats.categories.premium.unlocked}/{stats.categories.premium.total}
                </span>
              </div>
              <Progress
                value={
                  stats.categories.premium.total > 0
                    ? (stats.categories.premium.unlocked / stats.categories.premium.total) * 100
                    : 0
                }
                className="h-2"
              />
            </div>
          )}

          {isPro && (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                  <span className={`${currentTheme.textPrimary} text-sm sm:text-base`}>Pro</span>
                </div>
                <span className={`text-xs sm:text-sm ${currentTheme.textMuted}`}>
                  {stats.categories.pro.unlocked}/{stats.categories.pro.total}
                </span>
              </div>
              <Progress
                value={
                  stats.categories.pro.total > 0
                    ? (stats.categories.pro.unlocked / stats.categories.pro.total) * 100
                    : 0
                }
                className="h-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements List */}
      <Card className={`${currentTheme.cardBg} ${currentTheme.border} shadow-xl`}>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className={`${currentTheme.textPrimary} flex items-center gap-2 text-lg sm:text-xl`}>
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
            Logros e Insignias
          </CardTitle>
          <CardDescription className={`${currentTheme.textSecondary} text-sm`}>
            Desbloquea logros completando tareas y alcanzando metas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-slate-800/50 mb-4 sm:mb-6">
              <TabsTrigger value="all" className="text-white text-xs sm:text-sm">
                Todos
              </TabsTrigger>
              <TabsTrigger value="unlocked" className="text-white text-xs sm:text-sm">
                <span className="hidden sm:inline">Desbloqueados</span>
                <span className="sm:hidden">✓</span>
              </TabsTrigger>
              <TabsTrigger value="locked" className="text-white text-xs sm:text-sm">
                <span className="hidden sm:inline">Bloqueados</span>
                <span className="sm:hidden">🔒</span>
              </TabsTrigger>
              <TabsTrigger value="basic" className="text-white text-xs sm:text-sm">
                Básicos
              </TabsTrigger>
              {isPremium && (
                <TabsTrigger value="premium" className="text-white text-xs sm:text-sm">
                  Premium
                </TabsTrigger>
              )}
              {isPro && (
                <TabsTrigger value="pro" className="text-white text-xs sm:text-sm">
                  Pro
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value={activeTab} className="mt-4 sm:mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {filterAchievements(achievements).map((achievement) => {
                  const isAccessible =
                    achievement.category === "basic" ||
                    (achievement.category === "premium" && isPremium) ||
                    (achievement.category === "pro" && isPro)

                  const IconComponent = achievement.icon

                  return (
                    <Card
                      key={achievement.id}
                      className={`
                        ${currentTheme.cardBg} ${currentTheme.border} transition-all duration-300
                        ${achievement.unlocked ? "ring-2 ring-green-500/30 bg-green-500/5" : ""}
                        ${!isAccessible ? "opacity-50" : "hover:scale-105 hover:shadow-lg"}
                        shadow-md
                      `}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div
                              className={`
                              p-1.5 sm:p-2 rounded-lg flex items-center justify-center flex-shrink-0
                              ${achievement.unlocked ? "bg-green-500/20" : "bg-slate-700/50"}
                            `}
                            >
                              {achievement.unlocked ? (
                                <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-400" />
                              ) : (
                                <IconComponent className="h-4 w-4 sm:h-6 sm:w-6 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className={`font-semibold ${currentTheme.textPrimary} text-sm sm:text-base truncate`}>
                                {achievement.name}
                              </h3>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getCategoryColor(achievement.category)} mt-1`}
                              >
                                {getCategoryIcon(achievement.category)}
                                <span className="ml-1 capitalize hidden sm:inline">{achievement.category}</span>
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {achievement.unlocked ? (
                              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                            ) : !isAccessible ? (
                              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
                            ) : null}
                          </div>
                        </div>

                        <p className={`text-xs sm:text-sm ${currentTheme.textSecondary} mb-3 line-clamp-2`}>
                          {achievement.description}
                        </p>

                        {!achievement.unlocked && isAccessible && (
                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between text-xs">
                              <span className={currentTheme.textMuted}>Progreso</span>
                              <span className={currentTheme.textMuted}>
                                {achievement.progress}/{achievement.target}
                              </span>
                            </div>
                            <Progress
                              value={(achievement.progress / achievement.target) * 100}
                              className="h-1.5 sm:h-2"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-slate-700">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                            <span className="text-xs sm:text-sm text-yellow-400">{achievement.points} pts</span>
                          </div>
                          {achievement.unlocked && achievement.unlockedAt && (
                            <span className="text-xs text-slate-500">
                              {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {!isAccessible && (
                          <div className="mt-3 p-2 bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-400 text-center">
                              {achievement.category === "premium" ? "Requiere Premium" : "Requiere Pro"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {filterAchievements(achievements).length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-slate-600 mx-auto mb-4" />
                  <p className={`${currentTheme.textSecondary} text-sm sm:text-base`}>
                    No hay logros en esta categoría
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
