"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Crown, Sparkles, Lock, CheckCircle } from "lucide-react"
import { getUserAchievements, getAchievementStats, type Achievement } from "@/lib/achievements"
import type { User } from "@/lib/database"

interface AchievementsDisplayProps {
  user: User
  theme: any
  t: (key: string) => string
}

export function AchievementsDisplay({ user, theme, t }: AchievementsDisplayProps) {
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

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const userAchievements = await getUserAchievements(user.id)
        const achievementStats = await getAchievementStats(user.id)
        setAchievements(userAchievements)
        setStats(achievementStats)
      } catch (error) {
        console.error("Error loading achievements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAchievements()
  }, [user.id])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basic":
        return <Trophy className="h-4 w-4" />
      case "premium":
        return <Crown className="h-4 w-4" />
      case "pro":
        return <Sparkles className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
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
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.unlocked}</div>
            <div className="text-sm text-slate-400">Logros Desbloqueados</div>
          </CardContent>
        </Card>
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.points}</div>
            <div className="text-sm text-slate-400">Puntos Totales</div>
          </CardContent>
        </Card>
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{Math.round((stats.unlocked / stats.total) * 100)}%</div>
            <div className="text-sm text-slate-400">Progreso Total</div>
          </CardContent>
        </Card>
        <Card className={`${theme.cardBg} ${theme.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
            <div className="text-sm text-slate-400">Logros Totales</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Progress */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
            <Trophy className="h-5 w-5 text-yellow-400" />
            Progreso por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-blue-400" />
                <span className={theme.textPrimary}>Básicos</span>
              </div>
              <span className="text-sm text-slate-400">
                {stats.categories.basic.unlocked}/{stats.categories.basic.total}
              </span>
            </div>
            <Progress value={(stats.categories.basic.unlocked / stats.categories.basic.total) * 100} className="h-2" />
          </div>

          {user.is_premium && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span className={theme.textPrimary}>Premium</span>
                </div>
                <span className="text-sm text-slate-400">
                  {stats.categories.premium.unlocked}/{stats.categories.premium.total}
                </span>
              </div>
              <Progress
                value={(stats.categories.premium.unlocked / stats.categories.premium.total) * 100}
                className="h-2"
              />
            </div>
          )}

          {user.is_pro && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className={theme.textPrimary}>Pro</span>
                </div>
                <span className="text-sm text-slate-400">
                  {stats.categories.pro.unlocked}/{stats.categories.pro.total}
                </span>
              </div>
              <Progress value={(stats.categories.pro.unlocked / stats.categories.pro.total) * 100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements List */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
            <Trophy className="h-5 w-5 text-yellow-400" />
            Logros e Insignias
          </CardTitle>
          <CardDescription className={theme.textSecondary}>
            Desbloquea logros completando tareas y alcanzando metas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
              <TabsTrigger value="all" className="text-white">
                Todos
              </TabsTrigger>
              <TabsTrigger value="unlocked" className="text-white">
                Desbloqueados
              </TabsTrigger>
              <TabsTrigger value="locked" className="text-white">
                Bloqueados
              </TabsTrigger>
              <TabsTrigger value="basic" className="text-white">
                Básicos
              </TabsTrigger>
              {user.is_premium && (
                <TabsTrigger value="premium" className="text-white">
                  Premium
                </TabsTrigger>
              )}
              {user.is_pro && (
                <TabsTrigger value="pro" className="text-white">
                  Pro
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterAchievements(achievements).map((achievement) => {
                  const isAccessible =
                    achievement.category === "basic" ||
                    (achievement.category === "premium" && user.is_premium) ||
                    (achievement.category === "pro" && user.is_pro)

                  return (
                    <Card
                      key={achievement.id}
                      className={`
                        ${theme.cardBg} ${theme.border} transition-all duration-200
                        ${achievement.unlocked ? "ring-2 ring-green-500/30 bg-green-500/5" : ""}
                        ${!isAccessible ? "opacity-50" : "hover:scale-105"}
                      `}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`
                              text-2xl p-2 rounded-lg
                              ${achievement.unlocked ? "bg-green-500/20" : "bg-slate-700/50"}
                            `}
                            >
                              {achievement.unlocked ? "🏆" : achievement.icon}
                            </div>
                            <div>
                              <h3 className={`font-semibold ${theme.textPrimary}`}>{achievement.name}</h3>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getCategoryColor(achievement.category)}`}
                              >
                                {getCategoryIcon(achievement.category)}
                                <span className="ml-1 capitalize">{achievement.category}</span>
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {achievement.unlocked ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : !isAccessible ? (
                              <Lock className="h-5 w-5 text-slate-500" />
                            ) : null}
                          </div>
                        </div>

                        <p className={`text-sm ${theme.textSecondary} mb-3`}>{achievement.description}</p>

                        {!achievement.unlocked && isAccessible && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className={theme.textMuted}>Progreso</span>
                              <span className={theme.textMuted}>
                                {achievement.progress}/{achievement.target}
                              </span>
                            </div>
                            <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-yellow-400">{achievement.points} pts</span>
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
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className={theme.textSecondary}>No hay logros en esta categoría</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
