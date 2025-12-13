"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogTitle as DialogTitleComponent } from "@/components/ui/dialog"
import { DialogHeader as DialogHeaderComponent } from "@/components/ui/dialog"
import { DialogContent as DialogContentComponent } from "@/components/ui/dialog"
import { DialogTrigger as DialogTriggerComponent } from "@/components/ui/dialog"
import { Dialog } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, CheckSquare, BarChart3, UserPlus, Trash2, Crown, Shield, Plus } from "@/components/icons"
import { useTranslation } from "@/hooks/useTranslation"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

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

  const [tasks, setTasks] = useState<any[]>([])
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    assigned_to: "",
    due_date: "",
  })

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    memberStats: [] as any[],
  })

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails()
      fetchTeamTasks()
      fetchTeamStats()
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

  const fetchTeamTasks = async () => {
    try {
      const response = await fetch(`/api/team-tasks?teamId=${teamId}`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error("Error fetching team tasks:", error)
    }
  }

  const fetchTeamStats = async () => {
    try {
      const response = await fetch(`/api/team-tasks?teamId=${teamId}`)
      if (response.ok) {
        const data = await response.json()
        const allTasks = data.tasks || []

        const totalTasks = allTasks.length
        const completedTasks = allTasks.filter((t: any) => t.completed).length
        const activeTasks = totalTasks - completedTasks

        // Member stats
        const memberMap = new Map()
        allTasks.forEach((task: any) => {
          const assignedTo = task.assigned_to || "unassigned"
          const userName = task.assigned_user?.name || task.assigned_user?.email || "Unassigned"

          if (!memberMap.has(assignedTo)) {
            memberMap.set(assignedTo, {
              id: assignedTo,
              name: userName,
              total: 0,
              completed: 0,
            })
          }

          const stats = memberMap.get(assignedTo)
          stats.total++
          if (task.completed) stats.completed++
        })

        setStats({
          totalTasks,
          completedTasks,
          activeTasks,
          memberStats: Array.from(memberMap.values()),
        })
      }
    } catch (error) {
      console.error("Error fetching team stats:", error)
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

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      alert(t("enterTaskTitle"))
      return
    }

    try {
      const response = await fetch("/api/team-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTask,
          teamId,
          assigned_to: newTask.assigned_to || null,
          completed: false,
        }),
      })

      if (response.ok) {
        setIsTaskDialogOpen(false)
        setNewTask({
          title: "",
          description: "",
          priority: "medium",
          assigned_to: "",
          due_date: "",
        })
        fetchTeamTasks()
        fetchTeamStats()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to create task")
      }
    } catch (error) {
      console.error("Error creating task:", error)
      alert("Failed to create task")
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      await fetch("/api/team-tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, teamId, completed: !completed }),
      })
      fetchTeamTasks()
      fetchTeamStats()
    } catch (error) {
      console.error("Error toggling task:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!confirm(t("deleteConfirm"))) return

    try {
      await fetch("/api/team-tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, teamId }),
      })
      fetchTeamTasks()
      fetchTeamStats()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const getRoleIcon = (role: string) => {
    if (role === "owner") return <Crown className="w-4 h-4 text-yellow-500" />
    if (role === "admin") return <Shield className="w-4 h-4 text-blue-500" />
    return null
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 border-red-500"
      case "medium":
        return "text-yellow-500 border-yellow-500"
      case "low":
        return "text-green-500 border-green-500"
      default:
        return "text-muted-foreground"
    }
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

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">
            <CheckSquare className="w-4 h-4 mr-2" />
            {t("teamTasks")}
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" />
            {t("teamMembers")}
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t("teamStats")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6 space-y-4">
          <Card className="glass-card p-4">
            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
              <DialogTriggerComponent asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  {t("newTask")}
                </Button>
              </DialogTriggerComponent>
              <DialogContentComponent>
                <DialogHeaderComponent>
                  <DialogTitleComponent>{t("createNewTask")}</DialogTitleComponent>
                </DialogHeaderComponent>
                <div className="space-y-4">
                  <div>
                    <Label>{t("title")} *</Label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder={t("title")}
                    />
                  </div>
                  <div>
                    <Label>{t("description")}</Label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder={t("description")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t("priority")}</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">{t("low")}</SelectItem>
                          <SelectItem value="medium">{t("medium")}</SelectItem>
                          <SelectItem value="high">{t("high")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{t("assignTo")}</Label>
                      <Select
                        value={newTask.assigned_to}
                        onValueChange={(value) => setNewTask({ ...newTask, assigned_to: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("unassigned")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">{t("unassigned")}</SelectItem>
                          {team.members?.map((member: any) => (
                            <SelectItem key={member.user_id} value={member.user_id}>
                              {member.users?.name || member.users?.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>{t("dueDate")}</Label>
                    <Input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateTask} className="w-full">
                    {t("createTask")}
                  </Button>
                </div>
              </DialogContentComponent>
            </Dialog>
          </Card>

          <div className="space-y-4">
            {tasks.length === 0 ? (
              <Card className="glass-card p-12 text-center">
                <CheckSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t("noTasksFound")}</p>
              </Card>
            ) : (
              tasks.map((task) => (
                <Card key={task.id} className="glass-card p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id, task.completed)} />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </h3>
                      {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {t(task.priority)}
                        </Badge>
                        {task.assigned_user && (
                          <Badge variant="outline">{task.assigned_user.name || task.assigned_user.email}</Badge>
                        )}
                        {task.due_date && (
                          <span className="text-xs text-muted-foreground">
                            {t("due")}: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-6 space-y-4">
          {canManageMembers && (
            <Card className="glass-card p-4">
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTriggerComponent asChild>
                  <Button className="w-full sm:w-auto">
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t("inviteMember")}
                  </Button>
                </DialogTriggerComponent>
                <DialogContentComponent>
                  <DialogHeaderComponent>
                    <DialogTitleComponent>{t("inviteMember")}</DialogTitleComponent>
                  </DialogHeaderComponent>
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
                </DialogContentComponent>
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

        <TabsContent value="stats" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="glass-card p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{t("totalTasks")}</p>
                <p className="text-4xl font-bold text-primary">{stats.totalTasks}</p>
              </div>
            </Card>
            <Card className="glass-card p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{t("completedTasks")}</p>
                <p className="text-4xl font-bold text-green-500">{stats.completedTasks}</p>
              </div>
            </Card>
            <Card className="glass-card p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{t("activeTasks")}</p>
                <p className="text-4xl font-bold text-yellow-500">{stats.activeTasks}</p>
              </div>
            </Card>
          </div>

          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">{t("memberPerformance")}</h3>
            <div className="space-y-4">
              {stats.memberStats.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {member.completed}/{member.total} {t("completed")}
                      </span>
                      <div className="flex-1 max-w-xs">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${member.total > 0 ? (member.completed / member.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {member.total > 0 ? Math.round((member.completed / member.total) * 100) : 0}%
                    </p>
                  </div>
                </div>
              ))}
              {stats.memberStats.length === 0 && (
                <p className="text-center text-muted-foreground py-8">{t("noTasksYet")}</p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
