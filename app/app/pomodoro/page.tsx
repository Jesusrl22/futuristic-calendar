"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw } from "@/components/icons"

export default function PomodoroPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<"work" | "break" | "longBreak">("work")
  const [sessions, setSessions] = useState(0)

  const durations = {
    work: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleComplete()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleComplete = async () => {
    setIsRunning(false)

    if (mode === "work") {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await supabase.from("pomodoro_sessions").insert({
          user_id: user.id,
          duration: durations.work,
          completed: true,
        })
      }

      setSessions((prev) => prev + 1)
      setMode(sessions + 1 >= 4 ? "longBreak" : "break")
      setTimeLeft(sessions + 1 >= 4 ? durations.longBreak : durations.break)
    } else {
      setMode("work")
      setTimeLeft(durations.work)
      if (mode === "longBreak") setSessions(0)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(durations[mode])
  }

  const handleModeChange = (newMode: "work" | "break" | "longBreak") => {
    setMode(newMode)
    setTimeLeft(durations[newMode])
    setIsRunning(false)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-primary neon-text">Pomodoro Timer</span>
        </h1>

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
    </div>
  )
}
