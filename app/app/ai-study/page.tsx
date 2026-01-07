"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Plus, Trash2, Menu, X } from "@/components/icons"
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

const AIStudyPage = () => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const SUGGESTED_PROMPTS = [
    t("explain_concept") || "Explain this concept",
    t("create_study_plan") || "Create a study plan",
    t("quiz_me") || "Quiz me on this topic",
  ]

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.user) {
          return
        }

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
        console.error("Error loading conversations:", error)
      }
    }

    loadConversations()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      let conversationId = currentConversationId

      if (!conversationId) {
        conversationId = `study-${Date.now()}`
        setCurrentConversationId(conversationId)
      }

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          conversationId,
          isStudyMode: true,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage = { role: "assistant", content: data.message }
        setMessages((prev) => [...prev, assistantMessage])

        if (!conversations.find((c) => c.id === conversationId)) {
          const newConversation: Conversation = {
            id: conversationId,
            title: input.substring(0, 50),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            messages: [userMessage, assistantMessage],
          }
          setConversations((prev) => [newConversation, ...prev])
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: t("error_sending_message") || "Error sending message",
          },
        ])
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("error_sending_message") || "Error sending message",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleNewConversation = () => {
    setMessages([])
    setCurrentConversationId(null)
    setInput("")
  }

  const handleDeleteConversation = async (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (currentConversationId === id) {
      handleNewConversation()
    }
  }

  const loadConversation = (conversation: Conversation) => {
    setMessages(conversation.messages)
    setCurrentConversationId(conversation.id)
  }

  return (
    <div className="flex h-full w-full">
      {/* Desktop Left Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="p-4 border-b border-border/50">
          <Button onClick={handleNewConversation} className="w-full gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            {t("new_conversation") || "New Conversation"}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-3 border-b border-border/20 cursor-pointer transition-colors ${
                currentConversationId === conv.id ? "bg-primary/10" : "hover:bg-secondary/30"
              }`}
              onClick={() => loadConversation(conv)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conv.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(conv.created_at).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteConversation(conv.id)
                  }}
                  className="p-1 hover:bg-destructive/10 rounded"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border/50">
          <h1 className="text-lg font-semibold">{t("study_ai") || "Study AI"}</h1>
          <button onClick={() => setShowRightSidebar(!showRightSidebar)} className="p-2 hover:bg-secondary/50 rounded">
            {showRightSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Chat Area */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold">{t("free_study_assistant") || "Free Study Assistant"}</h2>
              <p className="text-muted-foreground">
                {t("study_ai_description") || "Get help with your studies, no plan required"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 text-left whitespace-normal hover:bg-primary/10 bg-transparent"
                  onClick={() => {
                    setInput(prompt)
                  }}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-md md:max-w-2xl p-3 rounded-lg ${
                    message.role === "user" ? "bg-primary/20 text-foreground" : "bg-secondary/50 text-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border/50 p-4 space-y-2">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={t("ask_something") || "Ask something..."}
              disabled={loading}
              className="flex-1 bg-background/50"
            />
            <Button onClick={handleSendMessage} disabled={loading} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {t("free_study_ai_note") || "This is a free study assistant. For advanced features, upgrade your plan."}
          </p>
        </div>
      </div>

      {/* Mobile Right Sidebar */}
      {showRightSidebar && (
        <div className="md:hidden w-64 flex flex-col border-l border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="p-4 border-b border-border/50">
            <Button onClick={handleNewConversation} className="w-full gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              {t("new_conversation") || "New Conversation"}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-3 border-b border-border/20 cursor-pointer transition-colors ${
                  currentConversationId === conv.id ? "bg-primary/10" : "hover:bg-secondary/30"
                }`}
                onClick={() => {
                  loadConversation(conv)
                  setShowRightSidebar(false)
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(conv.created_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteConversation(conv.id)
                    }}
                    className="p-1 hover:bg-destructive/10 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AIStudyPage
