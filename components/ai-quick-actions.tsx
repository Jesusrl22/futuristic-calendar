"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, CalendarPlus, ListTodo, BookOpen, Brain, Zap } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/useTranslation"
import { toast } from "react-toastify"

export function AIQuickActions() {
  const router = useRouter()
  const { t } = useTranslation()
  const [loading, setLoading] = useState<string | null>(null)

  const quickActions = [
    {
      id: "plan-day",
      title: t("plan_my_day"),
      description: t("plan_my_day_description"),
      icon: CalendarPlus,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "prioritize-tasks",
      title: t("prioritize_tasks"),
      description: t("prioritize_tasks_description"),
      icon: ListTodo,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "study-plan",
      title: t("create_study_plan"),
      description: t("create_study_plan_description"),
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      id: "summarize-notes",
      title: t("summarize_notes"),
      description: t("summarize_notes_description"),
      icon: Brain,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  const handleQuickAction = async (actionId: string) => {
    setLoading(actionId)

    try {
      const prompts: Record<string, string> = {
        "plan-day":
          "Based on my current tasks, create a detailed schedule for today with time blocks. Include breaks and prioritize by deadline.",
        "prioritize-tasks":
          "Analyze all my tasks and organize them using the Eisenhower Matrix (urgent/important). Suggest which to do first.",
        "study-plan":
          "Create a 7-day study plan based on my notes and tasks. Include review sessions and spaced repetition.",
        "summarize-notes": "Summarize my 5 most recent notes into bullet points with key takeaways.",
      }

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompts[actionId],
          conversationId: null,
        }),
      })

      if (!response.ok) throw new Error("AI action failed")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      let aiResponse = ""
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        aiResponse += decoder.decode(value)
      }

      // Navigate to AI page with result
      router.push(`/app/ai?result=${encodeURIComponent(aiResponse)}`)
      toast.success("AI action completed!")
    } catch (error) {
      console.error("[v0] Quick action error:", error)
      toast.error("Failed to complete AI action")
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Quick Actions
        </CardTitle>
        <CardDescription>One-click AI assistance for common tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className="h-auto p-4 justify-start bg-transparent"
            onClick={() => handleQuickAction(action.id)}
            disabled={loading === action.id}
          >
            <div className={`p-2 rounded-lg ${action.bgColor} mr-3`}>
              <action.icon className={`h-5 w-5 ${action.color}`} />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium">{action.title}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
            {loading === action.id ? (
              <Zap className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
