"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Trophy, Lock } from "@/components/icons"
import { Progress } from "@/components/ui/progress"

const achievementsList = [
  { id: "first_task", title: "First Steps", description: "Complete your first task", requirement: 1, icon: "🎯" },
  { id: "task_master", title: "Task Master", description: "Complete 50 tasks", requirement: 50, icon: "🏆" },
  { id: "note_taker", title: "Note Taker", description: "Create 10 notes", requirement: 10, icon: "📝" },
  {
    id: "focus_warrior",
    title: "Focus Warrior",
    description: "Complete 25 Pomodoro sessions",
    requirement: 25,
    icon: "⏱️",
  },
  { id: "early_bird", title: "Early Bird", description: "Complete a task before 8 AM", requirement: 1, icon: "🌅" },
  { id: "night_owl", title: "Night Owl", description: "Complete a task after 10 PM", requirement: 1, icon: "🦉" },
  { id: "streak_7", title: "Week Warrior", description: "7 day streak", requirement: 7, icon: "🔥" },
  { id: "streak_30", title: "Month Master", description: "30 day streak", requirement: 30, icon: "💪" },
]

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([])
  const [stats, setStats] = useState({ tasks: 0, notes: 0, pomodoro: 0 })

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/achievements")
      const data = await response.json()

      setAchievements(data.achievements || [])
      setStats(data.stats || { tasks: 0, notes: 0, pomodoro: 0 })
    } catch (error) {
      console.error("Error fetching achievements:", error)
    }
  }

  const isUnlocked = (achievementId: string) => {
    return achievements.some((a) => a.achievement_id === achievementId)
  }

  const getProgress = (achievement: any) => {
    switch (achievement.id) {
      case "first_task":
      case "task_master":
        return Math.min((stats.tasks / achievement.requirement) * 100, 100)
      case "note_taker":
        return Math.min((stats.notes / achievement.requirement) * 100, 100)
      case "focus_warrior":
        return Math.min((stats.pomodoro / achievement.requirement) * 100, 100)
      default:
        return 0
    }
  }

  const unlockedCount = achievementsList.filter((a) => isUnlocked(a.id)).length

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-primary neon-text">Achievements</span>
        </h1>

        <Card className="glass-card p-6 neon-glow mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
              <p className="text-muted-foreground">
                {unlockedCount} of {achievementsList.length} achievements unlocked
              </p>
            </div>
            <div className="text-center">
              <Trophy className="w-16 h-16 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary">{unlockedCount}</p>
            </div>
          </div>
          <Progress value={(unlockedCount / achievementsList.length) * 100} className="mt-4" />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievementsList.map((achievement, index) => {
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
                  className={`glass-card p-6 transition-all duration-300 ${
                    unlocked ? "neon-glow-hover" : "opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{unlocked ? achievement.icon : <Lock className="w-10 h-10" />}</div>
                    {unlocked && <Trophy className="w-6 h-6 text-primary" />}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                  {!unlocked && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
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
      </motion.div>
    </div>
  )
}
