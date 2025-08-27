"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Clock, Target, TrendingUp, Calendar, Crown, Settings, Volume2 } from "lucide-react"
import { PomodoroTimer } from "./pomodoro-timer"
import type { UserPreferences } from "@/types"

interface PremiumPomodoroProps {
  preferences: UserPreferences
  onUpgrade?: () => void
}

export function PremiumPomodoro({ preferences, onUpgrade }: PremiumPomodoroProps) {
  const [activeTab, setActiveTab] = useState("timer")

  // Mock data for premium features
  const pomodoroStats = {
    todaySessions: 6,
    weekSessions: 28,
    totalSessions: 156,
    averageSessionLength: 24.5,
    focusTime: 147, // minutes today
    weeklyGoal: 40,
    completionRate: 85,
    bestStreak: 12,
    currentStreak: 5,
  }

  const weeklyData = [
    { day: "Mon", sessions: 4, focus: 98 },
    { day: "Tue", sessions: 6, focus: 142 },
    { day: "Wed", sessions: 3, focus: 72 },
    { day: "Thu", sessions: 5, focus: 118 },
    { day: "Fri", sessions: 7, focus: 165 },
    { day: "Sat", sessions: 2, focus: 48 },
    { day: "Sun", sessions: 1, focus: 25 },
  ]

  if (!preferences.isPremium) {
    return (
      <div className="space-y-4">
        {/* Basic Pomodoro Timer */}
        <PomodoroTimer preferences={preferences} />

        {/* Premium Upgrade Card */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Unlock Advanced Pomodoro</h3>
            <p className="text-white/90 mb-4">
              Get detailed statistics, custom sounds, session history, and productivity insights
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-white/20 rounded-lg p-3">
                <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                <div>Detailed Analytics</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <Volume2 className="h-6 w-6 mx-auto mb-2" />
                <div>Custom Sounds</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <Target className="h-6 w-6 mx-auto mb-2" />
                <div>Goal Tracking</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <Calendar className="h-6 w-6 mx-auto mb-2" />
                <div>Session History</div>
              </div>
            </div>
            <Button onClick={onUpgrade} className="bg-white text-orange-500 hover:bg-white/90">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
          <TabsTrigger value="timer" className="text-white data-[state=active]:bg-white/20">
            <Clock className="h-4 w-4 mr-2" />
            Timer
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-white data-[state=active]:bg-white/20">
            <BarChart3 className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="history" className="text-white data-[state=active]:bg-white/20">
            <Calendar className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-white data-[state=active]:bg-white/20">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Premium Pomodoro</h2>
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>

          <PomodoroTimer preferences={preferences} />

          {/* Today's Progress */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-white">
                <span>Sessions: {pomodoroStats.todaySessions}/8</span>
                <span>Focus Time: {pomodoroStats.focusTime}m</span>
              </div>
              <Progress value={(pomodoroStats.todaySessions / 8) * 100} className="bg-white/20" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Productivity Analytics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-white">{pomodoroStats.totalSessions}</div>
                <div className="text-white/70 text-sm">Total Sessions</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-white">{pomodoroStats.averageSessionLength}m</div>
                <div className="text-white/70 text-sm">Avg Session</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-white">{pomodoroStats.completionRate}%</div>
                <div className="text-white/70 text-sm">Completion Rate</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-white">{pomodoroStats.currentStreak}</div>
                <div className="text-white/70 text-sm">Current Streak</div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Chart */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Weekly Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.day} className="flex items-center space-x-4">
                    <div className="w-12 text-white/70 text-sm">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-white text-sm mb-1">
                        <span>{day.sessions} sessions</span>
                        <span>{day.focus}m</span>
                      </div>
                      <Progress value={(day.sessions / 8) * 100} className="bg-white/20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Session History</h2>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="text-center text-white/70">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Session history will appear here</p>
                <p className="text-sm mt-2">Complete some Pomodoro sessions to see your history</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Pomodoro Settings</h2>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="text-center text-white/70">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Advanced Pomodoro settings</p>
                <p className="text-sm mt-2">Customize your Pomodoro experience</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
