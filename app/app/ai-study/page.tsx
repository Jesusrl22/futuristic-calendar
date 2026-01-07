"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Plus, Trash2, Menu, X, Upload } from "@/components/icons"
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
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        console.error("[v0] Error loading conversations:", error)
      }
    }

    loadConversations()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    setError("")
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    const inputText = input
    setInput("")
    setLoading(true)

    try {
      let conversationId = currentConversationId

      if (!conversationId) {
        conversationId = `study-${Date.now()}`
        setCurrentConversationId(conversationId)
      }

      console.log("[v0] Sending message to Study AI:", inputText.substring(0, 50) + "...")

      const response = await fetch("/api/ai-chat-study", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Study AI error response:", errorData)
        setError(errorData.message || t("error_sending_message"))
        setMessages((prev) => prev.slice(0, -1))
        return
      }

      const data = await response.json()

      console.log("[v0] Study AI response received:", data)

      const assistantMessage = data.response || data.message || "Unable to generate response"

      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }])

      // Save conversation to database
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          await fetch("/api/ai-conversations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              conversationId,
              title: inputText.substring(0, 50),
              messages: [...messages, userMessage, { role: "assistant", content: assistantMessage }],
            }),
          })
        }
      } catch (saveError) {
        console.error("[v0] Error saving conversation:", saveError)
      }
    } catch (error) {
      console.error("[v0] Error in handleSendMessage:", error)
      setError(t("error_sending_message"))
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file")
      return
    }

    setError("")
    setLoading(true)

    try {
      // For now, send a message to analyze the PDF
      const fileName = file.name
      const prompt = `I've uploaded a PDF file: "${fileName}". Can you help me understand its content? (Note: Full PDF processing will be available soon)`

      setInput("")
      const userMessage = { role: "user", content: `📄 Analyzing PDF: ${fileName}` }
      setMessages((prev) => [...prev, userMessage])

      const response = await fetch("/api/ai-chat-study", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to process PDF")
      }

      const assistantMessage = {
        role: "assistant",
        content: data.response || data.message,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Error processing PDF:", error)
      setError(error instanceof Error ? error.message : "Error processing PDF")
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleNewConversation = () => {
    setMessages([])
    setCurrentConversationId(null)
    setInput("")
    setError("")
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
    setError("")
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

        {/* Error Message */}
        {error && (
          <div className="mx-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border/50 p-4 space-y-2">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !loading && handleSendMessage()}
              placeholder={t("ask_something") || "Ask something..."}
              disabled={loading}
              className="flex-1 bg-background/50"
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={loading} size="icon" variant="outline">
              <Upload className="w-4 h-4" />
            </Button>
            <Button onClick={handleSendMessage} disabled={loading} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
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
