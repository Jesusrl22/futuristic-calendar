"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Zap } from "@/components/icons"
import { UpgradeModal } from "@/components/upgrade-modal"

export default function AIPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [credits, setCredits] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null)
  const [checkingAccess, setCheckingAccess] = useState(true)

  useEffect(() => {
    checkSubscriptionAndFetchCredits()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const checkSubscriptionAndFetchCredits = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setSubscriptionTier(data?.subscription_tier || "free")
        if (data?.subscription_tier === "pro") {
          setCredits(data?.ai_credits || 0)
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching profile:", error)
    } finally {
      setCheckingAccess(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    if (credits < 2) {
      alert("Not enough AI credits. You need at least 2 credits per message.")
      return
    }

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      console.log("[v0] Sending message to AI...")
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      console.log("[v0] AI response status:", response.status)
      const data = await response.json()

      if (data.error) {
        console.error("[v0] AI error:", data.error)
        throw new Error(data.error)
      }

      console.log("[v0] AI response received successfully")
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
      setCredits(data.remainingCredits)
    } catch (error) {
      console.error("[v0] AI chat error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (checkingAccess) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (subscriptionTier !== "pro") {
    return <UpgradeModal feature="AI Assistant" requiredPlan="pro" />
  }

  return (
    <div className="p-8 h-[calc(100vh-4rem)]">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">
            <span className="text-primary neon-text">AI Assistant</span>
          </h1>
          <Card className="glass-card px-4 py-2 neon-glow">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-semibold">{credits} credits</span>
            </div>
          </Card>
        </div>

        <Card className="glass-card flex-1 flex flex-col neon-glow overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <p className="text-lg mb-2">Welcome to your AI Assistant</p>
                <p className="text-sm">Ask me anything! Each message costs 2 credits.</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-border/50">
            <div className="flex gap-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="bg-secondary/50"
                disabled={loading}
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()} className="neon-glow-hover">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
