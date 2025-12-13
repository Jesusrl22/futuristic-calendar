"use client"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { DialogTitle } from "@/components/ui/dialog"

import { DialogHeader } from "@/components/ui/dialog"

import { DialogContent } from "@/components/ui/dialog"

import { DialogTrigger } from "@/components/ui/dialog"

import { Dialog } from "@/components/ui/dialog"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, CheckSquare, Calendar, BarChart3, UserPlus, Trash2, Crown, Shield } from "@/components/icons"
import { useTranslation } from "@/hooks/useTranslation"

export default function TeamDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const teamId = params.teamId as string
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState<any>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviting, setInviting] = useState(false)

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

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return

    setInviting(true)
    try {
      const response = await fetch(`/api/teams/${teamId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      })

      if (response.ok) {
        setInviteDialogOpen(false)
        setInviteEmail("")
        alert(t("invitationSent"))
        fetchTeamDetails()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to send invitation")
      }
    } catch (error) {
      console.error("Error inviting member:", error)
      alert("An error occurred")
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm(t("confirmRemoveMember"))) return

    try {
      const response = await fetch(`/api/teams/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, memberId }),
      })

      if (response.ok) {
        fetchTeamDetails()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to remove member")
      }
    } catch (error) {
      console.error("Error removing member:", error)
    }
  }

  const getRoleIcon = (role: string) => {
    if (role === "owner") return <Crown className="w-4 h-4 text-yellow-500" />
    if (role === "admin") return <Shield className="w-4 h-4 text-blue-500" />
    return null
  }

  const canManageMembers = team?.role === "owner" || team?.role === "admin"

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
        {t("back")}
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-primary neon-text">{team.name}</span>
        </h1>
        <p className="text-muted-foreground">{team.description}</p>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" />
            {t("teamMembers")}
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckSquare className="w-4 h-4 mr-2" />
            {t("teamTasks")}
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

        <TabsContent value="members" className="mt-6 space-y-4">
          {canManageMembers && (
            <Card className="glass-card p-4">
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t("inviteMember")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("inviteMember")}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>{t("emailAddress")}</Label>
                      <Input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@example.com"
                      />
                    </div>
                    <Button onClick={handleInviteMember} disabled={inviting || !inviteEmail.trim()} className="w-full">
                      {inviting ? t("sending") : t("sendInvitation")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          )}

          <div className="grid gap-4">
            {team.members?.map((member: any) => (
              <Card key={member.id} className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{member.users?.name || member.users?.email}</p>
                        {getRoleIcon(member.role)}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.users?.email}</p>
                      <p className="text-xs text-muted-foreground">{t(member.role)}</p>
                    </div>
                  </div>
                  {canManageMembers && member.role !== "owner" && (
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card className="glass-card p-12 text-center">
            <CheckSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{t("teamTasksComingSoon")}</p>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card className="glass-card p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{t("teamCalendarComingSoon")}</p>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card className="glass-card p-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{t("teamStatsComingSoon")}</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
