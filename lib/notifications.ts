export interface NotificationSettings {
  enabled: boolean
  taskReminders: boolean
  pomodoroComplete: boolean
  dailySummary: boolean
}

export class NotificationService {
  private static instance: NotificationService
  private permission: NotificationPermission = "default"
  private notificationMap = new Map<string, number>()
  private checkInterval: NodeJS.Timeout | null = null

  private constructor() {
    if (typeof window !== "undefined" && "Notification" in window) {
      this.permission = Notification.permission
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async requestPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("Browser notifications not supported")
      return false
    }

    if (this.permission === "granted") {
      return true
    }

    try {
      const permission = await Notification.requestPermission()
      this.permission = permission
      return permission === "granted"
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }

  isSupported(): boolean {
    return typeof window !== "undefined" && "Notification" in window
  }

  hasPermission(): boolean {
    return this.permission === "granted"
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.isSupported() || !this.hasPermission()) {
      console.warn("Cannot show notification: not supported or no permission")
      return
    }

    try {
      const notification = new Notification(title, {
        icon: "/favicon.png",
        badge: "/favicon.png",
        ...options,
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // Auto-close after 10 seconds
      setTimeout(() => notification.close(), 10000)
    } catch (error) {
      console.error("Error showing notification:", error)
    }
  }

  async showTaskReminder(task: any): Promise<void> {
    const now = new Date()
    const taskTime = task.due_date ? new Date(task.due_date) : null

    if (!taskTime) return

    const timeUntil = taskTime.getTime() - now.getTime()
    const minutesUntil = Math.floor(timeUntil / (1000 * 60))

    // Check if we already notified for this task recently (within last 20 minutes)
    const lastNotified = this.notificationMap.get(task.id)
    if (lastNotified && now.getTime() - lastNotified < 20 * 60 * 1000) {
      return
    }

    let shouldNotify = false
    let notificationText = ""

    if (minutesUntil <= 0 && minutesUntil > -60) {
      // Task is overdue but less than 1 hour ago
      shouldNotify = true
      notificationText = `⚠️ Tarea vencida: ${task.title}`
    } else if (minutesUntil > 0 && minutesUntil <= 15) {
      // Task is due in 15 minutes or less
      shouldNotify = true
      notificationText = `⏰ Recordatorio: ${task.title} en ${minutesUntil} minuto${minutesUntil !== 1 ? "s" : ""}`
    }

    if (shouldNotify) {
      await this.showNotification(notificationText, {
        body: task.description || "No hay descripción",
        tag: `task-${task.id}`,
        requireInteraction: false,
        vibrate: [200, 100, 200],
      })

      this.notificationMap.set(task.id, now.getTime())
    }
  }

  startMonitoring(getTasks: () => Promise<any[]>): void {
    if (this.checkInterval) {
      return
    }

    const checkTasks = async () => {
      try {
        const tasks = await getTasks()
        const pendingTasks = tasks.filter((t) => !t.completed && t.due_date)

        for (const task of pendingTasks) {
          await this.showTaskReminder(task)
        }
      } catch (error) {
        console.error("Error checking tasks for notifications:", error)
      }
    }

    // Check immediately
    checkTasks()

    // Then check every minute
    this.checkInterval = setInterval(checkTasks, 60000)
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
    this.notificationMap.clear()
  }

  async showPomodoroComplete(): Promise<void> {
    await this.showNotification("🍅 ¡Pomodoro Completado!", {
      body: "Buen trabajo! Toma un descanso merecido.",
      tag: "pomodoro-complete",
      requireInteraction: false,
      vibrate: [200, 100, 200, 100, 200],
    })
  }

  async showBreakComplete(): Promise<void> {
    await this.showNotification("⏸️ Descanso Terminado", {
      body: "Es hora de volver al trabajo. ¡Tú puedes!",
      tag: "break-complete",
      requireInteraction: false,
      vibrate: [200, 100, 200],
    })
  }
}

export const notificationService = NotificationService.getInstance()
