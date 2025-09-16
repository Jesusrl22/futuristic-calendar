"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, Bot, User, Zap, Brain, MessageSquare } from "lucide-react"
import type { User as UserType } from "@/lib/database"

interface AIAssistantProps {
  onAIRequest: (request: string) => Promise<{
    response: string
    tasks: any[]
    wishlistItems: any[]
    notes: any[]
  }>
  theme: {
    cardBg: string
    border: string
    textPrimary: string
    textSecondary: string
    textMuted: string
    buttonPrimary: string
    buttonSecondary: string
    inputBg: string
  }
  t: (key: string) => string
  user: UserType
}

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export function AiAssistant({ onAIRequest, theme, t, user }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: `¡Hola ${user.name}! Soy tu asistente de IA personal. Puedo ayudarte con tareas, objetivos, notas y mucho más. ¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await onAIRequest(input)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.",
        timestamp: new Date(),
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

  const suggestedPrompts = [
    "Crea una lista de tareas para hoy",
    "Ayúdame a organizar mi semana",
    "Sugiere objetivos para este mes",
    "Crea una nota sobre productividad",
    "¿Cómo puedo mejorar mi rutina?",
    "Planifica mi día de trabajo",
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} flex items-center gap-2`}>
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            Asistente IA Personal
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Zap className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          </CardTitle>
          <CardDescription className={theme.textSecondary}>
            Tu asistente inteligente para productividad y organización personal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Brain className="h-8 w-8 text-purple-400" />
              <div>
                <div className="font-medium text-purple-400">IA Avanzada</div>
                <div className="text-sm text-slate-400">Respuestas inteligentes</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <MessageSquare className="h-8 w-8 text-blue-400" />
              <div>
                <div className="font-medium text-blue-400">Chat Contextual</div>
                <div className="text-sm text-slate-400">Conversación natural</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <Zap className="h-8 w-8 text-green-400" />
              <div>
                <div className="font-medium text-green-400">Créditos: {user.ai_credits || 0}</div>
                <div className="text-sm text-slate-400">Usados: {user.ai_credits_used || 0}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user" ? "bg-purple-600" : "bg-gradient-to-r from-purple-600 to-pink-600"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-800 border border-slate-700 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                      <span className="text-sm text-slate-300">Pensando...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex gap-3">
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
          </div>
        </CardContent>
      </Card>

      {/* Suggested Prompts */}
      <Card className={`${theme.cardBg} ${theme.border}`}>
        <CardHeader>
          <CardTitle className={`${theme.textPrimary} text-lg`}>Sugerencias</CardTitle>
          <CardDescription className={theme.textSecondary}>Prueba estas preguntas para comenzar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => setInput(prompt)}
                className="justify-start text-left h-auto p-3 border-slate-600 text-slate-300 hover:bg-slate-700"
                disabled={isLoading}
              >
                <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                {prompt}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
