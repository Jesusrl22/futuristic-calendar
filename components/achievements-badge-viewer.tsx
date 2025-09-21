"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Crown, Zap, Lock, Target, CheckCircle, Clock } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  unlocked: boolean
  progress: number
  maxProgress: number
  unlockedAt?: string
  requiredPlan?: "free" | "premium" | "pro"
}

interface AchievementsBadgeViewerProps {
  achievements: Achievement[]
  userPlan: "free" | "premium" | "pro"
  totalUnlocked: number
  isOpen?: boolean
  onClose?: () => void
}

const categoryIcons = {
  tasks: Target,
  productivity: CheckCircle,
  premium: Crown,
  pro: Zap,
  social: Star,
  time: Clock,
}

const categoryColors = {
  tasks: "bg-blue-500",
  productivity: "bg-green-500",
  premium: "bg-purple-500",
  pro: "bg-indigo-500",
  social: "bg-pink-500",
  time: "bg-orange-500",
}

export function AchievementsBadgeViewer({
  achievements,
  userPlan,
  totalUnlocked,
  isOpen = false,
  onClose,
}: AchievementsBadgeViewerProps) {
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const handleOpen = () => {
    if (onClose) {
      // If onClose is provided, this is being used as a modal
      return
    }
    setShowModal(true)
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      setShowModal(false)
    }
  }

  const canViewAchievement = (achievement: Achievement) => {
    if (!achievement.requiredPlan) return true
    if (achievement.requiredPlan === "premium") return userPlan === "premium" || userPlan === "pro"
    if (achievement.requiredPlan === "pro") return userPlan === "pro"
    return false
  }

  const getFilteredAchievements = () => {
    let filtered = achievements
    if (selectedCategory !== "all") {
      filtered = achievements.filter((a) => a.category === selectedCategory)
    }
    return filtered
  }

  const categories = Array.from(new Set(achievements.map((a) => a.category)))
  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const lockedAchievements = achievements.filter((a) => !a.unlocked)

  // Compact badge view
  if (!isOpen && !showModal) {
    return (
      <Button variant="outline" size="sm" onClick={handleOpen} className="flex items-center space-x-2 bg-transparent">
        <Trophy className="h-4 w-4" />
        <span>{totalUnlocked}</span>
        <span className="text-xs text-muted-foreground">/{achievements.length}</span>
      </Button>
    )
  }

  const modalContent = (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h2 className="text-2xl font-bold">Achievements</h2>
        </div>
        <p className="text-muted-foreground">
          {unlockedAchievements.length} of {achievements.length} achievements unlocked
        </p>
        <div className="mt-4">
          <Progress value={(unlockedAchievements.length / achievements.length) * 100} className="h-2" />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked ({unlockedAchievements.length})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({lockedAchievements.length})</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const canView = canViewAchievement(achievement)
              const CategoryIcon = categoryIcons[achievement.category as keyof typeof categoryIcons] || Target
              const categoryColor = categoryColors[achievement.category as keyof typeof categoryColors] || "bg-gray-500"

              return (
                <Card
                  key={achievement.id}
                  className={`transition-all duration-200 ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                      : canView
                        ? "hover:shadow-md"
                        : "opacity-60"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          achievement.unlocked ? "bg-yellow-100" : canView ? "bg-gray-100" : "bg-gray-50"
                        }`}
                      >
                        {achievement.unlocked ? (
                          <Trophy className="h-6 w-6 text-yellow-600" />
                        ) : canView ? (
                          <CategoryIcon className="h-6 w-6 text-gray-600" />
                        ) : (
                          <Lock className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3
                            className={`font-semibold text-sm ${
                              achievement.unlocked ? "text-yellow-800" : canView ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            {achievement.name}
                          </h3>
                          <Badge className={`${categoryColor} text-white text-xs`}>{achievement.category}</Badge>
                        </div>
                        <p
                          className={`text-xs mb-2 ${
                            achievement.unlocked ? "text-yellow-700" : canView ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          {achievement.description}
                        </p>

                        {!achievement.unlocked && canView && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1" />
                          </div>
                        )}

                        {achievement.unlocked && achievement.unlockedAt && (
                          <p className="text-xs text-yellow-600 mt-2">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}

                        {!canView && achievement.requiredPlan && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Lock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Requires{" "}
                              {achievement.requiredPlan.charAt(0).toUpperCase() + achievement.requiredPlan.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="unlocked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-yellow-100">
                      <Trophy className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-yellow-800 mb-1">{achievement.name}</h3>
                      <p className="text-xs text-yellow-700 mb-2">{achievement.description}</p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-yellow-600">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => {
              const canView = canViewAchievement(achievement)
              const CategoryIcon = categoryIcons[achievement.category as keyof typeof categoryIcons] || Target

              return (
                <Card key={achievement.id} className={canView ? "hover:shadow-md" : "opacity-60"}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${canView ? "bg-gray-100" : "bg-gray-50"}`}>
                        {canView ? (
                          <CategoryIcon className="h-6 w-6 text-gray-600" />
                        ) : (
                          <Lock className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-sm mb-1 ${canView ? "text-gray-900" : "text-gray-500"}`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-xs mb-2 ${canView ? "text-gray-600" : "text-gray-400"}`}>
                          {achievement.description}
                        </p>

                        {canView && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1" />
                          </div>
                        )}

                        {!canView && achievement.requiredPlan && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Lock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Requires{" "}
                              {achievement.requiredPlan.charAt(0).toUpperCase() + achievement.requiredPlan.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {categories.map((category) => {
            const categoryAchievements = achievements.filter((a) => a.category === category)
            const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || Target
            const categoryColor = categoryColors[category as keyof typeof categoryColors] || "bg-gray-500"
            const unlockedInCategory = categoryAchievements.filter((a) => a.unlocked).length

            return (
              <Card key={category}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-full ${categoryColor.replace("bg-", "bg-opacity-20 bg-")}`}>
                      <CategoryIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold capitalize">{category}</h3>
                      <p className="text-sm text-muted-foreground">
                        {unlockedInCategory}/{categoryAchievements.length} unlocked
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-3 rounded-lg border ${
                          achievement.unlocked ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {achievement.unlocked ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                          )}
                          <span className={`text-sm ${achievement.unlocked ? "text-green-800" : "text-gray-600"}`}>
                            {achievement.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )

  // If using as a modal with onClose prop
  if (onClose) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span>Achievements</span>
            </DialogTitle>
          </DialogHeader>
          {modalContent}
        </DialogContent>
      </Dialog>
    )
  }

  // If using as a standalone modal
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Achievements</span>
          </DialogTitle>
        </DialogHeader>
        {modalContent}
      </DialogContent>
    </Dialog>
  )
}
