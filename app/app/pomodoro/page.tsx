"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Settings } from "@/components/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PomodoroPage() {
  const [durations, setDurations] = useState({
    work: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
  })
  const [timeLeft, setTimeLeft] = useState(durations.work)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<"work" | "break" | "longBreak">("work")
  const [sessions, setSessions] = useState(0)
  const [showCustomDialog, setShowCustomDialog] = useState(false)
  const [customMinutes, setCustomMinutes] = useState("25")
  const sessionSavedRef = useRef(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        const data = await response.json()

        if (data.profile) {
          const workDuration = data.profile.pomodoro_work_duration || 25
          const breakDuration = data.profile.pomodoro_break_duration || 5
          const longBreakDuration = data.profile.pomodoro_long_break_duration || 15

          const savedDurations = {
            work: Math.max(1, workDuration) * 60,
            break: Math.max(1, breakDuration) * 60,
            longBreak: Math.max(1, longBreakDuration) * 60,
          }

          setDurations(savedDurations)
          if (mode === "work" && !isRunning) {
            setTimeLeft(savedDurations.work)
          }
        }
      } catch (error) {}
    }

    loadSettings()
  }, [])

  useEffect(() => {
    const saveStateOnExit = () => {
      // Save to localStorage for quick recovery
      localStorage.setItem(
        "pomodoroState",
        JSON.stringify({
          mode,
          timeLeft,
          sessions,
          durations,
        }),
      )
    }

    // Save state when component unmounts or user leaves
    window.addEventListener("beforeunload", saveStateOnExit)

    return () => {
      saveStateOnExit()
      window.removeEventListener("beforeunload", saveStateOnExit)
    }
  }, [mode, timeLeft, sessions, durations])

  useEffect(() => {
    const savedState = localStorage.getItem("pomodoroState")
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        setTimeout(() => {
          setMode(state.mode)
          setTimeLeft(state.timeLeft)
          setSessions(state.sessions)
          if (state.durations) {
            setDurations(state.durations)
          }
        }, 0)
      } catch (error) {}
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !sessionSavedRef.current) {
      handleComplete()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleComplete = async () => {
    if (sessionSavedRef.current) {
      return
    }
    sessionSavedRef.current = true

    setIsRunning(false)

    if (mode === "work") {
      try {
        const durationInMinutes = Math.round(durations.work / 60)
        const response = await fetch("/api/pomodoro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ duration: durationInMinutes }),
        })

        if (!response.ok) {
        }
      } catch (error) {}

      setSessions((prev) => prev + 1)
      setMode(sessions + 1 >= 4 ? "longBreak" : "break")
      setTimeLeft(sessions + 1 >= 4 ? durations.longBreak : durations.break)
    } else {
      setMode("work")
      setTimeLeft(durations.work)
      if (mode === "longBreak") setSessions(0)
    }

    setTimeout(() => {
      sessionSavedRef.current = false
    }, 1000)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(durations[mode])
    sessionSavedRef.current = false
  }

  const handleModeChange = (newMode: "work" | "break" | "longBreak") => {
    setMode(newMode)
    setTimeLeft(durations[newMode])
    setIsRunning(false)
    sessionSavedRef.current = false
  }

  const saveDurationPreset = async (workMins: number, breakMins: number, longBreakMins: number) => {
    try {
      const validWork = Math.max(1, Math.min(120, workMins))
      const validBreak = Math.max(1, Math.min(60, breakMins))
      const validLongBreak = Math.max(1, Math.min(60, longBreakMins))

      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pomodoro_work_duration: validWork,
          pomodoro_break_duration: validBreak,
          pomodoro_long_break_duration: validLongBreak,
        }),
      })

      if (response.ok) {
        const newDurations = {
          work: validWork * 60,
          break: validBreak * 60,
          longBreak: validLongBreak * 60,
        }
        setDurations(newDurations)
        setTimeLeft(newDurations.work)
        setMode("work")
        setIsRunning(false)
        sessionSavedRef.current = false
      }
    } catch (error) {}
  }

  const handleCustomDuration = () => {
    const mins = Number.parseInt(customMinutes)
    if (mins > 0 && mins <= 120) {
      saveDurationPreset(mins, Math.floor(mins / 5), Math.floor(mins / 2))
      setShowCustomDialog(false)
    }
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-primary neon-text">Pomodoro Timer</span>
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Timer Presets</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => saveDurationPreset(15, 3, 10)}>Short (15/3/10 min)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => saveDurationPreset(25, 5, 15)}>Standard (25/5/15 min)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => saveDurationPreset(45, 10, 30)}>Long (45/10/30 min)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => saveDurationPreset(60, 15, 30)}>
                Extended (60/15/30 min)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowCustomDialog(true)}>Custom Duration...</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="glass-card p-12 neon-glow text-center">
            <div className="flex justify-center gap-4 mb-8">
              {(["work", "break", "longBreak"] as const).map((m) => (
                <Button
                  key={m}
                  variant={mode === m ? "default" : "outline"}
                  onClick={() => handleModeChange(m)}
                  className={mode === m ? "neon-glow-hover" : ""}
                >
                  {m === "work" ? "Work" : m === "break" ? "Break" : "Long Break"}
                </Button>
              ))}
            </div>

            <div className="relative w-64 h-64 mx-auto mb-8">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                  className="text-primary transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl font-bold">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => setIsRunning(!isRunning)} className="neon-glow-hover">
                {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              <Button size="lg" variant="outline" onClick={handleReset}>
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground">Sessions completed today</p>
              <p className="text-3xl font-bold text-primary mt-2">{sessions}</p>
            </div>
          </Card>
        </div>
      </motion.div>

      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Custom Pomodoro Duration</DialogTitle>
            <DialogDescription>
              Set your own work duration. Break and long break will be calculated automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-minutes">Work Duration (minutes)</Label>
              <Input
                id="custom-minutes"
                type="number"
                min="1"
                max="120"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="25"
              />
              <p className="text-xs text-muted-foreground">
                Break: {Math.floor(Number.parseInt(customMinutes || "25") / 5)} min | Long Break:{" "}
                {Math.floor(Number.parseInt(customMinutes || "25") / 2)} min
              </p>
            </div>
            <Button onClick={handleCustomDuration} className="w-full">
              Save Custom Duration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
