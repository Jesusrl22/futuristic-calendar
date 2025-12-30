"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Zap, Plus, Trash2, MessageSquare, Menu, X } from "@/components/icons"
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

const SUGGESTED_PROMPTS = [
  "¿Cuál es la mejor manera de estudiar?",
  "¿Qué es la inteligencia artificial?",
  "¿Cómo mejorar mi productividad?",
  "Dame consejos sobre salud mental",
]

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
  const [showSidebar, setShowSidebar] = useState(true)

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
      console.error("Error loading conversations from storage:", error)
    } finally {
      setLoadingConversations(false)
    }
  }

  const saveConversationsToStorage = (convs: Conversation[]) => {
    try {
      localStorage.setItem("ai_conversations", JSON.stringify(convs))
    } catch (error) {
      console.error("Error saving conversations to storage:", error)
    }
  }

  const createNewConversation = () => {
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
  }

  const loadConversation = (conversationId: string) => {
    const conv = conversations.find((c) => c.id === conversationId)
    if (conv) {
      setCurrentConversationId(conversationId)
      setMessages(conv.messages || [])
    }
  }

  const deleteConversation = (conversationId: string) => {
    if (!confirm(t("confirm_delete"))) return

    const updated = conversations.filter((c) => c.id !== conversationId)
    setConversations(updated)
    saveConversationsToStorage(updated)
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null)
      setMessages([])
    }
  }

  const saveConversation = (conversationId: string, newMessages: any[]) => {
    const updated = conversations.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: newMessages,
          title: newMessages.length > 0 ? newMessages[0].content.substring(0, 50) + "..." : "New Conversation",
          updated_at: new Date().toISOString(),
        }
      }
      return c
    })

    setConversations(updated)
    saveConversationsToStorage(updated)
  }

  const handleSend = async (messageToSend?: string) => {
    const textToSend = messageToSend || input
    if (!textToSend.trim() || loading) return

    const totalCredits = monthlyCredits + purchasedCredits
    if (totalCredits < 2) {
      alert(`${t("not_enough_credits")}. ${t("need_at_least_two_credits")}`)
      return
    }

    let conversationId = currentConversationId
    if (!conversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: textToSend.substring(0, 50) + "...",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: [],
      }
      const updated = [newConversation, ...conversations]
      setConversations(updated)
      saveConversationsToStorage(updated)
      conversationId = newConversation.id
      setCurrentConversationId(conversationId)
    }

    const userMessage = { role: "user", content: textToSend }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    saveConversation(conversationId, newMessages)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const updatedMessages = [...newMessages, { role: "assistant", content: data.response }]
      setMessages(updatedMessages)
      saveConversation(conversationId, updatedMessages)

      setMonthlyCredits(data.remainingMonthlyCredits)
      setPurchasedCredits(data.remainingPurchasedCredits)
    } catch (error) {
      console.error("AI chat error:", error)
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
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {showSidebar && (
        <div className="fixed inset-0 bg-black/50 lg:hidden z-40" onClick={() => setShowSidebar(false)} />
      )}

      <div
        className={`${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative w-64 h-full flex flex-col gap-4 bg-background border-r border-border/50 p-4 rounded-none lg:rounded-lg transition-transform z-50 lg:z-0`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{t("conversations")}</h3>
          <button onClick={() => setShowSidebar(false)} className="lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        <Button onClick={createNewConversation} className="w-full neon-glow-hover text-sm">
          <Plus className="w-4 h-4 mr-2" />
          {t("new_conversation")}
        </Button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between group text-sm ${
                currentConversationId === conv.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary"
              }`}
              onClick={() => loadConversation(conv.id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MessageSquare className="w-3 h-3 shrink-0" />
                <span className="truncate text-xs">{conv.title}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteConversation(conv.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full p-4 lg:p-6 gap-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSidebar(!showSidebar)} className="lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold">
              <span className="text-primary neon-text">{t("ai_assistant")}</span>
            </h1>
          </div>
          <div className="flex gap-2">
            {monthlyCredits > 0 && (
              <Card className="glass-card px-2 py-1 lg:px-3 lg:py-2 neon-glow">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />
                  <span className="text-xs lg:text-sm font-semibold">{monthlyCredits}</span>
                </div>
              </Card>
            )}
            {purchasedCredits > 0 && (
              <Card className="glass-card px-2 py-1 lg:px-3 lg:py-2 neon-glow">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500" />
                  <span className="text-xs lg:text-sm font-semibold">{purchasedCredits}</span>
                </div>
              </Card>
            )}
          </div>
        </div>

        <Card className="glass-card flex-1 flex flex-col neon-glow overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 flex flex-col justify-center">
            {messages.length === 0 ? (
              <div className="text-center space-y-6 py-8">
                <div>
                  <h2 className="text-xl lg:text-2xl font-semibold mb-2">{t("how_can_i_help")}</h2>
                  <p className="text-sm text-muted-foreground">{t("ai_assistant_cost")}</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(prompt)}
                      className="p-4 rounded-lg border border-border/50 hover:border-primary bg-secondary/20 hover:bg-secondary/40 transition-all text-sm text-left hover:shadow-lg"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("total_available")}: {totalCredits} {t("credits")}
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] lg:max-w-[70%] p-3 lg:p-4 rounded-lg text-sm ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/50"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary/50 p-3 lg:p-4 rounded-lg">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-4 lg:p-6 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("type_your_message")}
                className="bg-secondary/50 text-sm"
                disabled={loading}
              />
              <Button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="neon-glow-hover shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
