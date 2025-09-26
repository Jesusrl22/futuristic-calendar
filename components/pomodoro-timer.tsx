"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, Square, Settings, Volume2, VolumeX } from "lucide-react"
import { useNotifications } from "@/components/notification-service"
import { checkAndUnlockAchievements } from "@/lib/achievements"

interface PomodoroSettings {
  workDuration: number // in minutes
  shortBreakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number
  autoStartBreaks: boolean
  autoStartWork: boolean
  soundEnabled: boolean
  notificationsEnabled: boolean
}

interface PomodoroStats {
  sessionsCompleted: number
  totalFocusTime: number // in minutes
  todaysSessions: number
  currentStreak: number
  longestStreak: number
  lastSessionDate: string
}

type TimerState = "work" | "shortBreak" | "longBreak"

const defaultSettings: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
  notificationsEnabled: true,
}

const defaultStats: PomodoroStats = {
  sessionsCompleted: 0,
  totalFocusTime: 0,
  todaysSessions: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: "",
}

export function PomodoroTimer() {
  const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings)
  const [stats, setStats] = useState<PomodoroStats>(defaultStats)
  const [currentState, setCurrentState] = useState<TimerState>("work")
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const { showToast } = useNotifications()

  // Load settings and stats from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("pomodoroSettings")
    const savedStats = localStorage.getItem("pomodoroStats")

    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      setSettings(parsedSettings)
      setTimeLeft(parsedSettings.workDuration * 60)
    }

    if (savedStats) {
      const parsedStats = JSON.parse(savedStats)
      setStats(parsedStats)

      // Check if it's a new day
      const today = new Date().toDateString()
      if (parsedStats.lastSessionDate !== today) {
        setStats((prev) => ({ ...prev, todaysSessions: 0 }))
      }
    }

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  // Save settings and stats to localStorage
  useEffect(() => {
    localStorage.setItem("pomodoroSettings", JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem("pomodoroStats", JSON.stringify(stats))
  }, [stats])

  // Create audio context for sound notifications
  const createAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!settings.soundEnabled) return

    try {
      const audioContext = createAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.error("Error playing notification sound:", error)
    }
  }, [settings.soundEnabled, createAudioContext])

  // Show browser notification
  const showNotification = useCallback(
    (title: string, body: string) => {
      if (!settings.notificationsEnabled) return

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/favicon.png",
          badge: "/favicon.png",
        })
      }
    },
    [settings.notificationsEnabled],
  )

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      // Timer finished
      setIsRunning(false)
      playNotificationSound()

      if (currentState === "work") {
        // Work session completed
        const newSessionsCompleted = sessionsCompleted + 1
        setSessionsCompleted(newSessionsCompleted)

        // Update stats
        const today = new Date().toDateString()
        const newStats = {
          ...stats,
          sessionsCompleted: stats.sessionsCompleted + 1,
          totalFocusTime: stats.totalFocusTime + settings.workDuration,
          todaysSessions: stats.lastSessionDate === today ? stats.todaysSessions + 1 : 1,
          lastSessionDate: today,
        }

        // Update streak
        if (
          stats.lastSessionDate === today ||
          stats.lastSessionDate === new Date(Date.now() - 86400000).toDateString()
        ) {
          newStats.currentStreak = stats.currentStreak + 1
          newStats.longestStreak = Math.max(stats.longestStreak, newStats.currentStreak)
        } else {
          newStats.currentStreak = 1
        }

        setStats(newStats)

        // Check for achievements
        const newAchievements = checkAndUnlockAchievements()
        newAchievements.forEach((achievement) => {
          showToast(`Achievement unlocked: ${achievement.name}!`, "success")
        })

        // Determine next state
        const nextState = newSessionsCompleted % settings.sessionsUntilLongBreak === 0 ? "longBreak" : "shortBreak"
        setCurrentState(nextState)

        const nextDuration = nextState === "longBreak" ? settings.longBreakDuration : settings.shortBreakDuration
        setTimeLeft(nextDuration * 60)

        showNotification(
          "Work Session Complete!",
          `Time for a ${nextState === "longBreak" ? "long" : "short"} break (${nextDuration} minutes)`,
        )

        if (settings.autoStartBreaks) {
          setIsRunning(true)
        }
      } else {
        // Break finished
        setCurrentState("work")
        setTimeLeft(settings.workDuration * 60)

        showNotification("Break Complete!", `Time to get back to work (${settings.workDuration} minutes)`)

        if (settings.autoStartWork) {
          setIsRunning(true)
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [
    isRunning,
    timeLeft,
    currentState,
    sessionsCompleted,
    settings,
    stats,
    playNotificationSound,
    showNotification,
    showToast,
  ])

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    const duration =
      currentState === "work"
        ? settings.workDuration
        : currentState === "shortBreak"
          ? settings.shortBreakDuration
          : settings.longBreakDuration
    setTimeLeft(duration * 60)
  }

  const skipSession = () => {
    setIsRunning(false)
    if (currentState === "work") {
      const nextState = sessionsCompleted % settings.sessionsUntilLongBreak === 0 ? "longBreak" : "shortBreak"
      setCurrentState(nextState)
      const nextDuration = nextState === "longBreak" ? settings.longBreakDuration : settings.shortBreakDuration
      setTimeLeft(nextDuration * 60)
    } else {
      setCurrentState("work")
      setTimeLeft(settings.workDuration * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    const totalDuration =
      currentState === "work"
        ? settings.workDuration * 60
        : currentState === "shortBreak"
          ? settings.shortBreakDuration * 60
          : settings.longBreakDuration * 60
    return ((totalDuration - timeLeft) / totalDuration) * 100
  }

  const getStateColor = () => {
    switch (currentState) {
      case "work":
        return "bg-red-500"
      case "shortBreak":
        return "bg-green-500"
      case "longBreak":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStateLabel = () => {
    switch (currentState) {
      case "work":
        return "Work Session"
      case "shortBreak":
        return "Short Break"
      case "longBreak":
        return "Long Break"
      default:
        return "Pomodoro"
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">🍅 Pomodoro Timer</CardTitle>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Pomodoro Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workDuration">Work (minutes)</Label>
                    <Input
                      id="workDuration"
                      type="number"
                      min="1"
                      max="60"
                      value={settings.workDuration}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, workDuration: Number.parseInt(e.target.value) || 25 }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="shortBreak">Short Break</Label>
                    <Input
                      id="shortBreak"
                      type="number"
                      min="1"
                      max="30"
                      value={settings.shortBreakDuration}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, shortBreakDuration: Number.parseInt(e.target.value) || 5 }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="longBreak">Long Break</Label>
                    <Input
                      id="longBreak"
                      type="number"
                      min="1"
                      max="60"
                      value={settings.longBreakDuration}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, longBreakDuration: Number.parseInt(e.target.value) || 15 }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionsUntilLongBreak">Sessions until Long Break</Label>
                    <Input
                      id="sessionsUntilLongBreak"
                      type="number"
                      min="2"
                      max="10"
                      value={settings.sessionsUntilLongBreak}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          sessionsUntilLongBreak: Number.parseInt(e.target.value) || 4,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoStartBreaks">Auto-start breaks</Label>
                    <Switch
                      id="autoStartBreaks"
                      checked={settings.autoStartBreaks}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoStartBreaks: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoStartWork">Auto-start work</Label>
                    <Switch
                      id="autoStartWork"
                      checked={settings.autoStartWork}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoStartWork: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="soundEnabled">Sound notifications</Label>
                    <Switch
                      id="soundEnabled"
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, soundEnabled: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notificationsEnabled">Browser notifications</Label>
                    <Switch
                      id="notificationsEnabled"
                      checked={settings.notificationsEnabled}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notificationsEnabled: checked }))}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Badge variant="secondary" className={`${getStateColor()} text-white`}>
          {getStateLabel()}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-6xl font-mono font-bold mb-4">{formatTime(timeLeft)}</div>
          <Progress value={getProgress()} className="w-full h-2" />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {!isRunning ? (
            <Button onClick={startTimer} size="lg" className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={pauseTimer} size="lg" variant="secondary" className="flex-1">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={resetTimer} size="lg" variant="outline">
            <Square className="w-4 h-4" />
          </Button>
          <Button onClick={skipSession} size="lg" variant="ghost">
            Skip
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{stats.todaysSessions}</div>
            <div className="text-sm text-muted-foreground">Today</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Streak</div>
          </div>
        </div>

        {/* Session Progress */}
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">
            Session {sessionsCompleted + 1} of {settings.sessionsUntilLongBreak}
          </div>
          <div className="flex gap-1 justify-center">
            {Array.from({ length: settings.sessionsUntilLongBreak }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < sessionsCompleted
                    ? "bg-green-500"
                    : i === sessionsCompleted && currentState === "work" && isRunning
                      ? "bg-yellow-500"
                      : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sound indicator */}
        <div className="flex justify-center">
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          ) : (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
