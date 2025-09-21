"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Trophy, Star, Crown, Lock, CheckCircle2, Target, Zap } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "basic" | "premium" | "pro"
  points: number
  unlocked: boolean
  progress: number
  target: number
  unlockedAt?: string
}

interface AchievementsBadgeViewerProps {
  achievements: Achievement[]
  onClose: () => void
  userPlan: string
}

export function AchievementsBadgeViewer({ achievements, onClose, userPlan }: AchievementsBadgeViewerProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "basic" | "premium" | "pro">("all")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "unlocked" | "locked">("all")

  const categories = [
    { id: "basic", name: "Básico", icon: Target, color: "text-gray-600", bgColor: "bg-gray-100" },
    { id: "premium", name: "Premium", icon: Star, color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { id: "pro", name: "Pro", icon: Crown, color: "text-purple-600", bgColor: "bg-purple-100" },
  ]

  const filteredAchievements = achievements.filter((achievement) => {
    const categoryMatch = selectedCategory === "all" || achievement.category === selectedCategory
    const statusMatch =
      selectedStatus === "all" ||
      (selectedStatus === "unlocked" && achievement.unlocked) ||
      (selectedStatus === "locked" && !achievement.unlocked)
    return categoryMatch && statusMatch
  })

  const getStats = () => {
    const total = achievements.length
    const unlocked = achievements.filter((a) => a.unlocked).length
    const totalPoints = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0)
    const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0

    const byCategory = categories.map((cat) => {
      const categoryAchievements = achievements.filter((a) => a.category === cat.id)
      const categoryUnlocked = categoryAchievements.filter((a) => a.unlocked).length
      return {
        ...cat,
        total: categoryAchievements.length,
        unlocked: categoryUnlocked,
        progress:
          categoryAchievements.length > 0 ? Math.round((categoryUnlocked / categoryAchievements.length) * 100) : 0,
      }
    })

    return { total, unlocked, totalPoints, progress, byCategory }
  }

  const canAccessCategory = (category: string) => {
    if (category === "basic") return true
    if (category === "premium") return userPlan.includes("premium") || userPlan.includes("pro")
    if (category === "pro") return userPlan.includes("pro")
    return false
  }

  const stats = getStats()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Logros e Insignias
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Tu progreso y logros desbloqueados
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.unlocked}</div>
                <p className="text-sm opacity-90">Logros Desbloqueados</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.progress}%</div>
                <p className="text-sm opacity-90">Progreso Total</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.totalPoints}</div>
                <p className="text-sm opacity-90">Puntos Totales</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-sm opacity-90">Logros Disponibles</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress by Category */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Progreso por Categoría</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.byCategory.map((category) => {
                const Icon = category.icon
                const hasAccess = canAccessCategory(category.id)

                return (
                  <Card key={category.id} className={`${hasAccess ? "" : "opacity-50"}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-full ${category.bgColor}`}>
                          <Icon className={`h-5 w-5 ${category.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">{category.name}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {category.unlocked}/{category.total} desbloqueados
                          </p>
                        </div>
                        {!hasAccess && <Lock className="h-4 w-4 text-slate-400" />}
                      </div>
                      <Progress value={category.progress} className="h-2" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{category.progress}% completado</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Filters */}
          <Tabs value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="premium" disabled={!canAccessCategory("premium")}>
                  Premium {!canAccessCategory("premium") && <Lock className="h-3 w-3 ml-1" />}
                </TabsTrigger>
                <TabsTrigger value="pro" disabled={!canAccessCategory("pro")}>
                  Pro {!canAccessCategory("pro") && <Lock className="h-3 w-3 ml-1" />}
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant={selectedStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus("all")}
                >
                  Todos
                </Button>
                <Button
                  variant={selectedStatus === "unlocked" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus("unlocked")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Desbloqueados
                </Button>
                <Button
                  variant={selectedStatus === "locked" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus("locked")}
                >
                  <Lock className="h-4 w-4 mr-1" />
                  Bloqueados
                </Button>
              </div>
            </div>

            <TabsContent value={selectedCategory} className="mt-6">
              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAchievements.map((achievement) => {
                  const categoryInfo = categories.find((c) => c.id === achievement.category)
                  const hasAccess = canAccessCategory(achievement.category)
                  const progressPercentage = Math.round((achievement.progress / achievement.target) * 100)

                  return (
                    <Card
                      key={achievement.id}
                      className={`relative overflow-hidden transition-all hover:shadow-lg ${
                        achievement.unlocked
                          ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20"
                          : hasAccess
                            ? "hover:shadow-md"
                            : "opacity-50"
                      }`}
                    >
                      {achievement.unlocked && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                      )}

                      {!hasAccess && (
                        <div className="absolute top-2 right-2">
                          <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                      )}

                      <CardContent className="pt-6">
                        <div className="text-center mb-4">
                          <div className={`text-4xl mb-2 ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>
                            {achievement.icon}
                          </div>
                          <h4
                            className={`font-semibold ${
                              achievement.unlocked
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{achievement.description}</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className={`${categoryInfo?.bgColor} ${categoryInfo?.color}`}>
                              {categoryInfo?.name}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                              <Zap className="h-3 w-3" />
                              {achievement.points} pts
                            </div>
                          </div>

                          {!achievement.unlocked && hasAccess && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Progreso</span>
                                <span className="text-slate-900 dark:text-white">
                                  {achievement.progress}/{achievement.target}
                                </span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                            </div>
                          )}

                          {achievement.unlocked && achievement.unlockedAt && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                              Desbloqueado el{" "}
                              {new Date(achievement.unlockedAt).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          )}

                          {!hasAccess && (
                            <div className="text-xs text-center text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded p-2">
                              Requiere plan {categoryInfo?.name}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {filteredAchievements.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No hay logros en esta categoría
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Prueba con otros filtros o sigue usando la aplicación para desbloquear más logros.
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
