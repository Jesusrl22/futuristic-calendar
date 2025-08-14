import type { Achievement, Task } from "@/types"
import { isSameDay } from "date-fns"

export function checkAchievements(
  tasks: Task[],
  currentAchievements: Achievement[],
  pomodoroSessions = 0,
): Achievement[] {
  const completedTasks = tasks.filter((task) => task.completed)
  const totalPomodoros = tasks.reduce((sum, task) => sum + task.pomodoroSessions, 0) + pomodoroSessions
  const categoriesUsed = new Set(tasks.map((task) => task.category)).size
  const todayCompleted = completedTasks.filter((task) => isSameDay(task.date, new Date())).length

  return currentAchievements.map((achievement) => {
    if (achievement.unlocked) return achievement

    let shouldUnlock = false
    let newProgress = achievement.progress

    switch (achievement.id) {
      case "first_task":
        newProgress = completedTasks.length
        shouldUnlock = completedTasks.length >= 1
        break
      case "task_master_10":
        newProgress = completedTasks.length
        shouldUnlock = completedTasks.length >= 10
        break
      case "task_master_50":
        newProgress = completedTasks.length
        shouldUnlock = completedTasks.length >= 50
        break
      case "pomodoro_master":
        newProgress = totalPomodoros
        shouldUnlock = totalPomodoros >= 50
        break
      case "streak_week":
        // This would need more complex logic to track actual streaks
        newProgress = Math.min(achievement.progress + 1, achievement.maxProgress)
        shouldUnlock = newProgress >= 7
        break
      case "speed_demon":
        shouldUnlock = todayCompleted >= 5
        break
      case "category_explorer":
        newProgress = categoriesUsed
        shouldUnlock = categoriesUsed >= 8
        break
    }

    if (shouldUnlock && !achievement.unlocked) {
      return { ...achievement, unlocked: true, unlockedAt: new Date(), progress: newProgress }
    }

    return { ...achievement, progress: newProgress }
  })
}

export function getUnlockedAchievements(achievements: Achievement[]): Achievement[] {
  return achievements.filter((achievement) => achievement.unlocked)
}

export function getAchievementsByCategory(achievements: Achievement[], category: string): Achievement[] {
  return achievements.filter((achievement) => achievement.category === category)
}
