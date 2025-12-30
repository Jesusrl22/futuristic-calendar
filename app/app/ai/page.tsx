"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Zap, Plus, Trash2, MessageSquare } from "@/components/icons"
import { UpgradeModal } from "@/components/upgrade-modal"
import { canAccessAI } from "@/lib/subscription"
import { useTranslation } from "@/hooks/useTranslation"

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
  messages: { role: string; content: string }[]
}

export default function AIPage() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [monthlyCredits, setMonthlyCredits] = useState(0)
  const [purchasedCredits, setPurchasedCredits] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null)
  const [checkingAccess, setCheckingAccess] = useState(true)

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [loadingConversations, setLoadingConversations] = useState(false)

  useEffect(() => {
    checkSubscriptionAndFetchCredits()
    loadConversationsFromStorage()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const checkSubscriptionAndFetchCredits = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setSubscriptionTier(data.subscription_tier || "free")
        setMonthlyCredits(data?.ai_credits_monthly || 0)
        setPurchasedCredits(data?.ai_credits_purchased || 0)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setCheckingAccess(false)
    }
  }

  const loadConversationsFromStorage = () => {
    try {
      setLoadingConversations(true)
      const stored = localStorage.getItem("ai_conversations")
      if (stored) {
        setConversations(JSON.parse(stored))
      }
    } catch (error) {
      console.error("[v0] Error loading conversations from storage:", error)
    } finally {
      setLoadingConversations(false)
    }
  }

  const saveConversationsToStorage = (convs: Conversation[]) => {
    try {
      localStorage.setItem("ai_conversations", JSON.stringify(convs))
    } catch (error) {
      console.error("[v0] Error saving conversations to storage:", error)
    }
  }

  const createNewConversation = () => {
    try {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: "New Conversation",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: [],
      }
      const updated = [newConversation, ...conversations]
      setConversations(updated)
      saveConversationsToStorage(updated)
      setCurrentConversationId(newConversation.id)
      setMessages([])
      console.log("[v0] New conversation created:", newConversation.id)
    } catch (error) {
      console.error("[v0] Error creating conversation:", error)
    }
  }

  const loadConversation = (conversationId: string) => {
    try {
      const conv = conversations.find((c) => c.id === conversationId)
      if (conv) {
        setCurrentConversationId(conversationId)
        setMessages(conv.messages || [])
      }
    } catch (error) {
      console.error("[v0] Error loading conversation:", error)
    }
  }

  const deleteConversation = (conversationId: string) => {
    if (!confirm(t("confirm_delete"))) return

    try {
      const updated = conversations.filter((c) => c.id !== conversationId)
      setConversations(updated)
      saveConversationsToStorage(updated)
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null)
        setMessages([])
      }
    } catch (error) {
      console.error("[v0] Error deleting conversation:", error)
    }
  }

  const saveConversation = (conversationId: string, newMessages: any[]) => {
    try {
      console.log("[v0] Saving conversation:", conversationId, "with", newMessages.length, "messages")
      const updated = conversations.map((c) => {
        if (c.id === conversationId) {
          const updatedConv = {
            ...c,
            messages: newMessages,
            title: newMessages.length > 0 ? newMessages[0].content.substring(0, 50) + "..." : "New Conversation",
            updated_at: new Date().toISOString(),
          }
          console.log("[v0] Updated conversation:", updatedConv)
          return updatedConv
        }
        return c
      })

      if (updated.length === 0) {
        console.error("[v0] Conversation not found:", conversationId)
        return
      }

      setConversations(updated)
      saveConversationsToStorage(updated)
      console.log("[v0] Conversation saved successfully")
    } catch (error) {
      console.error("[v0] Error saving conversation:", error)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const totalCredits = monthlyCredits + purchasedCredits
    if (totalCredits < 2) {
      alert(`${t("not_enough_credits")}. ${t("need_at_least_two_credits")}`)
      return
    }

    let conversationId = currentConversationId

    if (!conversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: input.substring(0, 50) + "...",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: [],
      }
      const updated = [newConversation, ...conversations]
      setConversations(updated)
      saveConversationsToStorage(updated)
      conversationId = newConversation.id
      setCurrentConversationId(conversationId)
      console.log("[v0] New conversation created:", conversationId)
    }

    const userMessage = { role: "user", content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    if (conversationId) {
      saveConversation(conversationId, newMessages)
    }

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()

      if (data.error) {
        console.error("[v0] AI error:", data.error)
        throw new Error(data.error)
      }

      const updatedMessages = [...newMessages, { role: "assistant", content: data.response }]
      setMessages(updatedMessages)

      if (conversationId) {
        saveConversation(conversationId, updatedMessages)
      }

      setMonthlyCredits(data.remainingMonthlyCredits)
      setPurchasedCredits(data.remainingPurchasedCredits)
    } catch (error) {
      console.error("[v0] AI chat error:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: t("error_encountered") }])
    } finally {
      setLoading(false)
    }
  }

  if (checkingAccess) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center">
        <p>{t("loading")}</p>
      </div>
    )
  }

  if (!canAccessAI(subscriptionTier as any, purchasedCredits)) {
    return (
      <div className="p-4 md:p-8">
        <UpgradeModal
          feature={t("ai_assistant")}
          requiredPlan="premium"
          customMessage={t("ai_assistant_upgrade_message")}
        />
      </div>
    )
  }

  const totalCredits = monthlyCredits + purchasedCredits

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-4rem)] flex gap-4">
      <div className="hidden lg:flex w-64 flex-col gap-4">
        <Button
          onClick={() => {
            createNewConversation()
          }}
          className="w-full neon-glow-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("new_conversation")}
        </Button>

        <div className="flex-1 overflow-y-auto space-y-2">
          <p className="text-sm font-semibold text-muted-foreground px-2">{t("recent_conversations")}</p>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between group ${
                currentConversationId === conv.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary"
              }`}
              onClick={() => loadConversation(conv.id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="text-sm truncate">{conv.title}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteConversation(conv.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 h-full flex flex-col">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-4">
          <h1 className="hidden md:block text-2xl md:text-4xl font-bold">
            <span className="text-primary neon-text">{t("ai_assistant")}</span>
          </h1>
          <div className="flex gap-2 w-full md:w-auto">
            {monthlyCredits > 0 && (
              <Card className="glass-card px-3 py-2 neon-glow flex-1 md:flex-none">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">
                    {monthlyCredits} {t("monthly")}
                  </span>
                </div>
              </Card>
            )}
            {purchasedCredits > 0 && (
              <Card className="glass-card px-3 py-2 neon-glow flex-1 md:flex-none">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold">
                    {purchasedCredits} {t("purchased")}
                  </span>
                </div>
              </Card>
            )}
          </div>
        </div>

        <Card className="glass-card flex-1 flex flex-col neon-glow overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8 md:py-12">
                <p className="text-base md:text-lg mb-2">{t("ai_assistant_welcome")}</p>
                <p className="text-xs md:text-sm">{t("ai_assistant_cost")}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("total_available")}: {totalCredits} {t("credits")}
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-lg ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-foreground"
                  }`}
                >
                  <p className="text-xs md:text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 p-3 md:p-4 rounded-lg">
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

          <div className="p-4 md:p-6 border-t border-border/50">
            <div className="flex gap-2 md:gap-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("type_your_message")}
                className="bg-secondary/50 text-sm md:text-base"
                disabled={loading}
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()} className="neon-glow-hover shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
