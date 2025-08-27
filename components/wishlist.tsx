"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  Plus,
  Check,
  Calendar,
  Edit3,
  Trash2,
  MoreHorizontal,
  Trophy,
  Flag,
  Heart,
  Briefcase,
  GraduationCap,
  Home,
  Plane,
  DollarSign,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface Goal {
  id: string
  title: string
  description: string
  category: "personal" | "career" | "health" | "financial" | "travel" | "education" | "family"
  priority: "low" | "medium" | "high"
  targetDate?: Date
  completed: boolean
  completedAt?: Date
  createdAt: Date
  progress: number
  milestones: Milestone[]
}

interface Milestone {
  id: string
  title: string
  completed: boolean
  completedAt?: Date
}

interface WishlistProps {
  language: "en" | "es" | "fr" | "de" | "it"
}

const goalCategories = [
  { id: "personal", name: "Personal", icon: Heart, color: "bg-pink-500" },
  { id: "career", name: "Carrera", icon: Briefcase, color: "bg-blue-500" },
  { id: "health", name: "Salud", icon: Heart, color: "bg-red-500" },
  { id: "financial", name: "Financiero", icon: DollarSign, color: "bg-green-500" },
  { id: "travel", name: "Viajes", icon: Plane, color: "bg-purple-500" },
  { id: "education", name: "Educación", icon: GraduationCap, color: "bg-indigo-500" },
  { id: "family", name: "Familia", icon: Home, color: "bg-orange-500" },
]

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
  high: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400",
}

const translations = {
  es: {
    title: "Objetivos y Lista de Deseos",
    addGoal: "Añadir Objetivo",
    editGoal: "Editar Objetivo",
    goalTitle: "Título del Objetivo",
    description: "Descripción",
    category: "Categoría",
    priority: "Prioridad",
    targetDate: "Fecha Objetivo",
    progress: "Progreso",
    milestones: "Hitos",
    addMilestone: "Añadir Hito",
    completed: "Completado",
    pending: "Pendiente",
    noGoals: "No hay objetivos aún",
    createFirst: "¡Crea tu primer objetivo para empezar!",
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar",
    markComplete: "Marcar como Completado",
    markIncomplete: "Marcar como Incompleto",
    low: "Baja",
    medium: "Media",
    high: "Alta",
    personal: "Personal",
    career: "Carrera",
    health: "Salud",
    financial: "Financiero",
    travel: "Viajes",
    education: "Educación",
    family: "Familia",
    totalGoals: "Total de Objetivos",
  },
  en: {
    title: "Goals & Wishlist",
    addGoal: "Add Goal",
    editGoal: "Edit Goal",
    goalTitle: "Goal Title",
    description: "Description",
    category: "Category",
    priority: "Priority",
    targetDate: "Target Date",
    progress: "Progress",
    milestones: "Milestones",
    addMilestone: "Add Milestone",
    completed: "Completed",
    pending: "Pending",
    noGoals: "No goals yet",
    createFirst: "Create your first goal to get started!",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    markComplete: "Mark as Complete",
    markIncomplete: "Mark as Incomplete",
    low: "Low",
    medium: "Medium",
    high: "High",
    personal: "Personal",
    career: "Career",
    health: "Health",
    financial: "Financial",
    travel: "Travel",
    education: "Education",
    family: "Family",
    totalGoals: "Total Goals",
  },
}

