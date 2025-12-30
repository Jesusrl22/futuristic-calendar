"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Zap, Plus, Trash2, MessageSquare, ChevronDown } from "@/components/icons"
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
  const [showDropdown, setShowDropdown] = useState(false)

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
      const stored = localStorage.getItem("ai_conversations")
      if (stored) {
        setConversations(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading conversations from storage:", error)
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
      title: "Nueva conversación",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: [],
    }
    const updated = [newConversation, ...conversations]
    setConversations(updated)
    saveConversationsToStorage(updated)
    setCurrentConversationId(newConversation.id)
    setMessages([])
    setInput("")
    setShowDropdown(false)
  }

  const loadConversation = (conversationId: string) => {
    const conv = conversations.find((c) => c.id === conversationId)
    if (conv) {
      setCurrentConversationId(conversationId)
      setMessages(conv.messages || [])
      setInput("")
      setShowDropdown(false)
    }
  }

  const deleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
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
          title: newMessages.length > 0 ? newMessages[0].content.substring(0, 50) + "..." : "Nueva conversación",
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
  const currentConv = conversations.find((c) => c.id === currentConversationId)

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background p-4 md:p-6">
      {/* Header with dropdown */}
      <div className="flex items-center justify-between gap-4 mb-6 relative">
        <div className="flex-1 relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 hover:border-primary bg-secondary/20 hover:bg-secondary/40 transition-all text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="truncate">{currentConv ? currentConv.title : t("new_conversation")}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-72 max-h-96 bg-secondary/90 backdrop-blur border border-border/50 rounded-lg shadow-lg z-50 overflow-y-auto">
              <div className="p-3 space-y-2 border-b border-border/50">
                <Button onClick={createNewConversation} className="w-full neon-glow-hover text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva conversación
                </Button>
              </div>

              <div className="p-2 space-y-1">
                {conversations.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-2 text-center">Sin conversaciones guardadas</p>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => loadConversation(conv.id)}
                      className={`w-full p-2 rounded-lg text-left transition-colors text-sm flex items-center justify-between group ${
                        currentConversationId === conv.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <span className="truncate flex-1 text-xs">{conv.title}</span>
                      <button
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Credits display */}
        <div className="flex gap-2 shrink-0">
          {monthlyCredits > 0 && (
            <Card className="glass-card px-2 py-1 md:px-3 md:py-2 neon-glow">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                <span className="text-xs md:text-sm font-semibold">{monthlyCredits}</span>
              </div>
            </Card>
          )}
          {purchasedCredits > 0 && (
            <Card className="glass-card px-2 py-1 md:px-3 md:py-2 neon-glow">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                <span className="text-xs md:text-sm font-semibold">{purchasedCredits}</span>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-h-0">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 px-4">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">¿En qué puedo ayudar?</h1>
              <p className="text-sm text-muted-foreground max-w-2xl">{t("ai_assistant_cost")}</p>
            </div>

            {/* Input at bottom for initial screen */}
            <div className="w-full max-w-2xl space-y-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Pregunta lo que quieras"
                  className="bg-secondary/50 text-sm"
                  disabled={loading}
                  autoFocus
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="neon-glow-hover shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Suggested prompts */}
              {input.trim() === "" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(prompt)}
                      className="p-3 rounded-lg border border-border/50 hover:border-primary bg-secondary/20 hover:bg-secondary/40 transition-all text-xs text-left hover:shadow-lg"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                {t("total_available")}: {totalCredits} {t("credits")}
              </p>
            </div>
          </div>
        ) : (
          // Chat messages view
          <>
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-lg text-sm ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/50"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
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

            {/* Input at bottom for chat */}
            <div className="flex gap-2 px-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Pregunta lo que quieras"
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
          </>
        )}
      </div>
    </div>
  )
}
