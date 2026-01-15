"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { canAccessStatistics } from "@/lib/subscription"
import { UpgradeModal } from "@/components/upgrade-modal"
import { useTranslation } from "@/hooks/useTranslation"

type TimeRange = "day" | "week" | "month"

export default function StatsPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalNotes: 0,
    totalPomodoro: 0,
    totalFocusTime: 0,
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userTier, setUserTier] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>("day")
  const [userTimezone, setUserTimezone] = useState<string>("UTC")

  useEffect(() => {
    checkAccess()
  }, [])

  useEffect(() => {
    if (userTier && canAccessStatistics(userTier)) {
      fetchStats()
    }
  }, [timeRange, userTier])

  const checkAccess = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setUserTier(data.subscription_tier || "free")
        setUserTimezone(data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)
      }
    } catch (error) {
      console.error("Error checking access:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/stats?range=${timeRange}&timezone=${encodeURIComponent(userTimezone)}`)
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalTasks: data.totalTasks || 0,
          completedTasks: data.completedTasks || 0,
          totalNotes: data.totalNotes || 0,
          totalPomodoro: data.totalPomodoro || 0,
          totalFocusTime: data.totalFocusTime || 0,
        })
        setChartData(data.chartData || [])
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-muted-foreground">{t("loading")}</div>
      </div>
    )
  }

  if (!canAccessStatistics(userTier)) {
    return <UpgradeModal feature={t("statistics")} requiredPlan="pro" />
  }

  return (
    <div className="p-8">
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-primary neon-text">{t("your_statistics")}</span>
          </h1>

          <div className="flex gap-2">
            <Button
              variant={timeRange === "day" ? "default" : "outline"}
              onClick={() => setTimeRange("day")}
              className={timeRange === "day" ? "bg-primary/20 border-primary text-primary hover:bg-primary/30" : ""}
            >
              {t("day")}
            </Button>
            <Button
              variant={timeRange === "week" ? "default" : "outline"}
              onClick={() => setTimeRange("week")}
              className={timeRange === "week" ? "bg-primary/20 border-primary text-primary hover:bg-primary/30" : ""}
            >
              {t("week")}
            </Button>
            <Button
              variant={timeRange === "month" ? "default" : "outline"}
              onClick={() => setTimeRange("month")}
              className={timeRange === "month" ? "bg-primary/20 border-primary text-primary hover:bg-primary/30" : ""}
            >
              {t("month")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: t("total_tasks"),
              value: stats.totalTasks,
              gradient: "from-blue-500/20 to-blue-600/20",
              border: "border-blue-500/30",
              text: "text-blue-400",
            },
            {
              title: t("tasks_completed"),
              value: stats.completedTasks,
              gradient: "from-green-500/20 to-green-600/20",
              border: "border-green-500/30",
              text: "text-green-400",
            },
            {
              title: t("total_pomodoros"),
              value: stats.totalPomodoro,
              gradient: "from-purple-500/20 to-purple-600/20",
              border: "border-purple-500/30",
              text: "text-purple-400",
            },
            {
              title: t("focus_time"),
              value: `${stats.totalFocusTime}h`,
              gradient: "from-primary/20 to-primary/30",
              border: "border-primary/30",
              text: "text-primary",
            },
          ].map((stat, i) => (
            <div key={stat.title}>
              <Card
                className={`glass-card p-6 border-2 ${stat.border} bg-gradient-to-br ${stat.gradient} hover:scale-105 transition-transform duration-300`}
              >
                <h3 className="text-sm text-muted-foreground mb-2">{stat.title}</h3>
                <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass-card p-6 border-2 border-primary/30">
            <h2 className="text-xl font-bold mb-6">{t("activity_over_time")}</h2>
            <Tabs defaultValue="tasks">
              <TabsList className="mb-4">
                <TabsTrigger value="tasks">{t("tasks")}</TabsTrigger>
                <TabsTrigger value="pomodoro">{t("pomodoro")}</TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--primary) / 0.3)",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="pomodoro">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--primary) / 0.3)",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pomodoro"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="glass-card p-6 border-2 border-primary/30">
            <h2 className="text-xl font-bold mb-6">{t("productivity_insights")}</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t("task_completion_rate")}</span>
                  <span className="text-sm font-semibold text-primary">{completionRate}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    style={{ width: `${completionRate}%` }}
                    className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-1000"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                  <span className="text-sm">{t("average_focus_time")}</span>
                  <span className="font-semibold text-primary">
                    {timeRange === "day"
                      ? `${stats.totalFocusTime}h`
                      : timeRange === "week"
                        ? `${Math.round((stats.totalFocusTime / 7) * 10) / 10}h/day`
                        : `${Math.round((stats.totalFocusTime / 30) * 10) / 10}h/day`}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                  <span className="text-sm">{t("total_pomodoros")}</span>
                  <span className="font-semibold text-purple-400">{stats.totalPomodoro}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                  <span className="text-sm">{t("notes_created")}</span>
                  <span className="font-semibold text-blue-400">{stats.totalNotes}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
