"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, CheckSquare, Calendar, BarChart3 } from "@/components/icons"
import { useTranslation } from "@/hooks/useTranslation"

export default function TeamDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const teamId = params.teamId as string
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState<any>(null)

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails()
    }
  }, [teamId])

  const fetchTeamDetails = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}`)
      if (response.ok) {
        const data = await response.json()
        setTeam(data)
      } else {
        router.push("/app/teams")
      }
    } catch (error) {
      console.error("Error fetching team details:", error)
      router.push("/app/teams")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (!team) {
    return null
  }

  return (
    <div className="p-4 md:p-8">
      <Button variant="ghost" onClick={() => router.push("/app/teams")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t("teams")}
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-primary neon-text">{team.name}</span>
        </h1>
        <p className="text-muted-foreground">{team.description}</p>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">
            <CheckSquare className="w-4 h-4 mr-2" />
            {t("teamTasks")}
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" />
            {t("teamMembers")}
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="w-4 h-4 mr-2" />
            {t("calendar")}
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t("teamStats")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6">
          <Card className="glass-card p-6">
            <p className="text-center text-muted-foreground">{t("teamTasks")} - Coming soon</p>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <Card className="glass-card p-6">
            <p className="text-center text-muted-foreground">{t("teamMembers")} - Coming soon</p>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card className="glass-card p-6">
            <p className="text-center text-muted-foreground">{t("calendar")} - Coming soon</p>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card className="glass-card p-6">
            <p className="text-center text-muted-foreground">{t("teamStats")} - Coming soon</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
