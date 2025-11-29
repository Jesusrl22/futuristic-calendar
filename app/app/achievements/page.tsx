"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Trophy, Lock } from "@/components/icons"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { getAvailableAchievements, type AchievementTier } from "@/lib/achievements"
import { AdsterraBanner } from "@/components/adsterra-banner"
import { AdsterraNativeBanner } from "@/components/adsterra-native-banner"
import { AdsterraMobileBanner } from "@/components/adsterra-mobile-banner"

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([])
  const [stats, setStats] = useState({ tasks: 0, notes: 0, pomodoro: 0 })
  const [userTier, setUserTier] = useState<AchievementTier>("free")
  const { toast } = useToast()

  useEffect(() => {
    fetchUserTier()
    fetchAchievements()
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const fetchUserTier = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setUserTier((data.subscription_plan || "free") as AchievementTier)
      }
    } catch (error) {
      console.error("Error fetching user tier:", error)
    }
  }

  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/achievements")
      const data = await response.json()

      setAchievements(data.achievements || [])
      setStats(data.stats || { tasks: 0, notes: 0, pomodoro: 0 })

      if (data.newUnlocks > 0) {
        toast({
          title: "Achievement Unlocked!",
          description: `You unlocked ${data.newUnlocks} new achievement${data.newUnlocks > 1 ? "s" : ""}!`,
          duration: 5000,
        })

        if ("Notification" in window && Notification.permission === "granted") {
          try {
            new Notification("Achievement Unlocked!", {
              body: `You unlocked ${data.newUnlocks} new achievement${data.newUnlocks > 1 ? "s" : ""}!`,
              icon: "/favicon.ico",
              tag: "achievement-unlock",
            })
          } catch (error) {
            console.error("Error sending notification:", error)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching achievements:", error)
    }
  }

  const isUnlocked = (achievementId: string) => {
    return achievements.some((a) => a.achievement_type === achievementId)
  }

  const getProgress = (achievement: any) => {
    switch (achievement.id) {
      case "first_task":
      case "task_starter":
      case "task_master":
      case "task_legend":
      case "productivity_god":
        return Math.min((stats.tasks / achievement.requirement) * 100, 100)
      case "note_taker":
        return Math.min((stats.notes / achievement.requirement) * 100, 100)
      case "focus_beginner":
      case "focus_warrior":
      case "focus_master":
        return Math.min((stats.pomodoro / achievement.requirement) * 100, 100)
      default:
        return 0
    }
  }

  const availableAchievements = getAvailableAchievements(userTier)
  const unlockedCount = availableAchievements.filter((a) => isUnlocked(a.id)).length

  const freeAchievements = availableAchievements.filter((a) => a.tier === "free")
  const premiumAchievements = availableAchievements.filter((a) => a.tier === "premium")
  const proAchievements = availableAchievements.filter((a) => a.tier === "pro")

  return (
    <div className="p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {userTier === "free" && (
          <div className="mb-6">
            {/* Desktop banner (728x90) */}
            <AdsterraBanner
              adKey="dd82d93d86b369641ec4dd731423cb09"
              width={728}
              height={90}
              className="hidden md:block"
            />
            {/* Mobile banner (320x50) */}
            <AdsterraMobileBanner
              adKey="5fedd77c571ac1a4c2ea68ca3d2bca98"
              width={320}
              height={50}
              className="block md:hidden"
            />
          </div>
        )}

        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
          <span className="text-primary neon-text">Achievements</span>
        </h1>

        <Card className="glass-card p-4 md:p-6 neon-glow mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Your Progress</h2>
              <p className="text-sm md:text-base text-muted-foreground">
                {unlockedCount} of {availableAchievements.length} unlocked
              </p>
              <p className="text-xs text-muted-foreground mt-1">Plan: {userTier.toUpperCase()}</p>
            </div>
            <div className="text-center">
              <Trophy className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-primary">{unlockedCount}</p>
            </div>
          </div>
          <Progress value={(unlockedCount / availableAchievements.length) * 100} className="mt-4" />
        </Card>

        {freeAchievements.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-green-500">Free Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeAchievements.map((achievement, index) => {
                const unlocked = isUnlocked(achievement.id)
                const progress = getProgress(achievement)

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className={`glass-card p-4 md:p-6 transition-all duration-300 ${
                        unlocked ? "neon-glow-hover" : "opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <div className="text-3xl md:text-4xl">
                          {unlocked ? achievement.icon : <Lock className="w-8 h-8 md:w-10 md:h-10" />}
                        </div>
                        {unlocked && <Trophy className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                      </div>
                      <h3 className="font-semibold text-base md:text-lg mb-2">{achievement.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">{achievement.description}</p>
                      {!unlocked && (
                        <div>
                          <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground mb-2">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} />
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {premiumAchievements.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-purple-500">Premium Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumAchievements.map((achievement, index) => {
                const unlocked = isUnlocked(achievement.id)
                const progress = getProgress(achievement)
                const isLocked = userTier === "free"

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className={`glass-card p-4 md:p-6 transition-all duration-300 ${
                        isLocked ? "opacity-40" : unlocked ? "neon-glow-hover" : "opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <div className="text-3xl md:text-4xl">
                          {isLocked || !unlocked ? <Lock className="w-8 h-8 md:w-10 md:h-10" /> : achievement.icon}
                        </div>
                        {!isLocked && unlocked && <Trophy className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                      </div>
                      <h3 className="font-semibold text-base md:text-lg mb-2">{achievement.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">{achievement.description}</p>
                      {isLocked && <p className="text-xs md:text-sm text-purple-500">Upgrade to Premium to unlock</p>}
                      {!isLocked && !unlocked && (
                        <div>
                          <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground mb-2">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} />
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {proAchievements.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-blue-500">Pro Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proAchievements.map((achievement, index) => {
                const unlocked = isUnlocked(achievement.id)
                const progress = getProgress(achievement)
                const isLocked = userTier !== "pro"

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className={`glass-card p-4 md:p-6 transition-all duration-300 ${
                        isLocked ? "opacity-40" : unlocked ? "neon-glow-hover" : "opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <div className="text-3xl md:text-4xl">
                          {isLocked || !unlocked ? <Lock className="w-8 h-8 md:w-10 md:h-10" /> : achievement.icon}
                        </div>
                        {!isLocked && unlocked && <Trophy className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                      </div>
                      <h3 className="font-semibold text-base md:text-lg mb-2">{achievement.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">{achievement.description}</p>
                      {isLocked && <p className="text-xs md:text-sm text-blue-500">Upgrade to Pro to unlock</p>}
                      {!isLocked && !unlocked && (
                        <div>
                          <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground mb-2">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} />
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {userTier === "free" && (
          <div className="mt-6">
            {/* Desktop native banner */}
            <AdsterraNativeBanner
              containerId="container-105a3c31d27607df87969077c87047d4"
              scriptSrc="//pl28151206.effectivegatecpm.com/105a3c31d27607df87969077c87047d4/invoke.js"
              className="hidden md:block"
            />
            {/* Mobile banner */}
            <AdsterraMobileBanner
              adKey="5fedd77c571ac1a4c2ea68ca3d2bca98"
              width={320}
              height={50}
              className="block md:hidden"
            />
          </div>
        )}
      </motion.div>
    </div>
  )
}
