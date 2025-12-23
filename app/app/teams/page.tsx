"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Plus, UserPlus, Crown } from "@/components/icons"
import { useTranslation } from "@/hooks/useTranslation"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface Team {
  id: string
  name: string
  description: string
  role: string
  member_count: number
  created_at: string
}

export default function TeamsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDescription, setNewTeamDescription] = useState("")
  const [creating, setCreating] = useState(false)
  const [userPlan, setUserPlan] = useState("free")

  useEffect(() => {
    fetchTeams()
    fetchUserPlan()
  }, [])

  const fetchUserPlan = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setUserPlan(data.subscription_tier || "free")
      }
    } catch (error) {
      console.error("Error fetching user plan:", error)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams")
      if (response.ok) {
        const data = await response.json()
        setTeams(data.teams || [])
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return

    setCreating(true)
    try {
      console.log("[v0] Creating team with name:", newTeamName)
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeamName,
          description: newTeamDescription,
        }),
      })

      console.log("[v0] Team creation response status:", response.status)
      const data = await response.json()
      console.log("[v0] Team creation response:", data)

      if (response.ok) {
        setCreateDialogOpen(false)
        setNewTeamName("")
        setNewTeamDescription("")
        await fetchTeams()
      } else {
        alert(data.error || "Failed to create team")
      }
    } catch (error) {
      console.error("[v0] Error creating team:", error)
      alert("An error occurred while creating the team")
    } finally {
      setCreating(false)
    }
  }

  const getTeamLimit = () => {
    return Number.POSITIVE_INFINITY
  }

  const canCreateTeam = teams.length < getTeamLimit()

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-primary neon-text">{t("teams")}</span>
          </h1>
          <p className="text-muted-foreground">{t("createYourFirstTeam")}</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!canCreateTeam} className="neon-glow-hover">
              <Plus className="w-4 h-4 mr-2" />
              {t("createTeam")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("createTeam")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t("teamName")}</Label>
                <Input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="My Awesome Team"
                />
              </div>
              <div>
                <Label>{t("teamDescription")}</Label>
                <Textarea
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="What is this team about?"
                  rows={3}
                />
              </div>
              <Button onClick={handleCreateTeam} disabled={creating || !newTeamName.trim()} className="w-full">
                {creating ? t("creating") : t("createTeam")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {false && !canCreateTeam && (
        <Card className="glass-card p-4 mb-6 border-primary/50">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">{t("teamLimitReached")}</p>
              <p className="text-sm text-muted-foreground mb-2">
                {userPlan === "free" ? t("freePlanTeamLimit") : t("premiumPlanTeamLimit")}
              </p>
              <Button size="sm" onClick={() => router.push("/app/subscription")}>
                {userPlan === "free" ? t("upgradeToPremium") : t("upgradeToProForUnlimited")}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      ) : teams.length === 0 ? (
        <Card className="glass-card p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">{t("noTeamsFound")}</h3>
          <p className="text-muted-foreground mb-4">{t("createYourFirstTeam")}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className="glass-card p-6 neon-glow-hover cursor-pointer transition-all"
                onClick={() => router.push(`/app/teams/${team.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{team.name}</h3>
                      <p className="text-xs text-muted-foreground">{t(team.role)}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {team.description || "No description"}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <UserPlus className="w-4 h-4" />
                    <span>
                      {team.member_count} {t("teamMembers")}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
