"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Zap, Plus, Trash2, Menu, X } from "@/components/icons"
import { UpgradeModal } from "@/components/upgrade-modal"
import { useTranslation } from "@/hooks/useTranslation"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
  messages: { role: string; content: string }[]
}

const AIPage = () => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const [isLoadingTier, setIsLoadingTier] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [profileData, setProfileData] = useState({
    tier: null as string | null,
    monthlyCredits: 0,
    purchasedCredits: 0,
  })

  const SUGGESTED_PROMPTS = [t("study_tips"), t("productivity_tips")]

  useEffect(() => {
    const checkAccessAndLoadConversations = async () => {
      try {
        // Get user and token from supabase auth
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.user) {
          setProfileData({ tier: "free", monthlyCredits: 0, purchasedCredits: 0 })
          return
        }

        const profileResponse = await fetch("/api/user/profile")
        if (profileResponse.ok) {
          const profile = await profileResponse.json()
          const tier = (profile.subscription_tier || "free").toLowerCase()
          setProfileData({
            tier: tier,
            monthlyCredits: profile.ai_credits || 0,
            purchasedCredits: profile.ai_credits_purchased || 0,
          })
        } else {
          setProfileData({ tier: "free", monthlyCredits: 0, purchasedCredits: 0 })
        }

        // Load conversations
        const response = await fetch("/api/ai-conversations", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          const convs = Array.isArray(data) ? data : data.conversations || []
          setConversations(convs)
        }
      } catch (error) {
        console.error("[v0] Error loading profile:", error)
        setProfileData({ tier: "free", monthlyCredits: 0, purchasedCredits: 0 })
      }
    }

    checkAccessAndLoadConversations()
  }, [])

  const saveConversation = async (conversationId: string, newMessages: any[]) => {
    const updated = conversations.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: newMessages,
          title: newMessages.length > 0 ? newMessages[0].content.substring(0, 50) + "..." : t("new_conversation"),
          updated_at: new Date().toISOString(),
        }
      }
      return c
    })

    setConversations(updated)

    const conversationToSave = updated.find((c) => c.id === conversationId)
    if (conversationToSave) {
      try {
        const response = await fetch("/api/ai-conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(conversationToSave),
        })

        if (!response.ok) {
          console.error("[v0] Error saving conversation:", response.statusText)
        }
      } catch (error) {
        console.error("[v0] Error saving conversation to API:", error)
      }
    }
  }

  const createNewConversation = async () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: t("new_conversation"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: [],
    }
    const updated = [newConversation, ...conversations]
    setConversations(updated)
    setCurrentConversationId(newConversation.id)
    setMessages([])
    setInput("")
    setShowRightSidebar(false)
  }

  const loadConversation = (conversationId: string) => {
    const conv = conversations.find((c) => c.id === conversationId)
    if (conv) {
      setCurrentConversationId(conversationId)
      setMessages(conv.messages || [])
      setInput("")
      setShowRightSidebar(false)
    }
  }

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(t("confirm_delete"))) return

    const updated = conversations.filter((c) => c.id !== conversationId)
    setConversations(updated)
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null)
      setMessages([])
    }
  }

  const handleSend = async (messageToSend?: string) => {
    const textToSend = messageToSend || input
    if (!textToSend.trim() || loading) return

    const totalCredits = profileData.monthlyCredits + profileData.purchasedCredits
    if (totalCredits < 2) {
      alert(`${t("not_enough_credits")}. ${t("need_at_least_two_credits")}`)
      return
    }

    let conversationId = currentConversationId
    let currentConversations = conversations

    if (!conversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: textToSend.substring(0, 50) + "...",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: [],
      }
      currentConversations = [newConversation, ...conversations]
      setConversations(currentConversations)
      conversationId = newConversation.id
      setCurrentConversationId(conversationId)
    }

    const userMessage = { role: "user", content: textToSend }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    await saveConversation(conversationId, newMessages)

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
      await saveConversation(conversationId, updatedMessages)

      setProfileData((prev) => ({
        ...prev,
        monthlyCredits: data.remainingMonthlyCredits,
        purchasedCredits: data.remainingPurchasedCredits,
      }))
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: t("error_encountered") }])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-right-sidebar")
      const menuButton = document.getElementById("menu-button")
      if (
        showRightSidebar &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        !menuButton?.contains(event.target as Node)
      ) {
        setShowRightSidebar(false)
      }
    }

    if (showRightSidebar) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showRightSidebar])

  const hasAccessToAI = profileData.tier === "pro" || profileData.tier === "premium" || profileData.purchasedCredits > 0

  console.log("[v0] Final check - Tier:", profileData.tier, "Has Access:", hasAccessToAI)

  if (!hasAccessToAI) {
    return (
      <div className="p-4 md:p-8">
        <UpgradeModal
          feature={t("ai_assistant")}
          requiredPlan={profileData.purchasedCredits > 0 ? "free" : "premium"}
          customMessage={profileData.purchasedCredits > 0 ? t("buy_more_credits_ai") : undefined}
        />
      </div>
    )
  }

  const monthlyCredits = profileData.monthlyCredits
  const purchasedCredits = profileData.purchasedCredits

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-secondary/20 border-r border-border/50 flex-col p-4 gap-4 overflow-hidden">
        <Button onClick={createNewConversation} className="w-full neon-glow-hover">
          <Plus className="w-4 h-4 mr-2" />
          {t("new_conversation")}
        </Button>

        <div className="flex-1 overflow-y-auto space-y-2 border-t border-border/50 pt-4">
          {conversations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t("no_conversations")}</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors text-sm flex items-center justify-between group overflow-hidden ${
                  currentConversationId === conv.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50"
                }`}
              >
                <span className="truncate flex-1">{conv.title}</span>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 gap-2 md:gap-4 p-2 md:p-6">
        {/* Header with title and credits */}
        <div className="flex items-center justify-between gap-2 md:gap-4 mb-4 md:mb-6">
          <h1 className="text-xl md:text-3xl font-bold truncate">{t("ai_assistant") || "IA"}</h1>

          <div className="flex gap-1 md:gap-2 shrink-0">
            {monthlyCredits > 0 && (
              <Card className="glass-card px-1.5 md:px-3 py-1 md:py-2 neon-glow">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  <span className="text-xs md:text-sm font-semibold">{monthlyCredits}</span>
                </div>
              </Card>
            )}
            {purchasedCredits > 0 && (
              <Card className="glass-card px-1.5 md:px-3 py-1 md:py-2 neon-glow">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                  <span className="text-xs md:text-sm font-semibold">{purchasedCredits}</span>
                </div>
              </Card>
            )}
            <Button
              id="menu-button"
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="md:hidden shrink-0"
              size="sm"
            >
              {showRightSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 md:space-y-8 px-2 md:px-4">
            <div className="text-center space-y-2 md:space-y-4">
              <h2 className="text-2xl md:text-5xl font-bold">{t("welcome_message")}</h2>
            </div>

            {/* Input and prompts */}
            <div className="w-full max-w-2xl space-y-2 md:space-y-4">
              <div className="flex gap-1 md:gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t("input_placeholder")}
                  className="bg-secondary/50 text-xs md:text-sm"
                  disabled={loading}
                  autoFocus
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="neon-glow-hover shrink-0"
                >
                  <Send className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>

              {input.trim() === "" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(prompt)}
                      className="p-2 md:p-3 rounded-lg border border-border/50 hover:border-primary bg-secondary/20 hover:bg-secondary/40 transition-all text-xs text-left hover:shadow-lg"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                {t("total_available")}: {monthlyCredits + purchasedCredits} {t("credits")}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mb-2 md:mb-4 space-y-2 md:space-y-4 px-2 md:px-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[90%] md:max-w-[70%] p-2 md:p-4 rounded-lg text-xs md:text-sm ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/50"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-secondary/50 p-2 md:p-4 rounded-lg">
                    <div className="flex gap-1 md:gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-1 md:gap-2 px-2 md:px-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("input_placeholder")}
                className="bg-secondary/50 text-xs md:text-sm"
                disabled={loading}
              />
              <Button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="neon-glow-hover shrink-0"
              >
                <Send className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Right Sidebar */}
      {showRightSidebar && (
        <div
          id="mobile-right-sidebar"
          className="fixed md:hidden right-0 top-16 bottom-0 w-64 bg-background border-l border-border/50 p-4 flex flex-col z-50 shadow-lg overflow-hidden"
        >
          <Button onClick={createNewConversation} className="w-full neon-glow-hover">
            <Plus className="w-4 h-4 mr-2" />
            {t("new_conversation")}
          </Button>

          <div className="flex-1 overflow-y-auto space-y-2 border-t border-border/50 pt-4">
            {conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t("no_conversations")}</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    loadConversation(conv.id)
                    setShowRightSidebar(false)
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors text-sm flex items-center justify-between group overflow-hidden ${
                    currentConversationId === conv.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50"
                  }`}
                >
                  <span className="truncate flex-1">{conv.title}</span>
                  <button
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AIPage