export function Wishlist({ language }: WishlistProps) {
  const t = translations[language] || translations.es

  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wishlist-goals")
      if (saved) {
        try {
          const parsedGoals = JSON.parse(saved)
          return parsedGoals.map((goal: any) => ({
            ...goal,
            createdAt: new Date(goal.createdAt),
            targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined,
            completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
          }))
        } catch (error) {
          console.error("Error parsing saved goals:", error)
        }
      }
    }
    return []
  })

  const [showGoalDialog, setShowGoalDialog] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [goalTitle, setGoalTitle] = useState("")
  const [goalDescription, setGoalDescription] = useState("")
  const [goalCategory, setGoalCategory] = useState<Goal["category"]>("personal")
  const [goalPriority, setGoalPriority] = useState<Goal["priority"]>("medium")
  const [goalTargetDate, setGoalTargetDate] = useState<Date | undefined>(undefined)
  const [goalMilestones, setGoalMilestones] = useState<Milestone[]>([])
  const [newMilestone, setNewMilestone] = useState("")

  // Save goals to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist-goals", JSON.stringify(goals))
    }
  }, [goals])

  const resetGoalForm = () => {
    setGoalTitle("")
    setGoalDescription("")
    setGoalCategory("personal")
    setGoalPriority("medium")
    setGoalTargetDate(undefined)
    setGoalMilestones([])
    setNewMilestone("")
    setEditingGoal(null)
  }

  const handleSaveGoal = () => {
    if (!goalTitle.trim()) return

    const goalData: Goal = {
      id: editingGoal?.id || crypto.randomUUID(),
      title: goalTitle,
      description: goalDescription,
      category: goalCategory,
      priority: goalPriority,
      targetDate: goalTargetDate,
      completed: editingGoal?.completed || false,
      completedAt: editingGoal?.completedAt,
      createdAt: editingGoal?.createdAt || new Date(),
      progress: calculateProgress(goalMilestones),
      milestones: goalMilestones,
    }

    if (editingGoal) {
      setGoals(goals.map((goal) => (goal.id === editingGoal.id ? goalData : goal)))
      toast.success("¡Objetivo actualizado exitosamente!")
    } else {
      setGoals([goalData, ...goals])
      toast.success("¡Objetivo creado exitosamente!")
    }

    resetGoalForm()
    setShowGoalDialog(false)
  }

  const calculateProgress = (milestones: Milestone[]) => {
    if (milestones.length === 0) return 0
    const completed = milestones.filter((m) => m.completed).length
    return Math.round((completed / milestones.length) * 100)
  }

  const toggleGoalComplete = (goalId: string) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const completed = !goal.completed
          return {
            ...goal,
            completed,
            completedAt: completed ? new Date() : undefined,
            progress: completed ? 100 : calculateProgress(goal.milestones),
          }
        }
        return goal
      }),
    )
  }

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter((goal) => goal.id !== goalId))
    toast.success("¡Objetivo eliminado exitosamente!")
  }

  const addMilestone = () => {
    if (!newMilestone.trim()) return

    const milestone: Milestone = {
      id: crypto.randomUUID(),
      title: newMilestone,
      completed: false,
    }

    setGoalMilestones([...goalMilestones, milestone])
    setNewMilestone("")
  }

  const toggleMilestone = (milestoneId: string) => {
    setGoalMilestones(
      goalMilestones.map((milestone) => {
        if (milestone.id === milestoneId) {
          const completed = !milestone.completed
          return {
            ...milestone,
            completed,
            completedAt: completed ? new Date() : undefined,
          }
        }
        return milestone
      }),
    )
  }

  const editGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setGoalTitle(goal.title)
    setGoalDescription(goal.description)
    setGoalCategory(goal.category)
    setGoalPriority(goal.priority)
    setGoalTargetDate(goal.targetDate)
    setGoalMilestones(goal.milestones)
    setShowGoalDialog(true)
  }

  const completedGoals = goals.filter((goal) => goal.completed)
  const pendingGoals = goals.filter((goal) => !goal.completed)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-6 w-6 text-white" />
          <h2 className="text-2xl font-bold text-white">{t.title}</h2>
        </div>
        <Button
          onClick={() => setShowGoalDialog(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t.addGoal}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{completedGoals.length}</div>
                <div className="text-sm text-white/60">{t.completed}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flag className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{pendingGoals.length}</div>
                <div className="text-sm text-white/60">{t.pending}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{goals.length}</div>
                <div className="text-sm text-white/60">{t.totalGoals}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t.noGoals}</h3>
              <p className="text-white/60 mb-4">{t.createFirst}</p>
              <Button
                onClick={() => setShowGoalDialog(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.addGoal}
              </Button>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const category = goalCategories.find((c) => c.id === goal.category)
            const CategoryIcon = category?.icon || Target

            return (
              <Card
                key={goal.id}
                className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-colors ${
                  goal.completed ? "opacity-75" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleGoalComplete(goal.id)}
                        className="p-0 h-auto text-white hover:bg-white/20 mt-1"
                      >
                        {goal.completed ? (
                          <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 border-2 border-white/40 rounded-full" />
                        )}
                      </Button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3
                            className={`text-lg font-semibold text-white ${goal.completed ? "line-through opacity-60" : ""}`}
                          >
                            {goal.title}
                          </h3>
                          <Badge className={`${priorityColors[goal.priority]} text-xs`}>
                            {goal.priority === "low" ? t.low : goal.priority === "medium" ? t.medium : t.high}
                          </Badge>
                          {goal.completed && <Trophy className="h-4 w-4 text-yellow-400" />}
                        </div>

                        {goal.description && (
                          <p className={`text-white/70 mb-3 ${goal.completed ? "line-through opacity-60" : ""}`}>
                            {goal.description}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-white/60 mb-3">
                          <div className="flex items-center space-x-1">
                            <CategoryIcon className="h-4 w-4" />
                            <span>{category?.name || goal.category}</span>
                          </div>
                          {goal.targetDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{format(goal.targetDate, "MMM d, yyyy", { locale: es })}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <span>
                              {t.progress}: {goal.progress}%
                            </span>
                          </div>
                        </div>

                        {goal.milestones.length > 0 && (
                          <div className="space-y-2">
                            <Progress value={goal.progress} className="h-2" />
                            <div className="text-xs text-white/60">
                              {goal.milestones.filter((m) => m.completed).length} / {goal.milestones.length}{" "}
                              {t.milestones}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => editGoal(goal)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          {t.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleGoalComplete(goal.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          {goal.completed ? t.markIncomplete : t.markComplete}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteGoal(goal.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Goal Dialog */}
      <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
        <DialogContent className="sm:max-w-[600px] bg-white/10 backdrop-blur-md border-white/20 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGoal ? t.editGoal : t.addGoal}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="goal-title">{t.goalTitle}</Label>
              <Input
                id="goal-title"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder={t.goalTitle}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            <div>
              <Label htmlFor="goal-description">{t.description}</Label>
              <Textarea
                id="goal-description"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                placeholder={t.description}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal-category">{t.category}</Label>
                <Select value={goalCategory} onValueChange={(value: Goal["category"]) => setGoalCategory(value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {goalCategories.map((category) => {
                      const Icon = category.icon
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="goal-priority">{t.priority}</Label>
                <Select value={goalPriority} onValueChange={(value: Goal["priority"]) => setGoalPriority(value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t.low}</SelectItem>
                    <SelectItem value="medium">{t.medium}</SelectItem>
                    <SelectItem value="high">{t.high}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="goal-target-date">{t.targetDate} (Opcional)</Label>
              <Input
                id="goal-target-date"
                type="date"
                value={goalTargetDate ? goalTargetDate.toISOString().split("T")[0] : ""}
                onChange={(e) => setGoalTargetDate(e.target.value ? new Date(e.target.value) : undefined)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label>{t.milestones}</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    placeholder={t.addMilestone}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    onKeyPress={(e) => e.key === "Enter" && addMilestone()}
                  />
                  <Button type="button" onClick={addMilestone} className="bg-white/20 hover:bg-white/30 text-white">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <ScrollArea className="h-32">
                  <div className="space-y-1">
                    {goalMilestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center space-x-2 p-2 bg-white/5 rounded">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMilestone(milestone.id)}
                          className="p-0 h-auto text-white hover:bg-white/20"
                        >
                          {milestone.completed ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <div className="h-4 w-4 border border-white/40 rounded" />
                          )}
                        </Button>
                        <span className={`text-sm text-white ${milestone.completed ? "line-through opacity-60" : ""}`}>
                          {milestone.title}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setGoalMilestones(goalMilestones.filter((m) => m.id !== milestone.id))}
                          className="p-0 h-auto text-red-400 hover:bg-white/20 ml-auto"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetGoalForm()
                  setShowGoalDialog(false)
                }}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleSaveGoal}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {t.save}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
