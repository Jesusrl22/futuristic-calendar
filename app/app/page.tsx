"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CalendarWidget } from "@/components/calendar-widget"
import { TaskManager } from "@/components/task-manager"
import { NotesManager } from "@/components/notes-manager"
import { WishlistManager } from "@/components/wishlist-manager"
import { AiAssistant } from "@/components/ai-assistant"
import { AchievementsDisplay } from "@/components/achievements-display"
import { SettingsModal } from "@/components/settings-modal"
import { SubscriptionModal } from "@/components/subscription-modal"
import { LanguageSelector } from "@/components/language-selector"
import { AchievementsBadgeViewer } from "@/components/achievements-badge-viewer"
import {
  Calendar,
  CheckSquare,
  FileText,
  Heart,
  Bot,
  Settings,
  Crown,
  Zap,
  Star,
  TrendingUp,
  Target,
  Clock,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  plan: "free" | "premium" | "pro"
  subscription_status: string
  ai_credits: number
  created_at: string
}

interface Task {
  id: string
  title: string
  description: string
  date: string
  time?: string
  category: string
  completed: boolean
  notifications: boolean
}

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

export default function AppPage() {
  const [user, setUser] = useState<User>({
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    plan: "free",
    subscription_status: "active",
    ai_credits: 0,
    created_at: new Date().toISOString(),
  })

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the Q4 project proposal for the client",
      date: new Date().toISOString().split("T")[0],
      time: "14:00",
      category: "work",
      completed: false,
      notifications: true,
    },
    {
      id: "2",
      title: "Gym workout",
      description: "Cardio and strength training",
      date: new Date().toISOString().split("T")[0],
      time: "18:00",
      category: "health",
      completed: false,
      notifications: true,
    },
  ])

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      name: "First Task",
      description: "Complete your first task",
      icon: "check",
      category: "tasks",
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      unlockedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Task Master",
      description: "Complete 10 tasks",
      icon: "target",
      category: "tasks",
      unlocked: false,
      progress: 1,
      maxProgress: 10,
    },
    {
      id: "3",
      name: "Premium Explorer",
      description: "Explore premium features",
      icon: "crown",
      category: "premium",
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      requiredPlan: "premium",
    },
    {
      id: "4",
      name: "AI Enthusiast",
      description: "Use AI assistant 50 times",
      icon: "zap",
      category: "premium",
      unlocked: false,
      progress: 0,
      maxProgress: 50,
      requiredPlan: "pro",
    },
  ])

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [currentTheme, setCurrentTheme] = useState("light")

  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    soundEnabled: true,
    pomodoroWorkTime: 25,
    pomodoroBreakTime: 5,
    pomodoroLongBreak: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  })

  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    bio: "Productivity enthusiast using FutureTask to stay organized.",
  })

  const handleTaskCreate = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const handleTaskComplete = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const handlePlanSelect = (plan: "free" | "premium" | "pro", billing: "monthly" | "yearly") => {
    setUser((prev) => ({ ...prev, plan }))
    setShowSubscription(false)
    // Here you would integrate with your payment system
    console.log(`Selected ${plan} plan with ${billing} billing`)
  }

  const handleCancelSubscription = () => {
    setUser((prev) => ({ ...prev, plan: "free", subscription_status: "cancelled" }))
    setShowSubscription(false)
    // Here you would integrate with your payment system
    console.log("Subscription cancelled")
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length

  const todayTasks = tasks.filter((task) => task.date === new Date().toISOString().split("T")[0])
  const upcomingTasks = tasks.filter((task) => new Date(task.date) > new Date() && !task.completed)

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "premium":
        return Crown
      case "pro":
        return Zap
      default:
        return Star
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "premium":
        return "text-blue-600"
      case "pro":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">Let's make today productive</p>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button variant="outline" onClick={() => setShowSubscription(true)} className="flex items-center space-x-2">
              {React.createElement(getPlanIcon(user.plan), {
                className: `h-4 w-4 ${getPlanColor(user.plan)}`,
              })}
              <span className="capitalize">{user.plan}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">{completedTasks} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {todayTasks.filter((t) => t.completed).length} completed today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unlockedAchievements}</div>
              <div className="mt-2">
                <AchievementsBadgeViewer
                  achievements={achievements}
                  userPlan={user.plan}
                  totalUnlocked={unlockedAchievements}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Notes</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center space-x-2" disabled={user.plan === "free"}>
              <Heart className="h-4 w-4" />
              <span>Wishlist</span>
              {user.plan === "free" && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  Premium
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2" disabled={user.plan !== "pro"}>
              <Bot className="h-4 w-4" />
              <span>AI Assistant</span>
              {user.plan !== "pro" && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  Pro
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CalendarWidget
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  tasks={tasks}
                  onTaskCreate={handleTaskCreate}
                />

                <AchievementsDisplay user={user} achievements={achievements.slice(0, 3)} onViewAll={() => {}} />
              </div>

              <div className="space-y-6">
                <TaskManager
                  tasks={tasks}
                  onTaskComplete={handleTaskComplete}
                  onTaskDelete={handleTaskDelete}
                  onTaskCreate={handleTaskCreate}
                  selectedDate={selectedDate}
                />

                {upcomingTasks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {upcomingTasks.slice(0, 3).map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-2 rounded-lg border">
                            <div>
                              <p className="font-medium text-sm">{task.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(task.date).toLocaleDateString()}
                                {task.time && ` at ${task.time}`}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {task.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <NotesManager userId={user.id} userPlan={user.plan} />
          </TabsContent>

          <TabsContent value="wishlist">
            {user.plan !== "free" ? (
              <WishlistManager userId={user.id} />
            ) : (
              <Card className="text-center p-8">
                <CardContent>
                  <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
                  <p className="text-muted-foreground mb-4">Upgrade to Premium or Pro to access the Wishlist Manager</p>
                  <Button onClick={() => setShowSubscription(true)}>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ai">
            {user.plan === "pro" ? (
              <AiAssistant
                userId={user.id}
                aiCredits={user.ai_credits}
                onCreditsUpdate={(credits) => setUser((prev) => ({ ...prev, ai_credits: credits }))}
              />
            ) : (
              <Card className="text-center p-8">
                <CardContent>
                  <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Pro Feature</h3>
                  <p className="text-muted-foreground mb-4">
                    Upgrade to Pro to access the AI Assistant with 1000 monthly credits
                  </p>
                  <Button onClick={() => setShowSubscription(true)}>
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          userPlan={user.plan}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          settings={settings}
          onSettingsChange={setSettings}
          profile={profile}
          onProfileUpdate={setProfile}
        />

        <SubscriptionModal
          isOpen={showSubscription}
          onClose={() => setShowSubscription(false)}
          currentPlan={user.plan}
          onPlanSelect={handlePlanSelect}
          onCancelSubscription={handleCancelSubscription}
        />
      </div>
    </div>
  )
}
