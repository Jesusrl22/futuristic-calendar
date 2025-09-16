"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Send, Bot, Zap } from "lucide-react"
import { AiCreditsDisplay } from "@/components/ai-credits-display"
import type { User as UserType } from "@/lib/database"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: string
}

interface AiAssistantProps {
  onAIRequest: (request: string) => Promise<{
    response: string
    tasks: any[]
    wishlistItems: any[]
    notes: any[]
  }>
  theme: any
  t: (key: string) => string
  user: UserType
}

export function AiAssistant({ onAIRequest, theme, t, user }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "¡Hola! Soy tu asistente IA. Puedo ayudarte a crear tareas, organizar tu lista de deseos, tomar notas y mucho más. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await onAIRequest(input.trim())

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.response,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error with AI request:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!user.is_pro) {
    return (
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
            <Sparkles className="h-5 w-5 text-purple-400" />
            Asistente IA
          </CardTitle>
          <CardDescription className={theme.textSecondary}>
            Funcionalidad disponible solo para usuarios Pro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4 opacity-50" />
            <p className={theme.textSecondary}>Actualiza a Pro para acceder al asistente IA y funciones avanzadas</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Credits Display */}
      <AiCreditsDisplay user={user} theme={theme} />

      {/* Chat Interface */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
            <Sparkles className="h-5 w-5 text-purple-400" />
            Asistente IA
          </CardTitle>
          <CardDescription className={theme.textSecondary}>
            Tu asistente personal para productividad y organización
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${message.type === "user" ? "bg-purple-600" : "bg-gradient-to-r from-purple-600 to-pink-600"}
                `}
                >
                  {message.type === "user" ? (
                    <Bot className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`
                  flex-1 max-w-[80%] p-3 rounded-lg
                  ${message.type === "user" ? "bg-purple-600 text-white ml-auto" : "bg-slate-800 text-slate-100"}
                `}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`
                    text-xs mt-2 opacity-70
                    ${message.type === "user" ? "text-purple-100" : "text-slate-400"}
                  `}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 max-w-[80%] p-3 rounded-lg bg-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                    <span className="text-slate-300 text-sm">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className={`${theme.inputBg} flex-1`}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Ayúdame a crear una lista de tareas para hoy")}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Crear tareas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Sugiere metas para mi lista de deseos")}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Sugerir metas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Ayúdame a organizar mi día")}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Organizar día
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
